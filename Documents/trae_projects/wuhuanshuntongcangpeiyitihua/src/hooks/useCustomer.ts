import { useState, useCallback } from 'react';
import { CustomerItem, CreateCustomerRequest, UpdateCustomerRequest, CustomerType } from '../types/customer';
import { mockCustomerList } from '../data/customerData';
import { generateId } from '../utils';

const sortByUpdatedAtDesc = (list: CustomerItem[]): CustomerItem[] => {
  return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const useCustomer = () => {
  const [customerList, setCustomerList] = useState<CustomerItem[]>(sortByUpdatedAtDesc([...mockCustomerList]));
  const [loading, setLoading] = useState(false);

  const getCustomerList = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return { data: customerList, total: customerList.length };
  }, [customerList]);

  const getCustomerById = useCallback((id: string): CustomerItem | undefined => {
    return customerList.find(item => item.id === id);
  }, [customerList]);

  const createCustomer = useCallback((request: CreateCustomerRequest): CustomerItem => {
    const now = new Date().toLocaleString('zh-CN');
    const newCustomer: CustomerItem = {
      id: generateId(),
      code: request.code,
      name: request.name,
      type: request.type,
      createdAt: now,
      updatedAt: now,
    };
    setCustomerList(prev => sortByUpdatedAtDesc([...prev, newCustomer]));
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((id: string, request: UpdateCustomerRequest): CustomerItem | undefined => {
    const existing = customerList.find(item => item.id === id);
    if (!existing) return undefined;

    const updatedCustomer: CustomerItem = {
      ...existing,
      ...request,
      updatedAt: new Date().toLocaleString('zh-CN'),
    };

    setCustomerList(prev => sortByUpdatedAtDesc(prev.map(item => item.id === id ? updatedCustomer : item)));
    return updatedCustomer;
  }, [customerList]);

  const deleteCustomer = useCallback((id: string): boolean => {
    const exists = customerList.some(item => item.id === id);
    if (!exists) return false;
    setCustomerList(prev => prev.filter(item => item.id !== id));
    return true;
  }, [customerList]);

  const searchCustomers = useCallback((code?: string, name?: string, type?: CustomerType | ''): CustomerItem[] => {
    let result = customerList;
    if (code) {
      result = result.filter(item => item.code.includes(code));
    }
    if (name) {
      result = result.filter(item => item.name.includes(name));
    }
    if (type) {
      result = result.filter(item => item.type === type);
    }
    return result;
  }, [customerList]);

  const checkCodeExists = useCallback((code: string, excludeId?: string): boolean => {
    return customerList.some(item => item.code === code && item.id !== excludeId);
  }, [customerList]);

  return {
    customerList,
    loading,
    getCustomerList,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    checkCodeExists,
  };
};
