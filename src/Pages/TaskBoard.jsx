// // import { useState, useEffect } from "react";
// // import Sidebar from "../component/Sidebar";
// // import {
// //   FiBell,
// //   FiSearch,
// //   FiMoreVertical,
// //   FiPlus,
// //   FiTrash2,
// //   FiX,
// // } from "react-icons/fi";
// // import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// // export default function TaskBoard() {
// //   const [showModal, setShowModal] = useState(false);
// //   const [employees, setEmployees] = useState([]);
// //   const [tasks, setTasks] = useState({
// //     backlog: [],
// //     todo: [],
// //     inprogress: [],
// //     done: [],
// //   });
// //   const [selectedTask, setSelectedTask] = useState(null);
// //   const [showDrawer, setShowDrawer] = useState(false);
// //   const [newSubtask, setNewSubtask] = useState("");
// //   const [newTask, setNewTask] = useState({
// //     title: "",
// //     description: "",
// //     assignees: [],
// //     priority: "Medium",
// //   });

// //   // === FETCH EMPLOYEES ===
// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const res = await fetch("http://localhost:5000/Employee/getEmployee");
// //         const data = await res.json();
// //         if (data.success) setEmployees(data.employees);
// //       } catch (err) {
// //         console.error("Error fetching employees:", err);
// //       }
// //     };

// //     const fetchTasks = async () => {
// //       try {
// //         const res = await fetch("http://localhost:5000/api/task/get");
// //         const data = await res.json();
// //         if (data.success) {
// //           const grouped = { backlog: [], todo: [], inprogress: [], done: [] };
// //           data.tasks.forEach((task) => grouped[task.status].push(task));
// //           setTasks(grouped);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching tasks:", err);
// //       }
// //     };

// //     fetchEmployees();
// //     fetchTasks();
// //   }, []);

// //   // === HANDLE DRAG END (Kanban Move) ===
// //   const handleDragEnd = async (result) => {
// //     const { source, destination } = result;
// //     if (!destination) return;

// //     const sourceCol = source.droppableId;
// //     const destCol = destination.droppableId;
// //     const movedTask = tasks[sourceCol][source.index];

// //     const updatedSource = Array.from(tasks[sourceCol]);
// //     updatedSource.splice(source.index, 1);

// //     const updatedDest = Array.from(tasks[destCol]);
// //     updatedDest.splice(destination.index, 0, movedTask);

// //     const updatedTasks = {
// //       ...tasks,
// //       [sourceCol]: updatedSource,
// //       [destCol]: updatedDest,
// //     };

// //     setTasks(updatedTasks);

// //     // Optional: Update status in DB
// //     try {
// //       await fetch(
// //         `http://localhost:5000/api/task/updateStatus/${movedTask._id}`,
// //         {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ status: destCol }),
// //         }
// //       );
// //     } catch (error) {
// //       console.error("Failed to update task status:", error);
// //     }
// //   };

// //   // === CREATE TASK ===
// //   const handleCreateTask = async () => {
// //     if (!newTask.title.trim()) {
// //       return alert("Please enter a task title.");
// //     }

// //     try {
// //       const res = await fetch("http://localhost:5000/api/task/add", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(newTask),
// //       });
// //       const data = await res.json();

// //       if (data.success) {
// //         setTasks((prev) => ({
// //           ...prev,
// //           backlog: [...prev.backlog, data.task],
// //         }));
// //         setShowModal(false);
// //         setNewTask({
// //           title: "",
// //           description: "",
// //           assignees: [],
// //           priority: "Medium",
// //         });
// //       } else {
// //         alert(data.message);
// //       }
// //     } catch (error) {
// //       console.error("Error creating task:", error);
// //       alert("Something went wrong creating the task.");
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       <Sidebar />

// //       <div className="flex-1 flex flex-col">
// //         {/* Top Navbar */}
// //         <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-800">
// //               CoreSphere Platform Development
// //             </h1>
// //             <p className="text-gray-500 text-sm">
// //               Manage your team’s tasks and workflow.
// //             </p>
// //           </div>

// //           <div className="flex items-center gap-4">
// //             <FiSearch className="text-gray-600 cursor-pointer" size={18} />
// //             <FiBell className="text-gray-600 cursor-pointer" size={18} />
// //             <img
// //               src="https://randomuser.me/api/portraits/men/32.jpg"
// //               alt="Profile"
// //               className="w-9 h-9 rounded-full object-cover"
// //             />
// //           </div>
// //         </header>

// //         {/* Main Board */}
// //         <main className="p-6 overflow-x-auto">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
// //             <button
// //               onClick={() => setShowModal(true)}
// //               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
// //             >
// //               <FiPlus size={16} />
// //               Add Task
// //             </button>
// //           </div>

// //           {/* Kanban Columns */}
// //           <DragDropContext onDragEnd={handleDragEnd}>
// //             <div className="flex gap-6 min-w-[1200px]">
// //               {[
// //                 { key: "backlog", title: "Backlog" },
// //                 { key: "todo", title: "To Do" },
// //                 { key: "inprogress", title: "In Progress" },
// //                 { key: "done", title: "Done" },
// //               ].map((column) => (
// //                 <Droppable key={column.key} droppableId={column.key}>
// //                   {(provided) => (
// //                     <div
// //                       ref={provided.innerRef}
// //                       {...provided.droppableProps}
// //                       className="w-72"
// //                     >
// //                       <div className="flex justify-between items-center mb-3">
// //                         <h3 className="font-semibold text-gray-700 flex items-center gap-2">
// //                           {column.title}
// //                           <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
// //                             {tasks[column.key].length}
// //                           </span>
// //                         </h3>
// //                         <FiMoreVertical
// //                           className="text-gray-400 cursor-pointer"
// //                           size={18}
// //                         />
// //                       </div>

