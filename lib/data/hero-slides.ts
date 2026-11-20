import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { HeroSlide } from "@/generated/prisma/client";

export async function getHeroSlides() {
  "use cache";
  cacheTag("hero-slides");
  cacheLife("default");

  return prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function getAllHeroSlidesForAdmin(): Promise<HeroSlide[]> {
  "use cache";
  cacheTag("hero-slides");
  cacheLife("default");

  return prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  "use cache";
  cacheTag("hero-slides");
  cacheLife("default");

  return prisma.heroSlide.findUnique({ where: { id } });
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  "use cache";
  cacheTag("hero-slides");
  cacheLife("default");

  return prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}
