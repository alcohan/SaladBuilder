import { ChangeEventHandler, FormEvent, useState } from "react";

import { Add, Delete, FindInPage } from "@mui/icons-material";
import { TableContainer, Table, TableBody, TableCell,  TableRow, Paper, TextField, Button, Autocomplete } from "@mui/material";
import { Modal, Box, Typography } from "@mui/material"

import { RecipeIngredient, IngredientCatalog } from "../../types/Recipe.types";
import { deleteRecipeIngredient, updateRecipeIngredients } from "../../API";
import { useAppSelector } from "../../app/hooks";
import { selectOneRecipe } from "../../app/store/recipeSlice";
import RecipeIngredientRow from "./RecipeIngredientRow.component";


export interface RecipeIngredientWithDeleteFlag extends RecipeIngredient {
    deleteFlag?: boolean
}
interface IngredientsDisplayProps {
    ingredients: RecipeIngredientWithDeleteFlag[];
    catalog: IngredientCatalog[];
    addIngredientHandler: (ingredientid: number) => Promise<number>;
    RecipeID: number;
}

const IngredientsDisplay: React.FC<IngredientsDisplayProps> = (props) => {
    const [ingredients, setIngredients] = useState(props.ingredients)
    const [modal, setModal] = useState(false)
    const handleOpen = () => setModal(true)
    const handleClose = () => setModal(false)

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
    const deleteHandler = async (idToDelete: number) => {
        const response = await deleteRecipeIngredient(idToDelete);
        if (response.status === 200)
            setIngredients(ingredients.filter((i) => i.RecipeIngredientID !== idToDelete))
    }
    const addIngredientTemp = (ingredient: IngredientCatalog, qty: number) => {
        setIngredients(ingredients.concat({RecipeIngredientID: 0, Quantity: qty, ...ingredient}))
    }

    //When a quantity is changed, update our ingredients state
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

    const saveChanges = () => {
        updateRecipeIngredients(props.RecipeID, ingredients, props.ingredients)
    }

    // Style for the modal 
    // const style = {
    //     position: 'absolute' as 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: 400,
    //     height: '80%',
    //     overflow: 'scroll',
    //     bgcolor: 'background.paper',
    //     border: '2px solid #000',
    //     boxShadow: 24,
    //     p: 4,
    //   };

    
    return (
        <TableContainer component={Paper} variant="outlined">
            {/* <Modal
                open={modal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Ingredients
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    </Typography>
                    <Table><TableBody>
                        {categories.map(category => 
                            category==="General"?
                                null
                                :
                                (<>
                                    <TableRow><TableCell colSpan={2} align="center"><Typography variant="h6">{category}</Typography></TableCell></TableRow>
                                    {props.catalog.map( ingredient => 
                                        ingredient.Category === category? (
                                            <TableRow>
                                                <TableCell><Button onClick={() => {
                                                    props.addIngredientHandler(ingredient.IngredientID)
                                                    }}><Add/></Button></TableCell>
                                                <TableCell>{ingredient.Name}</TableCell>
                                            </TableRow>
                                            )
                                            :null
                                    )}
                                </>
                                )
                            
                        )}
                    </TableBody></Table>
                </Box>
            </Modal> */}

            <Button variant="outlined" onClick={saveChanges}>Save</Button>
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
                                options={props.catalog}
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