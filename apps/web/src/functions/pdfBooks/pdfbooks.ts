import { createSlice } from "@reduxjs/toolkit";
interface pdfBookState {
  name: string;
  imgSrc: string;
  fileId: string;
}
const initialStateOfBookArray: pdfBookState[] = [
  {
    name: "",
    imgSrc: "",
    fileId: "",
  },
];

const pdfBookSlicer = createSlice({
  name: "pdfBook",
  initialState: initialStateOfBookArray,
  reducers: {
    addBooksToArray: (state, action) => {
      console.log(action.payload);
    },
    getBooksFromArray: (state, action) => {
      return state;
    },
  },
});

export const addBooksToArray = pdfBookSlicer.actions.addBooksToArray;

export const getBooksFromArray = pdfBookSlicer.actions.getBooksFromArray;

export const pdfBookReducer = pdfBookSlicer.reducer;
