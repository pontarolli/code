// testar a função de erro com a placa que esta com o professor, erro de i2c, tentar fazer a leitura sem a megaind conectada

"use strict";

const { ServiceBroker } = require("moleculer")
const i2c               = require('i2c-bus')

const RELAY4_HW_I2C_BASE_ADD = 0x38

// const RELAY4_HW_I2C_BASE_ADD = 0x3f
// ok const RELAY4_HW_I2C_BASE_ADD = 0x30

const RELAY4_INPORT_REG_ADD  = 0x00
const RELAY4_OUTPORT_REG_ADD = 0x01
const RELAY4_POLINV_REG_ADD  = 0x02
const RELAY4_CFG_REG_ADD     = 0x03

// status
const ERROR = -1
const OK    = 0
const FAIL  = -1
const ON = 1
const OFF = 0

const DEFAULT_HW_ADD = 0x50

const CALIBRATION_KEY = 0xaa

const I2C_MEM_DIAG_TEMPERATURE = 114
const I2C_MEM_DIAG_24V = 115
const I2C_MEM_DIAG_5V = 117
const I2C_MEM_REVISION_MAJOR = 120
const I2C_MEM_REVISION_MINOR = 121

const I2C_MEM_OPTO_IN_VAL    = 3;
const I2C_MEM_U0_10_OUT_VAL1 = 4;
const I2C_MEM_I4_20_OUT_VAL1 = 12;
const I2C_MEM_OD_PWM1        = 20;

const I2C_MEM_U0_10_IN_VAL1       = 28;
const I2C_MEM_U_PM_10_IN_VAL1     = 36;
const I2C_MEM_I4_20_IN_VAL1       = 44;
const I2C_MEM_OPTO_RISING_ENABLE  = 103;
const I2C_MEM_OPTO_FALLING_ENABLE = 104;
const I2C_MEM_OPTO_CH_CONT_RESET  = 105;
const I2C_MEM_OPTO_COUNT1         = 106;  //2 bytes integers

const I2C_RTC_YEAR_ADD       = 70
const I2C_RTC_MONTH_ADD      = 71
const I2C_RTC_DAY_ADD        = 72
const I2C_RTC_HOUR_ADD       = 73
const I2C_RTC_MINUTE_ADD     = 74
const I2C_RTC_SECOND_ADD     = 75

const I2C_RTC_SET_YEAR_ADD   = 76
const I2C_RTC_SET_MONTH_ADD  = 77
const I2C_RTC_SET_DAY_ADD    = 78
const I2C_RTC_SET_HOUR_ADD   = 79
const I2C_RTC_SET_MINUTE_ADD = 80
const I2C_RTC_SET_SECOND_ADD = 81
const I2C_RTC_CMD_ADD        = 82

const broker = new ServiceBroker({
	validator: "Fastest",
	logger   : "Console",
});

