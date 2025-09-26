
// import { useUserStore } from '@/stores/user'
// import { createPinia } from 'pinia'
// import { createApp } from 'vue'
// import App from './App.vue'

// // ❌  fails because it's called before the pinia is created
// const userStore = useUserStore()

// const pinia = createPinia()
// const app = createApp(App)
// app.use(pinia)

// // ✅ works because the pinia instance is now active
// const userStore = useUserStore()


import { defineStore } from 'pinia'
import type { Task } from '@/types/task'


export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
  }),

  getters: {
    tasksByDate: (state) => {
      return (date: string) =>
        state.tasks
          .filter((t) => t.date === date)
          .sort((a, b) => a.order - b.order)
    },
  },

  actions: {
    addTask(statement: string, date: string) {
      const newTask: Task = {
        id: Date.now(),
        statement,
        done: false,
        date,
        order: this.tasks.filter((t) => t.date === date).length,
      }
      this.tasks.push(newTask)
    },

    toggleTask(id: number) {
      const task = this.tasks.find((t) => t.id === id)
      if (task) task.done = !task.done
    },

    editTask(id: number, newStatement: string) {
      const task = this.tasks.find((t) => t.id === id)
      if (task) task.statement = newStatement
    },

    deleteTask(id: number) {
      this.tasks = this.tasks.filter((t) => t.id !== id)
    },

    updateOrder(date: string, orderedIds: number[]) {
      const tasksForDate = this.tasks.filter((t) => t.date === date)
      orderedIds.forEach((id, index) => {
        const task = tasksForDate.find((t) => t.id === id)
        if (task) task.order = index
      })
    },
  },
})
