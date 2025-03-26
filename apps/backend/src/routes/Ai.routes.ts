import { Router } from "express";
import {
  generateProblemArray,
  getAnswer,
  parseDSASheet,
} from "../controllers/AiResponse.controller";
const aiRouter = Router();
aiRouter.route("/get-answer").post(getAnswer);
aiRouter.route("/generate-Qarray").post(generateProblemArray);

aiRouter.route("/get-answer-bysheet").post(parseDSASheet);

export default aiRouter;
