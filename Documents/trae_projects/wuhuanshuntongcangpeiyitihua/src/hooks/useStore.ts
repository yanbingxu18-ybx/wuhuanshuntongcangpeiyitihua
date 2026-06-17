import { useState, useCallback } from 'react';
import { StoreItem, CreateStoreRequest, UpdateStoreRequest, StoreType } from '../types/store';
import { mockStoreList } from '../data/storeData';
import { generateId } from '../utils';

const sortByUpdatedAtDesc = (list: StoreItem[]): StoreItem[] => {
  return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const useStore = () => {
  const [storeList, setStoreList] = useState<StoreItem[]>(sortByUpdatedAtDesc(mockStoreList));
  const [loading, setLoading] = useState(false);

  const getStoreList = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return { data: storeList, total: storeList.length };
  }, [storeList]);

  const getStoreById = useCallback((id: string): StoreItem | undefined => {
    return storeList.find(item => item.id === id);
  }, [storeList]);

  const checkCodeExists = useCallback((code: string, excludeId?: string): boolean => {
    return storeList.some(item => item.code === code && item.id !== excludeId);
  }, [storeList]);

  const createStore = useCallback((request: CreateStoreRequest): StoreItem => {
    const now = new Date().toLocaleString('zh-CN');
    const newStore: StoreItem = {
      id: generateId(),
      code: request.code,
      name: request.name,
      type: request.type,
      location: request.location,
      latitude: request.latitude,
      longitude: request.longitude,
      createdAt: now,
      updatedAt: now,
    };
    setStoreList(prev => sortByUpdatedAtDesc([...prev, newStore]));
    return newStore;
  }, []);

  const updateStore = useCallback((id: string, request: UpdateStoreRequest): StoreItem | undefined => {
    const existing = storeList.find(item => item.id === id);
    if (!existing) return undefined;

    const updatedStore: StoreItem = {
      ...existing,
      ...request,
      latitude: request.latitude !== undefined ? request.latitude : existing.latitude,
      longitude: request.longitude !== undefined ? request.longitude : existing.longitude,
      updatedAt: new Date().toLocaleString('zh-CN'),
    };

    setStoreList(prev => sortByUpdatedAtDesc(prev.map(item => item.id === id ? updatedStore : item)));
    return updatedStore;
  }, [storeList]);

  const deleteStore = useCallback((id: string): boolean => {
    const exists = storeList.some(item => item.id === id);
    if (!exists) return false;
    setStoreList(prev => prev.filter(item => item.id !== id));
    return true;
  }, [storeList]);

  const searchStores = useCallback((code: string, name: string, type: StoreType | ''): StoreItem[] => {
    return storeList.filter(item => {
      const matchCode = !code || item.code.includes(code);
      const matchName = !name || item.name.includes(name);
      const matchType = !type || item.type === type;
      return matchCode && matchName && matchType;
    });
  }, [storeList]);

  return {
    storeList,
    loading,
    getStoreList,
    getStoreById,
    checkCodeExists,
    createStore,
    updateStore,
    deleteStore,
    searchStores,
  };
};