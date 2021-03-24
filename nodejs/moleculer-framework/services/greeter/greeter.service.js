const { ServiceBroker } = require("moleculer");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222"
});

// Define a service
broker.createService({
    name: "greeter",
    actions: {
        hello(ctx) {
            return 'hello Moleculer';
        }, 
    }
});

// Start the broker
broker.start()