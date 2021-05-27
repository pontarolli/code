# 4relind-rpi


## Relays


### setRelay: 

Set relays On/Off

Usage   : `4relind-rpi.setRelay --stack <id> --channel <channel> --value <value>`

Example : `mol $ call 4relind-rpi.setRelay --stack 0 --channel 2 --value 1` Set Relay 2 on Board 0 On


### setAllRelays: 

Set all relays On/Off

Usage       : `4relind-rpi.setAllRelays --stack <id> --value <value>`

Example     : `mol $ call 4relind-rpi.setAllRelays --stack 0 --value 3` Set Relay 1 and 2 on Board 0 On


### getRelay: 

Read relays status,

Usage   :`4relind-rpi.getRelay --stack <id> --channel <channel>`

Example : `mol $ call 4relind-rpi.getRelay --stack 0 --channel 2` Read Status of Relay 2 on Board 0


### getAllRelays: 

Read all relays status,

Usage   : `4relind-rpi.getAllRelays --stack <id> --channel <channel>`

Example : `mol $ call 4relind-rpi.getAllRelays --stack 0` Read Status of All Relays on Board 0


## Optos


### getOpto: 

Read inputs status

Usage  : `4relind-rpi.getOpto --stack <id> --channel <channel>`

Example: `mol $ call 4relind-rpi.getOpto --stack 0 --channel 2` Read Status of Opto 2 on Board 0

### getAllOptos: 

Read all inputs status

Usage      : `4relind-rpi.getAllOptos --stack <id> `

Example    : `mol $ call 4relind-rpi.getAllOptos --stack 0 ` Read Status of all Optos on Board 0
