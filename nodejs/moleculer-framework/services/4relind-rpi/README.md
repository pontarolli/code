# 4relind-rpi

This is the javascript library to control the [Four Relays four Inputs 8-Layer Stackable Card for Raspberry Pi](https://sequentmicrosystems.com/collections/all-io-cards/products/raspberry-pi-relays-heavy-duty-hat).

## Setup

Enable I2C communication first:
```bash
~$ sudo raspi-config
```

## Usage

```bash
~$ git clone https://github.com/.../4relind-rpi.git
~$ cd 4relind-rpi/
~$ npm install
~$ npm run dev
~$ mol $
```




# Relays


## setRelay: 

    Set relays On/Off

Usage   : 

    4relind-rpi.setRelay --stack <id> --channel <channel> --value <value>

Params: 

    stack   - stack level of the 4-Relay card (selectable from address jumpers [0..7])
    channel - relay number (id) [1..4]
    value   - relay state 1: turn ON, 0: turn OFF[0..1]

Return: 

     0 (Succes)
    -1 (Error)

Example : 

    # Set Relay 2 on Board 0 On    
    mol $ call 4relind-rpi.setRelay --stack 0 --channel 2 --value 1
    mol $ 0



## setAllRelays: 

    Set all relays On/Off

Usage       : 

    4relind-rpi.setAllRelays --stack <id> --value <value>

Params: 

    stack   - stack level of the 4-Relay card (selectable from address jumpers [0..7])
    value   - 4 bit value of all relays (ex: 15: turn on all relays, 0: turn off all relays, 1:turn on relay #1 and off the rest)

Return: 

     0 (Succes)
    -1 (Error)

Example     : 

    # Set Relay 1 and 2 on Board 0 On
    mol $ call 4relind-rpi.setAllRelays --stack 0 --value 3
    mol $ 0
    
    # If use api gateway
    POST http://localhost:3000/4relind-rpi.setAllRelays?
    Header
    {
        "Content-Type": "application/json"
    }
    
    Body
    {
        "stack": 0,
        "value": 15
    }


## getRelay: 

    Read relays status,

Usage   : 

    4relind-rpi.getRelay --stack <id> --channel <channel>

Params: 

    stack   - stack level of the 4-Relay card (selectable from address jumpers [0..7])
    channel - relay number (id) [1..4]

Return: 

     0 (OFF)
     1 (ON)

Example : 

    # Read Status of Relay 2 on Board 0
    mol $ call 4relind-rpi.getRelay --stack 0 --channel 2
    mol $ 1


## getAllRelays: 

    Read all relays status,

Usage   : 
    
    4relind-rpi.getAllRelays --stack <id> --channel <channel>

Params: 

    stack   - stack level of the 4-Relay card (selectable from address jumpers [0..7])
    channel - relay number (id) [1..4]

Return: 

    4 bit value of all relays [0..15]

Example : 

    # Read Status of All Relays on Board 0
    mol $ call 4relind-rpi.getAllRelays --stack 0
    mol $ 3


# Optos


## getOpto: 

    Read inputs status

Usage  :

    4relind-rpi.getOpto --stack <id> --channel <channel>

Params: 

    stack   - stack level of the 4-Relay card (selectable from address jumpers [0..7])
    channel - opto input channel number (id) [1..4]

Return: 

     0 (OFF)
     1 (ON)

Example: 

    # Read Status of Opto 2 on Board 0
    mol $ call 4relind-rpi.getOpto --stack 0 --channel 2
    mol $ 1

## getAllOptos: 

    Read all inputs status

Usage      : 

    4relind-rpi.getAllOptos --stack <id> 

Params: 

    stack   - stack level of the 4-Relay card (selectable from address jumpers [0..7])

Return: 

    4 bit value of all optos [0..15]

Example    : 

    #  Read Status of all Optos on Board 0
    mol $ call 4relind-rpi.getAllOptos --stack 0
    mol $ 3
