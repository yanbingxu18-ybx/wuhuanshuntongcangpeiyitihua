import { useState, useCallback } from 'react';
import { StockAgeAlertItem, CreateStockAgeAlertRequest, UpdateStockAgeAlertRequest } from '../types/stockAgeAlert';
import { mockStockAgeAlertList } from '../data/stockAgeAlertData';
import { generateId } from '../utils';

const sortByUpdatedAtDesc = (list: StockAgeAlertItem[]): StockAgeAlertItem[] => {
  return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const useStockAgeAlert = () => {
  const [alertList, setAlertList] = useState<StockAgeAlertItem[]>(sortByUpdatedAtDesc([...mockStockAgeAlertList]));
  const [loading, setLoading] = useState(false);

  const getAlertList = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return { data: alertList, total: alertList.length };
  }, [alertList]);

  const getAlertById = useCallback((id: string): StockAgeAlertItem | undefined => {
    return alertList.find(item => item.id === id);
  }, [alertList]);

  const createAlert = useCallback((request: CreateStockAgeAlertRequest, goodsInfo: { code: string; name: string; shelfLifeDays: number }): StockAgeAlertItem => {
    const now = new Date().toLocaleString('zh-CN');
    const newAlert: StockAgeAlertItem = {
      id: generateId(),
      goodsId: request.goodsId,
      goodsCode: goodsInfo.code,
      goodsName: goodsInfo.name,
      shelfLifeDays: goodsInfo.shelfLifeDays,
      alertDays: request.alertDays,
      remark: request.remark || '',
      createdAt: now,
      updatedAt: now,
    };
    setAlertList(prev => sortByUpdatedAtDesc([...prev, newAlert]));
    return newAlert;
  }, []);

  const updateAlert = useCallback((id: string, request: UpdateStockAgeAlertRequest): StockAgeAlertItem | undefined => {
    const existing = alertList.find(item => item.id === id);
    if (!existing) return undefined;

    const updatedAlert: StockAgeAlertItem = {
      ...existing,
      alertDays: request.alertDays,
      remark: request.remark || '',
      updatedAt: new Date().toLocaleString('zh-CN'),
    };

    setAlertList(prev => sortByUpdatedAtDesc(prev.map(item => item.id === id ? updatedAlert : item)));
    return updatedAlert;
  }, [alertList]);

  const deleteAlert = useCallback((id: string): boolean => {
    const exists = alertList.some(item => item.id === id);
    if (!exists) return false;
    setAlertList(prev => prev.filter(item => item.id !== id));
    return true;
  }, [alertList]);

  const searchAlerts = useCallback((keyword: string): StockAgeAlertItem[] => {
    if (!keyword) return alertList;
    const lowerKeyword = keyword.toLowerCase();
    return alertList.filter(item =>
      item.goodsCode.toLowerCase().includes(lowerKeyword) ||
      item.goodsName.toLowerCase().includes(lowerKeyword)
    );
  }, [alertList]);

  const checkGoodsExists = useCallback((goodsId: string): boolean => {
    return alertList.some(item => item.goodsId === goodsId);
  }, [alertList]);

  return {
    alertList,
    loading,
    getAlertList,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert,
    searchAlerts,
    checkGoodsExists,
  };
};