broker.createService({
    name: "daq",

    actions: {   
        // *Boards

        // board: Display the board status and firmware version number.
        // Usage: daq.board --stack <id>
        // Example: mol $ call daq.board --stack 0; Display vcc, temperature, firmware version
        // Firmware ver 01.04, CPU temperature 38 C, Power source 23.77 V, Raspberry 5.22 V
        board: {
            params: {
				stack  : { type: "number", integer: true, min: 0, max: 7},
			},
			async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = I2C_MEM_DIAG_TEMPERATURE
                let length = 8
                let buffer = Buffer.alloc(8)
                let rawData = await this.readI2cBlock(addr, cmd, length, buffer)
                let value   = this.toValueBoard(rawData)
                return value
			}
        },
        
        // rtcrd: Get the internal RTC  date and time(yy/mm/dd hh:mm:ss) in UTC adapted to ISO 8601
        // Usage: daq.rtcrd --stack <id> 
        // Example: mol $ call daq.rtcrd --stack 0; Get the nternal RTC time and date on Board 0
        rtcrd: {
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
            },
            async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = I2C_RTC_YEAR_ADD
                let length  = 6
                let buffer  = Buffer.alloc(6)
                let rawData = await this.readI2cBlock(addr, cmd, length, buffer)
                let value   = this.toValueRtc(rawData)
                return value
            }
        },       





        // *Voltages IO

        // uoutwr : Write 0-10V output voltage value (V)
        // Usage  : daq.uoutwr --stack <id> --channel <channel> --value <value>
        // Example: mol $ call daq.uoutwr --stack 0 --channel 2 --value 2.5; Write 2.5V to 0-10V output channel 2 on Board 0
        uoutwr: {    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4},
                value  : { type: "number", min: 0, max: 10}
            },
            async handler(ctx) {
                let addr   = this.toAddress(ctx.params.stack)
                let cmd    = this.toCmd(I2C_MEM_U0_10_OUT_VAL1, ctx.params.channel)
                let word   = this.toWord(ctx.params.value)
                let status = await this.writeWord(addr, cmd, word)
                return status
            }
        },
        
        // uoutrd : Read 0-10V Output voltage value(V)
        // Usage  : daq.uoutrd --stack <id> --channel <channel> 
        // Example: mol $ call daq.uoutrd --stack 0 --channel 2; Read the voltage on 0-10V out channel 2 on Board 0
        uoutrd: {            
			params: { 
				stack  : { type: "number", integer: true, min: 0, max: 7},
				channel: { type: "number", integer: true, min: 1, max: 4}
			},
			async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = this.toCmd(I2C_MEM_U0_10_OUT_VAL1, ctx.params.channel)
                let rawData = await this.readWord(addr, cmd)
                let value   = this.toValue(rawData)
                return value
			}
		},

        // uinrd : Read 0-10V input value (V)
        // Usage  : daq.uinrd --stack <id> --channel <channel> 
        // Example: mol $ call daq.uinrd --stack 0 --channel 2; Read the voltage input on 0-10V in channel 2 on Board 0
        uinrd: {            
			params: {
				stack  : { type: "number", integer: true, min: 0, max: 7},
				channel: { type: "number", integer: true, min: 1, max: 4}
			},
			async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = this.toCmd(I2C_MEM_U0_10_IN_VAL1, ctx.params.channel)
                let rawData = await this.readWord(addr, cmd)
                let value   = this.toValue(rawData)
                return value            
			}
		},



        
        
        // *Currents IO
        
        // ioutwr : Write 4-20mA output value (mA)
        // Usage  : daq.ioutwr --stack <id> --channel <channel> --value <value>
        // Example: mol $ call daq.ioutwr --stack 0 --channel 2 --value 10.5; Set 10.5mA to 4-20mA output channel 2 on Board 0
        ioutwr: {    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4},
                value  : { type: "number", min: 4, max: 20}
            },
            async handler(ctx) {
                let addr   = this.toAddress(ctx.params.stack)
                let cmd    = this.toCmd(I2C_MEM_I4_20_OUT_VAL1, ctx.params.channel)
                let word   = this.toWord(ctx.params.value)
                let status = await this.writeWord(addr, cmd, word)
                return status
            }
        },
 
        // ioutrd : Read 4-20mA Output current value (mA)
        // Usage  : daq.ioutrd --stack <id> --channel <channel> 
        // Example: mol $ call daq.ioutrd --stack 0 --channel 2; Read the current on 4-20mA out channel 2 on Board 0
        ioutrd: {    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4}
            },
            async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = this.toCmd(I2C_MEM_I4_20_OUT_VAL1, ctx.params.channel)
                let rawData = await this.readWord(addr, cmd)
                let value   = this.toValue(rawData)
                return value                 
            }
        },

        // iinrd : Read 4-20mA input value (mA) 
        // Usage  : daq.iinrd --stack <id> --channel <channel> 
        // Example: mol $ call daq.iinrd --stack 0 --channel 2; Read the voltage input on 4-20mA in channel 2 on Board 0
        iinrd: {    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4}
            },
            async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = this.toCmd(I2C_MEM_I4_20_IN_VAL1, ctx.params.channel)
                let rawData = await this.readWord(addr, cmd)
                let value   = this.toValue(rawData)
                return value   
            }
        },



        // *Analog Out and Digital In

        // odwr   : Write open-drain output PWM value (0..100%)
        // Usage  : daq.odwr --stack <id> --channel <channel> --value <value>
        // Example: mol $ call daq.odwr --stack 0 --channel 2 --value 10.5; Set PWM 10.5% to open-drain output channel 2 on Board 0
        odwr: {
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4},
                value  : { type: "number", min: 0, max: 100}
            },            
            async handler(ctx) {
                let addr   = this.toAddress(ctx.params.stack)
                let cmd    = this.toCmd(I2C_MEM_OD_PWM1, ctx.params.channel)
                let word   = this.toWord(ctx.params.value/10)
                let status = await this.writeWord(addr, cmd, word)
                return status
            }
        },

        // odrd   : Read open-drain Output PWM value(0..100%)
        // Usage  : daq.odrd --stack <id> --channel <channel>
        // Example: mol $ call daq.odrd --stack 0 --channel 2; Read the PWM value on open-drain output channel 2 on Board 0
        odrd: {
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 1, max: 4}
            },
            async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = this.toCmd(I2C_MEM_OD_PWM1, ctx.params.channel)
                let rawData = await this.readWord(addr, cmd)
                let value   = this.toValue(rawData*10)
                return value   
            }
        },        

        // optord: Read dry opto status,
        // Usage  : daq.optord --stack <id> --channel <channel>
        // Example: mol $ call daq.optord --stack 0 --channel 2; Read Status of opto input pin 2 on Board 0
        optord: {
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", integer: true, min: 0, max: 4}
            },
            async handler(ctx) {
                let addr    = this.toAddress(ctx.params.stack)
                let cmd     = I2C_MEM_OPTO_IN_VAL
                let rawData = await this.readByte(addr, cmd)
                let value   = this.toChannel(rawData, ctx.params.channel)
                return value          
            }
        },    










        // Desenvolvendo ... 



        // Set the internal RTC  date and time(yy/mm/dd hh:mm:ss) in UTC adapted to ISO 8601 
        // Usage: daq.rtcwr --stack <id> --year <yy> --month <mm> --date <dd> --hour<hh> --minute <mm> --second <ss>
        // Example:	mol $ call daq.rtcwr --stack 0 --year 21 --month 04 --date 09 --hour 14 --minute 05 --second 30; Set the internal RTC time and date on Board 0 at 2021/04/09  14:05:30

        //call daq.rtcwr --stack 0 --year 47 --month 04 --date 09 --hour 14 --minute 05 --second 30
        //ele so grava quando escrever pela segunda vez, não achei o porque
        rtcwr: {
            params: {
                stack : { type: "number", integer: true, min: 0, max: 7},
                year  : { type: "number", integer: true, min: 0, max: 99},
                month : { type: "number", integer: true, min: 1, max: 12},
                date  : { type: "number", integer: true, min: 1, max: 31},
                hour  : { type: "number", integer: true, min: 0, max: 23},
                minute: { type: "number", integer: true, min: 0, max: 59},
                second: { type: "number", integer: true, min: 0, max: 59},
            },

            async handler(ctx){
                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_RTC_SET_YEAR_ADD
                let length = 7
                let buffer = Buffer.from([ ctx.params.year, ctx.params.month, ctx.params.date, ctx.params.hour, ctx.params.minute, ctx.params.second, CALIBRATION_KEY]);

                return await i2c.openPromisified(1)
                    .then(i2c1 => i2c1.writeI2cBlock(addr, cmd, length, buffer)
                        .then((rawData) => {
                            i2c1.close()                                 
                            return 'Success!'
                        })
                        .catch((error) => {return `Error occured! ${error.message}`})
                    )
                    .catch((error) => {return `Error occured! ${error.message}`})

            }
        },

        // call daq.rwr --stack 0 --channel 0 --value 15
        // write: Set relays On/Off
        // "\tUsage:       4relind <id> write <channel> <on/off>\n",
        // "\tUsage:       4relind <id> write <value>\n",
        // "\tExample:     4relind 0 write 2 On; Set Relay #2 on Board #0 On\n"};
        // rwr: {
        //     params: {
        //         stack  : { type: "number", integer: true, min: 0, max: 7},
        //         channel: { type: "number", integer: true, min: 0, max: 4},
        //         value  : { type: "number", integer: true, min: 0, max: 15}
        //     },
            
        //     async handler(ctx) {

        //          let addr = RELAY4_HW_I2C_BASE_ADD + (0x07 ^ ctx.params.stack)
        //          let cmd = RELAY4_OUTPORT_REG_ADD
        //          let cmd = RELAY4_CFG_REG_ADD
        //          let word = ctx.params.value

 
        //         return await i2c.openPromisified(1)
        //             .then(i2c1 => i2c1.writeByte(addr, cmd, word)
        //                 .then((rawData) => {
        //                     broker.logger.info(rawData)
        //                     i2c1.close()                                 
        //                     return 'done'
        //                 })
        //             )
        //             .catch((error) => {return `Error occured! ${error.message}`})
        //     }
        // },        


    },

    methods: {
        async readWord(addr, cmd){
            return await i2c.openPromisified(1)
            .then(i2c1 => i2c1.readWord(addr, cmd)
                .then(rawData => {
                    i2c1.close()  
                    return rawData
                })
            )
            .catch(error => {return `Error occured! ${error.message}`})
        },

        async writeWord(addr, cmd, word){
            return await i2c.openPromisified(1)
            .then(i2c1 => i2c1.writeWord(addr, cmd, word)
                .then(_ => {
                    i2c1.close()                                 
                    return OK
                })
            )
            .catch((error) => {return `Error occured! ${error.message}`})
        },

        async readByte(addr, cmd){
            return await i2c.openPromisified(1)
            .then(i2c1 => i2c1.readByte(addr, cmd)
                .then(rawData => {
                    i2c1.close()  
                    return rawData
                })
            )
            .catch(error => {return `Error occured! ${error.message}`})
        },

        async readI2cBlock(addr, cmd, length, buffer){
            return await i2c.openPromisified(1)
            .then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
                .then(rawData => {
                    i2c1.close()                                
                    return rawData
                })
            )
            .catch((error) => {return `Error occured! ${error.message}`})
        },


        toValue(rawData){
            return  rawData/1000
        },

        toChannel(rawData, channel){
            if((1 << (channel -1)) & rawData) {
                return ON
            }
            return OFF
        },

        
        toValueBoard(rawData){
            let raspberrypi        = {}
                raspberrypi.nodeid = broker.nodeID
                raspberrypi.power  = rawData.buffer.readIntLE(3, 3)/1000.0
            
            let megaind             = {}
            let major               = rawData.buffer.readIntLE(6, 1)
            let minor               = rawData.buffer.readIntLE(7, 1)
                megaind.firmware    = major + minor / 100.0
                megaind.power       = rawData.buffer.readIntLE(1, 2)/1000.0
                megaind.temperature = rawData.buffer.readIntLE(0, 1)

            return {raspberrypi, megaind}
        },

        toValueRtc(rawData){

            let rtc = {}

            let year   = rawData.buffer.readIntLE(0, 1) + 2000
            let month  = rawData.buffer.readIntLE(1, 1)         //Um valor inteiro que representa o mês, começando com 0 para Janeiro até 11 para Dezembro.
            let day    = rawData.buffer.readIntLE(2, 1)
            let hour   = rawData.buffer.readIntLE(3, 1)
            let minute = rawData.buffer.readIntLE(4, 1)
            let second = rawData.buffer.readIntLE(5, 1)

            rtc.utc = new Date(Date.UTC(year, month, day, hour, minute, second));
            
            const option = {
                year        : 'numeric',
                month       : ('long' || 'short' || 'numeric'),
                weekday     : ('long' || 'short'),
                day         : 'numeric',
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
        //      era         : ('long' || 'short'),
                timeZoneName: ('long' || 'short')
            }

            const locale    = 'pt-br'
            rtc.local = rtc.utc.toLocaleDateString(locale, option)

            return rtc
        },

        toAddress(stack){
            return DEFAULT_HW_ADD + stack
        },

        toCmd(i2cMemory, channel){
            return i2cMemory + (channel - 1)*2
        },

        toWord(value){
            return value * 1000                              // range 0 to 65535 in word but in the program range 0 to 1000 is equal 0 to 10V ir its voltage, if its current 4 to 20mA
        }

    }
});



