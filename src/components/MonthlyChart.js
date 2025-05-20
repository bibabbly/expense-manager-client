import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6610f2', '#fd7e14'];

const MonthlyChart = ({ expenses }) => {
  const totals = {};

  expenses.forEach(exp => {
    const date = new Date(exp.dateTime);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!totals[key]) totals[key] = 0;
    totals[key] += exp.amount;
  });

  const chartData = Object.entries(totals).map(([month, total]) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(year, parseInt(monthNum) - 1);
    const formatted = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g. "May 2025"
    return { month: formatted, total };
  });

  return (
    <div style={{
      margin: '2rem 0',
      padding: '1rem',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>📊 Monthly Expense Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString()} RWF`} />
          <Bar dataKey="total">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
