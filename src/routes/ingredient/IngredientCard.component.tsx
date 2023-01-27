import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { IngredientCatalog } from "../../types/Recipe.types";
import { useNavigate } from "react-router";

const IngredientCard = (props: IngredientCatalog) => {
    const navigate = useNavigate();
    return (
        <Card 
            elevation={2}
            >
            <CardActionArea
                onClick={() => navigate(`/ingredients/${props.IngredientID}`)}
            >
                <CardContent>
                    <Typography sx={{fontSize:14}} color="text.secondary">Ingredient</Typography>
                    <Typography variant="h5" gutterBottom >{props.Name}</Typography>
                    <Typography variant="body1">$ {props.PortionCost.toFixed(2)} per portion</Typography>
                    <Typography variant="body1">yield {props.PortionsPerCase} per case</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default IngredientCard;