// //                       <div className="flex flex-col gap-3">
// //                         {tasks[column.key].map((task, idx) => (
// //                           <Draggable
// //                             key={task._id}
// //                             draggableId={task._id}
// //                             index={idx}
// //                           >
// //                             {(provided, snapshot) => (
// //                               <div
// //                                 ref={provided.innerRef}
// //                                 {...provided.draggableProps}
// //                                 {...provided.dragHandleProps}
// //                                 onClick={() => {
// //                                   setSelectedTask(task);
// //                                   setShowDrawer(true);
// //                                 }}
// //                                 className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition ${
// //                                   snapshot.isDragging
// //                                     ? "shadow-lg ring-2 ring-blue-300"
// //                                     : ""
// //                                 }`}
// //                               >
// //                                 <div className="flex justify-between items-start mb-3">
// //                                   <h4 className="font-semibold text-gray-800 text-sm">
// //                                     {task.title}
// //                                   </h4>
// //                                   <FiMoreVertical
// //                                     className="text-gray-400"
// //                                     size={16}
// //                                   />
// //                                 </div>

// //                                 <div className="flex justify-between items-center">
// //                                   <div className="flex items-center gap-2">
// //                                     <span
// //                                       className={`text-xs px-2 py-0.5 rounded-full font-medium ${
// //                                         task.priority === "High"
// //                                           ? "bg-red-100 text-red-800"
// //                                           : task.priority === "Medium"
// //                                           ? "bg-yellow-100 text-yellow-800"
// //                                           : "bg-green-100 text-green-800"
// //                                       }`}
// //                                     >
// //                                       {task.priority}
// //                                     </span>
// //                                     <FiTrash2 className="text-red-500 text-sm cursor-pointer" />
// //                                   </div>
// //                                   {task.assignees?.length > 0 && (
// //                                     <div className="flex -space-x-2">
// //                                       {task.assignees.map((emp, i) => (
// //                                         <img
// //                                           key={i}
// //                                           src={emp.avatar}
// //                                           alt={emp.name}
// //                                           className="w-7 h-7 rounded-full border-2 border-white object-cover"
// //                                         />
// //                                       ))}
// //                                     </div>
// //                                   )}
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </Draggable>
// //                         ))}
// //                         {provided.placeholder}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </Droppable>
// //               ))}
// //             </div>
// //           </DragDropContext>
// //         </main>
// //       </div>

// //       {/* MODAL */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
// //             <div className="flex justify-between items-center mb-3">
// //               <h2 className="text-lg font-semibold text-gray-800">
// //                 Add a new task
// //               </h2>
// //               <FiX
// //                 className="text-gray-500 cursor-pointer"
// //                 onClick={() => setShowModal(false)}
// //               />
// //             </div>
// //             <p className="text-sm text-gray-500 mb-4">
// //               Fill in the details below to create a new task for your project.
// //             </p>

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Title
// //                 </label>
// //                 <input
// //                   type="text"
// //                   placeholder="e.g. Implement user authentication"
// //                   className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
// //                   value={newTask.title}
// //                   onChange={(e) =>
// //                     setNewTask({ ...newTask, title: e.target.value })
// //                   }
// //                 />
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Description
// //                 </label>
// //                 <textarea
// //                   rows={3}
// //                   placeholder="Add a more detailed description..."
// //                   className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
// //                   value={newTask.description}
// //                   onChange={(e) =>
// //                     setNewTask({ ...newTask, description: e.target.value })
// //                   }
// //                 />
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Assign Employees
// //                 </label>
// //                 <select
// //                   multiple
// //                   className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
// //                   value={newTask.assignees}
// //                   onChange={(e) =>
// //                     setNewTask({
// //                       ...newTask,
// //                       assignees: Array.from(
// //                         e.target.selectedOptions,
// //                         (option) => option.value
// //                       ),
// //                     })
// //                   }
// //                 >
// //                   {employees.map((emp) => (
// //                     <option key={emp._id} value={emp._id}>
// //                       {emp.name} - {emp.role}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 <p className="text-xs text-gray-400 mt-1">
// //                   Hold CTRL or CMD to select multiple employees.
// //                 </p>
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Priority
// //                 </label>
// //                 <select
// //                   className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
// //                   value={newTask.priority}
// //                   onChange={(e) =>
// //                     setNewTask({ ...newTask, priority: e.target.value })
// //                   }
// //                 >
// //                   <option>Low</option>
// //                   <option>Medium</option>
// //                   <option>High</option>
// //                 </select>
// //               </div>

