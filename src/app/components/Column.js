// components/Column.js
const Column = ({ title, tasks, renderTaskContent, status }) => (
    <div className="flex flex-col w-80 bg-gray-100 p-4 rounded-lg shadow min-h-[300px]">
      <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
      <div
        className="flex-1 overflow-y-auto"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const taskId = e.dataTransfer.getData('taskId');
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            // Aquí se actualizaría el estado de la tarea al soltarla
            changeStatus(task, status);
          }
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
            className="mb-4"
          >
            {renderTaskContent(task)}
          </div>
        ))}
      </div>
    </div>
  );
  
  export default Column;
  