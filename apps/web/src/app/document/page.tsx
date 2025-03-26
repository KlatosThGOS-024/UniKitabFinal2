import { NavBar } from "@/components/Landing/NavBar";
import { UploadPdf } from "@/components/Pdf/UploadPdf";

const page = () => {
  return (
    <section>
      <NavBar />
      <UploadPdf />
    </section>
  );
};

export default page;
