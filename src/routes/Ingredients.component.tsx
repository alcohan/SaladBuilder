import { Button } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { loadData, selectIngredientsCatalog, selectIngredientsStatus } from "../app/store/ingredientSlice"

const IngredientsPage = () => {
    const catalog = useAppSelector(selectIngredientsCatalog);
    const status = useAppSelector(selectIngredientsStatus);
    const dispatch = useAppDispatch();
    return(
        <>
            <h1>This is the Ingredients page</h1>
            <Button variant="outlined" onClick={() => dispatch(loadData())}>Load</Button>
            <h2>STATUS: {status}</h2>
            <br></br>{catalog.map((item) => item.Name)}
        </>
    )
}

export default IngredientsPage