var gpio = require('rpi-gpio')
var gpiop = gpio.promise;

const pin = parseInt(process.argv[2])
const state = process.argv[3] == "true"

console.log(`Writing pin ${pin} to state ${state}`)
 
gpiop.setup(pin, gpio.DIR_OUT)
    .then(() => {
       return  gpio.write(pin, state)
    })
    .catch((err) => {
        console.log('Error: ', err.toString())
    })
