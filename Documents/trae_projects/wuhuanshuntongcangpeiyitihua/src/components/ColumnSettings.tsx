import { X, Check } from 'lucide-react';
import { ColumnConfig } from '../types';

interface ColumnSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onUpdateColumns: (columns: ColumnConfig[]) => void;
}

export const ColumnSettings = ({ isOpen, onClose, columns, onUpdateColumns }: ColumnSettingsProps) => {
  if (!isOpen) return null;

  const toggleColumn = (key: string) => {
    const updated = columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onUpdateColumns(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">显示/隐藏列</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {columns.map(col => (
            <label
              key={col.key}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <span className="text-gray-700">{col.label}</span>
              <button
                onClick={() => toggleColumn(col.key)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  col.visible
                    ? 'bg-primary-600 border-primary-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {col.visible && <Check className="w-4 h-4 text-white" />}
              </button>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
