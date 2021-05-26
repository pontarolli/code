# Docker

### Install Docker
https://docs.docker.com/get-docker/

```console
# Install using the convenience script
curl -fsSL get.docker.com -o get-docker.sh
sh get-docker.sh
# Add your user to the Docker group 
sudo usermod -aG docker ${USER}
sudo su - ${USER}
# Test 
docker version
```

### Install Docker Compose
```console
sudo apt-get install libffi-dev libssl-dev
sudo apt install python3-dev
sudo apt-get install -y python3 python3-pip
sudo pip3 install docker-compose
```