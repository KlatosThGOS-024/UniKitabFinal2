import { Router } from "express";

import {
  getProblemFromDb,
  addProblemToDb,
  saveQuestionArray,
  getQuestionArray,
  getAllDocuments,
} from "../controllers/question.controller";

const QuestionDbRouter = Router();

QuestionDbRouter.route("/question-add").post(addProblemToDb);
QuestionDbRouter.route("/question-addArray").post(saveQuestionArray);
QuestionDbRouter.route("/question-get").get(getProblemFromDb);
QuestionDbRouter.route("/getQuestionArray").get(getQuestionArray);
QuestionDbRouter.route("/documents").get(getAllDocuments);
export default QuestionDbRouter;
