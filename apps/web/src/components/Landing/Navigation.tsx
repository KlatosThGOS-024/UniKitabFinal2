"use client";
import { FaBorderAll } from "react-icons/fa6";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaNetworkWired } from "react-icons/fa";
import { SiBmcsoftware } from "react-icons/si";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  allSub,
  networkEngineerSub,
  softwareEngineerSub,
} from "../../../public/constants";

interface Subject {
  subName: string;
  subPath: string;
}

const HoveredSubjects = ({
  Subjects,
  onSubjectClick,
}: {
  Subjects: Subject[];
  onSubjectClick: (subPath: string) => void;
}) => {
  return (
    <div>
      <ul>
        {Subjects.map((sub, index) => {
          return (
            <div
              onClick={() => onSubjectClick(sub.subPath)}
              key={index}
              className="cursor-pointer"
            >
              <li className="flex items-center justify-between gap-x-[64px] my-2 hover:text-[#33BFFA] flex-nowrap">
                <span>{sub.subName}</span>
                <FaChevronRight />
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export const Navigation = () => {
  const router = useRouter();
  const [showModalOne, setShowModalOne] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [showModalThree, setShowModalThree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  console.log(params.get("study"));
  const handleModal = (modalNumber: number) => {
    switch (modalNumber) {
      case 1:
        setShowModalTwo(false);
        setShowModalThree(false);
        break;
      case 2:
        setShowModalOne(false);
        setShowModalThree(false);
        break;
      case 3:
        setShowModalOne(false);
        setShowModalTwo(false);
        break;
      default:
        setShowModalOne(false);
        setShowModalTwo(false);
        setShowModalThree(false);
    }
  };

  const handleSubjectClick = (subPath: string) => {
    console.log(params);

    setIsLoading(true);
    setTimeout(() => {
      router.push(`/study/${subPath.replace(/\s+/g, "-")}`);
    }, 1500);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="w-20 h-20 border-[6px] border-white border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <section className="max-lg:hidden block border-[1px] border-x-0 border-b-0">
        <div>
          <ul className="flex items-center relative px-3 justify-between py-3 mx-auto w-[1280px]">
            <li
              onClick={() => {
                setShowModalOne(!showModalOne);
                handleModal(1);
              }}
              className="flex relative group items-center cursor-pointer gap-2"
            >
              <FaBorderAll />
              <span className="text-[18px] cursor-pointer group-hover:text-[#69D4F3]">
                All Subjects
              </span>
              <FaChevronDown />
              {showModalOne && (
                <div className="absolute z-40 px-4 py-1 rounded-lg bg-white top-[38px]">
                  <HoveredSubjects
                    Subjects={allSub}
                    onSubjectClick={handleSubjectClick}
                  />
                </div>
              )}
            </li>
            <li
              onClick={() => {
                setShowModalTwo(!showModalTwo);
                handleModal(2);
              }}
              className="flex relative items-center cursor-pointer group gap-2"
            >
              <SiBmcsoftware />
              <span className="text-[18px] cursor-pointer group-hover:text-[#69D4F3]">
                Software Engineering
              </span>
              <FaChevronDown />
              {showModalTwo && (
                <div className="absolute z-40 px-4 py-1 rounded-lg bg-white top-[38px]">
                  <HoveredSubjects
                    Subjects={softwareEngineerSub}
                    onSubjectClick={handleSubjectClick}
                  />
                </div>
              )}
            </li>
            <li
              onClick={() => {
                setShowModalThree(!showModalThree);
                handleModal(3);
              }}
              className="flex group relative items-center gap-2"
            >
              <FaNetworkWired />
              <span className="text-[18px] group-hover:text-[#69D4F3]">
                Network Engineering
              </span>
              <FaChevronDown />
              {showModalThree && (
                <div className="absolute z-40 px-4 py-1 rounded-lg bg-white top-[38px]">
                  <HoveredSubjects
                    Subjects={networkEngineerSub}
                    onSubjectClick={handleSubjectClick}
                  />
                </div>
              )}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};
