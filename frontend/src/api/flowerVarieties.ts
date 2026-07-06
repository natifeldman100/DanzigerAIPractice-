import type { FlowerVariety, FlowerVarietyInput } from '../types/flowerVarieties'

const BASE_URL = '/api/FlowerVarieties'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`בקשה נכשלה (${res.status})`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

export function getFlowerVarieties(): Promise<FlowerVariety[]> {
  return fetch(BASE_URL).then((res) => handleResponse<FlowerVariety[]>(res))
}

export function createFlowerVariety(input: FlowerVarietyInput): Promise<FlowerVariety> {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then((res) => handleResponse<FlowerVariety>(res))
}

export function updateFlowerVariety(variety: FlowerVariety): Promise<void> {
  return fetch(`${BASE_URL}/${variety.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variety),
  }).then((res) => handleResponse<void>(res))
}

export function deleteFlowerVariety(id: number): Promise<void> {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then((res) =>
    handleResponse<void>(res),
  )
}
