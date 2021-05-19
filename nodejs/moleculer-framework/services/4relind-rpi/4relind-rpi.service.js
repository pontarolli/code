"use strict";

const { ServiceBroker } = require("moleculer")
const i2c               = require('i2c-bus');

const RELAY4_HW_I2C_BASE_ADD = 0x38
const RELAY4_HW_I2C_7_BIT    = 0x07
const RELAY4_INPORT_REG_ADD  = 0x00
const RELAY4_OUTPORT_REG_ADD = 0x01
const RELAY4_CFG_REG_ADD     = 0x03
const RELAY4_CFG_DIRECTION   = 0x0f

const mask = new ArrayBuffer(4);
mask [0] = 0x80;
mask [1] = 0x40;
mask [2] = 0x20;
mask [3] = 0x10;

const  inMask = new ArrayBuffer(4);
inMask[0] = 0x08;
inMask[1] = 0x04;
inMask[2] = 0x02;
inMask[3] = 0x01;

const ERROR = -1
const OK    = 0

const ON    = 1
const OFF   = 0

const broker = new ServiceBroker({
    validator  : "Fastest",
    logger     : "Console",
});

broker.createService({
    name: "4relind-rpi",

    actions: {   
        // setRelay: Set relays On/Off
        // Usage   : 4relind-rpi.setRelay --stack <id> --channel <channel> --value <value>
        // Example : mol $ call 4relind-rpi.setRelay --stack 0 --channel 2 --value 1; Set Relay 2 on Board 0 On
        setRelay: {

            params: {   
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4},
                value  : { type: "number", integer: true, min: 0, max: 1}
            },

            async handler(ctx){

                let addr   = RELAY4_HW_I2C_BASE_ADD + ctx.params.stack ^ RELAY4_HW_I2C_7_BIT 
                let cmd    = RELAY4_OUTPORT_REG_ADD
                let byte   = 0
                let status = 0
                
                byte = await this.check(addr)
                byte = this.ioToRelay(byte)

                if(ctx.params.value == OFF){
                    byte   &= (~(1 << (ctx.params.channel - 1)))
                    byte   = this.relayToIo(byte)
                    status = await this.writeByte(addr, cmd, byte)
                }

                else{
                    byte   |= (1 << (ctx.params.channel - 1))
                    byte   = this.relayToIo(byte)
                    status = await this.writeByte(addr, cmd, byte)
                }

            return status
            }
        },

        // setAllRelays: Set all relays On/Off
        // Usage       : 4relind-rpi.setAllRelays --stack <id> --value <value>
        // Example     : mol $ call 4relind-rpi.setAllRelays --stack 0 --value 3; Set Relay 1 and 2 on Board 0 On
        setAllRelays: {
            params: {   
                stack  : { type: "number", integer: true, min: 0, max: 7},
                value  : { type: "number", integer: true, min: 0, max: 15}
            },

            async handler(ctx){

                let addr   = RELAY4_HW_I2C_BASE_ADD + ctx.params.stack ^ RELAY4_HW_I2C_7_BIT 
                let cmd    = RELAY4_OUTPORT_REG_ADD
                let byte   = 0
                let status = 0
                
                byte = await this.check(addr)
                

                let value = this.relayToIo(ctx.params.value)
                status = await this.writeByte(addr, cmd, value)


            return status
            }
        },
       
        // getRelay: Read relays status,
        // Usage   : 4relind-rpi.getRelay --stack <id> --channel <channel>
        // Example : mol $ call 4relind-rpi.getRelay --stack 0 --channel 2; Read Status of Relay 2 on Board 0
        getRelay: {
            params: {   
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4}
            },

            async handler(ctx){
                let addr   = RELAY4_HW_I2C_BASE_ADD + ctx.params.stack ^ RELAY4_HW_I2C_7_BIT 
                let byte = await this.check(addr)

                byte = this.ioToRelay(byte)
                byte = byte & (1 << (ctx.params.channel - 1))

                if(byte == OFF) return OFF
                return ON
            }
        },

        // getAllRelays: Read all relays status,
        // Usage   : 4relind-rpi.getAllRelays --stack <id> --channel <channel>
        // Example : mol $ call 4relind-rpi.getAllRelays --stack 0; Read Status of All Relays on Board 0
        getAllRelays: {
            params: {   
                stack  : { type: "number", integer: true, min: 0, max: 7},
            },

            async handler(ctx){
                let addr = RELAY4_HW_I2C_BASE_ADD + ctx.params.stack ^ RELAY4_HW_I2C_7_BIT  
                let byte = await this.check(addr)
                    byte = this.ioToRelay(byte)
                return byte
            }
        },

        // getOpto: Read inputs status
        // Usage  : 4relind-rpi.getOpto --stack <id> --channel <channel>
        // Example: mol $ call 4relind-rpi.getOpto --stack 0 --channel 2; Read Status of Opto 2 on Board 0
        getOpto: {
            params: {   
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4}
            },

            async handler(ctx){
                let addr   = RELAY4_HW_I2C_BASE_ADD + ctx.params.stack ^ RELAY4_HW_I2C_7_BIT 
                let byte = await this.check(addr)

                byte = this.ioToOpto(byte)
                byte = byte & (1 << (ctx.params.channel - 1))

                if(byte == OFF) return OFF
                return ON
            }
        },

        // getAllOptos: Read all inputs status
        // Usage      : 4relind-rpi.getAllOptos --stack <id> 
        // Example    : mol $ call 4relind-rpi.getAllOptos --stack 0 ; Read Status of all Optos on Board 0
        getAllOptos: {
            params: {   
                stack  : { type: "number", integer: true, min: 0, max: 7},
            },

            async handler(ctx){
                let addr   = RELAY4_HW_I2C_BASE_ADD + ctx.params.stack ^ RELAY4_HW_I2C_7_BIT 
                let byte = await this.check(addr)
                byte = this.ioToOpto(byte)
                return byte
            }
        },              
    },

    methods: {
        async check(addr){
            let cfg = await this.readByte(addr, RELAY4_CFG_REG_ADD)
            if(cfg != RELAY4_CFG_DIRECTION){
                await this.writeByte(addr, RELAY4_CFG_REG_ADD, RELAY4_CFG_DIRECTION)
                await this.writeByte(addr, RELAY4_OUTPORT_REG_ADD, 0)
            }
        return await this.readByte(addr, RELAY4_INPORT_REG_ADD) 
        },

        ioToRelay(byte){
            let val = 0
            for(let i = 0; i<4; i+=1){
                if ((byte & mask[i]) != 0 ) val += (1 << i)
            }
        return val
        },

        relayToIo(byte){
            let val = 0;
            for(let i = 0; i<4; i+=1){
                if ((byte & (1 << i)) !=0 ) val += mask[i]
            }
        return val
        },

        ioToOpto(byte){
            let val = 0
            for(let i = 0; i<4; i+=1){
                if ((byte & inMask[i]) == 0 ) val += (1 << i)
            }
        return val
        }, 

        async writeByte(addr, cmd, byte){
            return await i2c.openPromisified(1)
            .then(i2c1 => i2c1.writeByte(addr, cmd, byte)
                .then(_ => {
                    i2c1.close()                                 
                    return OK
                })
            )
            .catch(error => {
                broker.logger.error(`Error occured! ${error.message}`)
                return ERROR
            })
        },

        async readByte(addr, cmd){
            return await i2c.openPromisified(1)
            .then(i2c1 => i2c1.readByte(addr, cmd)
                .then(rawData => {
                    i2c1.close()  
                    return rawData
                })
            )
            .catch(error => {
                broker.logger.error(`Error occured! ${error.message}`)
                return ERROR
            })
        },
    }
});

broker.start()