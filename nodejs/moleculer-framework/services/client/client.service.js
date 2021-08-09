const { ServiceBroker } = require("moleculer");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222"
});

// Define a service
broker.createService({
    name: "client",
    logger: true,
    logLevel: "info",
});
 
// Start the broker
broker.start()
    // Call the service
    // .then(() => broker.call("math.add", { a: 5, b: 3 }))
    // Print the response
    // .then(res => console.log("5 + 3 =", res))
    // .catch(err => console.error(`Error occured! ${err.message}`))
    
    // Call the service
    .then(() => broker.call("greeter.hello"))
    //.then(() => broker.call("greeter.hello", null, { nodeID: "node-3" }))
    // Print the response
    .then(res => console.log("response =", res))
    .catch(err => console.error(`Error occured! ${err.message}`))

    //Switch to REPL mode 
    .then(() => {broker.repl();});
 