import { useEffect, useState } from "react"
import { useParams } from "react-router"

import { requestUrl } from "../API"
import { Recipe, TemplateNutrition, RecipeIngredient } from '../types/Recipe.types'
import IngredientsDisplay from "./recipe/IngredientsDisplay.component"
import NutritionDetailsPane from "./recipe/NutritionDetails.component"

const RecipeDetails = () => {
    const [thisRecipe, setThisRecipe] = useState<Recipe>()
    const [templateNutrition, setTemplateNutrition] = useState<TemplateNutrition[]>()
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>()
    const params = useParams()

    useEffect( () => {
        fetch(requestUrl(`/recipes/${params.recipe_id}`))
        .then(response => response.json())
        .then(data => {
            setThisRecipe(data[0] satisfies Recipe)
        });
        fetch(requestUrl(`/recipes/${params.recipe_id}/templates`))
        .then(response => response.json())
        .then(data => {
            setTemplateNutrition(data satisfies Recipe[])
        })
        fetch(requestUrl(`/recipes/${params.recipe_id}/ingredients`))
        .then(response => response.json())
        .then(data => {
            setIngredients(data satisfies RecipeIngredient[])
        })
    }
    ,[])

    return(
        <>
            <h1>{thisRecipe?.Name}</h1>

            {templateNutrition && thisRecipe ?
                <NutritionDetailsPane templates={templateNutrition} Name={thisRecipe?.Name} />
                :
                <h2>Loading Nutrition...</h2>
            }

            {ingredients ?
                <IngredientsDisplay ingredients={ingredients} />
                :
                <h2>Loading Ingredients...</h2>
            }
        </> 

    )
}

export default RecipeDetails