import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronRight, ChevronDown, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { useTheme } from './ThemeProvider';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const Node = ({ node, updateNode, deleteNode, addChild, level = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const inputRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow-md ${
        level > 0 ? 'ml-4' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={node.text}
            onChange={(e) => updateNode(node.id, e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-grow mr-2 text-sm text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
          />
        ) : (
          <motion.span
            className="flex-grow mr-2 cursor-pointer text-sm text-gray-800 dark:text-white"
            onClick={handleEdit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {node.text}
          </motion.span>
        )}
        <div className="flex space-x-1">
          {node.children && node.children.length > 0 && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-md p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          )}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button size="sm" variant="ghost" onClick={() => addChild(node.id)} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-md p-1">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button size="sm" variant="ghost" onClick={handleEdit} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-md p-1">
              <Edit2 className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button size="sm" variant="ghost" onClick={() => deleteNode(node.id)} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-md p-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-2 mt-2"
          >
            {node.children.map((childNode) => (
              <Node
                key={childNode.id}
                node={childNode}
                updateNode={updateNode}
                deleteNode={deleteNode}
                addChild={addChild}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MindMap = () => {
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Central Idea', children: [] },
  ]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Default', nodes: [{ id: 1, text: 'Central Idea', children: [] }] },
    { id: 2, name: 'Problem Solving', nodes: [
      { id: 1, text: 'Problem', children: [
        { id: 2, text: 'Causes', children: [] },
        { id: 3, text: 'Effects', children: [] },
        { id: 4, text: 'Solutions', children: [] },
      ] },
    ] },
  ]);
  const { theme } = useTheme();

  useEffect(() => {
    const storedNodes = localStorage.getItem('mindMapNodes');
    if (storedNodes) {
      setNodes(JSON.parse(storedNodes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mindMapNodes', JSON.stringify(nodes));
  }, [nodes]);

  const updateNode = (id, text) => {
    const updateNodeRecursive = (nodes) => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, text };
        }
        if (node.children) {
          return { ...node, children: updateNodeRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(updateNodeRecursive(nodes));
  };

  const deleteNode = (id) => {
    const deleteNodeRecursive = (nodes) => {
      return nodes.filter((node) => {
        if (node.id === id) {
          return false;
        }
        if (node.children) {
          node.children = deleteNodeRecursive(node.children);
        }
        return true;
      });
    };
    setNodes(deleteNodeRecursive(nodes));
  };

  const addChild = (parentId) => {
    const addChildRecursive = (nodes) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const newChild = { id: Date.now(), text: 'New Idea', children: [] };
          return { ...node, children: [...(node.children || []), newChild] };
        }
        if (node.children) {
          return { ...node, children: addChildRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(addChildRecursive(nodes));
  };

  const applyTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setNodes(JSON.parse(JSON.stringify(template.nodes)));
      toast({
        title: "Template Applied",
        description: `Applied template: ${template.name}`,
      });
    }
  };

  const saveAsTemplate = () => {
    const templateName = prompt('Enter a name for this template:');
    if (templateName) {
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        nodes: JSON.parse(JSON.stringify(nodes)),
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Template Saved",
        description: `Saved template: ${templateName}`,
      });
    }
  };

  return (
    <div className="mind-map">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Mind Map</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button onClick={saveAsTemplate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm py-2 px-3">
            <Save className="mr-1 h-4 w-4" />
            Save Template
          </Button>
        </motion.div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Templates</h3>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <motion.div key={template.id} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => applyTemplate(template.id)}
                variant="outline"
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white border-gray-300 dark:border-gray-500 rounded-md text-sm py-1 px-2"
              >
                {template.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.5}
        maxScale={3}
        wheel={{ step: 0.1 }}
        limitToBounds={false}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <div className="tools mb-4 flex space-x-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button onClick={() => zoomIn()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm py-1 px-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button onClick={() => zoomOut()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm py-1 px-2">
                  <Minus className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button onClick={() => resetTransform()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm py-1 px-2">Reset</Button>
              </motion.div>
            </div>
            <TransformComponent>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                {nodes.map((node) => (
                  <Node
                    key={node.id}
                    node={node}
                    updateNode={updateNode}
                    deleteNode={deleteNode}
                    addChild={addChild}
                  />
                ))}
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MindMap;