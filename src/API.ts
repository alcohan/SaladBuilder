import { RecipeIngredientWithDeleteFlag } from "./routes/recipe/IngredientsDisplay.component";
import { Category } from "./types/Ingredient.types";
import { IngredientCatalog, Recipe, RecipeIngredient, TemplateNutrition } from "./types/Recipe.types";

const SERVER = 'http://localhost:5000'

export const requestUrl = (url: string) => {
    return SERVER + url;
}

export const deleteRecipeIngredient = (recipeIngredientID: number) => {
    console.log("Deleting RecipeIngredient with ID=" + recipeIngredientID);
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    }

    return fetch(requestUrl(`/recipes/temp/ingredients/temp/${recipeIngredientID}`), requestOptions)
}

export const createRecipeIngredient = async (recipeID: number, ingredientID: number) => {
    console.log("Adding to  " + recipeID + " | ingredientID: "+ ingredientID )
    const createRecipeIngredientData = {
        ingredientid: ingredientID,
        qty: 1
    }

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(createRecipeIngredientData)
    }
    return await fetch(requestUrl(`/recipes/${recipeID}/ingredients`), requestOptions)
}

export const putRecipeIngredients = async (recipeID: number, updatesArray: RecipeIngredientWithDeleteFlag[], originalData: RecipeIngredient[]) => {

    const updateIngredientData = updatesArray.map( (item) => {
        // If it's been assigned a temporary (<0) ID and isn't marked to delete, then create
        const updateType= 
            item.RecipeIngredientID <= 0 && !item.deleteFlag?
            "create"
            :
            item.deleteFlag?
                "delete"
                :
                item.Quantity != originalData.find(e => e.RecipeIngredientID===item.RecipeIngredientID)?.Quantity? 
                    "update"
                    :
                    "nothing"

        return ({
            RecipeIngredientID: item.RecipeIngredientID,
            Quantity: item.Quantity,
            IngredientID: item.IngredientID,
            updateType: updateType
        })
    })
    
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateIngredientData)
    }
    return await fetch(requestUrl(`/recipes/${recipeID}/ingredients`), requestOptions)
}

export const fetchIngredientsCatalog = () => {
    return new Promise<IngredientCatalog[]> ((resolve) =>
    fetch(requestUrl(`/ingredients`))
        .then(response => response.json())
        .then(data => resolve(data as IngredientCatalog[]))
    )
    
}
export const fetchRecipes = () => {
    return new Promise<Recipe[]> ((resolve) =>
    fetch(requestUrl(`/recipes`))
        .then(response => response.json())
        .then(data => resolve(data as Recipe[]))
    )
    
}
export const fetchTemplates = () => {
    return new Promise<Recipe[]> ((resolve) =>
    fetch(requestUrl(`/recipes/templates`))
        .then(response => response.json())
        .then(data => resolve(data as Recipe[]))
    )
    
}
export const fetchRecipeTemplateData = (recipe_id: number) => {
    return new Promise<{id: number, data: TemplateNutrition[]}> ((resolve) =>
    fetch(requestUrl(`/recipes/${recipe_id}/templates`))
        .then(response => response.json())
        .then(data => resolve({id: recipe_id, data: data as TemplateNutrition[]}))
    )
    
}
export const fetchRecipeIngredients = (recipe_id: number) => {
    return new Promise<{id: number, data: RecipeIngredient[]}> ((resolve) =>
    fetch(requestUrl(`/recipes/${recipe_id}/ingredients`))
        .then(response => response.json())
        .then(data => resolve({id: recipe_id, data: data as RecipeIngredient[]}))
    )
    
}
export const fetchCategories = () => {
    return new Promise<Category[]> ((resolve) =>
    fetch(requestUrl(`/ingredients/categories`))
        .then(response => response.json())
        .then(data => resolve(data as Category[]))
    )
    
}
