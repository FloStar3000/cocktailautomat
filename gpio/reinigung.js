var gpio = require('rpi-gpio')
var gpiop = gpio.promise;

var pins = [29,31,33,35,37,36]
var dirPins = [38,40]
var duration = 60
var reverseDuration = 6

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

const setPumps = async(state)=>{
	for( let i = 0; i<pins.length; i++){
		gpio.write(pins[i],state)
		await delay(1000)
	}
}

const setDir = dir =>{
	gpio.write(dirPins[0], dir)
	gpio.write(dirPins[1], dir)
}

;(async()=>{
	await setupPins()
	console.log("Setting Pumps to pump forward")
	await setPumps(false)
	await delay(duration*1000);
	console.log("Setting Pumps to low")
	await setPumps(true)
	await delay(3000)
	console.log("Switching direction")
	setDir(false)
	await setPumps(false)
	await delay(reverseDuration*1000)
	await setPumps(true)
}
)()