// //               <button
// //                 onClick={handleCreateTask}
// //                 className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded-lg mt-3"
// //               >
// //                 Create Task
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       {showDrawer && selectedTask && (
// //   <>
// //     <div
// //       className="fixed inset-0 bg-black bg-opacity-30 z-40"
// //       onClick={() => setShowDrawer(false)}
// //     ></div>

// //     <div className="fixed top-0 right-0 w-[420px] h-full bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300">
// //       {/* === Header === */}
// //       <div className="flex justify-between items-center border-b px-6 py-4">
// //         <div>
// //           <h2 className="text-lg font-semibold text-gray-800">Task Details</h2>
// //           <p className="text-xs text-gray-500">
// //             Created on {new Date(selectedTask.createdAt).toLocaleDateString()}
// //           </p>
// //         </div>
// //         <FiX
// //           className="text-gray-500 cursor-pointer"
// //           size={22}
// //           onClick={() => setShowDrawer(false)}
// //         />
// //       </div>

// //       {/* === Content === */}
// //       <div className="p-6 space-y-6">
// //         {/* Title */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Title</label>
// //           <input
// //             type="text"
// //             value={selectedTask.title}
// //             onChange={(e) =>
// //               setSelectedTask({ ...selectedTask, title: e.target.value })
// //             }
// //             className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
// //           />
// //         </div>

// //         {/* Description */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">
// //             Description
// //           </label>
// //           <textarea
// //             rows={3}
// //             value={selectedTask.description || ""}
// //             onChange={(e) =>
// //               setSelectedTask({
// //                 ...selectedTask,
// //                 description: e.target.value,
// //               })
// //             }
// //             className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
// //             placeholder="Describe the task..."
// //           />
// //         </div>

// //         {/* Priority */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">
// //             Priority
// //           </label>
// //           <select
// //             value={selectedTask.priority}
// //             onChange={(e) =>
// //               setSelectedTask({
// //                 ...selectedTask,
// //                 priority: e.target.value,
// //               })
// //             }
// //             className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
// //           >
// //             <option>Low</option>
// //             <option>Medium</option>
// //             <option>High</option>
// //           </select>
// //         </div>

// //         {/* Assigned Employees */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Assigned Employees
// //           </label>
// //           <div className="flex flex-wrap gap-2 mb-2">
// //             {selectedTask.assignees?.map((empId) => {
// //               const emp = employees.find((e) => e._id === empId);
// //               if (!emp) return null;
// //               return (
// //                 <div
// //                   key={emp._id}
// //                   className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
// //                 >
// //                   <img
// //                     src={emp.avatar || "https://via.placeholder.com/30"}
// //                     alt={emp.name}
// //                     className="w-5 h-5 rounded-full"
// //                   />
// //                   <span>{emp.name}</span>
// //                   <FiX
// //                     size={12}
// //                     className="cursor-pointer ml-1 hover:text-red-500"
// //                     onClick={() =>
// //                       setSelectedTask({
// //                         ...selectedTask,
// //                         assignees: selectedTask.assignees.filter(
// //                           (id) => id !== empId
// //                         ),
// //                       })
// //                     }
// //                   />
// //                 </div>
// //               );
// //             })}
// //           </div>

// //           <select
// //             onChange={(e) => {
// //               const empId = e.target.value;
// //               if (!selectedTask.assignees.includes(empId) && empId) {
// //                 setSelectedTask({
// //                   ...selectedTask,
// //                   assignees: [...selectedTask.assignees, empId],
// //                 });
// //               }
// //             }}
// //             className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
// //           >
// //             <option value="">Add Employee</option>
// //             {employees.map((emp) => (
// //               <option key={emp._id} value={emp._id}>
// //                 {emp.name} - {emp.role}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* Subtasks */}
// //         <div>
// //           <div className="flex justify-between items-center mb-2">
// //             <label className="block text-sm font-medium text-gray-700">
// //               Subtasks
// //             </label>
// //             <span className="text-xs text-gray-500">
// //               {selectedTask.subtasks?.length || 0} total
// //             </span>
// //           </div>

// //           {/* Subtask list */}
// //           {selectedTask.subtasks?.length > 0 ? (
// //             <ul className="space-y-2">
// //               {selectedTask.subtasks.map((st, i) => (
// //                 <li
// //                   key={i}
// //                   className="flex justify-between items-center border rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition"
// //                 >
// //                   <div>
// //                     <p
// //                       className={`text-sm font-medium ${
// //                         st.completed ? "line-through text-gray-400" : ""
// //                       }`}
// //                     >
// //                       {st.title}
// //                     </p>
// //                     {st.assignee && (
// //                       <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
// //                         <img
// //                           src={
// //                             employees.find((e) => e._id === st.assignee)?.avatar
// //                           }
// //                           alt=""
// //                           className="w-4 h-4 rounded-full"
// //                         />
// //                         <span>
// //                           {
// //                             employees.find((e) => e._id === st.assignee)?.name
// //                           }
// //                         </span>
// //                       </div>
// //                     )}
// //                   </div>

// //                   <input
// //                     type="checkbox"
// //                     checked={st.completed}
// //                     onChange={async (e) => {
// //                       const res = await fetch(
// //                         `http://localhost:5000/api/task/update/${selectedTask._id}`,
// //                         {
// //                           method: "PUT",
// //                           headers: { "Content-Type": "application/json" },
// //                           body: JSON.stringify({
// //                             subtasks: selectedTask.subtasks.map((s, idx) =>
// //                               idx === i
// //                                 ? { ...s, completed: e.target.checked }
// //                                 : s
// //                             ),
// //                           }),
// //                         }
// //                       );
// //                       const data = await res.json();
// //                       if (data.success) setSelectedTask(data.task);
// //                     }}
// //                   />
// //                 </li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p className="text-sm text-gray-400">No subtasks yet.</p>
// //           )}

// //           {/* Add new subtask */}
// //           <div className="border rounded-lg p-3 mt-3">
// //             <p className="text-sm font-medium text-gray-700 mb-2">Add New Subtask</p>
// //             <input
// //               type="text"
// //               placeholder="Subtask title..."
// //               value={newSubtask}
// //               onChange={(e) => setNewSubtask(e.target.value)}
// //               className="w-full border rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
// //             />
// //             <select
// //               onChange={(e) =>
// //                 setSelectedTask({ ...selectedTask, subAssignee: e.target.value })
// //               }
// //               className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
// //             >
// //               <option value="">Assign employee</option>
// //               {employees.map((emp) => (
// //                 <option key={emp._id} value={emp._id}>
// //                   {emp.name} - {emp.role}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               onClick={async () => {
// //                 if (!newSubtask.trim()) return;
// //                 const res = await fetch(
// //                   `http://localhost:5000/api/task/subtask/${selectedTask._id}`,
// //                   {
// //                     method: "POST",
// //                     headers: { "Content-Type": "application/json" },
// //                     body: JSON.stringify({
// //                       title: newSubtask,
// //                       assignee: selectedTask.subAssignee || null,
// //                     }),
// //                   }
// //                 );
// //                 const data = await res.json();
// //                 if (data.success) {
// //                   setSelectedTask(data.task);
// //                   setNewSubtask("");
// //                 }
// //               }}
// //               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
// //             >
// //               Add Subtask
// //             </button>
// //           </div>
// //         </div>

// //         {/* Save Task Button */}
// //         <button
// //           onClick={async () => {
// //             const res = await fetch(
// //               `http://localhost:5000/api/task/update/${selectedTask._id}`,
// //               {
// //                 method: "PUT",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify(selectedTask),
// //               }
// //             );
// //             const data = await res.json();
// //             if (data.success) {
// //               alert("Task updated!");
// //               setShowDrawer(false);
// //             }
// //           }}
// //           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-4 font-medium"
// //         >
// //           Save Changes
// //         </button>
// //       </div>
// //     </div>
// //   </>
// // )}

// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import Sidebar from "../component/Sidebar";
// import {
//   FiBell,
//   FiSearch,
//   FiMoreVertical,
//   FiPlus,
//   FiTrash2,
//   FiX,
// } from "react-icons/fi";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// export default function TaskBoard() {
//   const [showModal, setShowModal] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [tasks, setTasks] = useState({
//     backlog: [],
//     todo: [],
//     inprogress: [],
//     done: [],
//   });
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showDrawer, setShowDrawer] = useState(false);
//   const [newSubtask, setNewSubtask] = useState("");
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     assignees: [],
//     priority: "Medium",
//   });

//   // ===== Theme Colors & Styles =====
//   const primaryBlue = "sky-600";
//   const primaryBlueHover = "sky-700";
//   const darkIndigo = "indigo-900";
//   const lightBg = "bg-gray-50";

//   // === FETCH EMPLOYEES ===
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5000/Employee/getEmployee"
//         );
//         const data = await res.json();
//         if (data.success) setEmployees(data.employees);
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//       }
//     };

//     const fetchTasks = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5000/api/task/get"
//         );
//         const data = await res.json();
//         if (data.success) {
//           const grouped = { backlog: [], todo: [], inprogress: [], done: [] };
//           data.tasks.forEach((task) => grouped[task.status].push(task));
//           setTasks(grouped);
//         }
//       } catch (err) {
//         console.error("Error fetching tasks:", err);
//       }
//     };

//     fetchEmployees();
//     fetchTasks();
//   }, []);

//   // === HANDLE DRAG END (Kanban Move) ===
//   const handleDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     )
//       return;

//     const sourceCol = source.droppableId;
//     const destCol = destination.droppableId;
//     const movedTask = tasks[sourceCol][source.index];

//     const updatedSource = Array.from(tasks[sourceCol]);
//     updatedSource.splice(source.index, 1);

//     const updatedDest = Array.from(tasks[destCol]);
//     updatedDest.splice(destination.index, 0, movedTask);

//     const updatedTasks = {
//       ...tasks,
//       [sourceCol]: updatedSource,
//       [destCol]: updatedDest,
//     };

//     setTasks(updatedTasks);

//     // Optional: Update status in DB
//     try {
//       await fetch(
//         `http://localhost:5000/api/task/updateStatus/${movedTask._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status: destCol }),
//         }
//       );
//     } catch (error) {
//       console.error("Failed to update task status:", error);
//     }
//   };

//   // === CREATE TASK ===
//   const handleCreateTask = async () => {
//     if (!newTask.title.trim()) {
//       return alert("Please enter a task title.");
//     }

//     // Convert selected assignee IDs to objects with avatar if they are not already
//     const assigneesWithDetails = newTask.assignees.map((id) => {
//       const emp = employees.find((e) => e._id === id);
//       return {
//         _id: id,
//         name: emp?.name || "Unknown",
//         avatar: emp?.avatar || "https://via.placeholder.com/30",
//       };
//     });

//     try {
//       const res = await fetch("http://localhost:5000/api/task/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...newTask, assignees: assigneesWithDetails }),
//       });
//       const data = await res.json();

//       if (data.success) {
//         // Task returned from API should include assignee objects, ensuring compatibility with card rendering
//         setTasks((prev) => ({
//           ...prev,
//           backlog: [...prev.backlog, data.task],
//         }));
//         setShowModal(false);
//         setNewTask({
//           title: "",
//           description: "",
//           assignees: [],
//           priority: "Medium",
//         });
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error creating task:", error);
//       alert("Something went wrong creating the task.");
//     }
//   };

//   // Helper function to get priority colors
//   const getPriorityClasses = (priority) => {
//     switch (priority) {
//       case "High":
//         return "bg-red-100 text-red-700";
//       case "Medium":
//         return "bg-amber-100 text-amber-700";
//       case "Low":
//         return "bg-emerald-100 text-emerald-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className={`flex h-screen ${lightBg}`}>
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar (Themed) */}
//         <header className="flex justify-between items-center bg-white px-8 py-5 shadow-lg z-10">
//           <div>
//             <h1 className={`text-3xl font-extrabold text-${darkIndigo}`}>
//               CoreSphere Task Board
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Manage your team’s tasks and workflow.
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <FiSearch className="text-gray-600 cursor-pointer hover:text-${primaryBlueHover}" size={20} />
//             <FiBell className="text-gray-600 cursor-pointer hover:text-${primaryBlueHover}" size={20} />
//             <img
//               src="https://randomuser.me/api/portraits/men/32.jpg"
//               alt="Profile"
//               className={`w-9 h-9 rounded-full object-cover border-2 border-${primaryBlue}`}
//             />
//           </div>
//         </header>

