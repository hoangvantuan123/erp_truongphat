import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Col,
  Form,
  Select,
  Input,
  Row,
  Checkbox,
  DatePicker,
  InputNumber,
} from 'antd'
const { RangePicker } = DatePicker

import { useTranslation } from 'react-i18next'
import { LockKeyhole } from 'lucide-react'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpEduClass from '../codeHelp/codeHelpEduClass'
import CodeHelpEduType from '../codeHelp/codeHelpEduType'
import CodeHelpPeople from '../codeHelp/codeHelpPeople'
import CodeHelpEduCourse from '../codeHelp/codeHelpEduCourse'
import CodeHelpCombo from '../codeHelp/codeHelpCombo'
import CodeHelpEduLecturer from '../codeHelp/codeHelpEduLecturer'

function Edu0Table({
  ClassData,
  setClassData,
  UMEduGrpTypeData,
  EduTypeData,
  setEduTypeData,
  SMInOutTypeNameData,
  SatisLevelData,
  UMlocationData,
  CourseData,
  setCourseData,
  UMInstituteData,
  setUMInstituteData,
  LecturerData,
  setLecturerData,

  EduClassName,
  setEduClassName,
  setEduClass,

  setEduGrpType,

  eduTypeName,
  setEduTypeName,
  setEduTypeSeq,

  dataSearch,
  dataRootInfo,
  form,

  CfmEmpData,
  setSelectEmp,
  cfmEmpName,
  setCfmEmpName,
  cfmEmpSeq,
  setCfmEmpSeq,
  CfmUserId,
  setCfmUserId,

  UMInstituteName,
  setUMInstituteName,
  setUMInstitute,

  LecturerName,
  setLecturerName,
  setLecturerSeq,

  EduCourseName,
  setEduCourseName,
  setEduCourseSeq,

  setSMInOutType,

  setSatisLevel,
  setUMlocation,
  setEduClassSeq,
}) {
  const [dropdownVisiblepCfmEmp, setDropdownVisiblepCfmEmp] = useState(false)
  const [dropdownVisibleClass, setDropdownVisibleClass] = useState(false)
  const [dropdownVisibleEduType, setDropdownVisibleEduType] = useState(false)
  const [dropdownVisibleEduCourse, setDropdownVisibleEduCourse] =
    useState(false)
  const [dropdownVisibleUMInstitute, setDropdownVisibleUMInstitute] =
    useState(false)
  const [dropdownVisibleLecturerName, setDropdownVisibleLecturerName] =
    useState(false)
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const { t } = useTranslation()
  const dropdownRef = useRef(null)
  const getValidDate = (value) => {
    const date = dayjs(value)
    return date.isValid() ? date : null
  }
  // console.log('LecturerName', LecturerName)
  // useEffect(() => {
  //   form.setFieldsValue({
  //     // CfmEmpName: cfmEmpName,
  //     // EduClassName: EduClassName,
  //     // EduCourseName: EduCourseName,
  //     // UMInstituteName: UMInstituteName,
  //     // LecturerName: LecturerName,
  //     // EduTypeName: eduTypeName,
  //   })
  // }, [
  //   cfmEmpName,
  //   EduClassName,
  //   EduCourseName,
  //   UMInstituteName,
  //   LecturerName,
  //   EduClassName,
  //   eduTypeName
  // ])

  const renderField = (name, label, icon, onChange) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('(Không có dữ liệu)')}
          variant="filled"
          className=" font-medium"
          onChange={onChange}
        />
      </Form.Item>
    </Col>
  )
  const renderDropdownFieldCfmEmpName = (name, label, icon, cfmEmpName) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className="font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          onFocus={() => setDropdownVisiblepCfmEmp(true)}
        />
        {dropdownVisiblepCfmEmp && (
          <CodeHelpPeople
            data={CfmEmpData}
            nameCodeHelp={t('1648')}
            modalVisiblePeople={dropdownVisiblepCfmEmp}
            setModalVisiblePeople={setDropdownVisiblepCfmEmp}
            peopleSearchSh={peopleSearchSh}
            setPeopleSearchSh={setPeopleSearchSh}
            selectionPeople={selectionPeople}
            setSelectionPeople={setSelectionPeople}
            empName={cfmEmpName}
            setEmpName={setCfmEmpName}
            userId={CfmUserId}
            setUserId={setCfmUserId}
            setEmpSeq={setCfmEmpSeq}
            empSeq={cfmEmpSeq}
            setSelectEmp={setSelectEmp}
          />
        )}
      </Form.Item>
    </Col>
  )

  const renderDropdownFieldClassName = (name, label, icon, EduClassName) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className=" font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          onFocus={() => setDropdownVisibleClass(true)}
        />
        {dropdownVisibleClass && (
          <CodeHelpEduClass
            helpData={ClassData}
            setHelpData={setClassData}
            minorName={EduClassName}
            setMinorName={setEduClassName}
            setValue={setEduClass}
            setDropdownVisible={setDropdownVisibleClass}
            dropdownVisible={dropdownVisibleClass}
            nameCodeHelp={'1087'}
          />
        )}
      </Form.Item>
    </Col>
  )

  const renderDropdownFieldTypeName = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className=" font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          value={eduTypeName}
          onFocus={() => setDropdownVisibleEduType(true)}
        />
        {dropdownVisibleEduType && (
          <CodeHelpEduType
            helpData={EduTypeData}
            setHelpData={setEduTypeData}
            minorName={eduTypeName}
            setMinorName={setEduTypeName}
            setValue={setEduTypeSeq}
            setDropdownVisible={setDropdownVisibleEduType}
            dropdownVisible={dropdownVisibleEduType}
            nameCodeHelp={'1090'}
          />
        )}
      </Form.Item>
    </Col>
  )

  const renderDropdownFieldCourseName = (name, label, icon, EduCourseName) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className=" font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          value={eduTypeName}
          onFocus={() => setDropdownVisibleEduCourse(true)}
        />
        {dropdownVisibleEduCourse && (
          <CodeHelpEduCourse
            helpData={CourseData}
            setHelpData={setCourseData}
            minorName={EduCourseName}
            setMinorName={setEduCourseName}
            setValue={setEduCourseSeq}
            setDropdownVisible={setDropdownVisibleEduCourse}
            dropdownVisible={dropdownVisibleEduCourse}
            nameCodeHelp={'1111'}
          />
        )}
      </Form.Item>
    </Col>
  )

  const renderDropdownFieldUMInstituteName = (
    name,
    label,
    icon,
    UMInstituteName,
  ) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className=" font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          value={eduTypeName}
          onFocus={() => setDropdownVisibleUMInstitute(true)}
        />
        {dropdownVisibleUMInstitute && (
          <CodeHelpCombo
            helpData={UMInstituteData}
            setHelpData={setUMInstituteData}
            minorName={UMInstituteName}
            setMinorName={setUMInstituteName}
            setValue={setUMInstitute}
            setDropdownVisible={setDropdownVisibleUMInstitute}
            dropdownVisible={dropdownVisibleUMInstitute}
            nameCodeHelp={'10476'}
          />
        )}
      </Form.Item>
    </Col>
  )

  console.log(LecturerName, 'LecturerName')

  const renderDropdownFieldLecturerName = (name, label, icon, LecturerName) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className=" font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          // value={LecturerName}
          onFocus={() => setDropdownVisibleLecturerName(true)}
        />
        {dropdownVisibleLecturerName && (
          <CodeHelpEduLecturer
            helpData={LecturerData}
            setHelpData={setLecturerData}
            minorName={LecturerName}
            setMinorName={setLecturerName}
            setValue={setLecturerSeq}
            setDropdownVisible={setDropdownVisibleLecturerName}
            dropdownVisible={dropdownVisibleLecturerName}
            nameCodeHelp={'22122'}
          />
        )}
      </Form.Item>
    </Col>
  )

  const renderFieldReadOnly = (name, label, value, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          value={value || ''}
          placeholder={t('(Không có dữ liệu)')}
          readOnly
          className=" font-medium"
          variant="underlined"
        />
        <LockKeyhole
          size={13}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </Form.Item>
    </Col>
  )

  const renderFieldCheckbox = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        valuePropName="checked"
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Checkbox />
      </Form.Item>
    </Col>
  )

  const renderFieldDateTime = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <DatePicker
          format="YYYY-MM-DD"
          placeholder={t('(Không có dữ liệu)')}
          className=" font-medium"
          style={{ width: '100%' }}
          variant="filled"
        />
      </Form.Item>
    </Col>
  )

  const renderFieldEduBegDate = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <RangePicker
          format="YYYY-MM-DD"
          placeholder={[t('(Từ ngày)'), t('(Đến ngày)')]}
          className="font-medium"
          style={{ width: '100%' }}
          variant="filled"
        />
      </Form.Item>
    </Col>
  )
  const renderFieldNumber = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <InputNumber
          variant="filled"
          style={{ width: '100%' }}
          className="font-medium"
          placeholder={t('(Không có dữ liệu)')}
          controls={false}
          formatter={(value) =>
            value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value?.replace(/,/g, '')}
          step={0.01}
        />
      </Form.Item>
    </Col>
  )

  const renderFieldSelect = (name, label, helpData, handleChangeType) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Select
          showSearch
          defaultValue=""
          size="middle"
          onChange={handleChangeType}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { label: '', value: '' },
            ...(helpData?.map((item) => ({
              label: item?.MinorName,
              value: item?.Value,
            })) || []),
          ]}
        />
      </Form.Item>
    </Col>
  )

  const onChangeRstNo = (e) => {
    form.setFieldsValue({ SerialNo: e.target.value })
  }

  const onChangeEduGrpTypeName = (e) => {
    const value = UMEduGrpTypeData?.find((item) => item?.Value === e)?.Value
    setEduGrpType(value)
  }

  const onChangeEduTypeName = (e) => {
    form.setFieldsValue({ BuyCost: e.target.value })
  }

  const onChangeEtcCourseName = useCallback(
    (e) => {
      form.setFieldsValue({ EtcCourseName: e.target.value })
    },
    [form],
  )

  const onChangeSMInOutTypeName = (e) => {
    const value = SMInOutTypeNameData?.find(
      (item) => item?.Value === e,
    )?.MinorName
    setSMInOutType(e)
    form.setFieldsValue({ SMInOutTypeName: value })
  }

  const onChangeSatisLevelName = (e) => {
    const value = SatisLevelData?.find((item) => item?.Value === e)?.MinorName
    form.setFieldsValue({ SatisLevelName: value })
    setSatisLevel(e)
  }

  const onChangeUMInstituteName = (e) => {
    form.setFieldsValue({ SatisLevelName: e.target.value })
  }

  const onChangeUMlocation = (e) => {
    const value = UMlocationData?.find((item) => item?.Value === e)?.MinorName
    form.setFieldsValue({ UMlocationName: value })
    setUMlocation(e)
  }

  const onChangeLecturerName = (e) => {
    form.setFieldsValue({ LecturerName: e.target.value })
  }

  const onChangeEtcInstitute = (e) => {
    form.setFieldsValue({ EtcInstitute: e.target.value })
  }

  const onChangeEtclocation = (e) => {
    form.setFieldsValue({ Etclocation: e.target.value })
  }
  const onChangeEtcLecturer = (e) => {
    form.setFieldsValue({ EtcLecturer: e.target.value })
  }

  const onChangeRstRem = (e) => {
    form.setFieldsValue({ RstRem: e.target.value })
  }

  const onChangeRstSummary = (e) => {
    form.setFieldsValue({ RstSummary: e.target.value })
  }

  return (
    <div className=" p-2 mb-2 ">
      <Form form={form}>
        <Row gutter={[16, 8]} justify="space-around" align="middle">
          <Col span={36}>
            <Row gutter={[16, 8]}>
              {renderFieldDateTime(
                'RegDate',
                '149',
                dataRootInfo?.RegDate || '',
              )}
              {renderDropdownFieldCfmEmpName(
                'CfmEmpName',
                '1648',
                dataRootInfo?.CfmEmpName || '',
                cfmEmpName,
              )}
              {renderField(
                'RstNo',
                '11779',
                dataRootInfo?.RstNo || '',
                onChangeRstNo,
              )}

              {renderDropdownFieldClassName(
                'EduClassName',
                '1087',
                dataRootInfo?.EduClassName || '',
                '',
              )}
              {renderFieldSelect(
                'UMEduGrpTypeName',
                '1085',
                UMEduGrpTypeData || [],
                onChangeEduGrpTypeName,
              )}
              {renderDropdownFieldTypeName(
                'EduTypeName',
                '1090',
                dataRootInfo?.EduTypeName || '',
                onChangeEduTypeName,
              )}

              {renderDropdownFieldCourseName(
                'EduCourseName',
                '1111',
                dataRootInfo?.EduCourseName || '',
                EduCourseName,
              )}
              {renderField(
                'EtcCourseName',
                '3045',
                dataRootInfo?.EtcCourseName || '',
                onChangeEtcCourseName,
              )}
              {renderFieldSelect(
                'SMInOutTypeName',
                '1056',
                SMInOutTypeNameData || [],
                onChangeSMInOutTypeName,
              )}
              {renderFieldEduBegDate(
                'EduBegDate',
                '19021',
                dataRootInfo?.EduBegDate || '',
              )}

              {renderFieldNumber('EduDd', '2386')}
              {renderFieldNumber('EduTm', '10484')}
              {renderFieldNumber('EduPoint', '21693')}
              {renderFieldSelect(
                'SatisLevelName',
                '5208',
                SatisLevelData || [],
                onChangeSatisLevelName,
              )}
              {renderDropdownFieldUMInstituteName(
                'UMInstituteName',
                '10476',
                dataRootInfo?.UMInstituteName || '',
                UMInstituteName,
              )}
              {renderFieldSelect(
                'UMlocationName',
                '10490',
                UMlocationData || [],
                onChangeUMlocation,
              )}
              {renderDropdownFieldLecturerName(
                'LecturerName',
                '22122',
              )}
              {renderField(
                'EtcInstitute',
                '27359',
                dataRootInfo?.EtcInstitute || '',
                onChangeEtcInstitute,
              )}
              {renderField(
                'Etclocation',
                '27362',
                dataRootInfo?.Etclocation || '',
                onChangeEtclocation,
              )}

              {renderField(
                'EtcLecturer',
                '27361',
                dataRootInfo?.EtcLecturer || '',
                onChangeEtcLecturer,
              )}

              {renderField(
                'RstRem',
                '362',
                dataRootInfo?.RstRem || '',
                onChangeRstRem,
              )}

              {renderField(
                'RstSummary',
                '2346',
                dataRootInfo?.RstSummary || '',
                onChangeRstSummary,
              )}

            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Edu0Table
