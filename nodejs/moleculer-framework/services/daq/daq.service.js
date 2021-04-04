"use strict";

const { ServiceBroker } = require("moleculer")
const i2c               = require('i2c-bus')

const DEFAULT_HW_ADD = 0x50

// Diagnose functions
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

let data = {    
    raspberrypi: {
        nodeID: undefined,
        power: undefined,
    },
    megaind: {
        firmware: undefined,
        temperature: undefined,
        power: undefined,
        rtc_utc: undefined,
        rtc_local: undefined,
  
    },
    inputs: {
        voltage_0_10V: {
            channel_1: undefined,
            channel_2: undefined,
            channel_3: undefined,
            channel_4: undefined
        }
    }
}

const broker = new ServiceBroker({
	validator: "Fastest",
    logger: "Console",
    // logger: {
    //     type: "File",
    //     options: {
    //         // Logging level
    //         level: "info",
    //         // Folder path to save files. You can use {nodeID} & {namespace} variables.
    //         folder: "./logs",
    //         // Filename template. You can use {date}, {nodeID} & {namespace} variables.
    //         filename: "moleculer-{date}.log",
    //         // Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
    //         formatter: "json",
    //         // Custom object printer. If not defined, it uses the `util.inspect` method.
    //         objectPrinter: null,
    //         // End of line. Default values comes from the OS settings.
    //         eol: "\n",
    //         // File appending interval in milliseconds.
    //         interval: 1 * 1000
    //     }
    // }
});

