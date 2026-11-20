"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Gift,
  Star,
  Camera,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import type { Product } from "@/lib/types";

export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Exclusive Deals & Newsletter Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.45fr] lg:gap-5">
        <div className="flex min-h-40 sm:min-h-50 flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-bronze p-5 sm:p-6 text-white rounded-sm">
          <Gift size={40} className="shrink-0" />
          <div className="min-w-0">
            <h2 className="font-serif text-2xl sm:text-[27px] font-medium leading-tight">
              Exclusive Deals for You!
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-white/90">
              Save more on top-rated gadgets handpicked just for you.
            </p>

            <Link
              href="/deals"
              className="mt-3 inline-flex items-center gap-2 rounded-xs bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Shop Deals <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex min-h-40 sm:min-h-50 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 bg-white/50 p-5 sm:p-6 rounded-sm">
          <div className="w-full max-w-md">
            <h2 className="font-serif text-2xl sm:text-[27px] font-medium leading-tight text-slate-900">
              Get the Latest Tech & Deals
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Join our newsletter and never miss an update.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex w-full flex-col sm:flex-row gap-2 sm:gap-0"
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-9 w-full min-w-0 border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-bronze sm:rounded-r-none"
              />
              <button
                type="submit"
                className="h-9 shrink-0 border-0 bg-bronze px-4 text-xs font-bold text-white transition-colors hover:bg-red-700 sm:rounded-l-none"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="hidden sm:block text-6xl lg:text-7xl text-bronze -rotate-12 select-none shrink-0 font-bold pr-2">
            ✉
          </div>
        </div>
      </div>

      {/* 4 Feature Columns */}
      <div className="grid grid-cols-2 gap-6 border-t border-slate-200 py-6 text-xs text-slate-900 sm:grid-cols-2 md:grid-cols-4">
        <Link
          href="/about"
          className="flex flex-col font-medium transition-colors hover:text-bronze"
        >
          100% Authentic
          <small className="text-[11px] font-normal leading-relaxed text-slate-500">
            Genuine products only
          </small>
        </Link>

        <Link
          href="/about"
          className="flex flex-col font-medium transition-colors hover:text-bronze"
        >
          Trusted by Thousands
          <small className="text-[11px] font-normal leading-relaxed text-slate-500">
            Loved by customers worldwide
          </small>
        </Link>

        <Link
          href="/brands"
          className="flex flex-col font-medium transition-colors hover:text-bronze"
        >
          Top Rated Store
          <small className="text-[11px] font-normal leading-relaxed text-slate-500">
            High-quality gadgets you can trust
          </small>
        </Link>

        <Link
          href="/contact"
          className="flex flex-col font-medium transition-colors hover:text-bronze"
        >
          Price Match Guarantee
          <small className="text-[11px] font-normal leading-relaxed text-slate-500">
            Best prices, always
          </small>
        </Link>
      </div>

      {/* Full Width Bottom Legal & Social Bar */}
      <div className="flex flex-row items-center justify-between border-t border-slate-200 py-4 text-[11px] font-bold text-slate-900">
        <div className="flex items-center gap-4 text-slate-700">
          <Link
            href="/privacy"
            className="flex items-center gap-1 transition-colors hover:text-bronze"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="flex items-center gap-1 transition-colors hover:text-bronze"
          >
            Terms of Service
          </Link>
        </div>

        <div className="flex items-center gap-3 text-slate-900">
          <span>Follow us</span>
          <div className="flex items-center gap-2 text-slate-700">
            <Camera
              size={18}
              className="cursor-pointer transition-colors hover:text-bronze"
            />
            <Star
              size={18}
              className="cursor-pointer transition-colors hover:text-bronze"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className="purchase-panel">
      <div className="detail-price">
        ${(product.price * quantity).toFixed(2)}
      </div>
      <p>Free shipping and 30-day returns included.</p>
      <div className="quantity">
        <span>Quantity</span>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Decrease quantity"
        >
          <Minus size={15} />
        </button>
        <b>{quantity}</b>
        <button
          onClick={() => setQuantity(quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={15} />
        </button>
      </div>
      <button className="add-cart" onClick={() => setAdded(true)}>
        {added ? "Added to cart" : "Add to cart"} <ShoppingBag size={17} />
      </button>
      <button className="buy-now">Buy it now</button>
    </div>
  );
}

export function FilterSummary({ count }: { count: number }) {
  return (
    <div className="filter-summary">
      <SlidersHorizontal size={17} /> Showing <b>{count}</b> products{" "}
      <Check size={15} />
    </div>
  );
}
