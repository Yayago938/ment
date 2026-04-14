import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import {
  createStudentProfile,
  getOneStudent,
  normalizeStudentResponse,
} from '../api/authApi'
import { getAllCommittees } from '../api/committeeApi'

const STUDENT_EMPTY = 'Not added'
const DEFAULT_PROFILE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI-bw3VtCpIIjSBLpU7BOOjlBqnxIby2i1O-xugAAznZQoRzfyZZySvtQL6m7_IqgAobQ7awNjd3dagTgi4UYq5MhzTQlO6uD_YQZDvMI9lNxHithFKTCViTuBpXUg7v82HvcWjfr2MiXgKOwpEiOJoNNGxU_pb195SbOH5g6kloPiO924yqyucPqENAt0R0tLYTffmqF0LxWpC6XQhl7CAGPDOxY3mJVkVIX9FDeGWBnIU6JyLPwwQoipsu6uQU-v8s-_6w_UrM'

const normalizeCommittees = response => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.committees)) return response.committees
  if (Array.isArray(response?.data?.committees)) return response.data.committees
  return []
}

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
  committees: [],
  committee_heads: [],
  experience: [],
})

const syncStudentSession = student => {
  if (!student || typeof student !== 'object') return

  if (student.name) localStorage.setItem('userName', student.name)
  if (student.email) localStorage.setItem('userEmail', student.email)
  if (student.profile_picture_url) {
    localStorage.setItem('userImage', student.profile_picture_url)
    localStorage.setItem('profileImage', student.profile_picture_url)
  }
}

const displayValue = value => {
  if (value === null || value === undefined) return STUDENT_EMPTY
  if (typeof value === 'string' && value.trim() === '') return STUDENT_EMPTY
  return value
}

const getCommitteeKey = committee =>
  String(
    committee?.id ||
    committee?.committee_id ||
    committee?.committeeId ||
    committee?.name ||
    Math.random()
  )

const getExperienceDisplay = experience => ({
  title:
    experience?.title ||
    experience?.organization ||
    experience?.company ||
    experience?.name ||
    '',
  role:
    experience?.role ||
    experience?.position ||
    '',
  description:
    experience?.description ||
    experience?.summary ||
    experience?.details ||
    '',
})

