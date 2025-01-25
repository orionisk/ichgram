import { createRouter } from '@api/lib/create-router';
import * as handlers from './notification.handlers';
import * as routes from './notification.routes';

const router = createRouter()
  .openapi(routes.getNotifications, handlers.getNotifications)
  .openapi(routes.getUnreadCount, handlers.getUnreadCount)
  .openapi(routes.markAsRead, handlers.markAsRead)
  .openapi(routes.markAllAsRead, handlers.markAllAsRead);

export default router;
