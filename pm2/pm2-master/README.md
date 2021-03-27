```bash
# PM2 - Process manager
# https://pm2.keymetrics.io/

# Install
$ npm install pm2@latest -g

# Start scripts from package.json
$ sudo pm2 start "npm run start" --name moleculer-web
$ sudo pm2 start index.js --watch --name myAppName

# Managing process
$ pm2 restart myAppName
$ pm2 reload myAppName
$ pm2 stop myAppName
$ pm2 delete myAppName

# List managed applications
$ pm2 ls
┌────┬─────────────────────────┬─────────┬─────────┬──────────┬────────┬──────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                    │ version │ mode    │ pid      │ uptime │ ↺    │ status   │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────────┼─────────┼─────────┼──────────┼────────┼──────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ moleculer-web           │ N/A     │ fork    │ 1363     │ 17h    │ 0    │ online   │ 0%       │ 37.4mb   │ root     │ disabled │
│ 1  │ myAppName               │ 1.0.0   │ fork    │ 11464    │ 0s     │ 0    │ online   │ 0%       │ 25.0mb   │ root     │ enabled  │
└────┴─────────────────────────┴─────────┴─────────┴──────────┴────────┴──────┴──────────┴──────────┴──────────┴──────────┴──────────┘

# Startup Script Generator
$ pm2 startup systemd
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
$ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/p
$ pm2 save
```
