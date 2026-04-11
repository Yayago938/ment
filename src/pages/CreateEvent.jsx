import { Link } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'

export default function CreateEvent() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <nav className="fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between bg-white/80 px-8 backdrop-blur-xl shadow-[0_20px_40px_rgba(123,110,246,0.08)]">
        <div className="flex items-center gap-4">
          <span className="font-headline text-2xl font-bold tracking-tight text-transparent bg-gradient-to-r from-[#7B6EF6] to-[#F6A6C1] bg-clip-text">
            Aura Committee
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-8 md:flex">
            <Link className="font-medium text-on-surface-variant transition-colors hover:text-primary" to="/committee-dashboard">
              Dashboard
            </Link>
            <Link className="font-medium text-on-surface-variant transition-colors hover:text-primary" to="/applications">
              Applications
            </Link>
            <span className="border-b-2 border-primary font-bold text-primary">Events</span>
            <Link className="font-medium text-on-surface-variant transition-colors hover:text-primary" to="/committee/profile">
              Profile
            </Link>
          </div>
          <div className="flex items-center gap-4 border-l border-outline-variant/20 pl-6">
            <Link className="text-on-surface-variant transition-colors hover:text-primary" to="/committee/notifications">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <button className="text-on-surface-variant transition-colors hover:text-primary" type="button">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <Link className="h-10 w-10 overflow-hidden rounded-full border border-primary/10 bg-surface-container-high" to="/committee/profile">
              <img
                alt="Committee Member Profile"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5rOVxV3_MzejEy8yFw1urS2qdo-AMxbN4ibFLSNN1TnnjmQGhsQCmPdI4ALk3pl5NJvFkCIvdXftt8p6f3Qq1GO4-xy12RGOf1jWs9m2zFTqLHyQR79MwK2t77pYivdFk_n55N93YNibYdl-5Txe9HTHmDXuoxeXonhqJERwJtwTv-qYBqHkIFE-zxFei4D3BnEzSakFsLkC4xyxqW34JHABGVsGQ-4EH-josDbRZIIgrK0z-EK9w7Lmm1fFcgUjqRD3LuMHU2Qw"
              />
            </Link>
          </div>
        </div>
      </nav>

      <CommitteeSidebar />

      <main className="px-8 pb-20 pt-28 lg:ml-64">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Create New Event</h1>
              <p className="mt-2 text-lg text-on-surface-variant">Curate a new mentorship experience for the community.</p>
            </div>
            <div className="flex gap-4">
              <button className="rounded-full border border-outline-variant/20 px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/5" type="button">
                Discard
              </button>
              <button className="rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02]" type="button">
                Save Event
              </button>
            </div>
          </header>

          <form className="space-y-12" onSubmit={(event) => event.preventDefault()}>
            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">info</span>
                  <h2 className="text-xl font-bold tracking-tight">General Information</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Event Title</label>
                    <input
                      className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface placeholder:text-outline transition-all focus:bg-white focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Design Leadership Summit 2024"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</label>
                    <input className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="date" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Start Time</label>
                      <input className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="time" />
                    </div>
                    <div>
                      <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">End Time</label>
                      <input className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="time" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Location or Platform Link</label>
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary">location_on</span>
                      <input className="w-full rounded-full border-none bg-surface-container-low py-4 pl-14 pr-6 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" placeholder="Enter physical address or virtual meeting link" type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">notes</span>
                  <h2 className="text-xl font-bold tracking-tight">About the Event</h2>
                </div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Detailed Description</label>
                <div className="overflow-hidden rounded-lg bg-surface-container-low transition-all focus-within:ring-2 focus-within:ring-primary">
                  <div className="flex items-center gap-2 border-b border-outline-variant/10 bg-surface-container p-2">
                    {['format_bold', 'format_italic', 'format_list_bulleted', 'link'].map((icon) => (
                      <button key={icon} className="rounded-md p-2 text-on-surface-variant transition-all hover:bg-white" type="button">
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                      </button>
                    ))}
                  </div>
                  <textarea className="w-full resize-none border-none bg-transparent px-6 py-4 text-on-surface focus:ring-0" placeholder="Tell potential attendees what they can expect from this session..." rows="8" />
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">image</span>
                  <h2 className="text-xl font-bold tracking-tight">Media</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cover Image</label>
                    <div className="group flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/30 bg-surface-container-low text-center transition-all hover:bg-primary-fixed/30">
                      <span className="material-symbols-outlined mb-2 text-4xl text-outline transition-colors group-hover:text-primary">add_photo_alternate</span>
                      <p className="font-medium text-on-surface-variant">Click to upload or drag cover photo</p>
                      <p className="mt-1 text-xs text-outline">Recommended: 1920x1080 (JPG, PNG)</p>
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Gallery Preview</label>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/30 bg-surface-container-low transition-all hover:bg-primary-fixed/30">
                        <span className="material-symbols-outlined text-outline">add</span>
                      </div>
                      {[
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuBzr0XO_Pm7l9Oh2YzgrHz8JI-TBxAlaiS2qvdVnKxHh02Po8xqht4EDEO_Qf-BOdtpJU1lVPfVZ4Yq-Nh2mpZjv4I6bQQ9XBngjHEdseWFaCs_q-K4WwkzLi5nX_W6ScxCwvTE5diTNVUTQ2oAvJgF5IiCND4GBfCI58QykS3qioI06BuCqUWrZ8vMVcZ9rR409WyieRJgIDLbDD_ZcZlD5dATSQEhwYSZcbhSNqNHcTvkISu9fjIEx2MS60ryimIoN4hNt0pSRQM',
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfMuqh1Kag_-AGtfl0BLpCBUWTCI9F6-RiBN5jFMAvVF-UV2XtZZbA1SDLlmTRYMQXl2d_mtiofpmE8CoaYIHE2GA0q30rDfx9VtpHS4_zvE6ikl_eqC421jd99vX3TTLI-NzwIXx0RYewSGQyA0TkcZBW13DYHcbb2zBMMe13_axs8euM7ha0jelm0pMnPTSAsHO3QAv8SojqYoHAAQ268NTU-HNs8Rh0sJ8ayjx0bcbaJf_DymQS5yO0NPYy1LneI4AxDQULh8k',
                      ].map((image) => (
                        <div key={image} className="group relative aspect-square overflow-hidden rounded-lg">
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="material-symbols-outlined text-white">delete</span>
                          </div>
                          <img alt="Gallery placeholder" className="h-full w-full object-cover" src={image} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">group</span>
                    <h2 className="text-xl font-bold tracking-tight">Featured Speakers</h2>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-bold text-primary hover:underline" type="button">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Add Speaker
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-6 rounded-lg border border-outline-variant/10 bg-surface-container-low p-6 md:flex-row">
                    <div className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-outline-variant bg-white">
                      <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-outline group-hover:text-primary">add_a_photo</span>
                    </div>
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      <input className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary" placeholder="Speaker Name" type="text" />
                      <input className="w-full rounded-full border-none bg-white px-6 py-3 text-on-surface focus:ring-2 focus:ring-primary" placeholder="Role / Organization" type="text" />
                    </div>
                    <button className="rounded-full p-2 text-error transition-all hover:bg-error/10" type="button">
                      <span className="material-symbols-outlined">delete_outline</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-1">
              <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">confirmation_number</span>
                  <h2 className="text-xl font-bold tracking-tight">Registration Settings</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Ticket Capacity</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-outline text-sm">people</span>
                      <input className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" placeholder="50" type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline text-sm">payments</span>
                      <input className="w-full rounded-full border-none bg-surface-container-low py-4 pl-14 pr-6 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" placeholder="Free or 0.00" type="text" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Deadline</label>
                    <input className="w-full rounded-full border-none bg-surface-container-low px-6 py-4 text-on-surface transition-all focus:bg-white focus:ring-2 focus:ring-primary" type="date" />
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0">
          <div className="flex items-center gap-4 rounded-full border border-primary/10 bg-white/90 p-4 shadow-[0_20px_40px_rgba(123,110,246,0.2)] backdrop-blur-md">
            <span className="hidden text-sm font-medium text-on-surface-variant md:block">Unsaved changes detected</span>
            <div className="hidden h-8 w-px bg-outline-variant/30 md:block" />
            <button className="rounded-full bg-primary px-8 py-3 font-bold text-on-primary transition-all hover:scale-105" type="button">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
