import Hero from "@/components/home/Hero";
import BrandMarquee from "@/components/home/BrandMarquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandStory from "@/components/home/BrandStory";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <FeaturedProducts />
      <CategoryShowcase />
      <BrandStory />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
