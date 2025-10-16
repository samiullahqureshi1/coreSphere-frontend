import { useState, useEffect } from "react";
import { FiClock, FiMoreVertical, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../component/Sidebar";

export default function TaskBoard() {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [],
    inprogress: [],
    done: [],
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [projects, setProjects] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignees: [],
    priority: "Medium",
  });

  const primaryBlue = "sky-600";
  const primaryBlueHover = "sky-700";
  const darkIndigo = "indigo-900";
  const lightBg = "bg-gray-50";
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/Employee/getEmployee");
        const data = await res.json();
        if (data.success) setEmployees(data.employees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/api/task/get");
        const data = await res.json();
        if (data.success) {
          const grouped = { backlog: [], todo: [], inprogress: [], done: [] };
          data.tasks.forEach((task) => grouped[task.status].push(task));
          setTasks(grouped);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const movedTask = tasks[sourceCol][source.index];

    const updatedSource = Array.from(tasks[sourceCol]);
    updatedSource.splice(source.index, 1);

    const updatedDest = Array.from(tasks[destCol]);
    updatedDest.splice(destination.index, 0, { ...movedTask, status: destCol });

    const updatedTasks = {
      ...tasks,
      [sourceCol]: updatedSource,
      [destCol]: updatedDest,
    };
    setTasks(updatedTasks);

    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/api/task/updateTaskStatus/${movedTask._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destCol }),
        }
      );

      const data = await res.json();
      if (!data.success) {
        console.error("Status update failed:", data.message);
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert(" Could not update task status in database");
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return alert("Please enter a task title.");

    try {
      const res = await fetch("https://core-sphere-backend.vercel.app/api/task/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();

      if (data.success) {
        setTasks((prev) => ({
          ...prev,
          backlog: [...prev.backlog, data.task],
        }));
        setShowModal(false);
        setNewTask({
          title: "",
          description: "",
          assignees: [],
          priority: "Medium",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Something went wrong creating the task.");
    }
  };
  const handleDeleteTask = async (taskId, columnKey) => {
    console.log("Task ID being deleted:", taskId);

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/api/task/deleteTask/${taskId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      console.log("Delete API response:", data);

      if (data.message === "Task deleted successfully") {
        setTasks((prev) => ({
          ...prev,
          [columnKey]: prev[columnKey].filter((task) => task._id !== taskId),
        }));
      } else {
        alert(data.message || "Failed to delete task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Something went wrong deleting the task.");
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/Project/getProjects");
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          console.error("Failed to load projects:", data.message);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);
  return (
    <div className={`flex flex-col ${lightBg}`}>
      {role === "admin" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-extrabold text-${darkIndigo}`}>
              Task Board
            </h2>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 min-w-[1200px] pb-4">
              {[
                { key: "backlog", title: "Backlog" },
                { key: "todo", title: "To Do" },
                { key: "inprogress", title: "In Progress" },
                { key: "done", title: "Done" },
              ].map((column) => (
                <Droppable key={column.key} droppableId={column.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-80 flex-shrink-0 p-3 rounded-xl transition ${
                        snapshot.isDraggingOver ? "bg-sky-50" : lightBg
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3 p-2 border-b border-sky-200">
                        <h3
                          className={`text-lg text-${darkIndigo} font-extrabold flex items-center gap-2`}
                        >
                          {column.title}
                          <span
                            className={`text-xs bg-sky-200 text-${darkIndigo} px-2 py-0.5 rounded-full font-medium`}
                          >
                            {tasks[column.key].length}
                          </span>
                        </h3>
                        <FiMoreVertical
                          className="text-gray-400 cursor-pointer"
                          size={18}
                        />
                      </div>

                      <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-350px)]">
                        {tasks[column.key].map((task, idx) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white border border-gray-200 rounded-xl p-4 shadow-md transition duration-200 cursor-grab ${
                                  snapshot.isDragging
                                    ? "ring-4 ring-sky-400 shadow-xl opacity-90"
                                    : "hover:shadow-lg"
                                }`}
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowDrawer(true);
                                }}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4
                                      className={`text-md font-semibold text-${darkIndigo}`}
                                    >
                                      {task.title}
                                    </h4>
                                    <p className="text-gray-500 text-sm mt-0.5">
                                      {task.description?.slice(0, 40) || ""}
                                    </p>
                                  </div>
                                  <button className="p-1 text-gray-400 hover:text-sky-600 rounded-full transition">
                                    <FiMoreVertical size={18} />
                                  </button>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                                        task.priority === "High"
                                          ? "bg-red-100 text-red-700"
                                          : task.priority === "Medium"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-emerald-100 text-emerald-700"
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                    <FiTrash2
                                      className="text-red-500 text-sm cursor-pointer hover:text-red-700 transition"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task._id, column.key);
                                      }}
                                    />
                                  </div>

                                  {task.assignees?.length > 0 && (
                                    <div className="flex -space-x-2">
                                      {task.assignees.map((emp, i) => (
                                        <img
                                          key={i}
                                          src={
                                            emp.avatar ||
                                            "https://via.placeholder.com/40"
                                          }
                                          alt={emp.name}
                                          className="w-8 h-8 rounded-full border-2 border-sky-300 object-cover"
                                        />
                                      ))}
                                    </div>
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
          {showDrawer && selectedTask && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                onClick={() => setShowDrawer(false)}
              ></div>

              <div
                className={`fixed top-0 right-0 w-[480px] h-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300`}
              >
                {/* === Header === */}
                <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
                  <div>
                    <h2 className={`text-xl font-bold text-${darkIndigo}`}>
                      Task Details
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Created on{" "}
                      {new Date(selectedTask.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <FiX
                    className="text-gray-500 cursor-pointer hover:text-red-500"
                    size={24}
                    onClick={() => setShowDrawer(false)}
                  />
                </div>

                {/* === Scrollable Content === */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={selectedTask.title}
                      onChange={(e) =>
                        setSelectedTask({
                          ...selectedTask,
                          title: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={selectedTask.description || ""}
                      onChange={(e) =>
                        setSelectedTask({
                          ...selectedTask,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      placeholder="Describe the task..."
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={selectedTask.priority}
                      onChange={(e) =>
                        setSelectedTask({
                          ...selectedTask,
                          priority: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Assigned Employees */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assigned Employees
                    </label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {selectedTask.assignees?.map((emp) => {
                        const empId = emp._id || emp;
                        const empData = employees.find((e) => e._id === empId);
                        if (!empData) return null;
                        return (
                          <div
                            key={empId}
                            className="flex items-center gap-2 bg-sky-100 text-sky-700 font-medium px-3 py-1.5 rounded-full text-sm border border-sky-200"
                          >
                            <img
                              src={
                                empData.avatar ||
                                "https://via.placeholder.com/30"
                              }
                              alt={empData.name}
                              className="w-6 h-6 rounded-full object-cover border border-sky-300"
                            />
                            <span>{empData.name}</span>
                            <FiX
                              size={14}
                              className="cursor-pointer ml-1 text-sky-500 hover:text-red-500"
                              onClick={() =>
                                setSelectedTask({
                                  ...selectedTask,
                                  assignees: selectedTask.assignees.filter(
                                    (item) => (item._id || item) !== empId
                                  ),
                                })
                              }
                            />
                          </div>
                        );
                      })}
                    </div>

                    <select
                      onChange={(e) => {
                        const empId = e.target.value;
                        const isAlreadyAssigned = selectedTask.assignees.some(
                          (item) => (item._id || item) === empId
                        );

                        if (!isAlreadyAssigned && empId) {
                          const empToAdd = employees.find(
                            (e) => e._id === empId
                          );
                          if (empToAdd) {
                            setSelectedTask({
                              ...selectedTask,
                              assignees: [...selectedTask.assignees, empToAdd],
                            });
                          }
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Add Employee to Task
                      </option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} - {emp.role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* === Fixed Footer Button === */}
                <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                  <button
                    onClick={async () => {
                      const res = await fetch(
                        `https://core-sphere-backend.vercel.app/api/task/update/${selectedTask._id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: selectedTask.title,
                            description: selectedTask.description,
                            priority: selectedTask.priority,
                            assignees: selectedTask.assignees.map(
                              (a) => a._id || a
                            ),
                          }),
                        }
                      );
                      const data = await res.json();
                      if (data.success) {
                        alert("Task updated successfully!");
                        setTasks((prevTasks) => {
                          const updatedTasks = { ...prevTasks };
                          for (const col in updatedTasks) {
                            const index = updatedTasks[col].findIndex(
                              (t) => t._id === data.task._id
                            );
                            if (index !== -1) {
                              updatedTasks[col][index] = data.task;
                              break;
                            }
                          }
                          return updatedTasks;
                        });
                        setShowDrawer(false);
                      } else {
                        alert(data.message || "Failed to save task changes.");
                      }
                    }}
                    className={`w-full bg-${darkIndigo} hover:bg-indigo-950 text-white py-3 rounded-xl font-bold text-lg transition shadow-xl`}
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            </>
          )}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-indigo-900">
                      Add New Task
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Fill in task details below
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Implement user authentication"
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add task details..."
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Assign Employees
                    </label>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTask.assignees.map((empId) => {
                        const emp = employees.find((e) => e._id === empId);
                        if (!emp) return null;
                        return (
                          <div
                            key={emp._id}
                            className="flex items-center gap-1 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                          >
                            <img
                              src={
                                emp.avatar || "https://via.placeholder.com/32"
                              }
                              alt={emp.name}
                              className="w-5 h-5 rounded-full border border-white object-cover"
                            />
                            <span>{emp.name}</span>
                            <FiX
                              size={12}
                              className="cursor-pointer hover:text-red-500"
                              onClick={() =>
                                setNewTask({
                                  ...newTask,
                                  assignees: newTask.assignees.filter(
                                    (id) => id !== empId
                                  ),
                                })
                              }
                            />
                          </div>
                        );
                      })}
                    </div>

                    <select
                      onChange={(e) => {
                        const empId = e.target.value;
                        if (empId && !newTask.assignees.includes(empId)) {
                          setNewTask({
                            ...newTask,
                            assignees: [...newTask.assignees, empId],
                          });
                        }
                        e.target.value = "";
                      }}
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                    >
                      <option value="">Select employee to assign...</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} — {emp.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
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

                  <button
                    onClick={handleCreateTask}
                    className={`w-full bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white py-3 rounded-xl font-semibold shadow-md transition`}
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : role === "manager" ? (
        <>
          <ManagerTaskBoard />
        </>
      ) : role === "employee" ? (
        <>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
              <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-bold text-indigo-900">
                    Employee Taskboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    View and manage your assigned tasks efficiently
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">John Doe</p>
                      <p className="text-xs text-gray-500">Employee</p>
                    </div>
                  </div>
                </div>
              </header>

              <main className="flex-1 p-6 overflow-y-auto">
                <EmployeeTaskBoard tasks={tasks} employees={employees} />
              </main>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      )}
    </div>
  );
}
function EmployeeTaskBoard() {
  const [employeeTasks, setEmployeeTasks] = useState({
    pending: [],
    inprogress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = localStorage.getItem("employeeId");

useEffect(() => {
  const fetchEmployeeTasks = async () => {
    try {
      if (!userId) return;

      const res = await fetch(
        `https://core-sphere-backend.vercel.app/api/task/getByEmployee/${userId}`
      );
      const data = await res.json();

      if (data.success && data.tasks) {
        // 👇 Group tasks by the *employee’s* personal status
        const grouped = { pending: [], inprogress: [], done: [] };

        data.tasks.forEach((task) => {
          // Find this employee's assignment in the task
          const myAssignment = task.assignees.find(
            (a) =>
              a.employee === userId ||
              a.employee?._id === userId // handles both object or string
          );

          // Use employee-specific status, fallback to task.status
          const myStatus = myAssignment?.status || task.status || "pending";

          if (myStatus === "pending" || myStatus === "todo" || myStatus === "backlog") {
            grouped.pending.push(task);
          } else if (myStatus === "inprogress") {
            grouped.inprogress.push(task);
          } else if (myStatus === "done") {
            grouped.done.push(task);
          }
        });

        setEmployeeTasks(grouped); // ✅ finally update state
      } else {
        console.error("Error fetching employee tasks:", data.message);
      }
    } catch (err) {
      console.error("Error fetching employee tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployeeTasks();
}, [userId]);


  const handleDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;

  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return;

  const sourceCol = source.droppableId;
  const destCol = destination.droppableId;
  const movedTask = employeeTasks[sourceCol][source.index];
  const userId = localStorage.getItem("employeeId");

  const updatedSource = Array.from(employeeTasks[sourceCol]);
  updatedSource.splice(source.index, 1);

  const updatedDest = Array.from(employeeTasks[destCol]);
  updatedDest.splice(destination.index, 0, { ...movedTask, status: destCol });

  const updatedTasks = {
    ...employeeTasks,
    [sourceCol]: updatedSource,
    [destCol]: updatedDest,
  };
  setEmployeeTasks(updatedTasks);

  try {
    const res = await fetch(
      `https://core-sphere-backend.vercel.app/api/task/updateEmployeeTaskStatus/${movedTask._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: userId,
          status: destCol,    
        }),
      }
    );

    const data = await res.json();
    if (!data.success) {
      console.error("Error updating task:", data.message);
      alert(data.message || " Could not update task status in database");
    }
  } catch (error) {
    console.error("Failed to update task status:", error);
    alert(" Could not update task status in database");
  }
};


  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}h ${m
      .toString()
      .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading your tasks...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">My Tasks</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 min-w-[1000px] overflow-x-auto pb-4">
          {[
            { key: "pending", title: "Pending" },
            { key: "inprogress", title: "In Progress" },
            { key: "done", title: "Done" },
          ].map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-80 flex-shrink-0 p-3 rounded-xl transition ${
                    snapshot.isDraggingOver ? "bg-sky-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3 border-b border-sky-200 p-1">
                    <h3 className="font-bold text-indigo-900 capitalize">
                      {column.title}
                    </h3>
                    <span className="text-xs bg-sky-200 text-indigo-900 px-2 py-0.5 rounded-full">
                      {employeeTasks[column.key].length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                    {employeeTasks[column.key].length > 0 ? (
                      employeeTasks[column.key].map((task, idx) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          idx={idx}
                          userId={userId}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-3">
                        No tasks here.
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

function TaskCard({ task, idx, userId }) {
  const [elapsed, setElapsed] = useState(0);
  const myEntry = task.timeTracking?.find(
    (t) => t.employeeId?._id === userId || t.employeeId === userId
  );
  const baseTime = myEntry?.totalTime || 0;
  const isRunning = !!myEntry?.lastStartTime;

  useEffect(() => {
    let interval;
    if (isRunning && myEntry?.lastStartTime) {
      interval = setInterval(() => {
        const diff =
          (Date.now() - new Date(myEntry.lastStartTime).getTime()) / 1000;
        setElapsed(baseTime + diff);
      }, 1000);
    } else {
      setElapsed(baseTime);
    }
    return () => clearInterval(interval);
  }, [isRunning, baseTime, myEntry]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}h ${m
      .toString()
      .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <Draggable key={task._id} draggableId={task._id} index={idx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-gray-200 rounded-xl p-4 shadow-md transition duration-200 cursor-grab ${
            snapshot.isDragging
              ? "ring-4 ring-sky-400 opacity-90"
              : "hover:shadow-lg"
          }`}
        >
          <h4 className="font-semibold text-indigo-900">{task.title}</h4>
          <p className="text-sm text-gray-500 mt-1">
            {task.description || "No description"}
          </p>
          <div className="mt-2 text-xs text-gray-400">
            Priority: <span className="font-medium">{task.priority}</span>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border ${
                isRunning
                  ? "bg-green-50 border-green-300 text-green-700 animate-pulse"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <FiClock
                className={`${isRunning ? "text-green-600" : "text-gray-500"}`}
                size={16}
              />
              <span className="font-mono text-xs">{formatTime(elapsed)}</span>
            </div>

            {isRunning ? (
              <button
                onClick={async () => {
                  await fetch(
                    `https://core-sphere-backend.vercel.app/api/task/stopTimer/${task._id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ employeeId: userId }),
                    }
                  );

                  window.location.reload();
                }}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={async () => {
                  await fetch(
                    `https://core-sphere-backend.vercel.app/api/task/startTimer/${task._id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ employeeId: userId }),
                    }
                  );

                  window.location.reload();
                }}
                className="text-white bg-green-500 hover:bg-green-600 px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Start
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
function ManagerTaskBoard() {
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [],
    inprogress: [],
    done: [],
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignees: [],
    priority: "Medium",
  });

  const primaryBlue = "sky-600";
  const primaryBlueHover = "sky-700";
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/Project/getProjects");
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          console.error("Failed to load projects:", data.message);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/Employee/getEmployee");
        const data = await res.json();
        if (data.success) setEmployees(data.employees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/api/task/get");
        const data = await res.json();
        if (data.success) {
          const grouped = { backlog: [], todo: [], inprogress: [], done: [] };
          data.tasks.forEach((task) => grouped[task.status].push(task));
          setTasks(grouped);
        }
      } catch (err) {
        console.error("Error fetching manager tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return alert("Please enter a task title.");

    try {
      const res = await fetch("https://core-sphere-backend.vercel.app/api/task/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: newTask.status,
          assignees: newTask.assignees,
          projectId: newTask.project,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTasks((prev) => ({
          ...prev,
          backlog: [...prev.backlog, data.task],
        }));

        setShowModal(false);
        setNewTask({
          title: "",
          description: "",
          assignees: [],
          priority: "Medium",
          project: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Something went wrong creating the task.");
    }
  };

  const handleDeleteTask = async (taskId, columnKey) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/api/task/deleteTask/${taskId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.message === "Task deleted successfully") {
        setTasks((prev) => ({
          ...prev,
          [columnKey]: prev[columnKey].filter((task) => task._id !== taskId),
        }));
      } else {
        alert(data.message || "Failed to delete task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const movedTask = tasks[sourceCol][source.index];
    const updatedSource = Array.from(tasks[sourceCol]);
    updatedSource.splice(source.index, 1);

    const updatedDest = Array.from(tasks[destCol]);
    updatedDest.splice(destination.index, 0, { ...movedTask, status: destCol });

    const updatedTasks = {
      ...tasks,
      [sourceCol]: updatedSource,
      [destCol]: updatedDest,
    };
    setTasks(updatedTasks);

    try {
      await fetch(
        `https://core-sphere-backend.vercel.app/api/task/updateTaskStatus/${movedTask._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destCol }),
        }
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">
              Manager Taskboard
            </h1>
            <p className="text-sm text-gray-500">
              View, add, and manage all company tasks
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-2 bg-${primaryBlue} text-white px-4 py-2 rounded-lg hover:bg-${primaryBlueHover} transition font-semibold`}
          >
            <FiPlus /> Add Task
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 min-w-[1200px] pb-4">
              {["backlog", "todo", "inprogress", "done"].map((statusKey) => (
                <Droppable key={statusKey} droppableId={statusKey}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-80 flex-shrink-0 p-3 rounded-xl transition ${
                        snapshot.isDraggingOver ? "bg-sky-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3 p-2 border-b border-sky-200">
                        <h3 className="text-lg text-indigo-900 font-bold capitalize">
                          {statusKey}
                        </h3>
                        <span className="text-xs bg-sky-200 text-indigo-900 px-2 py-0.5 rounded-full font-medium">
                          {tasks[statusKey].length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                        {tasks[statusKey].length > 0 ? (
                          tasks[statusKey].map((task, idx) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={idx}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border border-gray-200 rounded-xl p-4 shadow-md cursor-grab transition ${
                                    snapshot.isDragging
                                      ? "ring-4 ring-sky-400 opacity-90"
                                      : "hover:shadow-lg"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h4 className="font-semibold text-indigo-900">
                                        {task.title}
                                      </h4>
                                      <p className="text-sm text-gray-500 mt-1">
                                        {task.description?.slice(0, 60) || ""}
                                      </p>
                                    </div>
                                    <FiTrash2
                                      className="text-red-500 cursor-pointer hover:text-red-700"
                                      onClick={() =>
                                        handleDeleteTask(task._id, statusKey)
                                      }
                                    />
                                  </div>

                                  <div className="flex justify-between items-center text-xs mt-2">
                                    <span
                                      className={`font-semibold px-3 py-1 rounded-full ${
                                        task.priority === "High"
                                          ? "bg-red-100 text-red-700"
                                          : task.priority === "Medium"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {task.priority}
                                    </span>

                                    <div className="flex -space-x-2">
                                      {task.assignees?.map((emp) => {
                                        const found = employees.find(
                                          (e) => e._id === (emp._id || emp)
                                        );
                                        return (
                                          <img
                                            key={emp._id || emp}
                                            src={
                                              found?.avatar ||
                                              "https://via.placeholder.com/40"
                                            }
                                            alt={found?.name}
                                            className="w-7 h-7 rounded-full border-2 border-sky-300 object-cover"
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <p className="text-center text-gray-400 text-sm py-3">
                            No tasks here.
                          </p>
                        )}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">
                  Add New Task
                </h2>
                <p className="text-gray-500 text-sm">
                  Fill in task details below
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>

                {newTask.project && (
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const proj = projects.find(
                        (p) => p._id === newTask.project
                      );
                      if (!proj) return null;
                      return (
                        <div className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          <span>{proj.name}</span>
                          <FiX
                            size={12}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() =>
                              setNewTask({ ...newTask, project: "" })
                            }
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}

                {!newTask.project && (
                  <select
                    onChange={(e) => {
                      const projId = e.target.value;
                      if (projId) {
                        setNewTask({ ...newTask, project: projId });
                      }
                      e.target.value = "";
                    }}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  >
                    <option value="">Select Project...</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Implement user authentication"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={newTask.status || "backlog"}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add task details..."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Assign Employees
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                  {newTask.assignees.map((empId) => {
                    const emp = employees.find((e) => e._id === empId);
                    if (!emp) return null;
                    return (
                      <div
                        key={emp._id}
                        className="flex items-center gap-1 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                      >
                        <img
                          src={emp.avatar || "https://via.placeholder.com/32"}
                          alt={emp.name}
                          className="w-5 h-5 rounded-full border border-white object-cover"
                        />
                        <span>{emp.name}</span>
                        <FiX
                          size={12}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() =>
                            setNewTask({
                              ...newTask,
                              assignees: newTask.assignees.filter(
                                (id) => id !== empId
                              ),
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <select
                  onChange={(e) => {
                    const empId = e.target.value;
                    if (empId && !newTask.assignees.includes(empId)) {
                      setNewTask({
                        ...newTask,
                        assignees: [...newTask.assignees, empId],
                      });
                    }
                    e.target.value = "";
                  }}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="">Select employee to assign...</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} — {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
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

              <button
                onClick={handleCreateTask}
                className={`w-full bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white py-3 rounded-xl font-semibold shadow-md transition`}
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
