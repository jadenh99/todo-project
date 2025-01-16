/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Todo {
  id: number;
  name: string;
  description: string;
  created_at: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setLoading(true);
      const { data: todos, error } = await supabase
        .from("todos")
        .select()
        .order("id", { ascending: true });
      if (todos) {
        setTodos(todos);
      }
      if (error) throw error;
    } catch (err) {
      console.error(`Error fetching todos: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    if (newTodo.trim() !== "") {
      try {
        const { data, error } = await supabase
          .from("todos")
          .insert([{ name: newTodo, completed: false }])
          .select();

        if (error) {
          throw error;
        }

        if (data) {
          setTodos([...todos, data[0]]);
          setNewTodo("");
        }
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  }

  async function toggleTodo(id: number) {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !todoToUpdate.completed })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function clearTodos() {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("completed", true);
      setTodos(todos.filter((todo) => todo.completed === false));
      if (error) throw error;
    } catch (err) {
      console.error("Error clearing todos: ", err);
    }
  }

  if (loading) {
    return <div className="text-center mt-10">Loading todos...</div>;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto mt-10 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
        Todo List
      </h1>
      <div className="flex flex-col sm:flex-row mb-6">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mb-2 sm:mb-0 sm:mr-4 text-base sm:text-lg"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <Button size="lg" className="text-base sm:text-lg" onClick={addTodo}>
          Add
        </Button>
        <Button
          size="lg"
          className="text-base sm:text-lg ms-3"
          onClick={clearTodos}
        >
          Clear
        </Button>
      </div>
      {!loading && (
        <ul className="space-y-3 sm:space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between bg-white rounded-md text-base sm:text-lg`}
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="ms-5mr-2 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`p-3 sm:p-4 hover:bg-gray-100 hover:cursor-pointer ease-in-out duration-300 rounded ${
                  todo.completed ? "line-through text-gray-500 " : ""
                } flex-1`}
              >
                {todo.name}
              </label>
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
      )}
    </div>
  );
}
