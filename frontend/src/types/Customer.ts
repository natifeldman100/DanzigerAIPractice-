export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  salesman: string;
  country: string;
  continent: string;
}

export type CustomerInput = Omit<Customer, "id">;
