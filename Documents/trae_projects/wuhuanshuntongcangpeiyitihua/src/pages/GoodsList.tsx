import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, LayoutGrid } from 'lucide-react';
import { GoodsItem, ColumnConfig, CreateGoodsRequest, UpdateGoodsRequest } from '../types';
import { useGoods } from '../hooks/useGoods';
import { GoodsForm } from '../components/GoodsForm';
import { ColumnSettings } from '../components/ColumnSettings';
import { ExportButton } from '../components/ExportButton';

export const GoodsList = () => {
  const { loading, createGoods, updateGoods, deleteGoods, searchGoods } = useGoods();
  const [keyword, setKeyword] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GoodsItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'name', label: '货物名称', visible: true },
    { key: 'code', label: '货物编码', visible: true },
    { key: 'spec', label: '规格', visible: true },
    { key: 'unit', label: '单位', visible: true },
    { key: 'shelfLifeDays', label: '保质期（天）', visible: true },
  ]);

  const filteredGoods = useMemo(() => {
    return searchGoods(keyword);
  }, [keyword, searchGoods]);

  const totalPages = Math.ceil(filteredGoods.length / pageSize);
  const paginatedGoods = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredGoods.slice(start, start + pageSize);
  }, [filteredGoods, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const handleSubmit = (data: CreateGoodsRequest | UpdateGoodsRequest) => {
    if (editingItem) {
      updateGoods(editingItem.id, data as UpdateGoodsRequest);
      setEditingItem(null);
    } else {
      createGoods(data as CreateGoodsRequest);
    }
  };

  const handleEdit = (item: GoodsItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该货物吗？')) {
      deleteGoods(id);
    }
  };

  const handleView = (item: GoodsItem) => {
    const info = `货物信息：\n名称：${item.name}\n编码：${item.code}\n规格：${item.spec}\n单位：${item.unit}\n保质期：${item.shelfLifeDays}天`;
    alert(info);
  };

  const handleImport = (data: Omit<GoodsItem, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    data.forEach(item => {
      if (item.name && item.code) {
        createGoods(item as CreateGoodsRequest);
      }
    });
    setPage(1);
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索货物名称、编码、规格..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton goodsList={filteredGoods} columns={columns} onImport={handleImport} />
          <button
            onClick={() => setIsColumnSettingsOpen(true)}
            className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            列设置
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增货物
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                序号
              </th>
              {columns.filter(col => col.visible).map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedGoods.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {(page - 1) * pageSize + index + 1}
                </td>
                {columns.filter(col => col.visible).map(col => (
                  <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {col.key === 'shelfLifeDays' ? (
                      <span className="text-primary-600 font-medium">{item.shelfLifeDays}</span>
                    ) : col.key === 'productionDate' || col.key === 'validUntil' ? (
                      item[col.key as keyof GoodsItem] || '-'
                    ) : (
                      item[col.key as keyof GoodsItem]
                    )}
                  </td>
                ))}
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
                      onClick={() => handleDelete(item.id)}
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

      {paginatedGoods.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {keyword ? '未找到匹配的货物' : '暂无货物数据'}
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            共 {filteredGoods.length} 条记录，显示第 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredGoods.length)} 条
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-sm rounded-md ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'border hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
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

      <GoodsForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        editData={editingItem}
      />

      <ColumnSettings
        isOpen={isColumnSettingsOpen}
        onClose={() => setIsColumnSettingsOpen(false)}
        columns={columns}
        onUpdateColumns={setColumns}
      />
    </div>
  );
};
