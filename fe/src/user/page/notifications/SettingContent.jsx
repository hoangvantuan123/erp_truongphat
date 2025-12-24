import { Switch } from 'antd';

const SettingContent = () => (
  <div className="max-w-4xl p-6">
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tùy chỉnh thông báo</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Thông báo email</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Thông báo push</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Thông báo quan trọng</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingContent;