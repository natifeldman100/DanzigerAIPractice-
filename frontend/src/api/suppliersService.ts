import type { Supplier, SupplierInput } from '../types/supplier'
import { apiFetch } from './httpClient'


const BASE_URL = '/api/suppliers'

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await apiFetch(BASE_URL)
  return res.json()
}

export async function createSupplier(supplier: SupplierInput): Promise<Supplier> {
  const res = await apiFetch(BASE_URL, {
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
  await apiFetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
}

export async function updateSupplier(id: number, supplier: SupplierInput): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...supplier }),
  })
  if (!res.ok) {
    throw new Error('Failed to update supplier')
  }
}