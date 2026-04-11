import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const contributions = [
  ['Design System Core', 'Standardizing accessible components for the campus network.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgzhgn5VuRiNRBg9F_yiClCf_RHId4MENBB1aWiP8P-oGAp7VwrGiwhAMkzI2X1c3eBTWHYu1UJ_lDVnHiZIKZYcmZhzHCaSBz0HusjGLspoq_5D4nY_O1qpCWkgCLnIpEpDsxN4Ia33HGhUiT-vHmMpWglBknYF2FUUPU75_40I-ZgOYyOPgsy548VJ-a4JbEsNTs6hDBS7DaHBPHRgV-hHQAxB5Iwfqu7-D6booZMnTHPwlZJHOIVZrH1-B5BwwB3FyBENrRLUQ'],
  ['Portfolio Hub', 'A centralized platform for student showcases.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXY1Upt4r92fPFbpi_dTXs_CQ1cKds6qZIl4oA5Dxu-qkWVzYPWFGkF8WaAtl6i7eAutTPkHwN-uchkULap60zrNJVR_hjqGaH4i08KTGsAHyDbYfRicA48VyVeDiSGnkpXh4wrlge8ySRtJSKyWv9pFo2OQ3BRtErUn-8gg4YO9pEBx5-s4N3iTgOJ3rk5MPFo1IvUBoqal13pbDGK_RSsF0w5LP-RRQwMUzV3y_jb7UqJgQtOFNCwqRzG6-ny2m-Q2LJ8OuEsrE'],
  ['Mentorship Flow', 'Optimized UX for peer-to-peer learning registrations.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFASP0G-85ePpKLIla6EMqrUj5oRgsksXqY5QqIgFH11ybL4Jh2uicLpwK0JMxiQKYUVEdhjewvJBIWlXeKL_9h4f5MWyVGJ_UALBZ4wzEEwVA9QpR_eHfsvUlx7MX0-kHjJiIJt9KZeovO4BN85xU9pCCMqPmfVat0to0hKrmZnzrbAaeWtWOfZQO-lbPCnc8XlxBdT7flpKdJzNt3a754WN2_PyXNkuSIUfO4lBmwelgYnG_Qt-PrrfaWNjhXh1-iYVqwRcZnrA'],
]

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search mentorships, students, portfolios..."
        userName="Elena Rodriguez"
        userRole="Top Contributor"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBxvAvrCAKcv0Qo3oOvVSdUvA-5u92JBDVxzA9JbqceXY9lF-4vjFeFJVL2FAUDC1VkvoXSMTGjlCNN315YRT_bsVzx8n5GrqBnQFMQ-ZjuXCxSoOE0qxcKaWeyZgyCKII_WBEofQhnqHiY2GUH6VnFLwziWGUJJKHRpysQv65pu4iNHUzO7-QQgkX3LOpaY-WSE3KIRKJLYXEM1WFOMeSppJS8PBZBKArn94B72OY23XOZE5lADJ9Z-WI8PV6SKhhwwV0Q5lGgC2Q"
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-12 lg:pt-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <a className="text-sm font-semibold text-primary" href="/">Back to Explore</a>
          <div className="flex-1">
            <h1 className="font-headline mt-4 text-4xl font-extrabold tracking-tight">Student Profile</h1>
            <p className="mt-2 text-on-surface-variant">Overview of student details, skills, and campus involvement.</p>
          </div>
          <Link to="/profile/edit" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-bold text-primary">
            Edit
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-8">
            <section className="grid gap-8 rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm md:grid-cols-[auto,1fr]">
              <div className="relative mx-auto md:mx-0">
                <div className="h-48 w-48 overflow-hidden rounded-[28px] ring-4 ring-primary-fixed/50">
                  <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI-bw3VtCpIIjSBLpU7BOOjlBqnxIby2i1O-xugAAznZQoRzfyZZySvtQL6m7_IqgAobQ7awNjd3dagTgi4UYq5MhzTQlO6uD_YQZDvMI9lNxHithFKTCViTuBpXUg7v82HvcWjfr2MiXgKOwpEiOJoNNGxU_pb195SbOH5g6kloPiO924yqyucPqENAt0R0tLYTffmqF0LxWpC6XQhl7CAGPDOxY3mJVkVIX9FDeGWBnIU6JyLPwwQoipsu6uQU-v8s-_6w_UrM" alt="Elena Rodriguez" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary-container px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">Top Contributor</div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <h2 className="font-headline text-3xl font-extrabold">Elena Rodriguez</h2>
                  <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed-variant">Committee Head</span>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-on-surface-variant md:justify-start">
                  <span>Computer Science</span>
                  <span>3rd Year</span>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {['UI/UX Design', 'React.js', 'Tailwind CSS'].map((tag) => (
                    <span key={tag} className="rounded-xl bg-surface-container-low px-4 py-2 text-xs font-medium text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">About</h3>
              <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
                Computer Science student passionate about frontend development, design systems, hackathons, and building impactful digital experiences. Currently exploring the intersection of creative design and robust technical implementation.
              </p>
            </section>

            <section>
              <h3 className="font-headline px-2 text-2xl font-bold">Community Involvement</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <article className="rounded-[24px] border border-outline-variant/10 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">Palette</div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Leadership</span>
                  </div>
                  <h4 className="font-headline text-xl font-bold">The Creative Guild</h4>
                  <p className="mt-1 text-sm text-on-surface-variant">Design Lead - 2023 to Present</p>
                </article>
                <article className="rounded-[24px] border border-outline-variant/10 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">Code</div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Competition</span>
                  </div>
                  <h4 className="font-headline text-xl font-bold">Hackathon 2024</h4>
                  <p className="mt-1 text-sm text-on-surface-variant">Participant - Global Web Dev Track</p>
                </article>
              </div>
            </section>

            <section>
              <h3 className="font-headline px-2 text-2xl font-bold">Featured Contributions</h3>
              <div className="mt-4 grid gap-6 rounded-[28px] border border-outline-variant/10 bg-white p-6 shadow-sm md:grid-cols-3">
                {contributions.map(([title, description, image]) => (
                  <article key={title}>
                    <div className="mb-3 h-32 overflow-hidden rounded-2xl">
                      <img className="h-full w-full object-cover" src={image} alt={title} />
                    </div>
                    <h4 className="font-bold">{title}</h4>
                    <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8 xl:col-span-4">
            <section className="rounded-[28px] border border-outline-variant/10 bg-white p-8 shadow-sm">
              <h3 className="font-headline text-2xl font-bold">Academic Info</h3>
              <div className="mt-8 space-y-6">
                {[
                  ['Branch', 'Computer Science & Design'],
                  ['Year', '3rd Year'],
                  ['Class Division', 'A'],
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
                {['Typescript', 'Figma', 'Node.js', 'Illustration', 'Branding', 'Open Source'].map((item) => (
                  <span key={item} className="rounded-full bg-primary-fixed/30 px-4 py-2 text-xs font-semibold text-on-primary-fixed-variant">{item}</span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
