import { ChangeEventHandler, useEffect, useState } from "react";

import { Add, CheckCircleOutline } from "@mui/icons-material";
import { TableContainer, Table, TableBody, TableCell,  TableRow, Paper, TextField, Button, Autocomplete, CircularProgress } from "@mui/material";

import { RecipeIngredient, IngredientCatalog } from "../../types/Recipe.types";
import RecipeIngredientRow from "./RecipeIngredientRow.component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOneRecipe, selectRecipeSaveStatus, selectRecipeStatus, updateRecipeIngredients } from "../../app/store/recipeSlice";


export interface RecipeIngredientWithDeleteFlag extends RecipeIngredient {
    deleteFlag?: boolean
}

interface IngredientsDisplayProps {
    ingredients: RecipeIngredientWithDeleteFlag[];
    catalog: IngredientCatalog[];
    RecipeID: number;
    mode: 'recipe' | 'template';
}

const IngredientsDisplay: React.FC<IngredientsDisplayProps> = (props) => {
    const dispatch = useAppDispatch()
    const saveStatus = useAppSelector(selectRecipeSaveStatus)
    // const originalIngredients = useAppSelector(selectOneRecipe(props.RecipeID))!.ingredients
    // Local copy of the ingredients. We modify this to stage changes
    const [ingredients, setIngredients] = useState<RecipeIngredientWithDeleteFlag[]>(props.ingredients)

    useEffect( () => {setIngredients(props.ingredients)},[props.ingredients])

    // State for the 'add item' autocomplete box
    const [selectedItemToAdd, setSelectedItemToAdd] = useState<IngredientCatalog | null>(null)
    const [selectedQtyToAdd, setSelectedQtyToAdd] = useState(1)

    // Get unique categories that are present in 'catalog'
    let categories: string[] = [];
    props.catalog.forEach(ingredient => {
        if (!categories.includes(ingredient.Category)){
            categories.push(ingredient.Category)
        }
    })    

    const toggleDeleteFlag = (id:number) => {
        const newIngredients = ingredients.map( 
            (ingredient) => 
            ingredient.RecipeIngredientID === id?
            {...ingredient, deleteFlag:!ingredient.deleteFlag}
            :ingredient
            )
        setIngredients(newIngredients)
    }

    // Add an ingredient to local state so that it can be saved later
    // Use negative of the ingredientID so that it has a unique ID for now but the backend knows it needs to be created
    const addIngredientTemp = (ingredient: IngredientCatalog, qty: number) => {
        setIngredients(ingredients.concat({RecipeIngredientID: -ingredient.IngredientID, Quantity: qty, ...ingredient}))
    }

    // When a quantity is changed, update our ingredients state
    const handleQuantityField: ChangeEventHandler<HTMLInputElement> = (event) => {
        const id = Number(event.target.id);
        const value = Number(event.target.value);
        setIngredients(
            ingredients.map(
            (ingredient) => {
                return {...ingredient, Quantity: ingredient.RecipeIngredientID===id?value:ingredient.Quantity}
            }
            )
        )
    }

    // Send our updated state to the API handler
    const saveChanges = () => {
        dispatch(updateRecipeIngredients({
            recipe_id: props.RecipeID, 
            dataToUpdate: ingredients, 
            originalData: props.ingredients
        }))
    }
    
    return (
        <TableContainer component={Paper}>
            <Button 
                variant="contained" 
                onClick={saveChanges}
                disabled={saveStatus==='loading' || saveStatus==='success'}
                >
                    {
                        saveStatus==='loading' ?
                        (<CircularProgress color="inherit" size={24} />)
                        :
                        saveStatus==='success' ?
                        (<CheckCircleOutline />)
                        :
                        "Save"
                    }
                </Button>

            <Table  aria-label="recipe ingredients">
                <TableBody>
                    {ingredients.map( (ingredient) => (
                        <RecipeIngredientRow 
                            key={ingredient.RecipeIngredientID}
                            ingredient={ingredient} 
                            handleQuantityField={handleQuantityField} 
                            toggleDeleteFlag={toggleDeleteFlag} 
                            />
                    ))}

                    {/* New Ingredient picker  */}
                    <TableRow>
                        <TableCell colSpan={2}>
                            <Autocomplete 
                                disablePortal
                                id="add-ingredient-picker"
                                size="small"
                                value={selectedItemToAdd}
                                onChange={(event: any, newValue) => setSelectedItemToAdd(newValue)}
                                options={props.catalog.filter(i => {
                                    if (props.mode==='recipe') return i.CategoryID != 1;
                                    if (props.mode==='template') return i.CategoryID === 1;
                                })}
                                getOptionLabel={(option) => option.Name}
                                getOptionDisabled={ (option) => ingredients.some(e => e.IngredientID === option.IngredientID)}
                                groupBy={(option) => option.Category}
                                renderInput={(params) => <TextField {...params} label="Add Ingredient" />}
                                />
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={selectedQtyToAdd}
                                id="new-ingredient-qty"
                                onChange={(e) => setSelectedQtyToAdd(Number(e.target.value))}
                                variant="outlined" 
                                size="small"
                                />
                        </TableCell>
                        <TableCell>
                            <Button 
                                disabled={selectedItemToAdd === null || selectedQtyToAdd <= 0} 
                                onClick={() => {
                                    if(selectedItemToAdd) {
                                        addIngredientTemp(selectedItemToAdd,selectedQtyToAdd);
                                        setSelectedItemToAdd(null);
                                        setSelectedQtyToAdd(1);
                                    }}}
                                ><Add/>Add</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default IngredientsDisplay