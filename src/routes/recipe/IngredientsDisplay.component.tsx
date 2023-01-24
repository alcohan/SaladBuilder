import { useState } from "react";

import { Delete } from "@mui/icons-material";
import { TableContainer, Table, TableBody, TableCell,  TableRow, Paper, TextField, Button } from "@mui/material";

import { RecipeIngredient } from "../../types/Recipe.types";
import { deleteRecipeIngredient } from "../../API";

interface IngredientsDisplayProps {
    ingredients: RecipeIngredient[];
}
const IngredientsDisplay: React.FC<IngredientsDisplayProps> = (props) => {
    const [ingredients, setIngredients] = useState(props.ingredients)

    const deleteHandler = async (idToDelete: number) => {
        const response = await deleteRecipeIngredient(idToDelete);
        response.status === 200 ?
            setIngredients(ingredients.filter((i) => i.RecipeIngredientID !== idToDelete))
            :
            new Error("RecipeIngredient Deletion Failed");
    }

    return (
        <TableContainer component={Paper}>
            <Table  aria-label="recipe ingredients">
                <TableBody>
                    {ingredients.map( (ingredient) => (
                        <TableRow key={ingredient.RecipeIngredientID}>
                            <TableCell>{ingredient.Name}</TableCell>
                            <TableCell>{ingredient.Category}</TableCell>
                            <TableCell><TextField defaultValue={ingredient.Quantity} id={ingredient.RecipeIngredientID.toString()} variant="outlined" size="small"/></TableCell>
                            <TableCell>
                                <Button 
                                    onClick={() => deleteHandler(ingredient.RecipeIngredientID)}
                                    aria-label="delete"
                                    ><Delete />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
            <Button variant="outlined">+add</Button>
        </TableContainer>
    )
}

export default IngredientsDisplay