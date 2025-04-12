import { useState } from 'react';
import { useTaskContext } from '@contexts/TaskContext';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';  // Asegúrate de importar axios

const NewTaskForm = () => {
  const { tasks, setTasks } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignees, setAssignees] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({}); // Para manejar errores de validación

  const saveToIndexedDB = (tasks) => {
    const request = window.indexedDB.open('TaskDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }
    };

    request.onerror = (event) => {
      console.error('Error al abrir la base de datos:', event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');
      tasks.forEach((task) => {
        store.put(task); // Almacena la tarea
      });

      transaction.oncomplete = () => {
        console.log('Tareas guardadas exitosamente');
      };

      transaction.onerror = (event) => {
        console.error('Error al guardar las tareas:', event.target.error);
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      tags: ['To Do'],
      assignees: assignees.split(',').map(name => name.trim()),
      dueDate,  // Guardamos la fecha de vencimiento
    };

    // Validación de los campos
    const newErrors = {};
    if (!title) newErrors.title = 'El título es obligatorio';
    if (!assignees) newErrors.assignees = 'Debe asignar al menos un usuario';
    setErrors(newErrors);

    // Si hay errores, no enviar el formulario
    if (Object.keys(newErrors).length > 0) return;

    try {
      // Enviar la tarea al servidor (json-server)
      const response = await axios.post('http://localhost:5000/tasks', newTask);

      if (response.status === 201) {
        // Si la tarea se guarda correctamente en el servidor, actualizamos el estado
        const updated = [...tasks, newTask];
        setTasks(updated);
        saveToIndexedDB(updated); // Guardar tareas en IndexedDB

        // Limpiar los campos del formulario
        setTitle('');
        setDescription('');
        setAssignees('');
        setDueDate('');
        setErrors({});
      } else {
        console.error('Error al guardar la tarea en el servidor');
      }
    } catch (error) {
      console.error('Error al enviar la tarea al servidor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800">Crear nueva tarea</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ej. Redactar informe mensual"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detalles opcionales de la tarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
        <input
          type="text"
          className={`w-full border ${errors.assignees ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Ej. Ana, Pedro, María"
          value={assignees}
          onChange={(e) => setAssignees(e.target.value)}
        />
        {errors.assignees && <p className="text-red-500 text-sm mt-1">{errors.assignees}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Agregar Tarea
      </button>
    </form>
  );
};

export default NewTaskForm;
