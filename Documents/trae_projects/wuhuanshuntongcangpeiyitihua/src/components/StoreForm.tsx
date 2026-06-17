import { useState, useEffect } from 'react';
import { X, MapPin, Search, Crosshair } from 'lucide-react';
import { StoreItem, CreateStoreRequest, UpdateStoreRequest, STORE_TYPES, StoreType } from '../types/store';

interface StoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoreRequest | UpdateStoreRequest) => void;
  editData?: StoreItem | null;
  checkCodeExists: (code: string, excludeId?: string) => boolean;
}

const mockAddresses = [
  { address: '北京市朝阳区建国路88号', latitude: 39.9042, longitude: 116.4074 },
  { address: '上海市浦东新区陆家嘴环路1000号', latitude: 31.2304, longitude: 121.4737 },
  { address: '广州市天河区珠江新城冼村路', latitude: 23.1291, longitude: 113.2644 },
  { address: '深圳市南山区科技园南区', latitude: 22.5431, longitude: 114.0579 },
  { address: '成都市锦江区春熙路步行街', latitude: 30.5728, longitude: 104.0668 },
];

export const StoreForm = ({ isOpen, onClose, onSubmit, editData, checkCodeExists }: StoreFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '常温' as StoreType,
    location: '',
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMap, setShowMap] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockAddresses>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        code: editData.code,
        name: editData.name,
        type: editData.type,
        location: editData.location,
        latitude: editData.latitude,
        longitude: editData.longitude,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        type: '常温',
        location: '',
        latitude: 39.9042,
        longitude: 116.4074,
      });
    }
  }, [editData, isOpen]);

  useEffect(() => {
    setErrors({});
  }, [isOpen]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      const results = mockAddresses.filter(item =>
        item.address.includes(keyword)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectAddress = (address: typeof mockAddresses[0]) => {
    setFormData(prev => ({
      ...prev,
      location: address.address,
      latitude: address.latitude,
      longitude: address.longitude,
    }));
    setSearchResults([]);
    setSearchKeyword('');
  };

  const handleMapClick = () => {
    const randomLat = 30 + Math.random() * 10;
    const randomLng = 110 + Math.random() * 15;
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(randomLat.toFixed(4)),
      longitude: parseFloat(randomLng.toFixed(4)),
      location: `选中位置 (${randomLat.toFixed(4)}, ${randomLng.toFixed(4)})`,
    }));
    setShowMap(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code.trim()) {
      newErrors.code = '请输入仓库编码';
    } else if (checkCodeExists(formData.code, editData?.id)) {
      newErrors.code = '仓库编码已存在';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入仓库名称';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '请输入定位信息';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        code: formData.code,
        name: formData.name,
        type: formData.type,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {editData ? '编辑仓库' : '新增仓库'}
          </h2>
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
              仓库编码 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入仓库编码"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              仓库名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入仓库名称"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              仓库类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as StoreType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {STORE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              定位信息 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchKeyword || formData.location}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="搜索地址或点击地图选择"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-sm max-h-32 overflow-auto">
                {searchResults.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAddress(item)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-gray-700">{item.address}</span>
                  </button>
                ))}
              </div>
            )}
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
              >
                <Crosshair className="w-4 h-4" />
                {showMap ? '收起地图' : '打开地图选择'}
              </button>
            </div>

            {showMap && (
              <div className="mt-3 border border-gray-200 rounded-md overflow-hidden">
                <div className="h-48 bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Crosshair className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">点击下方按钮随机选择位置</p>
                      <button
                        onClick={handleMapClick}
                        className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        随机选择位置
                      </button>
                    </div>
                  </div>
                  {formData.latitude !== 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white bg-opacity-80 rounded text-xs text-gray-600">
                      当前位置: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              经纬度
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.latitude.toFixed(6)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.longitude.toFixed(6)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">经纬度信息由系统自动生成</p>
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
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            {editData ? '保存修改' : '确认新增'}
          </button>
        </div>
      </div>
    </div>
  );
};