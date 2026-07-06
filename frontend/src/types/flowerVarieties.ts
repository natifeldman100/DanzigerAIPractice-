export interface FlowerVariety {
  id: number
  name: string
  color: string
  price: number
  inStock: boolean
}

export type FlowerVarietyInput = Omit<FlowerVariety, 'id'>
