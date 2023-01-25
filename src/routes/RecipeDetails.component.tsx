import { useEffect, useState } from "react"
import { useParams } from "react-router"

import { createRecipeIngredient, requestUrl } from "../API"
import { Recipe, TemplateNutrition, RecipeIngredient, IngredientCatalog } from '../types/Recipe.types'
import IngredientsDisplay from "./recipe/IngredientsDisplay.component"
import NutritionDetailsPane from "./recipe/NutritionDetails.component"

const RecipeDetails = () => {
    const [thisRecipe, setThisRecipe] = useState<Recipe>()
    const [templateNutrition, setTemplateNutrition] = useState<TemplateNutrition[]>()
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>()
    const [ingredientsCatalog, setIngredientsCatalog ] = useState<IngredientCatalog[]>()
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
        fetch(requestUrl(`/ingredients`))
        .then(response => response.json())
        .then(data => {
            // const categories = [... new Set<string>(data.map(item => item.Category))];
            setIngredientsCatalog(data satisfies IngredientCatalog[])
        })
    }
    ,[])

    const addIngredientHandler = (ingredientID: number) => {
        if (thisRecipe){
            createRecipeIngredient(thisRecipe.RecipeID,ingredientID)
        }
        else {
            throw new Error("RecipeID is not loaded");
        }
    }

    return(
        <>
            <h1>{thisRecipe?.Name}</h1>
            <h2>Nutrition</h2>
            {templateNutrition && thisRecipe ?
                <NutritionDetailsPane templates={templateNutrition} Name={thisRecipe?.Name} />
                :
                <h2>Loading Nutrition...</h2>
            }
            <h2>Ingredients</h2>
            {ingredients && ingredientsCatalog ?
                <>
                    <IngredientsDisplay ingredients={ingredients} catalog={ingredientsCatalog} addIngredientHandler={addIngredientHandler}/>
                    {/* <Button variant="outlined" 
                        onClick={() => 
                            addIngredientHandler(11)
                        }
                        ><Add /> Add</Button> */}
                </>
                :
                <h2>Loading Ingredients...</h2>
            }
        </> 

    )
}

export default RecipeDetails