import { FeaturedDocuments } from "@/components/Landing/FeaturedDocuments";
import { Footer } from "@/components/Landing/Footer";
import { HeroSection } from "@/components/Landing/HeroSection";
import { NavBar } from "@/components/Landing/NavBar";
import { Navigation } from "@/components/Landing/Navigation";
import { OfferSection } from "@/components/Landing/OfferSection";

const page = () => {
  return (
    <section suppressHydrationWarning>
      <NavBar />
      <Navigation />
      <HeroSection />
      <OfferSection />
      <FeaturedDocuments />
      <Footer />
    </section>
  );
};
export default page;
