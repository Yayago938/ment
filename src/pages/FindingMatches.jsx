import React from 'react'
import { Link } from 'react-router-dom'

export default function FindingMatches() {
  return (
    <div className="bg-surface font-body text-on-surface overflow-hidden">
      <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Background Accents */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-fixed/30 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary-fixed/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Central Loading Content */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">

          {/* Academic Illustration & Pulsing Gradient */}
          <div className="relative mb-12 flex items-center justify-center">
            {/* Pulsing Background Circle */}
            <div className="absolute w-64 h-64 bg-gradient-to-br from-primary to-secondary-container rounded-full opacity-10 animate-soft-pulse blur-2xl"></div>
            {/* Main Graphic Container */}
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-ambient">
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[80px] text-primary/20 absolute -translate-y-4" style={{ fontSize: '80px' }}>menu_book</span>
                <span className="material-symbols-outlined text-secondary absolute translate-x-8 translate-y-6 filled-icon" style={{ fontSize: '48px' }}>auto_awesome</span>
                <span className="material-symbols-outlined text-primary absolute -translate-x-10 -translate-y-10" style={{ fontSize: '32px' }}>draw</span>
                {/* Spinning dashed ring */}
                <div className="absolute w-32 h-32 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow"></div>
              </div>
            </div>
          </div>

          {/* Message Text */}
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-6">
            Finding your best matches...
          </h1>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-10 max-w-md">
            Analyzing 250+ active committees and mentors based on your interests.
          </p>

          {/* Loading Progress Track */}
          <div className="w-64 h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-12">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary-container rounded-full shadow-[0_0_12px_rgba(85,69,206,0.4)] animate-loading"
              style={{ width: '30%' }}
            ></div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-surface-container-lowest/60 glass-blur p-6 rounded-lg text-left shadow-ambient-sm">
              <span className="material-symbols-outlined text-primary mb-3 block">school</span>
              <h3 className="text-xs font-label uppercase tracking-[0.1em] text-on-surface-variant mb-1">Academic</h3>
              <p className="text-sm font-medium text-on-surface">Experience level</p>
            </div>
            <div className="bg-surface-container-lowest/60 glass-blur p-6 rounded-lg text-left shadow-ambient-sm">
              <span className="material-symbols-outlined text-secondary mb-3 block">psychology</span>
              <h3 className="text-xs font-label uppercase tracking-[0.1em] text-on-surface-variant mb-1">Niche</h3>
              <p className="text-sm font-medium text-on-surface">Technical domain</p>
            </div>
            <div className="bg-surface-container-lowest/60 glass-blur p-6 rounded-lg text-left shadow-ambient-sm">
              <span className="material-symbols-outlined text-primary mb-3 block">forum</span>
              <h3 className="text-xs font-label uppercase tracking-[0.1em] text-on-surface-variant mb-1">Culture</h3>
              <p className="text-sm font-medium text-on-surface">Communication style</p>
            </div>
          </div>

          {/* CTA to next page */}
          <Link
            to="/committee-detail"
            className="mt-10 px-8 py-3 bg-gradient-to-r from-primary to-secondary-container text-white font-bold rounded-full shadow-primary-glow hover:scale-[1.02] transition-transform duration-300 text-sm"
          >
            View My Matches
          </Link>
        </div>

        {/* Footer / Branding */}
        <div className="absolute bottom-12 flex flex-col items-center">
          <div className="flex items-center gap-3 opacity-60">
            <span className="material-symbols-outlined text-primary filled-icon">fluid</span>
            <span className="font-headline font-bold text-xl tracking-tighter text-on-surface">MentorLink</span>
          </div>
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mt-2">Curating Excellence Since 2024</p>
        </div>
      </main>

      {/* Decorative Corner Visuals */}
      <div className="fixed top-24 left-16 w-32 h-32 pointer-events-none opacity-20">
        <img
          className="w-full h-full object-cover rounded-xl grayscale rotate-[-12deg]"
          alt="Close up of vintage open book pages with elegant typography"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXZxKistVXbuGuXosnoLrvR-45AYsrT1K0i0erGEVqrGD99aznIbrEY0x-CfBMckV6qLkyVL6jm5EoqEyVplN-YkkpkUn32z22hJhPl-sYWQOwk3L0CBCiuiWqkUwhI7JeuI_uyvK9ht17KB81nA4sqQr3Of087n5HpYHXTAWhvNXq8T_RiTPMaomEReVOZA2-E66OnE-LDUAyRkD9u--dJNG_eocSLTXqyA-xpGcOWuEWiQBkbojLLSSBxi8wVk2O9DJQTnwM4yA"
        />
      </div>
      <div className="fixed bottom-24 right-16 w-40 h-40 pointer-events-none opacity-20">
        <img
          className="w-full h-full object-cover rounded-xl grayscale rotate-[8deg]"
          alt="Sun-drenched minimalist office space with soft shadows and elegant architectural lines"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJlAzo903cRuWDXj3NtkryLK6fRCTzaMtKusHveVuoIl6622mUhAjYIzsA2w2hiUpsBePMLslOu5xiRHshvKq4Xo2QKvc1391Gd335I8dKEN06l5Nq8emEl7JMVDI4cx7H_BYO-TbtAnk1jID37Fjzn2ye5HZtO_5sRmK0tkgzl7xY93Hc-SX91MqzV4fMa_j8kpyytgGC0u6AYeLV8xKKm6U5hMMDP5P1zmm22dbHbCkqutrn598oW3Hp831MvnJnIZm28Etc5cI"
        />
      </div>
    </div>
  )
}
