import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../shared/ProductCard";

const OfferSections = ({ sections }) => {
  if (!sections || sections.length === 0) return null;

  // Gather all products from all sections to display below the banners
  const allProductsMap = new Map();
  sections.forEach(section => {
    (section.productIds || []).forEach(p => {
      if (typeof p === "object" && p !== null) {
        if (!allProductsMap.has(p._id)) {
          allProductsMap.set(p._id, {
            id: p._id,
            name: p.name,
            image: p.mainImage || p.image || "",
            price: p.salePrice ?? p.price,
            originalPrice: p.price ?? p.salePrice,
            weight: p.weight,
            deliveryTime: p.deliveryTime,
          });
        }
      }
    });
  });
  const allProducts = Array.from(allProductsMap.values());

  return (
    <div className="w-full px-4 mt-6 mb-8 relative z-20">
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-tight text-[#132018] leading-none">
          Best Offers For You
        </h2>
        <span className="text-[#1A4516] font-bold text-[13px] cursor-pointer active:scale-95 transition-transform pb-[2px]">
          View All
        </span>
      </div>

      {/* Offer Cards Row */}
      <div className="flex overflow-x-auto gap-3 sm:gap-4 no-scrollbar pb-4 snap-x">
        {[0, 1].map((idx) => {
          const section = sections[idx % sections.length]; // Safe fallback if only 1 section exists in DB
          return (
          <motion.div 
            key={`${section._id}-${idx}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="w-[130px] sm:w-[150px] h-[140px] sm:h-[160px] flex-shrink-0 snap-start rounded-[20px] bg-gradient-to-br from-[#1A4516] to-[#2b6826] p-3.5 relative overflow-hidden shadow-md shadow-black/10 flex flex-col justify-between"
          >
            {/* Background image covering the card */}
            <div className="absolute inset-0 z-0">
               <img src={idx % 2 === 0 ? "/offer-vegetables.png" : "/offer-fruits.png"} alt="offer background" className="w-full h-full object-cover opacity-90" />
               {/* Dark overlay to ensure text is readable */}
               <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="relative z-10">
              <p className="text-white/90 font-semibold text-[9px] uppercase tracking-wider mb-0.5 drop-shadow-md">Up To</p>
              <h3 className="text-white font-black text-[22px] leading-none mb-1 shadow-sm drop-shadow-md">
                {idx % 2 === 0 ? "50% OFF" : "30% OFF"}
              </h3>
              <p className="text-white/90 font-medium text-[10px] leading-tight drop-shadow-md">
                {idx % 2 === 0 ? "On Vegetables" : "On Fruits"}
              </p>
            </div>
            
            <div className="relative z-10 mt-auto">
              <span className="text-white font-bold text-[10px] border-b border-white/60 pb-0.5 drop-shadow-sm inline-block">
                GET IT NOW
              </span>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Merged Products Row (Preserves functionality) */}
      {allProducts.length > 0 && (
        <div className="flex overflow-x-auto gap-3 sm:gap-4 no-scrollbar pb-2 pt-2 snap-x">
          {allProducts.map((product) => (
            <div key={product.id} className="w-[126px] sm:w-[136px] flex-shrink-0 snap-start">
              <ProductCard
                product={product}
                className="bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[16px]"
                compact
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(OfferSections);
