import Image from "next/image";
import Banner from "@/components/Banner";
import FeaturedSection from "@/components/Featured";
import ContactUs from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedSection />
      <ContactUs />
      <Footer />
    </div>
  );
}
