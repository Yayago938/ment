import React from 'react'
import { useNavigate } from 'react-router-dom'
import Aurora from '../components/Aurora'
import GlassBlobCard from '../components/GlassBlobCard'

export default function LandingPage() {
  const navigate = useNavigate()

  const miniCards = [
    ['Discover', 'Find clubs, committees, and student communities.'],
    ['Engage', 'Register for events and follow campus activity.'],
    ['Grow', 'Build a profile that opens the right doors.'],
  ]

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#FEADC8', '#5545CE', '#4E4094']}
          amplitude={1.1}
          blend={0.62}
          speed={0.9}
        />
      </div>

      <nav className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between font-medium md:left-8 md:right-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/12 px-3 py-2 shadow-[0_12px_32px_rgba(20,10,80,0.16)] backdrop-blur-xl transition hover:bg-white/18"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/18 font-bold shadow-inner">
            M
          </span>
          <span className="text-sm font-semibold tracking-wide md:text-base">MentorLink</span>
        </button>

        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-1 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-xl px-4 py-2 text-sm transition hover:bg-white/14"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-xl border border-white/25 bg-white/18 px-4 py-2 text-sm transition hover:bg-white hover:text-[#1a1b20]"
          >
            Login
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex h-full items-center px-4 pb-5 pt-20 md:px-6 md:pb-7 md:pt-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:gap-4">
          <section className="relative overflow-hidden rounded-[28px] border border-white/18 bg-white/[0.10] px-5 py-6 text-center shadow-[0_24px_90px_rgba(40,20,120,0.28)] backdrop-blur-2xl md:px-10 md:py-8 lg:px-14 lg:py-9">
            <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-pink-300/20 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03]" />

            <div className="relative z-10">
              <p className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md md:text-xs">
                Campus communities, events, opportunities
              </p>

              <h1 className="font-headline text-4xl font-extrabold leading-none tracking-tight md:text-6xl lg:text-7xl">
                MentorLink
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/90 md:text-lg">
                Discover clubs, explore events, apply to opportunities, and build meaningful campus connections from one student portal.
              </p>

              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row md:mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#5545CE] shadow-lg transition hover:scale-[1.02] hover:bg-white/92 md:text-base"
                >
                  Get Started
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-xl border border-white/30 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-[#1a1b20] md:text-base"
                >
                  Learn More
                </button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-white/90 md:text-sm">
                {['Explore Communities', 'Track Applications', 'Register for Events', 'Find Student Matches'].map(item => (
                  <span
                    key={item}
                    className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 backdrop-blur-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {miniCards.map(([label, text]) => (
              <GlassBlobCard
                key={label}
                className="border-white/18 bg-white/[0.10] px-5 py-3.5 text-white shadow-[0_12px_36px_rgba(40,20,120,0.18)] md:py-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                  {label}
                </p>
                <p className="mt-1.5 text-sm font-semibold leading-snug md:text-base">
                  {text}
                </p>
              </GlassBlobCard>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
