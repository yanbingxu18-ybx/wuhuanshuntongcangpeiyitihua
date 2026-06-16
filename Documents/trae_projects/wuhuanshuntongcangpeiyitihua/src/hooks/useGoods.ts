import { useState, useCallback } from 'react';
import { GoodsItem, CreateGoodsRequest, UpdateGoodsRequest } from '../types';
import { mockGoodsList } from '../data/mockData';
import { generateId } from '../utils';

const sortByUpdatedAtDesc = (list: GoodsItem[]): GoodsItem[] => {
  return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const useGoods = () => {
  const [goodsList, setGoodsList] = useState<GoodsItem[]>(sortByUpdatedAtDesc(mockGoodsList));
  const [loading, setLoading] = useState(false);

  const getGoodsList = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return { data: goodsList, total: goodsList.length };
  }, [goodsList]);

  const getGoodsById = useCallback((id: string): GoodsItem | undefined => {
    return goodsList.find(item => item.id === id);
  }, [goodsList]);

  const createGoods = useCallback((request: CreateGoodsRequest): GoodsItem => {
    const now = new Date().toLocaleString('zh-CN');
    const newGoods: GoodsItem = {
      id: generateId(),
      name: request.name,
      code: request.code,
      spec: request.spec,
      unit: request.unit,
      shelfLifeDays: request.shelfLifeDays,
      createdAt: now,
      updatedAt: now,
    };
    setGoodsList(prev => sortByUpdatedAtDesc([...prev, newGoods]));
    return newGoods;
  }, []);

  const updateGoods = useCallback((id: string, request: UpdateGoodsRequest): GoodsItem | undefined => {
    const existing = goodsList.find(item => item.id === id);
    if (!existing) return undefined;

    const shelfLifeDays = request.shelfLifeDays !== undefined ? request.shelfLifeDays : existing.shelfLifeDays;

    const updatedGoods: GoodsItem = {
      ...existing,
      ...request,
      shelfLifeDays,
      updatedAt: new Date().toLocaleString('zh-CN'),
    };

    setGoodsList(prev => sortByUpdatedAtDesc(prev.map(item => item.id === id ? updatedGoods : item)));
    return updatedGoods;
  }, [goodsList]);

  const deleteGoods = useCallback((id: string): boolean => {
    const exists = goodsList.some(item => item.id === id);
    if (!exists) return false;
    setGoodsList(prev => prev.filter(item => item.id !== id));
    return true;
  }, [goodsList]);

  const searchGoods = useCallback((keyword: string): GoodsItem[] => {
    if (!keyword) return goodsList;
    return goodsList.filter(item =>
      item.name.includes(keyword) ||
      item.code.includes(keyword) ||
      item.spec.includes(keyword)
    );
  }, [goodsList]);

  return {
    goodsList,
    loading,
    getGoodsList,
    getGoodsById,
    createGoods,
    updateGoods,
    deleteGoods,
    searchGoods,
  };
};
