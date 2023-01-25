import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import ingredientReducer from './store/ingredientSlice';
import recipeReducer from './store/recipeSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ingredients: ingredientReducer,
    recipes: recipeReducer,
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
