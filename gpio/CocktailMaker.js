// const gpio = require("rpi-gpio");
// const gpiop = gpio.promise;
const {pumpPins,directionPins,pumpCount,mltomsFactor,prerunTime,flushTime,negatePins} = require("../data/pinConfig")
const delay =(ms) => new Promise(resolve => setTimeout(resolve, ms))

const gpio = {
    write : (pin,state)=>console.log("Writing Pin ",pin,"to state",state),
    DIR_HIGH:"high",
    DIR_LOW:"low",
}

const gpiop = {
    setup: (pin,state)=>console.log("Setup Pin ",pin,"to state",state)
}

class CocktailMaker{
    constructor(){
        this.setup = async ()=>{
            await gpiop.setup(directionPins[0], gpio.DIR_HIGH)
            await gpiop.setup(directionPins[1], gpio.DIR_HIGH)
            for(let i = 0; i<pumpPins.length; i++){
                await gpiop.setup(pumpPins[i], gpio.DIR_HIGH)
            }
        }
        this.makeCocktail = async (amounts)=>{
            const durations = amounts.map(a=>mltomsFactor*a+prerunTime)
            let highestDuration = 0
            durations.forEach(d=>{if(d>highestDuration)highestDuration=d})
            for(let i = 0; i<pumpPins.length;i++){
                if(!amounts[i]) continue
                if(amounts[i]>0){
                    gpio.write(pumpPins[i],!negatePins[i])
                    setTimeout(()=>gpio.write(pumpPins[i],negatePins[i]),durations[i])
                }
            }
            await delay(highestDuration+1000)
            //set direction to reverse
            gpio.write(directionPins[0], true)
            gpio.write(directionPins[1], true)
            //flush pins
            let waitTime = flushTime
            for(let i = 0; i<pumpPins.length;i++){
                if(!amounts[i]) continue
                if(amounts[i]>0){
                    waitTime+= 1000
                    gpio.write(pumpPins[i],!negatePins[i])
                    setTimeout(()=>gpio.write(pumpPins[i],negatePins[i]),flushTime)
                    await delay(1000)
                }
            }
            await delay(waitTime+1000)
            //set to normal direction
            gpio.write(directionPins[0], false)
            gpio.write(directionPins[1], false)
            console.log("Finished")
        }
        this.cancel = async ()=>{
            console.log("Cancelling!")
            //turn all pumps off
            for(let i = 0; i<pumpPins.length;i++){
                    gpio.write(pumpPins[i],negatePins[i])
                    await delay(30)
            }
            await delay(200)
            //set normal direction
            gpio.write(directionPins[0], false)
            gpio.write(directionPins[1], false)
        }
    }
}
module.exports=CocktailMaker

;(async()=>{
    const cocktailMaker = new CocktailMaker()
    console.log("Constructed!")
    await cocktailMaker.setup()
    console.log("Setup!")
    await cocktailMaker.makeCocktail([1,2,3,0,0,0,21])
    
})()