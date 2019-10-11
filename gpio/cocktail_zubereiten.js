var gpio = require('rpi-gpio')
var gpiop = gpio.promise;

var pins = [36,37,35,33,31,29]
var dirPins = [38,40]
var reverseDuration = 6
const amounts = []
for(let i = 2; i<8;i++){
	let amount = parseInt(process.argv[i])
	if(!amount){amount = 0}
	amounts.push(amount) 
} 
console.log("amounts:",amounts)
const mltomsfactor = 370
const preruntime = 3000
var pumpsReady = [false,false,false,false,false,false]

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const setupPins = async ()=>{
	await gpiop.setup(dirPins[0], gpio.DIR_HIGH)
	await gpiop.setup(dirPins[1], gpio.DIR_HIGH)
	for(let i = 0; i<pins.length; i++){
		await gpiop.setup(pins[i], gpio.DIR_HIGH)
	}
	console.log("All Pins setup up ");
}

const setPump = (pumpNo, state)=>{
	gpio.write(pins[pumpNo],state)
}
 

const setDir = dir =>{
	gpio.write(dirPins[0], dir)
	gpio.write(dirPins[1], dir)
}

const pumpFinished = (pumpNo)=>{
	console.log(`Pump ${pumpNo} finished`)
	setPump(pumpNo, true)
	pumpsReady[pumpNo] = true
	allPumpsFinished = true
	pumpsReady.forEach(p=>{if(p!==true){allPumpsFinished = false}})
	if(allPumpsFinished){pumpsAreFinished()}
}

const pumpsAreFinished = async ()=>{
	console.log("All pumps are finished Beginning flush")
	setDir(false)
	await delay(250)
	for(let i = 0; i<6; i++){
		setPump(i,false)
		await delay(250)
	}
	await delay(3000)
	for(let i = 0; i<6; i++){
		setPump(i,true)
		await delay(250)
	}
	await delay(250)
	setDir(true)
	process.exit()
}



;(async()=>{
	await setupPins()
	console.log("Starting with Cocktail");
	
	for(let i = 0; i<6; i++){
		if(amounts[i]<= 0){
			pumpsReady[i] = true
		}
		else{
		setPump(i, false)
		setTimeout(()=>pumpFinished(i),mltomsfactor*amounts[i]+preruntime)
		await delay(250)
		}
	}
}
)()


