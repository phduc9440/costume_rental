export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface SupplierCreationRequest {
  name: string;
  address: string;
  phone: string;
}

export interface SupplierUpdateRequest {
  name: string;
  address: string;
  phone: string;
}
