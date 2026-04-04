const taskInp = document.querySelector(".todo-input");
const taskSearch = document.querySelector(".todo-search");
const taskList = document.querySelector(".todo-list");
const searchBar = document.querySelector(".searchbar")
const addBtn = document.querySelector(".add-btn");
const deleteBtn = document.querySelector(".delete-icon")

let todo = []

addBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (!taskInp.value) return

  addTask()
})

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-icon")) {
    const indx = e.target.parentElement.getAttribute("data-id")
    deleteTask(indx)
  }
})

function addStorage() {
  localStorage.setItem("list", JSON.stringify(todo))
}

function getStorage() {
  let saved = localStorage.getItem("list")
  if (saved != null) todo = JSON.parse(saved)
}

function displayTask() {
  taskList.innerHTML = "" // Avoid Duplication , Clears Previous UI

  todo.map((item, indx) => {
    const li = document.createElement("li")
    li.className = "todo-items"

    li.innerHTML = `${item.task}<br/><button data-id="${indx}"><i class="ri-close-line delete-icon"></i></button>`
    
    taskList.appendChild(li)
  })
}

function addTask() {
  todo.push({ task: taskInp.value, date: Date.now() })
  taskInp.value = ""

  addStorage()
  displayTask()
}

function deleteTask(indx) {
  todo.splice(indx, 1)

  addStorage()
  displayTask()
}


getStorage()
displayTask()