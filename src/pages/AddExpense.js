import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { toast } from 'react-toastify';
import { 
  DollarSign, 
  FileText, 
  Calendar, 
  Tag, 
  Save, 
  ArrowLeft, 
  Plus,
  AlertCircle 
} from 'lucide-react';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    const expense = {
      amount: parseFloat(amount),
      description: description.trim(),
      dateTime: `${date}T00:00:00`,
      category: { id: parseInt(category) }
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/expenses`,
        expense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Expense added:', response.data);
      toast.success('💰 Expense added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Add expense error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to add expense. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <button
            onClick={() => navigate('/dashboard')}
            style={styles.backButton}
            className="btn btn-outline"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          
          <div style={styles.titleSection}>
            <div style={styles.titleIcon}>
              <Plus size={32} />
            </div>
            <h1 style={styles.title}>Add New Expense</h1>
            <p style={styles.subtitle}>
              Track your spending and stay on top of your budget
            </p>
          </div>
        </div>

        <div style={styles.formCard} className="card">
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              {/* Amount Field */}
              <div style={styles.field}>
                <label style={styles.label}>
                  <DollarSign size={18} />
                  Amount *
                </label>
                <div style={styles.inputWrapper}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: null }));
                      }
                    }}
                    style={{
                      ...styles.input,
                      ...(errors.amount ? styles.inputError : {}),
                      paddingLeft: '2.5rem'
                    }}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {errors.amount}
                  </div>
                )}
              </div>

              {/* Category Field */}
              <div style={styles.field}>
                <label style={styles.label}>
                  <Tag size={18} />
                  Category *
                </label>
                <div style={styles.selectWrapper}>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (errors.category) {
                        setErrors(prev => ({ ...prev, category: null }));
                      }
                    }}
                    style={{
                      ...styles.select,
                      ...(errors.category ? styles.inputError : {})
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {errors.category}
                  </div>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div style={styles.field}>
              <label style={styles.label}>
                <FileText size={18} />
                Description *
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors(prev => ({ ...prev, description: null }));
                    }
                  }}
                  style={{
                    ...styles.input,
                    ...(errors.description ? styles.inputError : {})
                  }}
                  placeholder="What did you spend on?"
                />
              </div>
              {errors.description && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={16} />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Date Field */}
            <div style={styles.field}>
              <label style={styles.label}>
                <Calendar size={18} />
                Date *
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) {
                      setErrors(prev => ({ ...prev, date: null }));
                    }
                  }}
                  style={{
                    ...styles.input,
                    ...(errors.date ? styles.inputError : {})
                  }}
                />
              </div>
              {errors.date && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={16} />
                  {errors.date}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={styles.cancelButton}
                className="btn btn-outline"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <div style={styles.loadingSpinner} className="animate-pulse">
                    Adding...
                  </div>
                ) : (
                  <>
                    <Save size={18} />
                    Add Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div style={styles.tipsCard} className="card">
          <h3 style={styles.tipsTitle}>💡 Quick Tips</h3>
          <ul style={styles.tipsList}>
            <li>Be specific with your descriptions to track spending patterns</li>
            <li>Choose the right category to get better insights</li>
            <li>Add expenses promptly to maintain accurate records</li>
            <li>Review your spending regularly to stay on budget</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--gradient-background)',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '3rem',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  },
  titleSection: {
    textAlign: 'center',
  },
  titleIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--gradient-success)',
    color: 'white',
    marginBottom: '1rem',
    boxShadow: 'var(--shadow-lg)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--gray-600)',
    fontSize: '1.125rem',
    fontWeight: '500',
  },
  formCard: {
    padding: '3rem',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--gray-700)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  currencySymbol: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--gray-500)',
    fontWeight: '600',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid var(--gray-200)',
    borderRadius: 'var(--radius-lg)',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  },
  inputError: {
    borderColor: 'var(--error-500)',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
  },
  selectWrapper: {
    position: 'relative',
  },
  select: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid var(--gray-200)',
    borderRadius: 'var(--radius-lg)',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'var(--error-600)',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tipsCard: {
    padding: '2rem',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
  },
  tipsTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--success-700)',
    marginBottom: '1rem',
  },
  tipsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: 'var(--gray-700)',
  },
};

// Add focus styles
const focusStyles = `
  input:focus, select:focus {
    outline: none;
    border-color: var(--primary-500) !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
  
  .tips-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  .tips-card li:last-child {
    border-bottom: none;
  }
  
  .tips-card li:before {
    content: "✓";
    color: var(--success-600);
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = focusStyles;
  document.head.appendChild(styleSheet);
}

export default AddExpense;
