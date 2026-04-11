import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const clubs = [
  ['Visual Arts', 'The Minimalist Collective', 'A community focused on reductive design principles and high-fidelity aesthetics.', 'Why: Matches interest in UI Design', 'brush', 'bg-primary-fixed text-primary'],
  ['Dev & Tech', 'Frontend Artisans', 'Crafting pixel-perfect experiences with modern frameworks and smooth interactions.', 'Why: Based on React skill', 'terminal', 'bg-secondary-fixed text-secondary'],
  ['Strategy', 'Cognitive Systems Lab', 'Exploring the intersection of human psychology and digital product hierarchy.', 'Why: Alignment with Psychology Major', 'psychology', 'bg-tertiary-fixed text-tertiary'],
  ['Motion', 'Dynamic Motion Studio', 'Mastering the art of transition, timing, and storytelling through animation.', 'Why: Suggested by Search History', 'movie', 'bg-primary-fixed text-primary'],
]

const people = [
  ['98% Match', 'Dr. Alistair Vance', 'Design Lead', ['Product Design', 'Typography', 'Systems'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmQKeElMg9HF0H48-qWsBxeaXvxj_D3KFreNYF1UKEL3cNSmE_uuEo2DL7kH4IySCXhnvzsEuW_Cp7njqfrqddyt5TXpG1WmV7NnlZCYrEW-s3kPKXI39yPIc3cdCdDJq77vfsViXmTMCa9rLJFESMsI4rk9ryEnUr4odPt0ZMJY8G8l9249UwnzZ76lIG6DdNdxEC4T9Lxhsz9DDbx_i4KS-z6t5uFnYHvB78H7yQxdIgztZ2NNvEArQ4VvNmJ0r9P6er86MxgCE', true],
  ['95% Match', 'Elena Rodriguez', 'Tech Lead', ['React', 'Accessibility', 'Motion'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHWb5qsRRdG8eSAewpm4ittenqdbA_X7gughIekShVe-KJv6DO9a3rozkl7GwdbSfnlJVMNDJATveoiq7UGnOIEbj6R7i11KdW71dqXGTsYODswD50HBfI_IDCnJSeZmtRiy86ZTp3teBhLcz6nUQHR6H-3-KHyHYqXenuNotXI6QooOqd-WSDKCiXtd60bHZWDVhT7CJPvYij-ZHW6tyLmiR_ZcGyYxUIgLpiUzJ1Owv1UV0Ky_WmajJd2bAf6GbaNDe1EumvuRE', false],
  ['92% Match', 'Julian Koster', 'Committee Head', ['Branding', 'Editorial', 'Creative Strategy'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdEi69R4ul3tYdOqmhBknJ4pDkn8-CPmXRgF0dTBtyBswF3ZVlPoYTYYs_3bbCzb-HLg73N4-DC5-YSaqbb4KscLkG7p4GzpDHa6WpF9iL81AmlNveuf9aGE6SEN_0SnoFkGz4XgvE8t6y007kE413Ev1MF5A2lpp1YR6cMkl_hMCTnMup96AuLdfrSmCz1FNBJQD0IijQqti7nc8Xk6b9peklpKrlUZ8vKZyT1p68DkLmtVOvm5qi5RtOjZPNJ0vxDcSsFyEg5Io', false],
]

export default function Recommendations() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search people, skills, or clubs..."
        userName="Alex Rivera"
        userRole="Explorer"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuA_e5YA48CeTVgUXixdFT304tZ_oOiojwLHPErCcZ3hskrWzT9yKGz1vmD67nrSlMQYNis34dlwn0I6mS2mS_CCO-dDnQKnRd6jHuokefySQPPkLml1BlazdAWPw8yleusjtgvXFusjHqS6qygN7YrIYz4Gm00jzdzfjAM-OCByjDEsaXqrEZAIJZKKn_9OxLpmAAjH7WkFI6qAO5qVJoLPjSX9djhRe6BhT-GB_Ru1PocZSHRbIy3D-KePqcDHaqlg4s7wXPU5JHQ"
        actions={['notifications', 'mail']}
      />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:p-12 lg:pt-28">
        <section className="mb-16 max-w-4xl">
          <span className="inline-block rounded-full bg-primary-fixed px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">Your Personal Atelier</span>
          <h1 className="font-headline mt-6 text-5xl font-extrabold tracking-tight lg:text-6xl">Based on your interests, we think you&apos;ll love these.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            We&apos;ve curated a selection of opportunities tailored to your creative trajectory and professional goals. Explore your custom matches.
          </p>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold">Top Recommended Clubs</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-secondary-container" />
            </div>
            <button className="text-sm font-bold text-primary">View all clubs</button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {clubs.map(([category, title, description, reason, icon, tone]) => (
              <article key={title} className="min-w-[20rem] rounded-[28px] bg-white p-6 editorial-shadow transition-transform hover:-translate-y-1">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${tone}`}>
                  <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{category}</span>
                <h3 className="font-headline mt-4 text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{description}</p>
                <div className="mt-5">
                  <span className="rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-fixed-variant">{reason}</span>
                </div>
                <Link
                  to="/committee-detail"
                  className="mt-6 block w-full rounded-full bg-surface-container-low py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary-fixed"
                >
                  Explore Club
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold">Recommended People</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary-container" />
            </div>
            <button className="rounded-full bg-surface-container px-3 py-2 text-sm font-bold text-on-surface-variant">Tune</button>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {people.map(([match, name, role, skills, image, featured]) => (
              <article key={name} className="relative overflow-hidden rounded-[28px] bg-white p-8 editorial-shadow">
                <div className="absolute right-4 top-4 rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">{match}</div>
                <div className="mb-8 flex items-center gap-5">
                  <img className="h-20 w-20 rounded-full border-4 border-surface-container-low object-cover" src={image} alt={name} />
                  <div>
                    <h3 className="font-headline text-xl font-bold">{name}</h3>
                    <p className="text-sm text-on-surface-variant">{role}</p>
                  </div>
                </div>
                <div className="mb-8 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{skill}</span>
                  ))}
                </div>
                <Link
                  to="/profile"
                  className={`block w-full rounded-full py-4 text-center text-sm font-bold transition-colors ${featured ? 'gradient-pill text-white' : 'bg-surface-container-low text-primary hover:bg-primary-fixed'}`}
                >
                  View Profile
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
