### Portainer
https://hub.docker.com/r/portainer/portainer-ce
https://documentation.portainer.io/v2.0/deploy/ceinstalldocker/
https://renatogroffe.medium.com/docker-portainer-gerenciando-containers-a-partir-de-um-browser-87af6ce74be3


```console
# Docker Pull Command
docker pull portainer/portainer-ce

# Portainer Server Deployment
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```
Teste acessando http://localhost:9000  or http://raspberrypi-1:9000/
