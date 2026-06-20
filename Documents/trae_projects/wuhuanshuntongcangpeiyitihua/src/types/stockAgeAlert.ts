// 货物货龄提醒规则类型定义
export interface StockAgeAlertItem {
  id: string;
  goodsId: string;
  goodsCode: string;
  goodsName: string;
  shelfLifeDays: number;
  alertDays: number;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockAgeAlertRequest {
  goodsId: string;
  alertDays: number;
  remark?: string;
}

export interface UpdateStockAgeAlertRequest {
  alertDays: number;
  remark?: string;
}

// 货龄提醒校验结果
export interface StockAgeAlertCheckResult {
  hasAlert: boolean;
  alerts: StockAgeAlertDetail[];
}

export interface StockAgeAlertDetail {
  rowNumber: number;
  goodsCode: string;
  goodsName: string;
  productionDate: string;
  ageDays: number;
  alertDays: number;
}
