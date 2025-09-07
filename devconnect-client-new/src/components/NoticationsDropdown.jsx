import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationsDropdown = () => {
  const { notifications, markAsRead } = useNotification();

  console.log('Notifications in dropdown:', notifications); // Debug log

  return (
    <div className="absolute right-0 top-8 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
      <h3 className="font-semibold mb-3 text-gray-800 border-b pb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">No new notifications</p>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n._id} className="border-b border-gray-100 pb-3 last:border-b-0">
              <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                {n.message}
              </p>
              {n.link && (
                <Link
                  to={n.link}
                  className="text-blue-500 text-xs hover:text-blue-700 mt-1 inline-block"
                  onClick={() => markAsRead(n._id)}
                >
                  View →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
