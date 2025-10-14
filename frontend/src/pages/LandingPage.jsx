import React from "react";
import { ArrowRight } from "lucide-react";

export default function LandingPage({ onEnter }) {
  return (
    <div
      className="relative flex flex-col py-85  text-white h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/logo2.png')" }}
    >
      <div className="text-center ">
        <h1 className="text-5xl md:text-7xl tracking-tight font-dancing italic">
          Eventure
        </h1>
        <p className="mt-4 text-lg md:text-xl text-sky-100 max-w-2xl mx-auto">
          Streamline your event planning from start to finish. Create events, assign tasks, and track progress all in one place.
        </p>
        <button
          onClick={onEnter}
          className="mt-10 inline-flex items-center px-8 py-4 bg-white text-[#6f276f] font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300"
        >
          Open Dashboard
          <ArrowRight className="h-6 w-6 ml-3" />
        </button>
      </div>
    </div>
  );
}
