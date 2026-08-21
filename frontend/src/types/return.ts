import type { ErrorPenalty } from "./error";

export interface ReturnItemRequest {
  chiTietPhieuMuonId: string;
  tinhTrang: string;
  loiIds: string[];
  tienPhat: number;
}

export interface ReturnRequest {
  phieuMuonId: string;
  ngayTra: string;
  items: ReturnItemRequest[];
}

export interface ReturnItemResponse {
  id: string;
  chiTietPhieuMuonId: string;
  tinhTrang: string;
  tienPhat: number;
  lois: ErrorPenalty[];
}

export interface ReturnResponse {
  id: string;
  phieuMuonId: string;
  ngayTra: string;
  tongTienTra: number;
  items: ReturnItemResponse[];
}

export interface RevenueStatisticResponse {
  period: string;
  totalRevenue: number;
}

export interface ReturnInvoiceDetailResponse {
  id: string;
  customerName: string;
  borrowDate: string;
  totalItems: number;
  totalAmount: number;
}
