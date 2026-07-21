import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  createFlowerVariety,
  deleteFlowerVariety,
  getFlowerVarieties,
  updateFlowerVariety,
} from '../api/flowerVarieties'
import { FlowerVarietyForm } from './FlowerVarietyForm'
import type { FlowerVariety, FlowerVarietyInput } from '../types/flowerVarieties'
import { canEdit } from '../api/authService'
import './FlowerVarietiesPage.css'

export function FlowerVarietiesPage() {
  const [varieties, setVarieties] = useState<FlowerVariety[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<FlowerVariety | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setVarieties(await getFlowerVarieties())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת הזנים')
    } finally {
      setLoading(false)
    }
  }

  const createMutation = useMutation({
    mutationFn: createFlowerVariety,
    onSuccess: (created) => {
      setVarieties((prev) => [...prev, created])
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateFlowerVariety,
    onSuccess: (_data, updated) => {
      setVarieties((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFlowerVariety,
    onSuccess: (_data, id) => {
      setVarieties((prev) => prev.filter((v) => v.id !== id))
      if (editing?.id === id) setEditing(null)
    },
  })

  async function handleCreate(input: FlowerVarietyInput) {
    await createMutation.mutateAsync(input)
  }

  async function handleUpdate(input: FlowerVarietyInput) {
    if (!editing) return
    await updateMutation.mutateAsync({ ...editing, ...input })
  }

  async function handleDelete(id: number) {
    if (!confirm('למחוק את הזן?')) return
    await deleteMutation.mutateAsync(id)
  }

  const allowEdit = canEdit()

  return (
    <div className="varieties-page">
      <h1>זני פרחים</h1>

      {allowEdit && (
        <FlowerVarietyForm
          initialValue={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
        />
      )}

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>טוען...</p>
      ) : (
        <table className="varieties-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>צבע</th>
              <th>מחיר</th>
              <th>במלאי</th>
              {allowEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {varieties.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.color}</td>
                <td>{v.price}</td>
                <td>{v.inStock ? 'כן' : 'לא'}</td>
                {allowEdit && (
                  <td className="actions">
                    <button onClick={() => setEditing(v)}>עריכה</button>
                    <button onClick={() => handleDelete(v.id)}>מחיקה</button>
                  </td>
                )}
              </tr>
            ))}
            {varieties.length === 0 && (
              <tr>
                <td colSpan={allowEdit ? 5 : 4}>אין זני פרחים עדיין</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
