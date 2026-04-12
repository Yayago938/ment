import { useNavigate } from 'react-router-dom'

export default function FloatingBackButton({ fallbackTo, className = '' }) {
  const navigate = useNavigate()

  const handleBack = () => {
    const historyIndex = window.history.state?.idx

    if (typeof historyIndex === 'number' && historyIndex > 0) {
      navigate(-1)
      return
    }

    navigate(fallbackTo, { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`fixed left-4 top-24 z-[85] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-on-surface shadow-[0_14px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-colors hover:text-primary lg:left-[18rem] ${className}`}
      aria-label="Go back"
    >
      <span className="material-symbols-outlined">arrow_back</span>
    </button>
  )
}
