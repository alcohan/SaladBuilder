import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from '../store';

import { fetchRecipeIngredients, fetchRecipes, fetchRecipeTemplateData } from '../../API';
import { Recipe, RecipeIngredient, TemplateNutrition } from '../../types/Recipe.types';

interface RecipeWithTemplates extends Recipe {
    templates?: TemplateNutrition[];
    ingredients?: RecipeIngredient[];
}
export interface RecipeState {
    recipes: RecipeWithTemplates[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RecipeState = {
    recipes: [],
    status: 'idle',
};

// This Thunk loads the base recipe data and returns result as action payload
export const loadRecipes = createAsyncThunk(
    'recipes/load',
    async () => await fetchRecipes()
)

// Load template data for a specific recipe
export const loadTemplateData = createAsyncThunk(
    'recipes/loadtemplates',
    async (recipe_id: number) => await fetchRecipeTemplateData(recipe_id)
)

// Load template data for a specific recipe
export const loadRecipeIngredients = createAsyncThunk(
    'recipes/loadingredients',
    async (recipe_id: number) => await fetchRecipeIngredients(recipe_id)
)

export const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        load: (state, action: PayloadAction<Recipe[]>) => {
            state.recipes = action.payload;
        },
        loadtemplates: (state, action: PayloadAction<{id: number, data:TemplateNutrition[]}>) => {
            const thisRecipe = state.recipes
                .find((r) => r.RecipeID === action.payload.id);
            if (thisRecipe) {
                thisRecipe.templates = action.payload.data
            } else state.status = 'failed'
        }
    },
    extraReducers: (builder) => {
        builder
            // load main recipes list 
            .addCase(loadRecipes.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadRecipes.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipes = action.payload;
            })
            .addCase(loadRecipes.rejected, (state) => {
                state.status = 'failed';
            })

            // load individual recipe template data
            .addCase(loadTemplateData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadTemplateData.fulfilled, (state, action) => {
                const {id, data} = action.payload
                state.status = 'idle';
                const thisRecipe = state.recipes.find((r) => r.RecipeID === id)
                if (thisRecipe) {
                    thisRecipe.templates = data
                } else state.status = 'failed'
            })
            .addCase(loadTemplateData.rejected, (state) => {
                state.status = 'failed';
            })
            
            // load individual recipe ingredients
            .addCase(loadRecipeIngredients.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadRecipeIngredients.fulfilled, (state, action) => {
                const {id, data} = action.payload
                state.status = 'idle';
                const thisRecipe = state.recipes.find((r) => r.RecipeID === id)
                if (thisRecipe) {
                    thisRecipe.ingredients = data
                } else state.status = 'failed'
            })
            .addCase(loadRecipeIngredients.rejected, (state) => {
                state.status = 'failed';
            })
    },
});

export const { load } = recipeSlice.actions;

export const selectRecipeStatus = (state:RootState) => state.recipes.status;

export const selectRecipes = (state:RootState) => {
    if(state.recipes.status === 'idle' && state.recipes.recipes.length ===0) {
        store.dispatch(loadRecipes);
    }
    return state.recipes.recipes;
}

export const selectOneRecipe = 
    (recipe_id: number) => 
        (state:RootState) => {
            if(state.recipes.status === 'idle' && state.recipes.recipes.length === 0) {
                store.dispatch(loadRecipes());
            }
            return state.recipes.recipes.find(recipe => recipe.RecipeID === recipe_id)
        }

export default recipeSlice.reducer;