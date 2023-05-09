const form = document.getElementById("form") as HTMLFormElement

const categorySelect = document.getElementById("categorias") as HTMLSelectElement
const descriptionInput = document.getElementById("descricao") as HTMLInputElement
const dateInput = document.getElementById("data") as HTMLInputElement

const tarefasUl = document.getElementById("tarefas") as HTMLUListElement
const concluidasUl = document.getElementById("concluidas") as HTMLUListElement

interface Task {
  id: number,
  description: string,
  category: string,
  date: string,
  done: boolean
}

const tasks: Task[] = []

let id = 0

form.addEventListener('submit', event => {
  event.preventDefault()

  const task = {
    id: ++id,
    description : descriptionInput.value,
    category: categorySelect.value,
    date: dateInput.value,
    done: false
  }

  tasks.push(task)

  updateTask()
  descriptionInput.value = ''
  
})

function updateTask(){
  concluidasUl.innerHTML = ''
  tarefasUl.innerHTML = ''

  for(const task of tasks) {
    const taskElement = newTask(task)
    if (task.done) {
      concluidasUl.appendChild(taskElement)
    } else {
      tarefasUl.appendChild(taskElement)
    }
  }
}

function newTask(task: Task): HTMLLIElement {
  const newTaskItem = document.createElement("li")

  const newTaskContainer = document.createElement("div")
  newTaskContainer.className = task.category

  const newTaskInput = document.createElement("input")
  newTaskInput.type = "checkbox"
  newTaskInput.id = `${task.id}`
  newTaskInput.checked = task.done
  newTaskInput.addEventListener('change', moveTask)

  const newTaskLabel = document.createElement("label") as HTMLLabelElement
  newTaskLabel.textContent = task.description
  newTaskLabel.htmlFor = String(task.id)

  const newTaskDate = document.createElement("time") as HTMLTimeElement
  newTaskDate.dateTime = task.date
  newTaskDate.textContent = task.date

  newTaskContainer.appendChild(newTaskInput)
  newTaskContainer.appendChild(newTaskLabel)
  newTaskContainer.appendChild(newTaskDate)

  newTaskItem.appendChild(newTaskContainer)

  return newTaskItem
}

function moveTask(event) {
  const t = tasks.filter( task => task.id == event.target.id)
  t[0].done = event.target.checked
  updateTask()
}