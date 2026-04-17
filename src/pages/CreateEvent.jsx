import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { createEvent } from '../api/eventApi'

const initialQuestion = {
  id: crypto.randomUUID(),
  question: '',
  type: 'text',
  required: true,
  optionsText: '',
}

const initialFormData = {
  event_name: '',
  description: '',
  venue: '',
  event_date: '',
  event_time: '',
  tags: '',
  registration_deadline: '',
  questions: [initialQuestion],
}

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

export default function CreateEvent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const committeeId = id || localStorage.getItem('committeeId')
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = event => {
    const { name, value } = event.target

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

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    if (!committeeId) {
      setErrorMessage('Committee ID is missing. Please open this page from your committee dashboard.')
      setIsSubmitting(false)
      return
    }

    const payload = {
      event_name: formData.event_name.trim(),
      description: formData.description.trim(),
      venue: formData.venue.trim(),
      event_date: new Date(formData.event_date).toISOString(),
      event_time: `${formData.event_time}:00`,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      committeeId,
      registration_deadline: new Date(formData.registration_deadline).toISOString(),
      registration_questions: buildRegistrationQuestions(formData.questions),
    }

    try {
      console.log('EVENT PAYLOAD:', payload)

      const res = await createEvent(payload)

      console.log('EVENT CREATED:', res)

      if (res.success) {
        navigate('/committee-dashboard')
      }
    } catch (error) {
      console.log('ERROR:', error.response?.data)
      setErrorMessage(error.response?.data?.message || 'Unable to create event right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />

      <main className="px-8 py-12 lg:ml-64">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Create New Event</h1>
              <p className="mt-2 text-lg text-on-surface-variant">Curate a new mentorship experience for the community.</p>
            </div>
            <div className="flex gap-4">
              <button className="rounded-full border border-outline-variant/20 px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/5" type="button" onClick={() => navigate('/committee-dashboard')}>
                Discard
              </button>
              <button className="rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02]" type="submit" form="create-event-form" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </header>

          <form id="create-event-form" className="space-y-12" onSubmit={handleSubmit}>
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
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">quiz</span>
                    <h2 className="text-xl font-bold tracking-tight">Registration Questions</h2>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-bold text-primary hover:underline" type="button" onClick={addQuestion}>
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
                          onChange={event => handleQuestionChange(question.id, 'question', event.target.value)}
                          className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                          placeholder="Question text"
                          type="text"
                          required
                        />
                        <select
                          value={question.type}
                          onChange={event => handleQuestionChange(question.id, 'type', event.target.value)}
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
                            onChange={event => handleQuestionChange(question.id, 'required', event.target.checked)}
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
                              onChange={event => handleQuestionChange(question.id, 'optionsText', event.target.value)}
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
