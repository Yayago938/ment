import axiosInstance from "./axios";

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
  const res = await axiosInstance.post("/createCommittees", data);
  return normalizeCommittee(res.data);
};

export const getAllCommittees = async () => {
  const res = await axiosInstance.get("/getAllCommittees");
  return normalizeCommitteeCollection(res.data);
};

export const getCommitteeById = async (id) => {
  let lastError;

  for (const buildRoute of committeeIdRoutes) {
    try {
      const res = await axiosInstance.get(buildRoute(id));
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

export const getCommitteeHeads = async (committeeId) => {
  const res = await axiosInstance.post('/committee/getAllCommitteeHeads', {
    committeeId
  })
  return res.data
}

export const getCommitteeMembers = async (committeeId) => {
  const res = await axiosInstance.post('/committee/getAllCommitteeMembers', {
    committeeId
  })
  return res.data
}

export const addMemberToCommittee = async (data) => {
  const res = await axiosInstance.post('/committee/addMemberToCommittee', data)
  return res.data
}

export const addHeadToCommittee = async (data) => {
  const res = await axiosInstance.post('/committee/addHeadToCommittee', data)
  return res.data
}

export const deleteMemberFromCommittee = async ({ committeeId, student_email }) => {
  const res = await axiosInstance.delete("/committee/deleteMemberFromCommittee", {
    data: {
      committeeId,
      student_email,
    },
  });

  return res.data;
};

export const deleteHeadFromCommittee = async ({ committeeId, head_email }) => {
  const res = await axiosInstance.delete("/committee/deleteHeadFromCommittee", {
    data: {
      committeeId,
      head_email,
    },
  });

  return res.data;
};

export const updateCommittee = async (id, data) => {
  const res = await axiosInstance.patch(`/updateCommittees/${id}`, data);
  return res.data;
};
