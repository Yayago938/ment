import { useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastProvider'

const STORAGE_KEY = 'mentorlink:saved-items'

const readSavedItems = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export default function SaveItemButton({
  itemKey,
  className = '',
  iconClassName = 'text-[18px]',
  onClick,
}) {
  const { showToast } = useToast()
  const initialSaved = useMemo(() => {
    if (!itemKey) {
      return false
    }

    return Boolean(readSavedItems()[itemKey])
  }, [itemKey])
  const [saved, setSaved] = useState(initialSaved)

  useEffect(() => {
    setSaved(initialSaved)
  }, [initialSaved])

  const handleClick = event => {
    event.preventDefault()
    event.stopPropagation()

    if (!itemKey) {
      showToast('Saved successfully')
      onClick?.(event, true)
      return
    }

    const savedItems = readSavedItems()
    const nextSaved = !saved

    if (nextSaved) {
      savedItems[itemKey] = true
      showToast('Saved successfully')
    } else {
      delete savedItems[itemKey]
      showToast('Removed from saved items')
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems))
    setSaved(nextSaved)
    onClick?.(event, nextSaved)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove saved item' : 'Save item'}
      className={`premium-button premium-glow inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out active:scale-[0.98] ${saved ? 'bg-primary-fixed text-primary ring-1 ring-primary/10 hover:bg-primary-fixed/90 hover:shadow-md hover:-translate-y-0.5' : 'bg-white/90 text-on-surface-variant hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white hover:text-primary hover:shadow-md'} ${className}`}
    >
      <span className={`material-symbols-outlined ${iconClassName}`}>
        {saved ? 'bookmark' : 'bookmark_add'}
      </span>
    </button>
  )
}
