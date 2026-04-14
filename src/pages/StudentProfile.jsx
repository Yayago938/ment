import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import { getOneStudent } from '../api/authApi'
import { getAllCommittees } from '../api/committeeApi'
import api from '../api/axios'

/* ---------------- NORMALIZERS ---------------- */

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
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.committees)) return response.committees
  if (Array.isArray(response?.data?.committees)) return response.data.committees
  return []
}

const normalizeArrayField = value => {
  if (Array.isArray(value)) return value

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed)
        ? parsed
        : value.split(',').map(i => i.trim()).filter(Boolean)
    } catch {
      return value.split(',').map(i => i.trim()).filter(Boolean)
    }
  }

  return []
}

const normalizeObjectField = value => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  }

  return {}
}

const normalizeExperience = value => {
  if (Array.isArray(value)) return value

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
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

/* ---------------- COMPONENT ---------------- */

export default function StudentProfile() {
  const [student, setStudent] = useState(null)
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfileData = async () => {
      const studentId = localStorage.getItem('studentId')

      if (!studentId || studentId === 'undefined' || studentId === 'null') {
        setError('Student ID not found. Please sign in again.')
        setLoading(false)
        return
      }

      try {
        // Fetch committees
        const committeesRes = await getAllCommittees()
        setCommittees(normalizeCommittees(committeesRes))

        let studentData = null

        try {
          const studentRes = await getOneStudent(studentId)
          studentData = normalizeStudent(studentRes)
        } catch (err) {
          console.warn("Student fetch failed, trying create...", err)

          if (err.response?.status === 404 || err.response?.status === 500) {
            try {
              const created = await api.post('/create-student', {
              auth_id: studentId,
              name: localStorage.getItem('userName') || 'Student',
             email: localStorage.getItem('userEmail') || '',
             skills: [],
             interests_hobbies: [],
             social_links: {},
             existing_committee_id: [],
             experience: [],
              })

              studentData = normalizeStudent(created)
            } catch (createErr) {
              console.error("Create failed:", createErr)
              setStudent(buildFallbackStudent())
              return
            }
          } else {
            throw err
          }
        }

        setStudent(studentData || buildFallbackStudent())

      } catch (error) {
        console.error('Failed to load student profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  /* ---------------- DERIVED ---------------- */

  const skills = normalizeArrayField(student?.skills)
  const interests = normalizeArrayField(student?.interests_hobbies)
  const experiences = normalizeExperience(student?.experience)
  const socialLinks = normalizeObjectField(student?.social_links)

  const studentCommitteeIds = Array.isArray(student?.existing_committee_id)
    ? student.existing_committee_id
    : []

  const studentCommittees = useMemo(
  () =>
    committees.filter(c => {
      const committeeId = c.id || c._id
      return studentCommitteeIds.some(id => String(id) === String(committeeId))
    }),
  [committees, studentCommitteeIds]
)

  const userName = student?.name || 'Student'

  const profileImage =
    student?.profile_picture_url ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI-bw3VtCpIIjSBLpU7BOOjlBqnxIby2i1O-xugAAznZQoRzfyZZySvtQL6m7_IqgAobQ7awNjd3dagTgi4UYq5MhzTQlO6uD_YQZDvMI9lNxHithFKTCViTuBpXUg7v82HvcWjfr2MiXgKOwpEiOJoNNGxU_pb195SbOH5g6kloPiO924yqyucPqENAt0R0tLYTffmqF0LxWpC6XQhl7CAGPDOxY3mJVkVIX9FDeGWBnIU6JyLPwwQoipsu6uQU-v8s-_6w_UrM'

  const socialLinkEntries = Object.entries(socialLinks).filter(([, v]) => Boolean(v))

  /* ---------------- UI ---------------- */

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
        userImage={profileImage}
      />

      {/* ✅ EVERYTHING BELOW IS UNTOUCHED UI */}

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

            {/* PROFILE */}
            <section className="grid gap-8 rounded-[28px] border bg-white p-8 shadow-sm md:grid-cols-[auto,1fr]">
              <div className="h-48 w-48 overflow-hidden rounded-[28px]">
                <img className="h-full w-full object-cover" src={profileImage} alt={userName} />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold">{student.name}</h2>
                <div className="mt-4">{student.branch} • {student.year}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* ABOUT */}
            <section className="bg-white p-8 rounded-[28px]">
              <h3 className="text-2xl font-bold">About</h3>
              <p className="mt-4">{student.bio || 'No bio added yet.'}</p>
            </section>

            {/* COMMITTEES */}
            <section>
              <h3 className="text-2xl font-bold">Experience / Works In</h3>

              <div className="grid gap-4 mt-4 md:grid-cols-2">
                {studentCommittees.map((committee) => {
                  const exp = experiences.find(
                    e => String(e?.committee_id) === String(committee.id)
                  )

                  return (
                    <div key={committee.id} className="p-6 bg-white rounded-xl">
                      <h4 className="font-bold">{committee.name}</h4>
                      <p>{exp?.role || 'Member'}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* SOCIAL */}
            <section className="bg-white p-8 rounded-[28px]">
              <h3 className="text-2xl font-bold">Social Links</h3>
              <div className="mt-4 flex gap-2">
                {socialLinkEntries.map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noreferrer">{k}</a>
                ))}
              </div>
            </section>

          </div>
        </div>
 

      </main>
    </div>
  )
}