broker.start()

broker.repl()

    // .then(() => {
    //     setInterval(() => {

    //                    broker.call("daq.board", { stack: 0 })

    //         .then(()=> {

    //             let date = new Date()

    //             broker.call("daq.rtcwr", {
    //                 stack : 0,
    //                 year  : date.getUTCFullYear() - 2000,   //year from 0-99
    //                 month : date.getUTCMonth(),             //months from 0-11 utc
    //                 date  : date.getUTCDate(),
    //                 hour  : date.getUTCHours(),
    //                 minute: date.getUTCMinutes(),
    //                 second: date.getUTCSeconds()
    //             })  

    //         }) 
    //         .then(()=> broker.call("daq.rtcrd",  {stack:0}))           
            
    //         .then(()=> broker.call("daq.uoutwr", {stack:0, channel: 1, value: 1.11}))                       
    //         .then(()=> broker.call("daq.uoutwr", {stack:0, channel: 2, value: 2.22}))                       
    //         .then(()=> broker.call("daq.uoutwr", {stack:0, channel: 3, value: 3.33}))                       
    //         .then(()=> broker.call("daq.uoutwr", {stack:0, channel: 4, value: 4.44}))      
            
    //         .then(()=> broker.call("daq.uoutrd", {stack:0, channel: 1}))                       
    //         .then(()=> broker.call("daq.uoutrd", {stack:0, channel: 2}))                       
    //         .then(()=> broker.call("daq.uoutrd", {stack:0, channel: 3}))                       
    //         .then(()=> broker.call("daq.uoutrd", {stack:0, channel: 4}))  

    //         .then(()=> broker.call("daq.uinrd", {stack:0, channel: 1}))
    //         .then(()=> broker.call("daq.uinrd", {stack:0, channel: 2}))
    //         .then(()=> broker.call("daq.uinrd", {stack:0, channel: 3}))
    //         .then(()=> broker.call("daq.uinrd", {stack:0, channel: 4}))

    //         .then(()=> broker.call("daq.ioutwr", {stack:0, channel: 1, value: 11.11}))
    //         .then(()=> broker.call("daq.ioutwr", {stack:0, channel: 2, value: 12.22}))
    //         .then(()=> broker.call("daq.ioutwr", {stack:0, channel: 3, value: 13.33}))
    //         .then(()=> broker.call("daq.ioutwr", {stack:0, channel: 4, value: 14.44}))

    //         .then(()=> broker.call("daq.ioutrd", {stack:0, channel: 1}))                       
    //         .then(()=> broker.call("daq.ioutrd", {stack:0, channel: 2}))                       
    //         .then(()=> broker.call("daq.ioutrd", {stack:0, channel: 3}))                       
    //         .then(()=> broker.call("daq.ioutrd", {stack:0, channel: 4}))  

    //         .then(()=> broker.call("daq.iinrd", {stack:0, channel: 1}))
    //         .then(()=> broker.call("daq.iinrd", {stack:0, channel: 2}))
    //         .then(()=> broker.call("daq.iinrd", {stack:0, channel: 3}))
    //         .then(()=> broker.call("daq.iinrd", {stack:0, channel: 4}))
            
    //         .then(res => {
    //             //broker.logger.info(res)
    //             broker.logger.info(data)
    //         })
    //      	.catch(err => {
    //             //broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
    //             if (err.data)
    //                 broker.logger.error("Error data:", err.data);
    //         })
    //     }, 1000);
    // });








