import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import ingredientReducer from './store/ingredientSlice';
import recipeReducer from './store/recipeSlice';
import templateReducer from './store/templateSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ingredients: ingredientReducer,
    recipes: recipeReducer,
    templates: templateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
