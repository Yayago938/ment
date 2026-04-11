import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function EditStudentProfile() {
  const [fullName, setFullName] = useState(localStorage.getItem('userName') || '')
  const navigate = useNavigate()

  const handleSubmit = event => {
    event.preventDefault()

    if (fullName) {
      localStorage.setItem('userName', fullName)
    }

    localStorage.setItem('profileCompleted', 'true')
    localStorage.setItem('onboardingCompleted', 'true')
    navigate('/student-dashboard')
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <header className="fixed left-64 right-0 top-0 z-40 flex items-center justify-between bg-[#FAF8FF]/80 px-8 py-3 shadow-[0_20px_40px_rgba(123,110,246,0.08)] backdrop-blur-md">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="w-full rounded-full bg-surface-container-low py-2.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search clubs, events, or opportunities..." />
        </div>
      </header>

      <main className="ml-64 min-h-screen px-12 pb-20 pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight">Edit Profile</h1>
            <p className="mt-2 text-lg text-on-surface-variant">Update your student profile, academic details, and application-ready information.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
              <h2 className="font-headline text-xl font-bold">Personal Info</h2>
              <div className="mt-8 space-y-8">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Full Name</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={fullName} onChange={event => setFullName(event.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">About You</label>
                  <textarea className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" rows={4} defaultValue="Computer science student interested in design, product thinking, and campus leadership." />
                </div>
              </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
              <div className="rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
                <h2 className="font-headline text-xl font-bold">Academic Info</h2>
                <div className="mt-8 space-y-6">
                  {[
                    ['Field of Study', 'Computer Science & Design'],
                    ['College / Department', 'Faculty of Arts & Sciences'],
                    ['Graduation Year', '2025'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{label}</label>
                      <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" defaultValue={value} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
                <h2 className="font-headline text-xl font-bold">Resume / CV</h2>
                <div className="mt-8 flex min-h-64 flex-col justify-center rounded-[28px] border-2 border-dashed border-outline-variant/30 bg-surface-container-low/30 p-6 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_upload</span>
                  <p className="mt-4 text-sm font-bold">Click to upload or drag and drop</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">PDF, Word (Max 5MB)</p>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button type="submit" className="rounded-full bg-gradient-to-r from-primary to-secondary-container px-8 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(123,110,246,0.2)]">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
