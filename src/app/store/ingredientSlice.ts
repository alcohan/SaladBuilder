import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import { IngredientCatalog } from '../../types/Recipe.types';
import { fetchCategories, fetchIngredientsCatalog } from '../../API';
import { Category } from '../../types/Ingredient.types';

export interface IngredientState {
    catalog: IngredientCatalog[];
    categories: Category[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: IngredientState = {
    catalog: [],
    categories:[],
    status: 'idle',
};

// This Thunk loads the data and returns result as action payload
export const loadIngredientsCatalog = createAsyncThunk(
    'ingredients/loadingredients',
    async () => {
        return await fetchIngredientsCatalog();
    }
)
export const loadCategories = createAsyncThunk(
    'ingredients/loadcategories',
    async () => {
        return await fetchCategories();
    }
)

export const loadData = (): AppThunk => 
    (dispatch) => {
        dispatch(loadIngredientsCatalog());
        dispatch(loadCategories());
    };

export const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        loadingredients: (state, action: PayloadAction<IngredientCatalog[]>) => {
            state.catalog = action.payload;
        },
        loadcategories:  (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // cases for loading Ingredients
            .addCase(loadIngredientsCatalog.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadIngredientsCatalog.fulfilled, (state, action) => {
                state.status = 'idle';
                state.catalog = action.payload;
            })
            .addCase(loadIngredientsCatalog.rejected, (state) => {
                state.status = 'failed';
            })

            // cases for loading Categories
            .addCase(loadCategories.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadCategories.fulfilled, (state, action) => {
                state.status = 'idle';
                state.categories = action.payload;
            })
            .addCase(loadCategories.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { loadingredients, loadcategories } = ingredientSlice.actions;

export const selectIngredientsCatalog = (state:RootState) => state.ingredients.catalog;
export const selectIngredientsStatus = (state:RootState) => state.ingredients.status;
export const selectCategories = (state:RootState) => state.ingredients.categories;

export default ingredientSlice.reducer;