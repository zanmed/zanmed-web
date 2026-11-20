import { getActiveHeroSlides } from "@/lib/data/hero-slides";
import HeroCarousel from "./hero-carousel";

export default async function HeroSection() {
  const slides = await getActiveHeroSlides();

  if (slides.length === 0) return null;

  return <HeroCarousel slides={slides} />;
}
