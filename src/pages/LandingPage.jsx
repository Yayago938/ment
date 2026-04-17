import React from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
    
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#FEADC8", "#5545CE", "#4E4094"]}
          amplitude={1.2}
          blend={0.6}
          speed={1.0}
        />
      </div>

   
      <div className="absolute top-5 left-4 right-4 md:left-8 md:right-8 flex items-center justify-between z-20 text-white font-medium">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">
          <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center font-bold">
            M
          </div>
          <span className="font-semibold tracking-wide text-base">MentorLink</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm md:text-base hover:text-[#FEADC8] transition"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-4 md:px-5 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:text-black transition text-sm md:text-base"
          >
            Login
          </button>
        </div>
      </div>

     
      <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-6 pt-20 pb-6 text-white">
        <div className="w-full max-w-6xl mx-auto">
         
          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-[0_20px_80px_rgba(40,20,120,0.25)]">
            
            <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-12 h-52 w-52 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02]" />

            <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12 text-center">
              <p className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] md:text-xs font-medium tracking-wide backdrop-blur-md">
                Campus Communities • Events • Opportunities • Mentorship
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-none">
                MentorLink
              </h1>

              <p className="mt-4 max-w-3xl mx-auto text-sm md:text-lg text-white/90 leading-relaxed">
                Discover clubs, explore events, apply to opportunities, and build
                meaningful campus connections — all from one student portal.
              </p>

              
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => navigate("/explore")}
                  className="px-6 py-3 bg-[#5545CE] text-white font-semibold rounded-xl shadow-lg hover:bg-[#4a3cb0] hover:scale-[1.03] transition"
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 border border-white/30 bg-white/5 rounded-xl hover:bg-white hover:text-black transition"
                >
                  Learn More
                </button>
              </div>

           
              <div className="mt-6 flex flex-wrap justify-center gap-2.5 text-xs md:text-sm text-white/90">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  Explore Communities
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  Track Applications
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  Register for Events
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  Find Student Matches
                </span>
              </div>
            </div>
          </div>

          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-xl px-5 py-4 shadow-[0_10px_40px_rgba(40,20,120,0.15)]">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
                Discover
              </p>
              <p className="mt-2 text-sm md:text-base font-semibold text-white leading-snug">
                Explore clubs, committees & communities
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-xl px-5 py-4 shadow-[0_10px_40px_rgba(40,20,120,0.15)]">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
                Engage
              </p>
              <p className="mt-2 text-sm md:text-base font-semibold text-white leading-snug">
                Register for events & stay updated
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-xl px-5 py-4 shadow-[0_10px_40px_rgba(40,20,120,0.15)]">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
                Grow
              </p>
              <p className="mt-2 text-sm md:text-base font-semibold text-white leading-snug">
                Build your profile & meaningful connections
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}