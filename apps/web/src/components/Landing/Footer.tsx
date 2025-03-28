import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { CiLinkedin } from "react-icons/ci";
import { MdEmail } from "react-icons/md";

export const Footer = () => {
  return (
    <section className="bg-[#2E2E2E] mt-[64px] py-[64px]">
      <div className=" w-[1200px] max-md:w-[600px] mx-auto">
        <div className="flex max-xl:gap-[28px] xl:justify-between max-xl:items-center max-xl:flex-col">
          <h2 className="text-[28px] text-[#C34326]">
            Uni<span className="text-[#A4A4A4]">Kitab</span>
          </h2>
          <div>
            <ul className="flex gap-[64px]">
              {" "}
              <div>
                {" "}
                <li className=" hover:opacity-90 text-[18px] cursor-pointer text-[#A4A4A4] space-y-2">
                  <a className="underline-offset-2 underline ">Pricing</a>
                </li>{" "}
                <li className=" hover:opacity-90 text-[18px] cursor-pointer text-[#A4A4A4] space-y-2">
                  <a className="underline-offset-2 underline ">
                    Terms and conditions
                  </a>
                </li>
                <li className=" hover:opacity-90 text-[18px] cursor-pointer text-[#A4A4A4] space-y-2">
                  <a className="underline-offset-2 underline ">
                    Privacy Policy
                  </a>
                </li>
              </div>
              <div>
                {" "}
                <li className=" hover:opacity-90 text-[18px] cursor-pointer text-[#A4A4A4] space-y-2">
                  <a className="underline-offset-2 underline ">Contact us</a>
                </li>
                <li className=" hover:opacity-90 text-[18px] cursor-pointer text-[#A4A4A4] space-y-2">
                  <a className="underline-offset-2 underline ">
                    Follow on twitter
                  </a>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <hr className="text-[#A4A4A4] mt-[64px]"></hr>{" "}
        <div
          className="flex max-xl:gap-[28px] items-center py-[44px] 
        xl:justify-between max-xl:items-center max-xl:flex-col
        
        "
        >
          <h3 className="text-[#737373]">
            © 2025 UniKitab. All rights reserved.
          </h3>
          <div className="flex items-center mt-3 gap-[24px]">
            {" "}
            <div className=" cursor-pointer border-[1px] p-3 rounded-full">
              <BsTwitterX />
            </div>{" "}
            <div className=" cursor-pointer border-[1px] p-3 rounded-full">
              <CiLinkedin />
            </div>{" "}
            <div className=" cursor-pointer border-[1px] p-3 rounded-full">
              <MdEmail />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
