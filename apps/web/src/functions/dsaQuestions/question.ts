import {
  Problem,
  Difficulty,
} from "@/components/LiteCodeComponent/MockProblem/types/types";
import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

const initialStateOfDsaQ: Problem[] = [];
export const QuestionSlicer = createSlice({
  name: "DsaQs",
  initialState: initialStateOfDsaQ,
  reducers: {
    addQ: (state, action: PayloadAction<Problem>) => {
      state.push(action.payload);
    },
  },
});

export const { addQ } = QuestionSlicer.actions;

export const QuestionReducer = QuestionSlicer.reducer;
