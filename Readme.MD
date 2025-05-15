# Allow Kubernetes API server
sudo ufw allow 6443/tcp

# Allow etcd ports
sudo ufw allow 2379-2380/tcp

# Allow Calico BGP
sudo ufw allow 179/tcp

# Allow VXLAN
sudo ufw allow 4789/udp

# Allow IP-in-IP protocol
sudo ufw allow proto 4

# Apply rules
sudo ufw reload





sudo apt update
sudo apt install nfs-kernel-server -y

sudo mkdir -p /srv/nfs/mongodb
sudo mkdir -p /srv/nfs/backend-images

sudo chown nobody:nogroup /srv/nfs/mongodb
sudo chown nobody:nogroup /srv/nfs/backend-images

sudo chmod 777 /srv/nfs/mongodb
sudo chmod 777 /srv/nfs/backend-images

sudo nano /etc/exports

/srv/nfs/mongodb 192.168.10.0/24(rw,sync,no_subtree_check,no_root_squash)
/srv/nfs/backend-images 192.168.10.0/24(rw,sync,no_subtree_check,no_root_squash)

sudo exportfs -rav
sudo systemctl restart nfs-kernel-server
sudo ufw allow from 192.168.10.0/24 to any port nfs
sudo ufw allow 111/tcp
sudo ufw allow 111/udp
sudo ufw allow 2049/tcp
sudo ufw allow 2049/udp
sudo ufw allow 32765:32769/tcp
sudo ufw allow 32765:32769/udp

sudo apt install nfs-common -y
sudo mount -t nfs 192.168.10.143:/srv/nfs/mongodb /mnt


helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/

helm install nfs-provisioner nfs-subdir-external-provisioner/nfs-subdir-external-provisioner \
  --set nfs.server=192.168.10.143 \
  --set nfs.path=/srv/nfs \
  --set storageClass.name=nfs-client


kubectl get storageclass
kubectl get pod -w


helm uninstall nfs-provisioner


helm lint .
helm template --debug .
kubectl get storageclass


helm install my-app ./my-app
helm upgrade my-app ./my-app/
helm status my-app
kubectl get all

helm uninstall my-app

kubectl delete pods -l app=frontend
helm upgrade my-app ./my-app/ --recreate-pods
kubectl rollout restart deployment/frontend




kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.9/config/manifests/metallb-native.yaml

kubectl get pods -n metallb-system
kubectl get svc -n metallb-system

kubectl edit svc -n metallb-system
# Change the type from ClusterIP to NodePort (or LoadBalancer if using a cloud provider).




helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace


kubectl get pods -n ingress-nginx

kubectl get svc -n ingress-nginx

kubectl edit svc ingress-nginx-controller -n ingress-nginx

# Change the type from ClusterIP to NodePort (or LoadBalancer if using a cloud provider).

kubectl get svc frontend -o wide
kubectl describe ingress frontend-ingress


# argo cd

helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

kubectl create namespace argocd


helm install argocd argo/argo-cd \
  --namespace argocd \
  --set server.ingress.enabled=true \
  --set server.ingress.ingressClassName=nginx \
  --set server.ingress.hosts='{argocd.example.com}' \
  --set server.ingress.paths='{/}' \
  --set server.ingress.annotations."nginx\.ingress\.kubernetes\.io/ssl-redirect"="false" \
  --set server.extraArgs='{--insecure}'

# if you want to upgrade anything 

helm upgrade --install argocd argo/argo-cd \
  --namespace argocd \
  --set server.ingress.enabled=true \
  --set server.ingress.ingressClassName=nginx \
  --set server.ingress.hosts='{argocd.example.com}' \
  --set server.ingress.paths='{/}' \
  --set server.ingress.annotations."nginx\.ingress\.kubernetes\.io/ssl-redirect"="false" \
  --set server.extraArgs='{--insecure}'


kubectl get ingress -n argocd
kubectl get pods -o wide -n argocd
kubectl get svc -o wide -n argocd

kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d



# ArgoCD 


https://github.com/devopsjourney1/argo-examples


# Grafana

helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

kubectl get ingress -n grafana


helm upgrade --install grafana grafana/grafana \
  --namespace grafana \
  --create-namespace \
  --set service.type=LoadBalancer \
  --set adminPassword='admin' \
  --set ingress.enabled=true \
  --set ingress.hosts[0]=grafana.example.com \
  --set ingress.annotations."nginx\.ingress\.kubernetes\.io/ssl-redirect"='"false"' \
  --set ingress.paths[0]='/' \
  --set ingress.ingressClassName=nginx


kubectl get pods -n grafana
kubectl get ingress -n grafana
kubectl get svc -n grafana

kubectl get secret --namespace grafana grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo



helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring


# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.enabled=false 


kubectl --namespace monitoring get pods -l "release=prometheus"
kubectl --namespace monitoring get svc prometheus-kube-prometheus-prometheus


# Connect Grafana to Prometheus
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: grafana
data:
  prometheus.yaml: |-
    {
        "apiVersion": 1,
        "datasources": [{
            "access": "proxy",
            "editable": true,
            "name": "Prometheus",
            "orgId": 1,
            "type": "prometheus",
            "url": "http://prometheus-kube-prometheus-prometheus.monitoring:9090",
            "version": 1
        }]
    }
EOF


kubectl get configmap grafana-datasources -n grafana -o yaml

# set Prometheus data source URL : Set the URL to http://prometheus-kube-prometheus-prometheus.monitoring:9090.



Grafana Dashboard List: 15661, 741, 747, 19105

