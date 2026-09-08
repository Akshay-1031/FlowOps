import api from "./api";

export const analyzeProject = async (projectId) => {
  const response = await api.post(
    `/ai/projects/${projectId}/analyze`
  );

  return response.data;
};