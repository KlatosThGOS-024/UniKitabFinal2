import { Problem } from "@/components/LiteCodeComponent/MockProblem/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Problem[] = [];

export const QuestionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    addQ: (state, action: PayloadAction<Problem>) => {
      // console.log("🚀 Adding question(s) to store:", action.payload);
      state[0] = action.payload;
    },
  },
});

export const { addQ } = QuestionSlice.actions;
export const QuestionReducer = QuestionSlice.reducer;
