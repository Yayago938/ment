
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'
import GlassBlobCard from '../components/GlassBlobCard'
import SaveItemButton from '../components/SaveItemButton'
import useSavedEvents from '../hooks/useSavedEvents'

const getRecordId = item =>
    item?.id || item?._id || item?.eventId || item?.event_id || item?.committeeId || item?.committee_id || item?.studentId || item?.student_id || item?.auth_id

const formatDate = value => {
    const parsed = new Date(value)
    if (!value || Number.isNaN(parsed.getTime())) return 'Date to be announced'

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}

const activateOnEnter = handler => event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handler()
    }
}

const Search = () => {
    const navigate = useNavigate()
    const { pendingEventIds, isEventSaved, toggleSaveEvent } = useSavedEvents()

    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    const [events, setEvents] = useState([])
    const [committees, setCommittees] = useState([])
    const [profiles, setProfiles] = useState([])

    const [results, setResults] = useState({
        events: [],
        committees: [],
        profiles: []
    })

    const [recentSearches, setRecentSearches] = useState([])

    // 🔥 Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    // 🔥 Fetch
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem("token")

                const [eventsRes, committeesRes, profilesRes] =
                    await Promise.all([
                        fetch("https://mentorlink-production.up.railway.app/events/getAllEvents", {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        fetch("https://mentorlink-production.up.railway.app/getAllCommittees", {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        fetch("https://mentorlink-production.up.railway.app/all-students", {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ])

                const eventsData = await eventsRes.json()
                const committeesData = await committeesRes.json()
                const profilesData = await profilesRes.json()

                setEvents(Array.isArray(eventsData) ? eventsData : eventsData?.data || eventsData?.events || [])
                setCommittees(Array.isArray(committeesData) ? committeesData : committeesData?.data || [])
                setProfiles(Array.isArray(profilesData) ? profilesData : profilesData?.data || profilesData?.students || [])

            } catch (err) {
                console.log(err)
            }
        }

        fetchAll()
    }, [])

    // 🔥 Load recent searches
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("recentSearches")) || []
        setRecentSearches(stored)
    }, [])

    // 🔍 Search logic
    useEffect(() => {
        if (!debouncedQuery) {
            setResults({
                events: events,
                committees: committees,
                profiles: profiles
            })
            return
        }

        const q = debouncedQuery.toLowerCase()

        setResults({
            events: events.filter(e => (e.event_name || e.title || e.name || '').toLowerCase().includes(q)),
            committees: committees.filter(c => (c.committee_name || c.name || '').toLowerCase().includes(q)),
            profiles: profiles.filter(p => p.name?.toLowerCase().includes(q))
        })

    }, [debouncedQuery, events, committees, profiles])

    // 🔥 Store recent ONLY on click
    const storeRecent = (text) => {
        const prev = JSON.parse(localStorage.getItem("recentSearches")) || []

        const updated = [text, ...prev.filter(item => item !== text)].slice(0, 5)

        localStorage.setItem("recentSearches", JSON.stringify(updated))
        setRecentSearches(updated)
    }

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <StudentSidebar />

            <TopBar
                sidebar="student"
                placeholder="Search clubs, events, or opportunities..."
                searchValue={query}
                onSearchChange={(e) => setQuery(e.target.value)}
            />

            <main className="px-4 pb-12 pt-24 lg:ml-64 lg:px-8 lg:pt-28">
                <div className="mx-auto max-w-[1440px] space-y-10">

                    {/* 🔥 RECENT SEARCHES */}
                    {!query && recentSearches.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">Recent Searches</h2>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("recentSearches")
                                        setRecentSearches([])
                                    }}
                                    className="text-sm text-red-500"
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {recentSearches.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(item)}
                                        className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* EVENTS */}
                    {results.events.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Events</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {results.events.map(e => {
                                    const eventId = getRecordId(e)
                                    const eventName = e.event_name || e.title || e.name || 'Untitled Event'
                                    const openEvent = () => {
                                        if (!eventId) return
                                        storeRecent(eventName)
                                        navigate(`/events/${eventId}`, { state: { event: e } })
                                    }

                                    return (
                                    <GlassBlobCard
                                        role={eventId ? 'button' : undefined}
                                        tabIndex={eventId ? 0 : undefined}
                                        key={eventId || e.event_name}
                                        interactive={Boolean(eventId)}
                                        onClick={openEvent}
                                        onKeyDown={eventId ? activateOnEnter(openEvent) : undefined}
                                        className="min-w-[280px] p-6 text-left flex flex-col gap-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {eventName}
                                            </h3>
                                            <SaveItemButton
                                                eventId={eventId}
                                                isSaved={isEventSaved(eventId)}
                                                disabled={!eventId || pendingEventIds.has(String(eventId))}
                                                onToggle={() => toggleSaveEvent(e)}
                                                className="h-9 w-9 shrink-0 bg-surface-container-low shadow-none"
                                                iconClassName="text-[18px]"
                                            />
                                        </div>

                                        {/* Venue */}
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MaterialIcon style={{ color: "#5545ce" }}>
                                                location_on
                                            </MaterialIcon>
                                            <p className="text-sm">{e.venue}</p>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MaterialIcon style={{ color: "#5545ce" }}>
                                                calendar_today
                                            </MaterialIcon>
                                            <p className="text-xs">
                                                {formatDate(e.event_date || e.date || e.startDate || e.start_date)}
                                            </p>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MaterialIcon style={{ color: "#5545ce" }}>
                                                access_time
                                            </MaterialIcon>
                                            <p className="text-xs">
                                                {e.event_time}
                                            </p>
                                        </div>
                                    </GlassBlobCard>


                                )})}
                            </div>
                        </div>
                    )}

                    {/* COMMITTEES */}
                    {results.committees.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Committees</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {results.committees.map(c => {
                                    const committeeId = getRecordId(c)
                                    const committeeName = c.committee_name || c.name || 'Committee'
                                    const openCommittee = () => {
                                        if (!committeeId) return
                                        storeRecent(committeeName)
                                        navigate(`/committee-detail/${committeeId}`, { state: { committeeId, committee: c } })
                                    }

                                    return (
                                    <GlassBlobCard
                                        role={committeeId ? 'button' : undefined}
                                        tabIndex={committeeId ? 0 : undefined}
                                        key={committeeId || committeeName}
                                        interactive={Boolean(committeeId)}
                                        onClick={openCommittee}
                                        onKeyDown={committeeId ? activateOnEnter(openCommittee) : undefined}
                                        className="min-w-[250px] p-8 text-left"
                                    >
                                        <h3 className="font-bold">{committeeName}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {c.description}
                                        </p>
                                    </GlassBlobCard>
                                )})}
                            </div>
                        </div>
                    )}

                    {/* PROFILES */}
                    {results.profiles.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Profiles</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {results.profiles.map(p => {
                                    const profileId = getRecordId(p)
                                    const openProfile = () => {
                                        if (!profileId) return
                                        storeRecent(p.name)
                                        navigate(`/profile/${profileId}`, { state: { student: p } })
                                    }

                                    return (
                                    <GlassBlobCard
                                        role={profileId ? 'button' : undefined}
                                        tabIndex={profileId ? 0 : undefined}
                                        key={profileId || p.name}
                                        interactive={Boolean(profileId)}
                                        onClick={openProfile}
                                        onKeyDown={profileId ? activateOnEnter(openProfile) : undefined}
                                        className="min-w-[250px] p-8 text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold">
                                                {p.name?.[0]}
                                            </div>
                                            <p className="font-semibold">{p.name}</p>
                                        </div>
                                    </GlassBlobCard>
                                )})}
                            </div>
                        </div>
                    )}

                    {/* EMPTY */}
                    {query &&
                        results.events.length === 0 &&
                        results.committees.length === 0 &&
                        results.profiles.length === 0 && (
                            <p className="text-center text-gray-400">
                                No results found
                            </p>
                        )}

                </div>
            </main>
        </div>
    )
}

export default Search

