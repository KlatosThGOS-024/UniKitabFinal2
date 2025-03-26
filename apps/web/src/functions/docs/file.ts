import { createSlice } from "@reduxjs/toolkit";
interface FileProp {
  FileUrl: string | null;
}
const initialFileValue: FileProp = {
  FileUrl: null,
};

const fileSlicer = createSlice({
  name: "File",
  initialState: initialFileValue,
  reducers: {
    addFileUrl: (state, action) => {
      console.log(action.payload);
      state.FileUrl = action.payload;
    },
  },
});

export const { addFileUrl } = fileSlicer.actions;
export const fileReducer = fileSlicer.reducer;
