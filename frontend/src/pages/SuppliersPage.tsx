import {  useMemo, useState, type FormEvent } from 'react'
import type {Supplier,SupplierInput } from '../types/supplier'
import { getSuppliers, createSupplier, deleteSupplier,updateSupplier } from '../api/suppliersService'
import './SuppliersPage.css'
import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
 
const EMPTY_FORM: SupplierInput = {
  name: '',
  contactPerson: '',
  phone: '',
  isActive: true,
}

function SuppliersPage() {
 
  const [form, setForm] = useState<SupplierInput>(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

 
const { data: suppliers = [], isLoading, error: queryError} = useQuery({
  queryKey: ['suppliers'],
  queryFn: getSuppliers,
})
 
const queryClient = useQueryClient()

const createMutation = useMutation({
  mutationFn: createSupplier,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    setForm(EMPTY_FORM)
  },
  onError: () => setError('שגיאה בהוספת ספק'),
})

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: SupplierInput }) => updateSupplier(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    setForm(EMPTY_FORM)
    setEditingId(null)
  },
  onError: () => setError('שגיאה בעדכון ספק'),
})

const deleteMutation = useMutation({
  mutationFn: deleteSupplier,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
})



function submitSupplier(e: FormEvent) {
  e.preventDefault()
  setError('')
  if (!form.name.trim()) return

  if (editingId !== null) {
    updateMutation.mutate({ id: editingId, data: form })
  } else {
    createMutation.mutate(form)
  }
}



function handleDelete(id: number) {
  deleteMutation.mutate(id)
}

  async function handleEdit(supplier: Supplier) {
  setEditingId(supplier.id)
  setForm({
    name: supplier.name,
    contactPerson: supplier.contactPerson ?? '',
    phone: supplier.phone ?? '',
    isActive: supplier.isActive,
  })
}


  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return suppliers
    return suppliers.filter((s) =>
      [s.name, s.contactPerson, s.phone].some((field) => field?.toLowerCase().includes(query)),
    )
  }, [suppliers, search])

  if (isLoading) return <p>טוען...</p>
  if (queryError) return <p>שגיאה בטעינת ספקים</p>

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

        <form className="suppliers-form" onSubmit={submitSupplier}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="שם *"
          />
          <input
            type="text"
            value={form.contactPerson ?? ''}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="איש קשר"
          />
          <input
            type="text"
            value={form.phone ?? ''}
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
          <button type="submit" className="suppliers-submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingId !== null ? 'עדכן' : 'הוסף'}
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
  <button className="suppliers-edit" onClick={() => handleEdit(s)}>
    ערוך
  </button>
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
