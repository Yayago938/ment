import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { useToast } from '../components/ToastProvider'
import {
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
  person?.name ||
  person?.fullName ||
  person?.student_name ||
  person?.student?.name ||
  person?.student_id ||
  'Unnamed'

const getPersonEmail = person =>
  person?.email ||
  person?.student_email ||
  person?.student?.email ||
  person?.role_title ||
  ''

export default function CommitteeProfileEdit() {
  const { id } = useParams()
  const { showToast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [members, setMembers] = useState([])
  const [heads, setHeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

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
      await updateCommittee(id, form)
      showToast('Committee updated successfully')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to update committee')
    } finally {
      setSaving(false)
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
          <button
            className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleSubmit}
            disabled={loading || saving || !id}
          >
            {saving ? 'Saving...' : 'Save Changes'}
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
                  <div className="space-y-3">
                    {members.map(member => (
                      <div key={member.id || member._id || member.student_id || getPersonName(member)} className="rounded-xl bg-surface-container-low p-4">
                        <p className="font-bold">{getPersonName(member)}</p>
                        {getPersonEmail(member) ? (
                          <p className="text-xs text-on-surface-variant">{getPersonEmail(member)}</p>
                        ) : null}
                      </div>
                    ))}
                    {!loading && members.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">No members found.</p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-lg bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(123,110,246,0.05)]">
                  <h4 className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">Heads</h4>
                  <p className="mb-6 text-xs font-medium text-on-surface-variant">Students currently listed as committee heads.</p>
                  <div className="space-y-3">
                    {heads.map(head => (
                      <div key={head.id || head._id || head.student_id || getPersonName(head)} className="rounded-xl bg-surface-container-low p-4">
                        <p className="font-bold">{getPersonName(head)}</p>
                        {getPersonEmail(head) ? (
                          <p className="text-xs text-on-surface-variant">{getPersonEmail(head)}</p>
                        ) : null}
                      </div>
                    ))}
                    {!loading && heads.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">No heads found.</p>
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
