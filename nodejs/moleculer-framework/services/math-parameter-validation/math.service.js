const { ServiceBroker } = require("moleculer");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222",
    validator  : "Fastest"                 // Using the Fastest Validator
});

// Define a service
broker.createService({
    name: "math",
    actions: {

        add: {
            params: {
                a: { type: "number", integer: true, min: 0, max: 10},
                b: { type: "number", min: 0, max: 10},
               
            },
            handler(ctx){
                return ctx.params.a + ctx.params.b
            }
        }, 
    }
});

broker.start()