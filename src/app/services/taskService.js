const API_URL = "http://localhost:5000/tasks";

export const getTasks = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addTask = async (task) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
};

export const updateTask = async (taskId, updatedFields) => {
  const res = await fetch(`${API_URL}/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
  return res.json();
};
