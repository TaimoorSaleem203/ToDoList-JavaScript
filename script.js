const taskInp = document.querySelector(".todo-input");
const searchBar = document.querySelector(".todo-search");
const taskList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");
const filterOption = document.querySelector(".filter-option")
const filterIcon = document.querySelector(".filter-icon")
const filterBtn = document.querySelector(".filter-toggle-btn")

let todo = []
let editingID = null

addBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (taskInp.value == "") return

  addTask()
})

filterBtn.addEventListener("click", (e) => {
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
    updateStat(todo)
  }

  const btn = e.target.closest("button")

  if (btn) {

    if (btn.querySelector(".edit-icon")) {

      const taskEl = btn.closest(".todo-items");
      const input = taskEl.querySelector(".display-input");
      const txt = taskEl.querySelector(".todo-text")
      const editBtn = btn.querySelector("i")

      const id = btn.getAttribute("data-id")
      const todoTask = todo.find((item) => item.id == id)

      if (todoTask.completed) return

      input.style.display = "flex"
      txt.style.display = "none"
      input.focus()

      editBtn.classList.replace("ri-edit-line", "ri-check-line");
      editBtn.classList.replace("edit-icon", "save-icon");
      input.value = todoTask.task

      editingID = id

    }
    else if (btn.querySelector(".save-icon")) {
      const taskEl = btn.closest(".todo-items");
      const input = taskEl.querySelector(".display-input");
      const txt = taskEl.querySelector(".todo-text")
      const saveBtn = btn.querySelector("i")
      const updatedValue = input.value

      if (updatedValue.trim() !== "") {

        const todoTask = todo.find(item => item.id == editingID)
        todoTask.task = input.value
        input.style.display = "none"
        txt.style.display = "block"

        saveBtn.classList.replace("ri-check-line", "ri-edit-line");
        saveBtn.classList.replace("save-icon", "edit-icon");
        
        editingID = null

        addStorage()
        displayTask(todo)
      }
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
    const td = document.createElement("td")
    td.className = "todo-items"

    td.innerHTML = `
                    <p class="todo-pending">${item.completed ? "Completed" : "Pending"}</p>
                    <p class="todo-text ${item.completed ? "completed" : ""}">${item.task}</p>
                    <input data-id="${item.id}" class="display-input" type="text" />
                    <input data-id="${item.id}" ${item.completed ? "checked" : ""} type="checkbox" class="check-icon" />
                    <button data-id="${item.id}"><i class="ri-close-line delete-icon"></i></button>
                    <button data-id="${item.id}"><i class="ri-edit-line edit-icon"></i></button>`

    taskList.appendChild(td)
  })
}

function addTask() {

  removeEl()
  todo.push({ id: Date.now(), task: taskInp.value, completed: false })

  taskInp.value = ""

  addStorage()
  displayTask(todo)
  updateStat(todo)
}

function deleteTask(indx) {
  // At a specific indx remove 1 item
  todo.splice(indx, 1)

  toggleEmpty()

  addStorage()
  displayTask(todo)
  updateStat(todo)
}

function displayEmpty() {
  const div = document.createElement("div")
  div.className = "emptyState"

  div.innerHTML = `
      <i class="ri-inbox-line"></i>
      <p>No tasks yet. Add one above!</p>
    `

  document.querySelector(".todo-list").insertAdjacentElement("afterend", div)
}

function toggleEmpty() {
  const existing = document.querySelector(".emptyState")

  if (todo.length == 0) {
    if (!existing) displayEmpty()
  }
}

function removeEl() {
  const el = document.querySelector(".emptyState")
  if (el) el.remove()
}

function updateStat(todo) {
  const statTotal = document.querySelector('#statTotal .stat-num')
  const statPending = document.querySelector('#statPending .stat-num')
  const statDone = document.querySelector('#statDone .stat-num')

  let completed = todo.filter((item) => item.completed)
  let pending = todo.filter((item) => !item.completed)

  statTotal.textContent = todo.length
  statPending.textContent = pending.length
  statDone.textContent = completed.length
}

getStorage()
displayTask(todo)
toggleEmpty()
updateStat(todo)