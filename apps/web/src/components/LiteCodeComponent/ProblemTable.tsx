"use client";

import React, { useEffect, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { RiArrowUpDownLine } from "react-icons/ri";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";

import { Problem } from "./MockProblem/types/types";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/store";
import { addQ } from "@/functions/dsaQuestions/question";
import { addQtoDb, createQuestion, getQuestions } from "@/Hooks/problem";

import FileUpload from "./UploadSheet";

export interface ProblemType {
  id: string;
  questionTitle: string;
  difficulty: string;
  category: string;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ClientSideProblems = ({
  arrayOfQs,
}: {
  arrayOfQs: ProblemType[] | string;
}) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<string>("All levels");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Categories");

  const storeQuestions = useSelector(
    (state: IRootState) => state.QuestionReducer
  );
  const dispatch = useDispatch();

  const QuestionHandler = async (title: string, id: string) => {
    try {
      setLoading(true);
      setError(null);

      const questionInStore = storeQuestions.find(
        (item: Problem) => item.problemId === id
      );

      if (questionInStore) {
        setProblem(questionInStore);
        setLoading(false);
        return questionInStore;
      }

      const questionInDb = await getQuestions(id);

      if (questionInDb && questionInDb.length > 0) {
        dispatch(addQ(questionInDb[0]));
        setProblem(questionInDb[0]);
        setLoading(false);
        return questionInDb[0];
      }

      const response = await createQuestion(title, id);

      if (!response || !response[0]) {
        throw new Error("Failed to create question");
      }

      dispatch(addQ(response[0]));
      setProblem(response[0]);
      setLoading(false);
      return response[0];
    } catch (err) {
      console.error("Error in QuestionHandler:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (problem) {
      addQtoDb(problem)
        .then(() => console.log("Successfully saved to DB"))
        .catch((err) => console.error("Error saving to DB:", err));
    }
  }, [problem]);

  const problemsList = Array.isArray(arrayOfQs) ? arrayOfQs : [];

  const filteredProblems = problemsList.filter((problem: ProblemType) => {
    const matchesSearch = problem.questionTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "All levels" ||
      problem.difficulty === difficultyFilter;

    const matchesCategory =
      categoryFilter === "All Categories" ||
      problem.category === categoryFilter;

    const matchesStatus = true;

    return (
      matchesSearch && matchesDifficulty && matchesCategory && matchesStatus
    );
  });

  return (
    <div className="overflow-x-auto rounded-xl">
      {loading && <LoadingSpinner />}
      {error && (
        <div className="p-4 text-red-500 bg-red-100 rounded-md mb-4">
          Error: {error}
        </div>
      )}

      <div>
        <div
          className="w-full mb-3 mt-[64px] gap-3 
          flex items-center flex-col md:flex-row
          justify-between"
        >
          <div
            className="flex w-full items-center
           py-1 px-3 gap-3 border-[1px] rounded-lg"
          >
            <CiSearch className="w-9 h-9" />
            <input
              className="w-full px-3 py-[7px]
               outline-none placeholder:text-[18px] placeholder:text-white rounded-lg bg-transparent"
              placeholder="search question"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div
            className="flex gap-4 items-center w-full md:w-auto
            mt-3 md:mt-0 flex-wrap md:flex-nowrap"
          >
            <select
              className="py-2 px-4 rounded-md bg-gray-500
                hover:bg-gray-600 border border-gray-400 w-full md:w-auto"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option>All levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select
              className="py-2 px-4 rounded-md bg-gray-500
                hover:bg-gray-600 border border-gray-400 w-full md:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Solved</option>
              <option>Attempted</option>
              <option>Not Started</option>
            </select>

            <select
              className="py-2 px-4 rounded-md bg-gray-500
                hover:bg-gray-600 border border-gray-400 w-full md:w-auto"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All Categories</option>
              <option>Array</option>
              <option>String</option>
              <option>Tree</option>
              <option>Graph</option>
              <option>Dynamic Programming</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {problemsList.length === 0 ? (
            <div className="text-center py-8 text-white">
              No problems available. Please upload a question set.
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-8 text-white">
              No problems match your filters.
            </div>
          ) : (
            <table className="table-auto w-full rounded-xl border-collapse border border-gray-600">
              <thead>
                <tr className="bg-[#1A1A1A] text-white">
                  <th className="border border-gray-600 px-4 py-2">
                    <div className="flex gap-2 items-center">
                      <span>Title</span>
                      <RiArrowUpDownLine />
                    </div>
                  </th>
                  <th className="border border-gray-600 px-4 py-2">
                    <div className="flex gap-2 items-center">
                      <span>Difficulty</span>
                      <RiArrowUpDownLine />
                    </div>
                  </th>
                  <th className="border border-gray-600 px-4 py-2">
                    <div className="flex gap-2 items-center">
                      <span>Category</span>
                      <RiArrowUpDownLine />
                    </div>
                  </th>
                  <th className="border border-gray-600 px-4 py-2">
                    <div className="flex gap-2 items-center">
                      <span>Status</span>
                      <RiArrowUpDownLine />
                    </div>
                  </th>
                  <th className="border border-gray-600 px-4 py-2">
                    <div className="flex gap-2 items-center">
                      <span>Solution</span>
                      <RiArrowUpDownLine />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((value: ProblemType, index: number) => (
                  <tr
                    key={value.id || index}
                    className={`${index % 2 === 0 ? "bg-[#2C2C2D]" : "bg-[#111]"} text-white hover:bg-gray-700 transition-colors`}
                  >
                    <td className="text-[18px] font-[500] px-4 py-4">
                      <Link
                        href={`/problems/${value.questionTitle}?problemId=${value.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          QuestionHandler(value.questionTitle, value.id).then(
                            () => {
                              window.location.href = `/problems/${value.questionTitle}?problemId=${value.id}`;
                            }
                          );
                        }}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {value.questionTitle}
                      </Link>
                    </td>
                    <td
                      className={`text-[18px] font-[500] px-4 py-4 ${
                        value.difficulty === "Easy"
                          ? "text-green-500"
                          : value.difficulty === "Medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {value.difficulty}
                    </td>
                    <td className="text-[18px] font-[500] px-4 py-4">
                      {value.category}
                    </td>
                    <td className="text-[18px] font-[500] px-4 py-4 text-center">
                      <BsCheck2Circle className="text-green-500 w-6 h-6 mx-auto" />
                    </td>
                    <td className="text-[18px] font-[500] px-4 py-4 text-center">
                      <Link
                        href={`/solutions/${value.id}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const Problems = ({ arrayOfQs }: { arrayOfQs: ProblemType[] | string }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-[400px] bg-[#1A1A1A]"></div>;
  }

  return <ClientSideProblems arrayOfQs={arrayOfQs} />;
};

const LiteCodeBody = () => {
  const [arrayOfQs, setArrayOfQs] = useState<ProblemType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  console.log(arrayOfQs);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="min-h-screen bg-[#1A1A1A]">
        <div className="max-lg:grid-cols-1 lg:px-[96px] px-[38px] grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="min-h-[400px]"></div>
          <div className="min-h-[400px]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#1A1A1A]">
      <div className="max-lg:grid-cols-1 lg:px-[96px] px-[38px] grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <FileUpload setArrayOfQs={setArrayOfQs} />
        </div>
        <div>
          <Problems arrayOfQs={arrayOfQs} />
        </div>
      </div>
    </section>
  );
};

export default LiteCodeBody;
