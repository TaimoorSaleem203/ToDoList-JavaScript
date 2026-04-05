const taskInp = document.querySelector(".todo-input");
const searchBar = document.querySelector(".todo-search");
const taskList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");
const filterOption = document.querySelector(".filter-option")
const filterIcon = document.querySelector(".filter-icon")

let todo = []
let editingIndx = null

// C
addBtn.addEventListener("click",(e)=>{
    e.preventDefault()

    addTask()
})

function addTask(){
    if(!taskInp.value) return
    
    todo.push({task:taskInp.value,date:Date.now()})
    taskInp.value = ""
}

// R
function display(todo){
    taskList.innerHTML = ""
    
    todo.map((item,indx)=>{
        const li = document.createElement("li")
        li.className = "todo-items"

        li.innerHTML = `
            <div>${item.task}</div>
        `
        taskList.appendChild(li)
        
    })
}

//filter
filterIcon.addEventListener("click",(e)=>{
    e.preventDefault()

    if(filterIcon.classList.contains("ri-filter-line")){
        filterIcon.classList.replace("ri-filter-line","ri-filter-fill")
        filterOption.style.display = "none"
    }else if(filterIcon.classList.contains("ri-filter-fill")){
        filterIcon.classList.replace("ri-filter-fill","ri-filter-line")
        filterOption.style.display = "block"
    }
})

let options = document.querySelectorAll(".filter-option input")
options.forEach((option)=>{
    option.addEventListener("click",(e)=>{
        e.preventDefault()
        
        options.forEach((opt)=>{
            if(opt!==option) opt.checked = !opt.checked
        })

        let filteredList = [...todo]
        if(option.checked){
            if(option.classList.contains("completed")){
                filteredList = todo.filter(item=>item.completed)
            }else if(option.classList.contains("pending")){
                filteredList = todo.filter(item=>!item.completed)
            }
        }

        display(filteredList)
        
    })
})
// search
searchBar.addEventListener("input",(e)=>{
    e.preventDefault()

    let filtered = todo.filter((item)=>item.task.toLowerCase().includes(searchBar.value.toLowerCase()))  
    display(filtered)
})

//U , D
taskList.addEventListener("click",(e)=>{
    e.preventDefault()

    if(e.target.classList.contains("edit-icon")){
        const indx = e.target.parentElement.getAttribute("data-id")
        taskInp.value = todo[indx].value
        addBtn.textContent = "Update"
        editingIndx = indx

    }else if(e.target.classList.contains("delete-icon")){
        const indx = e.target.parentElement.getAttribute("data-id")
        todo.splice(indx,1)

        display(todo)
    }else if(e.target.classList.contains("check-icon")){
        const taskEl = e.target.closest(".todo-items")
        const text = taskEl.querySelector(".todo-text")
        const pending = taskEl.querySelector(".todo-pending")

        todo[indx].completed = !todo[indx].completed
        text.classList.toggle("completed")
        pending.textContent = `${todo[indx].completed} ? "completed" : "pending"`

        display(todo)
    }
})