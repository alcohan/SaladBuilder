import { ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Paper, Typography } from "@mui/material"
import { useEffect } from "react"
import { useParams } from "react-router"

import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectIngredientsCatalog } from "../app/store/ingredientSlice"
import { loadTemplateIngredients, selectOneTemplate } from "../app/store/templateSlice"
import IngredientsDisplay from "./recipe/IngredientsDisplay.component"

const TemplateDetails = () => {
    
    const dispatch = useAppDispatch()
    const params = useParams()
    
    const thisRecipe = useAppSelector(selectOneTemplate(Number(params.recipe_id)))
    const ingredientsCatalog = useAppSelector(selectIngredientsCatalog)

    const ingredients = thisRecipe?.ingredients

    useEffect( () => {
        dispatch(loadTemplateIngredients(Number(params.recipe_id)))
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
            <Typography variant="h4" component="h2">
                TODO: Edit category weights here
            </Typography>
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
                            mode='template'
                            />
                        :
                        <h2>Loading Ingredients...</h2>
                    }
                </AccordionDetails>
            </Accordion>
        </> 

    )
}

export default TemplateDetails