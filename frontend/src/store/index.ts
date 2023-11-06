import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import coverageReducer from "./coverage";
import clientReducer from "./client";
import claimReducer from "./claim";
import weatherReducer from "./weather";
import statisticReducer from "./statistic";

const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    coverage: coverageReducer,
    claim: claimReducer,
    weather: weatherReducer,
    statistic: statisticReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
