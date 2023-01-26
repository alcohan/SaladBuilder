import { Box, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { loadData, selectCategories, selectIngredientsCatalog, selectIngredientsStatus } from "../app/store/ingredientSlice"
import IngredientCard from "./ingredient/IngredientCard.component";

const IngredientsPage = () => {
    const catalog = useAppSelector(selectIngredientsCatalog);
    const categories = useAppSelector(selectCategories);
    const status = useAppSelector(selectIngredientsStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadData())
    },[])
    return(
        <>
            {categories.map(category => 
                (<Box sx={{m:2}} >
                    <Typography 
                        key={category.CategoryID} 
                        gutterBottom
                        variant="h4" 
                        align="center"
                        >{category.Name}</Typography>
                    <Grid container spacing={3}>
                        {catalog.map( ingredient => 
                            ingredient.CategoryID === category.CategoryID? (
                                <Grid key={ingredient.IngredientID} item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <IngredientCard
                                        key={ingredient.IngredientID} 
                                        {...ingredient}
                                        />
                                </Grid>
                                )
                                :null
                        )}
                    </Grid>
                </Box>)
                
            )}
        </>
    )
}

export default IngredientsPage