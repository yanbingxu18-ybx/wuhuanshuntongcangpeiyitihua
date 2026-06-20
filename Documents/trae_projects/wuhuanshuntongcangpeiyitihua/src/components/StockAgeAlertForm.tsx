import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StockAgeAlertItem, CreateStockAgeAlertRequest, UpdateStockAgeAlertRequest } from '../types/stockAgeAlert';
import { getGoodsWithShelfLife } from '../data/stockAgeAlertData';

interface StockAgeAlertFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStockAgeAlertRequest | UpdateStockAgeAlertRequest, goodsInfo?: { code: string; name: string; shelfLifeDays: number }) => void;
  editingItem: StockAgeAlertItem | null;
  checkGoodsExists: (goodsId: string) => boolean;
}

export const StockAgeAlertForm = ({ isOpen, onClose, onSubmit, editingItem, checkGoodsExists }: StockAgeAlertFormProps) => {
  const [goodsId, setGoodsId] = useState('');
  const [alertDays, setAlertDays] = useState('');
  const [remark, setRemark] = useState('');
  const [goodsError, setGoodsError] = useState('');
  const [alertDaysError, setAlertDaysError] = useState('');

  const availableGoods = getGoodsWithShelfLife();

  useEffect(() => {
    if (editingItem) {
      setGoodsId(editingItem.goodsId);
      setAlertDays(editingItem.alertDays.toString());
      setRemark(editingItem.remark);
    } else {
      setGoodsId('');
      setAlertDays('');
      setRemark('');
    }
    setGoodsError('');
    setAlertDaysError('');
  }, [editingItem, isOpen]);

  const selectedGoods = availableGoods.find(g => g.id === goodsId);

  const handleSubmit = () => {
    let hasError = false;

    if (!goodsId) {
      setGoodsError('请选择货物');
      hasError = true;
    } else if (!editingItem && checkGoodsExists(goodsId)) {
      setGoodsError('该货物已配置货龄提醒规则');
      hasError = true;
    }

    if (!alertDays) {
      setAlertDaysError('请输入货龄提醒天数');
      hasError = true;
    } else if (parseInt(alertDays) <= 0) {
      setAlertDaysError('货龄提醒天数必须大于0');
      hasError = true;
    }

    if (hasError) return;

    if (editingItem) {
      const request: UpdateStockAgeAlertRequest = {
        alertDays: parseInt(alertDays),
        remark: remark.trim(),
      };
      onSubmit(request);
    } else {
      const request: CreateStockAgeAlertRequest = {
        goodsId,
        alertDays: parseInt(alertDays),
        remark: remark.trim(),
      };
      onSubmit(request, {
        code: selectedGoods?.code || '',
        name: selectedGoods?.name || '',
        shelfLifeDays: selectedGoods?.shelfLifeDays || 0,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingItem ? '编辑货龄提醒规则' : '新增货龄提醒规则'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!editingItem && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                货物编码 <span className="text-red-500">*</span>
              </label>
              <select
                value={goodsId}
                onChange={(e) => {
                  setGoodsId(e.target.value);
                  setGoodsError('');
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  goodsError ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">请选择货物</option>
                {availableGoods.map(goods => (
                  <option key={goods.id} value={goods.id}>
                    {goods.code} - {goods.name}
                  </option>
                ))}
              </select>
              {goodsError && <p className="mt-1 text-sm text-red-500">{goodsError}</p>}
            </div>
          )}

          {editingItem && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">货物编码</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {editingItem.goodsCode}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">货物名称</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {editingItem.goodsName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">保质期（天）</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {editingItem.shelfLifeDays}
                </div>
              </div>
            </>
          )}

          {!editingItem && selectedGoods && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">货物名称</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {selectedGoods.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">保质期（天）</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {selectedGoods.shelfLifeDays}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              货龄提醒天数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={alertDays}
              onChange={(e) => {
                setAlertDays(e.target.value);
                setAlertDaysError('');
              }}
              placeholder="请输入天数"
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                alertDaysError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {alertDaysError && <p className="mt-1 text-sm text-red-500">{alertDaysError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="选填"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
