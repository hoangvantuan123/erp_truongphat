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
      message: <span className="font-medium opacity-85 text-sm">Thông báo</span>,
      description: formatMessage(resultA),
      placement: 'topRight',
      style: notificationStyle,
    });
  }

  if (hasU) {
    notification.success({
      message: 'Thông báo',
      description: formatMessage(resultU),
      placement: 'topRight',
      style: notificationStyle,
    });
  }

  if (!hasA && !hasU) {
    notification.success({
      message: 'Thông báo',
      description: 'Thao tác thành công!',
      placement: 'topRight',
      style: notificationStyle,
    });
  }
}
