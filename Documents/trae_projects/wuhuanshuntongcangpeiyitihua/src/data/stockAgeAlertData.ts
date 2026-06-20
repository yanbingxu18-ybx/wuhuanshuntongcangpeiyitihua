import { StockAgeAlertItem } from '../types/stockAgeAlert';
import { mockGoodsList } from './mockData';

// 仅选择有保质期的货物对应的货龄提醒规则
export const mockStockAgeAlertList: StockAgeAlertItem[] = [
  {
    id: '1',
    goodsId: '1',
    goodsCode: 'COKE001',
    goodsName: '可口可乐',
    shelfLifeDays: 365,
    alertDays: 180,
    remark: '易过期货物，重点监控',
    createdAt: '2026-01-10 10:30:00',
    updatedAt: '2026-01-10 10:30:00',
  },
  {
    id: '2',
    goodsId: '4',
    goodsCode: 'MENGNIU001',
    goodsName: '蒙牛纯牛奶',
    shelfLifeDays: 180,
    alertDays: 150,
    remark: '牛奶保质期短，及时提醒',
    createdAt: '2026-02-15 14:20:00',
    updatedAt: '2026-02-15 14:20:00',
  },
  {
    id: '3',
    goodsId: '8',
    goodsCode: 'HONGNIU001',
    goodsName: '红牛维生素功能饮料',
    shelfLifeDays: 540,
    alertDays: 360,
    remark: '',
    createdAt: '2026-03-08 09:20:00',
    updatedAt: '2026-03-08 09:20:00',
  },
  {
    id: '4',
    goodsId: '2',
    goodsCode: 'PEPSI001',
    goodsName: '百事可乐',
    shelfLifeDays: 365,
    alertDays: 300,
    remark: '长期库存监控',
    createdAt: '2026-04-10 11:00:00',
    updatedAt: '2026-04-10 11:00:00',
  },
  {
    id: '5',
    goodsId: '7',
    goodsCode: 'WANGZAI001',
    goodsName: '旺仔牛奶',
    shelfLifeDays: 365,
    alertDays: 200,
    remark: '',
    createdAt: '2026-05-18 10:00:00',
    updatedAt: '2026-05-18 10:00:00',
  },
];

// 获取已维护保质期的货物列表
export const getGoodsWithShelfLife = () => {
  return mockGoodsList.filter(goods => goods.shelfLifeDays && goods.shelfLifeDays > 0);
};
