import { Check, Pencil, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api'
import type { Task, TaskInput } from '../types'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, input: TaskInput) => Promise<void>
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const completed = task.status === 'COMPLETED'

  function startEditing() {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setError(null)
    setEditing(true)
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await onUpdate(task.id, { title, description })
      setEditing(false)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.fieldErrors?.title ?? err.message)
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setSaving(false)
    }
  }

  function handleDelete() {
    if (window.confirm(`Excluir a tarefa "${task.title}"?`)) {
      onDelete(task.id)
    }
  }

  if (editing) {
    return (
      <li className="card p-4">
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input
            className="input"
            aria-label="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />

          <input
            className="input"
            aria-label="Descrição da tarefa"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="alert-error">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="card flex items-start gap-3 p-4 transition hover:border-zinc-700">
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={completed ? 'Reabrir tarefa' : 'Concluir tarefa'}
        onClick={() => onToggle(task)}
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
          completed
            ? 'border-emerald-500 bg-emerald-500 text-zinc-950'
            : 'border-zinc-600 hover:border-emerald-500'
        }`}
      >
        {completed && <Check className="size-3.5" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-medium wrap-anywhere ${
            completed ? 'text-zinc-500 line-through' : 'text-zinc-100'
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 text-sm text-zinc-400 wrap-anywhere">{task.description}</p>
        )}

        <p className="mt-2 font-mono text-xs text-zinc-600">
          {new Date(task.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="flex shrink-0 gap-1">
        <button type="button" className="btn-icon" onClick={startEditing} aria-label="Editar tarefa" title="Editar">
          <Pencil className="size-4" />
        </button>
        <button type="button" className="btn-icon-danger" onClick={handleDelete} aria-label="Excluir tarefa" title="Excluir">
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  )
}