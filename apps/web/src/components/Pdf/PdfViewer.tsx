"use client";
import React, { useEffect, useState } from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { IRootState } from "@/store/store";
import { useSelector } from "react-redux";

export const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize plugins
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  const { CurrentPageLabel, GoToNextPage, GoToPreviousPage } =
    pageNavigationPluginInstance;

  const fileUrl = useSelector((state: IRootState) => {
    return state.fileReducer.FileUrl;
  });

  useEffect(() => {
    if (!fileUrl) {
      setLoading(false);
      return;
    }

    try {
      setPdfUrl(fileUrl);
      setLoading(false);
    } catch (err) {
      console.error("Error setting up PDF viewer:", err);
      setError(
        `Failed to set up PDF viewer: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setLoading(false);
    }
  }, [fileUrl]);

  if (error || !fileUrl) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md max-w-lg">
          <h3 className="font-bold mb-2">Error Loading PDF</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <GoToPreviousPage>
            {(props) => (
              <button
                onClick={props.onClick}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Previous
              </button>
            )}
          </GoToPreviousPage>

          <CurrentPageLabel>
            {(props) => (
              <span>
                Page {props.currentPage} of {props.numberOfPages}
              </span>
            )}
          </CurrentPageLabel>

          <GoToNextPage>
            {(props) => (
              <button
                onClick={props.onClick}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            )}
          </GoToNextPage>
        </div>

        <div className="flex items-center space-x-2">
          <ZoomOut>
            {(props) => (
              <button
                onClick={props.onClick}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                -
              </button>
            )}
          </ZoomOut>

          <ZoomIn>
            {(props) => (
              <button
                onClick={props.onClick}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
            )}
          </ZoomIn>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </Worker>
      </div>
    </div>
  );
};
