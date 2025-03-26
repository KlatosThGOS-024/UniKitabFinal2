// src/redux/features/codeTestResults/codeTestResultsSlice.ts
import { testCodeRunner } from "@/Hooks/codeRunner";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface TestResult {
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
  error?: string;
  consoleOutput?: string[];
}

interface TestSummary {
  passed: number;
  failed: number;
  total: number;
  passPercentage: number;
  totalExecutionTime: number;
}

interface FormattedResult {
  status: string;
  testsPassed: string;
  passRate: string;
  executionTime: string;
}

interface CodeTestResultsState {
  summary: TestSummary | null;
  results: TestResult[] | null;
  formattedResult: FormattedResult | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CodeTestResultsState = {
  summary: null,
  results: null,
  formattedResult: null,
  loading: false,
  error: null,
};

// Create async thunk for running code tests
export const runCodeTest = createAsyncThunk(
  "codeTestResults/runCodeTest",
  async ({
    code,
    problemDescription,
  }: {
    code: string;
    problemDescription: string;
  }) => {
    const response = await testCodeRunner(code, problemDescription);
    return response;
  }
);

// Create the slice
const codeTestResultsSlice = createSlice({
  name: "codeTestResults",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.summary = null;
      state.results = null;
      state.formattedResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCodeTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runCodeTest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.results = action.payload.results;
        state.formattedResult = action.payload.formattedResult;
      })
      .addCase(runCodeTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to run code test";
      });
  },
});

// Export actions and reducer
export const { clearResults } = codeTestResultsSlice.actions;
export const codeTestResultsReducer = codeTestResultsSlice.reducer;
