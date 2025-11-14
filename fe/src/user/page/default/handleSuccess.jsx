import { notification } from 'antd';

const notificationStyle = {
  padding: '12px 12px',
  fontSize: 13,
};


export function HandleSuccess(results = []) {
  if (!results.length) return;

  const resultA = results[0] || null;
  const resultU = results[1] || null;

  const hasA = !!resultA && resultA.success;
  const hasU = !!resultU && resultU.success;

  const formatMessage = (result) => {
    if (!result || !result.success) return null;

    const messages = Array.isArray(result.message)
      ? result.message
      : [result.message || 'Thành công'];

    return (
      <div>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (hasA) {
    notification.success({
      message: <span className="font-medium opacity-85 text-sm">Thành công</span>,
      description: formatMessage(resultA) || resultA.message || 'Thao tác thành công!',
      placement: 'topRight',
      style: notificationStyle,
    });
  }

  if (hasU) {
    notification.success({
      message: 'Thành công',
      description: formatMessage(resultU) || resultU.message || 'Thao tác thành công!',
      placement: 'topRight',
      style: notificationStyle,
    });
  }

  // Nếu không có A hoặc U mà vẫn có kết quả thành công chung
  if (!hasA && !hasU && results[0]?.success) {
    notification.success({
      message: 'Thành công',
      description: Array.isArray(results[0].message)
        ? results[0].message.join(', ')
        : results[0].message || 'Thao tác thành công!',
      placement: 'topRight',
      style: notificationStyle,
    });
  }
}
