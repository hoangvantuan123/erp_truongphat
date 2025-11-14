import { notification } from 'antd';

const notificationStyle = {
  padding: '12px 12px',
  fontSize: 13,
};
export function HandleError(results = []) {
  if (!results.length) return;

  const resultA = results[0] || null;
  const resultU = results[1] || null;

  const hasA = !!resultA && !resultA.success;
  const hasU = !!resultU && !resultU.success;

  const formatMessage = (result) => {
    if (!result || result.success) return null;

    const messages = Array.isArray(result.message)
      ? result.message
      : [result.message || 'Có lỗi xảy ra'];

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
    notification.warning({
      message: <span className=" font-medium opacity-85 text-sm">Thông báo lỗi</span>,
      description: formatMessage(resultA),
      placement: 'topRight',
      style: notificationStyle,
    });
  }

  if (hasU) {
    notification.warning({
      message: 'Thông báo lỗi',
      description: formatMessage(resultU),
      placement: 'topRight',
      style: notificationStyle,
    });
  }

  if (!hasA && !hasU) {
    notification.warning({
      message: 'Thông báo lỗi',
      description: 'Có lỗi xảy ra. Vui lòng thử lại.',
      placement: 'topRight',
      style: notificationStyle,
    });
  }
}
