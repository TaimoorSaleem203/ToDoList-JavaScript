const taskInp = document.querySelector(".todo-input");
const taskList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");

const todos = JSON.parse(localStorage.getItem("task")) || []
function savedTodo() {  
  localStorage.setItem("task", JSON.stringify(todos));
};

let editingIndx = null

function createTodo(todo, indx) {

  const li = document.createElement("li")
  li.className = "todo-items"

  const textSpan = document.createElement("span")
  textSpan.textContent = todo.text

  const deleteBtn = document.createElement("i")
  deleteBtn.className = ("ri-close-line")

  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault()
    todos.splice(indx, 1)
    savedTodo()
    showTask()
  })

  li.appendChild(textSpan)
  li.appendChild(deleteBtn)
  return li
};

function showTask() {
  taskList.innerHTML = ""

  todos.forEach((todo, indx) => {
    const node = createTodo(todo, indx)
    taskList.appendChild(node)
  })
};

function pushTask() {
  let text = taskInp.value.trim()
  if (!text) return

  if (editingIndx == null) {
    todos.push({ text, completed: false })
  } else {
    todos[editingIndx].text = text
    editingIndx = null
  }
  
  savedTodo()
  showTask()
  taskInp.value = ""
}

addBtn.addEventListener("click", pushTask);
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    pushTask();
  }
});
showTask()