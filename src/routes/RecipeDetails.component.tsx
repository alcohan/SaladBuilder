import { ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Paper, Typography } from "@mui/material"
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

    return(
        <>
            <Typography variant="h3" component="h1" gutterBottom>
                {thisRecipe?.Name}
                <Avatar onClick={() => window.prompt("This will eventually update image url: ")}
                    alt={thisRecipe?.Name} 
                    src={thisRecipe?.ImageURL} 
                    sx={{width:120, height:120}}
                    />
            </Typography>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="nutrition-content"
                    id="nutrition-header"
                    >
                    <Typography variant="h4" component="h2" justifySelf={"center"}>Nutrition</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {templateNutrition && thisRecipe ?
                        <NutritionDetailsPane
                        templates={templateNutrition}
                        Name={thisRecipe?.Name} />
                        :
                        <h2>Loading Nutrition...</h2>
                    }
                </AccordionDetails>
            </Accordion>

            <Accordion
                defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="ingredients-content"
                    id="ingredients-header"
                    >
                    <Typography variant="h4" component="h2">Ingredients</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {ingredients && ingredientsCatalog ?
                        <IngredientsDisplay
                            ingredients={ingredients}
                            catalog={ingredientsCatalog}
                            RecipeID={Number(params.recipe_id)}
                            />
                        :
                        <h2>Loading Ingredients...</h2>
                    }
                </AccordionDetails>
            </Accordion>
        </> 

    )
}

export default RecipeDetails