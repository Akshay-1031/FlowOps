import api from "./api";

export const getTasks = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data;
};

export const createTask = async (projectId, taskData) => {
  const response = await api.post(
    `/projects/${projectId}/tasks`,
    taskData
  );

  return response.data;
};

export const getTask = async (taskId) => {
  const response = await api.get(`/projects/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(
    `/projects/tasks/${taskId}`,
    taskData
  );

  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/projects/tasks/${taskId}`);
  return response.data;
};