import { useEffect, useState } from 'react'
import type { FlowerVariety, FlowerVarietyInput } from '../types/flowerVarieties'

interface FlowerVarietyFormProps {
  initialValue?: FlowerVariety | null
  onSubmit: (input: FlowerVarietyInput) => Promise<void>
  onCancel?: () => void
}

const EMPTY_FORM: FlowerVarietyInput = { name: '', color: '', price: 0, inStock: false }

export function FlowerVarietyForm({ initialValue, onSubmit, onCancel }: FlowerVarietyFormProps) {
  const [form, setForm] = useState<FlowerVarietyInput>(initialValue ?? EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(initialValue ?? EMPTY_FORM)
  }, [initialValue])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return

    setSubmitting(true)
    try {
      await onSubmit(form)
      if (!initialValue) {
        setForm(EMPTY_FORM)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="variety-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="שם הזן"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="צבע"
        value={form.color}
        onChange={(e) => setForm({ ...form, color: e.target.value })}
      />
      <input
        type="number"
        step="0.01"
        placeholder="מחיר"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <label className="in-stock-field">
        <input
          type="checkbox"
          checked={form.inStock}
          onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
        />
        במלאי
      </label>
      <button type="submit" disabled={submitting}>
        {initialValue ? 'עדכון' : 'הוספה'}
      </button>
      {initialValue && onCancel && (
        <button type="button" onClick={onCancel} disabled={submitting}>
          ביטול
        </button>
      )}
    </form>
  )
}
