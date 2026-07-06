import { useEffect, useState } from 'react'
import {
  createFlowerVariety,
  deleteFlowerVariety,
  getFlowerVarieties,
  updateFlowerVariety,
} from '../api/flowerVarieties'
import { FlowerVarietyForm } from './FlowerVarietyForm'
import type { FlowerVariety, FlowerVarietyInput } from '../types/flowerVarieties'
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

  async function handleCreate(input: FlowerVarietyInput) {
    const created = await createFlowerVariety(input)
    setVarieties((prev) => [...prev, created])
  }

  async function handleUpdate(input: FlowerVarietyInput) {
    if (!editing) return
    const updated = { ...editing, ...input }
    await updateFlowerVariety(updated)
    setVarieties((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
    setEditing(null)
  }

  async function handleDelete(id: number) {
    if (!confirm('למחוק את הזן?')) return
    await deleteFlowerVariety(id)
    setVarieties((prev) => prev.filter((v) => v.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  return (
    <div className="varieties-page">
      <h1>זני פרחים</h1>

      <FlowerVarietyForm
        initialValue={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        onCancel={() => setEditing(null)}
      />

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {varieties.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.color}</td>
                <td>{v.price}</td>
                <td>{v.inStock ? 'כן' : 'לא'}</td>
                <td className="actions">
                  <button onClick={() => setEditing(v)}>עריכה</button>
                  <button onClick={() => handleDelete(v.id)}>מחיקה</button>
                </td>
              </tr>
            ))}
            {varieties.length === 0 && (
              <tr>
                <td colSpan={5}>אין זני פרחים עדיין</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
