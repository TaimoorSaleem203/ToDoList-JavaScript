const taskInp = document.querySelector(".todo-input");
const taskDate = document.querySelector(".input-date");
const taskActive = document.querySelector(".active-bar");
const taskStatus = document.querySelector(".status-bar");
const taskPriority = document.querySelector(".priority-bar");

const searchBar = document.querySelector(".todo-search");

const taskList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-option")
const filterIcon = document.querySelector(".filter-icon")

const filterBtn = document.querySelector(".filter-toggle-btn")
const addBtn = document.querySelector(".add-btn");

let todo = []
let editingID = null

addBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (taskInp.value == '' || taskDate.value == '' || taskActive.value == '--Select--' || taskStatus.value == '--Select--' || taskPriority.value == '--Select--') return

  addTask()
})


filterBtn.addEventListener("click", (e) => {
  e.preventDefault()

  if (filterIcon.classList.contains("ri-filter-line")) {
    filterIcon.classList.replace("ri-filter-line", "ri-filter-fill")
    filterOption.style.display = "flex"
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
        filteredTask = todo.filter(item => item.status == "Completed")
      } else if (option.classList.contains("progress")) {
        filteredTask = todo.filter(item => item.status != "Completed")
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

    let filterTodo = todo.find(item => item.id === parseInt(id))
    filterTodo.completed = !filterTodo.completed
    text.classList.toggle("completed")
    pending.textContent = `${filterTodo.completed ? "Completed" : "Pending"}`

    addStorage()
    displayTask(todo)
  }

  const btn = e.target.closest("button")

  if (btn) {

    if (btn.querySelector(".edit-icon")) {

      const taskEl = btn.closest(".todo-items");
      const input = taskEl.querySelector(".display-input");
      const txt = taskEl.querySelector(".todo-text")
      const editBtn = btn.querySelector("i")

      const id = btn.getAttribute("data-id")
      const todoTask = todo.find((item) => item.id === parseInt(id))

      taskInp.value = todoTask.task
      taskDate.value = todoTask.due_date
      taskActive.value = todoTask.active
      taskStatus.value = todoTask.status
      taskPriority.value = todoTask.priority

      addBtn.textContent = "Update"
      editingID = id

    }

    else if (btn.querySelector(".delete-icon")) {
      const id = btn.getAttribute("data-id")
      const indx = todo.findIndex(item => item.id === parseInt(id))
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

  toggleEmpty()

  const fragment = document.createDocumentFragment()

  todo.forEach((item, indx) => {
    const tr = document.createElement("tr")
    tr.className = "todo-items"

    tr.innerHTML = ` 
    <td class="todo-text ${item.completed ? "completed" : ""}">${item.task}</td>
    <td class="todo-text" >${item.due_date}</td>
    <td class="todo-text" >${item.issue_date}</td>
    <td class="todo-text todo-active">${item.active}</td>
    <td class="todo-text todo-status" >${item.status}</td>
    <td class="todo-text" >${item.priority}</td>
    <td><button data-id="${item.id}"><i class="ri-edit-line edit-icon"></i></button></td>
    <td><button data-id="${item.id}"><i class="ri-close-line delete-icon"></i></button></td>`

    if (indx%2!=0) {
      tr.style.background = "#369bff17"
    }

    if (item.active == "Active") {
      tr.querySelector(".todo-active").style.color = "green"
    } else {
      tr.querySelector(".todo-active").style.color = "red"
    }

    tr.querySelector(".todo-active").style.fontWeight = "bold"


    fragment.appendChild(tr)
  })


  taskList.innerHTML = "" // Avoid Duplication , Clears Previous UI
  taskList.appendChild(fragment)
}

function addTask() {

  let issueDate = new Date().toLocaleDateString().split("/").reverse().join("-")

  if (editingID != null) {
    let indx = todo.findIndex((item) => item.id === parseInt(editingID))

    todo[indx].task = taskInp.value
    todo[indx].due_date = taskDate.value
    todo[indx].issue_date = issueDate
    todo[indx].active = taskActive.value
    todo[indx].status = taskStatus.value
    todo[indx].priority = taskPriority.value

    addBtn.textContent = "Save"
    editingID = null
  } else {
    todo.push({ id: Date.now(), task: taskInp.value, issue_date: issueDate, due_date: taskDate.value, active: taskActive.value, status: taskStatus.value, priority: taskPriority.value })
  }

  taskInp.value = ""
  taskDate.value = ""
  taskActive.value = "--Select--"
  taskStatus.value = "--Select--"
  taskPriority.value = "--Select--"

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
  } else {
    if (existing) existing.remove()
  }
}

function updateStat(todo) {
  const statTotal = document.querySelector('#statTotal .stat-num')
  const statPending = document.querySelector('#statPending .stat-num')
  const statDone = document.querySelector('#statDone .stat-num')

  let completed = todo.filter((item) => item.status == "Completed")
  let progress = todo.filter((item) => item.status != "Completed")

  statTotal.textContent = todo.length
  statPending.textContent = progress.length
  statDone.textContent = completed.length
}

getStorage()
displayTask(todo)
toggleEmpty()
updateStat(todo)