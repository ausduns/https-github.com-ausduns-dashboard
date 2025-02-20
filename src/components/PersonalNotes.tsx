import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

interface Note {
  id?: number
  title: string
  content: string
  created_at?: string
  user_id?: string
}

const PersonalNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState<Note>({ title: '', content: '' })
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('personal_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleAddNote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('personal_notes')
        .insert({
          ...newNote,
          user_id: user.id
        })
        .select()

      if (error) throw error

      setNotes([...notes, data[0]])
      setNewNote({ title: '', content: '' })
      setIsAddingNote(false)
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return

    try {
      const { error } = await supabase
        .from('personal_notes')
        .update({
          title: editingNote.title,
          content: editingNote.content
        })
        .eq('id', editingNote.id)

      if (error) throw error

      setNotes(notes.map(note => 
        note.id === editingNote.id ? editingNote : note
      ))
      setEditingNote(null)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    try {
      const { error } = await supabase
        .from('personal_notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Personal Notes</h1>
        <button 
          onClick={() => setIsAddingNote(true)}
          className="bg-royal-blue-600 text-white p-2 rounded-full hover:bg-royal-blue-700 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {isAddingNote && (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <input 
            type="text"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
          />
          <textarea 
            placeholder="Note Content"
            value={newNote.content}
            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
            className="w-full p-2 border rounded-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
          />
          <div className="flex space-x-2">
            <button 
              onClick={handleAddNote}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <Save className="mr-2 h-5 w-5 inline" /> Save
            </button>
            <button 
              onClick={() => setIsAddingNote(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              <X className="mr-2 h-5 w-5 inline" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white shadow-md rounded-lg p-6 space-y-4">
            {editingNote?.id === note.id ? (
              <>
                <input 
                  type="text"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
                />
                <textarea 
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  className="w-full p-2 border rounded-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={handleUpdateNote}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    <Save className="mr-2 h-5 w-5 inline" /> Save
                  </button>
                  <button 
                    onClick={() => setEditingNote(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <X className="mr-2 h-5 w-5 inline" /> Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <p className="text-gray-600">{note.content}</p>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>{new Date(note.created_at || '').toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingNote(note)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id!)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonalNotes
