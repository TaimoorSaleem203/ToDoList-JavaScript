const taskInp = document.querySelector(".todo-input");
const searchBar = document.querySelector(".todo-search");
const taskList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");
const filterOption = document.querySelector(".filter-option")
const filterIcon = document.querySelector(".filter-icon")

let todo = []
let editingID = null

addBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (!taskInp.value) return

  addTask()
})

filterIcon.addEventListener("click", (e) => {
  e.preventDefault()

  if (filterIcon.classList.contains("ri-filter-line")) {
    filterIcon.classList.replace("ri-filter-line", "ri-filter-fill")
    filterOption.style.display = "block"
  } else {
    filterIcon.classList.replace("ri-filter-fill", "ri-filter-line")
    filterOption.style.display = "none"
  }

})

let options = filterOption.querySelectorAll("input")

options.forEach((option) => {
  option.addEventListener("change", () => {  

    options.forEach((opt) => {
      if (opt!==option) opt.checked = false
    })
    
    let filteredTask = [...todo]
  
    if(option.checked){
      if (option.classList.contains("completed")) {
        filteredTask = todo.filter(item => item.completed) 
      } else if (option.classList.contains("pending")) {
        filteredTask = todo.filter(item => !item.completed) 
      }
    }

    displayTask(filteredTask)
  })
})

searchBar.addEventListener("input", (e) => {

  const value = e.target.value.toLowerCase()
  const filtered = todo.filter((item, index) => item.task.toLowerCase().includes(value))

  displayTask(filtered)
})

taskList.addEventListener("click", (e) => {

  e.preventDefault()

  if (e.target.classList.contains("delete-icon")) {

    const id = e.target.parentElement.getAttribute("data-id")
    if (editingID == null) {
      deleteTask(id)
    }

  } else if (e.target.classList.contains("edit-icon")) {

    const id = e.target.parentElement.getAttribute("data-id")
    taskInp.value = todo.find((item)=>item.id==id).task
    addBtn.textContent = "Update"
    editingID = id

  } else if (e.target.classList.contains("check-icon")) {

    const taskEl = e.target.closest(".todo-items")
    const text = taskEl.querySelector(".todo-text")
    const pending = taskEl.querySelector(".todo-pending")
    const id = e.target.getAttribute("data-id")

    let filterTodo = todo.find(item=>item.id==id)
    filterTodo.completed = !filterTodo.completed
    text.classList.toggle("completed")
    pending.textContent = `${filterTodo.completed ? "Completed" : "Pending"}`

    addStorage()
    displayTask(todo)
  }
})

function addStorage() {
  localStorage.setItem("list", JSON.stringify(todo))
}

function getStorage() {
  let saved = localStorage.getItem("list")
  if (saved != null) todo = JSON.parse(saved)
}

function displayTask(todo) {
  taskList.innerHTML = "" // Avoid Duplication , Clears Previous UI

  todo.map((item, indx) => {
    const li = document.createElement("li")
    li.className = "todo-items"

    li.innerHTML = `
                    <p class="todo-pending">${item.completed ? "Completed" : "Pending"}</p>
                    <p class="todo-text ${item.completed ? "completed" : ""}">${item.task}</p>
                    <input data-id="${item.id}" ${item.completed ? "checked" : ""} type="checkbox" class="check-icon" />
                    <button data-id="${item.id}"><i class="ri-close-line delete-icon"></i></button>
                    <button data-id="${item.id}"><i class="ri-edit-line edit-icon"></i></button>`

    taskList.appendChild(li)
  })
}

function addTask() {

  if (editingID != null) {

    todo.find((item)=>item.id==editingID).task = taskInp.value
    addBtn.textContent = "Add"
    editingID = null

  } else {
    todo.push({id:Date.now(), task: taskInp.value, completed: false })
  }

  taskInp.value = ""

  addStorage()
  displayTask(todo)
}

function deleteTask(id) {
  // At a specific indx remove 1 item
  let indx = (todo.findIndex(item=>item.id==id))

  todo.splice(indx,1)
  addStorage()
  displayTask(todo)
}

getStorage()
displayTask(todo)