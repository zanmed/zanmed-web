"use client";
import { useState } from "react";
import type { Product } from "@/lib/types";

export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.image);
  return (
    <div className="detail-gallery">
      <div className="detail-main-image">
        <img src={selected} alt={product.name} />
        {product.badge && <label>{product.badge}</label>}
      </div>
      <div className="detail-thumbs">
        {product.gallery.map((image) => (
          <button
            key={image}
            className={selected === image ? "selected" : ""}
            onClick={() => setSelected(image)}
          >
            <img src={image} alt={`${product.name} view`} />
          </button>
        ))}
      </div>
    </div>
  );
}
