const { ServiceBroker } = require("moleculer");
const ApiGateway = require("moleculer-web");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222"
});

// Load API Gateway
broker.createService({      
	name: "api",
	mixins: [ApiGateway],
});

// Start server
broker.start();

// Test
// http://localhost:3000/service/action