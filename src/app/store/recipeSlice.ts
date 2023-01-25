import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import { fetchRecipes } from '../../API';
import { Recipe } from '../../types/Recipe.types';

export interface RecipeState {
    recipes: Recipe[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RecipeState = {
    recipes: [],
    status: 'idle',
};

// This Thunk loads the data and returns result as action payload
export const loadRecipes = createAsyncThunk(
    'recipes/load',
    async () => {
        return await fetchRecipes();
    }
)

export const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        load: (state, action: PayloadAction<Recipe[]>) => {
            state.recipes = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadRecipes.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadRecipes.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipes = action.payload;
            })
            .addCase(loadRecipes.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { load } = recipeSlice.actions;

export const selectRecipes = (state:RootState) => state.recipes.recipes;
export const selectRecipeStatus = (state:RootState) => state.recipes.status;

export default recipeSlice.reducer;