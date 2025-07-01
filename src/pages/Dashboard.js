import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';
import MonthlyChart from '../components/MonthlyChart';
import CategoryPieChart from '../components/CategoryPieChart';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  PieChart, 
  BarChart3, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Plus,
  Activity
} from 'lucide-react';
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
      setExpenses(response.data.content);
      setTotalPages(response.data.totalPages);
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
      toast.success('Expense deleted successfully! 🗑️');
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      toast.error('Failed to delete expense.');
    }
    setShowConfirm(false);
    setSelectedId(null);
  };

  const getBadgeStyle = (categoryName) => {
    const colorMap = {
      'Food': { bg: '#fef3c7', color: '#d97706', border: '#f59e0b' },
      'Transport': { bg: '#dbeafe', color: '#2563eb', border: '#3b82f6' },
      'Entertainment': { bg: '#fce7f3', color: '#be185d', border: '#ec4899' },
      'Health': { bg: '#dcfce7', color: '#16a34a', border: '#22c55e' },
      'Shopping': { bg: '#f3e8ff', color: '#7c3aed', border: '#8b5cf6' },
      'Bills': { bg: '#fee2e2', color: '#dc2626', border: '#ef4444' },
      'Education': { bg: '#ecfdf5', color: '#059669', border: '#10b981' },
      'Travel': { bg: '#fff7ed', color: '#ea580c', border: '#f97316' },
    };

    const style = colorMap[categoryName] || { bg: '#f3f4f6', color: '#6b7280', border: '#9ca3af' };
    
    return {
      backgroundColor: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
    };
  };

  const getCategoryTotals = () => {
    const totals = {};
    allExpenses.forEach(exp => {
      const name = exp.category?.name || 'Uncategorized';
      totals[name] = (totals[name] || 0) + exp.amount;
    });
    return totals;
  };

  const getTotalExpenses = () => {
    return allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getMonthlyTotal = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return allExpenses
      .filter(exp => {
        const expenseDate = new Date(exp.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getThisWeekTotal = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    return allExpenses
      .filter(exp => new Date(exp.date) >= weekStart)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const filteredExpenses = filterCategory 
    ? expenses.filter(exp => exp.category?.name === filterCategory)
    : expenses;

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Financial Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your expenses and take control of your finances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Total Expenses</div>
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="stat-value">${getTotalExpenses().toLocaleString()}</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              <span>All time</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">This Month</div>
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
            </div>
            <div className="stat-value">${getMonthlyTotal().toLocaleString()}</div>
            <div className="stat-change">
              <Activity size={16} />
              <span>Current month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">This Week</div>
              <div className="stat-icon">
                <BarChart3 size={24} />
              </div>
            </div>
            <div className="stat-value">${getThisWeekTotal().toLocaleString()}</div>
            <div className="stat-change">
              <Activity size={16} />
              <span>Last 7 days</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Categories</div>
              <div className="stat-icon">
                <PieChart size={24} />
              </div>
            </div>
            <div className="stat-value">{Object.keys(getCategoryTotals()).length}</div>
            <div className="stat-change">
              <Activity size={16} />
              <span>Active categories</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="filter-group">
            <Filter size={20} style={{ color: 'var(--gray-600)' }} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCharts(!showCharts)}
            className="toggle-charts-btn"
          >
            {showCharts ? <BarChart3 size={20} /> : <PieChart size={20} />}
            {showCharts ? 'Hide Analytics' : 'Show Analytics'}
          </button>

          <button
            onClick={() => navigate('/add-expense')}
            className="btn btn-success"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        {/* Charts */}
        <div className={`chart-wrapper ${showCharts ? 'show' : ''}`}>
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Monthly Trends</h3>
              <MonthlyChart expenses={allExpenses} />
            </div>
            <div className="chart-card">
              <h3 className="chart-title">Category Distribution</h3>
              <CategoryPieChart expenses={allExpenses} />
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="expenses-section">
          <div className="section-header">
            <h2 className="section-title">Recent Expenses</h2>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '500' }}>
              {totalElements} total expenses
            </div>
          </div>

          {error && (
            <div style={{ 
              color: 'var(--error-600)', 
              background: 'var(--error-50)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <DollarSign size={48} />
              </div>
              <h3 className="empty-state-title">No expenses found</h3>
              <p className="empty-state-description">
                Start tracking your expenses by adding your first entry
              </p>
              <button
                onClick={() => navigate('/add-expense')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={18} />
                Add Your First Expense
              </button>
            </div>
          ) : (
            <>
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td className="expense-description">{expense.description}</td>
                      <td className="expense-amount">${expense.amount.toLocaleString()}</td>
                      <td>
                        <span 
                          className="category-badge"
                          style={getBadgeStyle(expense.category?.name || 'Uncategorized')}
                        >
                          {expense.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="expense-date">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => navigate(`/edit-expense/${expense.id}`)}
                            className="action-btn edit-btn"
                            title="Edit expense"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedId(expense.id);
                              setShowConfirm(true);
                            }}
                            className="action-btn delete-btn"
                            title="Delete expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {currentPage + 1} of {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="pagination-btn"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this expense?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
