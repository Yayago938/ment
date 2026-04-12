import api from "./axios";

export const createEventRegistration = (data) =>
  api.post("/events/registration", data);

export const registerEvent = createEventRegistration;

export const getEventRegistrations = (eventId) =>
  api.get(`/events/${eventId}/allRegistrations`);

export const deleteEventRegistration = (registrationId) =>
  api.delete(`/events/registration/${registrationId}`);
