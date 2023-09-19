import {
  type PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { api } from "@/services";
import reducers from "@/store/reducers";
import logger from "redux-logger";
import { globalReducer, GLOBAL_FEATURE_KEY } from "./global.slice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const rootReducer = combineReducers({
  ...reducers,
  [api.reducerPath]: api.reducer,
  [GLOBAL_FEATURE_KEY]: globalReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        window?.Config?.ENV !== "production"
          ? [logger, api.middleware]
          : [api.middleware]
      ),
    devTools: window?.Config?.ENV !== "production",
    enhancers: [],
  });

const store = setupStore();

setupListeners(store.dispatch);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

export default store;
