## <img src="logos/mosquitto.png" width="300">

Eclipse Mosquitto is an open source (EPL/EDL licensed) message broker that implements the MQTT protocol versions 5.0, 3.1.1 and 3.1. Mosquitto is lightweight and is suitable for use on all devices from low power single board computers to full servers.

The MQTT protocol provides a lightweight method of carrying out messaging using a publish/subscribe model. This makes it suitable for Internet of Things messaging such as with low power sensors or mobile devices such as phones, embedded computers or microcontrollers.

The Mosquitto project also provides a C library for implementing MQTT clients, and the very popular mosquitto_pub and mosquitto_sub command line MQTT clients.

Mosquitto is part of the Eclipse Foundation, is an iot.eclipse.org project and is sponsored by cedalo.com.

## Documentation

* [Official documentation](https://mosquitto.org/documentation/)

## Description
This repository demonstrates how to install and run the mqtt server, as well as running it in the background and when the system is restarted.

## Installing and running MQTT Server
1. Install the mosquitto MQTT Broker
```
$ sudo apt install mosquitto -y
```

2. Enable the broker and allow it to auto-start after reboot
```
$ sudo systemctl enable mosquitto
$ sudo systemctl status mosquitto
● mosquitto.service - LSB: mosquitto MQTT v3.1 message broker
   Loaded: loaded (/etc/init.d/mosquitto; generated)
   Active: active (running) since Wed 2020-09-02 17:46:47 UTC; 12min ago
     Docs: man:systemd-sysv-generator(8)
    Tasks: 1 (limit: 1140)
   CGroup: /system.slice/mosquitto.service
           └─8233 /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf

Sep 02 17:46:47 ip-172-31-45-251 systemd[1]: Starting LSB: mosquitto MQTT v3.1 message broker...
Sep 02 17:46:47 ip-172-31-45-251 mosquitto[8219]:  * Starting network daemon: mosquitto
Sep 02 17:46:47 ip-172-31-45-251 mosquitto[8219]:    ...done.
Sep 02 17:46:47 ip-172-31-45-251 systemd[1]: Started LSB: mosquitto MQTT v3.1 message broker.
```

## Connecting a client to MQTT Server

In this case, the Moleculer framework was used.

1. Insall the mosquitto MQTT module in the service directory that will connect to the MQTT server
```
$ npm install mqtt --save
```

2. The service broker is configured
```
// moleculer.config.js
module.exports = {
    transporter: "mqtt://mqtt-server:1883", //"mqtt-server" is the public Ip or name of the server that is running mqtt-server
};
```
