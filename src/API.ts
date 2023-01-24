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
        // .then(response => response.json())
}

export const createRecipeIngredient = (recipeID: number, ingredientID: number) => {
    console.log("Adding to  " + recipeID + " | ingredientID: "+ ingredientID )
    const createRecipeIngredientData = {
        ingredientid: ingredientID,
        qty: 1
    }
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(createRecipeIngredientData)
    }
    let result;
    fetch(requestUrl(`/recipes/${recipeID}/ingredients`), requestOptions)
        .then(response => response.json())
        .then(data => result=data)
    return result;
}