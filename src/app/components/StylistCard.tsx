import React from "react";
import { Link } from "react-router";
import { Stylist } from "../data/stylists";

interface StylistCardProps {
  stylist: Stylist;
}

export const StylistCard = ({ stylist }: StylistCardProps) => {
  return (
    <Link 
      to={`/stylist/${stylist.id}`}
      className="group block space-y-8 cursor-pointer"
    >
      <div className="aspect-[3/4] overflow-hidden bg-neutral-900">
        <img
          src={stylist.imageUrl}
          alt={stylist.name}
          className="h-full w-full object-cover grayscale transition-transform duration-[3s] group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-light tracking-tight text-white group-hover:text-neutral-400 transition-colors">
          {stylist.name}
        </h3>
        <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
          {stylist.location}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {stylist.specialties.slice(0, 2).map((spec, i) => (
            <span
              key={i}
              className="text-[9px] tracking-[0.2em] text-neutral-700 uppercase"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