//         {/* Main Board */}
//         <main className="p-8 overflow-x-auto flex-1">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-xl font-bold text-${darkIndigo}`}>Project Tasks</h2>
//             <button
//               onClick={() => setShowModal(true)}
//               className={`flex items-center gap-2 bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white px-5 py-2.5 rounded-xl transition font-semibold shadow-md`}
//             >
//               <FiPlus size={16} />
//               Add New Task
//             </button>
//           </div>

//           {/* Kanban Columns */}
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <div className="flex gap-6 min-w-[1400px] h-full">
//               {[
//                 { key: "backlog", title: "Backlog", color: "border-gray-400" },
//                 { key: "todo", title: "To Do", color: "border-sky-400" },
//                 { key: "inprogress", title: "In Progress", color: "border-amber-400" },
//                 { key: "done", title: "Done", color: "border-emerald-400" },
//               ].map((column) => (
//                 <Droppable key={column.key} droppableId={column.key}>
//                   {(provided, snapshot) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className={`w-96 flex-shrink-0 p-3 rounded-xl transition ${
//                         snapshot.isDraggingOver ? "bg-sky-100" : lightBg
//                       }`}
//                     >
//                       <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
//                         <h3 className={`font-extrabold text-${darkIndigo} flex items-center gap-2 text-lg`}>
//                           {column.title}
//                           <span className={`text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold`}>
//                             {tasks[column.key].length}
//                           </span>
//                         </h3>
//                         <FiMoreVertical
//                           className="text-gray-400 cursor-pointer hover:text-${primaryBlueHover}"
//                           size={20}
//                         />
//                       </div>

