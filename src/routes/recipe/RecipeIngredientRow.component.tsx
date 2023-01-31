import { Delete, RestoreFromTrash } from "@mui/icons-material";
import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { ChangeEventHandler, FC } from "react"
import { RecipeIngredientWithDeleteFlag } from "./IngredientsDisplay.component"

interface RecipeIngredientRowProps {
    ingredient: RecipeIngredientWithDeleteFlag;
    handleQuantityField: ChangeEventHandler<HTMLInputElement>;
    toggleDeleteFlag: (id: number) => void;
}

const RecipeIngredientRow: FC<RecipeIngredientRowProps> = (props) => {
    const { ingredient, handleQuantityField, toggleDeleteFlag } = props;

    return (
        <TableRow 
            key={ingredient.RecipeIngredientID}
            >
            <TableCell
                style={{opacity: ingredient.deleteFlag ? 0.5: 1}}
                >{ingredient.Name}</TableCell>
            <TableCell
                style={{opacity: ingredient.deleteFlag ? 0.5: 1}}
                >{ingredient.Category}</TableCell>
            <TableCell
                style={{opacity: ingredient.deleteFlag ? 0.5: 1}}
                >
                    <TextField
                        onChange={handleQuantityField}
                        value={ingredient.Quantity} 
                        id={ingredient.RecipeIngredientID.toString()} 
                        variant="outlined" 
                        size="small"
                        disabled={ingredient.deleteFlag}
                        />
            </TableCell>
            <TableCell >
                    <Button
                        onClick={() => toggleDeleteFlag(ingredient.RecipeIngredientID)}
                        aria-label="delete"
                        >{
                            ingredient.deleteFlag?
                            <RestoreFromTrash />
                            :
                            <Delete />
                        }
                    </Button>
            </TableCell>
        </TableRow>
        
    )
}

export default RecipeIngredientRow