import type { Customer } from "./customer";
import type { Costume } from "./costume";

export type RentalStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DEPOSIT_PAID"
  | "RENTING"
  | "CANCELLED"
  | "COMPLETED";

export type RentalType = "ONLINE" | "OFFLINE";

export interface RentalItem {
  id: string;
  quantity: number;
  amount: number;
  costumeResponse: Costume;
}

export interface RentalOrder {
  id: string;
  deposit: number;
  totalAmount: number;
  createDate: string;
  type: RentalType;
  status: RentalStatus;
  cancelReason?: string;
  dueDate?: string;
  customerResponse: Customer;
  rentalDetailResponses: RentalItem[];
}

export interface CreateRentalOrderRequest {
  customerId: string;
  items: {
    costumeId: string;
    quantity: number;
  }[];
  dueDate?: string;
}
