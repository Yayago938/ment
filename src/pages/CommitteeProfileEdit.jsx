import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { useToast } from '../components/ToastProvider'
import { addHeadToCommittee, addMemberToCommittee } from '../api/committeeApi'

const opportunityCards = [
  {
    title: 'Visual Lead',
    description: 'Overseeing the aesthetic direction of all digital campaigns.',
    icon: 'brush',
    tone: 'bg-secondary-fixed text-secondary',
    tags: ['High Priority', 'Remote'],
  },
  {
    title: 'UX Researcher',
    description: 'Conducting qualitative studies to improve campus tools.',
    icon: 'analytics',
    tone: 'bg-primary-fixed text-primary',
    tags: ['6 Months', 'Paid'],
  },
]

export default function CommitteeProfileEdit() {
  const location = useLocation()
  const { showToast } = useToast()
  const committeeId = location.state?.committeeId || localStorage.getItem('committeeId') || ''
  const [memberId, setMemberId] = useState('')
  const [headForm, setHeadForm] = useState({
    headId: '',
    role_title: '',
    role_type: 'CORE',
  })

  const handleAddMember = async event => {
    event.preventDefault()

    if (!committeeId) {
      showToast('Committee ID unavailable')
      return
    }

    if (!memberId.trim()) {
      showToast('Member ID is required')
      return
    }

    try {
      await addMemberToCommittee({
        committeeId,
        memberId: memberId.trim(),
      })
      showToast('Member added successfully')
      setMemberId('')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to add member')
    }
  }

  const handleAddHead = async event => {
    event.preventDefault()

    if (!committeeId) {
      showToast('Committee ID unavailable')
      return
    }

    if (!headForm.headId.trim()) {
      showToast('Head ID is required')
      return
    }

    if (!headForm.role_title.trim()) {
      showToast('Role title is required')
      return
    }

    if (!headForm.role_type.trim()) {
      showToast('Role type is required')
      return
    }

    try {
      await addHeadToCommittee({
        committeeId,
        headId: headForm.headId.trim(),
        role_title: headForm.role_title.trim(),
        role_type: headForm.role_type.trim(),
      })
      showToast('Head added successfully')
      setHeadForm({
        headId: '',
        role_title: '',
        role_type: 'CORE',
      })
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to add head')
    }
  }

  const buttonsDisabled = !committeeId

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />

      <header className="fixed top-0 left-64 right-0 z-40 flex h-16 items-center justify-between bg-surface/80 px-12 backdrop-blur-xl">
        <h2 className="text-xl font-black tracking-tight text-primary">Committee Profile Management</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <Link to="/committee/notifications" className="transition-colors hover:text-primary">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <button className="transition-colors hover:text-primary" type="button">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <button className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95" type="button">
            Save Changes
          </button>
        </div>
      </header>

      <main className="ml-64 min-h-screen px-12 pb-20 pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12">
              <div className="group relative h-[320px] overflow-hidden rounded-xl shadow-sm">
                <img
                  className="h-full w-full object-cover"
                  alt="Abstract flowing gradients in soft lavender and deep indigo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATPp4ISaliRTNuQxKdD4ZnYusE9QueNwthmHZKFmCU_-PDSjM1OCxey53Un8IXC4Hu3t3YH6UH1xnox0LGKCR5ubSPjCgFDHcE_iUScR2IcluHB-SHwjQyWWCUNmmfa4OLtKtFjKAoSpsLcanrYPQzmgmEWMF991hLnPQQEBTS7vBsrP2fBTYa0cM-YV6hPNcoJbTnXrOoSzJl6nLP2HmSxrX70rI4y2VBGMtfIvtj-HaAbtC6KD2GyD0buMUqZ1kXfNAEftm69ic"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-2 font-bold text-primary backdrop-blur transition-colors hover:bg-white" type="button">
                    <span className="material-symbols-outlined">edit</span>
                    Change Cover Image
                  </button>
                </div>
              </div>
              <div className="relative -mt-16 ml-12 flex items-end gap-6">
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                    <img
                      className="h-full w-full object-cover"
                      alt="Committee logo"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN8PcCidzqiNnXaRLaA0VstTcOTL2KfXX03W6TaBw4hzu9xBc7SR73Cqs2J0sr17EKIn1zpUfYamecSxMeUp7RIo0k21E-fM3uL_IRaPVMIb5bHvSPtm55hZBAehqq-CcHkZxziskhGmlidyGgPdS8JdrSNsE1LzGFxE2pzwqDDpW13TmIMDCoI6AAAMwgs3k9DPFveD8oovCy0uuLcitfyY-0r9lWcpv4B1seCrKx-kRJflJfVxLRm_ibw5dqXHLx9z1an9HBgLQ"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg transition-transform hover:scale-110" type="button">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <div className="pb-2">
                  <h3 className="text-3xl font-extrabold tracking-tight">The Creative Guild</h3>
                  <p className="font-medium text-on-surface-variant">Design &amp; Arts Committee</p>
                </div>
              </div>
            </section>

            <section className="col-span-12 space-y-6 md:col-span-5">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">General Information</h4>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Committee Name</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      defaultValue="The Creative Guild"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Short Tagline</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      defaultValue="Cultivating artistic excellence through collaboration"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Category</label>
                    <select className="w-full appearance-none rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary">
                      <option>Arts &amp; Design</option>
                      <option>Technology</option>
                      <option>Academic Research</option>
                      <option>Community Service</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg bg-primary-fixed p-8 text-on-primary-fixed-variant">
                <div className="relative z-10">
                  <span className="material-symbols-outlined mb-4 text-4xl">format_quote</span>
                  <p className="font-headline text-lg font-semibold leading-snug">
                    "Art is not what you see, but what you make others see."
                  </p>
                  <p className="mt-4 text-sm opacity-70">â€” Edgar Degas</p>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl">palette</span>
                </div>
              </div>
            </section>

            <section className="col-span-12 md:col-span-7">
              <div className="h-full rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Mission &amp; Activities</h4>
                <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Detailed 'About' Section</label>
                <textarea
                  className="w-full resize-none rounded-xl border-none bg-surface-container-low px-6 py-5 text-sm leading-relaxed transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                  rows="14"
                  defaultValue={`The Creative Guild is a multidisciplinary committee dedicated to bridging the gap between academic theory and artistic practice. Founded in 2021, we have grown into a vibrant community of over 50 mentors and students.

Our primary activities include:
â€¢ Weekly design critiques and collaborative workshops.
â€¢ Annual "Spectrum" showcase highlighting student projects.
â€¢ Partnership with local galleries for professional exhibitions.
â€¢ Mentorship programs pairing senior leads with aspiring creators.

We believe that creativity is a skill that can be nurtured through a supportive environment and consistent feedback loops. Our mission is to provide the resources and network necessary for every member to flourish.`}
                />
                <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">info</span>
                  Markdown is supported for text formatting.
                </div>
              </div>
            </section>

            <section className="col-span-12">
              <div className="grid gap-6 lg:grid-cols-2">
                <form onSubmit={handleAddMember} className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                  <h4 className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">Add Member</h4>
                  <p className="mb-6 text-xs font-medium text-on-surface-variant">Assign a student to this committee using their student ID.</p>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Student ID / Member ID</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={memberId}
                      onChange={event => setMemberId(event.target.value)}
                      placeholder="Enter student UUID"
                    />
                  </div>
                  {!committeeId ? (
                    <p className="mt-3 text-xs text-on-surface-variant">Committee ID unavailable</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={buttonsDisabled}
                    className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add Member
                  </button>
                </form>

                <form onSubmit={handleAddHead} className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                  <h4 className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">Add Head</h4>
                  <p className="mb-6 text-xs font-medium text-on-surface-variant">Assign a committee head with role title and role type.</p>
                  <div className="space-y-5">
                    <div>
                      <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Student ID / Head ID</label>
                      <input
                        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                        type="text"
                        value={headForm.headId}
                        onChange={event => setHeadForm(prev => ({ ...prev, headId: event.target.value }))}
                        placeholder="Enter student UUID"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Role Title</label>
                      <input
                        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                        type="text"
                        value={headForm.role_title}
                        onChange={event => setHeadForm(prev => ({ ...prev, role_title: event.target.value }))}
                        placeholder="VCP"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Role Type</label>
                      <input
                        list="role-type-options"
                        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                        type="text"
                        value={headForm.role_type}
                        onChange={event => setHeadForm(prev => ({ ...prev, role_type: event.target.value }))}
                        placeholder="CORE"
                      />
                      <datalist id="role-type-options">
                        <option value="CORE" />
                        <option value="LEAD" />
                        <option value="EXEC" />
                      </datalist>
                    </div>
                  </div>
                  {!committeeId ? (
                    <p className="mt-3 text-xs text-on-surface-variant">Committee ID unavailable</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={buttonsDisabled}
                    className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add Head
                  </button>
                </form>
              </div>
            </section>

            <section className="col-span-12">
              <div className="rounded-lg bg-surface-container-low p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">Opportunities Management</h4>
                    <p className="text-xs font-medium text-on-surface-variant">Manage open roles for the upcoming semester</p>
                  </div>
                  <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-transform hover:-translate-y-0.5" type="button">
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Add New Opportunity
                  </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {opportunityCards.map((card) => (
                    <div key={card.title} className="group rounded-xl border border-white bg-white p-6 shadow-[0_10px_20px_rgba(123,110,246,0.03)] transition-colors hover:border-primary-fixed">
                      <div className="mb-4 flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}>
                          <span className="material-symbols-outlined">{card.icon}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="p-2 text-on-surface-variant transition-colors hover:text-primary" type="button">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button className="p-2 text-on-surface-variant transition-colors hover:text-error" type="button">
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </div>
                      <h5 className="mb-1 text-lg font-bold">{card.title}</h5>
                      <p className="mb-4 text-xs text-on-surface-variant">{card.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-fixed-variant">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/60 p-6 transition-colors hover:bg-white/60">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors group-hover:bg-primary-fixed group-hover:text-primary">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <p className="text-xs font-bold text-on-surface-variant group-hover:text-primary">Create New Listing</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
