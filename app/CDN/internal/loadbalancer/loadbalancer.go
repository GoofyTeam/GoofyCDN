package loadbalancer

import (
	"context"
	"errors"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

// Backend représente un serveur backend avec ses propriétés
type Backend struct {
	URL           string    // URL du serveur backend
	Weight        int       // Poids pour l'algorithme weighted round-robin
	CurrentWeight int       // Poids actuel (utilisé dans l'algorithme weighted round-robin)
	Connections   int32     // Nombre de connexions actives
	IsAlive      bool      // État de santé du backend
	LastCheck    time.Time // Dernière vérification de santé
	FailCount    int       // Nombre d'échecs consécutifs
	mu           sync.RWMutex
}

// LoadBalancerMetrics contient les métriques de performance
type LoadBalancerMetrics struct {
	TotalRequests    uint64
	FailedRequests   uint64
	ActiveBackends   int32
	AverageLatency   float64
	RequestsPerBackend map[string]*uint64
}

// LoadBalancer définit l'interface commune pour toutes les stratégies
type LoadBalancer interface {
	// NextBackend retourne le prochain backend à utiliser
	NextBackend(ctx context.Context) (*Backend, error)
	
	// HealthCheck vérifie l'état de santé des backends
	HealthCheck(ctx context.Context) error
	
	// GetMetrics retourne les métriques du load balancer
	GetMetrics() *LoadBalancerMetrics
}

// Configuration commune pour tous les load balancers
type Config struct {
	HealthCheckInterval time.Duration
	HealthCheckTimeout  time.Duration
	MaxFailCount       int
	RetryTimeout       time.Duration
}

// Erreurs communes du load balancer
var (
	ErrNoAvailableBackends = errors.New("aucun backend disponible")
)

// RoundRobin implémente la stratégie de répartition cyclique
type RoundRobin struct {
	backends []*Backend
	current  uint32
	config   Config
	metrics  LoadBalancerMetrics
	client   *http.Client
	mu       sync.RWMutex
}

// NewRoundRobin crée une nouvelle instance de RoundRobin
func NewRoundRobin(urls []string, config Config) *RoundRobin {
	backends := make([]*Backend, len(urls))
	for i, url := range urls {
		backends[i] = &Backend{
			URL:      url,
			IsAlive:  true,
			FailCount: 0,
		}
	}

	lb := &RoundRobin{
		backends: backends,
		config:   config,
		metrics: LoadBalancerMetrics{
			RequestsPerBackend: make(map[string]*uint64),
			ActiveBackends:    int32(len(urls)), // Initialisation du nombre de backends actifs
		},
		client: &http.Client{
			Timeout: config.HealthCheckTimeout,
		},
	}

	// Démarrage des health checks périodiques
	go lb.healthCheckLoop()

	return lb
}

func (r *RoundRobin) healthCheckLoop() {
	ticker := time.NewTicker(r.config.HealthCheckInterval)
	for range ticker.C {
		r.HealthCheck(context.Background())
	}
}

func (r *RoundRobin) HealthCheck(ctx context.Context) error {
	var wg sync.WaitGroup
	for _, backend := range r.backends {
		wg.Add(1)
		go func(b *Backend) {
			defer wg.Done()
			r.checkBackendHealth(ctx, b)
		}(backend)
	}
	wg.Wait()
	return nil
}

func (r *RoundRobin) checkBackendHealth(ctx context.Context, backend *Backend) {
	backend.mu.Lock()
	defer backend.mu.Unlock()

	wasAlive := backend.IsAlive // Sauvegarde de l'état précédent

	req, err := http.NewRequestWithContext(ctx, "GET", backend.URL+"/health", nil)
	if err != nil {
		backend.FailCount++
		if backend.FailCount >= r.config.MaxFailCount && backend.IsAlive {
			backend.IsAlive = false
			atomic.AddInt32(&r.metrics.ActiveBackends, -1)
		}
		return
	}

	start := time.Now()
	resp, err := r.client.Do(req)
	latency := time.Since(start)

	if err != nil || resp.StatusCode != http.StatusOK {
		backend.FailCount++
		if backend.FailCount >= r.config.MaxFailCount && backend.IsAlive {
			backend.IsAlive = false
			atomic.AddInt32(&r.metrics.ActiveBackends, -1)
		}
		return
	}

	if resp != nil {
		resp.Body.Close()
	}

	backend.FailCount = 0
	if !wasAlive {
		backend.IsAlive = true
		atomic.AddInt32(&r.metrics.ActiveBackends, 1)
	}

	backend.LastCheck = time.Now()

	// Mise à jour de la latence moyenne
	r.mu.Lock()
	r.metrics.AverageLatency = (r.metrics.AverageLatency + float64(latency.Milliseconds())) / 2
	r.mu.Unlock()
}

func (r *RoundRobin) NextBackend(ctx context.Context) (*Backend, error) {
	atomic.AddUint64(&r.metrics.TotalRequests, 1)

	r.mu.RLock()
	defer r.mu.RUnlock()

	start := atomic.LoadUint32(&r.current)
	next := start
	maxTries := len(r.backends)

	for i := 0; i < maxTries; i++ {
		next = (next + 1) % uint32(len(r.backends))
		backend := r.backends[next]

		backend.mu.RLock()
		isAlive := backend.IsAlive
		backend.mu.RUnlock()

		if isAlive {
			atomic.StoreUint32(&r.current, next)
			if _, ok := r.metrics.RequestsPerBackend[backend.URL]; !ok {
				r.metrics.RequestsPerBackend[backend.URL] = new(uint64)
			}
			atomic.AddUint64(r.metrics.RequestsPerBackend[backend.URL], 1)
			return backend, nil
		}
	}

	atomic.AddUint64(&r.metrics.FailedRequests, 1)
	return nil, ErrNoAvailableBackends
}

func (r *RoundRobin) GetMetrics() *LoadBalancerMetrics {
	r.mu.RLock()
	defer r.mu.RUnlock()

	metrics := &LoadBalancerMetrics{
		TotalRequests:      atomic.LoadUint64(&r.metrics.TotalRequests),
		FailedRequests:     atomic.LoadUint64(&r.metrics.FailedRequests),
		ActiveBackends:     atomic.LoadInt32(&r.metrics.ActiveBackends),
		AverageLatency:     r.metrics.AverageLatency,
		RequestsPerBackend: make(map[string]*uint64),
	}

	for k, v := range r.metrics.RequestsPerBackend {
		metrics.RequestsPerBackend[k] = new(uint64)
		*metrics.RequestsPerBackend[k] = atomic.LoadUint64(v)
	}

	return metrics
}

// WeightedRoundRobin hérite des fonctionnalités de base de RoundRobin
type WeightedRoundRobin struct {
	*RoundRobin
}

func NewWeightedRoundRobin(urls []string, weights []int, config Config) *WeightedRoundRobin {
	rr := NewRoundRobin(urls, config)
	for i, weight := range weights {
		rr.backends[i].Weight = weight
		rr.backends[i].CurrentWeight = weight
	}
	return &WeightedRoundRobin{RoundRobin: rr}
}

func (w *WeightedRoundRobin) NextBackend(ctx context.Context) (*Backend, error) {
	atomic.AddUint64(&w.metrics.TotalRequests, 1)

	w.mu.Lock()
	defer w.mu.Unlock()

	var best *Backend
	var totalWeight int

	for _, b := range w.backends {
		b.mu.RLock()
		isAlive := b.IsAlive
		b.mu.RUnlock()

		if !isAlive {
			continue
		}

		b.CurrentWeight += b.Weight
		totalWeight += b.Weight
		if best == nil || b.CurrentWeight > best.CurrentWeight {
			best = b
		}
	}

	if best == nil {
		atomic.AddUint64(&w.metrics.FailedRequests, 1)
		return nil, ErrNoAvailableBackends
	}

	best.CurrentWeight -= totalWeight
	if _, ok := w.metrics.RequestsPerBackend[best.URL]; !ok {
		w.metrics.RequestsPerBackend[best.URL] = new(uint64)
	}
	atomic.AddUint64(w.metrics.RequestsPerBackend[best.URL], 1)
	return best, nil
}

// LeastConnections hérite également des fonctionnalités de base
type LeastConnections struct {
	*RoundRobin
}

func NewLeastConnections(urls []string, config Config) *LeastConnections {
	return &LeastConnections{RoundRobin: NewRoundRobin(urls, config)}
}

func (l *LeastConnections) NextBackend(ctx context.Context) (*Backend, error) {
	atomic.AddUint64(&l.metrics.TotalRequests, 1)

	l.mu.RLock()
	defer l.mu.RUnlock()

	var best *Backend
	var minConn int32 = -1

	for _, b := range l.backends {
		b.mu.RLock()
		isAlive := b.IsAlive
		connections := atomic.LoadInt32(&b.Connections)
		b.mu.RUnlock()

		if !isAlive {
			continue
		}

		if minConn == -1 || connections < minConn {
			minConn = connections
			best = b
		}
	}

	if best == nil {
		atomic.AddUint64(&l.metrics.FailedRequests, 1)
		return nil, ErrNoAvailableBackends
	}

	atomic.AddInt32(&best.Connections, 1)
	if _, ok := l.metrics.RequestsPerBackend[best.URL]; !ok {
		l.metrics.RequestsPerBackend[best.URL] = new(uint64)
	}
	atomic.AddUint64(l.metrics.RequestsPerBackend[best.URL], 1)
	return best, nil
}
