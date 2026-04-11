import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const speakers = [
  ['Julian Thorne', 'Club Lead, Prism Collective', 'Specializing in emotional design and brand architecture.'],
  ['Elena Rossi', 'Guest Reviewer, Flux', 'Expert in behavioral psychology and data-driven interfaces.'],
  ['Marcus Chen', 'Lead Speaker, Aether', 'Focusing on future-tech and immersive digital spaces.'],
]

export default function EventDetails() {
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
        <div className="mx-auto max-w-7xl">
          <section className="relative mb-12 h-[400px] overflow-hidden rounded-[32px] shadow-[0_32px_64px_rgba(85,69,206,0.12)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary-container opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 z-10 w-full p-12">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">Workshop</span>
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">Featured</span>
              </div>
              <h1 className="font-headline mt-4 text-5xl font-extrabold tracking-tight text-white">Portfolio Review Night</h1>
              <div className="mt-4 flex flex-wrap gap-6 text-white/90">
                <span>October 24, 2024</span>
                <span>The Glass House, San Francisco</span>
              </div>
            </div>
          </section>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              <section>
                <h2 className="font-headline text-3xl font-bold text-primary">About the Event</h2>
                <div className="mt-6 space-y-4 text-on-surface-variant">
                  <p className="text-lg">Step into an evening of collaborative exploration at our premier Portfolio Review Night.</p>
                  <p>Connect with local club leaders and guest reviewers from across the creative industry for shared insights and community-led feedback.</p>
                  <div className="rounded-[24px] border-l-4 border-primary bg-surface-container-low p-8 italic">Join us to refine your narrative alongside your peers and industry experts.</div>
                </div>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-bold">Featured Speakers</h2>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {speakers.map(([name, role, bio]) => (
                    <article key={name} className="rounded-[24px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                      <div className="mb-4 h-20 w-20 rounded-full bg-primary-fixed" />
                      <h3 className="font-headline text-lg font-bold">{name}</h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">{role}</p>
                      <p className="mt-3 text-sm text-on-surface-variant">{bio}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="sticky top-28 h-fit space-y-6 lg:col-span-4">
              <article className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-[0_20px_40px_rgba(123,110,246,0.08)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Registration Details</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-headline text-4xl font-extrabold">$45.00</span>
                  <span className="text-sm text-on-surface-variant">/ per person</span>
                </div>
                <div className="mt-8 space-y-5 text-sm">
                  <p>6:00 PM - 9:30 PM PDT</p>
                  <p>Limited to 40 spots</p>
                  <p className="font-semibold text-error">Only 12 tickets remaining</p>
                </div>
                <Link
                  to="/events/register"
                  className="mt-8 block w-full rounded-full bg-gradient-to-br from-[#7B6EF6] to-[#F6A6C1] px-8 py-5 text-center text-lg font-bold text-white shadow-lg"
                >
                  Register Now
                </Link>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