export default function StudentProfile() {
  const [student, setStudent] = useState(null)
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      const studentId = localStorage.getItem('studentId')

      if (!studentId || studentId === 'undefined' || studentId === 'null') {
        setStudent(buildFallbackStudent(''))
        setLoading(false)
        return
      }

      const fallbackStudent = buildFallbackStudent(studentId)

      const [committeesResult, studentResult] = await Promise.allSettled([
        getAllCommittees(),
        getOneStudent(studentId),
      ])

      if (committeesResult.status === 'fulfilled') {
        setCommittees(normalizeCommittees(committeesResult.value))
      } else {
        console.warn('Committee fetch failed on student profile:', committeesResult.reason)
        setCommittees([])
      }

      let studentData =
        studentResult.status === 'fulfilled'
          ? normalizeStudentResponse(studentResult.value)
          : null

      if (!studentData && studentResult.status === 'rejected') {
        const status = studentResult.reason?.response?.status

        if (status === 404 || status === 500) {
          try {
            const created = await createStudentProfile(buildCreateStudentPayload(studentId))
            studentData = normalizeStudentResponse(created)
          } catch (createError) {
            console.warn('Student creation failed on student profile:', createError)
          }
        } else {
          console.warn('Student fetch failed on student profile:', studentResult.reason)
        }
      }

      const resolvedStudent = studentData
        ? { ...fallbackStudent, ...studentData }
        : fallbackStudent

      syncStudentSession(resolvedStudent)
      setStudent(resolvedStudent)
      setLoading(false)
    }

    fetchProfileData()
  }, [])

  const skills = normalizeArrayField(student?.skills)
  const interests = normalizeArrayField(student?.interests_hobbies)
  const experiences = normalizeExperience(student?.experience)
  const socialLinks = normalizeObjectField(student?.social_links)
  const socialLinkEntries = Object.entries(socialLinks).filter(([, value]) => Boolean(value))

  const committeeEntries = useMemo(() => {
    const selectedIds = normalizeArrayField(student?.existing_committee_id).map(String)

    if (selectedIds.length === 0) {
      return []
    }

    return committees
      .filter(committee => selectedIds.includes(String(committee?.id)))
      .map(committee => ({
        id: committee.id,
        name: committee.name,
      }))
  }, [committees, student?.existing_committee_id])

  const userName = student?.name || 'Student'
  const profileImage = student?.profile_picture_url || DEFAULT_PROFILE_IMAGE

  const infoRows = [
    ['Email', student?.email],
    ['College Email', student?.college_email],
    ['Phone Number', student?.phone_number],
    ['SAP ID', student?.sap_id],
    ['Roll No', student?.roll_no],
    ['Branch', student?.branch],
    ['Year', student?.year],
    ['Class Division', student?.class_division],
  ]

  if (loading) {
    return <div className="min-h-screen bg-surface text-on-surface">Loading...</div>
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-[#e9d5ff] via-[#c4b5fd] to-[#bfa2e6] text-gray-800">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search mentorships, students, portfolios..."
        userName={userName}
        userRole="Student"
        userImage={profileImage}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-12 lg:pt-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-headline mt-4 text-4xl font-extrabold tracking-tight">Student Profile</h1>
            <p className="mt-2 text-white/70">Overview of student details, skills, and campus involvement.</p>
          </div>
          <Link to="/edit-student-profile" className="rounded-full border border-outline-variant bg-white/70 px-6 py-3 text-sm font-bold text-primary">
            Edit
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-8">
            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
             <div className="h-48 w-48 overflow-hidden rounded-[28px] bg-surface-container-low">
                <img className="h-full w-full object-cover" src={profileImage} alt={userName} />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold">{displayValue(student?.name)}</h2>
                <div className="mt-4">
                  {displayValue(student?.branch)} {' | '} {displayValue(student?.year)}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map(tag => (
                      <span key={tag} className="bg-white/60 text-gray-800 backdrop-blur px-3 py-1 rounded-full">{tag}</span>
                    ))
                  ) : (
                    <span className="text-white/70">{STUDENT_EMPTY}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">About</h3>
              <p className="mt-4">{displayValue(student?.bio)}</p>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Basic Information</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {infoRows.map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-surface-container-low px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray/70">{label}</p>
                    <p className="mt-2 font-medium">{displayValue(value)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Interests & Hobbies</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {interests.length > 0 ? (
                  interests.map(item => (
                    <span key={item} className="rounded bg-gray-100 px-3 py-1">{item}</span>
                  ))
                ) : (
                  <p className="text-white/70">{STUDENT_EMPTY}</p>
                )}
              </div>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Resume</h3>
              <div className="mt-4">
                {student?.resume_url ? (
                  <a href={student.resume_url} target="_blank" rel="noreferrer" className="font-semibold text-primary underline underline-offset-4">
                    View Resume
                  </a>
                ) : (
                  <p className="text-white/70">{STUDENT_EMPTY}</p>
                )}
              </div>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Experience</h3>
              <div className="mt-4 space-y-4">
                {experiences.length > 0 ? (
                  experiences.map((experience, index) => {
                    const display = getExperienceDisplay(experience)

                    return (
                      <div key={`${display.title}-${display.role}-${index}`} className="rounded-2xl bg-surface-container-low px-5 py-4">
                        <p className="font-bold">{displayValue(display.title)}</p>
                        <p className="mt-1 text-sm text-white/70">{displayValue(display.role)}</p>
                        {display.description ? (
                          <p className="mt-3 text-sm">{display.description}</p>
                        ) : null}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-white/70">{STUDENT_EMPTY}</p>
                )}
              </div>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Social Links</h3>
              <div className="mt-4 flex flex-wrap gap-4">
                {socialLinkEntries.length > 0 ? (
                  socialLinkEntries.map(([key, value]) => (
                    <a key={key} href={value} target="_blank" rel="noreferrer" className="font-semibold capitalize text-primary underline underline-offset-4">
                      {key}
                    </a>
                  ))
                ) : (
                  <p className="text-white/70">{STUDENT_EMPTY}</p>
                )}
              </div>
            </section>

            <section className="text-gray-800 grid gap-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Committee / Works In</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {committeeEntries.length > 0 ? (
                  committeeEntries.map(committee => (
                    <div key={getCommitteeKey(committee)} className="rounded-xl bg-surface-container-low p-6">
                      <h4 className="font-bold">{displayValue(committee?.name)}</h4>
                      <p className="mt-2 text-sm text-white/70">Member</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70">{STUDENT_EMPTY}</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
