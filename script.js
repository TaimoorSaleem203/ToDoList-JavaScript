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
      if (opt !== option) opt.checked = false
    })

    let filteredTask = [...todo]

    if (option.checked) {
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

taskList.addEventListener("click", function (e) {
  e.preventDefault()

  if (e.target.classList.contains("check-icon")) {
    const taskEl = e.target.closest(".todo-items")
    const text = taskEl.querySelector(".todo-text")
    const pending = taskEl.querySelector(".todo-pending")
    const id = e.target.getAttribute("data-id")

    let filterTodo = todo.find(item => item.id == id)
    filterTodo.completed = !filterTodo.completed
    text.classList.toggle("completed")
    pending.textContent = `${filterTodo.completed ? "Completed" : "Pending"}`

    addStorage()
    displayTask(todo)
  }

  const btn = e.target.closest("button")

  if (btn) {

    if (btn.querySelector(".edit-icon")) {
      const id = btn.getAttribute("data-id")
      taskInp.value = todo.find((item) => item.id == id).task
      addBtn.textContent = "Update"
      editingID = id

    }
    else if (btn.querySelector(".delete-icon")) {
      const id = btn.getAttribute("data-id")
      const indx = todo.findIndex(item => item.id == id)
      if (editingID == null) {
        deleteTask(indx)
      }

    }

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

  removeEl()
  if (editingID != null) {
    todo.find((item) => item.id == editingID).task = taskInp.value
    addBtn.textContent = "Add"
    editingID = null

  } else {
    todo.push({ id: Date.now(), task: taskInp.value, completed: false })
  }

  taskInp.value = ""

  addStorage()
  displayTask(todo)
  updateStat()
}

function deleteTask(indx) {
  // At a specific indx remove 1 item
  todo.splice(indx, 1)

  if(todo.length==0) toggleEmpty()

  addStorage()
  displayTask(todo)
  updateStat()
}

function displayEmpty(){
  const div = document.createElement("div")
  div.className = "emptyState"

  div.innerHTML=`
      <i class="ri-inbox-line"></i>
      <p>No tasks yet. Add one above!</p>
    `
  
  document.querySelector(".todo-list").insertAdjacentElement("afterend", div)
}

function toggleEmpty(){
  const existing = document.querySelector(".emptyState")

  if(todo.length == 0){
    if(!existing) displayEmpty()
  }else {
    if(existing) existing.remove()
  }
}

function removeEl(){
  const element = document.querySelector(".emptyState")
  if(element) element.remove()
}

function updateStat(){
  const statTotal = document.querySelector('#statTotal .stat-num')
  const statPending = document.querySelector('#statPending .stat-num')
  const statDone = document.querySelector('#statDone .stat-num')

  let completed = todo.filter((item)=>{item.completed})
  let pending = todo.filter((item)=>{!item.completed})

  statTotal.textContent = todo.length
  statPending.textContent = pending.length
  statDone.textContent = completed.length
  
}


getStorage()
displayTask(todo)
toggleEmpty() 