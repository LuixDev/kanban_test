import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { get, set } from 'idb-keyval'; // Usamos idb-keyval para almacenar en IndexedDB

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // Estado local para las tareas

  // Función para obtener las tareas desde IndexedDB o la API
  const fetchTasks = async () => {
    // Intentamos obtener las tareas desde IndexedDB
    const local = await get('tasks');
    if (local) {
      // Si las encontramos en IndexedDB, las mostramos
      setTasks(local);
    } else {
      // Si no, las obtenemos desde el servidor (json-server)
      const { data } = await axios.get('http://localhost:5000/tasks');  // Cambié el puerto a 5000
      setTasks(data);
      await set('tasks', data); // Guardamos los datos en IndexedDB para futuras referencias
    }
  };

  // Función para actualizar una tarea en el servidor y en IndexedDB
  const updateTask = async (updatedTask) => {
    try {
      const url = `http://localhost:5000/tasks/${updatedTask.id}`;  // Cambié el puerto a 5000
      const response = await axios.patch(url, updatedTask); // Realizamos la actualización en el backend

      if (response.status === 200) {
        // Si la actualización es exitosa, actualizamos el estado y IndexedDB
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          set('tasks', updatedTasks); // Actualizamos en IndexedDB
          return updatedTasks;
        });
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Función para cambiar el estado de una tarea
  const changeStatus = async (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus }; // Actualizamos el estado de la tarea
    await updateTask(updatedTask); // Llamamos a la función de actualización
  };

  useEffect(() => {
    fetchTasks(); // Llamamos a fetchTasks al cargar el componente
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTask, changeStatus }}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook para acceder a las tareas desde cualquier componente
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};
