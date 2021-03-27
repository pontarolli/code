# Raspberry-Errors

## 1 Error: sudo apt update

**Solutions**

**1. DNS**

```
$ sudo nano /etc/resolv.conf
```

nameserver 8.8.8.8

nameserver 8.8.4.4

```
$ nano /etc/dhcpcd.conf
```

interface wlan0

static ip_address=192.168.137.222

static routers=192.168.137.1

static domain_name_servers=8.8.8.8 8.8.4.4

**2. Upgrade Date and Hour**

```
$ sudo cp /usr/share/zoneinfo/right/America/Sao_Paulo /boot/LOCALTIME 
$ sudo date --s "03 sep 2020 10:28:00"
```
