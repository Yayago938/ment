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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-colors ${saved ? 'bg-primary-fixed text-primary' : 'bg-white/90 text-on-surface-variant hover:text-primary'} ${className}`}
    >
      <span className={`material-symbols-outlined ${iconClassName}`}>
        {saved ? 'bookmark' : 'bookmark_add'}
      </span>
    </button>
  )
}
