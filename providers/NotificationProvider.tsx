import React, { createContext, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { useNotifications, Notification } from '@/hooks/useNotifications';

interface NotificationContextType {
  registerForPushNotifications: () => Promise<void>;
  scheduleLocalNotification: (notification: Pick<Notification, 'title' | 'message'>) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  registerForPushNotifications: async () => {},
  scheduleLocalNotification: () => {},
});

export const useNotificationService = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { addNotification } = useNotifications();

  // Register for push notifications
  const registerForPushNotifications = async () => {
    if (Platform.OS === 'web') {
      console.log('Push notifications not available on web');
      return;
    }

    // In a real app, we would use expo-notifications to register
    // for push notifications. This is just a mock implementation.
    console.log('Registered for push notifications');
  };

  // Schedule a local notification
  const scheduleLocalNotification = (notification: Pick<Notification, 'title' | 'message'>) => {
    // In a real app, we would use expo-notifications to schedule
    // a local notification. For now, just add it to our store.
    addNotification({
      ...notification,
      type: 'system',
    });
  };

  // Initialize push notifications when the provider mounts
  useEffect(() => {
    registerForPushNotifications().catch(console.error);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        registerForPushNotifications,
        scheduleLocalNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}