import React from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#FEADC8", "#5545CE", "#4E4094"]}
          amplitude={1.2}
          blend={0.6}
          speed={1.0}
        />
      </div>

      {/* 🔥 Navbar (All Right Side) */}
<div className="absolute top-6 right-8 flex items-center gap-6 z-20 text-white font-medium">

  <button
    onClick={() => navigate("/")}
    className="hover:text-[#FEADC8] transition"
  >
    Home
  </button>

  <button
    onClick={() => navigate("/about")}
    className="hover:text-[#FEADC8] transition"
  >
    About
  </button>

  <button
    onClick={() => navigate("/signup-login")}
    className="px-5 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:text-black transition"
  >
    Login
  </button>

</div>
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">
        
        {/* Hero Section */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          MentorLink
        </h1>

        <p className="mt-6 max-w-xl text-lg md:text-xl text-white/90">
          Create stunning web experiences with modern tools, smooth animations,
          and powerful performance.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 bg-[#5545CE] text-black font-semibold rounded-xl shadow-lg hover:bg-[#4a3cb0] transition">
            Get Started
          </button>

          <button className="px-6 py-3 border border-white rounded-xl hover:bg-white hover:text-black transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}