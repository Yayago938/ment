import api from "./axios";

const committeeIdRoutes = [
  (id) => `/getCommittee/${id}`,
  (id) => `/getCommitteeById/${id}`,
  (id) => `/committee/${id}`,
];

export const normalizeCommittee = (committee = {}) => ({
  id: committee?.id || committee?._id || committee?.committeeId || committee?.committee_id || null,
  name: committee?.committee_name || committee?.name || "Committee",
  description: committee?.description || "No description available yet.",
  tagline: committee?.tagline || "",
  facultyName: committee?.affiliated_faculty?.name || committee?.facultyName || "",
  startYear: committee?.start_year || committee?.startYear || null,
  createdAt: committee?.created_at || committee?.createdAt || null,
  committeeHeads: Array.isArray(committee?.committee_heads)
    ? committee.committee_heads
    : Array.isArray(committee?.committeeHeads)
      ? committee.committeeHeads
      : [],
  socialLinks: committee?.social_links || committee?.socialLinks || {},
});

const normalizeCommitteeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeCommittee);
  }

  if (Array.isArray(payload?.data)) {
    return payload.data.map(normalizeCommittee);
  }

  if (Array.isArray(payload?.committees)) {
    return payload.committees.map(normalizeCommittee);
  }

  if (Array.isArray(payload?.data?.committees)) {
    return payload.data.committees.map(normalizeCommittee);
  }

  return [];
};

export const createCommittee = async (data) => {
  const res = await api.post("/createCommittees", data);
  return normalizeCommittee(res.data);
};

export const getAllCommittees = async () => {
  const res = await api.get("/getAllCommittees");
  return normalizeCommitteeCollection(res.data);
};

export const getCommitteeById = async (id) => {
  let lastError;

  for (const buildRoute of committeeIdRoutes) {
    try {
      const res = await api.get(buildRoute(id));
      const payload =
        res.data?.committee ||
        res.data?.data?.committee ||
        res.data?.data ||
        res.data;
      return normalizeCommittee(payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const addMemberToCommittee = async ({ committeeId, memberId }) => {
  const res = await api.post("/committee/addMemberToCommittee", {
    committeeId,
    memberId,
  });

  return res.data;
};

export const addHeadToCommittee = async ({ committeeId, headId, role_title, role_type }) => {
  const res = await api.post("/committee/addHeadToCommittee", {
    committeeId,
    headId,
    role_title,
    role_type,
  });

  return res.data;
};
