var form = document.getElementById("form");
var categorySelect = document.getElementById("categorias");
var descriptionInput = document.getElementById("descricao");
var dateInput = document.getElementById("data");
var tarefasUl = document.getElementById("tarefas");
var concluidasUl = document.getElementById("concluidas");
var tasks = [];
var id = 0;
form.addEventListener('submit', function (event) {
    event.preventDefault();
    var task = {
        id: ++id,
        description: descriptionInput.value,
        category: categorySelect.value,
        date: dateInput.value,
        done: false
    };
    tasks.push(task);
    updateTask();
    descriptionInput.value = '';
});
function updateTask() {
    concluidasUl.innerHTML = '';
    tarefasUl.innerHTML = '';
    for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
        var task = tasks_1[_i];
        var taskElement = newTask(task);
        if (task.done) {
            concluidasUl.appendChild(taskElement);
        }
        else {
            tarefasUl.appendChild(taskElement);
        }
    }
}
function newTask(task) {
    var newTaskItem = document.createElement("li");
    var newTaskContainer = document.createElement("div");
    newTaskContainer.className = task.category;
    var newTaskInput = document.createElement("input");
    newTaskInput.type = "checkbox";
    newTaskInput.id = "".concat(task.id);
    newTaskInput.checked = task.done;
    newTaskInput.addEventListener('change', moveTask);
    var newTaskLabel = document.createElement("label");
    newTaskLabel.textContent = task.description;
    newTaskLabel.htmlFor = String(task.id);
    var newTaskDate = document.createElement("time");
    newTaskDate.dateTime = task.date;
    newTaskDate.textContent = task.date;
    newTaskContainer.appendChild(newTaskInput);
    newTaskContainer.appendChild(newTaskLabel);
    newTaskContainer.appendChild(newTaskDate);
    newTaskItem.appendChild(newTaskContainer);
    return newTaskItem;
}
function moveTask(event) {
    var t = tasks.filter(function (task) { return task.id == event.target.id; });
    t[0].done = event.target.checked;
    updateTask();
}
