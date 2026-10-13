import { useEffect, useState } from 'react'
import { LogOut, Trash2 } from 'lucide-react'
import { ApiError, api } from '../api'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import type { Task, TaskInput } from '../types'
import { useAuth } from '../useAuth'

function messageFrom(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Erro inesperado'
}

export default function HomePage() {
  const { email, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    api
      .listTasks()
      .then((data) => {
        if (active) setTasks(data)
      })
      .catch((err) => {
        if (active) setError(messageFrom(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function replaceTask(updated: Task) {
    setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)))
  }

  // Erros de criar e editar sobem para o formulário; os demais aparecem acima da lista
  async function run(action: () => Promise<void>) {
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(messageFrom(err))
    }
  }

  async function handleCreate(input: TaskInput) {
    const created = await api.createTask(input)
    setTasks((prev) => [created, ...prev])
  }

  async function handleUpdate(id: number, input: TaskInput) {
    replaceTask(await api.updateTask(id, input))
  }

  function handleToggle(task: Task) {
    return run(async () => {
      const updated =
        task.status === 'COMPLETED' ? await api.reopenTask(task.id) : await api.completeTask(task.id)
      replaceTask(updated)
    })
  }

  function handleDelete(id: number) {
    return run(async () => {
      await api.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    })
  }

    async function handleClearAll() {
    if (!window.confirm('Excluir todas as tarefas? Essa ação não pode ser desfeita.')) return

    await run(async () => {
      await api.deleteAllTasks()
      setTasks([])
    })
  }

  const pending = tasks.filter((task) => task.status === 'PENDING').length
  const done = tasks.length - pending

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="font-mono text-base font-semibold tracking-tight">
            <span className="text-emerald-400">~/</span>to-do list
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-48 truncate text-sm text-zinc-400 sm:block">{email}</span>
            <button type="button" className="btn-ghost" onClick={logout}>
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
                <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Minhas tarefas</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {pending} pendentes · {done} concluídas
            </p>
          </div>

          {tasks.length > 0 && (
            <button type="button" className="btn-ghost hover:text-red-400" onClick={handleClearAll}>
              <Trash2 className="size-4" />
              Limpar tudo
            </button>
          )}
        </div>

        <TaskForm onSubmit={handleCreate} />

        {error && <p className="alert-error">{error}</p>}

        {loading ? (
          <p className="text-sm text-zinc-500">Carregando...</p>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-12 text-center">
            <p className="font-mono text-sm text-zinc-500">Nenhuma tarefa ainda.</p>
            <p className="mt-1 text-sm text-zinc-600">Adicione a primeira no formulário acima.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}