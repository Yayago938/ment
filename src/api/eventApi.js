import api from "./axios";

export const createEvent = async (data) => {
  const res = await api.post("/events/createEvent", data);
  return res.data;
};

export const getEventsByCommittee = async (committeeId) => {
  const res = await api.get(`/events/getAllEvents/${committeeId}`);
  return res.data;
};

export const updateEvent = async (eventId, data) => {
  const res = await api.patch(`/events/updateEvent/${eventId}`, data);
  return res.data;
};

export const deleteEvent = async (eventId) => {
  const res = await api.delete(`/events/deleteEvent/${eventId}`);
  return res.data;
};

export const getEventRegistrations = async (eventId) => {
  const res = await api.get(`/events/${eventId}/allRegistrations`);
  return res.data;
};

export const getAllEvents = () => api.get("/events/getAllEvents");

export const getEventById = async (eventId) => {
  const res = await api.post('/events/getEvent', { eventId });
  return res.data?.event || res.data?.data || res.data;
};
