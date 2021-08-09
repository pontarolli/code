const { ServiceBroker } = require("moleculer");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222",
    nodeID: "node-3"
});

// Define a service
broker.createService({
    name: "greeter",
    actions: {
        hello(ctx) {
            //return 'hello Moleculer';
            return `hello Moleculer from ${this.broker.nodeID}` ;
        }, 
    }
});

// Start the broker
broker.start()