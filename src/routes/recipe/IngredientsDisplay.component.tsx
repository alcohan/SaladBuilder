import { RecipeIngredient } from "../../types/Recipe.types";

interface IngredientsDisplayProps {
    ingredients: RecipeIngredient[];
}
const IngredientsDisplay: React.FC<IngredientsDisplayProps> = (props) => {
    return (
        <>
            {props.ingredients.map( (ingredient) => (
                <h2>
                    {ingredient.Name}
                </h2>
            ))}
        </>
    )
}

export default IngredientsDisplay