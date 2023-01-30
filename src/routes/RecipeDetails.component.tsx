import { Avatar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

import { createRecipeIngredient, requestUrl } from "../API"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectIngredientsCatalog } from "../app/store/ingredientSlice"
import { loadRecipeIngredients, loadTemplateData, selectOneRecipe } from "../app/store/recipeSlice"
import { Recipe, TemplateNutrition, RecipeIngredient, IngredientCatalog } from '../types/Recipe.types'
import IngredientsDisplay from "./recipe/IngredientsDisplay.component"
import NutritionDetailsPane from "./recipe/NutritionDetails.component"

const RecipeDetails = () => {
    // const [templateNutrition, setTemplateNutrition] = useState<TemplateNutrition[]>()
    
    const dispatch = useAppDispatch()
    const params = useParams()
    
    const thisRecipe = useAppSelector(selectOneRecipe(Number(params.recipe_id)))
    const ingredientsCatalog = useAppSelector(selectIngredientsCatalog)
    const templateNutrition = thisRecipe?.templates

    const ingredients = thisRecipe?.ingredients

    useEffect( () => {
        dispatch(loadTemplateData(Number(params.recipe_id)))
        dispatch(loadRecipeIngredients(Number(params.recipe_id)))
    }
    ,[])

    // Add a new ingredient to this recipe and return its new ID
    const addIngredientHandler = async (ingredientID: number) => {
        if (thisRecipe){
            let result = await createRecipeIngredient(thisRecipe.RecipeID,ingredientID)
                .then(result => result.json())
            return result.new_id
        }
        else {
            throw new Error("RecipeID is not loaded");
        }
    }

    return(
        <>
            <Typography variant="h3" component="h1">
                {thisRecipe?.Name}
                <Avatar onClick={() => window.prompt("This will eventually update image url: ")}
                    alt={thisRecipe?.Name} 
                    src={thisRecipe?.ImageURL} 
                    sx={{width:120, height:120}}
                    />
            </Typography>
            <h2>Nutrition</h2>
            {templateNutrition && thisRecipe ?
                <NutritionDetailsPane templates={templateNutrition} Name={thisRecipe?.Name} />
                :
                <h2>Loading Nutrition...</h2>
            }
            <h2>Ingredients</h2>
            {ingredients && ingredientsCatalog ?
                <IngredientsDisplay 
                    ingredients={ingredients} 
                    catalog={ingredientsCatalog} 
                    addIngredientHandler={addIngredientHandler}
                    RecipeID={Number(params.recipe_id)}
                    />
                :
                <h2>Loading Ingredients...</h2>
            }
        </> 

    )
}

export default RecipeDetails