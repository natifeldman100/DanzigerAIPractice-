import { useEffect, useState } from "react";
import type { Customer, CustomerInput } from "../types/Customer";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customersApi";
import { canEdit } from "../api/authService";
import "../App.css";

const emptyForm: CustomerInput = {
  name: "", email: "", phone: "", address: "", salesman: "", country: "", continent: "",
};

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadCustomers() {
    setLoading(true);
    try {
      setCustomers(await getCustomers());
      setError(null);
    } catch {
      setError("שגיאה בטעינת לקוחות");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCustomers(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId !== null) {
      await updateCustomer(editingId, form);
    } else {
      await createCustomer(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    await loadCustomers();
  }

  function handleEdit(customer: Customer) {
    setEditingId(customer.id);
    const { id, ...rest } = customer;
    setForm(rest);
  }

  async function handleDelete(id: number) {
    await deleteCustomer(id);
    await loadCustomers();
  }

  if (loading) return <p className="status">טוען...</p>;
  if (error) return <p className="status">{error}</p>;

  const allowEdit = canEdit();

  return (
    <div className="customers-page">
      <h1>לקוחות</h1>

      {allowEdit && (
        <form className="customer-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="שם" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="אימייל" value={form.email} onChange={handleChange} />
          <input name="phone" placeholder="טלפון" value={form.phone} onChange={handleChange} />
          <input name="address" placeholder="כתובת" value={form.address} onChange={handleChange} />
          <input name="salesman" placeholder="איש מכירות" value={form.salesman} onChange={handleChange} />
          <input name="country" placeholder="מדינה" value={form.country} onChange={handleChange} />
          <input name="continent" placeholder="יבשת" value={form.continent} onChange={handleChange} />
          <button type="submit" className="btn btn-primary">{editingId !== null ? "עדכן" : "הוסף"}</button>
        </form>
      )}

      <div className="customers-table-wrap">
        <table className="customers-table">
          <thead>
            <tr>
              <th>שם</th><th>אימייל</th><th>טלפון</th><th>כתובת</th>
              <th>איש מכירות</th><th>מדינה</th><th>יבשת</th>{allowEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.address}</td>
                <td>{c.salesman}</td><td>{c.country}</td><td>{c.continent}</td>
                {allowEdit && (
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(c)}>ערוך</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>מחק</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersPage;
