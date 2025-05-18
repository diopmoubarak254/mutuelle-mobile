import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'payment' | 'coverage' | 'request' | 'system';
}

interface NotificationState {
  notifications: Notification[];
  hasUnreadNotifications: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: '1',
      title: 'Paiement reçu',
      message: 'Votre paiement de 5000 FCFA a été reçu avec succès.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      type: 'payment'
    },
    {
      id: '2',
      title: 'Renouvellement à venir',
      message: 'Votre couverture santé expire dans 15 jours. Veuillez la renouveler pour maintenir vos avantages.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: true,
      type: 'coverage'
    },
    {
      id: '3',
      title: 'Demande approuvée',
      message: 'Votre demande d\'attestation a été approuvée. Vous pouvez maintenant télécharger le document.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true,
      type: 'request'
    }
  ],
  
  get hasUnreadNotifications() {
    return get().notifications.some(notification => !notification.read);
  },
  
  addNotification: (notification) => set((state) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      read: false
    };
    
    return {
      notifications: [newNotification, ...state.notifications]
    };
  }),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    )
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(notification => ({ ...notification, read: true }))
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(notification => notification.id !== id)
  })),
  
  clearAll: () => set({ notifications: [] })
}));

export const useNotifications = () => {
  const {
    notifications,
    hasUnreadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotificationsStore();
  
  return {
    notifications,
    hasUnreadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
};