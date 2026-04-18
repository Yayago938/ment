import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteSavedEvent, getSavedEvents, saveEvent } from '../api/eventApi'
import { useToast } from '../components/ToastProvider'

const asArray = value => {
  if (Array.isArray(value)) {
    return value
  }

  return []
}

const getResponseCollection = payload => {
  const candidates = [
    payload,
    payload?.data,
    payload?.data?.data,
    payload?.data?.savedEvents,
    payload?.data?.saved_events,
    payload?.savedEvents,
    payload?.saved_events,
    payload?.events,
  ]

  return candidates.find(Array.isArray) || []
}

const toDateValue = value => {
  if (!value) {
    return 0
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

export const normalizeSavedEvent = savedItem => {
  if (!savedItem) {
    return null
  }

  const nestedEvent = savedItem.event || savedItem.savedEvent || savedItem
  const eventId =
    nestedEvent?.id ||
    nestedEvent?._id ||
    nestedEvent?.eventId ||
    nestedEvent?.event_id ||
    savedItem?.eventId ||
    savedItem?.event_id

  if (!eventId) {
    return null
  }

  return {
    saveId: savedItem?.id || savedItem?._id || savedItem?.saveId || `${eventId}-saved`,
    eventId,
    event_name: nestedEvent?.event_name || nestedEvent?.title || nestedEvent?.name || 'Untitled Event',
    description: nestedEvent?.description || nestedEvent?.summary || '',
    venue: nestedEvent?.venue || nestedEvent?.location || nestedEvent?.event_location || '',
    event_date: nestedEvent?.event_date || nestedEvent?.date || nestedEvent?.startDate || nestedEvent?.start_date || '',
    event_time: nestedEvent?.event_time || nestedEvent?.time || '',
    registration_deadline: nestedEvent?.registration_deadline || nestedEvent?.deadline || '',
    tags: asArray(nestedEvent?.tags),
    requires_registration:
      typeof nestedEvent?.requires_registration === 'boolean'
        ? nestedEvent.requires_registration
        : Boolean(nestedEvent?.requiresRegistration),
    committeeId:
      nestedEvent?.committeeId ||
      nestedEvent?.committee_id ||
      nestedEvent?.committee?.id ||
      nestedEvent?.committee?._id ||
      null,
    image_url: nestedEvent?.image_url || nestedEvent?.image || nestedEvent?.event_image || nestedEvent?.poster_url || null,
    raw: savedItem,
  }
}

const normalizeSaveCandidate = event => {
  if (!event) {
    return null
  }

  return normalizeSavedEvent({ event, id: `optimistic-${Date.now()}` })
}

export default function useSavedEvents({ autoLoad = true } = {}) {
  const { showToast } = useToast()
  const [savedEvents, setSavedEvents] = useState([])
  const [loading, setLoading] = useState(autoLoad)
  const [pendingEventIds, setPendingEventIds] = useState(() => new Set())

  const refreshSavedEvents = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true)
    }

    try {
      const response = await getSavedEvents()
      const normalized = getResponseCollection(response)
        .map(normalizeSavedEvent)
        .filter(Boolean)
        .sort((left, right) => toDateValue(left.event_date) - toDateValue(right.event_date))

      setSavedEvents(normalized)
      return normalized
    } catch (error) {
      console.error('Failed to load saved events:', error)

      if (!silent) {
        showToast(error?.response?.data?.message || 'Failed to load saved events')
      }

      return []
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [showToast])

  useEffect(() => {
    if (!autoLoad) {
      setLoading(false)
      return
    }

    refreshSavedEvents().catch(() => {})
  }, [autoLoad, refreshSavedEvents])

  const savedEventIds = useMemo(
    () => new Set(savedEvents.map(event => String(event.eventId))),
    [savedEvents],
  )

  const isEventSaved = useCallback(
    eventId => savedEventIds.has(String(eventId)),
    [savedEventIds],
  )

  const toggleSaveEvent = useCallback(async eventOrId => {
    const eventId =
      typeof eventOrId === 'object'
        ? eventOrId?.id || eventOrId?._id || eventOrId?.eventId || eventOrId?.event_id
        : eventOrId

    if (!eventId) {
      return false
    }

    const normalizedId = String(eventId)

    if (pendingEventIds.has(normalizedId)) {
      return isEventSaved(eventId)
    }

    const wasSaved = isEventSaved(eventId)
    const previousSavedEvents = savedEvents
    const optimisticEvent = typeof eventOrId === 'object' ? normalizeSaveCandidate(eventOrId) : null

    setPendingEventIds(current => new Set([...current, normalizedId]))

    if (wasSaved) {
      setSavedEvents(current => current.filter(item => String(item.eventId) !== normalizedId))
    } else if (optimisticEvent) {
      setSavedEvents(current => {
        const withoutCurrent = current.filter(item => String(item.eventId) !== normalizedId)
        return [...withoutCurrent, optimisticEvent].sort((left, right) => toDateValue(left.event_date) - toDateValue(right.event_date))
      })
    }

    try {
      if (wasSaved) {
        await deleteSavedEvent(eventId)
        showToast('Removed from saved events')
        return false
      }

      await saveEvent(eventId)
      showToast('Saved event')
      await refreshSavedEvents({ silent: true })
      return true
    } catch (error) {
      console.error('Failed to toggle saved event:', error)
      setSavedEvents(previousSavedEvents)
      showToast(error?.response?.data?.message || 'Unable to update saved events right now')
      return wasSaved
    } finally {
      setPendingEventIds(current => {
        const next = new Set(current)
        next.delete(normalizedId)
        return next
      })
    }
  }, [isEventSaved, pendingEventIds, refreshSavedEvents, savedEvents, showToast])

  return {
    savedEvents,
    savedEventIds,
    loading,
    pendingEventIds,
    isEventSaved,
    refreshSavedEvents,
    toggleSaveEvent,
  }
}
