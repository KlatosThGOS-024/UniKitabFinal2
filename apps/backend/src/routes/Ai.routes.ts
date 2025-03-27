import { Router } from "express";
import {
  generateProblem,
  generateProblemArray,
  getAnswer,
} from "../controllers/AiResponse.controller";
const aiRouter = Router();
aiRouter.route("/get-answer").post(getAnswer);
aiRouter.route("/generate-QuestionArray").post(generateProblemArray);
aiRouter.route("/generate-Question-byIdAndTitle").post(generateProblem);

// aiRouter.route("/get-answer-bysheet").post(parseDSASheet);
export default aiRouter;
