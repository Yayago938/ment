import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { updateEvent } from '../api/eventApi'

const normalizeDateInput = value => {
  if (!value) {
    return ''
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return typeof value === 'string' ? value.slice(0, 10) : ''
  }

  return parsedDate.toISOString().slice(0, 10)
}

const normalizeTimeInput = value => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  return value.slice(0, 5)
}

const buildQuestionForForm = question => ({
  id: question?.id || crypto.randomUUID(),
  question: question?.question || '',
  type: question?.type || 'text',
  required: Boolean(question?.required),
  optionsText: Array.isArray(question?.options) ? question.options.join(', ') : '',
})

const buildRegistrationQuestions = questions =>
  questions.map(({ id, question, type, required, optionsText }) => {
    const payloadQuestion = {
      id,
      question: question.trim(),
      type,
      required,
    }

    if (type === 'select' || type === 'radio' || type === 'checkbox') {
      payloadQuestion.options = optionsText
        .split(',')
        .map(option => option.trim())
        .filter(Boolean)
    }

    return payloadQuestion
  })

export default function EditEvent() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const event = state

  const initialFormData = useMemo(() => {
    if (!event) {
      return null
    }

    return {
      event_name: event.event_name || '',
      description: event.description || '',
      venue: event.venue || '',
      event_date: normalizeDateInput(event.event_date),
      event_time: normalizeTimeInput(event.event_time),
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
      committeeId: event.committeeId || localStorage.getItem('committeeId') || '',
      registration_deadline: normalizeDateInput(event.registration_deadline),
      questions: Array.isArray(event.registration_questions) && event.registration_questions.length > 0
        ? event.registration_questions.map(buildQuestionForForm)
        : [
            {
              id: crypto.randomUUID(),
              question: '',
              type: 'text',
              required: true,
              optionsText: '',
            },
          ],
    }
  }, [event])

  const [formData, setFormData] = useState(initialFormData)

  const handleChange = inputEvent => {
    const { name, value } = inputEvent.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleQuestionChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(question =>
        question.id === id
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    }))
  }

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: crypto.randomUUID(),
          question: '',
          type: 'text',
          required: false,
          optionsText: '',
        },
      ],
    }))
  }

  const removeQuestion = id => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.length === 1
        ? prev.questions
        : prev.questions.filter(question => question.id !== id),
    }))
  }

  const handleSubmit = async submitEvent => {
    submitEvent.preventDefault()

    if (!formData || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    const payload = {
      event_name: formData.event_name.trim(),
      description: formData.description.trim(),
      venue: formData.venue.trim(),
      event_date: new Date(formData.event_date).toISOString(),
      event_time: `${formData.event_time}:00`,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      committeeId: formData.committeeId.trim(),
      registration_deadline: new Date(formData.registration_deadline).toISOString(),
      registration_questions: buildRegistrationQuestions(formData.questions),
    }

    try {
      console.log('Updating event:', payload)
      await updateEvent(event?.id || event?._id || eventId, payload)
      navigate(`/committee/${payload.committeeId}/events`)
    } catch (err) {
      console.error('Update failed:', err)
      setErrorMessage(err.response?.data?.message || 'Unable to update event right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen bg-surface text-on-surface">
        <CommitteeSidebar />
        <main className="ml-0 min-h-screen flex-1 px-4 pb-20 pt-24 sm:px-6 md:px-8 lg:ml-64 lg:pb-0 lg:p-10 lg:pt-24">
          <section className="rounded-[28px] bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Event data unavailable</h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Open the edit page from the committee events list so the form can be pre-filled.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/committee/${localStorage.getItem('committeeId') || ''}/events`)}
              className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Events
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <nav className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-white/80 px-4 shadow-[0_20px_40px_rgba(123,110,246,0.08)] backdrop-blur-xl sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
          <span className="bg-gradient-to-r from-[#7B6EF6] to-[#F6A6C1] bg-clip-text font-headline text-2xl font-bold tracking-tight text-transparent">
            Aura Committee
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-8 md:flex">
            <Link className="font-medium text-on-surface-variant transition-colors hover:text-primary" to={`/committee/${formData.committeeId}`}>
              Dashboard
            </Link>
            <Link className="font-medium text-on-surface-variant transition-colors hover:text-primary" to={`/committee/${formData.committeeId}/applications`}>
              Applications
            </Link>
            <Link className="border-b-2 border-primary font-bold text-primary" to={`/committee/${formData.committeeId}/events`}>
              Events
            </Link>
            <Link className="font-medium text-on-surface-variant transition-colors hover:text-primary" to="/committee/profile">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <CommitteeSidebar />

      <main className="ml-0 min-h-screen flex-1 px-4 pb-20 pt-28 sm:px-6 md:px-8 lg:ml-64 lg:pb-0 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl md:text-4xl">Edit Event</h1>
              <p className="mt-2 text-lg text-on-surface-variant">Update details, registration settings, and attendee questions in one place.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="w-full rounded-full border border-outline-variant/20 px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/5 sm:w-auto"
                type="button"
                onClick={() => navigate(`/committee/${formData.committeeId}/events`)}
              >
                Cancel
              </button>
              <button
                className="w-full rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] sm:w-auto"
                type="submit"
                form="edit-event-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </header>

          <form id="edit-event-form" className="space-y-12" onSubmit={handleSubmit}>
            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">info</span>
                  <h2 className="text-xl font-bold tracking-tight">General Information</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Event Title</label>
                    <input
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleChange}
                      className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface placeholder:text-outline transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Design Leadership Summit 2024"
                      type="text"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</label>
                    <input name="event_date" value={formData.event_date} onChange={handleChange} className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="date" required />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Start Time</label>
                    <input name="event_time" value={formData.event_time} onChange={handleChange} className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="time" step="1" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Location or Platform Link</label>
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary">location_on</span>
                      <input name="venue" value={formData.venue} onChange={handleChange} className="w-full rounded-full border-none bg-surface-container-low py-4 pl-14 pr-6 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" placeholder="Enter physical address or virtual meeting link" type="text" required />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Committee ID</label>
                    <input name="committeeId" value={formData.committeeId} onChange={handleChange} className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" placeholder="Committee UUID" type="text" required />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tags</label>
                    <input name="tags" value={formData.tags} onChange={handleChange} className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" placeholder="design, workshop, leadership" type="text" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">notes</span>
                  <h2 className="text-xl font-bold tracking-tight">About the Event</h2>
                </div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Detailed Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full resize-none rounded-[28px] border-none bg-surface-container-low px-6 py-4 text-on-surface focus:bg-white focus:ring-2 focus:ring-primary" placeholder="Tell potential attendees what they can expect from this session..." rows="8" required />
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">confirmation_number</span>
                  <h2 className="text-xl font-bold tracking-tight">Registration Settings</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Registration Deadline</label>
                    <input name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="date" required />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">quiz</span>
                    <h2 className="text-xl font-bold tracking-tight">Registration Questions</h2>
                  </div>
                  <button className="flex w-full items-center gap-1 text-sm font-bold text-primary hover:underline sm:w-auto" type="button" onClick={addQuestion}>
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.questions.map(question => (
                    <div key={question.id} className="rounded-[28px] border border-outline-variant/10 bg-surface-container-low p-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={question.question}
                          onChange={inputEvent => handleQuestionChange(question.id, 'question', inputEvent.target.value)}
                          className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                          placeholder="Question text"
                          type="text"
                          required
                        />
                        <select
                          value={question.type}
                          onChange={inputEvent => handleQuestionChange(question.id, 'type', inputEvent.target.value)}
                          className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                        >
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="radio">Radio</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <label className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                          <input
                            checked={question.required}
                            onChange={inputEvent => handleQuestionChange(question.id, 'required', inputEvent.target.checked)}
                            type="checkbox"
                          />
                          Required field
                        </label>
                        <button className="justify-self-end rounded-full p-2 text-error transition-all hover:bg-error/10" type="button" onClick={() => removeQuestion(question.id)} disabled={formData.questions.length === 1}>
                          <span className="material-symbols-outlined">delete_outline</span>
                        </button>
                        {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') ? (
                          <div className="md:col-span-2">
                            <input
                              value={question.optionsText}
                              onChange={inputEvent => handleQuestionChange(question.id, 'optionsText', inputEvent.target.value)}
                              className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                              placeholder="Options separated by commas"
                              type="text"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {errorMessage ? (
              <p className="rounded-[24px] bg-rose-50 px-6 py-4 text-sm text-rose-600">{errorMessage}</p>
            ) : null}
          </form>
        </div>
      </main>
    </div>
  )
}
