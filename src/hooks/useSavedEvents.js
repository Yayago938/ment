import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteSavedEvent, getSavedEvents, saveEvent } from '../api/eventApi'
import { useToast } from '../components/ToastProvider'

const asArray = value => {
  if (Array.isArray(value)) {
    return value
  }

  return []
}

const getEventId = event =>
  typeof event === 'string'
    ? event
    : event?.id || event?._id || event?.eventId || event?.event_id || null

const getResponseCollection = payload => {
  const candidates = [
    payload,
    payload?.data,
    payload?.data?.data,
    payload?.data?.savedEvents,
    payload?.data?.saved_events,
    payload?.data?.events,
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

const sortSavedEvents = events =>
  [...events].sort((left, right) => toDateValue(left.event_date) - toDateValue(right.event_date))

const getEventSource = savedItem => {
  if (!savedItem || typeof savedItem !== 'object') {
    return null
  }

  return (
    savedItem.event ||
    savedItem.savedEvent ||
    savedItem.event_details ||
    savedItem.eventData ||
    savedItem.data ||
    savedItem
  )
}

const getSavedRecordId = (savedItem, eventId) =>
  savedItem?.saveId || savedItem?.save_id || savedItem?._id || savedItem?.id || `${eventId}-saved`

export const normalizeSavedEvent = savedItem => {
  const nestedEvent = getEventSource(savedItem)

  if (!nestedEvent) {
    return null
  }

  const eventId =
    nestedEvent?.eventId ||
    nestedEvent?.event_id ||
    nestedEvent?.event?.id ||
    nestedEvent?.event?._id ||
    nestedEvent?.event?.eventId ||
    getEventId(nestedEvent) ||
    savedItem?.eventId ||
    savedItem?.event_id ||
    savedItem?.event?.id ||
    savedItem?.event?._id ||
    savedItem?.event?.eventId ||
    null

  if (!eventId) {
    return null
  }

  return {
    saveId: getSavedRecordId(savedItem, eventId),
    eventId,
    event_name: nestedEvent?.event_name || nestedEvent?.title || nestedEvent?.name || nestedEvent?.event?.event_name || nestedEvent?.event?.title || nestedEvent?.event?.name || 'Untitled Event',
    description: nestedEvent?.description || nestedEvent?.summary || nestedEvent?.event?.description || nestedEvent?.event?.summary || '',
    venue: nestedEvent?.venue || nestedEvent?.location || nestedEvent?.event_location || nestedEvent?.event?.venue || nestedEvent?.event?.location || nestedEvent?.event?.event_location || '',
    event_date: nestedEvent?.event_date || nestedEvent?.date || nestedEvent?.startDate || nestedEvent?.start_date || nestedEvent?.event?.event_date || nestedEvent?.event?.date || nestedEvent?.event?.startDate || nestedEvent?.event?.start_date || '',
    event_time: nestedEvent?.event_time || nestedEvent?.time || nestedEvent?.event?.event_time || nestedEvent?.event?.time || '',
    registration_deadline: nestedEvent?.registration_deadline || nestedEvent?.deadline || nestedEvent?.event?.registration_deadline || nestedEvent?.event?.deadline || '',
    tags: asArray(nestedEvent?.tags || nestedEvent?.event?.tags),
    requires_registration:
      typeof nestedEvent?.requires_registration === 'boolean'
        ? nestedEvent.requires_registration
        : typeof nestedEvent?.event?.requires_registration === 'boolean'
          ? nestedEvent.event.requires_registration
          : Boolean(nestedEvent?.requiresRegistration || nestedEvent?.event?.requiresRegistration),
    raw: savedItem,
  }
}

const normalizeSaveCandidate = input => {
  if (!input || typeof input !== 'object') {
    return null
  }

  const eventId = getEventId(input)

  if (!eventId) {
    return null
  }

  return normalizeSavedEvent({
    id: `optimistic-${eventId}`,
    event: input,
    eventId,
  })
}

const isDuplicateSaveError = error => {
  const combinedMessage = [
    error?.response?.data?.message,
    error?.response?.data?.error,
    error?.response?.data?.details,
    error?.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return [
    'already saved',
    'already exists',
    'duplicate',
    'unique constraint',
    'already present',
    'exists',
    'saved event exists',
    'record already',
  ].some(fragment => combinedMessage.includes(fragment))
}

const isServerError = error => (error?.response?.status || 0) >= 500

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
      const normalized = sortSavedEvents(
        getResponseCollection(response)
          .map(normalizeSavedEvent)
          .filter(Boolean),
      )

      setSavedEvents(normalized)
      return normalized
    } catch (error) {
      console.error('[refreshSavedEvents] failed', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      })

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
    input => {
      const eventId = getEventId(input)
      return Boolean(eventId) && savedEventIds.has(String(eventId))
    },
    [savedEventIds],
  )

  const toggleSaveEvent = useCallback(async input => {
    console.log('[toggleSaveEvent] input', input)

    const eventId = getEventId(input)

    console.log('[toggleSaveEvent] resolved eventId', eventId)

    if (!eventId) {
      console.error('[toggleSaveEvent] invalid event id', input)
      showToast('Unable to save this event right now')
      return false
    }

    const normalizedId = String(eventId)
    const currentSavedIds = Array.from(savedEventIds)
    const wasSaved = currentSavedIds.includes(normalizedId)

    console.log('[toggleSaveEvent] state before action', {
      eventId: normalizedId,
      wasSaved,
      savedIds: currentSavedIds,
    })

    if (pendingEventIds.has(normalizedId)) {
      return isEventSaved(normalizedId)
    }

    const optimisticEvent = normalizeSaveCandidate(input)
    const previousSavedEvents = savedEvents

    setPendingEventIds(current => {
      const next = new Set(current)
      next.add(normalizedId)
      return next
    })

    if (wasSaved) {
      setSavedEvents(current => current.filter(item => String(item.eventId) !== normalizedId))
    } else if (optimisticEvent) {
      setSavedEvents(current => sortSavedEvents([
        ...current.filter(item => String(item.eventId) !== normalizedId),
        optimisticEvent,
      ]))
    }

    try {
      if (wasSaved) {
        await deleteSavedEvent(normalizedId)
        await refreshSavedEvents({ silent: true })
        showToast('Removed from saved events')
        return false
      }

      await saveEvent(normalizedId)
      await refreshSavedEvents({ silent: true })
      showToast('Saved event')
      return true
    } catch (error) {
      console.error('[toggleSaveEvent] failed', {
        eventId: normalizedId,
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        input,
      })

      if (!wasSaved) {
        const refreshedEvents = await refreshSavedEvents({ silent: true })
        const isPresentAfterRefresh = refreshedEvents.some(item => String(item.eventId) === normalizedId)

        console.log('[toggleSaveEvent] result after refresh on failure', {
          eventId: normalizedId,
          isDuplicateSaveError: isDuplicateSaveError(error),
          isServerError: isServerError(error),
          isPresentAfterRefresh,
          refreshedSavedIds: refreshedEvents.map(item => String(item.eventId)),
        })

        if (isDuplicateSaveError(error) && isPresentAfterRefresh) {
          showToast('Saved event')
          return true
        }

        if (isServerError(error) && isPresentAfterRefresh) {
          showToast('Saved event')
          return true
        }
      }

      setSavedEvents(previousSavedEvents)
      showToast('Unable to update saved events right now')
      return wasSaved
    } finally {
      setPendingEventIds(current => {
        const next = new Set(current)
        next.delete(normalizedId)
        return next
      })
    }
  }, [isEventSaved, pendingEventIds, refreshSavedEvents, savedEventIds, savedEvents, showToast])

  return {
    savedEvents,
    loading,
    pendingEventIds,
    isEventSaved,
    toggleSaveEvent,
  }
}
