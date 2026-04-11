import { Link } from 'react-router-dom'

export default function PersonalizationIntro() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-center text-on-background">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(85,69,206,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(85,69,206,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-secondary-container/30 blur-[120px]" />
      <div className="absolute top-12 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary-container">
          <span className="material-symbols-outlined text-white">auto_awesome</span>
        </div>
        <span className="font-headline text-2xl font-bold tracking-tight">MentorLink</span>
      </div>
      <section className="relative z-10 max-w-4xl space-y-12">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-primary-fixed px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">Onboarding Journey</span>
          <h1 className="font-headline text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
            Let&apos;s tailor <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">your experience</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-on-surface-variant md:text-xl">Take a 2-minute questionnaire to find the perfect clubs and mentors.</p>
        </div>
        <Link to="/onboarding/interests" className="inline-flex rounded-full bg-gradient-to-br from-primary to-secondary-container px-10 py-5 text-lg font-bold text-white shadow-[0_20px_40px_rgba(123,110,246,0.2)] transition-all hover:scale-105">
          Start Questionnaire
        </Link>
      </section>
    </main>
  )
}
