import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCommittee, loginStudent, signupStudent } from '../api/authApi'
import { useToast } from '../components/ToastProvider'

export default function SignUpLogin() {
  const [activeTab, setActiveTab] = useState('signup')
  const [role, setRole] = useState('student')
  const [signupForm, setSignupForm] = useState({
    sapId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    login: false,
    signup: false,
    confirm: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSignupChange = event => {
    const { name, value } = event.target
    setSignupForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginChange = event => {
    const { name, value } = event.target
    setLoginForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (activeTab === 'signup') {
        if (signupForm.password !== signupForm.confirmPassword) {
          showToast('Passwords do not match')
          setIsSubmitting(false)
          return
        }

        localStorage.removeItem('studentId')
        const res = await signupStudent({
          name: signupForm.fullName,
          sap_id: signupForm.sapId,
          email: signupForm.email,
          password: signupForm.password,
        })
        const studentId =
          res.data?.data?.id ||
          res.data?.id

        localStorage.setItem('userName', signupForm.fullName)
        localStorage.setItem('userEmail', signupForm.email)
        localStorage.setItem('onboardingCompleted', 'false')
        localStorage.setItem('profileCompleted', 'false')
        localStorage.setItem('role', 'student')

        if (studentId) {
          localStorage.setItem('studentId', String(studentId))
        }

        setSignupForm({
          sapId: '',
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        })

        navigate('/edit-student-profile')
        return
      }

      if (role === 'student') {
        localStorage.removeItem('studentId')
        const res = await loginStudent({
          email: loginForm.email.trim(),
          password: loginForm.password.trim(),
        })
        const payload = res.data || {}
        const token = payload.token || payload.accessToken
        const userName =
        payload.data?.name ||
        payload.name ||
        payload.user?.name ||
        payload.fullName ||
        payload.user?.fullName

        const userEmail =
        payload.data?.email ||
        payload.email ||
        payload.user?.email

        const studentId =
          payload.data?.id ||
          payload.data?._id ||
          payload.data?.studentId ||
          payload.data?.student_id ||
          payload.id ||
          payload.studentId ||
          payload.student_id ||
          payload.user?.id ||
          payload.user?._id ||
          payload.user?.studentId ||
          payload.user?.student_id ||
          payload.student?.id ||
          payload.student?._id ||
          payload.student?.studentId ||
          payload.student?.student_id

        if (payload.success || token) {
          if (token) {
            localStorage.setItem('token', token)
          }
          localStorage.setItem('role', 'student')

          if (userName) {
            localStorage.setItem('userName', userName)
          }

          if (userEmail) {
            localStorage.setItem('userEmail', userEmail)
          }

          if (studentId) {
            localStorage.setItem('studentId', String(studentId))
          }

          navigate('/student-dashboard')
          return
        }

        throw new Error(payload.message || 'Login failed')
      }

      if (role === 'committee') {
        const res = await loginCommittee({
          email: loginForm.email.trim(),
          password: loginForm.password.trim(),
        })

        console.log('Committee login response:', res)

        if (res.success) {
          localStorage.setItem('token', res.token)
          localStorage.setItem('role', 'committee')

          const committeeId = res.data?.id

          if (committeeId) {
            localStorage.setItem('committeeId', committeeId)
            navigate(`/committee/${committeeId}`)
            return
          }
        }
      }
    } catch (error) {
      console.error('Login Error:', error)
      console.error('Login Error Response:', error.response?.data)
      if (error.response?.status === 409) {
        setError('User already exists. Please login.')
        return
      }
      setError(error.response?.data?.message || error.message || 'Invalid credentials')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = key => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

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
              {activeTab === 'signup' ? 'Create Account' : 'Committee Login'}
            </h2>
            <p className="text-on-surface-variant">
              {activeTab === 'signup'
                ? 'Join the curated ecosystem of scholarly leaders.'
                : 'Sign in to access your committee dashboard.'}
            </p>
          </div>

          {activeTab === 'login' && (
            <div className="mb-6 rounded-[24px] bg-surface-container-lowest p-2 shadow-ambient">
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">Sign in as</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    role === 'student'
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('committee')}
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    role === 'committee'
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  Committee
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">SAP ID</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" name="sapId" placeholder="Enter your SAP ID" type="text" value={signupForm.sapId} onChange={handleSignupChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" name="fullName" placeholder="Jane Doe" type="text" value={signupForm.fullName} onChange={handleSignupChange} />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">University Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">alternate_email</span>
                <input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" name="email" placeholder="jane.doe@university.edu" type="email" value={activeTab === 'signup' ? signupForm.email : loginForm.email} onChange={activeTab === 'signup' ? handleSignupChange : handleLoginChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                <input className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" name="password" placeholder="........" type={activeTab === 'signup' ? (showPasswords.signup ? 'text' : 'password') : (showPasswords.login ? 'text' : 'password')} value={activeTab === 'signup' ? signupForm.password : loginForm.password} onChange={activeTab === 'signup' ? handleSignupChange : handleLoginChange} />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(activeTab === 'signup' ? 'signup' : 'login')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
                  aria-label={activeTab === 'signup'
                    ? (showPasswords.signup ? 'Hide password' : 'Show password')
                    : (showPasswords.login ? 'Hide password' : 'Show password')}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {activeTab === 'signup'
                      ? (showPasswords.signup ? 'visibility_off' : 'visibility')
                      : (showPasswords.login ? 'visibility_off' : 'visibility')}
                  </span>
                </button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-label font-bold tracking-widest text-on-surface-variant uppercase ml-4">Confirm Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface" name="confirmPassword" placeholder="........" type={showPasswords.confirm ? 'text' : 'password'} value={signupForm.confirmPassword} onChange={handleSignupChange} />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
                    aria-label={showPasswords.confirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPasswords.confirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'login' && error ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-full py-4 mt-4 bg-gradient-to-r from-primary to-secondary-container text-white font-bold rounded-full shadow-primary-glow hover:scale-[1.02] transition-transform duration-300 text-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting
                ? activeTab === 'signup'
                  ? 'Creating Account...'
                  : 'Signing In...'
                : activeTab === 'signup'
                  ? 'Create Account'
                  : role === 'committee'
                    ? 'Sign In as Committee'
                    : 'Sign In'}
            </button>
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
