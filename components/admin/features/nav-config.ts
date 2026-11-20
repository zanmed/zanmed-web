import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Layers,
  LayoutTemplate,
  GalleryHorizontal,
  MessageCircle,
  FileText,
  Settings,
  Shield,
} from "lucide-react";

export type DashboardRole = "admin" | "staff" | "writer";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: DashboardRole[];
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    roles: ["admin", "staff"],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    roles: ["admin", "staff"],
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: Layers,
    roles: ["admin", "staff"],
  },
  {
    label: "Homepage Content",
    href: "/admin/hero-slides",
    icon: LayoutTemplate,
    roles: ["admin", "staff"],
    children: [
      {
        label: "Hero Slides",
        href: "/admin/hero-slides",
        icon: GalleryHorizontal,
        roles: ["admin", "staff"],
      },
    ],
  },
  {
    label: "WhatsApp Orders",
    href: "/admin/whatsapp-orders",
    icon: MessageCircle,
    roles: ["admin", "staff"],
  },
  {
    label: "Blog",
    href: "/admin/blogs",
    icon: FileText,
    roles: ["admin", "staff", "writer"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin", "staff"],
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Shield,
    roles: ["admin"],
  },
];
