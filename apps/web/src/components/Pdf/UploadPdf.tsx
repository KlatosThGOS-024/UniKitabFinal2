"use client";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaFilePdf } from "react-icons/fa";
import { MdDelete, MdFileUpload } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { useDispatch } from "react-redux";
import { addFileUrl } from "@/functions/docs/file";
import { addPdfBook } from "@/Hooks/pdfBook";

export const UploadPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileChange(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);

      addPdfBook({
        file: file,
        imgSrc: "https://m.media-amazon.com/images/I/71lRYzwNqDL.jpg",
      });

      dispatch(addFileUrl(fileUrl));
    }
  }, [file, dispatch]);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-semibold text-gray-800">Chat Documents</h2>

        {file ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFilePdf className="text-red-500 w-8 h-8" />
                <div>
                  <h3 className="font-medium text-lg">{file.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-gray-600">
                <a
                  href="/pdf/pdf-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoIosLink className="w-5 h-5" />
                </a>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
          <div
            className={`
              w-full h-64 rounded-lg border-2 border-dashed 
              ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
              transition-colors duration-200 flex items-center justify-center
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <MdFileUpload className="w-16 h-16 text-blue-500 mb-4" />
              <p className="text-xl font-medium mb-2">
                Drop your PDF here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Support for PDF documents up to 10MB
              </p>

              {/* This is now just a visual button - the actual click handler is on the parent div */}
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double triggering
                  handleButtonClick();
                }}
              >
                Choose File
                <FaChevronDown className="text-sm" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
