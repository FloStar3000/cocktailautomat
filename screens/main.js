var cocktailIndex = 0;
var {ipcRenderer} = require("electron")

console.log("hello world!");


ipcRenderer.on("cocktails",(ev,cocs)=>{
    cocktails = cocs
    changeCocktail(0)
})


var cImg = document.getElementById("cocktail-img")
var cName = document.getElementById("cocktail-name")
var cDescription = document.getElementById("cocktail-description")
var cIngredients = document.getElementById("cocktail-ingredients")
var leftButton = document.getElementById("left-button")
var rightButton = document.getElementById("right-button")
var goButton = document.getElementById("go-button")

var changeCocktail = function(index){
    cocktailIndex = index
    var cocktail = cocktails[cocktailIndex]
    cImg.src = "../img/cocktails/"+cocktail.img
    cName.innerHTML = cocktail.name
    cDescription.innerHTML = cocktail.description || ""
    cIngredients.innerHTML = ""
    for(var i = 0; i<cocktail.ingredients.length; i++){
        var li = document.createElement("li")
        li.innerHTML = cocktail.ingredients[i].display_name
        cIngredients.appendChild(li)
    }
}


leftButton.onclick = function(){
    cocktailsLength = cocktails.length
    if(cocktailIndex<=0){
        changeCocktail(coctailsLength-1)
    }
    else{
        changeCocktail(cocktailIndex-1)
    }
}


rightButton.onclick = function(){
    cocktailsLength = cocktails.length
    if(cocktailIndex>=cocktailsLength-1){
        changeCocktail(0)
    }
    else{
        changeCocktail(cocktailIndex+1)
    }
}

goButton.onclick = function(){
    ipcRenderer.send("make-cocktail",cocktails[cocktailIndex])
}