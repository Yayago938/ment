import { Link } from 'react-router-dom'

export default function OpportunityDetail() {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/5 bg-[#FAF8FF]/80 px-8 py-4 backdrop-blur-md shadow-[0_20px_40px_rgba(123,110,246,0.08)]">
        <div className="flex items-center gap-6">
          <Link to="/explore" className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-surface-container hover:shadow-sm">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline text-xl font-bold tracking-tight">Product Design Internship</h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Hosted by Design Club</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 pb-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <section>
              <span className="inline-flex rounded-full bg-primary-fixed px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">Opportunity Overview</span>
              <h2 className="font-headline mt-6 text-4xl font-extrabold tracking-tight">Join Our Product Design Internship Program</h2>
              <div className="mt-6 space-y-4 text-on-surface-variant">
                <p>Design Club&apos;s internship program offers a collaborative space for emerging talent to dive deep into digital product development.</p>
                <p>You&apos;ll work alongside fellow student designers and industry-standard tools to tackle real-world challenges while building a stronger portfolio.</p>
              </div>
            </section>
            <section className="rounded-[28px] border border-black/5 bg-surface-container-lowest p-10 shadow-sm transition-all duration-300 ease-out">
              <h3 className="font-headline text-2xl font-bold">Eligibility & Requirements</h3>
              <ul className="mt-8 space-y-6">
                {['Figma Foundations', 'Collaborative Mindset', 'Student Enrollment', 'Passion for Learning'].map((title) => (
                  <li key={title} className="flex gap-4">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary/20">
                      <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-on-surface-variant">Expected as part of the selection process.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <article className="relative overflow-hidden rounded-[28px] border border-black/5 bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.10)] transition-all duration-300 ease-out hover:shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Application Status</h3>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-full bg-gradient-to-br from-[#7B6EF6] to-[#F6A6C1] px-4 py-1.5 text-xs font-bold text-white">Applied</span>
                <span className="text-xs text-on-surface-variant">Oct 12, 2023</span>
              </div>
              <div className="mt-6 rounded-2xl border border-black/5 bg-surface-container-low p-4 text-xs text-on-surface-variant shadow-sm">Your application has been submitted successfully and is awaiting review.</div>
            </article>
            <Link to="/applications/tracker" className="block rounded-full bg-gradient-to-br from-[#7B6EF6] to-[#F6A6C1] px-12 py-3.5 text-center font-bold text-white shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]">Track Application Status</Link>
          </aside>
        </div>
      </main>
    </div>
  )
}
