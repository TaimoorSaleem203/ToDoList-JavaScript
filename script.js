
const taskInp = document.querySelector(".todo-input")
const addBtn = document.querySelector(".add-btn")
const container = document.querySelector(".section-container")
const taskList = document.querySelector(".todo-list")

let result = []

const setLocalStorage = (result) => {
    localStorage.setItem("task",JSON.stringify(result))
}

const getLocalStorage = () => {
    JSON.parse(localStorage.getItem("task"))
}

const addTask = (e) => {
    e.preventDefault()

    if(taskInp.value=="") return 

    let updatedTask = {"task":taskInp.value,"date":Date.now()}
    result.push(updatedTask)

    const taskItems = document.createElement("li")
    taskItems.classList.add("todo-items")

    result.forEach((item,indx)=>{
        taskItems.innerText = `${indx+1}. ${item.task}`
    })

    taskList.appendChild(taskItems)
    taskInp.value = ""
}

addBtn.addEventListener("click",addTask)
taskInp.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        e.preventDefault();
        addTask();
    }
})