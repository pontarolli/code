
# megaind-rpi

This is the nodejs library to control the [Industrial Automation Stackable Card for Raspberry Pi](https://sequentmicrosystems.com/product/raspberry-pi-industrial-automation/) using framework Moleculer. 


## Voltages IO


### setOutputVoltage: 

Write 0-10V output voltage value (V)

Usage  : `megaind-rpi.setOutputVoltage --stack <id> --channel <channel> --value <value>`

Example: `mol $ call megaind-rpi.setOutputVoltage --stack 0 --channel 2 --value 25`; Write 2.5V to 0-10V output channel 2 on Board 0


### getOutputVoltage:

Read 0-10V Output voltage value(V)

Usage  : `megaind-rpi.getOutputVoltage --stack <id> --channel <channel> `

Example: `mol $ call megaind-rpi.getOutputVoltage --stack 0 --channel 2`; Read the voltage on 0-10V out channel 2 on Board 0


### getInputVoltage: 

Read 0-10V input voltage value (V)

Usage  : `megaind-rpi.getInputVoltage --stack <id> --channel <channel>`

Example: `mol $ call megaind-rpi.getInputVoltage --stack 0 --channel 2`; Read the voltage input on 0-10V in channel 2 on Board 0


## Currents IO


### setOutputCurrent : 

Write 4-20mA output value (mA)

Usage  : `megaind-rpi.setOutputCurrent --stack <id> --channel <channel> --value <value>`

Example: `mol $ call megaind-rpi.setOutputCurrent --stack 0 --channel 2 --value 65.62`; Set 10.5mA to 4-20mA output channel 2 on Board 0


### getOutputCurrent : 

Read 4-20mA Output current value (mA)

Usage  : `megaind-rpi.getOutputCurrent --stack <id> --channel <channel> `

Example:` mol $ call megaind-rpi.getOutputCurrent --stack 0 --channel 2`; Read the current on 4-20mA out channel 2 on Board 0


### getInputCurrent  : 

Read 4-20mA input value (mA)

Usage  :` megaind-rpi.getInputCurrent --stack <id> --channel <channel>`

Example: `mol $ call megaind-rpi.getInputCurrent --stack 0 --channel 2`; Read the voltage input on 4-20mA in channel 2 on Board 0


## Analog Out and Digital In


### setOutputOpenDrain   : 

Write open-drain output PWM value (0..100%)

Usage  : `megaind-rpi.setOutputOpenDrain --stack <id> --channel <channel> --value <value>`

Example: `mol $ call megaind-rpi.setOutputOpenDrain --stack 0 --channel 2 --value 10.5`; Set PWM 10.5% to open-drain output channel 2 on Board 0


### getOutputOpenDrain: 

Read open-drain Output PWM value(0..100%)

Usage  : `megaind-rpi.getOutputOpenDrain --stack <id> --channel <channel>`

Example: `mol $ call megaind-rpi.getOutputOpenDrain --stack 0 --channel 2`; Read the PWM value on open-drain output channel 2 on Board 0


### getInputOpto : 

Read dry opto status

Usage  : `megaind-rpi.getInputOpto --stack <id> --channel <channel>`

Example: `mol $ call megaind-rpi.getInputOpto --stack 0 --channel 2`; Read Status of opto input pin 2 on Board 0


## Diagnose


### getBoardDiagnose: 

Display infos about the board, Display firmware version, power and temperature.

Usage           : `megaind-rpi.getBoardDiagnose --stack <id>`

Example         : `mol $ call megaind-rpi.getBoardDiagnose --stack 0`;


### getRtc : 

Get the internal RTC  date and time(yy/mm/dd hh:mm:ss) in UTC adapted to ISO 8601

Usage  : `megaind-rpi.getRtc --stack <id>`

Example: `mol $ call megaind-rpi.getRtc --stack 0`; Get the internal RTC time and date on Board 0
