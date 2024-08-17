import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { useTheme } from './ThemeProvider';

const Settings = ({ onRestartTutorial }) => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setNotifications(parsedSettings.notifications);
      setFontSize(parsedSettings.fontSize);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      notifications,
      fontSize,
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const resetSettings = () => {
    setNotifications(true);
    setFontSize('medium');
    localStorage.removeItem('appSettings');
    toast.success('Settings reset to default!');
  };

  const handleRestartTutorial = () => {
    onRestartTutorial();
    toast.success('Tutorial restarted. Please check the main screen.');
  };

  return (
    <div className="settings">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-indigo-100 dark:bg-indigo-900 backdrop-blur-sm rounded-3xl p-4 mb-4"
      >
        <div className="mb-4">
          <label className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center justify-between">
            <span>Notifications</span>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center justify-between">
            <span>Font Size</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg p-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>
        <div className="flex flex-col space-y-2">
          <Button onClick={saveSettings}>Save Settings</Button>
          <Button onClick={resetSettings} variant="outline">Reset to Default</Button>
          <Button onClick={handleRestartTutorial} variant="outline">Restart Tutorial</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;