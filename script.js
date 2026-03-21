const taskInp = document.querySelector(".todo-input");
const container = document.querySelector(".section-container");
const taskList = document.querySelector(".todo-list");

const addBtn = document.querySelector(".add-btn");
const deleteBtn = document.querySelector(".delete-icon");

const setLocalStorage = (result) => {
  localStorage.setItem("task", JSON.stringify(result));
};

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("task")) || [];
};

let result = [];

const showTask = () => {
  let tasks = getLocalStorage() || result;

  const taskItems = document.createElement("li");
  taskItems.classList.add("todo-items");

  tasks.forEach((item, indx) => {
    taskItems.innerHTML = `${indx + 1}. ${item.task} <i class="ri-delete-bin-5-fill delete-icon"></i>`;
  });

  taskList.appendChild(taskItems);
};

const addTask = (e) => {
  e.preventDefault();

  if (taskInp.value == "") return;

  let updatedTask = { task: taskInp.value, date: Date.now() };
  result.push(updatedTask);
  setLocalStorage(result);

  showTask();

  taskInp.value = "";
};

const deleteTask = (index) => {
    result.splice(index,1)
    showTask()
};

addBtn.addEventListener("click", addTask);
taskInp.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    addTask(e);
  }
});
