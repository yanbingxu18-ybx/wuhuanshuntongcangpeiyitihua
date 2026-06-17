import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, RefreshCw } from 'lucide-react';
import { StoreItem, CreateStoreRequest, UpdateStoreRequest, StoreType, STORE_TYPES } from '../types/store';
import { useStore } from '../hooks/useStore';
import { StoreForm } from '../components/StoreForm';

export const StoreList = () => {
  const { loading, createStore, updateStore, deleteStore, searchStores, checkCodeExists } = useStore();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<StoreType | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const filteredStores = useMemo(() => {
    return searchStores(code, name, type);
  }, [code, name, type, searchStores]);

  const totalPages = Math.ceil(filteredStores.length / pageSize);
  const paginatedStores = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStores.slice(start, start + pageSize);
  }, [filteredStores, page, pageSize]);

  const handleReset = () => {
    setCode('');
    setName('');
    setType('');
    setPage(1);
  };

  const handleSubmit = (data: CreateStoreRequest | UpdateStoreRequest) => {
    if (editingItem) {
      updateStore(editingItem.id, data as UpdateStoreRequest);
      setEditingItem(null);
    } else {
      createStore(data as CreateStoreRequest);
    }
    setPage(1);
  };

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除仓库 "${name}" 吗？`)) {
      deleteStore(id);
      if (paginatedStores.length === 1 && page > 1) {
        setPage(p => p - 1);
      }
    }
  };

  const handleView = (item: StoreItem) => {
    const info = `仓库信息：\n编码：${item.code}\n名称：${item.name}\n类型：${item.type}\n位置：${item.location}\n纬度：${item.latitude}\n经度：${item.longitude}\n创建时间：${item.createdAt}\n更新时间：${item.updatedAt}`;
    alert(info);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="仓库编码"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-56"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="仓库名称"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-56"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as StoreType | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-36"
            >
              <option value="">全部类型</option>
              {STORE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              查询
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新增仓库
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                序号
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                仓库编码
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                仓库名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                仓库类型
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                定位信息
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedStores.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {item.code}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.type === '冷冻' ? 'bg-blue-100 text-blue-800' :
                    item.type === '冷藏' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={item.location}>
                  {item.location}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="查看"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedStores.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          未找到匹配的仓库
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            共 {filteredStores.length} 条记录，显示第 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredStores.length)} 条
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageNum === page
                      ? 'bg-primary-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      <StoreForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        editData={editingItem}
        checkCodeExists={checkCodeExists}
      />
    </div>
  );
};