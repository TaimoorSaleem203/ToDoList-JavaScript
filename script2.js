const taskInp = document.querySelector(".todo-input");
const searchBar = document.querySelector(".todo-search");
const taskList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");
const deleteBtn = document.querySelector(".delete-icon")

let todo = []

function setStorage(){
    localStorage.setItem("list",JSON.stringify(todo))
}

function getStorage(){
    localStorage.getItem("list")
}

searchBar.addEventListener("input",(e)=>{
    const value = e.target.value.toLowerCase()

    const filtered = todo.filter((item)=>item.task.toLowerCase().includes(value))

    displayTask(filtered)
})
displayTask(filtered)

function deleteTask(index){
    todo.splice(index,1)

    displayTask(todo)
}