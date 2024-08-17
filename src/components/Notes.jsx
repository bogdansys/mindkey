import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import { useTheme } from './ThemeProvider';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const noteToAdd = {
        id: Date.now(),
        ...newNote,
        timestamp: new Date().toISOString(),
      };
      setNotes([...notes, noteToAdd]);
      setNewNote({ title: '', content: '' });
      toast({
        title: "Note Added",
        description: "Your note has been added successfully!",
      });
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast({
      title: "Note Deleted",
      description: "The note has been deleted successfully!",
    });
  };

  const editNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = () => {
    if (editingNote) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id ? { ...editingNote, timestamp: new Date().toISOString() } : note
        )
      );
      setEditingNote(null);
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully!",
      });
    }
  };

  return (
    <div className="notes">
      <h2 className="text-2xl font-semibold mb-4">Notes</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-indigo-100 dark:bg-indigo-900 backdrop-blur-sm rounded-3xl p-4 mb-4"
      >
        <Input
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          placeholder="Note title"
          className="mb-2"
        />
        <Textarea
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          placeholder="Note content"
          className="mb-2"
          rows={4}
        />
        <Button onClick={addNote} disabled={!newNote.title || !newNote.content}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </motion.div>
      <div className="saved-notes">
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2 mb-2"
            >
              {editingNote && editingNote.id === note.id ? (
                <div>
                  <Input
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    className="mb-2"
                  />
                  <Textarea
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, content: e.target.value })
                    }
                    className="mb-2"
                    rows={4}
                  />
                  <Button onClick={updateNote}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="mb-2">{note.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-400">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => editNote(note)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notes;