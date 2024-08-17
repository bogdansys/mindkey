import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

const tutorialSteps = [
  {
    title: "Welcome to MindKey!",
    content: "MindKey is your personal tool for organizing thoughts and generating ideas. Let's explore its features!",
  },
  {
    title: "Mind Map",
    content: "Create visual representations of your ideas. Add, connect, and organize concepts easily.",
  },
  {
    title: "Idea Generator",
    content: "Stuck? Use our idea generator to spark creativity and overcome writer's block.",
  },
  {
    title: "Notes",
    content: "Jot down quick thoughts or elaborate on your ideas with our note-taking feature.",
  },
  {
    title: "Settings",
    content: "Customize MindKey to suit your preferences and workflow.",
  },
];

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {tutorialSteps[currentStep].title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onComplete}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {tutorialSteps[currentStep].content}
        </p>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            {currentStep + 1} / {tutorialSteps.length}
          </div>
          <Button onClick={nextStep}>
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Tutorial;