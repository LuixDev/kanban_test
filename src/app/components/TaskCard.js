import Tag from './Tag';
import Avatar from './Avatar';

const TaskCard = ({ task }) => (
  <div className="bg-white rounded-lg shadow p-3">
    <p className="font-medium">{task.title}</p>
    <div className="flex flex-wrap items-center gap-1 mt-2">
      {task.tags?.map(tag => <Tag key={tag} text={tag} />)}
      {task.dueDate && <span className="text-sm text-gray-500">📅 {task.dueDate}</span>}
    </div>
    <div className="flex items-center mt-2 gap-2">
      {task.assignees?.map(user => <Avatar key={user} name={user} />)}
    </div>
  </div>
);

export default TaskCard;
