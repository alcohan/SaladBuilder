import { useEffect } from "react"
import { useNavigate } from "react-router";

import { Avatar, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Grid } from '@mui/material'

import { Recipe } from '../types/Recipe.types';
import { useAppDispatch } from "../app/hooks";
import { useAppSelector } from "../app/hooks";
import { loadRecipes, selectRecipes } from "../app/store/recipeSlice";

const RecipesPage = () => {
    const recipes = useAppSelector(selectRecipes);

    const navigate = useNavigate()

    const RecipeCard = (props: Recipe) => {
        return (
            <Card variant="outlined" onClick={() => navigate(`/recipes/${props.RecipeID}`)}>
                <Grid container>
                    <Grid item xs={8}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {props.Name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Base price $ {props.Price.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {props.IngredientQty} Ingredients
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Base ingredients {props.Calories.toFixed(0)} cal
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={4}>
                        <Avatar component={CardMedia}
                            src={props.ImageURL? props.ImageURL : "localhost/error.jpg"} 
                            alt={props.Name} 
                            sx={{width:80, height:80, m:1}}
                            />
                        {/* <CardMedia
                            component="img"
                            alt="thumbnail"
                            image={props.ImageURL}
                            title={props.Name}
                            // height="140"
                            /> */}
                    </Grid>
                </Grid>
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