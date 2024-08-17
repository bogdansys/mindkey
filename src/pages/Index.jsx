import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MindMap from '../components/MindMap';
import IdeaGenerator from '../components/IdeaGenerator';
import Settings from '../components/Settings';
import Notes from '../components/Notes';
import About from '../components/About';
import Tutorial from '../components/Tutorial';
import { Button } from '../components/ui/button';
import { PlusCircle, Lightbulb, Settings as SettingsIcon, Menu, BookOpen, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from '../components/ui/toaster';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Index = () => {
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
    return () => clearTimeout(timer);
  }, []);

  const TabButton = ({ tab, icon, label }) => (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="w-full"
    >
      <Button
        variant={activeTab === tab ? 'default' : 'ghost'}
        onClick={() => setActiveTab(tab)}
        className={`w-full justify-start rounded-xl ${
          activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-800 dark:text-gray-200'
        } transition-all duration-300 ease-in-out text-base py-2`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </Button>
    </motion.div>
  );

  const handleRestartTutorial = () => {
    setShowTutorial(true);
    localStorage.removeItem('hasSeenTutorial');
  };

  const TabContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 h-[calc(100vh-120px)] overflow-y-auto"
      >
        {activeTab === 'mindmap' && <MindMap />}
        {activeTab === 'ideagenerator' && <IdeaGenerator />}
        {activeTab === 'notes' && <Notes />}
        {activeTab === 'settings' && <Settings onRestartTutorial={handleRestartTutorial} />}
        {activeTab === 'about' && <About />}
      </motion.div>
    </AnimatePresence>
  );

  const DesktopLanding = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Welcome to MindKey</h1>
        <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">
          MindKey is an Android app designed to help you organize your thoughts and generate ideas on the go.
          This web version is optimized for mobile devices and may not function correctly on desktop browsers.
        </p>
        <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">
          To experience MindKey, please visit this page on your Android device or check out the project on GitHub for more information.
        </p>
        <p className="text-lg mb-8 text-green-600 dark:text-green-400 font-semibold">
          Coming soon: Download MindKey from the Google Play Store!
        </p>
        <Button
          onClick={() => window.open('https://github.com/bogdansys', '_blank')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg py-2 px-6"
        >
          View on GitHub
        </Button>
      </div>
    </div>
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
          className="text-white text-4xl font-bold"
        >
          Loading MindKey...
        </motion.div>
      </div>
    );
  }

  if (!isMobile) {
    return <DesktopLanding />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-gray-800 dark:text-white p-2 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
          className="text-3xl font-bold text-center mb-4 text-white"
        >
          MindKey
        </motion.h1>
        <Sheet>
          <SheetTrigger asChild>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="mb-2 bg-white/20 border-white/20 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-r-3xl">
            <nav className="flex flex-col space-y-3 mt-6">
              <TabButton tab="mindmap" icon={<PlusCircle className="h-5 w-5" />} label="Mind Map" />
              <TabButton tab="ideagenerator" icon={<Lightbulb className="h-5 w-5" />} label="Ideas" />
              <TabButton tab="notes" icon={<BookOpen className="h-5 w-5" />} label="Notes" />
              <TabButton tab="settings" icon={<SettingsIcon className="h-5 w-5" />} label="Settings" />
              <TabButton tab="about" icon={<Info className="h-5 w-5" />} label="About" />
            </nav>
          </SheetContent>
        </Sheet>
        {showTutorial ? (
          <Tutorial onComplete={() => {
            setShowTutorial(false);
            localStorage.setItem('hasSeenTutorial', 'true');
          }} />
        ) : (
          <TabContent />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;