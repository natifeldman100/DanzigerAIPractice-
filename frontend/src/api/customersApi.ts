import type { Customer, CustomerInput } from "../types/Customer";
import { apiFetch } from "./httpClient";

const BASE_URL = "http://localhost:5092/api/customers";

export async function getCustomers(): Promise<Customer[]> {
  const res = await apiFetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function createCustomer(data: CustomerInput): Promise<Customer> {
  const res = await apiFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

export async function updateCustomer(id: number, data: CustomerInput): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update customer");
}

export async function deleteCustomer(id: number): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
}
