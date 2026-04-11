import CommitteeSidebar from '../components/CommitteeSidebar'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const notifications = [
  {
    title: 'New mentor message',
    detail: 'Elena Rodriguez shared feedback on your portfolio.',
    time: '2m ago',
    tone: 'bg-primary-fixed text-on-primary-fixed-variant',
  },
  {
    title: 'Event registration confirmed',
    detail: 'You are booked for Portfolio Review Night.',
    time: '1h ago',
    tone: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  },
  {
    title: 'Application update',
    detail: 'Your Creative Guild application moved to Reviewing.',
    time: 'Yesterday',
    tone: 'bg-surface-container-high text-on-surface-variant',
  },
]

export default function Notifications({ variant = 'student' }) {
  const isCommittee = variant === 'committee'

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {isCommittee ? <CommitteeSidebar /> : <StudentSidebar />}
      <TopBar
        sidebar={isCommittee ? 'committee' : 'student'}
        placeholder="Search notifications..."
        userName={isCommittee ? 'Alex Rivera' : 'Alex Rivera'}
        userRole={isCommittee ? 'Committee Lead' : 'Student'}
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBpnlTjpqYIsCoZ5khwkRrFm8_emkxZGSfsWQtl_6IdianwZU7Za24L8fsTlufqaghErqy1IKVItEGcwE4v5qH6_FQW84epxB0e5AsMJVot1T2rOPtXrH--WUv3MH8k5y6QcDf-L_01oVI6aSLzglmGpr6WYngyOJycmJbFB80AfRa6Y2rBj0qsHZO96vrnNhNrwmw-mDxvN6Np0pn119Ewhv132eUndE6nkNQB6djZUgap2v_dR42L4s-ZkengTiC0pCSn9AqB8_4"
        actions={[]}
      />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-28">
        <section className="mx-auto max-w-4xl">
          <span className="rounded-full bg-primary-fixed px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">
            Notifications
          </span>
          <h1 className="font-headline mt-6 text-4xl font-extrabold tracking-tight">
            {isCommittee ? 'Committee Updates' : 'Your Updates'}
          </h1>
          <p className="mt-3 text-on-surface-variant">
            Keep track of the latest activity and follow-ups in your MentorLink inbox.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-4xl space-y-4">
          {notifications.map((item) => (
            <article key={item.title} className="rounded-[24px] border border-outline-variant/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline text-xl font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm text-on-surface-variant">{item.detail}</p>
                </div>
                <span className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${item.tone}`}>
                  {item.time}
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
