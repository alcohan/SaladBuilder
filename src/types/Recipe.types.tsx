export interface BaseNutrition {
    Calories: number;
    Carbohydrates:number;
    Cholesterol:number;
    Fiber:number;
    Protein:number;
    SatFat:number;
    Sodium:number;
    Sugar:number;
    TTLFat:number
}

export interface Recipe extends BaseNutrition {
    Name:string;
    RecipeID:number;
    Price:number;
    IngredientQty:number;
}

export interface TemplateNutrition extends BaseNutrition {
    Template: string;
    TemplateID: number;
    Price: number;
}

export interface RecipeIngredient {
    Name: string;
    Quantity: number
    RecipeIngredientID: number;
    IngredientID: number;
    Category: string;
}

