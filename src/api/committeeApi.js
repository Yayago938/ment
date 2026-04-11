import api from "./axios";

const committeeIdRoutes = [
  (id) => `/getCommitteeById/${id}`,
  (id) => `/getCommittee/${id}`,
  (id) => `/committee/${id}`,
];

export const createCommittee = async (data) => {
  const res = await api.post("/createCommittees", data);
  return res.data;
};

export const getAllCommittees = async () => {
  const res = await api.get("/getAllCommittees");
  return res.data;
};

export const getCommitteeById = async (id) => {
  let lastError;

  for (const buildRoute of committeeIdRoutes) {
    try {
      const res = await api.get(buildRoute(id));
      return res.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};
