import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const applications = [
  {
    id: 1,
    title: 'Product Design Internship',
    org: 'Visionary Lab',
    date: 'Applied Oct 08, 2023',
    status: 'Under Review',
    statusStyle: 'bg-surface-container-high text-on-surface-variant',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxjKRTkBGPyCNCV2tP_hlT_CD2OgnZy78_4NXqk9JW16hKlSD5Y_MqpaMNXejh3K5BcFYr5I7Hc_fW7fXQqlHpdBbeDv3qJclEX_8PNI5CG-X9M2DBioXW011vO3ZT-JmAAo3IFpi8D0AEoRl3BMLHgBmdn-Kdosx4Z7qdyUJA66oFQmYTsL00Mbvxh8UV0LYp_kqwiz9dVyxQS4aaRFXFpUaBvGSnTGKTPFCNinud8xgoHQX2HRUfDMIcOH7h8gLCxwgjEP-LQVk',
    imgAlt: 'Abstract tech company logo mark on a clean grey background',
  },
  {
    id: 2,
    title: 'Visual Arts Residency 2024',
    org: 'Metropolitan Arts Council',
    date: 'Applied Oct 12, 2023',
    status: 'Shortlisted',
    statusStyle: 'bg-primary-fixed text-on-primary-fixed-variant',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdepnJF79DeKS8Vd6PfQJDWfd2F8fB4G2jpPpBED-phSCuhBHIustYj1UhGfBS5EOKBEORRghgs6LpZ-jS0kXIll0GlC_TrUzJvOtbPFXb0gYtq1P7gmtZfajuQ5A8s100kVaqxhLefcxlz5ATJnCQtqX00QUzWKh3saAVA0D9pX7ppIck4tzsJSGmyfo7MoIPd8GGSZsypfiYntT2JD1XwWh91Tzs5nLHyeExoaQal3YzI7GGnKkZX1NmcLgdQ8G6dmFzyQc_TXk',
    imgAlt: 'Minimalist art gallery branding logo',
  },
  {
    id: 3,
    title: 'Campus Ambassador Program',
    org: 'Stellar Systems',
    date: 'Applied Oct 15, 2023',
    status: 'Applied',
    statusStyle: 'bg-surface-container-low text-on-surface-variant',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIod_H3jRYNWmeztz7Rmc8kOPYo4K083eO9N9uRXIK43fIOCdtPVKjrISm4P7QQDVVDSdhOOGUdb5MONh8t5pRJWUKDRXYa7eNHSa4Oo3djQh4u4rZaVgokXW04yBhjhD2uNjw8Q7wuokM9zds0-RHqFIJ3zx8JI3gHmYBx1qA0ouLv3kiit1b7FlSKyZYhQMgDnAahf7yDnc8_Txip6aWWwfPZ7cRQvwL0FT4TF31WeqPR1g4kI6C8xRDKNkKXXjCC8bPJ5lvriQ',
    imgAlt: 'Minimal geometric design icon for a software company',
  },
  {
    id: 4,
    title: 'UI/UX Workshop Fellowship',
    org: 'Digital Design Institute',
    date: 'Applied Sept 30, 2023',
    status: 'Accepted',
    statusStyle: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    icon: 'draw',
  },
  {
    id: 5,
    title: 'Research Assistant Opportunity',
    org: 'Social Impact Lab',
    date: 'Applied Sept 15, 2023',
    status: 'Closed',
    statusStyle: 'bg-error-container text-on-error-container',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOL50Cxbj_1O0AazcFZJAMHbDwr2VQhdrYVZsZTGcDJ4Fkiz_3h2dlQqicClUdqnLiGfP6B1W0KOJuXuQ09zFHO_zjloUZNsvnaORi2z6sGXQl5Lb92gumrx-2CZ9Ysdot-T3OxG3PmiRULddV0KvA7zUrCDHCNhdvnKwboM8M0654jfoiRhi1Ddpa__9GnXD4vo8IeNWjjpGtY8rjMgyIsQZ3hf5VIO3mgW4rwzMgGBsbMcb2ENHeWpFc40iDmUDrO43s8jDYItA',
    imgAlt: 'Modern corporate office building aesthetic',
    faded: true,
  },
]

const filterOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Closed']

