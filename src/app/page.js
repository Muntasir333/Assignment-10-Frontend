import Image from "next/image";
import Banner from "@/components/Banner";
import FeaturedSection from "@/components/Featured";
import ContactUs from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <FeaturedSection />
      <ContactUs />
      <Footer />
    </div>
  );
}
