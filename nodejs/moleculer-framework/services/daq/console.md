```bash
pi@raspberrypi:~/Public/megaind-rpi $ megaind -h
        -v              Display the megaind command version number
        -h              Display the list of command options or one command option details
        -warranty       Display the warranty
        -list:          List all megaind boards connected
                        return the # of boards and stack level for every board
        board           Display the board status and firmware version number
        optord:         Read dry opto status
        countrd:        Read dry opto transitions count
        countrst:       Reset opto transitions countors
        edgerd:         Read opto inputs transitions type, ret 0 - disable, 1 - rising, 2 - falling, 3 - both
        edgewr:         Writ opto inputs transitions type: 0 - disable, 1 - rising, 2 - falling, 3 - both
        uoutrd:         Read 0-10V Output voltage value(V)
        uoutwr:         Write 0-10V output voltage value (V)
        ioutrd:         Read 4-20mA Output current value (mA)
        ioutwr:         Write 4-20mA output value (mA)
        odrd:           Read open-drain Output PWM value(0..100%)
        odwr:           Write open-drain output PWM value (0..100%)
        uinrd:          Read 0-10V input value (V)
        pmuinrd:                Read +/-10V input value (V). Warning: This value is valid only if the corespondung jumper is connected
        iinrd:          Read 4-20mA input value (mA)
        uincal:         Calibrate one 0-10V input channel, the calibration must be done in 2 points at min 5V apart
        iincal:         Calibrate one 4-20mA input channel, the calibration must be done in 2 points at min 10mA apart
        uincalrst:      Reset the calibration for one 0-10V input channel
        iincalrst:      Reset the calibration for one 4-20mA input channel
        uoutcal:                Calibrate one 0-10V output channel, the calibration must be done in 2 points at min 5V apart
        ioutcal:                Calibrate one 4-20mA output channel, the calibration must be done in 2 points at min 10mA apart
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
pi@raspberrypi:~/Public/megaind-rpi $ megaind -list
1 board(s) detected
Id: 0
pi@raspberrypi:~/Public/megaind-rpi $ megaind board
Invalid command option
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
Type megaind -h <command> for more help
```