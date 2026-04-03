import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';

const initialTransactions = [
  { id: 1, date: '2023-08-10', amount: 40000, category: 'Salary', type: 'income' },
  { id: 2, date: '2023-08-22', amount: 3000, category: 'Groceries', type: 'expense' },
  { id: 3, date: '2023-09-05', amount: 1500, category: 'Utilities', type: 'expense' },
  { id: 4, date: '2023-09-15', amount: 40000, category: 'Salary', type: 'income' },
  { id: 5, date: '2023-09-20', amount: 2500, category: 'Dining Out', type: 'expense' },
  { id: 6, date: '2023-10-02', amount: 40000, category: 'Salary', type: 'income' },
  { id: 7, date: '2023-10-10', amount: 5000, category: 'Shopping', type: 'expense' },
  { id: 8, date: '2023-10-15', amount: 1200, category: 'Groceries', type: 'expense' },
];

function Home() {
  const [role, setRole] = useState('Viewer');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', or 'expense'

  // Calculate totals for the summary cards
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;

  // Filter transactions based on search and dropdown
  const filteredTransactions = transactions.filter((tx) => {
    // Check search query (search by category)
    const matchesSearch = tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check type filter
    const matchesType = filterType === 'all' || tx.type === filterType;

    return matchesSearch && matchesType;
  });

  // Insights logic
  let highestExpenseCategory = 'None';
  let highestExpenseAmount = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense' && tx.amount > highestExpenseAmount) {
      highestExpenseAmount = tx.amount;
      highestExpenseCategory = tx.category;
    }
  });

  // Category-based Visualization data
  const categorySpending = {};
  filteredTransactions.forEach((tx) => {
    if (tx.type === 'expense') {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    }
  });
  
  // Find maximum amount out of categories to scale bars visually
  let maxCategoryAmount = 0;
  Object.values(categorySpending).forEach(amt => {
    if(amt > maxCategoryAmount) maxCategoryAmount = amt;
  });

  // Time-based (Monthly) Visualization data
  const monthlySpending = {};
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      // Group by year-month
      const monthPrefix = tx.date.substring(0, 7); 
      monthlySpending[monthPrefix] = (monthlySpending[monthPrefix] || 0) + tx.amount;
    }
  });

  let maxMonthlyAmount = 0;
  Object.values(monthlySpending).forEach(amt => {
    if(amt > maxMonthlyAmount) maxMonthlyAmount = amt;
  });

  return (
    <div className="app-container">
      <Navbar currentRole={role} onRoleChange={(newRole) => setRole(newRole)} />

      <div className="summary-container">
        <Card title="Total Balance" amount={totalBalance} type="balance" />
        <Card title="Total Income" amount={totalIncome} type="income" />
        <Card title="Total Expenses" amount={totalExpenses} type="expense" />
      </div>

      <div className="charts-container">
        {/* Category Visualization */}
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <div className="simple-bar-chart">
            {Object.keys(categorySpending).length > 0 ? (
              Object.keys(categorySpending).map((cat) => {
                const amount = categorySpending[cat];
                const widthPercent = (amount / maxCategoryAmount) * 100;
                return (
                  <div className="bar-row" key={cat}>
                    <span className="bar-label">{cat}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${widthPercent}%` }}></div>
                    </div>
                    <span className="bar-value">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                );
              })
            ) : (
              <p className="empty-chart">No matching expenses found.</p>
            )}
          </div>
        </div>

        {/* Time-based Visualization */}
        <div className="chart-card">
          <h3>Monthly Spending Trend</h3>
          <div className="simple-column-chart">
            {Object.keys(monthlySpending).sort().map((month) => {
              const amount = monthlySpending[month];
              const heightPercent = maxMonthlyAmount > 0 ? (amount / maxMonthlyAmount) * 100 : 0;
              return (
                <div className="column-bar-wrapper" key={month}>
                  <div className="column-bar-value">₹{amount.toLocaleString('en-IN')}</div>
                  <div className="column-bar-track">
                    <div className="column-bar-fill" style={{ height: `${heightPercent}%` }}></div>
                  </div>
                  <div className="column-bar-label">{month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          
          <div className="controls">
            <input 
              type="text" 
              className="search-input"
              placeholder="Search by category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Data</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          <div className="transaction-list">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))
            ) : (
              <div className="empty-state">No matching data found.</div>
            )}
          </div>
        </div>

        <div className="insights-section">
          <h2>Quick Insights</h2>
          
          <div className="insight-details">
            <p>
              <span>Highest Expense:</span> <br />
              <strong>{highestExpenseCategory}</strong> (₹{highestExpenseAmount.toLocaleString('en-IN')})
            </p>
            <p>
              <span>Total Transactions:</span> <br />
              <strong>{transactions.length}</strong>
            </p>
            <p>
              <span>Average Expense:</span> <br />
              <strong>₹{Math.round(totalExpenses / (transactions.filter(t => t.type === 'expense').length || 1)).toLocaleString('en-IN')}</strong>
            </p>
          </div>

          {/* Role-based button */}
          {role === 'Admin' && (
            <div className="admin-actions">
              <button 
                className="add-btn" 
                onClick={() => alert("Add transaction logic goes here!")}
              >
                + Add Transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;