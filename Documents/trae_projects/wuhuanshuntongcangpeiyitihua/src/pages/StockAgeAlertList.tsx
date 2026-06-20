import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { StockAgeAlertItem, CreateStockAgeAlertRequest, UpdateStockAgeAlertRequest } from '../types/stockAgeAlert';
import { useStockAgeAlert } from '../hooks/useStockAgeAlert';
import { StockAgeAlertForm } from '../components/StockAgeAlertForm';

export const StockAgeAlertList = () => {
  const { loading, createAlert, updateAlert, deleteAlert, searchAlerts, checkGoodsExists } = useStockAgeAlert();
  const [keyword, setKeyword] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockAgeAlertItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const filteredAlerts = useMemo(() => {
    return searchAlerts(keyword);
  }, [keyword, searchAlerts]);

  const totalPages = Math.ceil(filteredAlerts.length / pageSize);
  const paginatedAlerts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAlerts.slice(start, start + pageSize);
  }, [filteredAlerts, page, pageSize]);

  const handleReset = () => {
    setKeyword('');
    setPage(1);
  };

  const handleSubmit = (data: CreateStockAgeAlertRequest | UpdateStockAgeAlertRequest, goodsInfo?: { code: string; name: string; shelfLifeDays: number }) => {
    if (editingItem) {
      updateAlert(editingItem.id, data as UpdateStockAgeAlertRequest);
      setEditingItem(null);
    } else {
      createAlert(data as CreateStockAgeAlertRequest, goodsInfo!);
    }
    setPage(1);
    setIsFormOpen(false);
  };

  const handleEdit = (item: StockAgeAlertItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, goodsName: string) => {
    if (confirm(`确定要删除货物 "${goodsName}" 的货龄提醒规则吗？`)) {
      deleteAlert(id);
      setPage(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="搜索货物编码或名称"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增规则
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">货物编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">货物名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">保质期（天）</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">货龄提醒天数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备注</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  暂无数据
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{item.goodsCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.goodsName}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.shelfLifeDays}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.alertDays}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.remark || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.goodsName)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            共 {filteredAlerts.length} 条记录，第 {page} / {totalPages} 页
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      <StockAgeAlertForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        checkGoodsExists={checkGoodsExists}
      />
    </div>
  );
};
