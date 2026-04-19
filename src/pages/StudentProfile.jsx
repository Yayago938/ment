import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FaLinkedin, FaGithub, FaGlobe, FaInstagram } from "react-icons/fa"
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import Loader from '../components/Loader'
import {
  createStudentProfile,
  getOneStudent,
  normalizeStudentResponse,
} from '../api/authApi'
import { getAllCommittees } from '../api/committeeApi'

const STUDENT_EMPTY = 'Not added'
const DEFAULT_PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI-bw3VtCpIIjSBLpU7BOOjlBqnxIby2i1O-xugAAznZQoRzfyZZySvtQL6m7_IqgAobQ7awNjd3dagTgi4UYq5MhzTQlO6uD_YQZDvMI9lNxHithFKTCViTuBpXUg7v82HvcWjfr2MiXgKOwpEiOJoNNGxU_pb195SbOH5g6kloPiO924yqyucPqENAt0R0tLYTffmqF0LxWpC6XQhl7CAGPDOxY3mJVkVIX9FDeGWBnIU6JyLPwwQoipsu6uQU-v8s-_6w_UrM'

// ---------- HELPERS ----------
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
      return JSON.parse(value)
    } catch {
      return []
    }
  }
  return []
}

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

const buildFallbackStudent = studentId => ({
  auth_id: studentId || '',
  name: localStorage.getItem('userName') || 'Student',
  college_email: localStorage.getItem('userEmail') || '',
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
  experience: [],
})

const displayValue = v =>
  v === null || v === undefined || v === '' ? STUDENT_EMPTY : v

const getExperienceDisplay = exp => ({
  title: exp?.title || exp?.organization || '',
  role: exp?.role || '',
})

