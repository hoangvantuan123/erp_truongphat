import { useState } from 'react';
import { Button } from 'antd';
import {
  SaveOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileAddOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function PdmpsProdPlanAction({
  handleSave,
  newFrom,
  handleDeleteDataSheet,
  handleQuery,
  handlePlanProduction,
  handleConfirm,
  handleCancelConfirm,
  handleSPDMPSProdPlanStock,
  handleSPDMPSProdPlanSemiGoodCrt,
  fetchData,
  buildSearchParams
}) {
  const { t } = useTranslation();

  const onQuery = fetchData || (() => console.warn('handleQuery not provided'));
  const onPlanProduction = handleSPDMPSProdPlanSemiGoodCrt || (() => console.warn('handlePlanProduction not provided'));
  const onConfirm = handleConfirm || (() => console.warn('handleConfirm not provided'));
  const onCancelConfirm = handleCancelConfirm || (() => console.warn('handleCancelConfirm not provided'));
  const onCheckInventory = handleSPDMPSProdPlanStock || (() => console.warn('handleCheckInventory not provided'));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        icon={<FileAddOutlined />}
        size="middle"
        className="uppercase"
        onClick={newFrom}
      >
        {t('850000072')}
      </Button>
      <Button
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSave}
      >
        {t('850000003')}
      </Button>
      <Button
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleDeleteDataSheet}
      >
        {t('850000068')}
      </Button>
      <Button
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={() => fetchData(buildSearchParams())}>
        {t('Truy vấn')}
      </Button>
      <Button
        icon={<ScheduleOutlined />}
        size="middle"
        className="uppercase"
        onClick={onPlanProduction}
      >
        {t('Lập kế hoạch sản xuất thành phẩm')}
      </Button>

      <Button
        icon={<DatabaseOutlined />}
        size="middle"
        className="uppercase"
        onClick={onCheckInventory}
      >
        {t('Check tồn kho')}
      </Button>
    </div>
  );
}
