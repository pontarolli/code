Windows acessando a raspberrypi remotamente(depois fazer com linux)

Primeiro tente acessar a raspberrypi pelo terminal normalmente
ssh pi@raspberrypi.local
ssh pi@raspberrypi (se tiver rodando o samba ja, ou configurado um servidor dhcp dns)

Se não conseguir acessar scaneie por ips novos na sua rede.
```
sudo apt install net-tools
ifconfig
nmap -sn 10.0.0.0/24
ssh pi@10.0.0.14
```

Senha
raspberrypi

Caso não consiga usar Instalar openssh

Automatizando o acesso para não ter que digitar nada no visual studio code ou no terminal apenas

No terminal criar um par de chaves publica e privada com o nome raspberrypi, so ir dando enter
`ssh-keygen -f raspberrypi`

Serão salvos
C:\Users\%USERNAME%\.ssh

Chave privada (arquivo sem extenção)
raspberrypi

Chave publica
raspberrypi.pub

Mandar essa chave para a raspberrypi ela sera enviada para dentro do arquivo ~/.ssh/authorized_keys. Observação caso não aceite esse comando instale o git, e/use o terminal bash
`ssh-copy-id -i raspberrypi.pub pi@raspberrypi`

Crie um arquivo chamado config em `C:\Users\%USERNAME%\.ssh`
```
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
# Host <NICK_NAME>
#      HostName <IP ADDRESS OF REMOTE>
#      IdentityFile <PATH TO PRIVATE FILE>
#      User <LOGIN AS USERNAME>
#      Port <SSH PORT TO USE>
#      LocalForward <LOCAL PORT>  <REMOTE_LOCATION:PORT>

Host pi
     HostName raspberrypi
     User pi
     PreferredAuthentications publickey
     IdentityFile "C:\Users\%USERNAME%\.ssh\raspberrypi"
     Port 22
```

Agora voce pode acessar a raspberry pi com seu apelido configurado 
`ssh pi` sem ter que digitar senha alguma.

Para acessar as pastas so instalar extenção do vscode `Remote - SSH `