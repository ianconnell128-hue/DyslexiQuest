/**
 * notifications-ui.js
 * Manages phone notification settings and communication with AndroidNotificationBridge.
 */
(function() {
  const isAndroid = !!(window.AndroidNotificationBridge);

  const AppNotifications = {
    isAvailable: function() {
      return isAndroid;
    },

    isEnabled: function() {
      if (isAndroid) {
        try {
          return window.AndroidNotificationBridge.areNotificationsEnabled();
        } catch (e) {
          console.warn('[Notifications] Error checking enabled:', e);
        }
      }
      return localStorage.getItem('dq_notifications_enabled') !== 'false';
    },

    setEnabled: function(enabled) {
      if (isAndroid) {
        try {
          window.AndroidNotificationBridge.setNotificationsEnabled(enabled);
        } catch (e) {
          console.warn('[Notifications] Error setting enabled:', e);
        }
      }
      localStorage.setItem('dq_notifications_enabled', enabled ? 'true' : 'false');
    },

    getReminderTime: function() {
      if (isAndroid) {
        try {
          const raw = window.AndroidNotificationBridge.getDailyReminderTime();
          const parsed = JSON.parse(raw);
          return {
            hour: typeof parsed.hour === 'number' ? parsed.hour : 17,
            minute: typeof parsed.minute === 'number' ? parsed.minute : 0
          };
        } catch (e) {
          console.warn('[Notifications] Error getting time:', e);
        }
      }
      const saved = localStorage.getItem('dq_reminder_time') || '17:00';
      const [h, m] = saved.split(':').map(Number);
      return { hour: isNaN(h) ? 17 : h, minute: isNaN(m) ? 0 : m };
    },

    setReminderTime: function(hour, minute) {
      if (isAndroid) {
        try {
          window.AndroidNotificationBridge.setDailyReminderTime(hour, minute);
        } catch (e) {
          console.warn('[Notifications] Error setting reminder time:', e);
        }
      }
      const formatted = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      localStorage.setItem('dq_reminder_time', formatted);
    },

    sendTest: function() {
      if (isAndroid) {
        try {
          window.AndroidNotificationBridge.sendTestNotification(
            'DyslexiQuest 🔔',
            'Notifications are working! Your daily quests and pets will notify you here.'
          );
          return true;
        } catch (e) {
          console.warn('[Notifications] Error sending test notification:', e);
        }
      } else if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('DyslexiQuest 🔔', {
            body: 'Notifications are working! Your daily quests and pets will notify you here.'
          });
          return true;
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(function(perm) {
            if (perm === 'granted') {
              new Notification('DyslexiQuest 🔔', {
                body: 'Notifications are working! Your daily quests and pets will notify you here.'
              });
            }
          });
          return true;
        }
      }
      return false;
    },

    requestPermission: function() {
      if (isAndroid) {
        try {
          window.AndroidNotificationBridge.requestPermission();
        } catch (e) {
          console.warn('[Notifications] Error requesting permission:', e);
        }
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    },

    hasPermission: function() {
      if (isAndroid) {
        try {
          return window.AndroidNotificationBridge.hasNotificationPermission();
        } catch (e) {
          return true;
        }
      }
      return ('Notification' in window) ? Notification.permission === 'granted' : true;
    },

    recordActivity: function() {
      if (isAndroid) {
        try {
          window.AndroidNotificationBridge.recordActivity();
        } catch (e) {
          // ignore
        }
      }
    }
  };

  window.AppNotifications = AppNotifications;

  // Initialize UI once DOM is ready
  function initUI() {
    const toggle = document.getElementById('notif-toggle');
    const timeInput = document.getElementById('notif-time-input');
    const testBtn = document.getElementById('notif-test-btn');
    const badge = document.getElementById('notif-status-badge');
    const panel = document.getElementById('notifications-panel');

    if (!toggle || !timeInput || !testBtn) return;

    function updateBadge(enabled) {
      if (!badge) return;
      if (enabled) {
        badge.textContent = 'ACTIVE';
        badge.style.color = '#10b981';
      } else {
        badge.textContent = 'OFF';
        badge.style.color = '#94a3b8';
      }
    }

    const enabled = AppNotifications.isEnabled();
    toggle.checked = enabled;
    updateBadge(enabled);

    // If enabled, ensure system permission has been requested
    if (enabled && !AppNotifications.hasPermission()) {
      AppNotifications.requestPermission();
    }

    const time = AppNotifications.getReminderTime();
    timeInput.value = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

    toggle.addEventListener('change', function() {
      const isChecked = toggle.checked;
      AppNotifications.setEnabled(isChecked);
      if (isChecked) {
        AppNotifications.requestPermission();
      }
      updateBadge(isChecked);
      if (window.DevLog) {
        window.DevLog.log('NOTIFICATIONS_TOGGLE', { enabled: isChecked });
      }
    });


    timeInput.addEventListener('change', function() {
      const val = timeInput.value;
      if (!val) return;
      const [h, m] = val.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        AppNotifications.setReminderTime(h, m);
        if (window.DevLog) {
          window.DevLog.log('NOTIFICATIONS_TIME_CHANGE', { hour: h, minute: m });
        }
      }
    });

    testBtn.addEventListener('click', function() {
      testBtn.disabled = true;
      testBtn.textContent = 'Sending...';
      const success = AppNotifications.sendTest();
      setTimeout(function() {
        testBtn.disabled = false;
        testBtn.textContent = '🔔 Send Test Notification';
        alert('Test notification sent! Check your phone notification tray.');
      }, 500);
    });

    // Record activity on startup
    AppNotifications.recordActivity();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
})();
