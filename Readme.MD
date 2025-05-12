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


