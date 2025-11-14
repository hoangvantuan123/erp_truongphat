import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { InboxOutlined, AppstoreOutlined, BarsOutlined, FilterOutlined, PictureOutlined, FileImageOutlined } from '@ant-design/icons';
import { Image, Upload, Checkbox, Rate, Segmented, Button, Menu, Dropdown, Drawer } from 'antd';
import { HOST_API_SERVER_5 } from '../../../../services';
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import { useTranslation } from 'react-i18next'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import {
    useExtraCells,
} from "@glideapps/glide-data-grid-cells";
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { UploadOutlined } from '@ant-design/icons';
import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
const { Dragger } = Upload;
import { PostUFavoriteSeq } from '../../../../features/basic/daMaterialList/postUFavoriteSeq';

const TableUploadImageMaterial = ({ gridData, uploadPropsImages, setSelectedImages, selectedImages, dataSub,
    setSelection,
    selection,
    setShowSearch,
    showSearch,
    setEditedRows,
    setGridData,
    numRows,
    setCols,
    cols,
    defaultCols,
    dataNaWare,
    canEdit,
    setDataSearch,
    dataSearch,
    setOpenHelp,
    openHelp,
    setOnSelectRow
}) => {
    const [filterVisible, setFilterVisible] = useState(false);
    const [viewMode, setViewMode] = useState('Kanban');
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells();
    const onFill = useOnFill(setGridData, cols);
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)
    const [ratedImages, setRatedImages] = useState([]);

    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('da_material_list_more_dh', [])
    })
    const [typeSearch, setTypeSearch] = useState('')
    const [keySearchText, setKeySearchText] = useState('')
    const [hoverRow, setHoverRow] = useState(null)
    const [filteredData, setFilteredData] = useState(gridData);

    useEffect(() => {
        setFilteredData(gridData)
    }, [gridData])


    const filterOptions = [
        { key: 'all', label: 'Tất cả', icon: <PictureOutlined /> },
        { key: 'attention', label: 'Ảnh chú ý', icon: <FileImageOutlined /> }
    ];

    const filterMenu = (
        <Menu
            onClick={(e) => handleFilterChange(e.key)}
            items={filterOptions.map(option => ({
                key: option.key,
                label: (
                    <span>
                        {option.icon} {option.label}
                    </span>
                )
            }))}
        />
    );

    const handleFilterChange = (value) => {
        if (value === 'all') {
            setFilteredData(gridData);
        } else if (value === 'attention') {
            setFilteredData(gridData.filter(file => file.Favorite));
        }
        setFilterVisible(false);
    };

    const handleSelectImage = (id) => {
        setSelectedImages((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };
    const handleRateChange = (value, idSeq) => {
        const currentFavorite = gridData.find(file => file.IdSeq === idSeq)?.Favorite;
        const newFavorite = !currentFavorite;

        const updatedData = gridData.map(file =>
            file.IdSeq === idSeq
                ? { ...file, Favorite: newFavorite }
                : file
        );
        setGridData(updatedData);

        const payload = {
            IdSeq: idSeq,
            Favorite: newFavorite
        };

        PostUFavoriteSeq(payload)
            .then((response) => {
                console.log('response', response);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật:', error);
            });
        if (newFavorite) {
            setRatedImages(prev => [...prev, idSeq]);
        } else {
            setRatedImages(prev => prev.filter(id => id !== idSeq));
        }
    };

    return (
        <div className=''>
            <Dragger {...uploadPropsImages} style={{ borderRadius: '0', border: 'none' }} className={`w-full cursor-${dataSub.length > 0 ? 'pointer' : 'not-allowed'}`}
                disabled={dataSub.length === 0}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-hint">
                Nhấp hoặc kéo tệp vào khu vực này để tải lên
                </p>
            </Dragger>
            <div className='w-full h-auto mt-2 border-t border-b p-1 gap-2 flex justify-end'>
                <Segmented
                    options={[
                        {
                            value: 'Kanban',
                            icon: <AppstoreOutlined />,
                        }

                    ]}
                    onChange={setViewMode}
                />
                <Dropdown
                    overlay={filterMenu}
                    trigger={['click']}
                    visible={filterVisible}
                    onVisibleChange={setFilterVisible}
                >
                    <Button color="default" variant="filled" icon={<FilterOutlined />}></Button>
                </Dropdown>
            </div>

            <div className='h-screen   overflow-hidden'>
                {filteredData.length > 0 ? (
                    <div className='h-screen  overflow-y-auto pb-[500px]'>
                        {
                            filteredData.map((file) => (
                                <div
                                    key={file.IdSeq}
                                    style={{ position: 'relative', display: 'inline-block', margin: '8px' }}

                                >
                                    <Image
                                        width={150}
                                        height={150}
                                        src={`${HOST_API_SERVER_5}/${file.Filename}`}
                                        style={{ cursor: 'pointer', border: 1 }}
                                    />
                                    <Checkbox
                                        checked={selectedImages.includes(file.IdSeq)}
                                        onChange={() => handleSelectImage(file.IdSeq)}
                                        style={{ position: 'absolute', top: 8, right: 8 }}
                                    />
                                    <Rate count={1} value={file.Favorite ? 1 : 0} style={{ position: 'absolute', top: 8, left: 8 }} onChange={(value) => handleRateChange(value, file.IdSeq)} />
                                </div>

                            ))
                        }


                    </div>
                ) : (
                    <p className='flex items-center justify-center'>Không có hình ảnh nào để hiển thị</p>
                )}
            </div>
        </div>
    );
};

export default TableUploadImageMaterial;