import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router";

import { Button, Card, CardContent, Typography } from '@mui/material'
import { Grid } from '@mui/material'

import { Recipe } from '../types/Recipe.types';
import { useAppDispatch } from "../app/hooks";
import { useAppSelector } from "../app/hooks";
import { loadRecipes, selectRecipes } from "../app/store/recipeSlice";

const RecipesPage = () => {
    const recipes = useAppSelector(selectRecipes);
    const dispatch = useAppDispatch();

    const navigate = useNavigate()

    useEffect( () => {
        dispatch(loadRecipes());
    }
    ,[])

    const RecipeCard = (props: Recipe) => {
        return (
            <Card variant="outlined" onClick={() => navigate(`/recipes/${props.RecipeID}`)}>
                <CardContent>
                    <Typography variant="h5">
                        {props.Name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Base price $ {props.Price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {props.IngredientQty} Ingredients
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Base ingredients {props.Calories.toFixed(0)} cal
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return(
        <>          
            <Typography variant="h3">
                Recipes
            </Typography>

            <Grid container spacing={3}>
                {recipes.map( (recipe: Recipe) => (
                    <Grid key={recipe.RecipeID} item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <RecipeCard {...recipe} />
                    </Grid>
                ))}           
            </Grid>
        </>
    )
}

export default RecipesPage