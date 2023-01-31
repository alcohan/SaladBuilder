import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from '../store';

import { fetchRecipeIngredients, fetchTemplates, putRecipeIngredients } from '../../API';
import { Recipe, RecipeIngredient } from '../../types/Recipe.types';
import { RecipeIngredientWithDeleteFlag } from '../../routes/recipe/IngredientsDisplay.component';

interface Template extends Recipe {
    ingredients: RecipeIngredient[];
}
export interface TemplateState {
    templates: Template[];
    status: 'idle' | 'loading' | 'failed' | 'success';
    saveStatus: 'idle' | 'loading' | 'failed' | 'success';
}

const initialState: TemplateState = {
    templates: [],
    status: 'idle',
    saveStatus: 'idle',
};

// This Thunk loads the base recipe data and returns result as action payload
export const loadTemplates = createAsyncThunk(
    'templates/load',
    async () => await fetchTemplates()
)

// Load template data for a specific recipe
export const loadTemplateIngredients = createAsyncThunk(
    'templates/loadingredients',
    async (recipe_id: number) => await fetchRecipeIngredients(recipe_id)
)

interface UpdateIngredientsPayload {
    recipe_id: number;
    dataToUpdate: RecipeIngredientWithDeleteFlag[];
    originalData: RecipeIngredient[];
}
export const updateTemplateIngredients = createAsyncThunk(
    'templates/updateingredients',
    async (payload: UpdateIngredientsPayload) => {
        const { recipe_id, dataToUpdate, originalData } = payload
        const result = await putRecipeIngredients(recipe_id, dataToUpdate, originalData)
        store.dispatch(loadTemplateIngredients(recipe_id))

        return result
    }
)

export const templateSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        load: (state, action: PayloadAction<Recipe[]>) => {
            //add blank ingredients
            state.templates = action.payload.map((r) => ({...r, 'ingredients':[]}));
        },
    },
    extraReducers: (builder) => {
        builder
            // load main recipes list 
            .addCase(loadTemplates.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadTemplates.fulfilled, (state, action) => {
                state.status = 'idle';
                // Add blank arrays under 'ingredients' and 'templates to satisfy the type
                state.templates = action.payload.map((r) => ({...r, 'ingredients':[]}));
            })
            .addCase(loadTemplates.rejected, (state) => {
                state.status = 'failed';
            })
            
            // load individual recipe ingredients
            .addCase(loadTemplateIngredients.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadTemplateIngredients.fulfilled, (state, action) => {
                const {id, data} = action.payload
                state.status = 'idle';
                const thisRecipe = state.templates.find((r) => r.RecipeID === id)
                if (thisRecipe) {
                    thisRecipe.ingredients = data
                } else state.status = 'failed'
            })
            .addCase(loadTemplateIngredients.rejected, (state) => {
                state.status = 'failed';
            })

            // update ingredients with a new payload
            .addCase(updateTemplateIngredients.pending, (state) => {
                state.saveStatus = 'loading'
            })
            .addCase(updateTemplateIngredients.fulfilled, (state) => {
                state.saveStatus = 'success';
                setTimeout(() => {
                    store.dispatch({type:'RESET_SAVE_STATUS'});
                },3000)
            })
            .addCase('RESET_SAVE_STATUS', (state) => {state.saveStatus='idle'})
            .addCase(updateTemplateIngredients.rejected, (state) => {
                state.saveStatus = 'failed';
            })
    },
});

export const { load } = templateSlice.actions;

// data loading status
export const selectTemplateStatus = (state:RootState) => state.templates.status;
// data saving status
export const selectTemplateSaveStatus = (state:RootState) => state.templates.saveStatus;

export const selectTemplates = (state:RootState) => {
    if(state.templates.status === 'idle' && state.templates.templates.length === 0) {
        store.dispatch(loadTemplates());
    }
    return state.templates.templates;
}

export const selectOneTemplate = 
    (recipe_id: number) => 
        (state:RootState) => {
            if(state.templates.status === 'idle' && state.templates.templates.length === 0) {
                store.dispatch(loadTemplates());
            }
            return state.templates.templates.find(recipe => recipe.RecipeID === recipe_id)
        }

export default templateSlice.reducer;