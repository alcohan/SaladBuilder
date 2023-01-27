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
    ImageURL: string;
}

export interface TemplateNutrition extends BaseNutrition {
    Template: string;
    TemplateID: number;
    Price: number;
}

export interface BaseIngredient {
    Name: string;
    IngredientID: number;
    Category: string;
}

export interface RecipeIngredient extends BaseIngredient {
    Quantity: number
    RecipeIngredientID: number;
}

export interface IngredientCatalog extends BaseIngredient {
    ImageURL: number;
    CategoryID: number;

    Calories: number;
    CarbohydratesGrams: number;
    CholesterolMiligrams: number;
    FiberGrams: number;
    PortionCost: number;
    PortionSize: number;
    PortionUtensil: number;
    PortionVolume: number;
    PortionWeight: number;
    ProteinGrams: number;
    SatFatGrams: number;
    SodiumMiligrams: number;
    SugarGrams: number;
    TTLFatGrams: number;

    CasePrice: number;
    CaseSize: number;
    PortionsPerCase: number;
    YieldPercent: number;

    Unit: string;
}