import React from 'react';

function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';
  
  // Format the amount uniquely for INR
  const formattedAmount = transaction.amount.toLocaleString('en-IN');
  
  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <h4>{transaction.category}</h4>
        <p>{transaction.date}</p>
      </div>
      <div className={`transaction-amount ${isIncome ? 'positive' : 'negative'}`}>
        {isIncome ? '+' : '-'}₹{formattedAmount}
      </div>
    </div>
  );
}

export default TransactionItem;
