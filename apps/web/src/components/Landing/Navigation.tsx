"use client";
import { FaBorderAll, FaNetworkWired } from "react-icons/fa6";
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { SiBmcsoftware } from "react-icons/si";
import { useState } from "react";
import Link from "next/link";
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
  onClose,
}: {
  Subjects: Subject[];
  onClose?: () => void;
}) => {
  return (
    <div>
      <ul>
        {Subjects.map((sub, index) => (
          <Link
            href={`/study/${sub.subPath.replace(/\s+/g, "-")}`}
            key={index}
            onClick={onClose}
          >
            <li className="flex cursor-pointer items-center justify-between gap-x-[64px] my-2 hover:text-[#33BFFA] flex-nowrap">
              <span>{sub.subName}</span>
              <FaChevronRight />
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export const Navigation = () => {
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const toggleModal = (modalNumber: number) => {
    setActiveModal(activeModal === modalNumber ? null : modalNumber);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <section className="max-lg:hidden block border-[1px] border-x-0 border-b-0">
        <div>
          <ul className="flex items-center relative px-3 justify-between py-3 mx-auto w-[1280px]">
            <li
              onClick={() => toggleModal(1)}
              className="flex relative group items-center cursor-pointer gap-2"
            >
              <FaBorderAll />
              <span className="text-[18px] cursor-pointer group-hover:text-[#69D4F3]">
                All Subjects
              </span>
              <FaChevronDown />
              {activeModal === 1 && (
                <div className="absolute z-40 px-4 py-1 rounded-lg bg-white top-[38px]">
                  <HoveredSubjects Subjects={allSub} />
                </div>
              )}
            </li>
            <li
              onClick={() => toggleModal(2)}
              className="flex relative items-center cursor-pointer group gap-2"
            >
              <SiBmcsoftware />
              <span className="text-[18px] cursor-pointer group-hover:text-[#69D4F3]">
                Software Engineering
              </span>
              <FaChevronDown />
              {activeModal === 2 && (
                <div className="absolute z-40 px-4 py-1 rounded-lg bg-white top-[38px]">
                  <HoveredSubjects Subjects={softwareEngineerSub} />
                </div>
              )}
            </li>
            <li
              onClick={() => toggleModal(3)}
              className="flex group relative items-center gap-2"
            >
              <FaNetworkWired />
              <span className="text-[18px] group-hover:text-[#69D4F3]">
                Network Engineering
              </span>
              <FaChevronDown />
              {activeModal === 3 && (
                <div className="absolute z-40 px-4 py-1 rounded-lg bg-white top-[38px]">
                  <HoveredSubjects Subjects={networkEngineerSub} />
                </div>
              )}
            </li>
          </ul>
        </div>
      </section>

      {/* Mobile Navigation */}
      <section className="lg:hidden block border-b">
        <div className="px-4 py-3">
          <div className="space-y-2">
            <div
              onClick={() => toggleModal(1)}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FaBorderAll />
                <span>All Subjects</span>
              </div>
              {activeModal === 1 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {activeModal === 1 && (
              <div className="pl-6 py-2">
                <HoveredSubjects
                  Subjects={allSub}
                  onClose={() => setActiveModal(null)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <div
              onClick={() => toggleModal(2)}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SiBmcsoftware />
                <span>Software Engineering</span>
              </div>
              {activeModal === 2 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {activeModal === 2 && (
              <div className="pl-6 py-2">
                <HoveredSubjects
                  Subjects={softwareEngineerSub}
                  onClose={() => setActiveModal(null)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <div
              onClick={() => toggleModal(3)}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FaNetworkWired />
                <span>Network Engineering</span>
              </div>
              {activeModal === 3 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {activeModal === 3 && (
              <div className="pl-6 py-2">
                <HoveredSubjects
                  Subjects={networkEngineerSub}
                  onClose={() => setActiveModal(null)}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
