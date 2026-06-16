import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { CreateGoodsRequest, UpdateGoodsRequest, GoodsItem } from '../types';

interface GoodsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoodsRequest | UpdateGoodsRequest) => void;
  editData?: GoodsItem | null;
}

export const GoodsForm = ({ isOpen, onClose, onSubmit, editData }: GoodsFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    spec: '',
    unit: '件',
    shelfLifeDays: 0,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        code: editData.code,
        spec: editData.spec,
        unit: editData.unit,
        shelfLifeDays: editData.shelfLifeDays,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        spec: '',
        unit: '件',
        shelfLifeDays: 0,
      });
    }
  }, [editData, isOpen]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      alert('请填写货物名称和编码');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const units = ['件', '箱', '瓶', '罐', '盒', '袋', '包', '吨', '公斤', '克'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {editData ? '编辑货物' : '新增货物'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">货物名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入货物名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">货物编码 *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入货物编码"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">规格</label>
              <input
                type="text"
                value={formData.spec}
                onChange={(e) => handleChange('spec', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入规格"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">保质期（天）</label>
            <input
              type="number"
              min="0"
              max="9999"
              value={formData.shelfLifeDays}
              onChange={(e) => handleChange('shelfLifeDays', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入保质期天数"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}