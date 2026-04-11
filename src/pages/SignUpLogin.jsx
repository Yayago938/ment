import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUpLogin() {
  const [activeTab, setActiveTab] = useState('signup')

  return (
    <main className="flex min-h-screen overflow-hidden">
      {/* Left Side: Aesthetic Editorial Section */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-60"
            alt="Sun-drenched modern academic workspace with minimalist white desk, mid-century chair, and soft shadows on the wall"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzwAxgXK-WYkL3HOqwh50quy_OxUj3woDYeQQ0TlfgdFZQmeWRJbWFYNeDaDKeYTaFESHFJwzc49dzqA09Mn4wzye6UboDtAFO82kORBFx_QjSeSveESnP-n9mFFDL-HkboEro1RrmJZKnmn_8Wogrc0bWBUiI8zRttC8HTq7o2wxQoAFLVBjvRz1D7FzUeq54BosqLfOIVA62FLXjOm1QJxGVkFsuXJeNzk2oZcaD0uLyBEzDjMKSmzdzSeE_tL_GI-HZLqgleNE"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary-container/10"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full shadow-[0_10px_30px_rgba(123,110,246,0.05)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-lg">workspace_premium</span>
            <span className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase">Ethereal Academic Excellence</span>
          </div>
          <h1 className="font-headline font-extrabold text-6xl tracking-tighter text-on-surface leading-[1.1] mb-6">
            MentorLink: The Digital <span className="text-primary italic">Atelier</span> of Minds
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-12 max-w-md">
            Where prestigious mentorship meets modern ambition. Join a curated ecosystem of scholarly leaders and professional artisans.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="font-headline font-bold text-3xl text-primary">2.4k+</span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Active Mentors</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30"></div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-3xl text-secondary">98%</span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Success Rate</span>
            </div>
          </div>
          <div className="mt-20 flex -space-x-4">
            <img className="w-12 h-12 rounded-full border-4 border-surface shadow-md" alt="Portrait of a male professional mentor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlm16JPnW2ayGaoa_zCrzB86VepF-fqslynsgLM_bPosVUnDBSRjvf1sRN20fBT_Rmi6y7VuXfkMfUIL8xYE9HeUPZLBrMTjFvbOu0c0YOA1jCO7BrOIVSKRtL1Axofb8I3216UaRVLxQ1Sn5hOUXA6yeyPNZdMIJ9wJGfC9s0IS-TPof3wmJkdpLlGyhPyluk3xIFNByGNBEdxidZhy3o_1zgL_CZwoofOXZQd1-phwYxRY_OVXrb_Xf68Sg-5N08dtjN7oVDMCE" />
            <img className="w-12 h-12 rounded-full border-4 border-surface shadow-md" alt="Portrait of a female creative mentor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu9H4Mdeh_vblVShrEF2eawjbaX-iKHS__LYtV_COybAwv-gT6Wp1YdrWA3EuJ_kmGrV5DJr2Kah3iI4uruWIyhx2buFK1WNMFKDLOhjIFxht6Ewq7Y-o1FYKUhuTHa1DidvwLW4ZgJR1XUlynYBt_wkKWYC3xRHXBfKQxZN4eEYC3F88sWpFCKzc6o4QrSH7JWnEuCLOd2iTD3Kzz08kyeZHDGIhvRZv0j1XqCy5zsMu5GAWmvRuHDF5XS1nBo9VXcDWQKbS45e8" />
            <img className="w-12 h-12 rounded-full border-4 border-surface shadow-md" alt="Portrait of an academic professor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_hPbF9de6sLUZzfCRBjfKmwexqNNQX8raimsntb4qmKmsTjASBWfhN0Ocsp1LUl7kRkQujNv-hz8_LbwhowC55mN2e3VncijsS5X14Vk3lrXaxrgcm4uqIrKxvFUK-3gsdAig_ShKIImYBZoQhdnj2rT2fUCv_LDIe4cGncyND_BmDJZjKCj93vnYj6knhLALU_3Ub3fZi8XtKK-A6gZCUlztKBK6EQRHAoz7xKic_yAWA_xSUBwTYEQ49JfD46N_uEm68ADp7s" />
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface shadow-md">
              <span className="text-xs font-bold text-white">+2k</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Auth Form Section */}
      <section className="w-full lg:w-1/2 bg-surface flex flex-col justify-between p-8 md:p-16 overflow-y-auto">
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-container rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white filled-icon">architecture</span>
            </div>
            <span className="font-headline font-extrabold text-2xl tracking-tighter text-on-surface">MentorLink</span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Tab Toggle */}
          <div className="bg-surface-container-lowest rounded-lg p-1 px-1 mb-8 shadow-ambient">
            <div className="flex p-1 gap-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
                  activeTab === 'login'
                    ? 'bg-primary text-white font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
                  activeTab === 'signup'
                    ? 'bg-primary text-white font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-headline font-bold text-3xl text-on-surface mb-2">
              {activeTab === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-on-surface-variant">
              {activeTab === 'signup'
                ? 'Join the curated ecosystem of scholarly leaders.'
                : 'Sign in to your MentorLink account.'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            {activeTab === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">SAP ID</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" placeholder="Enter your SAP ID" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" placeholder="Jane Doe" type="text" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">University Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">alternate_email</span>
                <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" placeholder="jane.doe@university.edu" type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" placeholder="••••••••" type="password" />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">Confirm Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" placeholder="••••••••" type="password" />
                </div>
              </div>
            )}

            <Link
              to={activeTab === 'signup' ? '/onboarding' : '/student-dashboard'}
              className="block w-full py-4 mt-4 bg-gradient-to-r from-primary to-secondary-container text-white font-bold rounded-full shadow-primary-glow hover:scale-[1.02] transition-transform duration-300 text-center"
            >
              {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
            </Link>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <span className="relative px-4 bg-surface text-xs font-label font-bold tracking-widest text-on-surface-variant/50 uppercase">Or continue with</span>
          </div>

          <button className="w-full py-4 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-medium rounded-full flex items-center justify-center gap-3 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            University Google Account
          </button>
        </div>

        <footer className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4">
          <a className="text-xs font-label font-bold tracking-widest text-on-surface-variant/60 uppercase hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-xs font-label font-bold tracking-widest text-on-surface-variant/60 uppercase hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs font-label font-bold tracking-widest text-on-surface-variant/60 uppercase hover:text-primary transition-colors" href="#">Cookie Settings</a>
          <a className="text-xs font-label font-bold tracking-widest text-on-surface-variant/60 uppercase hover:text-primary transition-colors" href="#">Help Center</a>
          <p className="w-full text-center text-[10px] text-on-surface-variant/40 mt-4">© 2024 MentorLink Global. All rights reserved.</p>
        </footer>
      </section>
    </main>
  )
}
