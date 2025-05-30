import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';
import MonthlyChart from '../components/MonthlyChart';
import CategoryPieChart from '../components/CategoryPieChart';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [allExpenses, setAllExpenses] = useState([]);



  const navigate = useNavigate();

  const token = localStorage.getItem('token');

 const fetchExpenses = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/expenses?page=${currentPage}&size=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setExpenses(response.data.content); // only content, not full page object
    setTotalPages(response.data.totalPages); // for pagination controls
    setTotalElements(response.data.totalElements);

  } catch (err) {
    console.error('Failed to fetch expenses:', err.response?.data || err.message);
    navigate('/login');
  }
};

const fetchAllExpenses = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/expenses/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAllExpenses(response.data);
  } catch (err) {
    console.error('Failed to fetch all expenses for analytics:', err);
    toast.error('Could not load analytics data.');
  }
};



  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Could not load categories.');
    }
  };

useEffect(() => {
  fetchExpenses();
  fetchAllExpenses();
  fetchCategories();
}, [currentPage, pageSize]);



  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/expenses/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(prev => prev.filter(exp => exp.id !== selectedId));
      toast.success('Expense deleted!');
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      toast.error('Failed to delete expense.');
    }
    setShowConfirm(false);
    setSelectedId(null);
  };

  const getBadgeStyle = (categoryName) => {
    const base = {
      padding: '0.25rem 0.5rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      color: '#fff',
      fontWeight: 'bold'
    };

    // Generate consistent hash-based color
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    const backgroundColor = `hsl(${hue}, 60%, 50%)`;

    return { ...base, backgroundColor };
  };

const getCategoryTotals = () => {
  const totals = {};
  allExpenses.forEach(exp => {
    const name = exp.category?.name || 'Uncategorized';
    totals[name] = (totals[name] || 0) + exp.amount;
  });
  return totals;
};


  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Your Expenses</h2>

        <div style={{ margin: '1rem 0' }}>
          <label style={{ marginRight: '0.5rem' }}>Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <h3>Totals by Category</h3>
        <ul>
          {Object.entries(getCategoryTotals()).map(([cat, total]) => (
            <li key={cat}><strong>{cat}:</strong> {total.toLocaleString()} RWF</li>
          ))}
        </ul>

        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowCharts(prev => !prev)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showCharts ? 'Hide Analytics 📉' : 'Show Analytics 📊'}
          </button>
        </div>

        <div className={`chart-wrapper ${showCharts ? 'show' : ''}`}>
          <MonthlyChart expenses={allExpenses} />
          <CategoryPieChart expenses={allExpenses} categories={categories} />

        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses
              .filter(exp => !filterCategory || exp.category?.name === filterCategory)
              .map((expense) => (
                <tr key={expense.id}>
                  <td style={styles.td}>{expense.amount}</td>
                  <td style={styles.td}>{expense.description}</td>
                  <td style={styles.td}>{new Date(expense.dateTime).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={getBadgeStyle(expense.category?.name || 'Uncategorized')}>
                      {expense.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => navigate(`/edit-expense/${expense.id}`)} style={styles.edit}>Edit</button>
                    <button onClick={() => {
                      setSelectedId(expense.id);
                      setShowConfirm(true);
                    }} style={styles.delete}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            Showing {(currentPage * pageSize) + 1}–
            {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
          </div>

          <div>
            <label style={{ marginRight: '0.5rem' }}>Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0); // reset to first page
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              ◀ Previous
            </button>

            <span>Page {currentPage + 1} of {totalPages}</span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage + 1 === totalPages}
            >
              Next ▶
            </button>
      </div>


        {showConfirm && (
          <ConfirmDialog
            message="Are you sure you want to delete this expense?"
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    border: '1px solid #ddd'
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '1px solid #ddd'
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee'
  },
  edit: {
    marginRight: '0.5rem',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  delete: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Dashboard;
