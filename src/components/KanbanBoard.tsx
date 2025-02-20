import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, Trash2, Edit2, MoreHorizontal } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

// Task interface
interface Task {
  id: string
  content: string
}

// Column interface
interface Column {
  id: string
  title: string
  tasks: Task[]
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: uuidv4(), content: 'Design new dashboard layout' },
        { id: uuidv4(), content: 'Implement user authentication' }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        { id: uuidv4(), content: 'Develop Kanban board' }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: uuidv4(), content: 'Set up project structure' },
        { id: uuidv4(), content: 'Configure Supabase' }
      ]
    }
  ])

  const [newTaskInput, setNewTaskInput] = useState<{ [key: string]: string }>({
    todo: '',
    'in-progress': '',
    done: ''
  })

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // If dropped outside a droppable area
    if (!destination) return

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    // Create a copy of columns to modify
    const newColumns = [...columns]
    const sourceColumnIndex = newColumns.findIndex(col => col.id === source.droppableId)
    const destColumnIndex = newColumns.findIndex(col => col.id === destination.droppableId)

    // Remove task from source column
    const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(source.index, 1)

    // Add task to destination column
    newColumns[destColumnIndex].tasks.splice(destination.index, 0, movedTask)

    setColumns(newColumns)
  }

  const addTask = (columnId: string) => {
    const taskContent = newTaskInput[columnId].trim()
    if (!taskContent) return

    const newColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [
            ...column.tasks,
            { id: uuidv4(), content: taskContent }
          ]
        }
      }
      return column
    })

    setColumns(newColumns)
    setNewTaskInput({ ...newTaskInput, [columnId]: '' })
  }

  const deleteTask = (columnId: string, taskId: string) => {
    const newColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        }
      }
      return column
    })

    setColumns(newColumns)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-royal-blue-600">Task Management</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">{column.title}</h2>
                    <MoreHorizontal className="text-gray-500" />
                  </div>

                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-royal-blue-50 rounded-lg p-3 mb-3 flex items-center justify-between shadow-sm"
                        >
                          <span className="flex-grow mr-2">{task.content}</span>
                          <div className="flex items-center space-x-2">
                            <Edit2 
                              className="h-4 w-4 text-gray-500 hover:text-royal-blue-600 cursor-pointer" 
                              onClick={() => {/* Edit task logic */}}
                            />
                            <Trash2 
                              className="h-4 w-4 text-red-500 hover:text-red-600 cursor-pointer" 
                              onClick={() => deleteTask(column.id, task.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <div className="mt-4 flex">
                    <input 
                      type="text"
                      placeholder={`Add task to ${column.title}`}
                      value={newTaskInput[column.id] || ''}
                      onChange={(e) => setNewTaskInput({
                        ...newTaskInput, 
                        [column.id]: e.target.value
                      })}
                      className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
                    />
                    <button 
                      onClick={() => addTask(column.id)}
                      className="bg-royal-blue-600 text-white p-2 rounded-md hover:bg-royal-blue-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default KanbanBoard
