import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Github, Linkedin, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="about">
      <h2 className="text-2xl font-semibold mb-4">About MindKey</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-4 mb-4"
      >
        <h3 className="text-xl font-semibold mb-2">Features</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Mind Map: Create and organize your thoughts visually</li>
          <li>Idea Generator: Get inspired with random prompts</li>
          <li>Notes: Jot down and manage your ideas</li>
          <li>Settings: Customize your MindKey experience</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">About the Author</h3>
        <p className="mb-4">
          MindKey was created by Mihai Iordache, a passionate developer dedicated to creating innovative tools for enhancing creativity and productivity.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => window.open('https://www.linkedin.com/in/mihai-iordache-676444187/', '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Linkedin className="mr-2 h-5 w-5" />
            LinkedIn
          </Button>
          <Button
            onClick={() => window.open('https://github.com/bogdansys', '_blank')}
            className="bg-gray-800 hover:bg-gray-900 text-white rounded-full"
          >
            <Github className="mr-2 h-5 w-5" />
            GitHub
          </Button>
          <Button
            onClick={() => window.open('https://bogdan-porto-os.vercel.app/', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
          >
            <Globe className="mr-2 h-5 w-5" />
            Portfolio
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;