import { useState } from 'react';

const template = (index) => {
  const assetCode = `TS-${index.toString().padStart(4, '0')}`;
  return `
^XA
^CF0,40
^FO50,30^FDTên tài sản: Máy in ${index}^FS
^FO50,80^FDMã tài sản: ${assetCode}^FS
^FO50,130^FDPhòng ban: Kế toán^FS
^FO50,180^FDSố serial: SN2025-${index}^FS
^BY3,2,100
^FO50,230^BCN,100,Y,N,N
^FD${assetCode}^FS
^XZ
`.trim();
};

const Test = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async (index) => {
    setIsLoading(true);
    const zplCode = template(index);

    try {
      const response = await fetch('https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'image/png',
        },
        body: zplCode,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    } catch (err) {
      alert('Lỗi khi gọi API Labelary');
    } finally {
      setIsLoading(false);
    }
  };

  const next = () => {
    const nextIndex = currentIndex + 1 > 1000 ? 1 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    handlePreview(nextIndex);
  };

  const previous = () => {
    const prevIndex = currentIndex - 1 < 1 ? 1000 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    handlePreview(prevIndex);
  };

  // Tự load tem đầu tiên
  useState(() => {
    handlePreview(currentIndex);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Xem tem tài sản #{currentIndex}</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={previous} className="bg-gray-500 text-white px-4 py-2 rounded">
          ← Trước
        </button>
        <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
          Tiếp →
        </button>
      </div>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : imageSrc ? (
        <img src={imageSrc} alt={`Tem #${currentIndex}`} />
      ) : (
        <p>Không có hình ảnh</p>
      )}
    </div>
  );
};

export default Test;
