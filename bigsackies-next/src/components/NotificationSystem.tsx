"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, Info, Star } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ 
  notification, 
  onClose 
}: { 
  notification: Notification; 
  onClose: () => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <Check className="text-green-400" size={20} />;
      case "error":
        return <AlertCircle className="text-red-400" size={20} />;
      case "warning":
        return <AlertCircle className="text-yellow-400" size={20} />;
      case "info":
        return <Info className="text-blue-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const getGradient = () => {
    switch (notification.type) {
      case "success":
        return "from-green-500/20 to-emerald-500/20";
      case "error":
        return "from-red-500/20 to-rose-500/20";
      case "warning":
        return "from-yellow-500/20 to-amber-500/20";
      case "info":
        return "from-blue-500/20 to-cyan-500/20";
      default:
        return "from-nebula-violet/20 to-nebula-magenta/20";
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case "success":
        return "border-green-500/50";
      case "error":
        return "border-red-500/50";
      case "warning":
        return "border-yellow-500/50";
      case "info":
        return "border-blue-500/50";
      default:
        return "border-nebula-violet/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        bg-gradient-to-br ${getGradient()} ${getBorderColor()}
        shadow-cosmic max-w-sm group
      `}
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Floating stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
            animate={{
              y: [0, -5, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Star className="text-white/10" size={8} />
          </motion.div>
        ))}
      </div>

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex-shrink-0 mt-0.5"
          >
            {getIcon()}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="font-semibold text-stellar-white mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {notification.title}
            </motion.h4>
            <motion.p 
              className="text-sm text-stellar-silver/80 break-words"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {notification.message}
            </motion.p>
            
            {notification.action && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={notification.action.onClick}
                className="mt-2 text-sm text-nebula-hot-pink hover:text-nebula-pink transition-colors font-medium"
              >
                {notification.action.label}
              </motion.button>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="flex-shrink-0 text-stellar-silver/50 hover:text-stellar-white transition-colors"
          >
            <X size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 