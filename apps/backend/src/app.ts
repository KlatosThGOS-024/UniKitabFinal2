import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express, { NextFunction, Request, Response } from "express";
import { ApiError } from "./utils/ApiError";
import { ApiResponse } from "./utils/ApiResponse";
import userRouter from "./routes/user.routes";

import pdfBookRouter from "./routes/pdfBook.routes";

import cors from "cors";
import QuestionDbRouter from "./routes/question.routes";
import aiRouter from "./routes/Ai.routes";
import codeRouter from "./routes/codeRunner.routes";
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const response = ApiResponse.failure(400, err.message, err.details);
  res.status(statusCode).json(response);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/questions", QuestionDbRouter);
app.use("/api/v1/book", pdfBookRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/codeRunner", codeRouter);
export default app;
