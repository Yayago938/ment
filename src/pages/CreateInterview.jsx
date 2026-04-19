import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import { useToast } from '../components/ToastProvider'
import { createInterview } from '../api/interviewApi'

const initialQuestion = {
  id: crypto.randomUUID(),
  question: '',
  type: 'text',
  required: true,
  optionsText: '',
}

const buildQuestions = (questions) =>
  questions
    .map(q => q.question?.trim())
    .filter(Boolean)

export default function CreateInterview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const committeeId = id
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [initialQuestion],
  })
  const [loading, setLoading] = useState(false)

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: crypto.randomUUID(),
          question: '',
          type: 'text',
          required: true,
          optionsText: '',
        },
      ],
    }))
  }

  const handleQuestionChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }))
  }

  const removeQuestion = id => {
    setFormData(prev => ({
      ...prev,
      questions:
        prev.questions.length === 1
          ? prev.questions
          : prev.questions.filter(q => q.id !== id),
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (loading) {
      return
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Title and description required')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        committee_id: committeeId,
        questions: buildQuestions(formData.questions),
      }

      if (payload.questions.length === 0) {
        showToast('At least one valid question is required')
        setLoading(false)
        return
      }

      console.log('FINAL INTERVIEW PAYLOAD:', payload)

      await createInterview(payload)
      showToast('Interview created successfully')
      navigate(`/committee/${committeeId}`)
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to create interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />

      <main className="ml-0 min-h-screen flex-1 px-4 py-6 pb-20 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:ml-64 lg:pb-0 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl md:text-4xl">Create Interview</h1>
              <p className="mt-2 text-lg text-on-surface-variant">Build a new committee interview flow for applicants.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="w-full rounded-full border border-outline-variant/20 px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/5 sm:w-auto"
                type="button"
                onClick={() => navigate(`/committee/${committeeId}`)}
              >
                Discard
              </button>
              <button
                className="w-full rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] sm:w-auto"
                type="submit"
                form="create-interview-form"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Interview'}
              </button>
            </div>
          </header>

          <form id="create-interview-form" className="space-y-12" onSubmit={handleSubmit}>
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
                      type="text"
                      placeholder="e.g. Product Design Mentor Screening"
                      className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface placeholder:text-outline transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">notes</span>
                  <h2 className="text-xl font-bold tracking-tight">Description</h2>
                </div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Interview Description</label>
                <textarea
                  placeholder="Describe the interview process, expectations, and what applicants should prepare."
                  className="w-full resize-none rounded-[28px] border-none bg-surface-container-low px-6 py-4 text-on-surface focus:bg-white focus:ring-2 focus:ring-primary"
                  rows="8"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
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
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex w-full items-center gap-2 font-bold text-primary sm:w-auto"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.questions.map(q => (
                    <div key={q.id} className="rounded-[28px] border border-outline-variant/10 bg-surface-container-low p-6">
                      <input
                        value={q.question}
                        onChange={(e) => handleQuestionChange(q.id, 'question', e.target.value)}
                        className="w-full rounded-full bg-white px-6 py-3"
                        placeholder="Question text"
                      />

                      <select
                        value={q.type}
                        onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value)}
                        className="mt-3 w-full rounded-full bg-white px-6 py-3"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                      </select>

                      <label className="mt-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) =>
                            handleQuestionChange(q.id, 'required', e.target.checked)
                          }
                        />
                        Required
                      </label>

                      {['select', 'radio', 'checkbox'].includes(q.type) && (
                        <input
                          value={q.optionsText}
                          onChange={(e) =>
                            handleQuestionChange(q.id, 'optionsText', e.target.value)
                          }
                          placeholder="Option1, Option2"
                          className="mt-3 w-full rounded-full bg-white px-6 py-3"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="mt-3 text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  )
}
