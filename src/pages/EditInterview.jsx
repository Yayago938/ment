import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { useToast } from '../components/ToastProvider'
import { getInterviewById, updateInterview } from '../api/interviewApi'

const createQuestion = () => ({
  id: crypto.randomUUID(),
  question: '',
  type: 'text',
  required: true,
  optionsText: '',
})

const buildQuestionsPayload = questions =>
  questions.map((question, index) => ({
    question_text: question.question.trim(),
    type: question.type,
    required: question.required,
    order: index + 1,
    options: ['select', 'radio', 'checkbox'].includes(question.type)
      ? question.optionsText.split(',').map(option => option.trim()).filter(Boolean)
      : [],
  }))

export default function EditInterview() {
  const navigate = useNavigate()
  const { interviewId } = useParams()
  const { showToast } = useToast()
  const committeeId = localStorage.getItem('committeeId')
  const backPath = committeeId ? `/committee/${committeeId}/applications` : '/committee-dashboard'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [createQuestion()],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchInterview = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getInterviewById(interviewId)

        if (!data) {
          throw new Error('Interview not found')
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          questions: (data.questions || []).length > 0
            ? data.questions.map(question => ({
                id: question.id || question._id || crypto.randomUUID(),
                question: question.question_text || '',
                type: question.type || 'text',
                required: question.required ?? true,
                optionsText: question.options?.join(',') || '',
              }))
            : [createQuestion()],
        })
      } catch (error) {
        console.error('Failed to load interview', error)
        const message = error?.response?.data?.message || error.message || 'Unable to load interview details.'
        setErrorMessage(message)
        showToast(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (!interviewId) {
      setErrorMessage('Interview ID is missing.')
      setIsLoading(false)
      return
    }

    fetchInterview()
  }, [interviewId, showToast])

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
      questions: [...prev.questions, createQuestion()],
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

    const normalizedQuestions = formData.questions.filter(question => question.question.trim())

    if (!formData.title.trim() || !formData.description.trim()) {
      const message = 'Title and description are required.'
      setErrorMessage(message)
      showToast(message)
      return
    }

    if (normalizedQuestions.length === 0) {
      const message = 'At least one valid question is required.'
      setErrorMessage(message)
      showToast(message)
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        questions: buildQuestionsPayload(normalizedQuestions),
      }

      await updateInterview(interviewId, payload)
      showToast('Interview updated successfully')
      navigate(backPath)
    } catch (error) {
      console.error('Failed to update interview', error)
      const message = error?.response?.data?.message || 'Failed to update interview'
      setErrorMessage(message)
      showToast(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />

      <main className="ml-0 min-h-screen flex-1 px-4 py-6 pb-20 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:ml-64 lg:pb-0 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl md:text-4xl">Edit Interview</h1>
              <p className="mt-2 text-lg text-on-surface-variant">Update your interview details</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="w-full rounded-full border border-outline-variant/20 px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/5 sm:w-auto"
                type="button"
                onClick={() => navigate(backPath)}
              >
                Discard
              </button>
              <button
                className="w-full rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] sm:w-auto"
                type="submit"
                form="edit-interview-form"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </header>

          <form id="edit-interview-form" className="space-y-12" onSubmit={handleSubmit}>
            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">info</span>
                  <h2 className="text-xl font-bold tracking-tight">General Information</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Interview Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface placeholder:text-outline transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Product Design Mentor Screening"
                      type="text"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">notes</span>
                  <h2 className="text-xl font-bold tracking-tight">About the Interview</h2>
                </div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Detailed Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full resize-none rounded-[28px] border-none bg-surface-container-low px-6 py-4 text-on-surface focus:bg-white focus:ring-2 focus:ring-primary"
                  placeholder="Describe the interview process, expectations, and what applicants should prepare."
                  rows="8"
                  required
                  disabled={isLoading}
                />
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">quiz</span>
                    <h2 className="text-xl font-bold tracking-tight">Questions</h2>
                  </div>
                  <button className="flex w-full items-center gap-1 text-sm font-bold text-primary hover:underline sm:w-auto" type="button" onClick={addQuestion} disabled={isLoading}>
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
                          disabled={isLoading}
                        />
                        <select
                          value={question.type}
                          onChange={event => handleQuestionChange(question.id, 'type', event.target.value)}
                          className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                          disabled={isLoading}
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
                            disabled={isLoading}
                          />
                          Required field
                        </label>
                        <button className="justify-self-end rounded-full p-2 text-error transition-all hover:bg-error/10" type="button" onClick={() => removeQuestion(question.id)} disabled={isLoading || formData.questions.length === 1}>
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
                              disabled={isLoading}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {isLoading ? (
              <p className="rounded-[24px] bg-surface-container-low px-6 py-4 text-sm text-on-surface-variant">Loading interview details...</p>
            ) : null}

            {errorMessage ? (
              <p className="rounded-[24px] bg-rose-50 px-6 py-4 text-sm text-rose-600">{errorMessage}</p>
            ) : null}
          </form>
        </div>
      </main>
    </div>
  )
}
