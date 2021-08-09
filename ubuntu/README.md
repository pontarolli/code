
### One single command to update everything in Ubuntu.

```
sudo apt update -y && sudo apt full-upgrade -y && sudo apt autoremove -y && sudo apt clean -y && sudo apt autoclean -y
```

`update` - updates the list of packages but do not install.

`upgrade` - install new versions of packages if new versions are available.

`full-upgrade` - performs the function of upgrade but will remove currently installed packages if this is needed to upgrade the system as a whole (fixing bad dependencies then)

`autoremove`, `autoclean` and `clean` - clean old packages which are not needed any more.

option `-y` does not request for permission on every step
`&&` states that it just runs the next command if the previous was successfully executed.

### Network tools
ifconfig not working
```
sudo apt install net-tools
```

### Samba
Compartilhar pasta windows e rapsberry e tambem chamar pelo nome quando for usar comunicação ssh (pode ser convigurado um servidor dhcp para resolver o dns tambem)
```
sudo apt install samba -y
sudo nano /etc/samba/smb.conf
```

```bash
# smb.conf
[Public]
comment = Public folder from raspberry 
path = /home/pi/Public                 
create mask = 0777
directory mask = 0777
writable = true
security = share
browseable = true
public = yes
```

### GRUB
Alterar quem inicializa por padrão de Ubuntu para Windows
```bash
# Exemplo da tela que aparece ao iniciar o computador
# [0] Ubuntu
# [1] Windows 7
# [2] Windows 10

# Abrir terminal do ubuntu
$ sudo gedit /etc/default/grub

# Antes
GRUB_DEFAULT=0 (Ubuntu)
# Depois
GRUB_DEFAULT=2 (Windows)

# Atualizar o grub
sudo update-grub
```
### Node.js LTS (v14.x):

Using Ubuntu
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -

```bash

```

sudo apt-get remove nodejs




curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

//nao conseguia intalar node nem npm dai rodei isso e deu certo
wget -O - https://raw.githubusercontent.com/meech-ward/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash;
node -v;

sudo npm install -g npm@7.7.4

sudo chmod -R 777 Public

sudo npm i nodemon -g


Criar um usuário
1. No terminal digite o comando abaixo e não esqueça de trocar nomedousuario pelo nome que você deseja criar.

$ sudo adduser nomedousuario
Em seguida você precisará definir uma senha, por se tratar de um usuário que terá permissões root utilize uma senha bem forte. Em seguida você precisará preencher alguns dados opcionais do usuário, como não são obrigatórios você pode deixar vazio.

2. Agora vamos utilizar o comando usermod para adicionar o usuário no grupo sudo.

$ sudo usermod -aG sudo nomedousuario
3. Agora vamos testar o novo usuário criado e seus poderes como sudo.

$ su - nomedousuario
nomedousuario$ sudo ls -ls /root
Você precisará digitar a senha na primeira vez que utilizar o comando sudo sempre que iniciar uma nova sessão de terminal.

Extra: Remover um usuário
TL;DR;
$ sudo su -
$ userdel -r nomedousuario
1. Alternar para o usuário de root:

$ sudo su -
2. Use o comando userdel para remover o usuário antigo:

$ userdel nomedousuario
3. Você pode também excluir esse usuário e seu diretório inicial (/home/nomedousuario):

$ userdel -r nomedousuario



sudo usermod -aG sudo pi

sudo apt-get install wiringpi
gpio -v



git clone git@github.com:whatever folder-name

git clone https://github.com/SequentMicrosystems/megaioind-rpi.git 
cd megaioind-rpi/
sudo make install

If you clone the repository any update can be made with the following commands:

~$ cd megaioind-rpi/  
~/megaioind-rpi$ git pull
~/megaioind-rpi$ sudo make install




sudo raspi-config
habilitar i2c

https://www.raspberrypi-spy.co.uk/2014/11/enabling-the-i2c-interface-on-the-raspberry-pi/#:~:text=Method%201%20%E2%80%93%20Using%20%E2%80%9CRaspi%2Dconfig%E2%80%9D%20on%20Command%20Line&text=Highlight%20the%20%E2%80%9CI2C%E2%80%9D%20option%20and,activate%20%E2%80%9C%E2%80%9D.&text=The%20Raspberry%20Pi%20will%20reboot%20and%20the%20interface%20will%20be%20enabled.

STACK LEVEL: 0
I2C ADDRESS: 0x50

sudo i2cdetect -y 1


sudo apt-get install virtualbox-guest-dkms

### Manipulando pastas
Remover pasta e seus subdiretorios e arquivos 
`rm -r nomepasta`