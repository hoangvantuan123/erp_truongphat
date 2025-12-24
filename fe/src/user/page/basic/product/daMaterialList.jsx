import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../../components/icons'
import { Input, Space, Table, Typography, message, Flex, Splitter } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { filterAndSelectColumns } from '../../../../utils/filterUorA'
import useKeydownHandler from '../../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../../utils/validateColumns'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../../features/codeHelp/getCodeHelpCombo'
import ErrorListModal from '../../default/errorListModal'
import ModalSheetDelete from '../../../components/modal/default/deleteSheet'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import TableDaMaterialList from '../../../components/table/basic/tableDaMaterialList'
import DaMaterialListQuery from '../../../components/query/basic/daMaterialListQuery'
import DaMaterialListAction from '../../../components/actions/basic/daMaterialListAction'
import { PostA } from '../../../../features/basic/daMaterialList/postA'
import { PostU } from '../../../../features/basic/daMaterialList/postU'
import { PostD } from '../../../../features/basic/daMaterialList/postD'
import { GetItemListBaseQuery } from '../../../../features/basic/daMaterialList/get'
import TopLoadingBar from 'react-top-loading-bar'
export default function DaMaterialList({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const { t } = useTranslation()
  const formatDate = (date) => date.format('YYYYMMDD')
  const loadingBarRef = useRef(null)
  const defaultCols = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: 'ItemSeq',
        id: 'ItemSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1786'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('29972'),
        id: 'TrunName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t("7"),
        id: 'AssetName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('55114'),
        id: 'AssetSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3116'),
        id: 'UnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderNumber,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('369'),
        id: 'SMStatusName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('14775'),
        id: 'SMStatus',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'SMInOutKind',
        id: 'SMInOutKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t("5"),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('21800'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('521'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
   
      {
        title: t('4084'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('714'),
        id: 'ModelName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'ModelSeq',
        id: 'ModelSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2090'),
        id: 'STDItemName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Xưởng',
        id: 'ItemSName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'ItemEngName',
        id: 'ItemEngName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'ItemEngSName',
        id: 'ItemEngSName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2115'),
        id: 'ItemClassLName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3262'),
        id: 'ItemClassMName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('592'),
        id: 'ItemClassSName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: 'UMItemClassS',
        id: 'UMItemClassS',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: 'IsInherit',
        id: 'IsInherit',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: 'IsVessel',
        id: 'IsVessel',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: 'SMVatKind',
        id: 'SMVatKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'SMVatType',
        id: 'SMVatType',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2449'),
        id: 'IsVat',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('7426'),
        id: 'IsOption',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('11121'),
        id: 'IsSet',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
        trailingRowOptions: {
          disabled: true,
        },
      },
      /*  {
         title: 'Phân loại thuế GTGT',
         id: 'VatKindName',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Chủng loại thuế GTGT',
         id: 'VatTypeName',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       }, */
      /*     {
            title: 'Tiền đặt cọc',
            id: 'Guaranty',
            kind: 'Number',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderNumber, trailingRowOptions: {
              disabled: true,
            },
          }, */
      /*  {
         title: 'HSCode',
         id: 'HSCode',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: false,
         icon: GridColumnIcon.HeaderString, trailingRowOptions: {
           disabled: true,
         },
       }, */
      /*    {
           title: 'Quản lý Roll',
           id: 'IsRollUnit',
           kind: 'Boolean',
           readonly: false,
           width: 200,
           hasMenu: true,
           visible: true,
           icon: GridColumnIcon.HeaderBoolean, trailingRowOptions: {
             disabled: true,
           },
         }, */
      {
        title: t('3297'),
        id: 'IsSerialMng',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
        trailingRowOptions: {
          disabled: true,
        },
      },
      /*  {
         title: 'Mã Serial No',
         id: 'SeriNoCd',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderString, trailingRowOptions: {
           disabled: true,
         },
       }, */
      {
        title: t('3291'),
        id: 'IsLotMng',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
        trailingRowOptions: {
          disabled: true,
        },
      },
      /*  {
         title: 'Quản lý số lượng đơn vị',
         id: 'IsQtyChange',
         kind: 'Boolean',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderBoolean, trailingRowOptions: {
           disabled: true,
         },
       }, */
      {
        title: 'SafetyStk',
        id: 'SafetyStk',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'SMLimitTermKind',
        id: 'SMLimitTermKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1851'),
        id: 'LimitTerm',
        kind: 'Number',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          disabled: true,
        },
      },
      /*      {
        title: 'Lượng tải quy đổi đơn vị chuẩn',
        id: 'STDLoadConvQty',
        kind: 'Number',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'SMConsgnmtKind',
        id: 'SMConsgnmtKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'BOMUnitSeq',
        id: 'BOMUnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Tỷ lệ hao hụt gia công ngoài',
        id: 'OutLoss',
        kind: 'Number',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Tỷ lệ hao hụt gia công nội',
        id: 'InLoss',
        kind: 'Number',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Mã PT kế toán lượng tiếu thu',
        id: 'SMMrpKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Mã phân loại xuất nhập',
        id: 'SMOutKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Mã phân loại loại hình sản xuất',
        id: 'SMProdMethod',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Mã thông số kỹ thuật sản xuất',
        id: 'SMProdSpec',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'ConsgnmtKind',
        id: 'ConsgnmtKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'BOMUnitName',
        id: 'BOMUnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Phương thức kế toán lượng tiêu thụ',
        id: 'MrpKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Phân loại xuất nhập',
        id: 'OutKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Phân loại hình sản xuất',
        id: 'ProdMethod',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'Thông số kỹ thuật sản xuất',
        id: 'ProdSpec',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'UMPurGroup',
        id: 'UMPurGroup',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'MkCustSeq',
        id: 'MkCustSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'PurCustSeq',
        id: 'PurCustSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
          disabled: true,
        },
      } */
      /*   {
          title: 'Số lượng mua hàng tối thiểu',
          id: 'MinQty',
          kind: 'Number',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: true,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'Số lượng mua hàng theo đơn vị MOQ',
          id: 'StepQty',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: true,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'SMPurKind',
          id: 'SMPurKind',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: false,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'Giá đã có VAT mua hàng',
          id: 'IsPurVat',
          kind: 'Boolean',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: true,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'IsAutoPurCreate',
          id: 'IsAutoPurCreate',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: false,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'Số lượng đặt hàng phù hợp',
          id: 'OrderQty',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: true,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
  
        {
          title: 'Số ngày huy động trung bình',
          id: 'DelvDay',
          kind: 'Number',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: true,
          icon: GridColumnIcon.HeaderNumber, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'CustomTaxRate',
          id: 'CustomTaxRate',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: false,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'PurGroup',
          id: 'PurGroup',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: false,
          icon: GridColumnIcon.HeaderString, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'MkCustName',
          id: 'MkCustName',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: false,
          icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
            disabled: true,
          },
        }, */
      /*  {
         title: 'Bên mua hàng',
         id: 'PurCustName',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Phân loại thời gian giao hàng',
         id: 'PurKind',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Phân loại yêu cầu mua hàng sản xuất',
         id: 'SMPurProdType',
         kind: 'Text',
         readonly: true,
         width: 200,
         hasMenu: true,
         visible: false,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Phân loại mua hàng',
         id: 'PurProdType',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Hình thức mua hàng',
         id: 'SMInOutKindName',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Phân loại hạn sử dụng',
         id: 'SMLimitTermKindName',
         kind: 'Text',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
           disabled: true,
         },
       }, */
      /*   {
          title: 'Tầm quan trọng',
          id: 'SMABCName',
          kind: 'Text',
          readonly: false,
          width: 200,
          hasMenu: true,
          visible: true,
          icon: GridColumnIcon.HeaderArray, trailingRowOptions: {
            disabled: true,
          },
        },
        {
          title: 'Mã SMABC',
          id: 'SMABC',
          kind: 'Text',
          readonly: true,
          width: 200,
          hasMenu: true,
          visible: false,
          icon: GridColumnIcon.HeaderRowID, trailingRowOptions: {
            disabled: true,
          },
        }, */
      /*  {
         title: 'Kiểm tra tiếp nhận',
         id: 'IsInQC',
         kind: 'Boolean',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderBoolean, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Kiểm tra xuất kho',
         id: 'IsOutQC',
         kind: 'Boolean',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderBoolean, trailingRowOptions: {
           disabled: true,
         },
       },
       {
         title: 'Kiểm tra lần cuối',
         id: 'IsLastQC',
         kind: 'Boolean',
         readonly: false,
         width: 200,
         hasMenu: true,
         visible: true,
         icon: GridColumnIcon.HeaderBoolean, trailingRowOptions: {
           disabled: true,
         },
       }, */
      /* {
        title: 'Ghi chú',
        id: 'ItemRemark',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderMarkdown, trailingRowOptions: {
          disabled: true,
        },
      }, */
      ,
    ],
    [t],
  )
  const [loading, setLoading] = useState(false)
  const [menus, setMenus] = useState([])
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [dataCommissionCust, setDataCommissionCust] = useState([])
  const [dataUnit, setDataUnit] = useState([])
  const [dataNaWare, setDataNaWare] = useState([])
  const [dataMngDeptName, setDataMngDeptName] = useState([])
  const [dataUMRegion, setDataUMRegion] = useState([])
  const [dataScopeName, setDataScopeName] = useState([])
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_DA_MATER_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [searchBizUnit, setSearchBizUnit] = useState(0)
  const [searchFactUnit, setSearchFactUnit] = useState(0)
  const [searchNaWare, setSearchNaWare] = useState(0)
  const [searchWHName, setSearchWHName] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [set10012, setSet10012] = useState(null) // Phân loại danh mục hàng
  const [set6004, setSet6004] = useState(null) // Phương thức kế toán lượng tiêu thụ
  const [set6005, setSet6005] = useState(null) // Phân loại xuất nhập
  const [set6006, setSet6006] = useState(null) // Phân loại loại hình sản xuất
  const [set6007, setSet6007] = useState(null) // Thông số kỹ thuật sản xuất
  const [set8047, setSet8047] = useState(null) // Phân loại thời gian giao hàng
  const [set8048, setSet8048] = useState(null) // Phân loại yêu cầu mua hàng sản xuất
  const [set2002, setSet2002] = useState(null) // Tầm quan trọng
  const [set8007, setSet8007] = useState(null) // Hình thức mua hàng
  const [set8004, setSet8004] = useState(null) // Phân loại hạn sử dụng (Thứ 2 và Chủ nhật)
  const [set2001, setSet2001] = useState(null) // Hiện trạng hạn mục sản phẩm
  const [set2003, setSet2003] = useState(null) // Phân loại thuế
  const [set8028, setSet8028] = useState(null) // % 0 10 % chủng loại giá trị gia tăng
  const [set10007, setSet10007] = useState(null) // Dữ liệu cho mã 10007
  const [set10014, setSet10014] = useState(null) // Dữ liệu cho mã 10014
  const [set10010, setSet10010] = useState(null) // Dữ liệu cho mã 10010
  const [set10009, setSet10009] = useState(null) // Dữ liệu cho mã 10009
  const [set17001, setSet17001] = useState(null) // Dữ liệu cho mã 17001

  const [set2004, setSet2004] = useState(null) // Dữ liệu cho mã 2004
  const [set2005, setSet2005] = useState(null) // Dữ liệu cho mã 2005
  const [set2006, setSet2006] = useState(null) // Dữ liệu cho mã 2006

  /* Q */
  const [formData, setFormData] = useState(dayjs().startOf('month'))
  const [toDate, setToDate] = useState(dayjs())
  const [key10012, setKey10012] = useState('')
  const [key10010, setKey10010] = useState('')
  const [keyItemName, setKeyItemName] = useState('')
  const [keyItemNo, setKeyItemNo] = useState('')
  const [keySpec, setKeySpec] = useState('')
  const [keyDeptSeq, setKeyDeptSeq] = useState('')
  const [keyEmpSeq, setKeyEmpSeq] = useState('')

  const [UMItemClassS, setUMItemClassS] = useState('')
  const [UMItemClassL, setUMItemClassL] = useState('')
  const [UMItemClassM, setUMItemClassM] = useState('')

  useEffect(() => {
    cancelAllRequests()
    message.destroy()
  }, [])

  const fieldsToTrack = [
    'IdxNo',
    'ItemSeq',
    'ItemName',
    'ItemNo',
    'Spec',
    'TrunName',
    'AssetName',
    'AssetSeq',
    'UnitName',
    'UnitSeq',
    'SMStatusName',
    'SMStatus',
    'SMInOutKind',
    'DeptName',
    'DeptSeq',
    'EmpName',
    'EmpSeq',
    'ModelName',
    'ModelSeq',
    'STDItemName',
    'ItemSName',
    'ItemEngName',
    'ItemEngSName',
    'ItemClassLName',
    'ItemClassMName',
    'ItemClassSName',
    'UMItemClassS',
    'IsInherit',
    'IsVessel',
    'IsVat',
    'SMVatKind',
    'SMVatType',
    'IsOption',
    'IsSet',
    'VatKindName',
    'VatTypeName',
    'Guaranty',
    'HSCode',
    'IsRollUnit',
    'IsSerialMng',
    'SeriNoCd',
    'IsLotMng',
    'IsQtyChange',
    'SafetyStk',
    'SMLimitTermKind',
    'LimitTerm',
    'STDLoadConvQty',
    'SMConsgnmtKind',
    'BOMUnitSeq',
    'OutLoss',
    'InLoss',
    'SMMrpKind',
    'SMOutKind',
    'SMProdMethod',
    'SMProdSpec',
    'ConsgnmtKind',
    'BOMUnitName',
    'MrpKind',
    'OutKind',
    'ProdMethod',
    'ProdSpec',
    'UMPurGroup',
    'MkCustSeq',
    'PurCustSeq',
    'MinQty',
    'StepQty',
    'SMPurKind',
    'IsPurVat',
    'IsAutoPurCreate',
    'OrderQty',
    'DelvDay',
    'CustomTaxRate',
    'PurGroup',
    'MkCustName',
    'PurCustName',
    'PurKind',
    'SMPurProdType',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  useEffect(() => {
    const emptyData = generateEmptyData(50, defaultCols)
    const updatedEmptyData = updateIndexNo(emptyData)
    setGridData(updatedEmptyData)
    setNumRows(emptyData.length)
  }, [defaultCols])

  const fetchData = useCallback(async () => {
    if (controllers.current && controllers.current.fetchData) {
      controllers.current.fetchData.abort()
      controllers.current.fetchData = null
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchData = controller

    setLoading(true)
    try {
      const data = [
        {
          AssetSeq: key10012,
          UMItemClassL: UMItemClassL,
          UMItemClassM: UMItemClassM,
          UMItemClassS: UMItemClassS,
          DeptSeq: keyDeptSeq,
          EmpSeq: keyEmpSeq,
          ItemName: keyItemName,
          ItemNo: keyItemNo,
          Spec: keySpec,
          FromDate: formData ? formatDate(formData) : '',
          ToDate: toDate ? formatDate(toDate) : '',
        },
      ]

      const response = await GetItemListBaseQuery(data, signal)
      const fetchedData = response.data.data || []

      const emptyData = generateEmptyData(50, defaultCols)
      const combinedData = [...fetchedData, ...emptyData]
      const updatedData = updateIndexNo(combinedData)
      setGridData(updatedData)
      setNumRows(fetchedData.length + emptyData.length)
    } catch (error) {
      setGridData(gridData)
      setNumRows(gridData.length)
    } finally {
      controllers.current.fetchData = null
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    formData,
    toDate,
    gridData,
    key10012,
    keyItemName,
    keyItemNo,
    keySpec,
    keyDeptSeq,
    keyEmpSeq,
    UMItemClassS,
    UMItemClassM,
    UMItemClassL,
  ])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort()
      controllers.current.fetchCodeHelpData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchCodeHelpData = controller

    try {
      const [
        data10012,
        data6004,
        data6005,
        data6006,
        data6007,
        data8047,
        data8048,
        data2002,
        data8007,
        data8004,
        data2001,
        data2003,
        data8028,
        data10007,
        data10014,
        data10010,
        data10009,
        data17001,
        data2004,
        data2005,
        data2006,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6004', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6005', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6006', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6007', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8047', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8048', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '2002', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8007', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8004', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '2001', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '2003', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8028', '', '', '', signal),
        GetCodeHelp(10007, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelp(10014, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelp(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelp(17001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

        GetCodeHelpCombo('', 6, 10014, 1, '%', '2004', '', '', '', signal),
        GetCodeHelpCombo('', 6, 18098, 1, '%', '2005', '', '', '', signal),
        GetCodeHelpCombo('', 6, 18097, 1, '%', '2006', '', '', '', signal),
      ])

      setSet10012(data10012.data || [])
      setSet6004(data6004.data || [])
      setSet6005(data6005.data || [])
      setSet6006(data6006.data || [])
      setSet6007(data6007.data || [])
      setSet8047(data8047.data || [])
      setSet8048(data8048.data || [])
      setSet2002(data2002.data || [])
      setSet8007(data8007.data || [])
      setSet8004(data8004.data || [])
      setSet2001(data2001.data || [])
      setSet2003(data2003.data || [])
      setSet8028(data8028.data || [])

      setSet10007(data10007.data || [])
      setSet10014(data10014.data || [])
      setSet10010(data10010.data || [])
      setSet10009(data10009.data || [])
      setSet17001(data17001.data || [])

      setSet2004(data2004.data || [])
      setSet2005(data2005.data || [])
      setSet2006(data2006.data || [])
    } catch (error) {
      setSet10012([])
      setSet6004([])
      setSet6005([])
      setSet6006([])
      setSet6007([])
      setSet8047([])
      setSet8048([])
      setSet2002([])
      setSet8007([])
      setSet8004([])
      setSet2001([])
      setSet2003([])
      setSet8028([])
      setSet10007([])
      setSet10014([])
      setSet10010([])
      setSet10009([])
      setSet17001([])
      set2004([])
      set2005([])
      set2006([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpData = null
    }
  }, [])

  const debouncedFetchCodeHelpData = useMemo(
    () => debounce(fetchCodeHelpData, 200),
    [fetchCodeHelpData],
  )
  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }

  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning(t('870000015'))
        return
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /* HOOKS KEY */
  useKeydownHandler(isCellSelected, setOpenHelp)

  const onCellClicked = (cell, event) => {
    if (cell.length >= 2 && cell[0] === 1) {
      setIsCellSelected(true)
    } else {
      setIsCellSelected(false)
      setIsMinusClicked(false)
      setLastClickedCell(null)
      setClickedRowData(null)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      setIsCellSelected(false)
      setIsMinusClicked(false)
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    let rowIndex

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClicked(false)
    }

    if (rowIndex >= 0 && rowIndex < menus.length) {
      const rowData = menus[rowIndex]
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning(t('870000015'))
      return
    }
    const requiredColumns = [
      'ItemName',
      'ItemNo',
      'AssetName',
      'UnitName',
      'SMStatusName',
      'ItemClassSName',
    ]
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const columnsU = [
      'IdxNo',
      'ItemSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'TrunName',
      'AssetName',
      'AssetSeq',
      'UnitName',
      'UnitSeq',
      'SMStatusName',
      'SMStatus',
      'SMInOutKind',
      'DeptName',
      'DeptSeq',
      'EmpName',
      'EmpSeq',
      'ModelName',
      'ModelSeq',
      'STDItemName',
      'ItemSName',
      'ItemEngName',
      'ItemEngSName',
      'ItemClassLName',
      'ItemClassMName',
      'ItemClassSName',
      'UMItemClassS',
      'IsInherit',
      'IsVessel',
      'IsVat',
      'SMVatKind',
      'SMVatType',
      'IsOption',
      'IsSet',
      'VatKindName',
      'VatTypeName',
      'Guaranty',
      'HSCode',
      'IsRollUnit',
      'IsSerialMng',
      'SeriNoCd',
      'IsLotMng',
      'IsQtyChange',
      'SafetyStk',
      'SMLimitTermKind',
      'LimitTerm',
      'STDLoadConvQty',
      'SMConsgnmtKind',
      'BOMUnitSeq',
      'OutLoss',
      'InLoss',
      'SMMrpKind',
      'SMOutKind',
      'SMProdMethod',
      'SMProdSpec',
      'ConsgnmtKind',
      'BOMUnitName',
      'MrpKind',
      'OutKind',
      'ProdMethod',
      'ProdSpec',
      'UMPurGroup',
      'MkCustSeq',
      'PurCustSeq',
      'MinQty',
      'StepQty',
      'SMPurKind',
      'IsPurVat',
      'IsAutoPurCreate',
      'OrderQty',
      'DelvDay',
      'CustomTaxRate',
      'PurGroup',
      'MkCustName',
      'PurCustName',
      'PurKind',
      'SMPurProdType',
      'IDX_NO',
    ]

    const columnsA = [
      'IdxNo',
      'ItemSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'TrunName',
      'AssetName',
      'AssetSeq',
      'UnitName',
      'UnitSeq',
      'SMStatusName',
      'SMStatus',
      'SMInOutKind',
      'DeptName',
      'DeptSeq',
      'EmpName',
      'EmpSeq',
      'ModelName',
      'ModelSeq',
      'STDItemName',
      'ItemSName',
      'ItemEngName',
      'ItemEngSName',
      'ItemClassLName',
      'ItemClassMName',
      'ItemClassSName',
      'UMItemClassS',
      'IsInherit',
      'IsVessel',
      'IsVat',
      'SMVatKind',
      'SMVatType',
      'IsOption',
      'IsSet',
      'VatKindName',
      'VatTypeName',
      'Guaranty',
      'HSCode',
      'IsRollUnit',
      'IsSerialMng',
      'SeriNoCd',
      'IsLotMng',
      'IsQtyChange',
      'SafetyStk',
      'SMLimitTermKind',
      'LimitTerm',
      'STDLoadConvQty',
      'SMConsgnmtKind',
      'BOMUnitSeq',
      'OutLoss',
      'InLoss',
      'SMMrpKind',
      'SMOutKind',
      'SMProdMethod',
      'SMProdSpec',
      'ConsgnmtKind',
      'BOMUnitName',
      'MrpKind',
      'OutKind',
      'ProdMethod',
      'ProdSpec',
      'UMPurGroup',
      'MkCustSeq',
      'PurCustSeq',
      'MinQty',
      'StepQty',
      'SMPurKind',
      'IsPurVat',
      'IsAutoPurCreate',
      'OrderQty',
      'DelvDay',
      'CustomTaxRate',
      'PurGroup',
      'MkCustName',
      'PurCustName',
      'PurKind',
      'SMPurProdType',
      'IDX_NO',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const missingIds = findMissingIds(lastEntry)
    if (missingIds.length > 0) {
      message.warning(
        t('850000046')
      )
      return
    }

    const resulU = filterAndSelectColumns(gridData, columnsU, 'U')
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A')

    const validationMessage = validateCheckColumns(
      [...resulU, ...resulA],
      [...columnsU, ...columnsA],
      requiredColumns,
    )

    if (validationMessage !== true) {
      message.warning(validationMessage)
      return
    }

    if (isSent) return

    setIsSent(true)

    if (resulA.length > 0 || resulU.length > 0) {
      const loadingMessage = message.loading(t('870000029'))

      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(PostA(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostU(resulU))
        }

        const results = await Promise.all(promises)
        const updateGridData = (newData) => {
          setGridData((prevGridData) => {
            const updatedGridData = prevGridData.map((item) => {
              const matchingData = newData.find(
                (data) => data.IDX_NO === item.IdxNo,
              )

              if (matchingData) {
                return {
                  ...matchingData,
                  IdxNo: matchingData.IDX_NO,
                }
              }
              return item
            })

            return updatedGridData
          })
        }
        results.forEach((result, index) => {
          if (result.data.success) {
            const newData = result.data.data
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }

            loadingMessage()
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            updateGridData(newData)
            resetTable()
          } else {
            loadingMessage()
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setIsModalVisible(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            message.error(t('870000010'))
          }
        })
      } catch (error) {
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error(error.message || t('870000010'))
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.warning(t('870000003'))
    }
  }, [editedRows])

  const handleDeleteDataSheet = useCallback(
    (e) => {
      if (canDelete === false) {
        message.warning(t('870000002'))
        return
      }

      if (isDeleting) {
        message.warning(t('870000019'))
        return
      }

      const selectedRows = getSelectedRows()

      const idsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
        message.warning(t('870000011'))
        setModalOpen(false)
        return
      }
      if (idsWithStatusD.length > 0) {
        setIsDeleting(true)
        PostD(idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const remainingRows = gridData.filter(
                (row) =>
                  !idsWithStatusD.some(
                    (deletedRow) =>
                      deletedRow?.IDX_NO ||
                      deletedRow.IdxNo === row.IdxNo ||
                      row.IDX_NO,
                  ),
              )
              const updatedData = updateIndexNo(remainingRows)
              setGridData(updatedData)
              setNumRows(updatedData.length)
              resetTable()
              setModalOpen(false)
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)

              message.error(response.data.message || t('870000012'))
            }
          })
          .catch((error) => {
            message.destroy()
            message.error(t('870000013'))
          })
          .finally(() => {
            setIsDeleting(false)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        const remainingEditedRows = editedRows.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id),
        )
        setModalOpen(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        const updatedDataEditedRows = updateIndexNo(remainingEditedRows)
        const updatedRemainingRows = updateIndexNo(remainingRows)
        setEditedRows(updatedDataEditedRows)
        setGridData(updatedRemainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [canDelete, gridData, selection, editedRows, isDeleting],
  )

  const handleRestSheet = useCallback(async () => {
    const hasWHseq = gridData.some((item) => item.hasOwnProperty('WHseq'))
    if (hasWHseq) {
      fetchData()
    } else {
      const allStatusA = gridData.every((item) => item.Status === 'A')

      if (allStatusA) {
        const emptyData = generateEmptyData(50, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
      } else {
        fetchData()
      }
    }
  }, [defaultCols, gridData])

  return (
    <>
      <Helmet>
        <title>ITM - {t('850000067')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('850000067')}
              </Title>
              <DaMaterialListAction
                setModalOpen={setModalOpen}
                handleRestSheet={handleRestSheet}
                fetchDataQuery={fetchData}
                openModal={openModal}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleSaveData={handleSaveData}
                setNumRowsToAdd={setNumRowsToAdd}
                numRowsToAdd={numRowsToAdd}
                setClickCount={setClickCount}
                clickCount={clickCount}
                handleRowAppend={handleRowAppend}
                set10010={set10010}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                 {t('850000014')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <DaMaterialListQuery
                  formData={formData}
                  setFormData={setFormData}
                  setToDate={setToDate}
                  toDate={toDate}
                  set10012={set10012}
                  key10012={key10012}
                  setKey10012={setKey10012}
                  setKey10010={setKey10010}
                  key10010={key10010}
                  set10010={set10010}
                  setKeyDeptSeq={setKeyDeptSeq}
                  setKeyItemNo={setKeyItemNo}
                  keyItemNo={keyItemNo}
                  setKeyItemName={setKeyItemName}
                  keyItemName={keyItemName}
                  setKeySpec={setKeySpec}
                  keySpec={keySpec}
                  set10009={set10009}
                  setKeyEmpSeq={setKeyEmpSeq}
                  set2004={set2004}
                  set2005={set2005}
                  set2006={set2006}
                  setUMItemClassS={setUMItemClassS}
                  setUMItemClassM={setUMItemClassM}
                  setUMItemClassL={setUMItemClassL}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableDaMaterialList
              handleRestSheet={handleRestSheet}
              onCellClicked={onCellClicked}
              setSelection={setSelection}
              selection={selection}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              setAddedRows={setAddedRows}
              addedRows={addedRows}
              setEditedRows={setEditedRows}
              editedRows={editedRows}
              setNumRowsToAdd={setNumRowsToAdd}
              clickCount={clickCount}
              numRowsToAdd={numRowsToAdd}
              numRows={numRows}
              onSelectRow={onSelectRow}
              openHelp={openHelp}
              setOpenHelp={setOpenHelp}
              setOnSelectRow={setOnSelectRow}
              setIsCellSelected={setIsCellSelected}
              isCellSelected={isCellSelected}
              setGridData={setGridData}
              gridData={gridData}
              setNumRows={setNumRows}
              setCols={setCols}
              handleRowAppend={handleRowAppend}
              cols={cols}
              defaultCols={defaultCols}
              dataUnit={dataUnit}
              dataNaWare={dataNaWare}
              dataMngDeptName={dataMngDeptName}
              canCreate={canCreate}
              canEdit={canEdit}
              dataCommissionCust={dataCommissionCust}
              dataUMRegion={dataUMRegion}
              dataScopeName={dataScopeName}
              set10012={set10012}
              set6004={set6004}
              set10007={set10007}
              set2001={set2001}
              set10010={set10010}
              set10014={set10014}
              set6005={set6005}
              set6006={set6006}
              set6007={set6007}
              set8047={set8047}
              set8048={set8048}
              set2002={set2002}
              set8007={set8007}
              set8004={set8004}
              set2003={set2003}
              set8028={set8028}
              set10009={set10009}
              set17001={set17001}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      />
      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={handleDeleteDataSheet}
      />
    </>
  )
}
