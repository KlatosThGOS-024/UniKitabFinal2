import Image from "next/image";
import React from "react";
interface subType {
  imgSrc: string;
  name: string;
}
const subjects = [
  {
    name: "Javascript",
    imgSrc: "/images/featureSubjects/programming.png",
  },
  {
    name: "Music Theory",
    imgSrc: "/images/featureSubjects/music-theory-new.jpg",
  },
  {
    name: "Linear algebra",
    imgSrc: "/images/featureSubjects/linear-algebra-new.jpg",
  },
  {
    name: "Rocket Science",
    imgSrc: "/images/featureSubjects/rocket-science-new.jpg",
  },
];
const tutoringSteps = [
  {
    imgSrc: "https://www.studypool.com/img/howItWorks/question.png",
    title: "Find Past Year Papers",
    description:
      "Search and access previous year question papers in PDF format for various subjects.",
  },
  {
    imgSrc: "https://www.studypool.com/img/howItWorks/explain.png",
    title: "Ask AI for Answers",
    description:
      "Get instant AI-generated answers and explanations for any question from the PYQs.",
  },
  {
    imgSrc: "https://www.studypool.com/img/howItWorks/connect.png",
    title: "Discuss with Peers & Experts",
    description:
      "Engage in discussions with other students and tutors to understand concepts better.",
  },
];

const companyLogos = [
  {
    imgSrc: "https://www.studypool.com/img/mediaLogos/yahoo-min.png",
    alt: "Yahoo Logo",
  },
  {
    imgSrc: "https://www.studypool.com/img/mediaLogos/nas-min.png",
    alt: "NAS Logo",
  },
  {
    imgSrc: "https://www.studypool.com/img/mediaLogos/inc-min.png",
    alt: "Inc Logo",
  },
  {
    imgSrc: "https://www.studypool.com/img/mediaLogos/ent-min.png",
    alt: "Entertainment Logo",
  },
  {
    imgSrc: "https://www.studypool.com/img/mediaLogos/huff-min.png",
    alt: "Huffington Post Logo",
  },
];

