import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import { IngredientCatalog } from '../../types/Recipe.types';
import { fetchIngredientsCatalog } from '../../API';

export interface IngredientState {
    catalog: IngredientCatalog[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: IngredientState = {
    catalog: [],
    status: 'idle',
};

// This Thunk loads the data and returns result as action payload
export const loadData = createAsyncThunk(
    'catalog/load',
    async () => {
        return await fetchIngredientsCatalog();
    }
)

export const ingredientSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        load: (state, action: PayloadAction<IngredientCatalog[]>) => {
            state.catalog = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadData.fulfilled, (state, action) => {
                state.status = 'idle';
                state.catalog = action.payload;
            })
            .addCase(loadData.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { load } = ingredientSlice.actions;

export const selectIngredientsCatalog = (state:RootState) => state.ingredients.catalog;
export const selectIngredientsStatus = (state:RootState) => state.ingredients.status;

export default ingredientSlice.reducer;