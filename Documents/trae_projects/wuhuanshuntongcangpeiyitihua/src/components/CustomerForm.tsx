import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { CustomerItem, CreateCustomerRequest, UpdateCustomerRequest, CustomerType, CUSTOMER_TYPES } from '../types/customer';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => void;
  editData?: CustomerItem | null;
  mode?: 'add' | 'edit' | 'view';
  checkCodeExists: (code: string, excludeId?: string) => boolean;
}

export const CustomerForm = ({ isOpen, onClose, onSubmit, editData, mode = 'add', checkCodeExists }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '仓储型' as CustomerType,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isViewMode = mode === 'view';

  useEffect(() => {
    if (editData) {
      setFormData({
        code: editData.code,
        name: editData.name,
        type: editData.type,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        type: '仓储型',
      });
    }
    setErrors({});
  }, [editData, isOpen, mode]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isViewMode && mode === 'add') {
      if (!formData.code.trim()) {
        newErrors.code = '请输入客户编码';
      } else if (formData.code.length > 50) {
        newErrors.code = '客户编码长度不能超过50字符';
      } else if (checkCodeExists(formData.code)) {
        newErrors.code = '客户编码已存在，请重新输入';
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = '请输入客户名称';
    } else if (formData.name.length > 100) {
      newErrors.name = '客户名称长度不能超过100字符';
    }

    if (!formData.type) {
      newErrors.type = '请选择客户类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isViewMode) return;
    if (!validate()) return;

    if (mode === 'edit') {
      const request: UpdateCustomerRequest = {
        name: formData.name,
        type: formData.type,
      };
      onSubmit(request);
    } else {
      const request: CreateCustomerRequest = {
        code: formData.code,
        name: formData.name,
        type: formData.type,
      };
      onSubmit(request);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'add': return '新增客户';
      case 'edit': return '编辑客户';
      case 'view': return '查看客户';
      default: return '客户信息';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              客户编码 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              readOnly={isViewMode || mode === 'edit'}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode || mode === 'edit' ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
              placeholder="请输入客户编码"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              客户名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              readOnly={isViewMode}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
              placeholder="请输入客户名称"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              客户类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
            >
              {CUSTOMER_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          {isViewMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                {editData?.createdAt || '-'}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {isViewMode ? '关闭' : '取消'}
          </button>
          {!isViewMode && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
