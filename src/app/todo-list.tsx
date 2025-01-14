"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Todo1", completed: false },
    { id: 2, text: "Todo2", completed: false },
  ])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto mt-10 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Todo List</h1>
      <div className="flex flex-col sm:flex-row mb-6">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mb-2 sm:mb-0 sm:mr-4 text-base sm:text-lg"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTodo()
            }
          }}
        />
        <Button onClick={addTodo} size="lg" className="text-base sm:text-lg">Add</Button>
      </div>
      <ul className="space-y-3 sm:space-y-4">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
            }  rounded-md text-base sm:text-lg`}
          >
            {/* <div className="flex items-center flex-1 mr-2 sm:mr-4"> */}
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="ms-5mr-2 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`p-3 sm:p-4 ${
                  todo.completed ? "line-through text-gray-500 " : ""
                } flex-1`}
              >
                {todo.text}
              </label>
            {/* </div> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete todo"
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Trash2 className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

