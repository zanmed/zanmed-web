import { LucideIcon } from "lucide-react";

export type Blog = {
  title: string;
  date: string;
  image: string;
};

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  collection: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  likes: string;
  image: string;
  gallery: string[];
  badge?: string;
  featured?: boolean;
  inStock?: boolean;
  specs: { label: string; value: string }[];
};
export type Idea = { title: string; count: string; image: string };

export type CategoryTile = { title: string; subtitle: string; icon: string };

export type HeroSlide = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  href: string;
  pillTop: string;
  pillBottom: string;
};

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}