// ---------- COMPONENT ----------
export default function StudentProfile() {
  const { id } = useParams()
  const location = useLocation()
  const [student, setStudent] = useState(null)
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)
  const isPublicProfile = Boolean(id)

  useEffect(() => {
    const fetchData = async () => {
      const studentId = id || localStorage.getItem('studentId')
      const fallback = buildFallbackStudent(studentId)
      const routedStudent = location.state?.student

      const [cRes, sRes] = await Promise.allSettled([
        getAllCommittees(),
        getOneStudent(studentId),
      ])

      if (cRes.status === 'fulfilled') {
        setCommittees(normalizeCommittees(cRes.value))
      }

      let studentData =
        sRes.status === 'fulfilled'
          ? normalizeStudentResponse(sRes.value)
          : routedStudent || null

      if (!studentData && !isPublicProfile && sRes.status === 'rejected') {
        try {
          const created = await createStudentProfile(
            buildCreateStudentPayload(studentId)
          )
          studentData = normalizeStudentResponse(created)
        } catch {}
      }

      setStudent({ ...fallback, ...studentData })
      setLoading(false)
    }

    fetchData()
  }, [id, isPublicProfile, location.state])

  const skills = normalizeArrayField(student?.skills)
  const interests = normalizeArrayField(student?.interests_hobbies)
  const experiences = normalizeExperience(student?.experience)
  const socialLinks = normalizeObjectField(student?.social_links)
  const socialEntries = Object.entries(socialLinks)

  const userName = student?.name || 'Student'
  const profileImage =
    student?.profile_picture_url || DEFAULT_PROFILE_IMAGE

  
  const infoRows = [
    ['College Email', student?.email],
    ['Phone Number', student?.phone_number],
    ['SAP ID', student?.sap_id],
    ['Roll No', student?.roll_no],
    ['Branch', student?.branch],
    ['Year', student?.year],
    ['Class Division', student?.class_division],
  ]

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-surface">
      <StudentSidebar />

      <TopBar
        sidebar="student"
        hideSearch={true}
        userName={userName}
        userRole="Student"
        userImage={profileImage}
      />

      <main className="lg:ml-64 p-6 pt-24 min-h-screen overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
        <div>
        <h1 className="text-2xl font-bold">Student Profile</h1>
         <p className="text-gray-500 text-sm">
          Overview of student details
         </p>
        </div>

       {!isPublicProfile && (
        <Link
          to="/edit-student-profile"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          Edit Profile
        </Link>
       )}
      </div>
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="col-span-8 space-y-6">

            {/* PROFILE */}
            <section className="flex gap-6 items-center bg-white p-6 rounded-3xl shadow">
              <img
                src={profileImage}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  {displayValue(student?.name)}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {displayValue(student?.branch)} •{' '}
                  {displayValue(student?.year)}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {skills.length > 0
                    ? skills.map(s => (
                        <span
                          key={s}
                          className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs"
                        >
                          {s}
                        </span>
                      ))  
                    : STUDENT_EMPTY}
                </div>
              </div>
            </section>

            {/* ABOUT */}
            <section className="bg-white p-6 rounded-3xl shadow">
              <h3 className="font-semibold text-lg">About</h3>
              <p className="mt-2 text-gray-600">
                {displayValue(student?.bio)}
              </p>
            </section>

            {/* BASIC INFO (ADDED ABOVE EXPERIENCE) */}
            <section className="bg-white p-5 rounded-3xl shadow-sm">
              <h3 className="font-semibold mb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {infoRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-gray-100 rounded-3xl p-3"
                  >
                    <p className="text-xs text-gray-500">
                      {label}
                    </p>
                    <p className="font-medium text-sm mt-1">
                      {displayValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            
          </div>

          {/* RIGHT */}
          <div className="col-span-4 space-y-6">

            {/* SKILLS */}
            <section className="bg-white p-5 rounded-3xl shadow">
              <h3 className="font-semibold mb-3">
                Skills & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...skills, ...interests].length > 0
                  ? [...skills, ...interests].map(i => (
                      <span
                        key={i}
                        className="bg-purple-100 text-purple-600 px-2 py-1 text-xs rounded-full"
                      >
                        {i}
                      </span>
                    ))
                  : STUDENT_EMPTY}
              </div>
            </section>

            {/* RESUME */}
            <section className="bg-white p-5 rounded-3xl shadow">
              <h3 className="font-semibold mb-3">Resume</h3>
              {student?.resume_url ? (
                <a
                  href={student.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-600"
                >
                  View Resume
                </a>
              ) : (
                STUDENT_EMPTY
              )}
            </section>

            {/* SOCIAL */}
            <section className="bg-white p-5 rounded-3xl shadow">
  <h3 className="font-semibold mb-3">
    Social Links
  </h3>

  {socialEntries.length > 0 ? (
    <div className="flex gap-4 text-xl">
      
      {student.social_links?.linkedin && (
        <a href={student.social_links?.linkedin} target="_blank" rel="noreferrer">
          <FaLinkedin className="text-blue-600 hover:scale-110 transition" />
        </a>
      )}

      {student.social_links?.github && (
        <a href={student.social_links?.github} target="_blank" rel="noreferrer">
          <FaGithub className="hover:scale-110 transition" />
        </a>
      )}

      {student.social_links?.portfolio && (
        <a href={student.social_links?.portfolio} target="_blank" rel="noreferrer">
          <FaGlobe className="hover:scale-110 transition" />
        </a>
      )}

      {student.social_links?.instagram && (
        <a href={student.social_links?.instagram} target="_blank" rel="noreferrer">
          <FaInstagram className="text-pink-500 hover:scale-110 transition" />
        </a>
      )}

    </div>
  ) : (
    STUDENT_EMPTY
  )}
</section>
            {/* EXPERIENCE */}
            <section className="bg-white p-6 rounded-3xl shadow">
              <h3 className="font-semibold text-lg mb-4">
                Experience
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {experiences.length > 0
                  ? experiences.map((exp, i) => {
                      const d = getExperienceDisplay(exp)
                      return (
                        <div
                          key={i}
                          className="bg-gray-100 p-4 rounded-3xl"
                        >
                          <p className="font-semibold">
                            {displayValue(d.title)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {displayValue(d.role)}
                          </p>
                        </div>
                      )
                    })
                  : STUDENT_EMPTY}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
