const { ServiceBroker } = require("moleculer");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222"
});

// Define a service
broker.createService({
    name: "math",
    actions: {
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        }, 

        sub(ctx) {
            return Number(ctx.params.a) - Number(ctx.params.b);
        }, 

    }
});


// Start the broker
broker.start()
    // // Call the service
    // .then(() => broker.call("math.sub", { a: 5, b: 3 }))
    // // Print the response
    // .then(res => console.log("5 - 3 =", res))
    // .catch(err => console.error(`Error occured! ${err.message}`));