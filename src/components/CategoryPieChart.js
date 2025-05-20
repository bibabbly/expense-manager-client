import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6610f2', '#fd7e14'];

const CategoryPieChart = ({ expenses }) => {
  // Group total by category
  const totals = {};

  expenses.forEach(exp => {
    if (!totals[exp.category]) totals[exp.category] = 0;
    totals[exp.category] += exp.amount;
  });

  const data = Object.entries(totals).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div style={{
      margin: '2rem 0',
      padding: '1rem',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>🥧 Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toLocaleString()} RWF`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
