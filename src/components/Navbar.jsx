import React from 'react';

function Navbar({ currentRole, onRoleChange }) {
  return (
    <nav className="navbar">
      <h1>Finance Dashboard</h1>
      <div className="role-selector">
        <label htmlFor="role">View as: </label>
        <select 
          id="role" 
          value={currentRole} 
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
    </nav>
  );
}

export default Navbar;