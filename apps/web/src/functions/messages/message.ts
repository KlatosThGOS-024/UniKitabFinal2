import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
interface ResponseProp {
  response: string;
  response_frm: string;
  responseId: string;
}

const initialStateOfResponses: ResponseProp = {
  response: "",
  response_frm: "",
  responseId: "",
};
export const responseSlicer = createSlice({
  name: "Responses",
  initialState: initialStateOfResponses,
  reducers: {
    addResponse: (state, action: PayloadAction<ResponseProp>) => {
      state = action.payload;
    },
  },
});

export const { addResponse } = responseSlicer.actions;

export const responseReducer = responseSlicer.reducer;
