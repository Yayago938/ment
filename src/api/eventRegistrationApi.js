import api from "./axios";

export const getEventRegistrations = (eventId) =>
  api.get(`/events/${eventId}/allRegistrations`);

export const deleteEventRegistration = (registrationId) =>
  api.delete(`/events/registration/${registrationId}`);