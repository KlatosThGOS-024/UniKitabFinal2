import { NextFunction, Request, Response } from "express";
import {
  runTimeUserSchemaSignUp,
  runTimeUserSchemaLogin,
  User,
} from "../types/user.types";
import { ApiError } from "../utils/ApiError";
import prismaClient from "@repo/db";
import { asyncHandler } from "../utils/asynchHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { comparePassword } from "../middlewares/auth";
import jwt from "jsonwebtoken";

const generateAuthToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "fallback-secret-key",
    { expiresIn: "1d" }
  );
};

const userRegister = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userDetails = runTimeUserSchemaSignUp.safeParse(req.body);
    if (!userDetails.success) {
      res
        .status(400)
        .json(
          ApiError.badRequest(
            false,
            "Please provide correct credentials",
            userDetails.error
          )
        );
      return;
    }

    const userExist = await prismaClient.user.findFirst({
      where: {
        email: userDetails.data.email,
      },
    });

    if (userExist) {
      res
        .status(409)
        .json(
          ApiError.badRequest(false, "User already exists with this email")
        );
    }

    const user = await prismaClient.user.create({
      data: {
        username: userDetails.data.username,
        email: userDetails.data.email,
        password: userDetails.data.password,
      },
    });

    res
      .status(201)
      .json(ApiResponse.success(201, "User registered successfully", user));
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json(ApiError.internal("Failed to register user"));
  }
});

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userDetails = runTimeUserSchemaLogin.safeParse(req.body);

    if (!userDetails.success) {
      res.json(
        ApiError.badRequest(
          false,
          "Please provide correct credentials",
          userDetails.error
        )
      );
      return;
    }

    const userExist = await prismaClient.user.findFirst({
      where: { username: userDetails.data.username },
    });

    if (!userExist) {
      res.json(ApiError.unauthorized("Invalid username or password"));
      return;
    }

    const isPasswordValid = await comparePassword(
      userDetails.data.password,
      userExist.password
    );

    if (!isPasswordValid) {
      res.json(ApiError.unauthorized("Invalid username or password"));
      return;
    }

    const token = generateAuthToken(userExist);
    await prismaClient.user.update({
      where: { id: userExist.id },
      data: { token: token },
    });

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(ApiResponse.success(200, "Login successful", { userExist, token }));
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.json(ApiError.internal("Failed to process login"));
    return;
  }
});

const getProfile = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json(ApiError.unauthorized("User not authenticated"));
    }

    res
      .status(200)
      .json(ApiResponse.success(200, "Profile retrieved successfully", user));
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json(ApiError.internal("Failed to retrieve profile"));
  }
});

const userLogout = asyncHandler(async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(ApiResponse.success(200, "Logout successful"));
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json(ApiError.internal("Failed to process logout"));
  }
});
const loginCheck = asyncHandler(async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json(ApiError.unauthorized("Access token not found"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret-key"
      ) as { id: string; username: string };

      const user = await prismaClient.user.findFirst({
        where: {
          id: decoded.id,
          token: token,
        },
      });

      if (!user) {
        res.status(401).json(ApiError.unauthorized("Invalid or expired token"));
      }

      res.status(200).json(
        ApiResponse.success(200, "Token is valid", {
          isValid: true,
          userId: user?.id,
        })
      );
    } catch (error) {
      res.status(401).json(ApiError.unauthorized("Invalid or expired token"));
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json(ApiError.internal("Failed to verify token"));
  }
});

export { userRegister, userLogin, userLogout, getProfile, loginCheck };
