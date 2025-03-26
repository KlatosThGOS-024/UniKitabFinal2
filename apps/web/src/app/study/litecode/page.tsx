import { NavBar } from "@/components/Landing/NavBar";
import LiteCodeBody from "@/components/LiteCodeComponent/ProblemTable";
import React from "react";

const page = () => {
  return (
    <section>
      <NavBar />

      <LiteCodeBody />
    </section>
  );
};
export default page;
