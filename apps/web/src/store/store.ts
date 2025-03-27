import { fileReducer } from "@/functions/docs/file";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  REHYDRATE,
  PERSIST,
  FLUSH,
  PAUSE,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { responseReducer } from "@/functions/messages/message";
import { userAccountReducer } from "@/functions/userAccount/User";
import { pdfBookReducer } from "@/functions/pdfBooks/pdfbooks";
import { QuestionReducer } from "@/functions/dsaQuestions/question";
import { codeTestResultsReducer } from "@/functions/code/code";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["QuestionReducer"],
};

const rootReducer = combineReducers({
  fileReducer,
  responseReducer,
  userAccountReducer,
  pdfBookReducer,
  QuestionReducer,
  codeTestResultsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