/**
 * 
 *      -v              Display the megaind command version number
        -h              Display the list of command options or one command option details
        -warranty       Display the warranty
        -list:          List all megaind boards connected
                        return the # of boards and stack level for every board
        board           Display the board status and firmware version number - ok
        optord:         Read dry opto status - ok
        countrd:        Read dry opto transitions count
        countrst:       Reset opto transitions countors
        edgerd:         Read opto inputs transitions type, ret 0 - disable, 1 - rising, 2 - falling, 3 - both
        edgewr:         Writ opto inputs transitions type: 0 - disable, 1 - rising, 2 - falling, 3 - both
        uoutrd:         Read 0-10V Output voltage value(V) - ok
        uoutwr:         Write 0-10V output voltage value (V) - ok
        ioutrd:         Read 4-20mA Output current value (mA) - ok
        ioutwr:         Write 4-20mA output value (mA) - ok
        odrd:           Read open-drain Output PWM value(0..100%) - ok
        odwr:           Write open-drain output PWM value (0..100%) - ok
        uinrd:          Read 0-10V input value (V) - ok
        pmuinrd:        Read +/-10V input value (V). Warning: This value is valid only if the corespondung jumper is connected ?
        iinrd:          Read 4-20mA input value (mA) - ok
        uincal:         Calibrate one 0-10V input channel, the calibration must be done in 2 points at min 5V apart
        iincal:         Calibrate one 4-20mA input channel, the calibration must be done in 2 points at min 10mA apart
        uincalrst:      Reset the calibration for one 0-10V input channel
        iincalrst:      Reset the calibration for one 4-20mA input channel
        uoutcal:        Calibrate one 0-10V output channel, the calibration must be done in 2 points at min 5V apart
        ioutcal:        Calibrate one 4-20mA output channel, the calibration must be done in 2 points at min 10mA apart
        uoutcalrst:     Reset the calibration for one 0-10V output channel
        ioutcalrst:     Reset the calibration for one 4-20mA output channel
        wdtr:           Reload the watchdog timer and enable the watchdog if is disabled
        wdtpwr:         Set the watchdog period in seconds, 
                        reload command must be issue in this interval to prevent Raspberry Pi power off
        wdtprd:         Get the watchdog period in seconds, 
                        reload command must be issue in this interval to prevent Raspberry Pi power off
        wdtipwr:        Set the watchdog initial period in seconds, 
                        This period is loaded after power cycle, giving Raspberry time to boot
        wdtiprd:        Get the watchdog initial period in seconds. 
                        This period is loaded after power cycle, giving Raspberry time to boot
        wdtopwr:        Set the watchdog off period in seconds (max 48 days). 
                        This is the time that watchdog mantain Raspberry turned off 
        wdtoprd:        Get the watchdog off period in seconds (max 48 days) 
                        This is the time that watchdog mantain Raspberry turned off 
        rs485rd:        Read the RS485 communication settings
        rs485wr:        Write the RS485 communication settings
        rtcrd:          Get the internal RTC  date and time(mm/dd/yy hh:mm:ss) - ok
        rtcwr:          Set the internal RTC  date and time(mm/dd/yy hh:mm:ss) - ok


                Usage:          megaind -v
        Usage:          megaind -h    Display command options list
        Usage:          megaind -h <param>   Display help for <param> command option
        Usage:          megaind -warranty
        Usage:          megaind -list
        Usage:          megaind <stack> board
        Usage:          megaind <id> optord <channel>
        Usage:          megaind <id> optord
        Usage:          megaind <id> countrd <channel>
        Usage:          megaind <id> countrst <channel>
        Usage:          megaind <id> edgerd <channel> 
        Usage:          megaind <id> edgewr <channel> <val>
        Usage:          megaind <id> uoutrd <channel>
        Usage:          megaind <id> uoutwr <channel> <value(V)>
        Usage:          megaind <id> ioutrd <channel>
        Usage:          megaind <id> ioutwr <channel> <value(mA)>
        Usage:          megaind <id> odrd <channel>
        Usage:          megaind <id> odwr <channel> <value>
        Usage:          megaind <id> uinrd <channel>
        Usage:          megaind <id> pmuinrd <channel>
        Usage:          megaind <id> iinrd <channel>
        Usage:          megaind <id> uincal <channel> <value(V)>
        Usage:          megaind <id> iincal <channel> <value(mA)>
        Usage:          megaind <id> uincalrst <channel>
        Usage:          megaind <id> iincalrst <channel>
        Usage:          megaind <id> uoutcal <channel> <value(V)>
        Usage:          megaind <id> ioutcal <channel> <value(mA)>
        Usage:          megaind <id> uoutcalrst <channel>
        Usage:          megaind <id> ioutcalrst <channel>
        Usage:          megaind <id> wdtr
        Usage:          megaind <id> wdtpwr <val> 
        Usage:          megaind <id> wdtprd 
        Usage:          megaind <id> wdtipwr <val> 
        Usage:          megaind <id> wdtiprd 
        Usage:          megaind <id> wdtopwr <val> 
        Usage:          megaind <id> wdtoprd 
        Usage:          megaind <id> rs485rd
        Usage:          megaind <id> rs485wr <mode> <baudrate> <stopBits> <parity> <slaveAddr>
        Usage:          megaind <id> rtcrd 
        Usage:          megaind <id> rtcwr <mm> <dd> <yy> <hh> <mm> <ss> 
Where: <id> = Board level id = 0..7
 
4relind: Usage:  4relind -h <command>
         4relind -v
         4relind -warranty
         4relind -list
         4relind <id> write <channel> <on/off>
         4relind <id> write <value>
         4relind <id> read <channel>
         4relind <id> read
         4relind <id> inread <channel>
         4relind <id> inread
         4relind <id> test

*/