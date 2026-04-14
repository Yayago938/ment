
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'

const Search = () => {
    const navigate = useNavigate()

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

                setEvents(eventsData || [])
                setCommittees(committeesData || [])
                setProfiles(profilesData.data || [])

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
            events: events.filter(e => e.event_name?.toLowerCase().includes(q)),
            committees: committees.filter(c => c.committee_name?.toLowerCase().includes(q)),
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
                                {results.events.map(e => (

                                    <div
                                        key={e.id}
                                        onClick={() => {
                                            storeRecent(e.event_name)
                                            navigate(`/events/${e.id}`)
                                        }}
                                        className="min-w-[280px] cursor-pointer rounded-3xl bg-white p-6 shadow-md hover:shadow-xl transition flex flex-col gap-3"
                                    >
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {e.event_name}
                                        </h3>

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
                                                {new Date(e.event_date).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
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
                                    </div>


                                ))}
                            </div>
                        </div>
                    )}

                    {/* COMMITTEES */}
                    {results.committees.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Committees</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {results.committees.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => storeRecent(c.committee_name)}
                                        className="min-w-[250px] rounded-xl bg-white p-8 shadow cursor-pointer"
                                    >
                                        <h3 className="font-bold">{c.committee_name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {c.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROFILES */}
                    {results.profiles.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Profiles</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {results.profiles.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => storeRecent(p.name)}
                                        className="min-w-[250px] items-center gap-3 rounded-xl bg-white p-8 shadow cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold">
                                            {p.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{p.name}</p>
                                        </div>
                                    </div>
                                ))}
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

