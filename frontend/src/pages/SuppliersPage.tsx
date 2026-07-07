import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Supplier } from '../types/supplier'
import { type SupplierInput, getSuppliers, createSupplier, deleteSupplier } from '../api/suppliersService'
import './SuppliersPage.css'

const EMPTY_FORM: SupplierInput = {
  name: '',
  contactPerson: '',
  phone: '',
  isActive: true,
}

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [form, setForm] = useState<SupplierInput>(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function loadSuppliers() {
    setSuppliers(await getSuppliers())
  }

  async function addSupplier(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return

    try {
      await createSupplier(form)
    } catch {
      setError('שגיאה בהוספת ספק')
      return
    }

    setForm(EMPTY_FORM)
    await loadSuppliers()
  }

  async function handleDelete(id: number) {
    await deleteSupplier(id)
    await loadSuppliers()
  }

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return suppliers
    return suppliers.filter((s) =>
      [s.name, s.contactPerson, s.phone].some((field) => field?.toLowerCase().includes(query)),
    )
  }, [suppliers, search])

  return (
    <div className="suppliers-page">
      <h1>ספקים</h1>

      <div className="suppliers-card">
        <div className="suppliers-toolbar">
          <input
            className="suppliers-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, איש קשר או טלפון..."
          />
        </div>

        <form className="suppliers-form" onSubmit={addSupplier}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="שם *"
          />
          <input
            type="text"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="איש קשר"
          />
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="טלפון"
          />
          <label className="suppliers-checkbox">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            פעיל
          </label>
          <button type="submit" className="suppliers-submit">
            הוסף
          </button>
        </form>
        {error && <p className="suppliers-error">{error}</p>}

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>איש קשר</th>
              <th>טלפון</th>
              <th>סטטוס</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td className="cell-muted">{s.contactPerson || '—'}</td>
                <td className="cell-muted">{s.phone || '—'}</td>
                <td>
                  <span className={`suppliers-badge ${s.isActive ? 'active' : 'inactive'}`}>
                    {s.isActive ? 'פעיל' : 'לא פעיל'}
                  </span>
                </td>
                <td>
                  <button className="suppliers-delete" onClick={() => handleDelete(s.id)}>
                    מחק
                  </button>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="cell-empty">
                  {suppliers.length === 0 ? 'אין ספקים עדיין' : 'לא נמצאו תוצאות'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SuppliersPage
