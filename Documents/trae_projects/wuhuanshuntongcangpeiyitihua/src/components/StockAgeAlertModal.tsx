import { AlertTriangle } from 'lucide-react';
import { StockAgeAlertCheckResult } from '../types/stockAgeAlert';

interface StockAgeAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  checkResult: StockAgeAlertCheckResult;
}

export const StockAgeAlertModal = ({ isOpen, onClose, onConfirm, checkResult }: StockAgeAlertModalProps) => {
  if (!isOpen || !checkResult.hasAlert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-amber-50">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-800">货物货龄提醒</h3>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">以下货物已超过设置的货龄提醒天数：</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {checkResult.alerts.map((alert, index) => (
              <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">明细第{alert.rowNumber}行：</span>
                  {alert.goodsName}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  已生产 {alert.ageDays} 天（提醒天数 {alert.alertDays} 天）
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-700 mt-4">是否继续保存当前单据？</p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            继续保存
          </button>
        </div>
      </div>
    </div>
  );
};
