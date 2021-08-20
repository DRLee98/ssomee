import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuyProductDetailType } from "../../types";
import { Prefix } from "../api";

interface cartProductState {
  value: BuyProductDetailType[];
}

const initialState: cartProductState = {
  value: [],
};

const cartProductSlice = createSlice({
  name: "CartProduct",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<BuyProductDetailType>) => {
      const findItem = state.value.find(
        (item) => item.prefix === action.payload.prefix,
      );
      if (findItem) {
        return;
      }
      state.value?.push(action.payload);
    },
    remove: (state, action: PayloadAction<Prefix>) => {
      const filterList = state.value.filter(
        (item) => item.prefix !== action.payload.prefix,
      );
      state.value = filterList;
    },
  },
});

export const { add, remove } = cartProductSlice.actions;

const store = configureStore({
  reducer: {
    cartProduct: cartProductSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
