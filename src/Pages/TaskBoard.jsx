import { useState } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiBell,
  FiSearch,
  FiMoreVertical,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function TaskBoard() {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium",
  });

  const [tasks, setTasks] = useState({
    backlog: [
      {
        id: "1",
        title: "Design user profile page",
        priority: "Medium",
        color: "bg-yellow-100 text-yellow-800",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        deletable: true,
      },
      {
        id: "2",
        title: "Define database schema",
        priority: "Medium",
        color: "bg-yellow-100 text-yellow-800",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      },
    ],
    todo: [],
    inprogress: [],
    done: [],
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const movedTask = tasks[sourceCol][source.index];

    const updatedSource = Array.from(tasks[sourceCol]);
    updatedSource.splice(source.index, 1);

    const updatedDest = Array.from(tasks[destCol]);
    updatedDest.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceCol]: updatedSource,
      [destCol]: updatedDest,
    });
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return alert("Please enter a task title.");

    const color =
      newTask.priority === "High"
        ? "bg-red-100 text-red-800"
        : newTask.priority === "Medium"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800";

    const newItem = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      color,
      avatar: newTask.assignee,
    };

    setTasks({
      ...tasks,
      backlog: [...tasks.backlog, newItem],
    });

    setNewTask({ title: "", description: "", assignee: "", priority: "Medium" });
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              CoreSphere Platform Development
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your team’s tasks and workflow.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <FiSearch className="text-gray-600 cursor-pointer" size={18} />
            <FiBell className="text-gray-600 cursor-pointer" size={18} />
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Main Board */}
        <main className="p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiPlus size={16} />
              Add Task
            </button>
          </div>

          {/* Kanban Columns */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 min-w-[1200px]">
              {[
                { key: "backlog", title: "Backlog" },
                { key: "todo", title: "To Do" },
                { key: "inprogress", title: "In Progress" },
                { key: "done", title: "Done" },
              ].map((column) => (
                <Droppable key={column.key} droppableId={column.key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-72"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                          {column.title}
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            {tasks[column.key].length}
                          </span>
                        </h3>
                        <FiMoreVertical
                          className="text-gray-400 cursor-pointer"
                          size={18}
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        {tasks[column.key].map((task, idx) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-blue-300"
                                    : ""
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-gray-800 text-sm">
                                    {task.title}
                                  </h4>
                                  <FiMoreVertical
                                    className="text-gray-400"
                                    size={16}
                                  />
                                </div>

                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.color}`}
                                    >
                                      {task.priority}
                                    </span>
                                    {task.deletable && (
                                      <FiTrash2 className="text-red-500 text-sm cursor-pointer" />
                                    )}
                                  </div>
                                  {task.avatar && (
                                    <img
                                      src={task.avatar}
                                      alt="avatar"
                                      className="w-7 h-7 rounded-full object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Add a new task
              </h2>
              <FiX
                className="text-gray-500 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Fill in the details below to create a new task for your project.
            </p>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Implement user authentication"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add a more detailed description..."
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Assignee
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignee: e.target.value })
                    }
                  >
                    <option value="">Select an assignee</option>
                    <option value="https://randomuser.me/api/portraits/men/22.jpg">
                      John Doe
                    </option>
                    <option value="https://randomuser.me/api/portraits/women/33.jpg">
                      Sarah Smith
                    </option>
                    <option value="https://randomuser.me/api/portraits/men/44.jpg">
                      David Lee
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateTask}
                className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded-lg mt-3"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
