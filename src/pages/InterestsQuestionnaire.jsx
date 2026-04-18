import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllEvents } from '../api/eventApi'

const INTEREST_OPTIONS = [
  'AI/ML',
  'Web Development',
  'App Development',
  'UI/UX Design',
  'Fintech',
  'Creative Arts',
  'Event Management',
  'Entrepreneurship',
  'Research',
  'Public Speaking',
]

const interestCards = {
  'AI/ML': ['Intelligence Systems', 'neurology'],
  'Web Development': ['Modern Web Craft', 'code'],
  'App Development': ['Mobile Product Building', 'smartphone'],
  'UI/UX Design': ['Human Experience', 'brush'],
  Fintech: ['Digital Economy', 'account_balance'],
  'Creative Arts': ['Visual Narratives', 'palette'],
  'Event Management': ['Campus Production', 'event'],
  Entrepreneurship: ['Venture Building', 'rocket_launch'],
  Research: ['Insight Discovery', 'science'],
  'Public Speaking': ['Stage Presence', 'campaign'],
}

const normalizeEvents = response => {
  const raw = response?.data?.data || response?.data?.events || response?.data || response?.events || []
  return Array.isArray(raw) ? raw : []
}

const normalizeTag = tag => String(tag || '').trim()

export default function InterestsQuestionnaire() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState(() => {
    const saved = localStorage.getItem('studentInterests')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedEventTags, setSelectedEventTags] = useState(() => {
    const saved = localStorage.getItem('studentEventPreferences')
    return saved ? JSON.parse(saved) : []
  })
  const [availableEventTags, setAvailableEventTags] = useState([])
  const [loadingTags, setLoadingTags] = useState(true)

  useEffect(() => {
    const loadEventTags = async () => {
      setLoadingTags(true)

      try {
        const response = await getAllEvents()
        const events = normalizeEvents(response)
        const uniqueTags = Array.from(
          new Set(
            events.flatMap(event =>
              Array.isArray(event?.tags)
                ? event.tags.map(normalizeTag).filter(Boolean)
                : [],
            ),
          ),
        ).sort((left, right) => left.localeCompare(right))

        setAvailableEventTags(uniqueTags)
      } catch (error) {
        console.error('Failed to load event tags for onboarding:', error)
        setAvailableEventTags([])
      } finally {
        setLoadingTags(false)
      }
    }

    loadEventTags()
  }, [])

  const progressWidth = useMemo(() => (step === 1 ? '50%' : '100%'), [step])

  const toggleInterest = interest => {
    setSelectedInterests(current =>
      current.includes(interest)
        ? current.filter(item => item !== interest)
        : [...current, interest],
    )
  }

  const toggleEventTag = tag => {
    setSelectedEventTags(current =>
      current.includes(tag)
        ? current.filter(item => item !== tag)
        : [...current, tag],
    )
  }

  const handleContinue = () => {
    if (step === 1) {
      if (selectedInterests.length === 0) {
        return
      }

      localStorage.setItem('studentInterests', JSON.stringify(selectedInterests))
      setStep(2)
      return
    }

    if (selectedEventTags.length === 0) {
      return
    }

    localStorage.setItem('studentInterests', JSON.stringify(selectedInterests))
    localStorage.setItem('studentEventPreferences', JSON.stringify(selectedEventTags))
    localStorage.setItem('onboardingCompleted', 'true')
    localStorage.removeItem('needsPostSignupOnboarding')
    navigate('/recommendations')
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/login')
      return
    }

    setStep(1)
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
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Step {step} of 2
          </span>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary-container transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-8 pb-28 pt-12">
        <div className="mb-16 space-y-4 text-center">
          <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight">
            {step === 1 ? (
              <>
                What are your core <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">interests?</span>
              </>
            ) : (
              <>
                What type of events <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">would you like to attend?</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
            {step === 1
              ? 'Select the domains where you want to grow so we can recommend the right communities.'
              : 'Choose the event themes that feel most exciting to you based on live tags from current events.'}
          </p>
          <p className="text-sm text-on-surface-variant">
            {step === 1
              ? selectedInterests.length > 0
                ? `${selectedInterests.length} interest${selectedInterests.length > 1 ? 's' : ''} selected`
                : 'Choose at least one interest to continue'
              : selectedEventTags.length > 0
                ? `${selectedEventTags.length} event tag${selectedEventTags.length > 1 ? 's' : ''} selected`
                : 'Choose at least one event tag to continue'}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid w-full gap-4 md:grid-cols-3 xl:grid-cols-4">
            {INTEREST_OPTIONS.map(interest => {
              const isSelected = selectedInterests.includes(interest)
              const [subtitle, icon] = interestCards[interest] || ['Personal Growth', 'interests']

              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
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
                  <p className="font-headline text-lg font-bold">{interest}</p>
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
        ) : (
          <div className="w-full rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_50px_rgba(123,110,246,0.08)]">
            {loadingTags ? (
              <div className="rounded-[24px] bg-surface-container-low px-6 py-10 text-center text-sm text-on-surface-variant">
                Loading event tags...
              </div>
            ) : availableEventTags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {availableEventTags.map(tag => {
                  const isSelected = selectedEventTags.includes(tag)

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEventTag(tag)}
                      className={`rounded-full border px-5 py-3 text-sm font-bold transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white shadow-[0_12px_24px_rgba(85,69,206,0.18)]'
                          : 'border-outline-variant/20 bg-surface-container-low text-on-surface hover:border-primary/25 hover:bg-primary/5'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-[24px] bg-surface-container-low px-6 py-10 text-center text-sm text-on-surface-variant">
                No event tags are available right now. Please try again in a moment.
              </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/80 px-8 py-8 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-outline-variant px-10 py-4 font-bold text-primary"
          >
            {step === 1 ? 'Back to Login' : 'Back'}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={step === 1 ? selectedInterests.length === 0 : selectedEventTags.length === 0 || availableEventTags.length === 0}
            className="rounded-full bg-gradient-to-r from-primary to-secondary-container px-12 py-4 font-bold text-white shadow-[0_20px_40px_rgba(123,110,246,0.2)] disabled:pointer-events-none disabled:opacity-50"
          >
            {step === 1 ? 'Continue' : 'See Recommendations'}
          </button>
        </div>
      </div>
    </div>
  )
}
