import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface CommonState {
  loaddata: boolean;
}

const initialState: CommonState = {
  loaddata: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setLoadData: (state, action: PayloadAction<boolean>) => {
      state.loaddata = action.payload;
    },
  },
});

export const { setLoadData } = commonSlice.actions;
// Selector to get current loading status
export const selectLoadData = (state: RootState) => state.common.loaddata;

export default commonSlice.reducer;