import api from "./axios";

export const registerForEvent = (data) => api.post("/event-registration", data);
export const getEventRegistrations = (eventId) =>
  api.get(`/event-registration/${eventId}`);
export const deleteEventRegistration = (id) =>
  api.delete(`/event-registration/${id}`);