const { ref, computed, createApp } = Vue

const app = createApp({
  setup() {
    
    const tasks = ref([])

    const todoTasks = computed(() => tasks.value.filter(t => t.done === false))
    const concludedTasks = computed(() => tasks.value.filter(t => t.done === true))
    const nTasks = computed(() => tasks.value.length)
    const nConcludedTasks = computed(() => concludedTasks.value.length)
    
    function addTask(newTask) {
      const nextId = nTasks.value === 0 ? 0 : tasks.value[ nTasks.value - 1].id + 1
      const task = {
        id: nextId,
        ...newTask
      }
      tasks.value.push(task);
    }

    function removeTask(pos) {
      tasks.value.splice(pos, 1)
    }

    return { 
      tasks,
      todoTasks,
      concludedTasks,
      nTasks,
      nConcludedTasks,
      addTask,
      removeTask
    }
  }
})

app.component('task-form', {
  emits: ['newtask'],
  setup(_, { emit }) {
    const categories = ref([
      {
        id: 1, description: "Saúde"
      },
      {
        id: 2, description: "Lazer"
      },
      {
        id: 3, description: "Leitura"
      },
      {
        id: 4, description: "Estudo"
      }])

      const category = ref('')
      const description = ref('')
      const date = ref('')

      const isEmpty = computed(() => description.value.trim().length <= 0 || category.value.trim().length <= 0)

      function clearForm() {
        description.value = ""
        date.value = ""
      }

      function addTask(e) {
        e.preventDefault()
        emit('newtask', {
          description: description.value,
          category: category.value,
          date: date.value,
          done: false
        })
        clearForm()
      }

      return {
        categories,
        category,
        description,
        date,
        isEmpty,
        addTask,
      }
  },
  template: `
    <form action="" id="form">
      <label for="categorais">Categorias</label>
      <select name="categorias" v-model="category">
        <option v-for="categoryItem in categories" :key="categoryItem.id">{{ categoryItem.description }}</option>
      </select>
  
      <label for="descricao">
        Descrição:
      </label>
      <input type="text" v-model="description" name="descricao" placeholder="Digite aqui sua tarefa" required>
  
      <label for="data">
        Data de entrega:
      </label>
      <input type="date" v-model="date" name="data" id="data">
  
      <input type="submit" @click="addTask" value="Adicionar" :disabled=isEmpty>
    </form>
  `
})

app.component('task-item', {
  props: ['id', 'description', 'date', 'done', 'category'],
  emits: ['update:done', 'delete'],
  setup(props, { emit }) {
    const vDone = computed({
      get() {
        return props.done
      },
      set(value) {
        emit('update:done', value)
      }
    })

    const remainingDays = computed(() => { 
      const target = new Date(props.date)
      let result = null
      if(Date.now() > target.getMilliseconds()) {
          result = -1 * (Date.now() - target)
      } else {
        result = target - Date.now()
      }
      return  Math.round(result/(1000*60*60*24))
    })

    function askDelete() {
      emit('delete', props.id)
    }

    return {
      vDone,
      remainingDays,
      askDelete
    }
  },
  template: `
  <div :class="category.toLowerCase()">
    <input type="checkbox" name="" :id="id" v-model="vDone">
    <label :for="id">{{ description }}</label>
    <button @click=askDelete>X</button>
    <time :time="date" v-if="date" :class="{late: remainingDays < 0, plural: remainingDays > 1 || remainingDays < -1}">{{ remainingDays }} day</time>
  </div>
  `
})

app.component('task-list', {
  props: ['title', 'emptymsg', 'tasks'],
  emits: ['delete'],
  setup(props, { emit }) {
    function updateTask(change) {
      const task = props.tasks.filter(t => t.id == change.id)[0]
      if (task) task.done = change.done
    }

    function askDelete(id){
      emit('delete', props.tasks.findIndex(t => t.id == id))
    }

    return {
      updateTask,
      askDelete
    }
  },
  template: `
  <h1>{{ title }} </h1>
  <ul v-if="tasks.length !== 0" class="tarefas">
    <li v-for="task in tasks" :key="task.id">
      <task-item :id="task.id" 
        :category="task.category"
        :description="task.description" 
        :date="task.date"
        @delete=askDelete
        v-model:done="task.done"></task-item>
    </li>
  </ul>
  <p v-else> {{ emptymsg }} </p>
  `
})

app.component('todo-summary', {
  props: ['tasks', 'concludedtasks'],
  template: `
    <p class="sumario" v-if="tasks > 0">
      <span class="bar" :style="{width: (concludedtasks/tasks)*100 + '%' }">{{ Math.round((concludedtasks/tasks)*100, 2) }}%</span>
    </p>
  `,
})

app.mount('#app')

