import { Routes, Route } from 'react-router-dom';

import Navigation from './routes/Navigation.component';
import Home from './routes/Home.component';
import RecipesPage from './routes/Recipes.component';
import RecipeDetails from './routes/RecipeDetails.component';
import TemplatesPage from './routes/Templates.component';
import IngredientsPage from './routes/Ingredients.component';

function App() {
  return (
    <Routes>
      <Route path='/*' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='recipes' element={<RecipesPage />} />
        <Route path='recipes/:recipe_id' element={<RecipeDetails />}/>
        <Route path='templates' element={<TemplatesPage />} />
        <Route path='ingredients' element={<IngredientsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
