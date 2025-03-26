"use client";

import {
  Difficulty,
  Problem,
} from "@/components/LiteCodeComponent/MockProblem/types/types";
import {
  LeftSideProblemDescription,
  RightSideCodeEditor,
} from "@/components/LiteCodeComponent/ProblemPageSekeleton";
import CodeTestResults from "@/components/LiteCodeComponent/TestResult";
import { IRootState } from "@/store/store";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Split from "react-split";

const ProblemPageSekeleton = () => {
  const defaultProblem: Problem = {
    problemNumber: "0",
    problemId: "",
    problemTitle: "",
    inputText1: "",
    inputText2: "",
    inputText3: "",
    difficulty: Difficulty.Easy,
    likesCount: 0,
    dislikeCount: 0,
    handlerFunc: "",
    starterFunction: "",
    examples: [],
    testCases: [],
  };

  const [selectedProblem, setSelectedProblem] =
    useState<Problem>(defaultProblem);

  const selectQuestionById = useSelector(
    (state: IRootState) => state.QuestionReducer
  );

  const params = useSearchParams();
  const problemId = params.get("problemId") || "";

  useEffect(() => {
    const foundProblem = selectQuestionById.find(
      (item: Problem) => item.problemId === problemId
    );
    if (foundProblem) {
      setSelectedProblem(foundProblem);
    }
  }, [problemId, selectQuestionById]);

  if (!selectedProblem) {
    return <div>Problem data not available.</div>;
  }

  return (
    <div>
      <Split className="split h-screen bg-[#111]">
        <div className="my-1 overflow-auto mx-1">
          <LeftSideProblemDescription
            ResponseExampleProp={selectedProblem.examples}
            ResponseProblemProp={selectedProblem}
          />
        </div>
        <div>
          <RightSideCodeEditor
            ProblemDescription={`${selectedProblem.inputText1} ${selectedProblem.inputText2} ${selectedProblem.inputText3}`}
            ResponseTestCasesProp={selectedProblem.testCases}
            starterFunction={selectedProblem.starterFunction}
          />
        </div>
      </Split>
    </div>
  );
};

const Page = () => {
  return (
    <section>
      <ProblemPageSekeleton />
      <CodeTestResults />
    </section>
  );
};
export default Page;
