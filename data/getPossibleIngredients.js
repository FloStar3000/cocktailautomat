const fs = require("fs")
const naturalSort = require("natural-sort")
const ingredientsInfo = require("./availableIngredients")
const cocktails = require("./cocktails")

ingredientsInfo.possibleIngredients = []

cocktails.forEach(c=>{
    c.ingredients.forEach(i=>{
        if(!ingredientsInfo.possibleIngredients.includes(i.ingredient))
        ingredientsInfo.possibleIngredients.push(i.ingredient)
    })
})


ingredientsInfo.possibleIngredients.sort(naturalSort())

fs.writeFileSync("./availableIngredients.json",JSON.stringify(ingredientsInfo,null,4))