import React from 'react';

function Card({ title, amount, type }) {
  // Determine if it should be green or red based on type
  let colorClass = '';
  if (type === 'income') {
    colorClass = 'positive';
  } else if (type === 'expense') {
    colorClass = 'negative';
  }

  // Formatting amount natively as Indian Rupees
  const formattedAmount = amount.toLocaleString('en-IN');

  return (
    <div className="card">
      <h3>{title}</h3>
      <p className={colorClass}>₹{formattedAmount}</p>
    </div>
  );
}

export default Card;