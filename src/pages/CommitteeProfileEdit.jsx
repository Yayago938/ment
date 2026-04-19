import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { useToast } from '../components/ToastProvider'
import {
  addHeadToCommittee,
  addMemberToCommittee,
  getCommitteeById,
  getCommitteeHeads,
  getCommitteeMembers,
  updateCommittee,
} from '../api/committeeApi'

const emptyForm = {
  committeeName: '',
  description: '',
  tagline: '',
  startYear: '',
  affiliatedFaculty: {
    name: '',
  },
  social_links: {
    insta: '',
    linkedin: '',
    website: '',
  },
}

const normalizePeople = data => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(data?.members)) {
    return data.members
  }

  if (Array.isArray(data?.heads)) {
    return data.heads
  }

  return []
}

const getPersonName = person =>
  person?.students?.name ||
  person?.student_name ||
  person?.name ||
  'Unnamed'

const getPersonImage = person =>
  person?.students?.profile_picture_url ||
  person?.profile_picture_url ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(getPersonName(person))}`

export default function CommitteeProfileEdit() {
  const { id } = useParams()
  const { showToast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [members, setMembers] = useState([])
  const [heads, setHeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newHead, setNewHead] = useState({
    email: '',
    role_title: '',
    role_type: 'CORE',
  })

  useEffect(() => {
    if (!id) {
      return
    }

    localStorage.setItem('committeeId', id)

    const fetchData = async () => {
      setLoading(true)

      try {
        const [committeeData, membersData, headsData] = await Promise.all([
          getCommitteeById(id),
          getCommitteeMembers(id),
          getCommitteeHeads(id),
        ])

        setForm({
          committeeName: committeeData.committeeName || committeeData.name || '',
          description: committeeData.description || '',
          tagline: committeeData.tagline || '',
          startYear: committeeData.startYear || '',
          affiliatedFaculty: {
            name: committeeData.affiliatedFaculty?.name || committeeData.facultyName || '',
          },
          social_links: {
            insta: committeeData.social_links?.insta || committeeData.socialLinks?.insta || '',
            linkedin: committeeData.social_links?.linkedin || committeeData.socialLinks?.linkedin || '',
            website: committeeData.social_links?.website || committeeData.socialLinks?.website || '',
          },
        })
        setMembers(normalizePeople(membersData))
        setHeads(normalizePeople(headsData))
      } catch (error) {
        showToast(error?.response?.data?.message || 'Failed to load committee data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, showToast])

  const handleSubmit = async () => {
    if (!id) {
      showToast('Committee ID unavailable')
      return
    }

    setSaving(true)

    try {
      const payload = {
        committee_name: form.committeeName,
        description: form.description,
        tagline: form.tagline,
        start_year: form.startYear,
        affiliated_faculty: {
          name: form.affiliatedFaculty.name,
        },
        social_links: form.social_links,
      }

      await updateCommittee(id, payload)
      showToast('Committee updated successfully')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to update committee')
    } finally {
      setSaving(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      showToast('Email is required')
      return
    }

    try {
      await addMemberToCommittee({
        committeeId: id,
        student_email: newMemberEmail.trim(),
      })

      showToast('Member added successfully')

      const updated = await getCommitteeMembers(id)
      setMembers(normalizePeople(updated))

      setNewMemberEmail('')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to add member')
    }
  }

  const handleAddHead = async () => {
    if (!newHead.email.trim() || !newHead.role_title.trim() || !newHead.role_type.trim()) {
      showToast('All head fields are required')
      return
    }

    try {
      await addHeadToCommittee({
        committeeId: id,
        head_email: newHead.email.trim(),
        role_title: newHead.role_title.trim(),
        role_type: newHead.role_type.trim(),
      })

      showToast('Head added successfully')

      const updated = await getCommitteeHeads(id)
      setHeads(normalizePeople(updated))

      setNewHead({ email: '', role_title: '', role_type: 'CORE' })
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to add head')
    }
  }

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
          {/* <button
            className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleSubmit}
            disabled={loading || saving || !id}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button> */}
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
              </div>
              <div className="relative -mt-16 ml-12 flex items-end gap-6">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                  <img
                    className="h-full w-full object-cover"
                    alt="Committee logo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN8PcCidzqiNnXaRLaA0VstTcOTL2KfXX03W6TaBw4hzu9xBc7SR73Cqs2J0sr17EKIn1zpUfYamecSxMeUp7RIo0k21E-fM3uL_IRaPVMIb5bHvSPtm55hZBAehqq-CcHkZxziskhGmlidyGgPdS8JdrSNsE1LzGFxE2pzwqDDpW13TmIMDCoI6AAAMwgs3k9DPFveD8oovCy0uuLcitfyY-0r9lWcpv4B1seCrKx-kRJflJfVxLRm_ibw5dqXHLx9z1an9HBgLQ"
                  />
                </div>
                <div className="pb-2">
                  <h3 className="text-3xl font-extrabold tracking-tight">{form.committeeName || 'Committee Profile'}</h3>
                  <p className="font-medium text-on-surface-variant">{form.tagline}</p>
                </div>
              </div>
            </section>

            <section className="col-span-12 space-y-6 md:col-span-5">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Committee Info</h4>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Name</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.committeeName}
                      onChange={event => setForm({ ...form, committeeName: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Tagline</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.tagline}
                      onChange={event => setForm({ ...form, tagline: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Start Year</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.startYear}
                      onChange={event => setForm({ ...form, startYear: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Faculty Name</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.affiliatedFaculty.name}
                      onChange={event =>
                        setForm({
                          ...form,
                          affiliatedFaculty: {
                            ...form.affiliatedFaculty,
                            name: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Social Links</h4>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Instagram</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.social_links.insta}
                      onChange={event =>
                        setForm({
                          ...form,
                          social_links: {
                            ...form.social_links,
                            insta: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">LinkedIn</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.social_links.linkedin}
                      onChange={event =>
                        setForm({
                          ...form,
                          social_links: {
                            ...form.social_links,
                            linkedin: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Website</label>
                    <input
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      type="text"
                      value={form.social_links.website}
                      onChange={event =>
                        setForm({
                          ...form,
                          social_links: {
                            ...form.social_links,
                            website: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-12 md:col-span-7">
              <div className="h-full rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Description</h4>
                <label className="mb-1 block pl-1 text-xs font-semibold text-on-surface-variant">Committee Description</label>
                <textarea
                  className="w-full resize-none rounded-xl border-none bg-surface-container-low px-6 py-5 text-sm leading-relaxed transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                  rows="18"
                  value={form.description}
                  onChange={event => setForm({ ...form, description: event.target.value })}
                />
              </div>
            </section>

            <section className="col-span-12">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                  <h4 className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">Members</h4>
                  <p className="mb-6 text-xs font-medium text-on-surface-variant">Students currently listed as committee members.</p>
                  <div className="mb-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter member email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      Add Member
                    </button>
                  </div>
                  <div className="space-y-3">
                    {members.map(member => (
                      <div
                        key={member.id || member.student_id}
                        className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4"
                      >
                        <img
                          src={getPersonImage(member)}
                          alt={getPersonName(member)}
                          className="h-12 w-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-bold">{getPersonName(member)}</p>
                          <p className="text-xs text-on-surface-variant">
                            {member.role_type || 'Member'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {!loading && members.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">No members yet</p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                  <h4 className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">Heads</h4>
                  <p className="mb-6 text-xs font-medium text-on-surface-variant">Students currently listed as committee heads.</p>
                  <div className="mb-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Email"
                      value={newHead.email}
                      onChange={(e) => setNewHead(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={newHead.role_title}
                      onChange={(e) => setNewHead(prev => ({ ...prev, role_title: e.target.value }))}
                      className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                    />
                    <select
                      value={newHead.role_type}
                      onChange={(e) => setNewHead(prev => ({ ...prev, role_type: e.target.value }))}
                      className="rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                    >
                      <option value="CORE">CORE</option>
                      <option value="CO_COM">CO_COM</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddHead}
                      className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      Add Head
                    </button>
                  </div>
                  <div className="space-y-3">
                    {heads.map(head => (
                      <div
                        key={head.name ||head.id || head.student_id}
                        className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4"
                      >
                        <img
                          src={getPersonImage(head)}
                          alt={getPersonName(head)}
                          className="h-12 w-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-bold">{getPersonName(head)}</p>
                          <p className="text-xs text-on-surface-variant">
                            {head.role_title || 'Head'} • {head.role_type}
                          </p>
                        </div>
                      </div>
                    ))}
                    {!loading && heads.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">No heads yet</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-12">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || saving || !id}
                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
