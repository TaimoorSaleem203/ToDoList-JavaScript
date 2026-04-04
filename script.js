const taskInp = document.querySelector(".todo-input");
const searchBar = document.querySelector(".todo-search");
const taskList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");

let todo = []
let editingIndex = null

addBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (!taskInp.value) return

  addTask()
})

searchBar.addEventListener("input",(e)=>{

  const value = e.target.value.toLowerCase()
  const filtered = todo.filter((item,index)=>item.task.toLowerCase().includes(value))

  displayTask(filtered)
})


taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-icon")) {

    const indx = e.target.parentElement.getAttribute("data-id")
    if (editingIndex == null) {
      deleteTask(indx)       
    }
                   
  } else if (e.target.classList.contains("edit-icon")) {

    const indx = e.target.parentElement.getAttribute("data-id")
    taskInp.value = todo[indx].task
    addBtn.textContent = "Update"
    editingIndex = indx

  }else if (e.target.classList.contains("check-icon")){

    const taskEl = e.target.closest(".todo-items")
    const text = taskEl.querySelector(".todo-text")  
    const indx = e.target.getAttribute("data-id")
    
    todo[indx].completed = !todo[indx].completed
    text.classList.toggle("completed")
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
                    <div class="todo-pending"></div>
                    <p class="todo-text">${item.task}</p>
                    <input data-id="${indx}" type="checkbox" class="check-icon" />
                    <button data-id="${indx}"><i class="ri-close-line delete-icon"></i></button>
                    <button data-id="${indx}"><i class="ri-edit-line edit-icon"></i></button>`

    taskList.appendChild(li)
  })
}

function addTask() {

  if (editingIndex != null) {

    todo[editingIndex].task = taskInp.value
    addBtn.textContent = "Add"
    editingIndex = null

  } else {
    todo.push({ task: taskInp.value, date: Date.now(), completed:false })
  }

  taskInp.value = ""

  addStorage()
  displayTask(todo)
}

function deleteTask(indx) {
  // At a specific indx remove 1 item
  todo.splice(indx, 1)

  addStorage()
  displayTask(todo)
}

getStorage()
displayTask(todo)