//                       <div className="flex flex-col gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
//                         {tasks[column.key].map((task, idx) => (
//                           <Draggable
//                             key={task._id}
//                             draggableId={task._id}
//                             index={idx}
//                           >
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 onClick={() => {
//                                   setSelectedTask(task);
//                                   setShowDrawer(true);
//                                 }}
//                                 className={`bg-white p-4 rounded-xl shadow-md border-t-4 ${column.color} hover:shadow-lg cursor-grab transition duration-200 ${
//                                   snapshot.isDragging
//                                     ? "shadow-2xl ring-4 ring-sky-300 transform scale-[1.02] opacity-90"
//                                     : ""
//                                 }`}
//                               >
//                                 <div className="flex justify-between items-start mb-3">
//                                   <h4 className={`font-semibold text-gray-800 text-md pr-4`}>
//                                     {task.title}
//                                   </h4>
//                                   <FiMoreVertical
//                                     className="text-gray-400"
//                                     size={16}
//                                   />
//                                 </div>

//                                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                                   <div className="flex items-center gap-2">
//                                     <span
//                                       className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${getPriorityClasses(task.priority)}`}
//                                     >
//                                       {task.priority}
//                                     </span>
//                                     {/* <FiTrash2 className="text-red-500 text-sm cursor-pointer hover:text-red-700" /> */}
//                                   </div>
//                                   {task.assignees?.length > 0 && (
//                                     <div className="flex -space-x-2">
//                                       {task.assignees.map((emp, i) => (
//                                         <img
//                                           key={i}
//                                           // Check if emp is full object or just ID string
//                                           src={emp.avatar || employees.find(e => e._id === emp)?.[0]?.avatar || "https://via.placeholder.com/30"}
//                                           alt={emp.name || "Assignee"}
//                                           className={`w-7 h-7 rounded-full border-2 border-white object-cover ring-2 ring-sky-300`}
//                                           title={emp.name || "Assignee"}
//                                         />
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     </div>
//                   )}
//                 </Droppable>
//               ))}
//             </div>
//           </DragDropContext>
//         </main>
//       </div>

//       {/* MODAL (Themed) */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform transition duration-300 scale-100">
//             <div className="flex justify-between items-center mb-5">
//               <h2 className={`text-2xl font-bold text-${darkIndigo}`}>
//                 Add a New Task
//               </h2>
//               <FiX
//                 className="text-gray-500 cursor-pointer hover:text-red-500"
//                 size={22}
//                 onClick={() => setShowModal(false)}
//               />
//             </div>
//             <p className="text-sm text-gray-500 mb-6">
//               Fill in the details below to create a new task for your project.
//             </p>

//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Implement user authentication"
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//                   value={newTask.title}
//                   onChange={(e) =>
//                     setNewTask({ ...newTask, title: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   rows={3}
//                   placeholder="Add a more detailed description..."
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//                   value={newTask.description}
//                   onChange={(e) =>
//                     setNewTask({ ...newTask, description: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1">
//                   Assign Employees
//                 </label>
//                 <select
//                   multiple
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryBlue} outline-none transition h-32"
//                   value={newTask.assignees}
//                   onChange={(e) =>
//                     setNewTask({
//                       ...newTask,
//                       // Capture only the IDs/values from selected options
//                       assignees: Array.from(
//                         e.target.selectedOptions,
//                         (option) => option.value
//                       ),
//                     })
//                   }
//                 >
//                   {employees.map((emp) => (
//                     <option key={emp._id} value={emp._id}>
//                       {emp.name} - {emp.role}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Hold **CTRL** or **CMD** to select multiple employees.
//                 </p>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1">
//                   Priority
//                 </label>
//                 <select
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//                   value={newTask.priority}
//                   onChange={(e) =>
//                     setNewTask({ ...newTask, priority: e.target.value })
//                   }
//                 >
//                   <option>Low</option>
//                   <option>Medium</option>
//                   <option>High</option>
//                 </select>
//               </div>

//               <button
//                 onClick={handleCreateTask}
//                 className={`w-full bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white py-3 rounded-xl mt-6 font-bold text-lg transition shadow-lg`}
//               >
//                 <FiPlus size={18} className="inline mr-2" />
//                 Create Task
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DRAWER (Themed) */}
// {showDrawer && selectedTask && (
//   <>
//     <div
//       className="fixed inset-0 bg-black bg-opacity-40 z-40"
//       onClick={() => setShowDrawer(false)}
//     ></div>

