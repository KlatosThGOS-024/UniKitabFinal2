import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynchHandler";
import prisma from "@repo/db";

const addProblemToDb = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      problemNumber,
      problemId,
      inputText1,
      inputText2,
      inputText3,
      problemTitle,
      testCases,
      examples,
      difficulty,
      handlerFunc,
      likesCount,
      dislikeCount,
      starterFunction,
    } = req.body;

    if (
      !problemNumber ||
      !problemId ||
      !problemTitle ||
      !testCases ||
      !examples ||
      !difficulty
    ) {
      res.status(400).send(ApiResponse.failure(400, "Missing required fields"));
    }

    const createProblem = await prisma.problem.create({
      data: {
        starterFunction,
        handlerFunc,
        likesCount,
        dislikeCount,
        problemNumber,
        problemId,
        inputText1,
        inputText2,
        inputText3,
        problemTitle,
        difficulty,
        examples: {
          create: examples.map(
            (example: {
              inputText: any;
              outputText: any;
              explanation: any;
            }) => ({
              inputText: example.inputText,
              outputText: example.outputText,
              explanation: example.explanation,
            })
          ),
        },
        testCases: {
          create: testCases.map((testCase: { input: any; output: any }) => ({
            input: testCase.input,
            output: testCase.output,
          })),
        },
      },
    });

    res.send(
      ApiResponse.success(201, "Successfully added the problem", createProblem)
    );
  } catch (error) {
    console.error("Database error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while adding the problem.";
    res.send(ApiError.badRequest(false, errorMessage));
  }
});
const getProblemFromDb = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { problemId } = req.query;
    if (!problemId) {
      res.send(ApiResponse.failure(400, "Missing required fields ProblemId"));
    }

    const findProblem = await prisma.problem.findFirst({
      where: {
        //@ts-ignore
        problemId,
      },
    });

    res.send(
      ApiResponse.success(201, "Successfully added the problem", findProblem)
    );
  } catch (error) {
    console.error("Database error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while adding the problem.";
    res.send(ApiError.badRequest(false, errorMessage));
  }
});

const saveQuestionArray = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { documentId, questions } = req.body as {
      documentId: string;
      questions: {
        id: number;
        questionTitle: string;
        difficulty: "Easy" | "Medium" | "Hard";
        category: string;
        status: boolean;
        solution: string;
      }[];
    };

    if (!documentId) {
      throw new ApiError("documentId is required", 400);
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new ApiError(
        "Questions array is required and must not be empty",
        400
      );
    }

    try {
      const document = await prisma.questionDocument.upsert({
        where: { documentId },
        update: {},
        create: { documentId },
      });

      const response = await prisma.question.createMany({
        data: questions.map(
          (question: {
            id: number;
            questionTitle: string;
            difficulty: "Easy" | "Medium" | "Hard";
            category: string;
            status: boolean;
            solution: string;
          }) => ({
            id: question.id.toString(),
            questionTitle: question.questionTitle,
            difficulty: question.difficulty,
            category: question.category,
            status: question.status,
            solution: question.solution,
            documentId: documentId,
          })
        ),
        skipDuplicates: true,
      });

      res.json(
        new ApiResponse(200, true, "Questions saved successfully", response)
      );
    } catch (error: any) {
      console.error("Error saving questions:", error);
      throw new ApiError(error.message || "Failed to save questions", 500);
    }
  }
);

const getQuestionArray = asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.query;

  if (!documentId) {
    throw new ApiError("documentId is required", 400);
  }

  try {
    const questions = await prisma.question.findMany({
      //@ts-ignore
      where: { documentId },
    });

    if (questions.length === 0) {
      throw new ApiError("No questions found for this document", 404);
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          true,
          "Questions retrieved successfully",
          questions
        )
      );
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    throw new ApiError(error.message || "Failed to fetch questions", 500);
  }
});
const getAllDocuments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documents = await prisma.questionDocument.findMany({
        select: {
          documentId: true,
          createdAt: true,
        },
      });

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            true,
            "Documents retrieved successfully",
            documents
          )
        );
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      throw new ApiError(error.message || "Failed to fetch documents", 500);
    }
  }
);
export {
  addProblemToDb,
  getProblemFromDb,
  saveQuestionArray,
  getQuestionArray,
  getAllDocuments,
};
