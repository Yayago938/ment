import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
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
  'mt-2 w-full rounded-2xl bg-white/60 text-gray-800 placeholder-gray-500 px-6 py-4 font-medium outline-none backdrop-blur focus:ring-2 focus:ring-white'
const emptyExperienceItem = () => ({
  title: '',
  role: '',
  description: '',
})

const buildFallbackStudent = studentId => ({
  auth_id: studentId || '',
  name: localStorage.getItem('userName') || 'Student',
  email: localStorage.getItem('userEmail') || '',
  college_email: '',
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
  email: localStorage.getItem('userEmail') || '',
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
      return value.split(',').map(item => item.trim()).filter(Boolean)
    }

    return value.split(',').map(item => item.trim()).filter(Boolean)
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
    email: sanitizeString(form.email),
    college_email: sanitizeString(form.college_email),
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
    email: '',
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
          email: fallback.email,
          college_email: fallback.college_email,
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
        email: safeStudent.email || '',
        college_email: safeStudent.college_email || '',
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
    return <div className="min-h-screen bg-surface text-on-surface">Loading...</div>
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-[#e9d5ff] via-[#c4b5fd] to-[#bfa2e6] text-gray-800">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search mentorships, students, portfolios..."
        userName={form.name || 'Student'}
        userRole="Student"
        userImage={profileImagePreview || form.profile_picture_url || ''}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-12 lg:pt-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <Link to={PROFILE_ROUTE} className="inline-flex bg-white/40 rounded-full border border-outline-variant px-5 py-2 text-sm font-bold text-primary">
              Back
            </Link>
            <h1 className="font-headline mt-4 text-4xl font-extrabold tracking-tight">Edit Profile</h1>
            <p className="mt-2 text-on-surface-variant">Update your student profile, academic details, and professional information.</p>
          </div>
          
        </div>

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-primary/10 bg-white px-5 py-4 text-sm font-medium text-primary">
            {statusMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-error/20 bg-white px-5 py-4 text-sm font-medium text-error">
            {errorMessage}
          </div>
        ) : null}

        <form id="edit-student-profile-form" className="space-y-8 xl:max-w-5xl" onSubmit={handleSubmit}>
          <section className="rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">Personal Info</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Name</label>
                <input className={inputClassName} value={form.name} onChange={event => handleChange('name', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Email</label>
                <input className={inputClassName} value={form.email} readOnly />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">College Email</label>
                <input className={inputClassName} value={form.college_email} onChange={event => handleChange('college_email', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Phone Number</label>
                <input className={inputClassName} value={form.phone_number} onChange={event => handleChange('phone_number', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Profile Picture URL</label>
                <input className={inputClassName} value={form.profile_picture_url} onChange={event => handleChange('profile_picture_url', event.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Bio</label>
                <textarea className={inputClassName} rows={5} value={form.bio} onChange={event => handleChange('bio', event.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">Academic Info</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">SAP ID</label>
                <input className={inputClassName} value={form.sap_id} onChange={event => handleChange('sap_id', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Roll No</label>
                <input className={inputClassName} value={form.roll_no} onChange={event => handleChange('roll_no', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Branch</label>
                <input className={inputClassName} value={form.branch} onChange={event => handleChange('branch', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Year</label>
                <input className={inputClassName} value={form.year} onChange={event => handleChange('year', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Class Division</label>
                <input className={inputClassName} value={form.class_division} onChange={event => handleChange('class_division', event.target.value)} />
              </div>
            </div>
          </section>

            <section className="rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/20 p-8 shadow-xl">

            <h2 className="text-2xl font-bold">Professional / Profile Info</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Resume URL</label>
                <input className={inputClassName} value={form.resume_url} onChange={event => handleChange('resume_url', event.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Skills</label>
                <input className={inputClassName} value={form.skills} onChange={event => handleChange('skills', event.target.value)} placeholder="React, Node.js, Public Speaking" />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Interests & Hobbies</label>
                <input className={inputClassName} value={form.interests_hobbies} onChange={event => handleChange('interests_hobbies', event.target.value)} placeholder="Design, Robotics, Reading" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white/40 backdrop-blur p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Experience</h2>
              <button
                type="button"
                onClick={addExperienceItem}
                className="rounded-full border border-outline-variant px-5 py-2 text-sm font-bold text-primary"
              >
                Add Experience
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {form.experience.map((item, index) => (
                <div key={`experience-${index}`} className="rounded-2xl bg-surface-container-low p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Experience {index + 1}
                    </p>
                    {form.experience.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeExperienceItem(index)}
                        className="text-sm font-bold text-error"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Experience Title / Organization</label>
                      <input
                        className={inputClassName}
                        value={item.title}
                        onChange={event => handleExperienceChange(index, 'title', event.target.value)}
                        placeholder="Coding Club, Marketing Internship"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Experience Role</label>
                      <input
                        className={inputClassName}
                        value={item.role}
                        onChange={event => handleExperienceChange(index, 'role', event.target.value)}
                        placeholder="Member, Intern, Coordinator"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Experience Description</label>
                      <textarea
                        className={inputClassName}
                        rows={4}
                        value={item.description}
                        onChange={event => handleExperienceChange(index, 'description', event.target.value)}
                        placeholder="Describe what you worked on, organized, or learned."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">Committee / Works In</h2>
            <div className="mt-6">
              {committees.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {committees.map(committee => {
                    const committeeId = String(committee.id || committee._id)
                    const checked = form.existing_committee_id.includes(committeeId)

                    return (
                      <label key={committeeId} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white/40 backdrop-blur border border-white/20 px-5 py-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCommitteeSelection(committeeId)}
                          className="mt-1 h-4 w-4 accent-primary"
                        />
                        <div>
                          <p className="font-semibold">{committee.name || 'Committee'}</p>
                          <p className="mt-1 text-sm text-on-surface-variant">
                            {committee.tagline || committee.description || 'No details added yet.'}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No committees available right now. You can save your profile without selecting any.</p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-bold">Social Links</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">LinkedIn</label>
                <input className={inputClassName} value={form.social_links.linkedin} onChange={event => handleSocialLinkChange('linkedin', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">GitHub</label>
                <input className={inputClassName} value={form.social_links.github} onChange={event => handleSocialLinkChange('github', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Portfolio</label>
                <input className={inputClassName} value={form.social_links.portfolio} onChange={event => handleSocialLinkChange('portfolio', event.target.value)} />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Instagram</label>
                <input className={inputClassName} value={form.social_links.instagram} onChange={event => handleSocialLinkChange('instagram', event.target.value)} />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
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
