import React from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'

export default function CommitteeDetail() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Top Nav — offset by sidebar width */}
      <header className="fixed top-0 left-64 right-0 z-40 glass-header flex justify-between items-center px-8 py-3 shadow-ambient">
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full w-96">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full font-body outline-none"
            placeholder="Search the atelier..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <Link to="/committee/notifications" className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">mail</span>
          </Link>
          <Link to="/committee/profile" className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface font-headline">Alex Mercer</p>
              <p className="text-[10px] uppercase tracking-widest text-outline font-label">Curator</p>
            </div>
            <img
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJI4JkJjgpLTibC8nvFWK4jiLLOLAxygwT1SVT3VjSh_RqvehDDazFqGgwvtjJbXh_8aQgL0akwlWpoPX2mzYhqhqgkfJVvntbyAt-ERZQOS9vq_KL49V5qH0t0lbQUoWmc9BK8yJ0wBgxz15CgQnQNPng_IeLvknvdRnMJVPfKvDITyINEjbY9rlFQBy1aJS3Yv8msZvPFaE2RzfSsbeTAjSd8idpQTnlY-8UBTFr30paqBCJvrtlvEZry-tHdb9U-5K04lgwqDo"
            />
          </Link>
        </div>
      </header>

      {/* Main Content Canvas — padded for sidebar and fixed header */}
      <main className="ml-64 pt-[73px] p-8 bg-surface">

        {/* Hero Section */}
        <section className="relative h-[450px] rounded-xl overflow-hidden mb-12 shadow-xl">
          <img
            className="w-full h-full object-cover"
            alt="Abstract painting of vibrant brushstrokes in purple and pink"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfnGtLMRfhqnyOuutWG0qd6Ox1FOHb9ZPviibiH2nOHsLxlDXcv4k_J340UnOF2sys4iifzuyJxp0xaTKqO2bWBqkqSq-l0mBmsH_cBzxcYdb4gWyiz906wXAYn9i87vy8viFJmMQGtgm8pgpZgXCBnuc4OlhfREyyU2D6jKrwKaYHWZ889nDsMNkj6jHkmNt2U5Uk0HKPszqSKFFgU6R0ujWz4gJuMhsl7NbKvc1DfGcuh643RFL0lGuOP4H6HoJnSns-93-EMWc"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 flex items-end gap-8">
            <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-2xl rotate-[-2deg]">
              <div className="w-full h-full ethereal-gradient rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined filled-icon" style={{ fontSize: '48px' }}>palette</span>
              </div>
            </div>
            <div className="text-white pb-2">
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block">Elite Community</span>
              <h1 className="text-5xl font-extrabold tracking-tighter mb-2 font-headline">The Creative Guild</h1>
              <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">groups</span> 1,240 Members</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> Paris / Remote</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Content (8 cols) */}
          <div className="col-span-8 space-y-12">

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 font-headline">
                <span className="w-8 h-[2px] bg-primary inline-block"></span> About the Guild
              </h2>
              <div className="bg-surface-container-lowest p-10 rounded-lg shadow-[0_20px_40px_rgba(123,110,246,0.05)] border border-outline-variant/10">
                <p className="text-lg text-on-surface-variant leading-relaxed mb-6 font-body">
                  The Creative Guild is a curated collective of designers, builders, and digital creators dedicated to pushing the boundaries of visual storytelling. Our community fosters collaboration, creative exploration, and hands-on learning through projects, events, and leadership opportunities.
                </p>
              </div>
            </section>

            {/* Core Team */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-bold font-headline">Core Leadership</h2>
                <a className="text-primary text-sm font-bold flex items-center gap-1 hover:underline" href="#">
                  View Leadership Team <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Profile Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/5 flex gap-5 hover:-translate-y-1 transition-transform">
                  <img
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    alt="Professional portrait of Marcus Thorne"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvXqQAwzK88_mauMmzHX32S3Zsz80pud-wBpuNrTI5JxNA5YIgtanfPd5kEfXYq0UetSQJ7If1Vwu7NfUM4eZ7bZVPpJC_Ef7kqruNNGXJVfILJhhiYaPnWlWHJX2VEVPRmmHJVhS0jikcnIn_jW6QgfOImogEW8YylnG43RKM1FPupuqXcOUN3FdwjpwS5EYRAs-0mzY2LPoM7cxwXeUIr1OAdSleBXjWo1UONVB9Iyjh-jV2qSBvdXjhklOrnLJ-LDzA2CmesTk"
                  />
                  <div>
                    <h3 className="font-bold text-lg font-headline">Marcus Thorne</h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Head of Design</p>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">12+ years experience in brand architecture and immersive 3D experiences.</p>
                    <div className="flex gap-2">
                      <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold">BRANDING</span>
                      <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold">UI/UX</span>
                    </div>
                  </div>
                </div>
                {/* Profile Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/5 flex gap-5 hover:-translate-y-1 transition-transform">
                  <img
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    alt="Portrait of Elara Vance"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHsZaM4A24oHCgZ4JyQJqjVviJ8tu5R3u5nTxvGR2K-CHLWQ1DsEFX5GHxxnS9UuvOHh_vvm3KUzoZoTm_lfh3wzECECMA7_lie-Z3rQ0f41x8fieQE--S75vr0ESieOokGHOrmimsuZCb4wtbX9ybcmd0hGnUm_DLLAyF_1PEImZ_QkcbiygYKy4qf5vCoQqj0BhqJfHm3GQcH0eW31kMridU2gSYxoDtZVoj42iBx_D6CKd-Tu1FYLxtJHmtOpw_qRpE1wVZ1zw"
                  />
                  <div>
                    <h3 className="font-bold text-lg font-headline">Elara Vance</h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Visual Strategist</p>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">Focusing on ethical design systems and human-centric digital products.</p>
                    <div className="flex gap-2">
                      <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold">STRATEGY</span>
                      <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold">SYSTEMS</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Media Gallery Grid */}
            <section>
              <h2 className="text-2xl font-bold mb-6 font-headline">Gallery Spotlight</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2 row-span-2 h-[400px]">
                  <img className="w-full h-full object-cover rounded-lg" alt="Minimalist architectural photography of a white spiral staircase" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpZChyOAYF6vH5gh3iU0yA8tP2WosGkkFLL_9QlmsAFidXsRZ37vCU4uwCocHOpY3XlFdFK9EUmzHSLvgXiVLlm_0sTBLdof-uF5ipqI81iVRuZh_vaHgYZiWBc7mEdpwDIlWqf_R1It5nvhOybL80vcmv3hUsIRf2zD4XxVVhyZRolbiaigCIWaFWkPIozVUGhlXseLLH1jd2hGKPL61XolqDxfjiS-nVZq-FN22QsCRa-eeFUly9G20jFi_DRHfLLiir_wYwtrM" />
                </div>
                <div className="h-[190px]">
                  <img className="w-full h-full object-cover rounded-lg" alt="Modern computer keyboard with colorful RGB backlighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMg5MYaolfWHnha22B46sK3idG1Ir3TQCc2Gik75WedA_3ISxaDlrXj9XHKwiF0JVO1LeeV5ZC6Wr0VKA01Q2jUAHmeYXdIbXZdATQDl7b8-CbnqjWX-SaMeaNXqKfSQOnIIcqB8cJJzhlCFq6g3EE4ii18KYG04JEN3jnVgo2_q4Og-5wkB4VunoYvylcSgf8fmZA3dyDZ6w6V3ugSq62VgIacnHEOgRCMAeOX23WSdRd0sUAeZkZodJuthhM0oNCh86OWYpUWA" />
                </div>
                <div className="h-[190px]">
                  <img className="w-full h-full object-cover rounded-lg" alt="Aerial view of a design studio with various sketches and color swatches" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPY-thC3VMn6BJL1ygT2AxZTYbtklDsDmbDLEN7-48kLBdFoJCsOOR0Sh1CekrezR3DJT5T_VNtNcb1-Jkq8eiQXjLknvZ6_a6cV1NNPMEvjqP-CqbdRmM31Itf3H3uctzJ7PAL9JCpgA_ByZnXdLsqO0BY60a9f-oylmaoEChUY2VBSUgqVQ6JyjqaJUtvzuPCp8Yy5vWgXKoWfk8KQb67wDiwliRLqCsN3-oeWeIiLYBiYvGCQnuJ1__hCB6AeVWAuiW2JDJR6Y" />
                </div>
                <div className="col-span-2 h-[190px]">
                  <img className="w-full h-full object-cover rounded-lg" alt="Professional workspace setup with dual monitors showing graphic design software" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChfUEc6dVv_ep--TQ5rrHQ2upfXPpyXkFpX5md1Bkmlq1vrEXF13eueT-1_Yyrv_agklbiVOJ3OxX0VyYuiVU8wpIBPv1szbKjOGGqADNK4dcnw4atgllZXRuTvW5DKVOxBkMzYZoHUTLeiqfzuYCSSM2mwvN3DSpLgYxyEZTpGkIwMSC4vBKYDrhgPFV_MrrV789-Di0dWK57LlrQ-9pDRsAG0h4kU9Qj4hLXcYQGI7mGS9aDYxoJR3mkXudBzArRS874pRQ-MVQ" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Actions (4 cols) */}
          <div className="col-span-4 space-y-8">
            {/* Open Roles Card */}
            <section className="bg-surface-container-low p-8 rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">work</span>
                <h2 className="text-xl font-bold font-headline">Open Opportunities</h2>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Junior UX Researcher', detail: 'Full-time • Remote' },
                  { title: 'Motion Design Intern', detail: '3 Months • Paris Studio' },
                  { title: 'Community Manager', detail: 'Contract • Hybrid' },
                ].map((role) => (
                  <div key={role.title} className="bg-white p-5 rounded-lg border border-outline-variant/5 group hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-sm mb-1">{role.title}</h4>
                    <p className="text-xs text-on-surface-variant mb-4">{role.detail}</p>
                    <Link
                      to="/opportunities/product-design-internship"
                      className="block w-full rounded-full border border-primary/20 bg-surface py-2 text-center text-xs font-bold uppercase tracking-wider text-primary transition-colors group-hover:bg-primary group-hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Events Card */}
            <section className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold font-headline">Upcoming</h2>
                <span className="text-[10px] font-bold text-secondary uppercase bg-secondary-container px-2 py-1 rounded">Next 30 Days</span>
              </div>
              <div className="space-y-6">
                {[
                  { month: 'OCT', day: '12', title: 'Portfolio Deconstruction', detail: 'Live Workshop • 6 PM CET', active: true },
                  { month: 'OCT', day: '15', title: 'Design Ethics Forum', detail: 'Webinar • 4 PM CET', active: false },
                  { month: 'OCT', day: '28', title: 'The Guild Annual Meetup', detail: 'Social Event • London', active: false },
                ].map((event) => (
                  <div key={event.title} className="flex gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${event.active ? 'bg-primary-fixed text-primary' : 'bg-surface-container text-on-surface-variant'} rounded-lg flex flex-col items-center justify-center`}>
                      <span className="text-xs font-bold">{event.month}</span>
                      <span className="text-lg font-extrabold leading-tight">{event.day}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{event.title}</h4>
                      <p className="text-xs text-on-surface-variant">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/applications"
                className="w-full mt-8 py-3 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span> Register for Events
              </Link>
            </section>

            {/* Apply CTA Card */}
            <section className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-lg text-white shadow-ambient-lg">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Applications Open</span>
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Join The Guild</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Applications for the Winter 2024 cohort are now open. Spots are limited.</p>
              <Link
                to="/applications"
                className="w-full py-3 bg-white text-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                Apply Now
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
