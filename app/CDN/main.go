package main

import (
	"app/internal/cache"
	"app/internal/loadbalancer"
	"app/internal/middleware"
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"golang.org/x/time/rate"
)

// main est la fonction principale qui initialise et démarre le serveur CDN
// Elle configure :
// - Le système de logging
// - Le cache en mémoire
// - Le load balancer
// - Les middlewares de sécurité et de monitoring
// - La gestion gracieuse de l'arrêt du serveur
func main() {
	// Configuration du logger avec format JSON et niveau INFO
	log := logrus.New()
	log.SetFormatter(&logrus.JSONFormatter{})
	log.SetLevel(logrus.InfoLevel)

	// Initialisation du cache en mémoire avec une capacité de 1000 entrées
	memCache, err := cache.NewMemoryCache(1000)
	if err != nil {
		log.Fatal(err)
	}

	// Configuration du Load Balancer en mode Weighted Round Robin
	// avec deux backends de même poids
	backends := []string{"http://backend1:8080", "http://backend2:8080"}
	weights := []int{1, 1}
	lb := loadbalancer.NewWeightedRoundRobin(backends, weights, loadbalancer.Config{
		HealthCheckInterval: time.Second,
		HealthCheckTimeout:  time.Second,
		MaxFailCount:       3,
		RetryTimeout:       time.Second,
	})

	// Configuration du Rate Limiter (100 requêtes par minute par IP)
	rateLimiter := middleware.NewRateLimiter(rate.Limit(100/60.0), 100)

	// Configuration du routeur HTTP
	mux := http.NewServeMux()
	
	// Endpoint de monitoring
	mux.Handle("/metrics", promhttp.Handler())

	// Health check endpoints
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("healthy"))
	})

	mux.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ready"))
	})

	// Route principale avec middleware de sécurité
	mainHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Vérification du cache
		if cachedResponse, found, err := memCache.Get(r.Context(), r.URL.Path); err == nil && found {
			w.Write(cachedResponse.Value.([]byte))
			return
		}

		// Sélection du backend
		backend, err := lb.NextBackend(r.Context())
		if err != nil {
			http.Error(w, "No backend available", http.StatusServiceUnavailable)
			return
		}
		
		// Proxy de la requête
		resp, err := http.Get(backend.URL + r.URL.Path)
		if err != nil {
			http.Error(w, "Backend error", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		// Mise en cache de la réponse
		// TODO: Implémenter la lecture du corps de la réponse et la mise en cache
	})

	// Application des middlewares
	handler := middleware.SecurityHeaders(rateLimiter.RateLimit(mainHandler))
	mux.Handle("/", handler)

	// Configuration du serveur
	srv := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Démarrage du serveur en arrière-plan
	go func() {
		log.Info("Starting server on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			// if err := srv.ListenAndServeTLS("cert.pem", "key.pem"); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Configuration de la gestion gracieuse de l'arrêt
	// Attend un signal SIGINT ou SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Info("Server stopped gracefully")
}
