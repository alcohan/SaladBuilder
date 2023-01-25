import { useState } from "react";

import { Add, Delete } from "@mui/icons-material";
import { TableContainer, Table, TableBody, TableCell,  TableRow, Paper, TextField, Button } from "@mui/material";
import { Modal, Box, Typography } from "@mui/material"

import { RecipeIngredient, IngredientCatalog } from "../../types/Recipe.types";
import { deleteRecipeIngredient } from "../../API";

interface IngredientsDisplayProps {
    ingredients: RecipeIngredient[];
    catalog: IngredientCatalog[];
    addIngredientHandler: (id: number) => void;
}

const IngredientsDisplay: React.FC<IngredientsDisplayProps> = (props) => {
    const [ingredients, setIngredients] = useState(props.ingredients)
    const [modal, setModal] = useState(false)
    const handleOpen = () => setModal(true)
    const handleClose = () => setModal(false)

    // Get unique categories that are present in 'catalog'
    let categories: string[] = [];
    props.catalog.forEach(ingredient => {
        if (!categories.includes(ingredient.Category)){
            categories.push(ingredient.Category)
        }
    })    

    const deleteHandler = async (idToDelete: number) => {
        const response = await deleteRecipeIngredient(idToDelete);
        if (response.status === 200)
            setIngredients(ingredients.filter((i) => i.RecipeIngredientID !== idToDelete))
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: '80%',
        overflow: 'scroll',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    // const AddIngredientModal = (props) => {
    //     return(        

    //     )
    // }
    return (
        <TableContainer component={Paper} variant="outlined">
            <Modal
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
                                                <TableCell><Button onClick={() => props.addIngredientHandler(ingredient.IngredientID)}><Add/></Button></TableCell>
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
            </Modal>

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
            <Button onClick={handleOpen} variant="outlined"><Add/>Add</Button>
            </Table>
        </TableContainer>
    )
}

export default IngredientsDisplay