import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { getOneStudent } from '../api/authApi'


const updateStudent = async (studentId, data) => {
  try {
    // Try updating existing profile
     return await api.patch(`/update-student/${studentId}`, data)
  } catch (error) {
    if (error.response?.status === 404) {
      // Profile doesn't exist → create it
      return await api.post('/student-profile', {
        ...data,
        auth_id: studentId,
      })
    }
    throw error
  }
}

const normalizeStudent = (response) => {
  if (!response) return null

  const data = response.data || response

  return (
    data.student ||
    data.data ||
    data.user ||
    data ||
    null
  )
}

const normalizeArrayField = value => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value)
      return Array.isArray(parsedValue)
        ? parsedValue
        : value.split(',').map(item => item.trim()).filter(Boolean)
    } catch {
      return value.split(',').map(item => item.trim()).filter(Boolean)
    }
  }

  return []
}

const normalizeObjectField = value => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value)
      return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {}
    } catch {
      return {}
    }
  }

  return {}
}

export default function EditStudentProfile() {
  const [originalStudent, setOriginalStudent] = useState(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('')
  const [classDivision, setClassDivision] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [skills, setSkills] = useState('')
  const [interests, setInterests] = useState('')
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    portfolio: '',
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStudent = async () => {
      const studentId = localStorage.getItem('studentId')

      if (!studentId || studentId === 'undefined' || studentId === 'null') {
        console.error('Invalid studentId')
        setLoading(false)
        return
      }

      try {
        const response = await getOneStudent(studentId)
        const student = normalizeStudent(response) || {}
        setOriginalStudent(student)
        const normalizedSocialLinks = normalizeObjectField(student.social_links)

        setFullName(student.name || '')
        setBio(student.bio || '')
        setBranch(student.branch || '')
        setYear(student.year || '')
        setClassDivision(student.class_division || '')
        setProfilePictureUrl(student.profile_picture_url || '')
        setResumeUrl(student.resume_url || '')
        setSkills(normalizeArrayField(student.skills).join(', '))
        setInterests(normalizeArrayField(student.interests_hobbies).join(', '))
        setSocialLinks({
          linkedin: normalizedSocialLinks.linkedin || '',
          github: normalizedSocialLinks.github || '',
          portfolio: normalizedSocialLinks.portfolio || '',
        })
      } catch (error) {
        if (error.response?.status === 404) {
          setOriginalStudent({})
          setLoading(false)
          return
        }
        console.error('Failed to fetch student profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  
  }, [])

  const handleSocialLinkChange = (key, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFileUrlChange = (setter, file) => {
    if (!file) {
      return
    }

    setter(URL.createObjectURL(file))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const studentId = localStorage.getItem('studentId')

    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      console.error('Invalid studentId')
      return
    }

    try {
      await updateStudent(studentId, {
  name: fullName,
  bio,
  branch,
  year,
  class_division: classDivision,
  profile_picture_url: profilePictureUrl,
  resume_url: resumeUrl,
  skills: skills.split(',').map(s => s.trim()).filter(Boolean),
  interests_hobbies: interests.split(',').map(s => s.trim()).filter(Boolean),
  social_links: socialLinks,
})

      console.log('Profile updated successfully')
      navigate('/profile')
    } catch (error) {
      console.error('Failed to update student profile:', error)
    }
  }

  if (loading) {
    return null
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
                  <textarea className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" rows={4} value={bio} onChange={event => setBio(event.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Profile Image</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" type="file" accept="image/*" onChange={event => handleFileUrlChange(setProfilePictureUrl, event.target.files?.[0])} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Skills</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={skills} onChange={event => setSkills(event.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Interests</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={interests} onChange={event => setInterests(event.target.value)} />
                </div>
              </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
              <div className="rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
                <h2 className="font-headline text-xl font-bold">Academic Info</h2>
                <div className="mt-8 space-y-6">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Field of Study</label>
                    <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={branch} onChange={event => setBranch(event.target.value)} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Graduation Year</label>
                    <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={year} onChange={event => setYear(event.target.value)} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Class Division</label>
                    <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={classDivision} onChange={event => setClassDivision(event.target.value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
                <h2 className="font-headline text-xl font-bold">Resume / CV</h2>
                <div className="mt-8 flex min-h-64 flex-col justify-center rounded-[28px] border-2 border-dashed border-outline-variant/30 bg-surface-container-low/30 p-6 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_upload</span>
                  <p className="mt-4 text-sm font-bold">Click to upload or drag and drop</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">PDF, Word (Max 5MB)</p>
                  <input className="mt-6 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" type="file" accept=".pdf,.doc,.docx" onChange={event => handleFileUrlChange(setResumeUrl, event.target.files?.[0])} />
                </div>
              </div>
            </section>

            <section className="rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
              <h2 className="font-headline text-xl font-bold">Social Links</h2>
              <div className="mt-8 space-y-8">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">LinkedIn</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={socialLinks.linkedin} onChange={event => handleSocialLinkChange('linkedin', event.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">GitHub</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={socialLinks.github} onChange={event => handleSocialLinkChange('github', event.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Portfolio</label>
                  <input className="mt-2 w-full rounded-2xl bg-surface-container-low px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-primary" value={socialLinks.portfolio} onChange={event => handleSocialLinkChange('portfolio', event.target.value)} />
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
