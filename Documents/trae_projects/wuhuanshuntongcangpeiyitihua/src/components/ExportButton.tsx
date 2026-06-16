import { useState } from 'react';
import { Download, FileSpreadsheet, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { GoodsItem, ColumnConfig } from '../types';

interface ExportButtonProps {
  goodsList: GoodsItem[];
  columns: ColumnConfig[];
  onImport: (data: Omit<GoodsItem, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export const ExportButton = ({ goodsList, columns, onImport }: ExportButtonProps) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  const visibleColumns = columns.filter(col => col.visible);

  const exportToExcel = () => {
    const headers = visibleColumns.map(col => col.label);
    const data = goodsList.map(item => {
      return visibleColumns.map(col => {
        switch (col.key) {
          case 'name': return item.name;
          case 'code': return item.code;
          case 'spec': return item.spec;
          case 'unit': return item.unit;
          case 'shelfLifeDays': return item.shelfLifeDays;
          default: return '';
        }
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '货物列表');

    worksheet['!cols'] = visibleColumns.map(() => ({ wch: 15 }));

    XLSX.writeFile(workbook, `货物管理_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`);
  };

  const downloadTemplate = () => {
    const headers = ['货物名称', '货物编码', '规格', '单位', '保质期（天）'];
    const data = [
      ['可口可乐', 'COKE001', '500ml/瓶', '件', '365'],
      ['百事可乐', 'PEPSI001', '330ml/罐', '箱', '365'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '货物导入模板');

    worksheet['!cols'] = headers.map(() => ({ wch: 15 }));

    XLSX.writeFile(workbook, '货物导入模板.xlsx');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    const input = document.getElementById('import-file-input') as HTMLInputElement;
    const file = input?.files?.[0];
    
    if (!file) {
      setImportResult({ success: false, message: '请先选择要导入的文件' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['name', 'code', 'spec', 'unit', 'shelfLifeDays'] });
        
        jsonData.shift();
        
        const importData = (jsonData as Record<string, unknown>[]).map(row => ({
          name: String(row.name || ''),
          code: String(row.code || ''),
          spec: String(row.spec || ''),
          unit: String(row.unit || '件'),
          shelfLifeDays: Number(row.shelfLifeDays) || 0,
        }));

        onImport(importData);
        setImportResult({ success: true, message: `成功导入 ${importData.length} 条记录` });
        setUploadedFileName('');
        input.value = '';
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportResult(null);
        }, 1500);
      } catch (error) {
        setImportResult({ success: false, message: '导入失败：文件格式不正确' });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setIsImportModalOpen(true)}
        className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
      >
        <Upload className="w-4 h-4" />
        导入货物
      </button>
      <button
        onClick={exportToExcel}
        className="px-3 py-2 text-white bg-success rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
      >
        <Download className="w-4 h-4" />
        导出Excel
      </button>

      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">导入货物</h2>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setUploadedFileName('');
                  setImportResult(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. 下载导入模板
                </label>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  下载模板（含保质期字段）
                </button>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. 上传导入文件
                </label>
                <input
                  id="import-file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="import-file-input"
                  className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploadedFileName ? `已选择: ${uploadedFileName}` : '点击或拖拽文件到此处上传'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">支持 .xlsx, .xls 格式</p>
                </label>
              </div>
              {importResult && (
                <div className={`p-3 rounded-md text-sm ${
                  importResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {importResult.message}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setUploadedFileName('');
                  setImportResult(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                开始导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