// Define a service
broker.createService({
    name: "daq",

    actions: {

        // Get the internal RTC  date and time(yy/mm/dd hh:mm:ss) ISO 8601
        rtcrd: {
            params: {
				stack  : { type: "number", integer: true, min: 0, max: 7},
			},

			async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_RTC_YEAR_ADD
                let length = 6
                let buffer = Buffer.alloc(6)
				return await i2c.openPromisified(1)
					.then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
						.then((rawData) => {
							i2c1.close()   

                            let year   = 2000 + (rawData.buffer.readIntLE(0, 1))
                            let month  = (rawData.buffer.readIntLE(1, 1)) - 1 //Um valor inteiro que representa o mês, começando com 0 para Janeiro até 11 para Dezembro.
                            let day    = rawData.buffer.readIntLE(2, 1)
                            let hour   = rawData.buffer.readIntLE(3, 1)
                            let minute = rawData.buffer.readIntLE(4, 1)
                            let second = rawData.buffer.readIntLE(5, 1)

                            data.megaind.rtc_utc = new Date(Date.UTC(year, month, day, hour, minute, second));
                            
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
                            data.megaind.rtc_local = data.megaind.rtc_utc.toLocaleDateString(locale, option)
						})
						.catch((error) => {return `Error occured! ${error.message}`})
					)
					.catch((error) => {return `Error occured! ${error.message}`})
			}
        },





        // Display the board status and firmware version number
        // Firmware ver 01.04, CPU temperature 38 C, Power source 23.77 V, Raspberry 5.22 V
        // call daq.board --stack 0
        board: {
            params: {
				stack  : { type: "number", integer: true, min: 0, max: 7},
			},

			async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_MEM_DIAG_TEMPERATURE
                let length = 8
                let buffer = Buffer.alloc(8)

				return await i2c.openPromisified(1)
					.then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
						.then((rawData) => {
							i2c1.close()                                
                            data.megaind.temperature = rawData.buffer.readIntLE(0, 1)
                            data.megaind.power = Math.round((rawData.buffer.readIntLE(1, 2)/1000.0) * 1e2 ) / 1e2
                            data.raspberrypi.power = Math.round((rawData.buffer.readIntLE(3, 3)/1000.0) * 1e2 ) / 1e2
                            let major = rawData.buffer.readIntLE(6, 1)
                            let minor = rawData.buffer.readIntLE(7, 1)
                            data.megaind.firmware = major + minor / 100.0
                            broker.logger.info(data)
						})
						.catch((error) => {return `Error occured! ${error.message}`})
					)
					.catch((error) => {return `Error occured! ${error.message}`})
			}
        },


		// Read 0-10V input value (V)
        uinrd: {
            
			params: {
				stack  : { type: "number", integer: true, min: 0, max: 7},
				channel: { type: "number", positive: true, integer: true, min: 1, max: 4}
			},

			async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_MEM_U0_10_IN_VAL1 + (ctx.params.channel - 1)*2
                let length = 2
                let buffer = Buffer.alloc(2)

				return await i2c.openPromisified(1)
					.then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
						.then((rawData) => {
							i2c1.close()       
                            data.inputs.voltage_0_10V.channel_1 = Math.round((rawData.buffer.readIntLE(0, 2)/1000.0) * 1e2 ) / 1e2                         
							return data.inputs.voltage_0_10V.channel_1
						})
						.catch((error) => {return `Error occured! ${error.message}`})
					)
					.catch((error) => {return `Error occured! ${error.message}`})
			}
		},





        // Read 4-20mA input value (mA) 
        iinrd: {
    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", positive: true, integer: true, min: 1, max: 4}
            },

            async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_MEM_I4_20_IN_VAL1 + (ctx.params.channel - 1)*2
                let length = 2
                let buffer = Buffer.alloc(2)

                return await i2c.openPromisified(1)
                    .then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
                        .then((rawData) => {
                            i2c1.close()                                 
                            return Math.round((rawData.buffer.readIntLE(0, 2)/1000.0) * 1e2 ) / 1e2
                        })
                        .catch((error) => {return `Error occured! ${error.message}`})
                    )
                    .catch((error) => {return `Error occured! ${error.message}`})
            }
        },





        // Reads a block of bytes from a device max 32
        readI2cBlock: {
    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},                
            },

            async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_MEM_U0_10_IN_VAL1
                let length = 24
                let buffer = Buffer.alloc(24)

                return await i2c.openPromisified(1)
                    .then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
                        .then((rawData) => {
                            i2c1.close()    
                            
                            broker.logger.info(rawData.buffer)  
                            
                            data.inputs.voltage_0_10V.channel_1 = Math.round((rawData.buffer.readIntLE(0, 2)/1000.0) * 1e2 ) / 1e2                           
                            data.inputs.voltage_0_10V.channel_2 = Math.round((rawData.buffer.readIntLE(2, 2)/1000.0) * 1e2 ) / 1e2   
                            data.inputs.voltage_0_10V.channel_3 = Math.round((rawData.buffer.readIntLE(4, 2)/1000.0) * 1e2 ) / 1e2   
                            data.inputs.voltage_0_10V.channel_4 = Math.round((rawData.buffer.readIntLE(6, 2)/1000.0) * 1e2 ) / 1e2   

                            data.inputs.current_4_20mA.channel_1 = Math.round((rawData.buffer.readIntLE(16, 2)/1000.0) * 1e2 ) / 1e2                           
                            data.inputs.current_4_20mA.channel_2 = Math.round((rawData.buffer.readIntLE(18, 2)/1000.0) * 1e2 ) / 1e2   
                            data.inputs.current_4_20mA.channel_3 = Math.round((rawData.buffer.readIntLE(20, 2)/1000.0) * 1e2 ) / 1e2   
                            data.inputs.current_4_20mA.channel_4 = Math.round((rawData.buffer.readIntLE(22, 2)/1000.0) * 1e2 ) / 1e2   

                            broker.logger.info(data)  
                            
                            return "Read done!"
                        })
                        .catch((error) => {return `Error occured! ${error.message}`})
                    )
                    .catch((error) => {return `Error occured! ${error.message}`})
            }
        },

        // Read All data
        data: {
            handler(){
                return data 
            }            
        },


        //  Read 0-10V Output voltage value(V)
        uoutrd: {
            
			params: {
				stack  : { type: "number", integer: true, min: 0, max: 7},
				channel: { type: "number", positive: true, integer: true, min: 1, max: 4}
			},

			async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_MEM_U0_10_OUT_VAL1 + (ctx.params.channel - 1)*2
                let length = 2
                let buffer = Buffer.alloc(2)

				return await i2c.openPromisified(1)
					.then(i2c1 => i2c1.readI2cBlock(addr, cmd, length, buffer)
						.then((rawData) => {
							i2c1.close()                                 
							return Math.round((rawData.buffer.readIntLE(0, 2)/1000.0) * 1e2 ) / 1e2
						})
						.catch((error) => {return `Error occured! ${error.message}`})
					)
					.catch((error) => {return `Error occured! ${error.message}`})
			}
		},


        // Write 0-10V output voltage value (V)
        uoutwr: {
    
            params: {
                stack  : { type: "number", integer: true, min: 0, max: 7},
                channel: { type: "number", positive: true, integer: true, min: 1, max: 4},
                value  : { type: "number", positive: true, min: 0, max: 10}
            },

            async handler(ctx) {

                let addr = DEFAULT_HW_ADD + ctx.params.stack
                let cmd = I2C_MEM_U0_10_OUT_VAL1 + (ctx.params.channel - 1)*2
                let word = Math.round(ctx.params.value * 1000) // range 0 to 65535 in word but in the program range 0 to 1000 is equal 0 to 10V
                
                return await i2c.openPromisified(1)
                    .then(i2c1 => i2c1.writeWord(addr, cmd, word)
                        .then((rawData) => {
                            i2c1.close()                                 
                            return 'Success!'
                        })
                        .catch((error) => {return `Error occured! ${error.message}`})
                    )
                    .catch((error) => {return `Error occured! ${error.message}`})
            }
        },





        // Write 4-20mA output value (mA)
        // ioutwr: {
    
        //     params: {
        //         stack  : { type: "number", integer: true, min: 0, max: 7},
        //         channel: { type: "number", positive: true, integer: true, min: 1, max: 4},
        //         value  : { type: "number", positive: true, min: 4, max: 20}
        //     },

        //     async handler(ctx) {

        //         let addr = DEFAULT_HW_ADD + ctx.params.stack
        //         let cmd = I2C_MEM_I4_20_OUT_VAL1 + (ctx.params.channel - 1)*2
        //         let word = Math.round(ctx.params.value * 1000) // range 0 to 65535 in word but in the program range 0 to 1000 is equal 0 to 10V
                
        //         return await i2c.openPromisified(1)
        //             .then(i2c1 => i2c1.writeWord(addr, cmd, word)
        //                 .then((rawData) => {
        //                     i2c1.close()                                 
        //                     return 'Success!'
        //                 })
        //                 .catch((error) => {return `Error occured! ${error.message}`})
        //             )
        //             .catch((error) => {return `Error occured! ${error.message}`})
        //     }
        // },
    },
});

