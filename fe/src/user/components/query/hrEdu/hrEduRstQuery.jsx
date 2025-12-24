import { CompactSelection } from '@glideapps/glide-data-grid'
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Checkbox,
} from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CodeHelpEduClass from '../../table/codeHelp/codeHelpEduClass'
import CodeHelpEduType from '../../table/codeHelp/codeHelpEduType'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import CodeHelpEduCourse from '../../table/codeHelp/codeHelpEduCourse'
import CodeHelpCombo from '../../table/codeHelp/codeHelpCombo'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'

export default function HrEduRstQuery({
  HighClassData,
  setHighClassData,
  MidClassData,
  setMidClassData,
  ClassData,
  setClassData,
  UMEduGrpTypeData,

  EduTypeData,
  setEduTypeData,
  CourseData,
  setCourseData,

  EduRstTypeNameData,
  EduRstTypeName,
  setEduRstTypeName,

  UMEduHighClassName,
  setUMEduHighClassName,
  setUMEduHighClass,

  UMEduMidClassName,
  setUMEduMidClassName,
  setUMEduMidClass,

  UMEduGrpType,
  IsUse,
  setIsUse,

  RegBegDate,
  setRegBegDate,
  RegEndDate,
  setRegEndDate,

  cfmEmpName,
  setCfmEmpName,
  cfmEmpSeq,
  setCfmEmpSeq,
  CfmUserId,
  setCfmUserId,
  CfmEmpData,

  eduClassName,
  setEduClassName,
  setEduClass,
  eduTypeName,
  setEduTypeName,
  setEduTypeSeq,

  EduCourseName,
  setEduCourseName,
  setEduCourseSeq,

  setSelectEmp,

  DeptData,

  deptName,
  setDeptName,
  deptSeq,
  setDeptSeq,
  gridDeptRef,

  dataUser,
  empName,
  setEmpName,

  empSeq,
  setEmpSeq,
  userId,
  setUserId,
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)
  const [dropdownVisiblepCfmEmp, setDropdownVisiblepCfmEmp] = useState(false)
  const [dropdownVisibleEduType, setDropdownVisibleEduType] = useState(false)
  const [dropdownVisibleEduCourse, setDropdownVisibleEduCourse] =
    useState(false)
  const [dropdownVisibleUMInstitute, setDropdownVisibleUMInstitute] =
    useState(false)
  const [dropdownVisibleLecturerName, setDropdownVisibleLecturerName] =
    useState(false)

  const [dropdownVisibleHighClass, setDropdownVisibleHighClass] =
    useState(false)
  const [dropdownVisibleMidClass, setDropdownVisibleMidClass] = useState(false)
  const [dropdownVisibleClass, setDropdownVisibleClass] = useState(false)
  const [dropdownVisibleDept, setDropdownVisibleDept] = useState(false)
  const [dropdownVisibleEmp, setDropdownVisibleEmp] = useState(false)

  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [deptSearchSh, setDeptSearchSh] = useState('')

  const onChangeEduRstTypeName = (value) => {
    if (value === null || value === undefined) {
      setEduRstTypeName('')
    } else {
      const itemSelect = EduRstTypeNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setEduRstTypeName(itemSelect.Value)
      }
    }
  }

  const onChangeUMEduGrpType = (value) => {
    if (value === null || value === undefined) {
      setIsUse('')
    } else {
      const itemSelect = UMEduGrpTypeData?.find((item) => item.Value === value)

      if (itemSelect) {
        setIsUse(itemSelect.Value)
      }
    }
  }

  const handleRegBegDate = (date) => {
    setRegBegDate(date)

    // if (dataSeq) {
    //   const selectedDateStr = date?.format('YYYYMMDD')
    //   const originalDateStr = dataSeq?.WorkDate

    //   if (selectedDateStr !== originalDateStr) {
    //     setGridData((prev) =>
    //       prev.map((item) => {
    //         if (item.Status === null || item.Status === '') {
    //           return { ...item, Status: 'U' }
    //         }
    //         return item
    //       }),
    //     )
    //   }
    // }
  }

  const handleRegEndDate = (date) => {
    setRegEndDate(date)

    // if (dataSeq) {
    //   const selectedDateStr = date?.format('YYYYMMDD')
    //   const originalDateStr = dataSeq?.WorkDate

    //   if (selectedDateStr !== originalDateStr) {
    //     setGridData((prev) =>
    //       prev.map((item) => {
    //         if (item.Status === null || item.Status === '') {
    //           return { ...item, Status: 'U' }
    //         }
    //         return item
    //       }),
    //     )
    //   }
    // }
  }

  const onChangeIsConfirm = (e) => {
    setIsChangedMst(e.target.checked)
  }

  const onChangeIsNotConfirm = (e) => {
    setIsChangedMst(e.target.checked)
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('149')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={RegBegDate}
                  onChange={handleRegBegDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('149')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={RegEndDate}
                  onChange={handleRegEndDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3699')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={EduRstTypeName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeEduRstTypeName}
                allowClear
                options={[
                  ...(EduRstTypeNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1085')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={UMEduGrpType}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangeUMEduGrpType}
                options={[
                  ...(UMEduGrpTypeData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1090')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder={t('')}
                variant="filled"
                className=" font-medium w-[150px]"
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

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('19023')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={UMEduHighClassName}
                onFocus={() => setDropdownVisibleHighClass(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisibleHighClass && (
                <CodeHelpCombo
                  helpData={HighClassData}
                  setHelpData={setHighClassData}
                  minorName={UMEduHighClassName}
                  setMinorName={setUMEduHighClassName}
                  setValue={setUMEduHighClass}
                  setDropdownVisible={setDropdownVisibleHighClass}
                  dropdownVisible={dropdownVisibleHighClass}
                  nameCodeHelp={'19023'}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1089')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={UMEduMidClassName}
                onFocus={() => setDropdownVisibleMidClass(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisibleMidClass && (
                <CodeHelpCombo
                  helpData={MidClassData}
                  setHelpData={setMidClassData}
                  minorName={UMEduMidClassName}
                  setMinorName={setUMEduMidClassName}
                  setValue={setUMEduMidClass}
                  setDropdownVisible={setDropdownVisibleMidClass}
                  dropdownVisible={dropdownVisibleMidClass}
                  nameCodeHelp={'1089'}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1087')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={eduClassName}
                onFocus={() => setDropdownVisibleClass(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisibleClass && (
                <CodeHelpEduClass
                  helpData={ClassData}
                  setHelpData={setClassData}
                  minorName={eduClassName}
                  setMinorName={setEduClassName}
                  setValue={setEduClass}
                  setDropdownVisible={setDropdownVisibleClass}
                  dropdownVisible={dropdownVisibleClass}
                  nameCodeHelp={'1087'}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1111')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder={t('')}
                variant="filled"
                className=" font-medium w-[150px]"
                style={{ backgroundColor: '#e8f0ff' }}
                value={EduCourseName}
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

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('5')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={deptName}
                onFocus={() => setDropdownVisibleDept(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />

              {dropdownVisibleDept && (
                <CodeHelpDepartment
                  data={DeptData}
                  nameCodeHelp={t('5')}
                  modalVisibleDept={dropdownVisibleDept}
                  setModalVisibleDept={setDropdownVisibleDept}
                  dropdownRef={dropdownRef}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  deptSeq={deptSeq}
                  setDeptSeq={setDeptSeq}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1648')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder={t('')}
                variant="filled"
                className="font-medium w-[150px]"
                style={{ backgroundColor: '#e8f0ff' }}
                onFocus={() => setDropdownVisiblepCfmEmp(true)}
                value={cfmEmpName}
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

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('4')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={empName}
                onFocus={() => setDropdownVisibleEmp(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisibleEmp && (
                <CodeHelpPeople
                  data={dataUser}
                  nameCodeHelp={t('4')}
                  modalVisiblePeople={dropdownVisibleEmp}
                  setModalVisiblePeople={setDropdownVisibleEmp}
                  dropdownRef={null}
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  gridRef={gridDeptRef}
                  empName={empName}
                  setEmpName={setEmpName}
                  userId={userId}
                  setUserId={setUserId}
                  setEmpSeq={setEmpSeq}
                  empSeq={empSeq}
                  setSelectEmp={setSelectEmp}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1452')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={userId}
                disabled
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox onChange={onChangeIsConfirm}>{t('607')}</Checkbox>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox onChange={onChangeIsNotConfirm}>{t('11177')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
