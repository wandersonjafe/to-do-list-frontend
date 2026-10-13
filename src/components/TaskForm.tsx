import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ApiError } from '../api'
import type { TaskInput } from '../types'

interface TaskFormProps {
  onSubmit: (input: TaskInput) => Promise<void>
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await onSubmit({ title, description })
      setTitle('')
      setDescription('')
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

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-4">
      <input
        className="input"
        placeholder="O que precisa ser feito?"
        aria-label="Título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        required
      />

      <input
        className="input"
        placeholder="Descrição (opcional)"
        aria-label="Descrição da tarefa"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && <p className="alert-error">{error}</p>}

      <button type="submit" className="btn-primary self-end" disabled={saving}>
        <Plus className="size-4" />
        {saving ? 'Salvando...' : 'Adicionar tarefa'}
      </button>
    </form>
  )
}