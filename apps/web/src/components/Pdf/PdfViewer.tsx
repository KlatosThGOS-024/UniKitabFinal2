"use client";
import React, { useState } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import * as pdfjsLib from "pdfjs-dist";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/store";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
export const PdfViewer = () => {
  const selector = useSelector((state: IRootState) => {
    console.log(state.fileReducer.FileUrl);
    return state.fileReducer.FileUrl;
  });
  const [loader, setLooader] = useState(true);
  const onLoader = (param: boolean) => {
    setLooader(param);
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      <div className="h-screen overflow-hidden border w-full border-gray-300">
        <Viewer
          fileUrl={`${selector}`}
          plugins={[defaultLayoutPluginInstance]}
          onDocumentLoad={() => onLoader(false)}
        />
      </div>
    </>
  );
};
