import { StockAgeAlertDetail, StockAgeAlertCheckResult } from '../types/stockAgeAlert';
import { mockStockAgeAlertList } from '../data/stockAgeAlertData';

interface BillItem {
  rowNumber: number;
  goodsId: string;
  goodsCode: string;
  goodsName: string;
  productionDate: string;
}

export const checkStockAgeAlerts = (
  items: BillItem[],
  documentDate: string
): StockAgeAlertCheckResult => {
  const alerts: StockAgeAlertDetail[] = [];
  const documentDateObj = new Date(documentDate);

  for (const item of items) {
    // 查找该货物是否配置了货龄提醒规则
    const alertRule = mockStockAgeAlertList.find(rule => rule.goodsId === item.goodsId);

    if (!alertRule) continue;

    // 计算货龄（天）
    const productionDateObj = new Date(item.productionDate);
    const ageDays = Math.floor(
      (documentDateObj.getTime() - productionDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 如果货龄超过提醒天数
    if (ageDays > alertRule.alertDays) {
      alerts.push({
        rowNumber: item.rowNumber,
        goodsCode: item.goodsCode,
        goodsName: item.goodsName,
        productionDate: item.productionDate,
        ageDays,
        alertDays: alertRule.alertDays,
      });
    }
  }

  return {
    hasAlert: alerts.length > 0,
    alerts,
  };
};
