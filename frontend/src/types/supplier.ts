export interface Supplier  {
  id: number
  name: string
  contactPerson: string | null
  phone: string | null
  isActive: boolean
}

export type SupplierInput = Omit<Supplier, 'id'>