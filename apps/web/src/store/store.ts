import { fileReducer } from "@/functions/docs/file";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
//@ts-ignore
import createIndexedDBStorage from "redux-persist-indexeddb-storage";
import {
  persistStore,
  persistReducer,
  REHYDRATE,
  PERSIST,
  FLUSH,
  PAUSE,
  PURGE,
  REGISTER,
} from "redux-persist";
import { responseReducer } from "@/functions/messages/message";
import { userAccountReducer } from "@/functions/userAccount/User";
import { pdfBookReducer } from "@/functions/pdfBooks/pdfbooks";
import { QuestionReducer } from "@/functions/dsaQuestions/question";
import { codeTestResultsReducer } from "@/functions/code/code";

const logger = (store: any) => (next: any) => (action: any) => {
  let result = next(action);
  return result;
};

const indexedDBStorage = createIndexedDBStorage("myIndexedDB", "myDataStore");

const debugStorage = {
  getItem: async (key: any) => {
    try {
      const result = await indexedDBStorage.getItem(key);
      return result;
    } catch (error) {
      console.error("Error getting from storage:", key, error);
      throw error;
    }
  },
  setItem: async (key: any, value: any) => {
    try {
      const result = await indexedDBStorage.setItem(key, value);
      return result;
    } catch (error) {
      console.error("Error setting to storage:", key, error);
      throw error;
    }
  },
  removeItem: async (key: any) => {
    try {
      const result = await indexedDBStorage.removeItem(key);
      return result;
    } catch (error) {
      console.error("Error removing from storage:", key, error);
      throw error;
    }
  },
};

const persistConfig = {
  key: "root",
  storage: debugStorage,
  whitelist: ["fileReducer", "QuestionReducer"],
  debug: true,
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
    }).concat(logger),
});

export type IRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
