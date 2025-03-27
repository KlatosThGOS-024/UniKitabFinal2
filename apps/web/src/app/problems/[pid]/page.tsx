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

  const [selectedProblem, setSelectedProblem] = useState<Problem[]>([
    defaultProblem,
  ]);

  const questionReducer = useSelector(
    (state: IRootState) => state.QuestionReducer
  );

  useEffect(() => {
    // console.log("Updating selectedProblem:", questionReducer);
    setSelectedProblem(questionReducer);
  }, [questionReducer]); // Runs only when `questionReducer` changes
  // /state.QuestionReducer
  const params = useSearchParams();
  const problemId = params.get("problemId") || "";
  // useEffect(() => {
  //   const foundProblem = selectQuestionById.map((item: Problem) => {
  //     // console.log(item);
  //     if (item.problemId === problemId) {
  //       return item;
  //     }
  //   });
  //   if (foundProblem) {
  //     //@ts-ignore
  //     setSelectedProblem(foundProblem);
  //   }
  // }, [problemId, selectQuestionById]);
  // console.log("helllohelllohelllohelllohelllo", selectedProblem);
  if (!selectedProblem) {
    return <div>Problem data not available.</div>;
  }

  return (
    <div>
      <Split className="split h-screen bg-[#111]">
        <div className="my-1 overflow-auto mx-1">
          <LeftSideProblemDescription
            ResponseExampleProp={selectedProblem[0].examples}
            ResponseProblemProp={selectedProblem[0]}
          />
        </div>
        <div>
          <RightSideCodeEditor
            ProblemDescription={`${selectedProblem[0].inputText1} ${selectedProblem[0].inputText2} ${selectedProblem[0].inputText3}`}
            ResponseTestCasesProp={selectedProblem[0].testCases}
            starterFunction={selectedProblem[0].starterFunction}
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
