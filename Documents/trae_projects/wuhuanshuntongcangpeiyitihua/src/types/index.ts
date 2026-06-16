export interface GoodsItem {
  id: string;
  name: string;
  code: string;
  spec: string;
  unit: string;
  shelfLifeDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoodsRequest {
  name: string;
  code: string;
  spec: string;
  unit: string;
  shelfLifeDays: number;
}

export interface UpdateGoodsRequest {
  name?: string;
  code?: string;
  spec?: string;
  unit?: string;
  shelfLifeDays?: number;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export interface GoodsQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface GoodsResponse {
  data: GoodsItem[];
  total: number;
  page: number;
  pageSize: number;
}