const Company = () => {
  return (
    <div className="py-[21px] flex-shrink flex px-5 bg-[#c5c7c9] w-full">
      <div className="mx-auto w-[1200px]">
        <ul className="flex items-center justify-center flex-shrink max-md:gap-[18px] gap-[64px]">
          {companyLogos.map((value, index) => {
            return (
              <li key={index} className="relative w-[126px] h-[50px]">
                <Image
                  fill
                  alt={value.alt}
                  src={value.imgSrc}
                  className="object-contain"
                  sizes="(max-width: 126px) 100vw"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const FeaturedSubjects = ({ sub }: { sub: subType[] }) => {
  return (
    <div>
      <div className="flex items-center max-md:grid bg- grid-cols-2 max-md:px-3 ml-9 gap-[21px]">
        {sub.map((value: subType, index: number) => {
          return (
            <div
              key={index}
              className=" border-[1px] shadow-lg flex-1 rounded-lg"
            >
              <div className="relative w-[196px] h-[96px] ">
                {" "}
                <Image
                  fill
                  sizes="(max-width: 126px) 100vw"
                  alt={value.name}
                  src={value.imgSrc}
                  className="rounded-b-none w-full rounded-lg"
                />
              </div>
              <div
                className=" bg-white ml-3 
              text-[21px] font-[400] text-black"
              >
                <span>{value.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SecondFeaturedSubjects = () => {
  return (
    <div className=" w-full">
      <div className="  grid grid-cols-3 w-full justify-items-center gap-y-[68px] max-lg:grid-cols-2">
        <div className="flex items-center  flex-col">
          <div className="relative w-[48px] h-[48px]">
            {" "}
            <Image
              fill
              sizes="(max-width: 126px) 100vw"
              alt="img1"
              src="https://www.studypool.com/img/icons/topNavbar/mat.png"
              className="rounded-b-none  rounded-lg"
            />
          </div>
          <div
            className=" text-center 
              text-[18px] font-[400] text-black"
          >
            {" "}
            <div className="w-12 h-1 mx-auto  bg-[#1AB9F4] my-1"></div>
            <span>MathMatics</span>
          </div>
        </div>{" "}
        <div className="flex items-center  flex-col">
          <div className="relative w-[48px] h-[48px]">
            {" "}
            <Image
              sizes="(max-width: 126px) 100vw"
              alt="img2"
              fill
              src="https://www.studypool.com/img/icons/topNavbar/sci.png"
              className="rounded-b-none  rounded-lg"
            />
          </div>
          <div
            className=" text-center 
              text-[18px] font-[400] text-black"
          >
            {" "}
            <div className="w-12 h-1 mx-auto  bg-[#1AB9F4] my-1"></div>
            <span>Science</span>
          </div>
        </div>{" "}
        <div className="flex items-center  flex-col">
          <div className="relative w-[48px] h-[48px]">
            {" "}
            <Image
              sizes="(max-width: 126px) 100vw"
              alt="img2"
              fill
              src="https://www.studypool.com/img/icons/topNavbar/bus.png"
              className="rounded-b-none  rounded-lg"
            />
          </div>
          <div
            className=" text-center 
              text-[18px] font-[400] text-black"
          >
            {" "}
            <div className="w-12 h-1 mx-auto  bg-[#1AB9F4] my-1"></div>
            <span>Business</span>
          </div>
        </div>{" "}
        <div className="flex items-center  flex-col">
          <div className="relative w-[48px] h-[48px]">
            {" "}
            <Image
              sizes="(max-width: 126px) 100vw"
              alt="img2"
              fill
              src="https://www.studypool.com/img/icons/topNavbar/pro.png"
              className="rounded-b-none  rounded-lg"
            />
          </div>
          <div
            className=" text-center 
              text-[18px] font-[400] text-black"
          >
            {" "}
            <div className="w-12 h-1 mx-auto  bg-[#1AB9F4] my-1"></div>
            <span>Programming</span>
          </div>
        </div>{" "}
        <div className="flex items-center  flex-col">
          <div className="relative w-[48px] h-[48px]">
            {" "}
            <Image
              sizes="(max-width: 126px) 100vw"
              alt="img2"
              fill
              src="https://www.studypool.com/img/icons/topNavbar/hum.png"
              className="rounded-b-none  rounded-lg"
            />
          </div>
          <div
            className=" text-center 
              text-[18px] font-[400] text-black"
          >
            <div className="w-12 h-1 mx-auto  bg-[#1AB9F4] my-1"></div>

            <span>Humanities</span>
          </div>
        </div>{" "}
        <div className="flex items-center  flex-col">
          <div className="relative w-[48px] h-[48px]">
            {" "}
            <Image
              sizes="(max-width: 126px) 100vw"
              alt="img2"
              fill
              src="https://www.studypool.com/img/icons/topNavbar/wri.png"
              className="rounded-b-none  rounded-lg"
            />
          </div>
          <div
            className=" text-center 
              text-[18px] font-[400] text-black"
          >
            {" "}
            <div className="w-12 h-1 mx-auto  bg-[#1AB9F4] my-1"></div>
            <span>Writing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  feature,
}: {
  feature: {
    imgSrc: string;
    title: string;
    description: string;
  };
}) => {
  return (
    <div>
      <div className="flex flex-col items-center text-center gap-4">
        {" "}
        <div className="w-[48px] relative h-[48px] ">
          <Image
            alt={feature.description}
            sizes="(max-width: 126px) 100vw"
            fill
            src={feature.imgSrc}
          />
        </div>
        <h2 className="text-[#000080c6]">{feature.title}</h2>
        <p className="text-[18px] text-gray-500 max-md:w-[500px] break-words ">
          {feature.description}
        </p>
      </div>{" "}
    </div>
  );
};

export const OfferSection = () => {
  return (
    <section className="">
      <Company />
      <div className="w-[1200px] max-lg:w-[700px]  max-md:w-[600px] mx-auto z-30">
        <div
          className=" w-full
         mx-auto mt-[28px]"
        >
          {" "}
          <h2 className="text-[24px]  text-[#000080] text-center my-[64px]">
            How Q&A Tutoring Works
          </h2>
          <div className="flex max-md:flex-col max-lg:gap-[21px]">
            {tutoringSteps.map((value, index) => {
              return <FeatureCard key={index} feature={value} />;
            })}
          </div>
        </div>
        <div className=" w-full mt-[96px]">
          {" "}
          <h2
            className="text-[24px]  text-[#000080]
           text-center my-[64px]"
          >
            Featured Subjects
          </h2>
          <div className="flex gap-5">
            <FeaturedSubjects sub={subjects} />
          </div>
        </div>{" "}
        <div className=" w-full mt-[96px]">
          {" "}
          <div className="flex gap-5">
            <SecondFeaturedSubjects />
          </div>
        </div>
      </div>
    </section>
  );
};
