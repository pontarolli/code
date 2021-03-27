const { ServiceBroker } = require("moleculer")
const i2c               = require('i2c-bus')

const broker = new ServiceBroker({ 
    transporter: "nats://localhost:4222"
})

broker.createService({      
	name: "daq",
})

broker.start()