# Microservice template

nano - Minimal project template for one microservice. Use it if you want to create a microservice which connect to others via transporter

$ sudo npm i -g moleculer-cli

$ moleculer init nano greeter
    Template repo: moleculerjs/moleculer-template-nano
    Downloading template...
    ? Select a transporter MQTT
    ? Would you like use cache? No
    ? Would you like to enable metrics? No
    ? Would you like to enable tracing? No
    ? Add Docker files? Yes
    ? Use ESLint to lint your code? No
    Create 'greeter' folder...
    ? Would you like to run 'npm install'? Yes
    Running 'npm install'...

$ cd greeter

$ npm run dev

mol $ call greeter.hello
    >> Call 'greeter.hello' with params: {}
    >> Execution time:12ms
    >> Response:
    'Hello Moleculer'

## Run in Docker

**Build Docker image**
```bash
$ docker build -t pasquati/greeter .
```

**Start container**
```bash
$ docker run -d pasquati/greeter
```