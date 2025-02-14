# CDN Go - Projet de Content Delivery Network

## Membres :

- Brandon VO [**@Hiteazel**](https://github.com/Hiteazel)
- Teddy GAMIETTE [**@tedjy971**](https://github.com/tedjy971)
- Luca GROUSSET [**@lucag322**](https://github.com/lucag322)
- Antoine AZEVEDO DA SILVA [**@DestroyCom**](https://github.com/DestroyCom)

**CDN GO**  
**Back GO**  
**Front React** avec Vite, Tailwind, Shadcn UI, et TanStack Router

## Tests

On a des tests de fausses metrics pour vérifier si ils sont bien reçus dans le Grafana.
On a des tests dans le backend pour vérifier les performances et du CDN (run_load_tests.sh dans le k6 et wrk qui doit être installé sur le PC).

Vidéo de présentation : [Lien](https://youtu.be/H8DuJpxgSUk)
Vidéo de présentation AWS : [Lien](https://youtu.be/eYFL3Z_4ShI)

## 🚀 Fonctionnalités

Prise en charge de différents types de load balancing et cache au lancement de l'application.

- **Proxy HTTP** : Redirection intelligente des requêtes
- **Système de Cache** :,
  - Cache LRU en mémoire
  - Support Redis pour le cache distribué
- **Load Balancing** :
  - Round Robin
  - Weighted Round Robin
  - Least Connections
- **Sécurité** :
  - Rate Limiting
  - Protection DDoS
  - Headers de sécurité HTTP
- **Monitoring** :
  - Métriques Prometheus
  - Visualisation Grafana
  - Logging structuré avec Logrus

## 🛠 Prérequis

- Docker
- Docker Compose
- Go 1.23+ (pour le développement local)

## 🚦 Démarrage

1. **Mode Développement** :

```bash
docker compose -f .\docker-compose.dev.yml up -d
```

- Hot-reload activé
- Accessible sur http://localhost:8080
- Métriques sur http://localhost:8080/metrics

2. **Mode Production** :

```bash
docker compose -f .\docker-compose.prod.yml up -d
```

3. **Lancement du front** :

```bash
cd front
npm install
npm run dev
```

4. **Services additionnels** :

- Grafana : http://localhost:3000 (admin/admin)
- Prometheus : http://localhost:9090
- Redis : localhost:6379

## 🏗 Structure du Projet

```
app/
├── back/
│   └── internal/
│       ├── api/            # Endpoints API
│       ├── loadbalancer/   # Algorithmes de load balancing
│       └── middleware/     # Middlewares (sécurité, métriques)
|
├── CDN/
│   └── config/             # Configuration de l'application
│   └── internal/           # Implémentation du CDN
│   └── docs/               # Documentation de l'API
|   └── main.go             # Point d'entrée de l'application
|
└── front/
    └── public/             # Fichiers statiques
    └── src/
        ├── assets/         # Images, etc.
        ├── components/     # Composants React
        ├── hooks/          # Hooks personnalisés
        ├── libs/           # Fonctions utilitaires
        ├── pages/          # Pages de l'application
        └── routes/         # Routes de l'application par TanStack-Router

```

## 🔍 Fonctionnement Détaillé

### 1. Système de Cache

- **Cache LRU** (`internal/cache/cache.go`) :

  - Implémente l'interface `Cache`
  - Utilise `hashicorp/golang-lru` pour la gestion du cache en mémoire
  - Limite configurable de la taille du cache
  - Cache uniquement les requêtes GET
  - TTL configurable pour les entrées du cache

- **Endpoints de Gestion du Cache** :
  - `POST /cache/purge` : Vide complètement le cache
    ```bash
    # Exemple d'utilisation
    curl -X POST http://localhost:8080/cache/purge
    ```

### 2. Load Balancer

- **Implémentations** (`internal/loadbalancer/loadbalancer.go`) :
  - `RoundRobin` : Distribution cyclique des requêtes
  - `WeightedRoundRobin` : Distribution pondérée selon la capacité des serveurs
  - `LeastConnections` : Envoi vers le serveur le moins chargé

### 3. Endpoints API

#### Backend Service (port 8080)

- **Authentification** :

  - `POST /register` : Inscription d'un nouvel utilisateur
  - `POST /login` : Connexion utilisateur

- **Gestion des Fichiers** (requiert authentification) :

  - `POST /api/files` : Upload d'un fichier
  - `GET /api/files/:id` : Récupération d'un fichier
  - `DELETE /api/files/:id` : Suppression d'un fichier

- **Gestion des Dossiers** (requiert authentification) :

  - `POST /api/folders` : Création d'un dossier
  - `GET /api/folders/:id` : Liste du contenu d'un dossier
  - `DELETE /api/folders/:id` : Suppression d'un dossier

- **Health Check** :
  - `GET /health` : Vérification de l'état du service

#### CDN Service (port 8080)

- **Cache** :

  - `POST /cache/purge` : Vide le cache
  - Note : Seules les requêtes GET sont mises en cache

- **Monitoring** :
  - `GET /metrics` : Métriques Prometheus
  - `GET /health` : État du CDN
  - `GET /ready` : Vérification de disponibilité

### 4. Monitoring

- **Métriques** :

  - Temps de réponse des requêtes
  - Nombre de requêtes par endpoint
  - Taux de succès/erreur
  - Utilisation du cache

- **Visualisation dans Grafana** via Prometheus

### 5. Application Principale

Le fichier `main.go` orchestre tous ces composants :

1. Initialise le logger et le cache
2. Configure le load balancer
3. Met en place les middlewares de sécurité et monitoring
4. Démarre le serveur HTTP avec gestion gracieuse de l'arrêt

## 📊 Monitoring

### Métriques disponibles :

- `http_duration_seconds` : Temps de réponse des requêtes
- `http_requests_total` : Nombre total de requêtes par endpoint
- Visualisation dans Grafana via Prometheus

## 🔒 Sécurité

- Rate limiting : 100 requêtes/seconde par défaut
- Headers de sécurité :
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `X-XSS-Protection`
  - `Content-Security-Policy`
  - `Strict-Transport-Security`

## 🚀 Déploiement sur AWS EKS

### Prérequis AWS

- Un compte AWS avec les droits nécessaires
- AWS CLI configuré
- `eksctl` installé
- `kubectl` installé

### 1. Construction de l'Image Docker

```bash
# Construction de l'image
docker build -t misterzapp/goofy-cdn:latest -f docker/cdn/Dockerfile .

# Push vers Docker Hub
docker push misterzapp/goofy-cdn:latest
```

### 2. Déploiement sur EKS

#### Création du Cluster

```bash
# Création du cluster EKS
eksctl create cluster \
  --name hetic-groupe5 \
  --region eu-west-3 \
  --nodegroup-name goofy-cdn-workers \
  --node-type t3.small \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3
```

#### Déploiement de l'Application

```bash
# Déployer l'application
kubectl apply -f k8s

# Vérifier le déploiement
kubectl get pods
kubectl get services
```

### 3. Gestion des Ressources

#### Vérification des Ressources

```bash
# Lister les nœuds
kubectl get nodes

# Lister les pods
kubectl get pods --all-namespaces

# Voir les logs
kubectl logs -l app=goofy-cdn
```

#### Nettoyage des Ressources

```bash
# Supprimer le nodegroup
eksctl delete nodegroup --cluster hetic-groupe5 --name goofy-cdn-workers

# Supprimer le cluster complet (arrête toute facturation)
eksctl delete cluster --name hetic-groupe5
```

### 4. Coûts AWS à Surveiller

- Cluster EKS : ~$0.10 par heure
- Nœuds EC2 (t3.small) : ~$0.023 par heure par nœud
- Load Balancer : ~$0.025 par heure
- Volumes EBS et ENI : coûts variables selon l'utilisation

⚠️ **Important** : Pensez à supprimer toutes les ressources après utilisation pour éviter des coûts inutiles.

### 5. Troubleshooting Courant

#### Problèmes de CNI ( a voir car problème pour l'instant)

Si les pods restent en état "ContainerCreating" :

```bash
# Réinstaller le CNI Amazon VPC
kubectl apply -f https://raw.githubusercontent.com/aws/amazon-vpc-cni-k8s/v1.12.6/config/master/aws-k8s-cni.yaml

# Redémarrer les pods CNI
kubectl delete pods -n kube-system -l k8s-app=aws-node
```

### 6. Troubleshooting

#### Pod en CrashLoopBackOff ou Error

```bash
# Voir les logs du pod
kubectl logs -l app=goofy-cdn

# Voir les détails et événements du pod
kubectl describe pod -l app=goofy-cdn
```

#### Service inaccessible

1. Vérifier que le service est bien créé :

```bash
kubectl get services
```

2. Vérifier que le pod est Ready :

```bash
kubectl get pods -l app=goofy-cdn
```

3. Voir les endpoints :

```bash
kubectl get endpoints goofy-cdn-service
```

#### Problèmes d'image

Si l'image n'est pas trouvée, assurez-vous que :

1. L'image est bien construite localement : `docker images | grep goofy-cdn`
2. Le fichier deployment.yaml utilise le bon nom d'image : `image: goofy-cdn:local`
