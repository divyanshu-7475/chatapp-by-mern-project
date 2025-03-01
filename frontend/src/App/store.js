import { configureStore } from "@reduxjs/toolkit";
import {persistStore,persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage"
import userReducer from "../features/user/user.Slice.js"
import tempVariableReducer from "../features/tempVariable.slice.js"
import chatOpenReducer from "../features/user/chatOpen.Slice.js"
import conversationIdReducer from "../features/user/conversationId.slice.js";

const persistConfig = {
    key: "root",
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, userReducer);

export const store= configureStore({
    reducer:{
        userData:persistedReducer,
        chatOpenUser:chatOpenReducer,
        conversationId:conversationIdReducer,
        tempVariable:tempVariableReducer
    }
})
export const persistor = persistStore(store);