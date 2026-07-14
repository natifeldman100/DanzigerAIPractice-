import type { Supplier, SupplierInput } from '../types/supplier'


const BASE_URL = '/api/suppliers'

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(BASE_URL)
  return res.json()
}

export async function createSupplier(supplier: SupplierInput): Promise<Supplier> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  })
  if (!res.ok) {
    throw new Error('Failed to create supplier')
  }
  return res.json()
}

export async function deleteSupplier(id: number): Promise<void> {
  await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
}
