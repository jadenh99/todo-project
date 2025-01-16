import TodoList from "./todo-list";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 md:px-8">
      <TodoList />
    </main>
  );
}
