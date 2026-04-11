import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'

const stats = [
  ['Total Pipeline', '142', '12%', 'Active Applications', 'description', 'text-primary'],
  ['Upcoming', '04', 'This Week', 'Scheduled Events', 'event_available', 'text-secondary'],
  ['Network Size', '892', '', 'Total Mentors & Mentees', 'group', 'text-tertiary'],
]

const applications = [
  ['Marcus Chen', 'Applied for Visual Lead', 'New', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL9b--ORFPfgorc3Fig7xYN55tVOK91Ow0aEWERsjlwiHj5N8fMiXP5MBP5YLf93ob1ihV1hxfscuGzYnWHihJOuqkN6z53diDqGkTuS2QzuViRP6wExB2JbtApG9n-wP59TLcDiEb2JTcyvAh0_ps0ZmQjyICtLX2vqrPZPaNctuCGc5pjImroNfd0A4bnNIMDzIo6Jg5sB9iCeYi53DpnXSLCp9N8l3c9_5SHc0H7ij_7Il5eYiKW-OC_c07MmAA8No4hAcyJ3g', 'bg-primary-fixed text-on-primary-fixed-variant'],
  ['Elena Soros', 'Applied for UX Research Mentor', 'Reviewing', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFhCHSDagrZXCdbGSFEUbvHHc8Qp7BnsFqW0XtYrQ9gNeoYWC8DqD_9Tp7eZZ-2MfkoFOb7yIMGMA486uU_FC6Eg_7dMQ5z23dcmxdgujiNJotYEA2AuMNfngrZqzs315QT4-kf0A_e-6BnbtJW_fnfsKN-jT1o_jhoGut2iLNN9Dg3AOPXR72ZghQbwK00jqvVZxLXZl9u7B9cf_Ujz__j6hQGrtWv0K-Y194i5kQ-oMROUCWmvowgWR00sFdGX-Oxv5HfcsjoUg', 'bg-surface-container-high text-outline'],
  ['Jordan Hayes', 'Applied for Brand Ambassador', 'New', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgjsRj2mhnkefo3PQCbHBzxfph4MQBVPNHkGq7G1RhXsEBcqNIpvIuLZzgKGHgeDeyGYjd2GFpayE9L8fc-2TL52Lwwx_TXPr4cZO6zBHIW-m_hS1k9BDL-7UIDw2iWvh6W-tqYmIdoTj7ZzIA6YPg-WEyCWv8AohCvJkxnDS_3lZDkbJbalpbXeejgk70EaWBSpoytKA3EoKPVFBXn5k6Ov-45VLFr3VN50IZ_7J3E3FrfW8B8ZO21RM2pUKHlAPThzSmobHftvI', 'bg-primary-fixed text-on-primary-fixed-variant'],
]

export default function CommitteeDashboard() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />
      <TopBar
        sidebar="committee"
        placeholder="Search applications..."
        userName="Alex Rivera"
        userRole="Committee Lead"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
        actions={['notifications', 'settings']}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-10 lg:pt-24">
        <section>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight">Welcome back, Alex.</h1>
          <p className="mt-2 text-lg text-on-surface-variant">The atelier has 12 pending applications and 3 events this week.</p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {stats.map(([eyebrow, value, chip, caption, icon, tone]) => (
            <article key={eyebrow} className="relative overflow-hidden rounded-[28px] border border-outline-variant/10 bg-white p-8 editorial-shadow">
              <span className={`block text-[10px] font-bold uppercase tracking-[0.24em] ${tone}`}>{eyebrow}</span>
              <div className="mt-4 flex items-end gap-3">
                <h2 className="font-headline text-5xl font-extrabold">{value}</h2>
                {chip ? <span className="mb-2 rounded-full bg-secondary-container px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">{chip}</span> : null}
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">{caption}</p>
              <MaterialIcon className={`absolute -bottom-2 right-0 text-8xl opacity-10 ${tone}`}>{icon}</MaterialIcon>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-10 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="flex items-end justify-between">
              <h2 className="font-headline text-3xl font-bold">Recent Applications</h2>
              <button className="text-sm font-semibold text-primary">View all</button>
            </div>

            <div className="space-y-4">
              {applications.map(([name, role, status, image, statusTone]) => (
                <article key={name} className="flex items-center justify-between rounded-[24px] border border-transparent bg-white p-6 transition-all hover:translate-x-1 hover:border-primary/10">
                  <div className="flex items-center gap-5">
                    <img className="h-12 w-12 rounded-full object-cover" src={image} alt={name} />
                    <div>
                      <h3 className="font-bold">{name}</h3>
                      <p className="text-xs text-on-surface-variant">{role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${statusTone}`}>{status}</span>
                    <MaterialIcon className="text-outline">chevron_right</MaterialIcon>
                  </div>
                </article>
              ))}
            </div>

            <article className="rounded-[28px] border border-outline-variant/10 bg-surface-container-low p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-headline text-2xl font-bold">Growth &amp; Insights</h3>
                <select className="bg-transparent text-xs font-bold text-primary outline-none">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="flex h-56 items-end gap-4 px-4">
                {[24, 32, 28, 40, 36, 44].map((height, index) => (
                  <div key={height} className="flex flex-1 flex-col items-center gap-3">
                    <div className={`w-full rounded-t-2xl ${index === 5 ? 'bg-primary' : 'bg-primary-fixed'} transition-colors`} style={{ height: `${height * 4}px` }} />
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${index === 5 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-8">
            <h2 className="font-headline text-3xl font-bold">Next Event</h2>
            <article className="ambient-shadow relative flex h-[28rem] flex-col justify-end overflow-hidden rounded-[32px] p-8 text-white">
              <img className="absolute inset-0 h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDclrmqU_6qblCD-kgD4Ty4AzznzU2hGGoWPp8mv4fU01ZCtpJndw2npWIGrIhKUxyexiFmDVy1Q0jZvj6SSiDCOF78AbpuDFmaWJJwYeJWjBZPvjpWuW8sIdMBz-VQTEWmvZtk0RiRLr2sCFywXsqvRdS5vBlIh2Xo1cMaTktBc46g3YNleHFLy0pQy0sclLwzNBzbMN3LzmuN1vzg0wndQFyI_PPCLT0BVFludc2xZ59e0hK-rxXMz_32vueQxS3JdrpKHZosEoI" alt="Portfolio Review Night" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/20 to-transparent" />
              <div className="relative z-10">
                <span className="rounded-full bg-secondary-container/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">Featured</span>
                <h3 className="font-headline mt-4 text-4xl font-extrabold">Portfolio Review Night</h3>
                <div className="mt-4 flex gap-4 text-sm text-white/80">
                  <span>Oct 24</span>
                  <span>18:30</span>
                </div>
                <button className="mt-6 rounded-full bg-white px-4 py-3 text-sm font-bold text-on-surface">Open Event</button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
