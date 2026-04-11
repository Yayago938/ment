import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const registrationPoints = [
  ['Event', 'Portfolio Review Night'],
  ['Date', 'October 24, 2024'],
  ['Venue', 'The Glass House, San Francisco'],
  ['Fee', '$45.00 per person'],
]

export default function EventRegistration() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search events, clubs, or opportunities..."
        userName="Alex Rivera"
        userRole="Explorer"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAICFf55z-CdTc8gQwA4MI1a4IGoNIhxjTw6BMIXZsDRx6NSMCt6Ilak1A4RCMvKXJR9S9Z0awqbNV-ZHzDeNviN91S1aNO7GHP_0GBTEtWadfFNbiUr4PtRFrVJTR92b649zjYYxEY6PD3jA9PP4NPn-CRe40umypDBNOzPj6xDjEjp0HICz3-qkWTdIsxCEXiabcSiLsG2Ow7fxk8ytqQUokTi_SQM0UNslagq5HGkd4ttHvEysuxpnF1RogXZ3g57o2sRE1GiL8"
      />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[32px] bg-white p-8 shadow-[0_20px_40px_rgba(123,110,246,0.08)] lg:p-10">
              <span className="rounded-full bg-primary-fixed px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">
                Event Registration
              </span>
              <h1 className="font-headline mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Reserve your seat for Portfolio Review Night
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                Complete your registration to confirm attendance and receive your event pass by email.
              </p>

              <form className="mt-10 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface-variant">Full Name</span>
                  <input className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary" defaultValue="Alex Rivera" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface-variant">Email</span>
                  <input className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary" defaultValue="alex.rivera@mentorlink.edu" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface-variant">Phone Number</span>
                  <input className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary" placeholder="+91 98765 43210" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface-variant">Ticket Type</span>
                  <select className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary">
                    <option>General Admission</option>
                    <option>Student Plus</option>
                    <option>Group Pass</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-on-surface-variant">Why do you want to attend?</span>
                  <textarea
                    className="min-h-36 w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary"
                    defaultValue="I want feedback on my portfolio and to meet club mentors working in product design."
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  <Link to="/events/portfolio-review" className="rounded-full border border-outline-variant px-8 py-3 font-bold text-primary">
                    Back to Event
                  </Link>
                  <button type="button" className="rounded-full bg-gradient-to-r from-primary to-secondary-container px-8 py-3 font-bold text-white shadow-[0_16px_32px_rgba(123,110,246,0.2)]">
                    Confirm Registration
                  </button>
                </div>
              </form>
            </section>

            <aside className="space-y-6">
              <section className="rounded-[32px] bg-white p-8 shadow-[0_20px_40px_rgba(123,110,246,0.08)]">
                <h2 className="font-headline text-2xl font-bold">Registration Summary</h2>
                <div className="mt-6 space-y-5">
                  {registrationPoints.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-outline-variant/10 pb-4">
                      <span className="text-sm font-semibold text-on-surface-variant">{label}</span>
                      <span className="text-right font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[32px] bg-surface-container-low p-8">
                <h2 className="font-headline text-2xl font-bold">What happens next?</h2>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-on-surface-variant">
                  <p>You&apos;ll receive a confirmation email with your QR pass.</p>
                  <p>MentorLink will save this registration in your student activity feed.</p>
                  <p>Check in 20 minutes before the event start time to secure your seat.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