//     <div className={`fixed top-0 right-0 w-[480px] h-full bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300`}>
//       {/* === Header === */}
//       <div className={`flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50`}>
//         <div>
//           <h2 className={`text-xl font-bold text-${darkIndigo}`}>Task Details</h2>
//           <p className="text-xs text-gray-600 mt-1">
//             Created on {new Date(selectedTask.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//         <FiX
//           className="text-gray-500 cursor-pointer hover:text-red-500"
//           size={24}
//           onClick={() => setShowDrawer(false)}
//         />
//       </div>

//       {/* === Content === */}
//       <div className="p-6 space-y-6">
//         {/* Title */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
//           <input
//             type="text"
//             value={selectedTask.title}
//             onChange={(e) =>
//               setSelectedTask({ ...selectedTask, title: e.target.value })
//             }
//             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             rows={3}
//             value={selectedTask.description || ""}
//             onChange={(e) =>
//               setSelectedTask({
//                 ...selectedTask,
//                 description: e.target.value,
//               })
//             }
//             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//             placeholder="Describe the task..."
//           />
//         </div>

//         {/* Priority */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">
//             Priority
//           </label>
//           <select
//             value={selectedTask.priority}
//             onChange={(e) =>
//               setSelectedTask({
//                 ...selectedTask,
//                 priority: e.target.value,
//               })
//             }
//             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//           >
//             <option>Low</option>
//             <option>Medium</option>
//             <option>High</option>
//           </select>
//         </div>

//         {/* Assigned Employees */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Assigned Employees
//           </label>
//           <div className="flex flex-wrap gap-3 mb-3">
//             {selectedTask.assignees?.map((emp) => {
//               // Check if emp is an object (preferred) or just an ID string
//               const empId = emp._id || emp;
//               const empData = employees.find((e) => e._id === empId);
//               if (!empData) return null;
//               return (
//                 <div
//                   key={empId}
//                   className={`flex items-center gap-2 bg-sky-100 text-sky-700 font-medium px-3 py-1.5 rounded-full text-sm border border-sky-200`}
//                 >
//                   <img
//                     src={empData.avatar || "https://via.placeholder.com/30"}
//                     alt={empData.name}
//                     className="w-6 h-6 rounded-full object-cover border border-sky-300"
//                   />
//                   <span>{empData.name}</span>
//                   <FiX
//                     size={14}
//                     className="cursor-pointer ml-1 text-sky-500 hover:text-red-500"
//                     onClick={() =>
//                       setSelectedTask({
//                         ...selectedTask,
//                         assignees: selectedTask.assignees.filter(
//                           (item) => (item._id || item) !== empId
//                         ),
//                       })
//                     }
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           <select
//             onChange={(e) => {
//               const empId = e.target.value;
//               // Check if assignee is already added (by ID)
//               const isAlreadyAssigned = selectedTask.assignees.some(item => (item._id || item) === empId);

//               if (!isAlreadyAssigned && empId) {
//                 // Find the full employee object to append
//                 const empToAdd = employees.find(e => e._id === empId);
//                 if(empToAdd) {
//                   setSelectedTask({
//                     ...selectedTask,
//                     assignees: [...selectedTask.assignees, empToAdd],
//                   });
//                 }
//               }
//             }}
//             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//             defaultValue=""
//           >
//             <option value="" disabled>Add Employee to Task</option>
//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.name} - {emp.role}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Subtasks */}
//         <div className="pt-2 border-t border-gray-100">
//           <div className="flex justify-between items-center mb-3">
//             <label className={`block text-lg font-bold text-${darkIndigo}`}>
//               Subtasks
//             </label>
//             <span className="text-sm text-gray-500 font-medium">
//               {selectedTask.subtasks?.length || 0} total
//             </span>
//           </div>

//           {/* Subtask list */}
//           {selectedTask.subtasks?.length > 0 ? (
//             <ul className="space-y-3">
//               {selectedTask.subtasks.map((st, i) => (
//                 <li
//                   key={i}
//                   className="flex justify-between items-center border border-gray-200 rounded-xl p-3 bg-white hover:bg-gray-50 transition shadow-sm"
//                 >
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="checkbox"
//                       checked={st.completed}
//                       onChange={async (e) => {
//                         const updatedSubtasks = selectedTask.subtasks.map((s, idx) =>
//                           idx === i
//                             ? { ...s, completed: e.target.checked }
//                             : s
//                         );
//                         const res = await fetch(
//                           `http://localhost:5000/api/task/update/${selectedTask._id}`,
//                           {
//                             method: "PUT",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({
//                               subtasks: updatedSubtasks,
//                             }),
//                           }
//                         );
//                         const data = await res.json();
//                         if (data.success) setSelectedTask(data.task);
//                       }}
//                       className={`form-checkbox h-5 w-5 text-${primaryBlue} rounded border-gray-300 focus:ring-${primaryBlue}`}
//                     />
//                     <div>
//                       <p
//                         className={`text-sm font-semibold ${
//                           st.completed ? "line-through text-gray-500" : "text-gray-800"
//                         }`}
//                       >
//                         {st.title}
//                       </p>
//                       {st.assignee && (
//                         <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
//                           <img
//                             src={
//                               employees.find((e) => e._id === st.assignee)?.avatar
//                             }
//                             alt=""
//                             className="w-4 h-4 rounded-full object-cover"
//                           />
//                           <span>
//                             {
//                               employees.find((e) => e._id === st.assignee)?.name
//                             }
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <FiTrash2 className="text-gray-400 cursor-pointer hover:text-red-500" size={16}/>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-gray-400 p-2 border border-dashed rounded-lg text-center">No subtasks yet. Add one below!</p>
//           )}

