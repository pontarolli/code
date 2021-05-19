### Acessando a raspberrypi remotamente

Deescrição: Com a extenção Remote SSH desenvolvida pela Microsoft do visual studio code é possivel acessar o terminal e as pastas da raspberrypi dentro do vscode de maneira automatica utilizando os pares de chave pública e privada.

Em um computador com Sistema operacional Windows

1.   Instale o openssh

2.   Acesse a raspberrypi pelo terminal com a senha `raspberrypi` ou `raspberry`
     `ssh pi@raspberrypi.local`
     `ssh pi@raspberrypi`
     `ssh pi@192.168.1.xx`

3.   Desconecte-se da raspberrypi `$ exit`     

4.   Crie um par de chaves publica e privada com o nome que desejar, primeiro va até a pasta onde deseja salvar ``cd ~/.ssh`, neste caso coloquei raspberrypi `ssh-keygen -f raspberrypi`.
     As chaves serão salvas em `C:\Users\%USERNAME%\.ssh` onde Chave privada (arquivo sem extenção) `raspberrypi` e Chave publica `raspberrypi.pub`

5.   Enviar essa chave para a raspberrypi, ela sera enviada para dentro do arquivo `~/.ssh/authorized_keys`. 
     `ssh-copy-id -i raspberrypi.pub pi@raspberrypi`
     Observação caso não aceite esse comando instale o git, e/use o terminal bash

6.   Criar um arquivo chamado config em `C:\Users\%USERNAME%\.ssh`

```console 
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

7.   Acesse a raspberry pi com seu apelido configurado 
`ssh pi` sem ter que digitar senha alguma.

Para acessar as pastas so instalar extenção do vscode `Remote - SSH` e clicar no botão de + e iniciar uma nova conexão `ssh pi@raspberrypi`