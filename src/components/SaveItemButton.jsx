import { useMemo } from 'react'

export default function SaveItemButton({
  eventId,
  isSaved = false,
  disabled = false,
  className = '',
  iconClassName = 'text-[18px]',
  onToggle,
}) {
  const buttonLabel = useMemo(() => {
    if (disabled) {
      return isSaved ? 'Updating saved event' : 'Saving event'
    }

    return isSaved ? 'Remove saved event' : 'Save event'
  }, [disabled, isSaved])

  const handleClick = event => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled || !eventId) {
      return
    }

    onToggle?.(event)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={buttonLabel}
      disabled={disabled || !eventId}
      className={`premium-button premium-glow inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${isSaved ? 'bg-primary-fixed text-primary ring-1 ring-primary/10 hover:bg-primary-fixed/90 hover:shadow-md hover:-translate-y-0.5' : 'bg-white/90 text-on-surface-variant hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white hover:text-primary hover:shadow-md'} ${className}`}
    >
      <span className={`material-symbols-outlined ${iconClassName}`}>
        {isSaved ? 'bookmark' : 'bookmark_add'}
      </span>
    </button>
  )
}
