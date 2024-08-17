import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Save, Trash2, Edit2, Plus, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { useTheme } from './ThemeProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const prompts = [
  "What if...",
  "How might we...",
  "Imagine a world where...",
  "Combine ... and ...",
  "Reverse the purpose of...",
  "Make ... more efficient by...",
  "Create a ... for ...",
  "Redesign ... to be more...",
  "What would happen if ... didn't exist?",
  "How can ... solve the problem of ...?",
];

const IdeaGenerator = () => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [editingIdea, setEditingIdea] = useState(null);
  const [categories, setCategories] = useState(['General']);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [newCategory, setNewCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { theme } = useTheme();

  useEffect(() => {
    const storedIdeas = localStorage.getItem('savedIdeas');
    if (storedIdeas) {
      setSavedIdeas(JSON.parse(storedIdeas));
    }
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const generatePrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const saveIdea = () => {
    if (currentPrompt) {
      const newIdea = {
        id: Date.now(),
        text: currentPrompt,
        category: selectedCategory,
        timestamp: new Date().toISOString(),
      };
      setSavedIdeas([...savedIdeas, newIdea]);
      setCurrentPrompt('');
      toast({
        title: "Idea Saved",
        description: "Your idea has been saved successfully!",
      });
    }
  };

  const deleteIdea = (id) => {
    setSavedIdeas(savedIdeas.filter((idea) => idea.id !== id));
    toast({
      title: "Idea Deleted",
      description: "The idea has been deleted successfully!",
    });
  };

  const editIdea = (id) => {
    const ideaToEdit = savedIdeas.find((idea) => idea.id === id);
    if (ideaToEdit) {
      setEditingIdea(ideaToEdit);
    }
  };

  const updateIdea = () => {
    if (editingIdea) {
      setSavedIdeas(
        savedIdeas.map((idea) =>
          idea.id === editingIdea.id ? editingIdea : idea
        )
      );
      setEditingIdea(null);
      toast({
        title: "Idea Updated",
        description: "Your idea has been updated successfully!",
      });
    }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      toast({
        title: "Category Added",
        description: `New category "${newCategory}" has been added!`,
      });
    }
  };

  const filteredIdeas = filterCategory === 'All'
    ? savedIdeas
    : savedIdeas.filter(idea => idea.category === filterCategory);

  return (
    <div className="idea-generator">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Idea Generator</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-700 rounded-3xl p-6 mb-6 shadow-md"
      >
        <p className="text-2xl mb-4 font-medium text-gray-800 dark:text-white">{currentPrompt || "Click 'Generate' to start"}</p>
        <div className="flex flex-wrap gap-3">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button onClick={generatePrompt} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg py-2 px-4">
              <Shuffle className="mr-2 h-6 w-6" />
              Generate
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button onClick={saveIdea} disabled={!currentPrompt} className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg py-2 px-4">
              <Save className="mr-2 h-6 w-6" />
              Save Idea
            </Button>
          </motion.div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-xl text-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-center">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="w-full md:w-auto mb-2 md:mb-0 md:mr-2 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl text-lg"
          />
          <motion.div whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
            <Button onClick={addCategory} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg py-2 px-4">
              <Plus className="mr-2 h-6 w-6" />
              Add Category
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <div className="saved-ideas">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Saved Ideas</h3>
        <div className="mb-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-xl text-lg">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl">
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AnimatePresence>
          {filteredIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-2xl p-4 mb-4 shadow-md"
            >
              {editingIdea && editingIdea.id === idea.id ? (
                <div className="flex items-center">
                  <Input
                    value={editingIdea.text}
                    onChange={(e) =>
                      setEditingIdea({ ...editingIdea, text: e.target.value })
                    }
                    className="flex-grow mr-2 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-xl text-lg"
                  />
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button onClick={updateIdea} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg py-2 px-4">Save</Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-800 dark:text-white">{idea.text}</span>
                  <div className="flex space-x-2">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="ghost" onClick={() => editIdea(idea.id)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-xl">
                        <Edit2 className="h-6 w-6" />
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="ghost" onClick={() => deleteIdea(idea.id)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-xl">
                        <Trash2 className="h-6 w-6" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Category: {idea.category} | {new Date(idea.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IdeaGenerator;