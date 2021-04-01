const { ServiceBroker } = require("moleculer")
const i2c               = require('i2c-bus')

const SLAVE_OWN_ADDRESS_BASE = 0x50

const broker = new ServiceBroker({ 
    transporter: "nats://localhost:4222"
})

broker.createService({      
	name: "daq",
})

broker.start()