export default function MyApplications() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? applications
    : applications.filter(a => a.status === activeFilter)

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Nav */}
        <header className="w-full sticky top-0 z-40 glass-header flex justify-between items-center px-8 py-3 shadow-ambient">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm outline-none"
                placeholder="Search applications by title or status..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-3 border-l pl-6 border-outline-variant/30">
              <div className="text-right">
                <p className="text-xs font-bold font-headline">Alex Chen</p>
                <p className="text-[10px] text-on-surface-variant">Design Fellow</p>
              </div>
              <img
                alt="User profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEwLKAATFnd_z7zz4LsxU0IUQhpzoY_Umlo1vEl1wmGVX7MxTi6PgEWfIo_CF35aOYDxT6SgiY35jr9bm_cKlPr1CZGkUf1DaNuaEHcERVfq8HqTFB-Q9fy9sTvYUsoDA1AzC1MoOE1Y749QdYaggJhhmCk9km2Nr9_9PVinwnOPBCWYP78Gcpgvntqp2hFEshBW7_BDJ_6ttsw4VOcrSnvg2rC6GO3JIVTSJ9MQnomX3Pf-Vx0gCdIbt1us_m3JT-mjF86XZQqug"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 space-y-12">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase font-label">Dashboard</span>
              <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface font-headline">My Applications</h1>
              <p className="text-on-surface-variant max-w-md leading-relaxed">
                Track and manage all your submitted applications in one place.
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-4">
              {[
                { icon: 'hourglass_empty', bg: 'bg-primary-fixed', iconColor: 'text-on-primary-fixed-variant', value: '03', label: 'Active Applications' },
                { icon: 'checklist', bg: 'bg-secondary-fixed', iconColor: 'text-on-secondary-fixed-variant', value: '12', label: 'Total Applications' },
                { icon: 'star', bg: 'bg-tertiary-fixed', iconColor: 'text-on-tertiary-fixed-variant', value: '02', label: 'Shortlisted' },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-low px-6 py-4 rounded-lg flex items-center gap-4">
                  <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center rounded-full ${stat.iconColor}`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none font-headline">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider whitespace-nowrap">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Application List (span 8) */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className={`group bg-surface-container-lowest p-6 rounded-lg transition-all hover:translate-x-1 hover:shadow-ambient flex items-center justify-between ${app.faded ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary overflow-hidden ${app.faded ? 'grayscale' : ''}`}>
                      {app.img ? (
                        <img alt={app.imgAlt} className="w-full h-full object-cover" src={app.img} />
                      ) : (
                        <span className="material-symbols-outlined text-4xl">{app.icon}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-headline">{app.title}</h3>
                      <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        {app.org}
                        <span className="w-1 h-1 bg-outline-variant rounded-full inline-block"></span>
                        {app.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${app.statusStyle}`}>
                      {app.status}
                    </span>
                    <button className="p-2 rounded-full hover:bg-surface-container-low text-outline transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar (span 4) */}
            <aside className="col-span-12 lg:col-span-4 space-y-6">
              {/* Filter Card */}
              <div className="bg-surface-container-low p-8 rounded-lg space-y-6">
                <h4 className="font-bold font-headline text-lg">Filter Applications</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        activeFilter === f
                          ? 'bg-primary text-white'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:bg-white border border-outline-variant/10'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <hr className="border-outline-variant/20" />
                <h4 className="font-bold font-headline text-lg">Application Overview</h4>
                <div className="p-4 bg-primary-fixed/30 rounded-2xl border border-primary/5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Update Summary</p>
                  </div>
                  <p className="text-sm leading-relaxed text-on-primary-fixed-variant">
                    You currently have <span className="font-bold text-primary">3 active</span> applications and 1 recently updated status.
                  </p>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-gradient-to-br from-[#7B6EF6] to-[#5545ce] p-8 rounded-lg text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Latest Update</span>
                </div>
                <h4 className="text-xl font-bold mb-2 font-headline">Recent Activity</h4>
                <p className="text-white/90 text-sm mb-6 leading-relaxed">
                  Visual Arts Residency 2024 moved to <span className="font-bold">Shortlisted</span>. Last updated Oct 16, 2023
                </p>
                <button className="w-full py-3 bg-white text-primary rounded-full font-bold text-sm hover:shadow-lg transition-shadow">
                  View Details
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