//           {/* Add new subtask */}
//           <div className={`border border-sky-200 rounded-xl p-4 mt-4 bg-sky-50`}>
//             <p className="text-sm font-bold text-gray-800 mb-2">Add New Subtask</p>
//             <input
//               type="text"
//               placeholder="Subtask title..."
//               value={newSubtask}
//               onChange={(e) => setNewSubtask(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//             />
//             <select
//               onChange={(e) =>
//                 setSelectedTask({ ...selectedTask, subAssignee: e.target.value })
//               }
//               className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
//             >
//               <option value="">Assign employee (optional)</option>
//               {employees.map((emp) => (
//                 <option key={emp._id} value={emp._id}>
//                   {emp.name} - {emp.role}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={async () => {
//                 if (!newSubtask.trim()) return;
//                 const res = await fetch(
//                   `http://localhost:5000/api/task/subtask/${selectedTask._id}`,
//                   {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                       title: newSubtask,
//                       assignee: selectedTask.subAssignee || null,
//                     }),
//                   }
//                 );
//                 const data = await res.json();
//                 if (data.success) {
//                   setSelectedTask(data.task);
//                   setNewSubtask("");
//                   // Clear subAssignee after adding
//                   setSelectedTask(prev => ({ ...prev, subAssignee: '' }));
//                 }
//               }}
//               className={`w-full bg-${primaryBlue} text-white py-2 rounded-lg hover:bg-${primaryBlueHover} transition text-sm font-semibold`}
//             >
//               Add Subtask
//             </button>
//           </div>
//         </div>

//         {/* Save Task Button */}
//         <button
//           onClick={async () => {
//             const res = await fetch(
//               `http://localhost:5000/api/task/update/${selectedTask._id}`,
//               {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 // Only send properties that are relevant for update and exist in the schema
//                 body: JSON.stringify({
//                   title: selectedTask.title,
//                   description: selectedTask.description,
//                   priority: selectedTask.priority,
//                   // Ensure assignees are stored as IDs or objects based on backend expectation
//                   assignees: selectedTask.assignees.map(a => a._id || a),
//                   // Note: subtasks and status are updated via separate logic/endpoints
//                 }),
//               }
//             );
//             const data = await res.json();
//             if (data.success) {
//               alert("Task updated successfully!");
//               // To update the Kanban board immediately without full reload
//               setTasks(prevTasks => {
//                 const updatedTasks = {...prevTasks};
//                 // Find and replace the task in its current column
//                 for(const col in updatedTasks) {
//                     const index = updatedTasks[col].findIndex(t => t._id === data.task._id);
//                     if(index !== -1) {
//                         updatedTasks[col][index] = data.task;
//                         break;
//                     }
//                 }
//                 return updatedTasks;
//               });

//               setShowDrawer(false);
//             } else {
//                alert(data.message || "Failed to save task changes.");
//             }
//           }}
//           className={`w-full bg-${darkIndigo} hover:bg-indigo-950 text-white py-3 rounded-xl mt-4 font-bold text-lg transition shadow-xl`}
//         >
//           Save All Changes
//         </button>
//       </div>
//     </div>
//   </>
// )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { FiMoreVertical, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/Employee/getEmployee"
        );
        const data = await res.json();
        if (data.success) setEmployees(data.employees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/task/get"
        );
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

  // === HANDLE DRAG END ===
  // === HANDLE DRAG END ===
const handleDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return; // dropped outside

  // same column + same position → do nothing
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return;

  const sourceCol = source.droppableId;
  const destCol = destination.droppableId;

  // task being moved
  const movedTask = tasks[sourceCol][source.index];

  // remove from source
  const updatedSource = Array.from(tasks[sourceCol]);
  updatedSource.splice(source.index, 1);

  // add to destination
  const updatedDest = Array.from(tasks[destCol]);
  updatedDest.splice(destination.index, 0, { ...movedTask, status: destCol });

  // update local state immediately
  const updatedTasks = {
    ...tasks,
    [sourceCol]: updatedSource,
    [destCol]: updatedDest,
  };
  setTasks(updatedTasks);

  // === Update DB status ===
  try {
    const res = await fetch(
      `http://localhost:5000/api/task/updateTaskStatus/${movedTask._id}`,
      {
        method: "PATCH", // ✅ use PATCH instead of PUT for partial update
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
    alert("❌ Could not update task status in database");
  }
};


  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return alert("Please enter a task title.");

    try {
      const res = await fetch(
        "http://localhost:5000/api/task/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        }
      );
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
      `http://localhost:5000/api/task/deleteTask/${taskId}`,
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


  return (
    <div className={`flex flex-col ${lightBg}`}>
      {/* === Main Kanban === */}
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
                  {/* Column Header */}
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

                  {/* Cards */}
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
    e.stopPropagation();  // Stop event from triggering the drawer
    handleDeleteTask(task._id, column.key);  // Pass task._id, not task
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
            className={`fixed top-0 right-0 w-[480px] h-full bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300`}
          >
            {/* === Header === */}
            <div
              className={`flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50`}
            >
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

            {/* === Content === */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
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
                    // Check if emp is an object (preferred) or just an ID string
                    const empId = emp._id || emp;
                    const empData = employees.find((e) => e._id === empId);
                    if (!empData) return null;
                    return (
                      <div
                        key={empId}
                        className={`flex items-center gap-2 bg-sky-100 text-sky-700 font-medium px-3 py-1.5 rounded-full text-sm border border-sky-200`}
                      >
                        <img
                          src={
                            empData.avatar || "https://via.placeholder.com/30"
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
                    // Check if assignee is already added (by ID)
                    const isAlreadyAssigned = selectedTask.assignees.some(
                      (item) => (item._id || item) === empId
                    );

                    if (!isAlreadyAssigned && empId) {
                      // Find the full employee object to append
                      const empToAdd = employees.find((e) => e._id === empId);
                      if (empToAdd) {
                        setSelectedTask({
                          ...selectedTask,
                          assignees: [...selectedTask.assignees, empToAdd],
                        });
                      }
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
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

              {/* Subtasks */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <label
                    className={`block text-lg font-bold text-${darkIndigo}`}
                  >
                    Subtasks
                  </label>
                  <span className="text-sm text-gray-500 font-medium">
                    {selectedTask.subtasks?.length || 0} total
                  </span>
                </div>

                {/* Subtask list */}
                {selectedTask.subtasks?.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedTask.subtasks.map((st, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center border border-gray-200 rounded-xl p-3 bg-white hover:bg-gray-50 transition shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={async (e) => {
                              const updatedSubtasks = selectedTask.subtasks.map(
                                (s, idx) =>
                                  idx === i
                                    ? { ...s, completed: e.target.checked }
                                    : s
                              );
                              const res = await fetch(
                                `http://localhost:5000/api/task/update/${selectedTask._id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    subtasks: updatedSubtasks,
                                  }),
                                }
                              );
                              const data = await res.json();
                              if (data.success) setSelectedTask(data.task);
                            }}
                            className={`form-checkbox h-5 w-5 text-${primaryBlue} rounded border-gray-300 focus:ring-${primaryBlue}`}
                          />
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                st.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                            >
                              {st.title}
                            </p>
                            {st.assignee && (
                              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                <img
                                  src={
                                    employees.find((e) => e._id === st.assignee)
                                      ?.avatar
                                  }
                                  alt=""
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                                <span>
                                  {
                                    employees.find((e) => e._id === st.assignee)
                                      ?.name
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <FiTrash2
                          className="text-gray-400 cursor-pointer hover:text-red-500"
                          size={16}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 p-2 border border-dashed rounded-lg text-center">
                    No subtasks yet. Add one below!
                  </p>
                )}

                {/* Add new subtask */}
                <div
                  className={`border border-sky-200 rounded-xl p-4 mt-4 bg-sky-50`}
                >
                  <p className="text-sm font-bold text-gray-800 mb-2">
                    Add New Subtask
                  </p>
                  <input
                    type="text"
                    placeholder="Subtask title..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
                  />
                  <select
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        subAssignee: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-${primaryBlue} outline-none transition"
                  >
                    <option value="">Assign employee (optional)</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.role}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={async () => {
                      if (!newSubtask.trim()) return;
                      const res = await fetch(
                        `http://localhost:5000/api/task/subtask/${selectedTask._id}`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: newSubtask,
                            assignee: selectedTask.subAssignee || null,
                          }),
                        }
                      );
                      const data = await res.json();
                      if (data.success) {
                        setSelectedTask(data.task);
                        setNewSubtask("");
                        // Clear subAssignee after adding
                        setSelectedTask((prev) => ({
                          ...prev,
                          subAssignee: "",
                        }));
                      }
                    }}
                    className={`w-full bg-${primaryBlue} text-white py-2 rounded-lg hover:bg-${primaryBlueHover} transition text-sm font-semibold`}
                  >
                    Add Subtask
                  </button>
                </div>
              </div>

              {/* Save Task Button */}
              <button
                onClick={async () => {
                  const res = await fetch(
                    `http://localhost:5000/api/task/update/${selectedTask._id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      // Only send properties that are relevant for update and exist in the schema
                      body: JSON.stringify({
                        title: selectedTask.title,
                        description: selectedTask.description,
                        priority: selectedTask.priority,
                        // Ensure assignees are stored as IDs or objects based on backend expectation
                        assignees: selectedTask.assignees.map(
                          (a) => a._id || a
                        ),
                        // Note: subtasks and status are updated via separate logic/endpoints
                      }),
                    }
                  );
                  const data = await res.json();
                  if (data.success) {
                    alert("Task updated successfully!");
                    // To update the Kanban board immediately without full reload
                    setTasks((prevTasks) => {
                      const updatedTasks = { ...prevTasks };
                      // Find and replace the task in its current column
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
                className={`w-full bg-${darkIndigo} hover:bg-indigo-950 text-white py-3 rounded-xl mt-4 font-bold text-lg transition shadow-xl`}
              >
                Save All Changes
              </button>
            </div>
          </div>
        </>
      )}
      {/* === Add Task Modal === */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
            {/* Header */}
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

            {/* Form */}
            <div className="space-y-5">
              {/* Title */}
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

              {/* Description */}
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

              {/* Assignees */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Assign Employees
                </label>

                {/* Selected badges */}
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

                {/* Dropdown */}
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

              {/* Submit */}
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
