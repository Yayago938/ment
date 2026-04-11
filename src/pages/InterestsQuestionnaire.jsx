import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const interests = [
  ['ai-ml', 'AI/ML', 'Intelligence Systems', 'neurology'],
  ['ux-design', 'UX Design', 'Human Experience', 'brush'],
  ['fintech', 'Fintech', 'Digital Economy', 'account_balance'],
  ['creative-arts', 'Creative Arts', 'Visual Narratives', 'palette'],
  ['web-arch', 'Web Arch', 'Fullstack Growth', 'code'],
  ['startups', 'Startups', 'Venture Building', 'rocket_launch'],
  ['data-science', 'Data Science', 'Insight Discovery', 'data_exploration'],
  ['leadership', 'Leadership', 'Strategic Impact', 'psychology'],
  ['cybersec', 'Cybersec', 'Digital Defense', 'security'],
  ['marketing', 'Marketing', 'Growth Hacking', 'campaign'],
  ['cloud-sys', 'Cloud Sys', 'Infra Scalability', 'cloud'],
  ['sustainability', 'Sustainability', 'Green Tech', 'eco'],
]

export default function InterestsQuestionnaire() {
  const [selectedInterests, setSelectedInterests] = useState(() => {
    const saved = localStorage.getItem('userInterests')
    return saved ? JSON.parse(saved) : []
  })
  const navigate = useNavigate()

  function toggleInterest(id) {
    setSelectedInterests((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function handleContinue() {
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests))
    navigate('/recommendations')
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-container">
            <span className="material-symbols-outlined text-white">auto_awesome</span>
          </div>
          <span className="font-headline text-2xl font-extrabold tracking-tight">MentorLink</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Step 2 of 5</span>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full w-2/5 bg-gradient-to-r from-primary to-secondary-container" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-8 pb-24 pt-12">
        <div className="mb-16 space-y-4 text-center">
          <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight">
            What are your core <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">interests?</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
            Select the domains where you seek growth. This helps us curate a digital atelier experience tailored to your aspirations.
          </p>
          <p className="text-sm text-on-surface-variant">
            {selectedInterests.length > 0
              ? `${selectedInterests.length} interest${selectedInterests.length > 1 ? 's' : ''} selected`
              : 'Choose at least one interest to personalize your recommendations'}
          </p>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-3 xl:grid-cols-4">
          {interests.map(([id, title, subtitle, icon]) => {
            const isSelected = selectedInterests.includes(id)

            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(id)}
                aria-pressed={isSelected}
                className={`rounded-[24px] border-2 p-6 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-fixed shadow-[0_0_0_2px_#5545ce]'
                    : 'border-transparent bg-surface-container-lowest hover:border-primary-fixed-dim'
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                    isSelected ? 'bg-white text-primary' : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <p className="font-headline text-lg font-bold">{title}</p>
                <p className="mt-1 text-xs text-on-surface-variant">{subtitle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {isSelected ? 'Selected' : 'Tap to choose'}
                  </span>
                  {isSelected ? (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/80 px-8 py-8 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link to="/personalization-intro" className="rounded-full border border-outline-variant px-10 py-4 font-bold text-primary">
            Back
          </Link>
          <button
            type="button"
            onClick={handleContinue}
            className={`rounded-full px-12 py-4 font-bold text-white shadow-[0_20px_40px_rgba(123,110,246,0.2)] ${
              selectedInterests.length > 0
                ? 'bg-gradient-to-r from-primary to-secondary-container'
                : 'pointer-events-none bg-outline-variant'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
