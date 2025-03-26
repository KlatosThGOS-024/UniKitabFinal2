"use client";
import React, { useState, useCallback, memo } from "react";
import { IoIosSend } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import { FaBahai } from "react-icons/fa";
import { UserResponse } from "./UserMessage";
import { AiResponse } from "./AiMessage";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/store";
import PdfToText from "@/utils/pdfGeneration/PdfToText";
import { getAIresponse } from "@/Hooks/AiApi";

interface ResponseProp {
  response_frm: string;
  response: string;
  responseId: string;
}

const InputTaker = memo(
  ({
    setUserMessage,
    setStartingPageNumber,
    setEndingPageNumber,
  }: {
    setUserMessage: React.Dispatch<React.SetStateAction<string>>;
    setStartingPageNumber: React.Dispatch<
      React.SetStateAction<number | undefined>
    >;
    setEndingPageNumber: React.Dispatch<
      React.SetStateAction<number | undefined>
    >;
  }) => {
    const handleTextAreaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setUserMessage(e.target.value);
    };

    const handleTextAreaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    };

    const handleStartPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartingPageNumber(
        e.target.value ? parseInt(e.target.value) : undefined
      );
    };

    const handleEndPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndingPageNumber(
        e.target.value ? parseInt(e.target.value) : undefined
      );
    };

    return (
      <div className="w-full items-center gap-2 flex">
        <textarea
          onChange={handleTextAreaChange}
          onInput={handleTextAreaInput}
          className="w-full py-[16px] px-4 text-[21px] bg-[#fff] text-[#111] rounded-lg outline-none placeholder:text-[21px] transition-all resize-none"
          rows={1}
          placeholder="Enter your input"
        />
        <div className="space-y-2">
          <input
            onChange={handleStartPageChange}
            className="w-[64px] bg-[#fff] text-[#111] rounded-md outline-none placeholder:px-2 transition-all resize-none"
            placeholder="start"
            type="number"
          />
          <input
            onChange={handleEndPageChange}
            className="w-[64px] bg-[#fff] text-[#111] rounded-md outline-none placeholder:px-2 transition-all resize-none"
            placeholder="end"
            type="number"
          />
        </div>
      </div>
    );
  }
);

InputTaker.displayName = "InputTaker";

const MessageItem = memo(({ value }: { value: ResponseProp }) => (
  <div
    className={`flex ${value.response_frm === "User" ? "justify-end" : "justify-start"}`}
  >
    {value.response_frm === "User" ? (
      <UserResponse message={value.response} />
    ) : (
      <AiResponse message={value.response} />
    )}
  </div>
));

MessageItem.displayName = "MessageItem";

const Response = memo(({ response }: { response: ResponseProp[] }) => (
  <section className="w-full my-7 pb-[64px] pt-4">
    <div className="flex flex-col gap-[28px]">
      {response.map((value, index) => (
        <MessageItem key={value.responseId + "-" + index} value={value} />
      ))}
    </div>
  </section>
));

Response.displayName = "Response";

export const Input = ({
  setResponse,
}: {
  setResponse: React.Dispatch<React.SetStateAction<ResponseProp[]>>;
}) => {
  const fileUrl = useSelector((state: IRootState) => state.fileReducer.FileUrl);
  const [userMessage, setUserMessage] = useState("");
  const [startingPageNumber, setStartingPageNumber] = useState<number>();
  const [endingPageNumber, setEndingPageNumber] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const getPdf = useCallback(async () => {
    if (!fileUrl || !startingPageNumber || !endingPageNumber) return "";

    try {
      const pdfProcessor = new PdfToText(fileUrl);
      return await pdfProcessor.getTextualData(
        startingPageNumber,
        endingPageNumber
      );
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      return "";
    }
  }, [fileUrl, startingPageNumber, endingPageNumber]);

  const onClickHandler = useCallback(async () => {
    if (!userMessage || isLoading) return;

    setIsLoading(true);

    try {
      const newResponse: ResponseProp = {
        response_frm: "User",
        response: userMessage,
        responseId: Date.now().toString(),
      };

      setResponse((prev) => [...prev, newResponse]);

      let prompt = userMessage;

      if (startingPageNumber && endingPageNumber) {
        const pdfText = await getPdf();
        if (pdfText) {
          prompt += `\n\nPDF content from page ${startingPageNumber} to ${endingPageNumber}:\n${pdfText}`;
        }
      }

      const aiResponse = await getAIresponse(prompt);

      if (aiResponse?.satusCode === 200) {
        const aiMessage: ResponseProp = {
          response_frm: "Ai",
          response: aiResponse.success,
          responseId: Date.now().toString(),
        };

        setResponse((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    userMessage,
    startingPageNumber,
    endingPageNumber,
    getPdf,
    setResponse,
    isLoading,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onClickHandler();
    }
  };

  return (
    <div className="py-2 rounded-lg w-full max-md:px-3 bg-[#F8F5EE] shadow-2xl">
      <div className="flex max-sm:gap-[16px] max-md:gap-3 md:gap-[21px] px-[14px] py-[8px] items-center">
        <CiCamera className="w-[28px] h-[28px] cursor-pointer hover:text-[#FF612E]" />
        <FaBahai className="w-[28px] h-[28px] cursor-pointer hover:text-[#FF612E]" />
        <div className="w-full" onKeyDown={handleKeyDown}>
          <InputTaker
            setUserMessage={setUserMessage}
            setStartingPageNumber={setStartingPageNumber}
            setEndingPageNumber={setEndingPageNumber}
          />
        </div>
        <IoIosSend
          onClick={onClickHandler}
          className={`cursor-pointer w-[28px] h-[28px] m-2 ${isLoading ? "opacity-50" : "hover:text-[#FF612E]"}`}
        />
      </div>
    </div>
  );
};

const initialResponses: ResponseProp[] = [
  {
    response_frm: "User",
    response: "Q2",
    responseId: "initial-1",
  },
  {
    response_frm: "Ai",
    response:
      "Question 2 (a): The minimum height of a binary tree is equal to the depth of the tree.",
    responseId: "initial-2",
  },
];

export const ResponseBox = () => {
  const [responses, setResponses] = useState<ResponseProp[]>(initialResponses);

  return (
    <section className="relative h-screen flex max-md:space-y-[96px] max-md:flex-row-reverse flex-col">
      <div className="flex-grow w-full pb-[196px] flex flex-col">
        <Response response={responses} />
      </div>
      <div className="md:w-1/2 max-md:w-full fixed bottom-0 md:right-0 bg-white">
        <div className="max-w-full mx-auto max-md:w-full">
          <Input setResponse={setResponses} />
        </div>
      </div>
    </section>
  );
};
