import { Request, Response } from "express";
import fs from "fs";
import { Drive } from "../utils/drive/googleDrive";
import { asyncHandler } from "../utils/asynchHandler";
import prisma from "@repo/db";

const addPdfBookToDrive = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pdfFile = req.files;
    const pdfData = req.body;

    const drive = new Drive();
    const authClient = await drive.authorize();
    //@ts-ignore
    const file = pdfFile?.PdfFile[0];
    const uploadPath = file?.path;
    const fileIdD =
      (await drive.uploadFile(authClient, uploadPath, file?.originalname)) ||
      "";
    fs.unlinkSync(uploadPath);

    const pdfCreate = await prisma.pdfBook.create({
      data: {
        name: file?.originalname,
        bookFrontImgSrc: pdfData.imgSrc,
        fileId: fileIdD,
      },
    });

    res.json({ message: "PDF uploaded successfully!", fileIdD });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Failed to upload PDF", error });
  }
});
const getPdfBookName = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Name parameter is required" });
    }

    const getPDf = await prisma.pdfBook.findMany({
      where: {
        name: {
          startsWith: name,
          mode: "insensitive",
        },
      },
    });

    res.json({ message: "PDF get successfully!", getPDf });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get PDF", error: String(error) });
  }
});

const getPdfBookUrl = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      res.status(400).json({ message: "File ID parameter is required" });
    }
    const pdfBook = await prisma.pdfBook.findFirst({
      where: {
        fileId: fileId,
      },
    });

    if (!pdfBook) {
      res.status(400).json({ message: "PDF book not found" });
    }
    const drive = new Drive();
    const authClient = await drive.authorize();

    const proxyUrl = `api/v1/book/pdf-stream/${fileId}`;
    res.json({
      message: "PDF URL retrieved successfully!",
      data: {
        downloadUrl: proxyUrl,
        fileName: pdfBook?.name || "document.pdf",
        fileId: fileId,
      },
    });
  } catch (error) {
    console.error("Error getting PDF URL:", error);
    res.status(500).json({
      message: "Failed to get PDF URL",
      error: String(error),
    });
  }
});
const streamPdfFile = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      res.status(400).json({ message: "File ID parameter is required" });
    }

    const drive = new Drive();
    const authClient = await drive.authorize();

    const fileMetadata = await drive.getFile(authClient, fileId);

    if (!fileMetadata) {
      res.status(404).json({ message: "File not found" });
    }

    const fileStream = await drive.getFileStream(authClient, fileId);

    if (!fileStream) {
      res.status(404).json({ message: "File stream could not be created" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",

      `inline; filename="${fileMetadata?.name || "document.pdf"}"`
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    fileStream?.pipe(res);

    fileStream?.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: "Error streaming file", error: String(error) });
      } else {
        res.end();
      }
    });
  } catch (error) {
    console.error("Error streaming PDF:", error);
    res.status(500).json({
      message: "Failed to stream PDF",
      error: String(error),
    });
  }
});

export { addPdfBookToDrive, getPdfBookName, getPdfBookUrl, streamPdfFile };
