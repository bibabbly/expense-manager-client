import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Save, X } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newColor, setNewColor] = useState('#3498db');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#000000');

  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/categories`, {
        name: newCategory,
        color: newColor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category added!');
      setNewCategory('');
      setNewColor('#3498db');
      fetchCategories();
    } catch (err) {
      console.error('Add error:', err);
      toast.error('Could not add category.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted successfully!');
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete category.');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || '#000000');
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
        name: editName,
        color: editColor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Updated!');
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Update failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Manage Categories</h2>

        {/* Add New */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ flex: 1, padding: '0.5rem' }}
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            title="Pick a color"
          />
          <button onClick={handleAdd} style={{ padding: '0.5rem 1rem' }}>Add</button>
        </div>

        {/* List */}
        {categories.length === 0 ? (
          <p>No categories found. Start by adding one.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9f9f9'
                }}
              >
                {editingId === cat.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ flex: 1, marginRight: '0.5rem' }}
                    />
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      title="Pick color"
                      style={{ marginRight: '0.5rem' }}
                    />
                    <button onClick={() => handleUpdate(cat.id)} title="Save">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setEditingId(null)} title="Cancel">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          backgroundColor: cat.color || '#ccc'
                        }}
                      ></div>
                      {cat.name}
                    </span>

                    {!cat.default && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(cat)} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} title="Delete">
                          <Trash2 size={18} color="red" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryManager;
