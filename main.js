const fs = require("fs")
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const CocktailMaker = require("./gpio/CocktailMaker")

const cocktailMaker = new CocktailMaker()
cocktailMaker.setup()



let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
	fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  mainWindow.loadFile('screens/main.html')

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send("cocktails",cocktails)
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})



const cocktailsUnsorted = require("./data/cocktails.json")
const availableIngredients = require("./data/availableIngredients.json").availableIngredients

const cocktails = []

for(let i=0; i<cocktailsUnsorted.length; i++){
  let allIngredientsAvailable = true
  const ingredients = cocktailsUnsorted[i].ingredients
  for(let i = 0; i<ingredients.length; i++){
    if(!availableIngredients.includes(ingredients[i].ingredient)){allIngredientsAvailable = false; break;}
  }
  if(allIngredientsAvailable){
    cocktails.push(cocktailsUnsorted[i])
  }
}
//console.log(JSON.stringify(cocktails,null,4));

//const gpio = require("rpi-gpio")

const childProcess = require("child_process")

var outputIngredient = function(ingredient){

}

var cocktailInProgress = false
var makeCocktail = async function(cocktail){
  console.log("Making cocktail: ",cocktail.name);
  if(cocktailInProgress){return}
  cocktailInProgress = true
  var ingredients = cocktail.ingredients
  const pumpMap = availableIngredients
  console.log("pump map:",pumpMap)
  console.log("ingredients:",ingredients)
  let amounts = []
  for(let i = 0; i<pumpMap.length; i++){
    const ingredient = ingredients.find(ing=>ing.ingredient==pumpMap[i])
    if(!ingredient){
      console.log("this ingredient is not in cocktail recipe");
      amounts[i] = 0
    }
    else{
      console.log(ingredient);
      amounts[i] = ingredient.amount
    }
  }
  await cocktailMaker.makeCocktail(amounts)
  cocktailInProgress = false
  console.log("Cocktail finished!");
}

ipcMain.on("make-cocktail",async function(ev,cocktail){
  //console.log(cocktail);
  await makeCocktail(cocktail)
})
