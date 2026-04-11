import { useState } from 'react'
import { createCommittee } from '../api/committeeApi'

const initialFormState = {
  committee_name: '',
  description: '',
  affiliated_faculty_name: '',
  tagline: '',
  start_year: '',
  tags: '',
}

export default function CreateCommitteeForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const payload = {
        committee_name: formData.committee_name.trim(),
        description: formData.description.trim(),
        affiliated_faculty: {
          name: formData.affiliated_faculty_name.trim(),
        },
        tagline: formData.tagline.trim(),
        start_year: formData.start_year ? Number(formData.start_year) : undefined,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
      }

      await createCommittee(payload)
      await onSuccess?.()
      onClose?.()
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to create committee right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/40 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Admin Action</p>
            <h2 className="mt-2 font-headline text-3xl font-extrabold text-slate-900">Create a new committee</h2>
            <p className="mt-2 text-sm text-slate-500">Set up the committee profile and make it available on the admin dashboard immediately.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-3 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close create committee form"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Committee Name</span>
              <input
                required
                name="committee_name"
                value={formData.committee_name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                placeholder="Innovation Council"
                type="text"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tagline</span>
              <input
                required
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                placeholder="Building ideas into campus impact"
                type="text"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Description</span>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[120px] w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              placeholder="Describe the committee's mission, programs, and student impact."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Faculty Lead</span>
              <input
                required
                name="affiliated_faculty_name"
                value={formData.affiliated_faculty_name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                placeholder="Dr. Amelia Hart"
                type="text"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Start Year</span>
              <input
                required
                min="1900"
                max="2100"
                name="start_year"
                value={formData.start_year}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                placeholder="2024"
                type="number"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tags</span>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              placeholder="innovation, leadership, startups"
              type="text"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{errorMessage}</p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-primary to-secondary-container px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Creating Committee...' : 'Create Committee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
