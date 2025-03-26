import { Router } from "express";

import {
  geminiFormatAndRunCode,
  runCode,
} from "../controllers/codeRunner.controller";
const codeRouter = Router();
codeRouter.route("/run-code").post(runCode);
codeRouter.route("/gemini-format-run").post(geminiFormatAndRunCode);

export default codeRouter;
