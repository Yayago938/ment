import { useEffect, useState } from 'react'
import { FaLinkedin, FaGithub, FaGlobe, FaInstagram } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import Loader from '../components/Loader'
import TopBar from '../components/TopBar'
import { getAllCommittees } from '../api/committeeApi'
import {
  createStudentProfile,
  getOneStudent,
  normalizeStudentResponse,
  updateStudentProfile,
} from '../api/authApi'

const PROFILE_ROUTE = '/profile'
const inputClassName =
  'mt-2 w-full rounded-2xl bg-gray-100 text-gray-800 placeholder-gray-500 px-6 py-4 font-medium outline-none backdrop-blur focus:ring-2 focus:ring-white'
const emptyExperienceItem = () => ({
  title: '',
  role: '',
  description: '',
})

const buildFallbackStudent = studentId => ({
  auth_id: studentId || '',
  name: localStorage.getItem('userName') || 'Student',
  email: localStorage.getItem('userEmail') || '',
  phone_number: '',
  sap_id: '',
  roll_no: '',
  profile_picture_url: '',
  branch: '',
  year: '',
  class_division: '',
  bio: '',
  skills: [],
  interests_hobbies: [],
  social_links: {},
  resume_url: '',
  existing_committee_id: [],
  experience: [],
})

const buildCreateStudentPayload = studentId => ({
  auth_id: studentId,
  name: localStorage.getItem('userName') || 'Student',
  college_email: localStorage.getItem('userEmail') || '',
  skills: [],
  interests_hobbies: [],
  social_links: {},
  existing_committee_id: [],
  experience: [],
})

const normalizeArrayField = value => {
  if (Array.isArray(value)) return value.filter(Boolean)

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch {
      return value.split(/[;,]/).map(i => i.trim()).filter(Boolean)
    }

    return value.split(/[;,]/).map(i => i.trim()).filter(Boolean)
  }

  return []
}

const normalizeObjectField = value => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }

  return {}
}

const normalizeExperience = value => {
  if (Array.isArray(value)) return value.filter(Boolean)

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : []
    } catch {
      return []
    }
  }

  return []
}

const sanitizeString = value => (typeof value === 'string' ? value.trim() : '')

const normalizeSocialLinksForForm = value => {
  const social = normalizeObjectField(value)

  return {
    linkedin: social.linkedin || '',
    github: social.github || '',
    portfolio: social.portfolio || '',
    instagram: social.instagram || '',
  }
}

const normalizeExperienceForForm = value => {
  const experiences = normalizeExperience(value)

  if (experiences.length === 0) {
    return [emptyExperienceItem()]
  }

  return experiences.map(item => ({
    title: item?.title || item?.organization || item?.company || item?.name || '',
    role: item?.role || item?.position || '',
    description: item?.description || item?.summary || item?.details || '',
  }))
}

const syncStudentSession = student => {
  if (!student || typeof student !== 'object') return

  if (student.name) localStorage.setItem('userName', student.name)
  if (student.email) localStorage.setItem('userEmail', student.email)
  if (student.profile_picture_url) {
    localStorage.setItem('userImage', student.profile_picture_url)
    localStorage.setItem('profileImage', student.profile_picture_url)
  }
}

const buildPayload = form => {
  const social_links = Object.fromEntries(
    Object.entries(form.social_links || {}).filter(([, value]) => sanitizeString(value))
  )

  const experience = (form.experience || [])
    .map(item => ({
      title: sanitizeString(item?.title),
      role: sanitizeString(item?.role),
      description: sanitizeString(item?.description),
    }))
    .filter(item => item.title || item.role || item.description)

  return {
    name: sanitizeString(form.name),
    email: sanitizeString(form.college_email),
    phone_number: sanitizeString(form.phone_number),
    sap_id: sanitizeString(form.sap_id),
    roll_no: sanitizeString(form.roll_no),
    profile_picture_url: sanitizeString(form.profile_picture_url),
    branch: sanitizeString(form.branch),
    year: sanitizeString(form.year),
    class_division: sanitizeString(form.class_division),
    bio: form.bio || '',
    skills: normalizeArrayField(form.skills),
    interests_hobbies: normalizeArrayField(form.interests_hobbies),
    social_links,
    resume_url: sanitizeString(form.resume_url),
    experience,
    existing_committee_id: Array.isArray(form.existing_committee_id) ? form.existing_committee_id : [],
  }
}

const getErrorMessage = error =>
  error?.response?.data?.message ||
  error?.message ||
  'Failed to save profile.'

