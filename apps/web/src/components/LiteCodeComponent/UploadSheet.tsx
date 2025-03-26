"use client";

import React, { useEffect, useState } from "react";
import { ProblemType } from "./ProblemTable";
import {
  createQuestionArray,
  getAllDocs,
  getQuestionsByDocumentId,
  saveQuestionArray,
} from "@/Hooks/problem";
import { v4 as uuidv4 } from "uuid";

const FileUpload = ({ setArrayOfQs }: { setArrayOfQs: any }) => {
  const [suppressHydrationWarning, setSuppressHydrationWarning] =
    useState(false);
  const [files, setFiles] = useState<File | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [problems, setProblems] = useState<any[]>([]);
  const [docSheet, setDocSheets] = useState<
    { img: string; sheetName: string | number; id: string }[]
  >([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSuppressHydrationWarning(true);

    const fetchDocs = async () => {
      try {
        const data = await getAllDocs();
        if (data.data && data.data.length > 0) {
          const transformedData = data.data.map(
            (
              doc: { img: string; sheetName: number; documentId: string },
              index: number
            ) => ({
              img: `/doc1.png`,
              sheetName: `Sheet ${index + 1}`,
              id: doc.documentId,
            })
          );

          setDocSheets(transformedData); // Replace instead of append to prevent hydration issues
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocs();
  }, []);

  const documentHandler = async (id: string) => {
    try {
      const response = await getQuestionsByDocumentId(id);

      setArrayOfQs(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setLoader(true);
      setFiles(file);
      setUploadStatus("Processing file...");
      const uuid = uuidv4();
      const newSheet = {
        id: uuid,
        img: "/doc1.png",
        sheetName: `Sheet ${docSheet.length + 1}`,
      };

      setDocSheets((prevState) => [...prevState, newSheet]);
      try {
        const fileContent = await extractQuestionsFromFile(file);

        const questionArrayJson = await sendQuestionsToBackend(fileContent);
        let questionArray = questionArrayJson
          .replace("```json", "")
          .replace("```", "");
        try {
          if (questionArray) {
            questionArray = JSON.parse(questionArray);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          questionArray = [];
        }

        const processedArray = questionArray.map((item: ProblemType) => {
          return { ...item, id: uuidv4() };
        });

        setArrayOfQs(processedArray);
        saveQuestionArray(uuid, processedArray);
        setUploadStatus(`Successfully processed the file.`);
      } catch (error) {
        console.error("Error processing file:", error);
        setUploadStatus("Error processing file. Please try again.");
      } finally {
        setLoader(false);
      }
    }
  };

  const extractQuestionsFromFile = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        resolve(fileContent);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const sendQuestionsToBackend = async (questions: string) => {
    try {
      const response = await createQuestionArray(questions);
      return response;
    } catch (error) {
      console.error("Error sending questions to backend:", error);
      throw error;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <section
      className="flex flex-col items-start xl:w-[600px] md:w-[500px] mx-auto"
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <div className="flex px-6 w-full flex-col gap-[64px]">
        <div className="max-lg:h-[296px] shadow-md shadow-[#111] flex-shrink rounded-xl px-[64px] py-8">
          <div
            className="max-lg:max-w-[296px] max-w-[396px] h-[396px] max-lg:h-[196px] 
                      mx-auto flex items-center justify-center rounded-xl  
                      border-dotted mt-4 max-lg:py-[109px] border-[4px] border-[#e4e4e762]"
          >
            {loader ? (
              <div className="flex items-center flex-col gap-3">
                <p className="text-[21px] font-[500]">{uploadStatus}</p>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="flex items-center flex-col gap-3">
                {uploadStatus && !loader ? (
                  <p className="text-[16px] text-green-400 mb-2">
                    {uploadStatus}
                  </p>
                ) : null}
                {problems.length > 0 ? (
                  <p className="text-[16px] text-green-400 mb-2">
                    {problems.length} problems extracted
                  </p>
                ) : null}
                <p className="text-[21px] font-[500]">
                  Click to upload your file
                </p>
                <div className="animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-file-up h-14 w-14 text-muted-foreground/70 animate-float"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M12 12v6"></path>
                    <path d="m15 15-3-3-3 3"></path>
                  </svg>
                </div>
                <button className="items-center flex gap-3 rounded-lg px-[38px] hover:opacity-90 py-[12px] text-[16px]">
                  <label className="cursor-pointer px-4 py-2 text-[#e4e4e762] rounded-lg">
                    Upload your DSA questions file (Text, Conver Excel to Text)
                    <input
                      type="file"
                      accept=".csv,.json,.xlsx,.xls,.txt"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-[48px] mt-12 flex items-center">
        {docSheet.map((item, index) => (
          <div
            key={index}
            onClick={() => documentHandler(item.id)}
            className="flex gap-1 flex-col items-center"
          >
            <img
              src={item.img}
              alt={`Document ${index + 1}`}
              className="w-[96px] cursor-pointer"
            />
            <span>{item.sheetName}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FileUpload;
