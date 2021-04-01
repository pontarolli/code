"use strict";

const { ServiceBroker } = require("moleculer"),
i2c                     = require('i2c-bus'), 	// Npm Packages i2c-bus
i2c1                    = i2c.openSync(1), 		// Start i2c communication
MEGAIO_HW_I2C_BASE_ADD  = 0x38,  // Adress i2c do mega-io-ind
U0_10_OUT_VAL1_ADD      = 0x17,  // Address of first output channel from 0 to 10V
I4_20_IN_VAL1_ADD       = 0x0f,  // Address of first input  channel from 4 to 20mA
U0_10_IN_VAL1_ADD 		= 0x27;	 // Address of first input  channel from 0 to 10V

const RELAY_MEM_ADD = 0x00;     //Endereço de controle de todos os Relays

const broker = new ServiceBroker({
	namespace: "dev",
	nodeID: "megaio-node 2",

	logger: true,
	logLevel: "info",
	logFormatter: "default",

	transporter: "nats://localhost:4222",
	//transporter: "nats://192.168.0.102:4222",
	cacher: "Memory",

	serializer: null,

	requestTimeout: 0 * 1000,
	requestRetry: 0,
	maxCallLevel: 0,
	heartbeatInterval: 5,
	heartbeatTimeout: 15,

	disableBalancer: false,

	registry: {
		strategy: "RoundRobin",
		preferLocal: true
	},

	circuitBreaker: {
		enabled: false,
		maxFailures: 3,
		halfOpenTime: 10 * 1000,
		failureOnTimeout: true,
		failureOnReject: true
	},

	validation: true,
	validator: null,
	metrics: false,
	metricsRate: 1,
	statistics: false,
	internalActions: true,

	hotReload: false
});