export default function EditStudentProfile() {
  const [form, setForm] = useState({
    name: '',
    college_email: '',
    phone_number: '',
    sap_id: '',
    roll_no: '',
    profile_picture_url: '',
    branch: '',
    year: '',
    class_division: '',
    bio: '',
    skills: '',
    interests_hobbies: '',
    social_links: {
      linkedin: '',
      github: '',
      portfolio: '',
      instagram: '',
    },
    resume_url: '',
    experience: [emptyExperienceItem()],
    existing_committee_id: [],
  })
  const [committees, setCommittees] = useState([])
  const [profileImagePreview, setProfileImagePreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchStudent = async () => {
      const studentId = localStorage.getItem('studentId')

      const committeesResult = await Promise.allSettled([getAllCommittees()])
      const fetchedCommittees = committeesResult[0]?.status === 'fulfilled'
        ? committeesResult[0].value
        : []
      setCommittees(Array.isArray(fetchedCommittees) ? fetchedCommittees : [])

      if (!studentId || studentId === 'undefined' || studentId === 'null') {
        const fallback = buildFallbackStudent('')
        setForm({
          name: fallback.name,
          college_email: fallback.email,
          phone_number: fallback.phone_number,
          sap_id: fallback.sap_id,
          roll_no: fallback.roll_no,
          profile_picture_url: fallback.profile_picture_url,
          branch: fallback.branch,
          year: fallback.year,
          class_division: fallback.class_division,
          bio: fallback.bio,
          skills: '',
          interests_hobbies: '',
          social_links: normalizeSocialLinksForForm(fallback.social_links),
          resume_url: fallback.resume_url,
          experience: [emptyExperienceItem()],
          existing_committee_id: [],
        })
        setProfileImagePreview(fallback.profile_picture_url || '')
        setLoading(false)
        return
      }

      let studentData = null

      try {
        const response = await getOneStudent(studentId)
        studentData = normalizeStudentResponse(response)
      } catch (error) {
        const status = error?.response?.status

        if (status === 404 || status === 500) {
          try {
            const created = await createStudentProfile(buildCreateStudentPayload(studentId))
            studentData = normalizeStudentResponse(created)
          } catch (createError) {
            console.warn('Student creation failed on edit profile:', createError)
          }
        } else {
          console.warn('Student fetch failed on edit profile:', error)
        }
      }

      const safeStudent = studentData
        ? { ...buildFallbackStudent(studentId), ...studentData }
        : buildFallbackStudent(studentId)

      syncStudentSession(safeStudent)
      setForm({
        name: safeStudent.name || '',
        college_email: safeStudent.email || safeStudent.college_email || '',
        phone_number: safeStudent.phone_number || '',
        sap_id: safeStudent.sap_id || '',
        roll_no: safeStudent.roll_no || '',
        profile_picture_url: safeStudent.profile_picture_url || '',
        branch: safeStudent.branch || '',
        year: safeStudent.year || '',
        class_division: safeStudent.class_division || '',
        bio: safeStudent.bio || '',
        skills: normalizeArrayField(safeStudent.skills).join(', '),
        interests_hobbies: normalizeArrayField(safeStudent.interests_hobbies).join(', '),
        social_links: normalizeSocialLinksForForm(safeStudent.social_links),
        resume_url: safeStudent.resume_url || '',
        experience: normalizeExperienceForForm(safeStudent.experience),
        existing_committee_id: normalizeArrayField(safeStudent.existing_committee_id).map(String),
      })
      setProfileImagePreview(safeStudent.profile_picture_url || '')
      setLoading(false)
    }

    fetchStudent()
  }, [])

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value ?? '',
    }))

    if (key === 'profile_picture_url') {
      setProfileImagePreview(value ?? '')
    }
  }

  const handleSocialLinkChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [key]: value ?? '',
      },
    }))
  }

  const handleExperienceChange = (index, key, value) => {
    setForm(prev => ({
      ...prev,
      experience: prev.experience.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [key]: value ?? '' }
          : item
      ),
    }))
  }
  const handleResumeUpload = (file) => {
  if (!file) return

  // OPTIONAL: upload to backend later
  // for now just preview name / local URL

  const fileURL = URL.createObjectURL(file)

  setForm(prev => ({
    ...prev,
    resume_url: fileURL   // or file.name if you just want name
  }))
}

  const addExperienceItem = () => {
    setForm(prev => ({
      ...prev,
      experience: [...prev.experience, emptyExperienceItem()],
    }))
  }

  const removeExperienceItem = index => {
    setForm(prev => {
      const nextExperience = prev.experience.filter((_, itemIndex) => itemIndex !== index)
      return {
        ...prev,
        experience: nextExperience.length > 0 ? nextExperience : [emptyExperienceItem()],
      }
    })
  }

  const toggleCommitteeSelection = committeeId => {
    setForm(prev => {
      const normalizedId = String(committeeId)
      const alreadySelected = prev.existing_committee_id.includes(normalizedId)

      return {
        ...prev,
        existing_committee_id: alreadySelected
          ? prev.existing_committee_id.filter(id => id !== normalizedId)
          : [...prev.existing_committee_id, normalizedId],
      }
    })
  }

  const handleFilePreviewChange = file => {
    if (!file) return
    setProfileImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const studentId = localStorage.getItem('studentId')

    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      setErrorMessage('Student ID not found. Please sign in again.')
      return
    }

    setSaving(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      const payload = buildPayload(form)
      const response = await updateStudentProfile(studentId, payload)
      const updatedStudent = normalizeStudentResponse(response) || payload

      syncStudentSession(updatedStudent)
      setStatusMessage('Profile saved successfully.')
      navigate(PROFILE_ROUTE)
    } catch (error) {
      if (error?.response?.status === 404) {
        try {
          const createPayload = {
            ...buildCreateStudentPayload(studentId),
            ...buildPayload(form),
          }
          const created = await createStudentProfile(createPayload)
          const createdStudent = normalizeStudentResponse(created) || createPayload
          syncStudentSession(createdStudent)
          setStatusMessage('Profile saved successfully.')
          navigate(PROFILE_ROUTE)
          return
        } catch (createError) {
          setErrorMessage(getErrorMessage(createError))
        }
      } else {
        setErrorMessage(getErrorMessage(error))
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
   return <Loader/>
  }

  return (
    <div className="min-h-screen bg-surface">
    <StudentSidebar />

    <TopBar
      sidebar="student"
      hideSearch={true}
      userName={form.name || 'Student'}
      userRole="Student"
      userImage={profileImagePreview || form.profile_picture_url || ''}
    />

    <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-12 lg:pt-24">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1">
          {/* <Link
            to={PROFILE_ROUTE}
            className="rounded-full border border-white/50 bg-white/60 px-5 py-2 text-sm font-bold"
          >
            ← Back
          </Link> */}

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Edit Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Update your details, skills and experience.
          </p>
        </div>
      </div>

      {/* STATUS */}
      {statusMessage && (
        <div className="mb-6 rounded-2xl bg-white/60 px-5 py-4 text-sm font-medium">
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-2xl bg-red-100 px-5 py-4 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      <form className="space-y-8 xl:max-w-5xl" onSubmit={handleSubmit}>
        
        {/* PERSONAL */}
          <section className="bg-white p-6 rounded-3xl shadow">

          <h2 className="text-2xl font-bold">Personal Info</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-600">Name</label>
              <input className={inputClassName} value={form.name} onChange={e => handleChange('name', e.target.value)} />
            </div>


            <div>
              <label className="text-xs font-bold uppercase text-gray-600">College Email</label>
              <input className={inputClassName} value={form.college_email} onChange={e => handleChange('college_email', e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-600">Phone</label>
              <input className={inputClassName} value={form.phone_number} onChange={e => handleChange('phone_number', e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-600">Profile Image</label>
              <input className={inputClassName} value={form.profile_picture_url} onChange={e => handleChange('profile_picture_url', e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-600">Bio</label>
              <textarea className={inputClassName} rows={4} value={form.bio} onChange={e => handleChange('bio', e.target.value)} />
            </div>
          </div>
        </section>

        {/* ACADEMIC */}
          <section className="bg-white p-6 rounded-3xl shadow">

          <h2 className="text-2xl font-bold">Academic Info</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
             <div><label className="text-xs font-bold uppercase text-gray-600">SAP ID</label><input className={inputClassName} placeholder="SAP ID" value={form.sap_id} onChange={e => handleChange('sap_id', e.target.value)} /></div>
             <div><label className="text-xs font-bold uppercase text-gray-600">Roll No</label><input className={inputClassName} placeholder="Roll No" value={form.roll_no} onChange={e => handleChange('roll_no', e.target.value)} /></div>
             <div><label className="text-xs font-bold uppercase text-gray-600">Branch</label><input className={inputClassName} placeholder="Branch" value={form.branch} onChange={e => handleChange('branch', e.target.value)} /></div>
             <div><label className="text-xs font-bold uppercase text-gray-600">Year</label><input className={inputClassName} placeholder="Year" value={form.year} onChange={e => handleChange('year', e.target.value)} /></div>
             <div><label className="text-xs font-bold uppercase text-gray-600">Division</label><input className={inputClassName} placeholder="Division" value={form.class_division} onChange={e => handleChange('class_division', e.target.value)} /></div>
          </div>
        </section>

        {/* SKILLS */}
        <div className="flex justify-between">
        <section className="bg-white p-6 rounded-3xl shadow">
       <h2 className="text-2xl font-bold">Skills & Interests</h2>

  {/* INPUTS */}
  <div className="mt-4 space-y-4">
    <input
      className={inputClassName}
      placeholder="Skills (comma separated)"
      value={form.skills}
      onChange={e => handleChange('skills', e.target.value)}
    />

    <input
      className={inputClassName}
      placeholder="Interests"
      value={form.interests_hobbies}
      onChange={e => handleChange('interests_hobbies', e.target.value)}
    />
  </div>

  {/* SKILL TAGS */}
  <div className="mt-4">
    <p className="text-sm text-gray-500 mb-2">Skills</p>
    <div className="flex flex-wrap gap-2">
      {normalizeArrayField(form.skills).map((skill, i) => (
        <span
          key={i}
          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs flex items-center gap-1"
        >
          {skill}
          <button
            onClick={() => {
              const updated = normalizeArrayField(form.skills).filter(s => s !== skill)
              handleChange('skills', updated.join(', '))
            }}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  </div>

  {/* INTEREST TAGS */}
  <div className="mt-4">
    <p className="text-sm text-gray-500 mb-2">Interests</p>
    <div className="flex flex-wrap gap-2">
      {normalizeArrayField(form.interests_hobbies).map((item, i) => (
        <span
          key={i}
          className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs flex items-center gap-1"
        >
          {item}
          <button
            onClick={() => {
              const updated = normalizeArrayField(form.interests_hobbies).filter(s => s !== item)
              handleChange('interests_hobbies', updated.join(', '))
            }}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  </div>
</section>
<section className="bg-white p-20 rounded-3xl shadow">
  <h2 className="text-2xl font-bold text-center">Resume / CV</h2>

  <div className="mt-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6">

    <input
      type="text"
      placeholder="Paste resume link (Google Drive / etc)"
      className="w-full border rounded-xl px-4 py-2"
      value={form.resume_url}
      onChange={(e) => handleChange('resume_url', e.target.value)}
    />

    <p className="text-sm text-gray-500 mt-2">
      Upload resume to Drive and paste link here
    </p>

    {/* Preview */}
    {form.resume_url && (
      <a
        href={form.resume_url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 text-purple-600 text-sm"
      >
        View Resume
      </a>
    )}
  </div>
</section>
</div>
        {/* EXPERIENCE */}
          <section className="bg-white p-6 rounded-3xl shadow">

  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">Experience</h2>
    <button
      type="button"
      onClick={addExperienceItem}
      className="text-sm font-bold text-purple-600"
    >
      + Add
    </button>
  </div>

  <div className="mt-6 space-y-4">
    {form.experience.map((item, i) => (
      <div key={i} className="rounded-2xl bg-white/60 p-4 relative border">

        {/* ❌ DELETE BUTTON */}
        {form.experience.length > 1 && (
          <button
            type="button"
            onClick={() => removeExperienceItem(i)}
            className="absolute top-3 right-3 text-red-500 text-sm font-bold"
          >
            ✕
          </button>
        )}

        <input
          className={inputClassName}
          placeholder="Title"
          value={item.title}
          onChange={e => handleExperienceChange(i, 'title', e.target.value)}
        />

        <input
          className={inputClassName}
          placeholder="Role"
          value={item.role}
          onChange={e => handleExperienceChange(i, 'role', e.target.value)}
        />

        <textarea
          className={inputClassName}
          placeholder="Description"
          value={item.description}
          onChange={e => handleExperienceChange(i, 'description', e.target.value)}
        />
      </div>
    ))}
  </div>
</section>
        <section className="bg-white p-6 rounded-3xl shadow">
  <h2 className="text-2xl font-bold">Social Links</h2>

  <div className="mt-6 grid gap-4">

    <div className="flex items-center gap-3">
      <FaLinkedin className="text-blue-600" />
      <input
        value={form.social_links.linkedin}
        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
        placeholder="LinkedIn URL"
        className="w-full border rounded-xl px-4 py-2"
      />
    </div>

    <div className="flex items-center gap-3">
      <FaGithub />
      <input
        value={form.social_links.github}
        onChange={(e) => handleSocialLinkChange('github', e.target.value)}
        placeholder="GitHub URL"
        className="w-full border rounded-xl px-4 py-2"
      />
    </div>

    <div className="flex items-center gap-3">
      <FaGlobe />
      <input
        value={form.social_links.portfolio}
        onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
        placeholder="Portfolio URL"
        className="w-full border rounded-xl px-4 py-2"
      />
    </div>

    <div className="flex items-center gap-3">
      <FaInstagram className="text-pink-500" />
      <input
        value={form.social_links.instagram}
        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
        placeholder="Instagram URL"
        className="w-full border rounded-xl px-4 py-2"
      />
    </div>

  </div>

 
</section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-[#945fc5] to-[#e188e9] px-8 py-4 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

      </form>
    </main>
  </div>
)
}
