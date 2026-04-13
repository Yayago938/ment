import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import { getOneStudent } from '../api/authApi'
import { getAllCommittees } from '../api/committeeApi'
import api from '../api/axios'

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

const normalizeCommittees = response => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.committees)) {
    return response.committees
  }

  if (Array.isArray(response?.data?.committees)) {
    return response.data.committees
  }

  return []
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

const normalizeExperience = value => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value)
      return Array.isArray(parsedValue) ? parsedValue : []
    } catch {
      return []
    }
  }

  return []
}

const buildFallbackStudent = () => ({
  name: localStorage.getItem('userName') || 'Student',
  email: localStorage.getItem('userEmail') || '',
  bio: '',
  branch: '',
  year: '',
  skills: [],
  interests_hobbies: [],
  social_links: {},
  existing_committee_id: [],
  experience: [],
})

export default function StudentProfile() {
  const [student, setStudent] = useState(null)
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  const fetchProfileData = async () => {
    const studentId = localStorage.getItem('studentId')

    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      console.error('Invalid studentId')
      setError('Student ID not found. Please sign in again.')
      setLoading(false)
      return
    }

    try {
      const committeesRes = await getAllCommittees()
      setCommittees(normalizeCommittees(committeesRes))

      let studentData = null

      try {
        const studentRes = await getOneStudent(studentId)
        studentData = normalizeStudent(studentRes)
      } catch (error) {
        console.warn('Fetch failed, trying to create profile...', error)

        // ⚠️ HANDLE BOTH 404 + 500
        if (error.response?.status === 404 || error.response?.status === 500) {
          try {
            const newStudent = await api.post('/student-profile', {
              auth_id: studentId,
              name: localStorage.getItem('userName') || 'Student',
              email: localStorage.getItem('userEmail') || '',
              skills: [],
              interests_hobbies: [],
              social_links: {},
            })

            studentData = normalizeStudent(newStudent)
          } catch (createError) {
            console.error('Profile creation failed:', createError)
            setStudent(buildFallbackStudent())
            return
          }
        } else {
          throw error
        }
      }

      if (!studentData) {
        setStudent(buildFallbackStudent())
      } else {
        setStudent(studentData)
      }

    } catch (error) {
      console.error('Failed to load student profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  fetchProfileData()
}, [])

  const skills = normalizeArrayField(student?.skills)
  const interests = normalizeArrayField(student?.interests_hobbies)
  const experiences = normalizeExperience(student?.experience)
  const socialLinks = normalizeObjectField(student?.social_links)
  const studentCommitteeIds = Array.isArray(student?.existing_committee_id) ? student.existing_committee_id : []
  const studentCommittees = useMemo(
    () =>
      committees.filter(committee =>
        studentCommitteeIds.some(id => String(id) === String(committee.id || committee._id))
      ),
    [committees, studentCommitteeIds],
  )
  const userName = student?.name || 'Student'
  const profileImage = student?.profile_picture_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI-bw3VtCpIIjSBLpU7BOOjlBqnxIby2i1O-xugAAznZQoRzfyZZySvtQL6m7_IqgAobQ7awNjd3dagTgi4UYq5MhzTQlO6uD_YQZDvMI9lNxHithFKTCViTuBpXUg7v82HvcWjfr2MiXgKOwpEiOJoNNGxU_pb195SbOH5g6kloPiO924yqyucPqENAt0R0tLYTffmqF0LxWpC6XQhl7CAGPDOxY3mJVkVIX9FDeGWBnIU6JyLPwwQoipsu6uQU-v8s-_6w_UrM'
  const socialLinkEntries = Object.entries(socialLinks).filter(([, value]) => Boolean(value))

  if (loading) {
    return <div className="min-h-screen bg-surface text-on-surface">Loading...</div>
  }

  if (!student) {
    return <div>No profile yet. Please complete your profile.</div>
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search mentorships, students, portfolios..."
        userName={userName}
        userRole="Student"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBxvAvrCAKcv0Qo3oOvVSdUvA-5u92JBDVxzA9JbqceXY9lF-4vjFeFJVL2FAUDC1VkvoXSMTGjlCNN315YRT_bsVzx8n5GrqBnQFMQ-ZjuXCxSoOE0qxcKaWeyZgyCKII_WBEofQhnqHiY2GUH6VnFLwziWGUJJKHRpysQv65pu4iNHUzO7-QQgkX3LOpaY-WSE3KIRKJLYXEM1WFOMeSppJS8PBZBKArn94B72OY23XOZE5lADJ9Z-WI8PV6SKhhwwV0Q5lGgC2Q"
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-12 lg:pt-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-headline mt-4 text-4xl font-extrabold tracking-tight">Student Profile</h1>
            <p className="mt-2 text-on-surface-variant">Overview of student details, skills, and campus involvement.</p>
          </div>
          <Link to="/edit-student-profile" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-bold text-primary">
            Edit
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-8">
            <section className="grid gap-8 rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm md:grid-cols-[auto,1fr]">
              <div className="relative mx-auto md:mx-0">
                <div className="h-48 w-48 overflow-hidden rounded-[28px] ring-4 ring-primary-fixed/50">
                  <img className="h-full w-full object-cover" src={profileImage} alt={userName} />
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <h2 className="font-headline text-3xl font-extrabold">{student.name}</h2>
                  <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed-variant">{experiences[0]?.type || 'Student'}</span>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-on-surface-variant md:justify-start">
                  <span>{student.branch}</span>
                  <span>{student.year}</span>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {skills.map((tag) => (
                    <span key={tag} className="rounded-xl bg-surface-container-low px-4 py-2 text-xs font-medium text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">About</h3>
              <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
                {student.bio || 'No bio added yet.'}
              </p>
            </section>

            <section>
              <h3 className="font-headline px-2 text-2xl font-bold">Experience / Works In</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {studentCommittees.map((committee) => {
                  const committeeId = committee.id || committee._id
                  const committeeExperience = experiences.find(experience =>
                    String(experience?.committee_id) === String(committeeId)
                  )

                  return (
                    <article key={committeeId} className="rounded-[24px] border border-outline-variant/10 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">{(committee.name || committee.committee_name || 'C').slice(0, 1)}</div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{committeeExperience?.type || 'Committee'}</span>
                      </div>
                      <h4 className="font-headline text-xl font-bold">{committee.name || committee.committee_name}</h4>
                      <p className="mt-1 text-sm text-on-surface-variant">{committeeExperience?.role || 'Member'}{committeeExperience?.duration ? ` - ${committeeExperience.duration}` : ''}</p>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">Social Links</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinkEntries.map(([label, value]) => (
                  <a key={label} className="rounded-full bg-primary-fixed/30 px-4 py-2 text-xs font-semibold text-on-primary-fixed-variant" href={value} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8 xl:col-span-4">
            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">Academic Info</h3>
              <div className="mt-8 space-y-6">
                {[
                  ['Branch', student.branch],
                  ['Year', student.year],
                  ['Class Division', student.class_division || student.division || ''],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">{label}</p>
                    <p className="mt-1 font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">Skills & Interests</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {skills.map((item) => (
                  <span key={item} className="rounded-full bg-primary-fixed/30 px-4 py-2 text-xs font-semibold text-on-primary-fixed-variant">{item}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span key={item} className="rounded-full bg-primary-fixed/30 px-4 py-2 text-xs font-semibold text-on-primary-fixed-variant">{item}</span>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">Resume</h3>
              <div className="mt-6">
                {student.resume_url ? (
                  <a className="rounded-full bg-primary-fixed/30 px-4 py-2 text-xs font-semibold text-on-primary-fixed-variant" href={student.resume_url} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
