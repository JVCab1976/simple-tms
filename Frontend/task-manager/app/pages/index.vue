<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 p-6">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
    <header class="flex justify-between items-center">
        <button @click="previousDate" class="text-blue-500 hover:underline">← Previous</button>
        <h1 class="text-xl font-bold">{{ formattedDate }}</h1>
        <button @click="nextDate" class="text-blue-500 hover:underline">Next →</button>
    </header>

    <!-- Add Task -->
    <section class="flex gap-2">
        <input
          v-model="newTask"
          @keydown.enter="addTask"
          type="text"
          placeholder="What do you need to do?"
          class="flex-1 p-2 border border-gray-300 rounded"
        />
        <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
    </section>

    <!-- Search -->
    <section>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="w-full p-2 border border-gray-300 rounded"
        />
    </section>
        <!-- Task List -->
        <TaskList
            :tasks="filteredTasks"
            @toggle="toggleTask"
            @edit="editTask"
            @delete="deleteTask"
            @reorder="reorderTasks"
        />
    </div>
  </div>
</template>
<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useTaskStore } from '@/stores/task'
    import TaskList from '@/components/TaskList.vue'
    const taskStore = useTaskStore()

    const currentDate = ref(new Date())
    const dateKey = computed(() => currentDate.value.toISOString().split('T')[0])


    const newTask = ref('')
    const searchQuery = ref('')

    const formattedDate = computed(() =>
        currentDate.value.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
    )

    const tasks = ref<Array<{ id: number; statement: string; done: boolean }>>([])

    const filteredTasks = computed(() =>
        taskStore.tasksByDate(dateKey.value).filter((task) =>
            task.statement.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    )
    
    const previousDate = () => {
        const d = new Date(currentDate.value)
        d.setDate(d.getDate() - 1)
        currentDate.value = d
    }

    const nextDate = () => {
        const d = new Date(currentDate.value)
        d.setDate(d.getDate() + 1)
        currentDate.value = d
    }
    
    const toggleTask = (id: number) => taskStore.toggleTask(id)

    const addTask = () => {
        if (!newTask.value.trim()) return
        taskStore.addTask(newTask.value.trim(), dateKey.value)
        newTask.value = ''
    }
    
    const editTask = (id: number) => {
        const task = taskStore.tasks.find((t) => t.id === id)
        if (task) {
            const newStatement = prompt('Edit task:', task.statement)
            if (newStatement !== null && newStatement.trim()) {
            taskStore.editTask(id, newStatement.trim())
            }
        }
    }
    const deleteTask = (id: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            taskStore.deleteTask(id)
        }
    }

    const reorderTasks = (newOrder: number[]) => {
        taskStore.updateOrder(dateKey.value, newOrder)
    }
</script>