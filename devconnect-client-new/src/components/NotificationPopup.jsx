import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationPopup = () => {
  const { popupNotifications, dismissPopupNotification } = useNotification();

  const dismissAllNotifications = () => {
    popupNotifications.forEach(popup => {
      dismissPopupNotification(popup.id);
    });
  };

  if (popupNotifications.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notifications ({popupNotifications.length})
          </h3>

          <div className="space-y-3 mb-6">
            {popupNotifications.map((popup) => (
              <div key={popup.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <p className="text-sm text-gray-800">{popup.message}</p>
                {popup.link && (
                  <Link
                    to={popup.link}
                    className="text-blue-500 text-xs hover:text-blue-700 mt-1 inline-block"
                    onClick={() => dismissPopupNotification(popup.id)}
                  >
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={dismissAllNotifications}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
