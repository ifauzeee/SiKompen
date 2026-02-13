"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getMyNotifications();
      setNotifications(data);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notifId: number) => {
    const res = await markNotificationAsRead(notifId);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllNotificationsAsRead();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100/50 hover:text-gray-600 dark:hover:bg-gray-800/50 dark:hover:text-gray-300"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white dark:border-gray-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-100 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-black/50">
          <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Notifikasi
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-pnj-blue text-xs font-semibold hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                <div className="mb-3 rounded-full bg-gray-50 p-3 dark:bg-gray-800/50">
                  <Bell size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                    className={`group relative flex cursor-pointer gap-3 p-4 transition-colors ${
                      notif.isRead
                        ? "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30"
                        : "bg-pnj-blue/5 hover:bg-pnj-blue/10"
                    }`}
                  >
                    {!notif.isRead && (
                      <div className="bg-pnj-blue absolute top-5 right-4 h-2 w-2 rounded-full" />
                    )}
                    <div className="flex-1 space-y-1">
                      <p
                        className={`text-sm leading-tight ${
                          notif.isRead
                            ? "font-medium text-gray-700 dark:text-gray-300"
                            : "font-bold text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {notif.message}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 p-2 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              Lihat Semua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
