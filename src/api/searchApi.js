import axios from "axios";
import api from "./axios";

export const searchAll = (query) =>
  api.get("/search", {
    params: { q: query },
  });

export const filterCommitteesByTags = (tagsArray = []) =>
  api.get("/search/filterCommittee", {
    params: { tags: tagsArray },
    paramsSerializer: {
      serialize: (params) => {
        const searchParams = new URLSearchParams();
        (params.tags || []).forEach((tag) => searchParams.append("tags", tag));
        return searchParams.toString();
      },
    },
  });

export const filterEvents = (params) =>
  axios.get("http://localhost:3000/search/filterEvent", { params });

export const filterCommittee = filterCommitteesByTags;
export const filterEvent = filterEvents;