// Create a Mongoose service for `post` entities
broker.createService({
	name: "daq",
	settings: {
				// Use bodyparser module
				bodyParsers: {
					json: true,
					urlencoded: { extended: true }
				}


	},
	/**
	 * Actions
	 */
	actions: {
				
		/**
		 * ação 
		 *
		 * wuout()
		 * 
		 * Writes the four voltage output channels from 00.00% to 100.00%
		 * And transforms this value from 0 to 10,000 to be written in memory
		 * Which represents the same thing from 0 to 10V
		 * 
		 * Example: If you want to write 5V (50% of range 0 to 10V) on channel 1
		 * 
		 * Just use this path in the browser
		 * http://192.168.0.100:3000/daq/wuout?channel=1&value=50
		 * 
		 * *****************************************************************************************/
		wuout(ctx) { 	
		
		var valor=(Number(ctx.params.value)*100);
		valor=parseInt(valor);
		console.log(valor);
		i2c1.writeWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2 * (Number(ctx.params.channel)-1),valor);
		 //valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
		 //console.log(valor);
			return broker.call("daq.ruout",{ channel : ctx.params.channel })
		},
		/********************************************************************************************
		 * ação 
		 *
		 * wuout_10()
		 * 
		 * Writes the four voltage output channels from 0 to 10V
		 * And transforms this value from 0 to 10,000 to be written in memory
		 * Which represents the same thing from 0 to 10V
		 * 
		 * Example: If you want to write of range 0 to 10.00V on channel 1
		 * 
		 * Just use this path in the browser
		 * http://192.168.0.100:3000/daq/wuout_10?channel=1&value=5.00
		 * 
		 * *****************************************************************************************/
		wuout_10(ctx) 
		{ 	
			var valor=(Number(ctx.params.value)*1000);
			valor=parseInt(valor);
			console.log(valor/1000);
			i2c1.writeWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2 * (Number(ctx.params.channel)-1),valor);
			 //valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
			 //console.log(valor);
			return broker.call("daq.ruout_10",{ channel : ctx.params.channel })
		},
		/******************************************************************************************
		 * ruin()
		 * 
		 * It reads the four tenon input channels from 0 to 10V.
		 * 
		 * http://192.168.0.100:3000/daq/rcuin
		 *  
		 * *****************************************************************************************/
		rcuin()
		{
			let rcuin = [];

			for(let i=0; i<4; ++i){ 
				rcuin[i] = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((i+1)-1)))/100).toFixed(2));
			}
			return {rcuin:rcuin};

		},
		/******************************************************************************************
		 * ruin()
		 * 
		 * Reads the four voltage output channels from 0 to 10V.
		 * 
		 * http://192.168.0.100:3000/daq/ruin?channel=1
		 * 
		 * *****************************************************************************************/
		ruin(ctx)
		{
			let channel= Number(ctx.params.channel);
			let valor=0;

			var ruin = {}; //Cria o objeto vazio 

			ruin.filtro = function(channel)
			{
        		this.channel = channel;
				if(channel>=1 && channel<=4)
				{ 
            		return true;
        		}
				else
				{
            		return "Numero invalido: digite um numero >= 1 e <=4 inteiro";
        		}
    		}

			//chama o metodo filtro para verificar se o valore digitado esta correto
			if(ruin.filtro(channel)==true)
			{
                   
            	if(channel==1)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
				}
				if(channel==2)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));	
				}
				if(channel==3)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
				}
				if(channel==4)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
				}
					
				return valor
			
			}
			else
			{
				return ruin.filtro(channel); //se o usuario digitou algum numero errado retorne as mensagens de erro
			}
			

		},
		/******************************************************************************************
		 * ruin_10()
		 * 
		 * Reads the four voltage output channels from 0 to 10V.
		 * 
		 * http://192.168.0.100:3000/daq/ruin_10?channel=1
		 * 
		 * *****************************************************************************************/
		ruin_10(ctx)
		{
			let channel= Number(ctx.params.channel);
			let valor=0;

			var ruin_10 = {}; //Cria o objeto vazio 

			ruin_10.filtro = function(channel)
			{
        		this.channel = channel;
				if(channel>=1 && channel<=4)
				{ 
            		return true;
        		}
				else
				{
            		return "Numero invalido: digite um numero >= 1 e <=4 inteiro";
        		}
    		}

			//chama o metodo filtro para verificar se o valor digitado esta correto
			if(ruin_10.filtro(channel)==true)
			{
                   
            	if(channel==1)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));
				}
				if(channel==2)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));	
				}
				if(channel==3)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));
				}
				if(channel==4)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_IN_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));
				}
					
				return valor
			
			}
			else
			{
				return ruin_10.filtro(channel); //se o usuario digitou algum numero errado retorne as mensagens de erro
			}
			

		},


		/******************************************************************************************
		 * rcuout()
		 * 
		 * Reads the four voltage output channels from 0 to 10V.
		 * 
		 * http://192.168.0.100:3000/daq/rcuout
		 * 
		 * *****************************************************************************************/
		rcuout(){
			let ruout = [];

			for(let i=0; i<4; ++i){ 
				ruout[i] = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((i+1)-1)))/100).toFixed(2));
			}
		return {ruout: ruout}
		},
        /******************************************************************************************
		 * ruout()
		 * 
		 * Reads the four voltage output channels from 0 to 10V.
		 * 
		 * Função que leitura de tensão dos canais analogicos de saida de forma individual 
		 * 
		 * http://192.168.0.100:3000/daq/ruout?channel=1
		 * 
		 * *****************************************************************************************/
		ruout(ctx){
			
			let channel= Number(ctx.params.channel);
			let valor=0;

			var ruout = {}; //Cria o objeto vazio 

			ruout.filtro = function(channel)
			{
        		this.channel = channel;
				if(channel>=1 && channel<=4)
				{ 
            		return true;
        		}
				else
				{
            		return "Numero invalido: digite um numero >= 1 e <=4 inteiro";
        		}
    		}

			//chama o metodo filtro para verificar se o valore digitado esta correto
			if(ruout.filtro(channel)==true)
			{
                   
            	if(channel==1)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));	
				   
				}
				if(channel==2)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));	
				}
				if(channel==3)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
				}
				if(channel==4)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/100).toFixed(2));
				}
					
				return valor
			
			}
			else
			{
				return ruout.filtro(channel); //se o usuario digitou algum numero errado retorne as mensagens de erro
			}
							
				
		},
		/******************************************************************************************
		 * ruout_10()
		 * 
		 * Reads the four voltage output channels from 0 to 10V.
		 * 
		 * Função que leitura de tensão dos canais analogicos de saida de forma individual 
		 * 
		 * http://192.168.0.100:3000/daq/ruout?channel=1
		 * 
		 * *****************************************************************************************/
		ruout_10(ctx){
			
			let channel= Number(ctx.params.channel);
			let valor=0;

			var ruout_10 = {}; //Cria o objeto vazio 

			ruout_10.filtro = function(channel)
			{
        		this.channel = channel;
				if(channel>=1 && channel<=4)
				{ 
            		return true;
        		}
				else
				{
            		return "Numero invalido: digite um numero >= 1 e <=4 inteiro";
        		}
    		}

			//chama o metodo filtro para verificar se o valore digitado esta correto
			if(ruout_10.filtro(channel)==true)
			{
                   
            	if(channel==1)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));	
				   
				}
				if(channel==2)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));	
				}
				if(channel==3)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));
				}
				if(channel==4)
				{
					valor = parseFloat(((i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, U0_10_OUT_VAL1_ADD + 2*((channel)-1)))/1000).toFixed(2));
				}
					
				return valor
			
			}
			else
			{
				return ruout_10.filtro(channel); //se o usuario digitou algum numero errado retorne as mensagens de erro
			}
							
				
		},
		
		/******************************************************************************************
		 * riin()
		 * 
		 * It reads the four current input channels from 4 to 20ma.
		 * The sensor curve was corrected as the plates came out of calibration.
		 * 
		 * http://192.168.1.201:3005/api/daq/riin
		 * 
		 * *****************************************************************************************/
		riin (){

			 let riin = []; 
						
			 for(let i=0; i<4; ++i){ // percorre as respectivas memorias dos quatro canais
				 riin[i] = (i2c1.readWordSync(MEGAIO_HW_I2C_BASE_ADD, I4_20_IN_VAL1_ADD + 2*((i+1)-1)));
			 }
 
			 // correcting sensor curve and already moving to mA
			 riin[0] = parseFloat((0.8988*riin[0]/1000 + 0.3467).toFixed(2));  // pit129
			 riin[1] = parseFloat((0.8080*riin[1]/1000 + 0.7153).toFixed(2));  // pit118
			 riin[2] = parseFloat((0.8065*riin[2]/1000 + 0.7480).toFixed(2));  // lit125
			 riin[3] = parseFloat((0.8095*riin[3]/1000 + 0.8537).toFixed(2));  // fit116

			 
			/******************************************************************************************
			 * Forehead assigning value according to position in range
			 * values ​​less than 4mA will assume the value of 4mA. Example 1.2ma will be 4ma
			 * values ​​from 4 to 20 are themselves. Example 4.75ma will be 4.75ma
			 * values ​​greater than 20mA will assume the value of 20mA. Example 25.45ma will be 20ma
			 * 
			 * 
			 *     Numeric current range
			 *    
			 *     <4             >= 4                          <=20          >20
			 *      ...------------o-----------------------------o------------...
			 *                     4                             20
			 * 
			 *     Valoers that will take on these intervalor
			 *                                                  
			 *      4      4       4    5,34   8,45   15,12      20    20   20   20  20 
			 ******************************************************************************************/
	
			 for(let i=0; i<4; ++i)
			 {  
				 switch (true) {
					 case (riin[i] < 4):
					   riin[i] = 4;
					   break;
					 case (riin[i] >= 4 && riin[i] <= 20): 
					   riin[i] = riin[i];
					   break;
					 case (riin[i] > 20): 
					 riin[i] = 20;
					   break;
				}
				 riin[i] = parseFloat(((riin[i] - 4)/0.16).toFixed(2));
			 }
		return {riin: riin}
		},
		
		/******************************************************************************************
		 * wrelay()
		 * 
		 * escreve na saidas a rele do megaio.
		 * 
		 * http://192.168.0.100:3000/daq/wrelay?numero=1&estado=1
		 *  
		 * *****************************************************************************************/
		wrelay (ctx)
		{
			
			var numero= Number(ctx.params.numero);
			var estado =Number(ctx.params.estado);
			
			
			var Rele = {}; //Cria o objeto vazio Rele para criar seus metodos na sequencia

			//verifica se o usuario digitou o numero do rele corretamente e o estado tambem
			Rele.filtro = function(numero,estado)
			{
				this.numero = numero;
				this.estado = estado;
				if(numero>=1 && numero<=4)
				{ //se o numero do rele digitado estiver entre 1 e 8
					if(estado==0 || estado==1)
					{//se o estado do rele for 0 ou 1
						return true;
					}
					else
					{
						return "Numero estado invalido digite valor entre 0 e 1";
					}
				}
				else
				{
					return "Numero rele invalido digite valor entre 1 e 4";
				}
			}

			//liga ou desliga o rele conforme o valor recebido no navegador
			
				//chama o metodo filtro para verificar se os valores digitados estao corretos
				//se for verdade executa a escrita na memoria para controlar o rele
				if(Rele.filtro(numero,estado)==true)
				{
					
					console.log(numero, estado);
					const MEGAIO_ADDR = 0x38;       //Endereço do Megaio para uma até quatro placas 0x31, 0x32, 0x33, 0x34
					const RELAY_MEM_ADD = 0x00;     //Endereço de controle de todos os Relays
				
									
					let memoriaNumero = i2c1.readByteSync(MEGAIO_ADDR, RELAY_MEM_ADD);//faz a leitura do valor atual da memoria e salva em memoriaNumero
								
					console.log(memoriaNumero);
					
					let memoriaArranjo = [0,0,0,0,0,0,0,0];//Cria um arranjo de 8 bits para salvar o valor atual da memoria que foi lida
			
					for (let i = 0; i < 8; ++i) //Transforma o valor lido na memoria em um arranjo e salva em memoriaArranjo
					{
						memoriaArranjo[7-i] = (memoriaNumero >> i) & 1; //desloca i bits a direita e faz a operaçao bitwise & 1
					}
			
					memoriaArranjo[(8-numero)] = estado; //coloca 1 ou 0 no rele desejado
					
					let arranjoParanumero = parseInt(memoriaArranjo.join(''), 2); //junta gruda os bits do arranjo e transforma ele em um numero inteiro binario
			
					i2c1.writeByteSync(MEGAIO_ADDR, RELAY_MEM_ADD, (arranjoParanumero)); //faz a escrita na memoria
					
					//return ("Relay " + numero + ": " + memoriaArranjo[8-numero] ); //mostra o estado do rele
					return broker.call("daq.rrelay",{ numero : numero })
				}
				else
				{
					return Rele.filtro(numero); //se o usuario digitou algum numero errado retorne as mensagens de erro
				}
			
		       
   
		},
		/******************************************************************************************
		 * rrelay()
		 * 
		 * função que lê as 4 saidas a relê simultaneamennte 
		 * 
		 * http://192.168.0.100:3000/daq/rsrelay
		 *  
		 * *****************************************************************************************/
		rsrelay()
		{
			const MEGAIO_ADDR = 0x38;       //Endereço do Megaio para uma até quatro placas 0x31, 0x32, 0x33, 0x34
		    				
								
			let memoriaArranjo = [0,0,0,0];//Cria um arranjo de 8 bits para salvar o valor atual da memoria que foi lida
        	let memoriaNumero = i2c1.readByteSync(MEGAIO_ADDR, RELAY_MEM_ADD);//Faz a leitura do valor do rele na memoria do megaio
			//transforma o valor lido em um arranjo
        	for (let i = 0; i < 4; ++i) {
            	memoriaArranjo[i] = (memoriaNumero >> i) & 1; //faz o deslocamento de i bits para direita e depois faz a operação bitwise para descobrir qual o seu valor naquela posição especifica
           
        	}
			
			return memoriaArranjo;

		},
		/******************************************************************************************
		 * rrelay()
		 * 
		 * função que lê as 4 saidas a relê simultaneamennte 
		 * 
		 * http://192.168.0.100:3000/daq/rrelay?numero=1
		 *  
		 * *****************************************************************************************/
		rrelay(ctx)
		{
			const MEGAIO_ADDR = 0x38;       //Endereço do Megaio para uma até quatro placas 0x31, 0x32, 0x33, 0x34
			var numero= Number(ctx.params.numero);
			
			var rrelay = {}; //Cria o objeto vazio 
			
    		//verifica se o usuario digitou o numero do IOo corretamente
			rrelay.filtro = function(numero)
			{
        		this.numero = numero;
				if(numero>=1 && numero<=4)
				{ 
            		return true;
        		}
				else
				{
            		return "Numero invalido: digite um numero >= 1 e <=6 inteiro";
        		}
    		}

    		//Faz a leitura IOo no canal recebido no navegador
			
        		let valor=0;
				
        		//chama o metodo filtro para verificar se o valore digitado esta correto
				if(rrelay.filtro(numero)==true)
				{
                   
            		//const i2c1 = i2c.openSync(1);   //inicia a comunicação sincrona i2c

            		//let memoriaNumero = parseInt(i2c1.readByteSync(MEGAIO_ADDR, OPTO_VAL_ADD));//Faz a leitura do valor do rele na memoria do megaio
					let memoriaNumero = i2c1.readByteSync(MEGAIO_ADDR, RELAY_MEM_ADD);//Faz a leitura do valor do rele na memoria do megaio
					console.log(memoriaNumero);
            		//i2c1.closeSync();
					if(numero==1)
					{
						memoriaNumero=memoriaNumero & 0x01;
						if( memoriaNumero==1)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}

					}
					if(numero==2)
					{
						memoriaNumero=memoriaNumero & 0x02;
						if( memoriaNumero==2)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}
					}
					if(numero==3)
					{
						memoriaNumero=memoriaNumero & 0x04;
						if( memoriaNumero==4)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}


					}
					if(numero==4)
					{
						memoriaNumero=memoriaNumero & 0x08;
						if( memoriaNumero==8)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}


					}
					
					
					
				
					return valor
				}
				else
				{
					return rrelay.filtro(numero); //se o usuario digitou algum numero errado retorne as mensagens de erro
				}
								
		},
		/******************************************************************************************
		 * woc()
		 * 
		 * escreve na saidas a rele do megaio.
		 * 
		 * http://192.168.0.100:3000/daq/woc?numero=1&estado=1
		 *  
		 * *****************************************************************************************/
		woc (ctx)
		{
			
			var numero= Number(ctx.params.numero);
			var estado =Number(ctx.params.estado);
			
			console.log("teste");
			var oc = {}; //Cria o objeto vazio de saida de coletor aberto para criar seus metodos na sequencia

			//verifica se o usuario digitou o numero da saida de coletor aberto corretamente e o estado tambem
			oc.filtro = function(numero,estado)
			{
				this.numero = numero;
				this.estado = estado;
				if(numero>=1 && numero<=4)
				{ //se o numero do saida de coletor aberto digitado estiver entre 1 e 4
					if(estado==0 || estado==1)
					{//se o estado da saida de coletor aberto for 0 ou 1
						return true;
					}
					else
					{
						return "Numero estado invalido digite valor entre 0 e 1";
					}
				}
				else
				{
					return "Numero rele invalido digite valor entre 1 e 4";
				}
			}

			//liga ou desliga a saida de coletor aberto conforme o valor recebido no navegador
			//chama o metodo filtro para verificar se os valores digitados estao corretos
			//se for verdade executa a escrita na memoria para controlar o rele
			if(oc.filtro(numero,estado)==true)
			{
					
				console.log(numero, estado);
				const MEGAIO_ADDR = 0x38;       //Endereço do Megaio para uma até quatro placas 0x31, 0x32, 0x33, 0x34
				const OC_VAL_ADD  = 0x03;     //Endereço de controle de todos os Coletor Aberto
				
									
				let memoriaNumero = i2c1.readByteSync(MEGAIO_ADDR, OC_VAL_ADD);//faz a leitura do valor atual da memoria e salva em memoriaNumero
								
				console.log(memoriaNumero);
			
				
				let memoriaArranjo = [0,0,0,0,0,0,0,0];//Cria um arranjo de 8 bits para salvar o valor atual da memoria que foi lida
			
				for (let i = 0; i < 8; ++i) //Transforma o valor lido na memoria em um arranjo e salva em memoriaArranjo
				{
					memoriaArranjo[7-i] = (memoriaNumero >> i) & 1; //desloca i bits a direita e faz a operaçao bitwise & 1
				}
			
				memoriaArranjo[(8-numero)] = estado; //coloca 1 ou 0 no rele desejado
					
				let arranjoParanumero = parseInt(memoriaArranjo.join(''), 2); //junta gruda os bits do arranjo e transforma ele em um numero inteiro binario
			
				i2c1.writeByteSync(MEGAIO_ADDR, OC_VAL_ADD, (arranjoParanumero)); //faz a escrita na memoria
					
				//return ("Relay " + numero + ": " + memoriaArranjo[8-numero] ); //mostra o estado do rele
				return broker.call("daq.roc",{ numero : numero });
			}
			else
			{
					return oc.filtro(numero); //se o usuario digitou algum numero errado retorne as mensagens de erro
			}
		},
		/******************************************************************************************
		 * ropto()
		 * 
		 * Lê as entradas optoacopladas do megaio ind.
		 * 
		 * http://192.168.0.100:3000/daq/ropto?numero=1
		 *  
		 * *****************************************************************************************/
		ropto(ctx)
		{
			
			var numero= Number(ctx.params.numero);
			
			const MEGAIO_ADDR = 0x38;       //Endereço do Megaio para uma até quatro placas 0x31, 0x32, 0x33, 0x34
    
			const OPTO_VAL_ADD = 6;
			//const GPIO_VAL_MEM_ADD = 0x19;  
    
    		var IO = {}; //Cria o objeto vazio IOo para criar seus metodos na sequencia
			//console.log(numero);
    		//verifica se o usuario digitou o numero do IOo corretamente
			IO.filtro = function(numero)
			{
        		this.numero = numero;
				if(numero>=1 && numero<=4)
				{ 
            		return true;
        		}
				else
				{
            		return "Numero invalido: digite um numero >= 1 e <=6 inteiro";
        		}
    		}

    		//Faz a leitura IOo no canal recebido no navegador
			
        		let valor=0;
				
        		//chama o metodo filtro para verificar se o valore digitado esta correto
				if(IO.filtro(numero)==true)
				{
                   
            		//const i2c1 = i2c.openSync(1);   //inicia a comunicação sincrona i2c

            		//let memoriaNumero = parseInt(i2c1.readByteSync(MEGAIO_ADDR, OPTO_VAL_ADD));//Faz a leitura do valor do rele na memoria do megaio
					let memoriaNumero = i2c1.readByteSync(MEGAIO_ADDR, OPTO_VAL_ADD);//Faz a leitura do valor do rele na memoria do megaio
					console.log(memoriaNumero);
            		//i2c1.closeSync();
					if(numero==1)
					{
						memoriaNumero=memoriaNumero & 0x01;
						if( memoriaNumero==1)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}

					}
					if(numero==2)
					{
						memoriaNumero=memoriaNumero & 0x02;
						if( memoriaNumero==2)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}
					}
					if(numero==3)
					{
						memoriaNumero=memoriaNumero & 0x04;
						if( memoriaNumero==4)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}


					}
					if(numero==4)
					{
						memoriaNumero=memoriaNumero & 0x08;
						if( memoriaNumero==8)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}


					}
					
					
					
				
					//return valor
					return Number(valor)
				}
				else
				{
					return IO.filtro(numero); //se o usuario digitou algum numero errado retorne as mensagens de erro
				}
			
 
    
		},
		/******************************************************************************************
		 * roc()
		 * 
		 * Lê as saidas de coletor aberto do megaioind.
		 * 
		 * http://192.168.0.100:3000/daq/roc?numero=1
		 *  
		 * *****************************************************************************************/
		roc (ctx)
		{
			
			var numero= Number(ctx.params.numero);
						
			
			//console.log("teste");
			var roc = {}; //Cria o objeto vazio de saida de coletor aberto para criar seus metodos na sequencia

			//verifica se o usuario digitou o numero da saida de coletor aberto corretamente e o estado tambem
			roc.filtro = function(numero)
			{
				this.numero = numero;
				
				if(numero>=1 && numero<=4)
				{ //se o numero do saida de coletor aberto digitado estiver entre 1 e 4
					
					return true;
					
				}
				else
				{
					return "Numero rele invalido digite valor entre 1 e 4 ";
				}
			}

			//liga ou desliga a saida de coletor aberto conforme o valor recebido no navegador
			//chama o metodo filtro para verificar se os valores digitados estao corretos
			//se for verdade executa a escrita na memoria para controlar o rele
			if(roc.filtro(numero)==true)
			{
					
				//console.log(numero);
				const MEGAIO_ADDR = 0x38;       //Endereço do Megaio para uma até quatro placas 0x31, 0x32, 0x33, 0x34
				const OC_VAL_ADD  = 0x03;     //Endereço de controle de todos os Coletor Aberto
				let valor=0;
				
        		//chama o metodo filtro para verificar se o valore digitado esta correto
				if(roc.filtro(numero)==true)
				{
                   
            		//const i2c1 = i2c.openSync(1);   //inicia a comunicação sincrona i2c

            		//let memoriaNumero = parseInt(i2c1.readByteSync(MEGAIO_ADDR, OPTO_VAL_ADD));//Faz a leitura do valor do rele na memoria do megaio
					let memoriaNumero = i2c1.readByteSync(MEGAIO_ADDR, OC_VAL_ADD);//Faz a leitura do valor do rele na memoria do megaio
					//console.log(memoriaNumero);
            		//i2c1.closeSync();
					if(numero==1)
					{
						memoriaNumero=memoriaNumero & 0x01;
						if( memoriaNumero==1)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}

					}
					if(numero==2)
					{
						memoriaNumero=memoriaNumero & 0x02;
						if( memoriaNumero==2)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}
					}
					if(numero==3)
					{
						memoriaNumero=memoriaNumero & 0x04;
						if( memoriaNumero==4)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}


					}
					if(numero==4)
					{
						memoriaNumero=memoriaNumero & 0x08;
						if( memoriaNumero==8)
						{
							valor=1;
						}
						else
						{
							valor=0;
						}


					}
					
					
					process.stdout.write(valor+'\n')	
					//var buf = new Buffer(valor+"\n"+"\0", "ascii");
					//return valor;
					//var saida= `${valor}\n`;
					
					//var texto = '{"atributo1":"valor 1", "atributo2": 23}'};

					//var objeto = JSON.stringify(texto, null, '\t');

					//var objeto=JSON.stringify({ uno: 1, dos: 2 }, null, '\t');
					/*
					const users = [	
  									{name: 'Jones', email: 'jones@gmail.com'}, 
  									{name: 'Henrique', email: 'henrique@hotmail.com'}
								]*/
					return valor				


					
				}							
			}
			else
			{
					return roc.filtro(numero); //se o usuario digitou algum numero errado retorne as mensagens de erro
			}
		},
		/******************************************************************************************
		 * data()
		 * 
		 * Calls all reading services and stores their values ​​in attributes.
		 * Used to display all values ​​read in percent (%) format at one time in a structured way.	
		 * 
		 * http://192.168.1.201:3005/api/daq/data
		 * 	 
		 * ****************************************************************************************/	
		data() 
		{ 									 // Ação data()
			return {ruout: broker.call("daq.ruout"), // Chama o serviço daq.ruout
					riin : broker.call("daq.riin"),  // Chama o serviço daq.riin
					ruin : broker.call("daq.ruin")}; // Chama o serviço daq.ruin
		},
		
	},

	
});
broker.start();
broker.repl();
