import { useTaskContext } from '@contexts/TaskContext';
import Column from './Column';
import '../styles/globals.css';


import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

const Board = () => {
  const { tasks, changeStatus } = useTaskContext();

  const columns = {
    todo: '📝 Pendiente',
    inProgress: '🚧 En progreso',
    done: '✅ Completada',
  };

  const renderTags = (tags) => {
    if (!tags) return null;

    return tags.map((tag, index) => (
      <span
        key={index}
        className="inline-block bg-purple-200 text-purple-800 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-1 shadow-sm"
      >
        {"Asignado a"}
      </span>
    ));
  };

  const renderAssignees = (assignees) => {
    if (!assignees) return null;

    return assignees.map((assignee, index) => (
      <span
        key={index}
        className="inline-block bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-xs font-medium mr-1 shadow-sm"
      >
        @{assignee}
      </span>
    ));
  };

  return (
    <div className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen overflow-x-auto">
      {Object.entries(columns).map(([key, label]) => (
        <Column
          key={key}
          title={label}
          status={key}
          tasks={tasks.filter((t) => t.status === key)}
          renderTaskContent={(task) => (
            <div className="p-6 bg-white rounded-xl shadow-lg mb-6 border-l-4 border-blue-500 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">{task.title}</h3>

              {task.description && (
                <div className="mb-3 text-gray-600 text-sm whitespace-pre-line">
                  {task.description.split('\n').map((line, i) => (
                    <p key={i}>
                      {line.startsWith('- ') ? '• ' + line.substring(2) : line}
                    </p>
                  ))}
                </div>
              )}

              <div className="mb-2">{renderTags(task.tags)}</div>

              <div className="flex flex-wrap items-center justify-between mt-3">
                <div>{renderAssignees(task.assignees)}</div>
              </div>

              {/* Fecha */}
              {task.dueDate && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  📅 Fecha: {new Date(task.dueDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}

              {/* Botones para cambiar de estado */}
              <div className="mt-4 flex gap-3 flex-wrap">
                {task.status === 'todo' && (
                  <button
                    onClick={() => changeStatus(task, 'inProgress')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition transform hover:scale-105"
                  >
                    <ArrowRight size={16} />
                    En progreso
                  </button>
                )}
                {task.status === 'inProgress' && (
                  <button
                    onClick={() => changeStatus(task, 'done')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition transform hover:scale-105"
                  >
                    <CheckCircle size={16} />
                    Completada
                  </button>
                )}
                {task.status === 'done' && (
                  <button
                    onClick={() => changeStatus(task, 'todo')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition transform hover:scale-105"
                  >
                    <RotateCcw size={16} />
                    A Pendiente
                  </button>
                )}
              </div>
            </div>
          )}
        />
      ))}
    </div>
  );
};

export default Board;
