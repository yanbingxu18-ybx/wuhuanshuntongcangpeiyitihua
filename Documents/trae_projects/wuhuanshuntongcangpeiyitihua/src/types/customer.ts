export type CustomerType = '仓储型' | '月库型';

export const CUSTOMER_TYPES: CustomerType[] = ['仓储型', '月库型'];

export interface CustomerItem {
  id: string;
  code: string;
  name: string;
  type: CustomerType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  code: string;
  name: string;
  type: CustomerType;
}

export interface UpdateCustomerRequest {
  name?: string;
  type?: CustomerType;
}

export interface CustomerQuery {
  page?: number;
  pageSize?: number;
  code?: string;
  name?: string;
  type?: CustomerType | '';
}

export interface CustomerResponse {
  data: CustomerItem[];
  total: number;
  page: number;
  pageSize: number;
}
