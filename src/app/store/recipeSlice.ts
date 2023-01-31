import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from '../store';

import { fetchRecipeIngredients, fetchRecipes, fetchRecipeTemplateData, putRecipeIngredients } from '../../API';
import { Recipe, RecipeIngredient, TemplateNutrition } from '../../types/Recipe.types';
import { RecipeIngredientWithDeleteFlag } from '../../routes/recipe/IngredientsDisplay.component';

interface RecipeWithTemplates extends Recipe {
    templates: TemplateNutrition[];
    ingredients: RecipeIngredient[];
}
export interface RecipeState {
    recipes: RecipeWithTemplates[];
    status: 'idle' | 'loading' | 'failed' | 'success';
    saveStatus: 'idle' | 'loading' | 'failed' | 'success';
}

const initialState: RecipeState = {
    recipes: [],
    status: 'idle',
    saveStatus: 'idle',
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

interface UpdateIngredientsPayload {
    recipe_id: number;
    dataToUpdate: RecipeIngredientWithDeleteFlag[];
    originalData: RecipeIngredient[];
}
export const updateRecipeIngredients = createAsyncThunk(
    'recipes/updateingredients',
    async (payload: UpdateIngredientsPayload) => {
        const { recipe_id, dataToUpdate, originalData } = payload
        const result = await putRecipeIngredients(recipe_id, dataToUpdate, originalData)
        store.dispatch(loadRecipeIngredients(recipe_id))
        store.dispatch(loadTemplateData(recipe_id))

        return result
    }
)

export const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        load: (state, action: PayloadAction<Recipe[]>) => {
            //add blank ingredients and templates
            state.recipes = action.payload.map((r) => ({...r, 'ingredients':[], 'templates':[]}));
        },
        // loadtemplates: (state, action: PayloadAction<{id: number, data:TemplateNutrition[]}>) => {
        //     const thisRecipe = state.recipes
        //         .find((r) => r.RecipeID === action.payload.id);
        //     if (thisRecipe) {
        //         thisRecipe.templates = action.payload.data
        //     } else state.status = 'failed'
        // }
    },
    extraReducers: (builder) => {
        builder
            // load main recipes list 
            .addCase(loadRecipes.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadRecipes.fulfilled, (state, action) => {
                state.status = 'idle';
                // Add blank arrays under 'ingredients' and 'templates to satisfy the type
                state.recipes = action.payload.map((r) => ({...r, 'ingredients':[], 'templates':[]}));
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

            // update ingredients with a new payload
            .addCase(updateRecipeIngredients.pending, (state) => {
                state.saveStatus = 'loading'
            })
            .addCase(updateRecipeIngredients.fulfilled, (state) => {
                state.saveStatus = 'success';
                setTimeout(() => {
                    store.dispatch({type:'RESET_SAVE_STATUS'});
                },3000)
            })
            .addCase('RESET_SAVE_STATUS', (state) => {state.saveStatus='idle'})
            .addCase(updateRecipeIngredients.rejected, (state) => {
                state.saveStatus = 'failed';
            })
    },
});

export const { load } = recipeSlice.actions;

// data loading status
export const selectRecipeStatus = (state:RootState) => state.recipes.status;
// data saving status
export const selectRecipeSaveStatus = (state:RootState) => state.recipes.saveStatus;

export const selectRecipes = (state:RootState) => {
    if(state.recipes.status === 'idle' && state.recipes.recipes.length === 0) {
        store.dispatch(loadRecipes());
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