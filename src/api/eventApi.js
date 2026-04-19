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

export const getSavedEvents = async () => {
  try {
    const res = await api.get("/events/getSavedEvents");
    return res.data;
  } catch (error) {
    console.error('[getSavedEvents] failed', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    throw error;
  }
};

export const saveEvent = async (eventId) => {
  const payload = { eventId };

  console.log('[saveEvent] sending', { eventId, payload });

  try {
    const res = await api.post("/events/saveEvent", payload);
    return res.data;
  } catch (error) {
    console.error('[saveEvent] failed', {
      eventId,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    throw error;
  }
};

export const deleteSavedEvent = async (eventId) => {
  try {
    const res = await api.delete(`/events/deleteSavedEvent/${eventId}`);
    return res.data;
  } catch (error) {
    console.error('[deleteSavedEvent] failed', {
      eventId,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    throw error;
  }
};
