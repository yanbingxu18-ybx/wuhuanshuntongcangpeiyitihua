export type StoreType = '冷冻' | '冷藏' | '常温';

export interface StoreItem {
  id: string;
  code: string;
  name: string;
  type: StoreType;
  location: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  code: string;
  name: string;
  type: StoreType;
  location: string;
  latitude: number;
  longitude: number;
}

export interface UpdateStoreRequest {
  code?: string;
  name?: string;
  type?: StoreType;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface StoreQuery {
  page?: number;
  pageSize?: number;
  code?: string;
  name?: string;
  type?: StoreType;
}

export interface StoreResponse {
  data: StoreItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const STORE_TYPES: StoreType[] = ['冷冻', '冷藏', '常温'];