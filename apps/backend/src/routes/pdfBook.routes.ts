import { Router } from "express";

import {
  addPdfBookToDrive,
  getPdfBookName,
  getPdfBookUrl,
  streamPdfFile,
} from "../controllers/pdfBook.controller";
import { upload } from "../middlewares/multer.middleware";

const pdfBookRouter = Router();

pdfBookRouter.route("/pdf-add").post(
  upload.fields([
    { name: "PdfFile", maxCount: 1 },
    { name: "imgSrc", maxCount: 1 },
    {
      name: "fileId",
      maxCount: 1,
    },
  ]),
  addPdfBookToDrive
);
pdfBookRouter.route("/pdf-get").post(getPdfBookName);
pdfBookRouter.route("/url-get").post(getPdfBookUrl);

pdfBookRouter.route("/pdf-stream/:fileId").get(streamPdfFile);

export default pdfBookRouter;
