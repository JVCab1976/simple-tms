<template>
  <DndContext @dragEnd="onDragEnd">
    <SortableContext :items="tasks.map(task => task.id)">
      <ul class="space-y-2">
        <li
          v-for="task in tasks"
          :key="task.id"
          :id="String(task.id)"
          class="flex items-center justify-between p-3 border rounded bg-white shadow-sm cursor-move"
          v-bind="getDraggableProps(task.id)"
        >
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="task.done"
              @change="$emit('toggle', task.id)"
              class="h-5 w-5 text-blue-500"
            />
            <span :class="['text-sm', task.done ? 'line-through text-gray-400' : 'text-gray-800']">
              {{ task.statement }}
            </span>
          </div>

          <div class="flex gap-2">
            <LucideEdit
              class="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-500"
              @click="$emit('edit', task.id)"
            />
            <LucideTrash2
              class="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
              @click="$emit('delete', task.id)"
            />
          </div>
        </li>
      </ul>
    </SortableContext>
  </DndContext>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { LucideEdit, LucideTrash2 } from 'lucide-vue-next'

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core'

import {
  SortableContext,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'

const props = defineProps<{
  tasks: Task[]
  date?: string
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'reorder', newOrder: number[]): void
}>()

const onDragEnd = (event: any) => {
  const { active, over } = event
  if (!over || active.id === over.id) return

  const oldIndex = props.tasks.findIndex((t) => t.id === Number(active.id))
  const newIndex = props.tasks.findIndex((t) => t.id === Number(over.id))

  const reordered = arrayMove(props.tasks, oldIndex, newIndex)
  emit('reorder', reordered.map((t) => t.id))
}

// Optional: bind draggable props (not required but good for DnD feedback)
const getDraggableProps = (id: number) => {
  const { attributes, listeners } = useSortable({ id: String(id) })
  return {
    ...attributes,
    ...listeners,
  }
}
</script>

