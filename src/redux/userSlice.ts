import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store"; // Replace with the actual path to your store
import useAxios from "../hooks/useAxios";
import { User } from "../types/interfaces";

// Define the initial state
interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

// Async thunk for fetching user data from an API
export const fetchUserFromAPI = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/fetchUserFromAPI", async (_, { rejectWithValue }) => {
  const axiosInstance = useAxios();
  try {
    const response = await axiosInstance({
      url: "get-loggedin-user-info",
      method: "GET",
    });
    //console.log('get-loggedin-user-info', response)
    return response.data.details;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromAPI.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUserFromAPI.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(fetchUserFromAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch user data";
      });
  },
});

export const { setUser } = userSlice.actions;

// Selector to get user data from the store
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
