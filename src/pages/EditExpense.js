import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { toast } from 'react-toastify';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');


  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

  
        const { amount, description, dateTime } = response.data;
        setAmount(amount);
        setDescription(description);
        setDate(dateTime.split('T')[0]);
        setCategory(category);

      } catch (err) {
        console.error('Failed to load expense:', err.response?.data || err.message);
        //alert('Session expired or invalid. Please log in again.');
        toast.error('Session expired or invalid. Please log in again.');
        navigate('/login');
      }
    };
  
    fetchExpense();
  }, [id, navigate]);
  

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedExpense = {
      amount,
      description,
      dateTime: `${date}T00:00:00`,
      category 
    };

    try {
        /*await axios.put(`http://localhost:8080/api/expenses/${id}`, updatedExpense, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        */
         await axios.put(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, updatedExpense, {
          headers: {
            Authorization: `Bearer ${token}`
                  }
          });


      
        alert('Expense updated successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error('Update failed:', err.response?.data || err.message);
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/login');
      }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <form onSubmit={handleUpdate} style={styles.form}>
          <h2 style={styles.title}>Edit Expense</h2>
  
          <div style={styles.field}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={styles.input}
            />
          </div>
  
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.input}
            />
          </div>
  
          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </select>
      </div>

  
          <button type="submit" style={styles.button}>Update Expense</button>
        </form>
      </div>
    </>
  );
  
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    background: '#f8f9fa',
    padding: '1rem'
  },
  form: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    color: '#333'
  },
  field: {
    marginBottom: '1.25rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};


export default EditExpense;
