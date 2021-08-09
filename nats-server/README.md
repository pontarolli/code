## <img src="logos/nats-server.png" width="300">

[NATS](https://nats.io) is a simple, secure and performant communications system for digital systems, services and devices. NATS is part of the Cloud Native Computing Foundation ([CNCF](https://cncf.io)). NATS has over [30 client language implementations](https://nats.io/download/), and its server can run on-premise, in the cloud, at the edge, and even on a Raspberry Pi. NATS can secure and simplify design and operation of modern distributed systems.

## Documentation

* [Official documentation](https://nats-io.github.io/docs)
* [FAQ](https://nats-io.github.io/docs/faq)
* Watch [a video overview of NATS](https://www.youtube.com/watch?v=sm63oAVPqAM) to learn more about its origin story and design philosophy.

## Description
This repository demonstrates how to install and run the nats server, as well as running it in the background and when the system is restarted, in addition to giving an authentication option.

## Installing and running NATS Server

**Website**: https://nats.io

**Download**: https://nats.io/download/nats-io/nats-server

1.  Find out what architecture your machine is using.
    The specific version for this architecture is downloaded.
   
Example 1 Raspberry Pi 3 B+ with Raspbian
```
$ dpkg --print-architecture
armhf
$ cat /proc/cpuinfo
model name      : ARMv7 Processor rev 4 (v7l)
$ wget https://github.com/nats-io/nats-server/releases/download/v2.1.7/nats-server-v2.1.7-linux-arm7.zip
```

Example 2 Instance AWS EC2 with Ubuntu
```
$ dpkg --print-architecture
amd64
$ wget https://github.com/nats-io/nats-server/releases/download/v2.1.7/nats-server-v2.1.7-linux-amd64.zip
```

2.  Unzips the downloaded file.
```
$ sudo apt-get install -y unzip
$ unzip nats-server-v2.1.7-linux-amd64.zip
```

3.  Navigate to the folder and run the server. The NATS server is in this stage running and listening on port 4222.
```
$ cd nats-server-v2.1.7-linux-amd64
$ ./nats-server
[25809] 2020/08/26 15:51:27.355998 [INF] Starting nats-server version 2.1.7
[25809] 2020/08/26 15:51:27.356117 [INF] Git commit [bf0930e]
[25809] 2020/08/26 15:51:27.356312 [INF] Listening for client connections on 0.0.0.0:4222
[25809] 2020/08/26 15:51:27.356391 [INF] Server id is ND75AFOI36ZQCJZJNF6MMLUAE4FMSBS65GZDZO6OWCVHJMLFVFGGG3V6
[25809] 2020/08/26 15:51:27.356442 [INF] Server is ready
```

Note: leave port 4222 on your server open if you are using it for remote access

## PM2 Process Manager

**Website**: https://pm2.keymetrics.io

With the PM2 manager, the application is left daemonized (in background) and the application is started when the system is restarted.


1.  The pm2 process manager is installed globally.
```
$ sudo npm i pm2 -g
```

2.  Navigate to the nats folder and start the nats server giving the name nats-server
```
$ cd nats-server-v2.1.7-linux-amd64
$ sudo pm2 start "./nats-server" --name nats-server
[PM2] Starting /bin/bash in fork_mode (1 instance)
[PM2] Done.
┌─────┬────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name           │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ nats-server    │ default     │ N/A     │ fork    │ 25450    │ 0s     │ 0    │ online    │ 0%       │ 7.4mb    │ root     │ disabled │
└─────┴────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

3.  An automatic startup script is started, a code is automatically generated `sudo env ...`, it is copied and pasted on the console, after that save it.
```
$ pm2 startup systemd
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
$ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
$ sudo pm2 save
[PM2] Saving current process list...
[PM2] Successfully saved in /home/ubuntu/.pm2/dump.pm2
```

## Connecting a client to NATS Server
Authentication is required when connecting to the NATS.

**Application**

1.  The application is configured with a username and password to connect to NATS. In this case, the Moleculer framework was used.
```js
// moleculer.config.js
transporter: {
    type: "NATS",
    options: {
        url: "nats://localhost:4222", //NATS server address
        user: "admin",
        pass: "1234",
    }
},
```

**NATS Server**

2.  In the folder where NATS is located, a configuration file is created.

**Documentation**: https://docs.nats.io/nats-server/configuration/securing_nats/auth_intro/username_password
```
$ cd nats-server-v2.1.7-linux-amd64
$ sudo nano nats-server.conf
```

File nats-server.conf
```
authorization: {
    users: [
        {user: admin, password: "1234"},
        {user: a, password: b},
        {user: b, password: a},
    ]
}
```

or

You can encrypt the password if desired, using a nats tool called mkpasswd.

**Documentation**: https://docs.nats.io/nats-tools/mkpasswd

After installation, navigate to the folder where the installation was made and start the mkpasswd.go
````
$ cd go/src/github.com/nats-io/nats-server/util/mkpasswd
$ sudo go run mkpasswd.go -p
Enter Password: 1234
Reenter Password: 1234
bcrypt hash: $2a$11$7lWUScD1smGd1IbKn2sqwO7tggRy6LYK.y2euAyqUn08ymgksseXq
````

Modify the server configuration file with the encrypted password.

File nats-server.conf
```
authorization: {
    users: [
        {user: admin, password: "$2a$11$7lWUScD1smGd1IbKn2sqwO7tggRy6LYK.y2euAyqUn08ymgksseXq"},
        {user: a, password: b},
        {user: b, password: a},
    ]
}
```

Note: Password 1234 remains the same in your application, so there is no need to change it.

3.  Start the server with pm2 passing the configuration file as parameter
```
$ sudo pm2 start "./nats-server -c nats-server.conf" --name nats-server
[PM2] Starting /bin/bash in fork_mode (1 instance)
[PM2] Done.
┌─────┬────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name           │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ nats-server    │ default     │ N/A     │ fork    │ 25450    │ 0s     │ 0    │ online    │ 0%       │ 7.4mb    │ root     │ disabled │
└─────┴────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

nats-server -c ./conf/nats-server.conf