data.raspberrypi.nodeID = broker.nodeID,

broker.start()
// 	.then(() => {
// 		return broker.call("daq.uinrd", { stack: 0, channel: 4 }).then(res => broker.logger.info("value: ", res));
// 	})
// 	.catch(err => {
// 		broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
// 		if (err.data)
// 			broker.logger.error("Error data:", err.data);
// 	});
// broker.repl()


// call daq.uinrd --stack 0 --channel 4
// call daq.iinrd --stack 0 --channel 4
// call daq.readI2cBlock --stack 0
// call daq.uoutrd --stack 0 --channel 4
// call daq.board --stack 0
// call daq.rtcrd --stack 0


// call daq.uoutwr --stack 0 --channel 4 --value 4
// call daq.ioutwr --stack 0 --channel 4 --value 4.4

    .then(() => {
        setInterval(() => {
            // broker.call("daq.readI2cBlock", { stack: 0 })
            broker.call("daq.rtcrd", { stack: 0 })

            .then(()=> broker.call("daq.uinrd", {stack:0, channel: 4}))
            
            
            .then(res => {
                //broker.logger.info(res)
                broker.logger.info(data)
            })
         	.catch(err => {
                broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
                if (err.data)
                    broker.logger.error("Error data:", err.data);
            })
        }, 1000);
    });








/**
 * 
 *      -v              Display the megaind command version number
        -h              Display the list of command options or one command option details
        -warranty       Display the warranty
        -list:          List all megaind boards connected
                        return the # of boards and stack level for every board
        board           Display the board status and firmware version number - ok
        optord:         Read dry opto status
        countrd:        Read dry opto transitions count
        countrst:       Reset opto transitions countors
        edgerd:         Read opto inputs transitions type, ret 0 - disable, 1 - rising, 2 - falling, 3 - both
        edgewr:         Writ opto inputs transitions type: 0 - disable, 1 - rising, 2 - falling, 3 - both
        uoutrd:         Read 0-10V Output voltage value(V) - ok
        uoutwr:         Write 0-10V output voltage value (V) - ok
        ioutrd:         Read 4-20mA Output current value (mA) - Não bateu a corrente ver se estou testando certo
        ioutwr:         Write 4-20mA output value (mA) - Não deu certo
        odrd:           Read open-drain Output PWM value(0..100%) 
        odwr:           Write open-drain output PWM value (0..100%)
        uinrd:          Read 0-10V input value (V) - ok
        pmuinrd:        Read +/-10V input value (V). Warning: This value is valid only if the corespondung jumper is connected
        iinrd:          Read 4-20mA input value (mA) 
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
        rtcrd:          Get the internal RTC  date and time(mm/dd/yy hh:mm:ss)
        rtcwr:          Set the internal RTC  date and time(mm/dd/yy hh:mm:ss)


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
 */