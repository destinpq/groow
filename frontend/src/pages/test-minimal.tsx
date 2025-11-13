import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '50px', fontSize: '24px', color: 'red' }}>
      <h1>TEST PAGE - If you see this, React is working!</h1>
      <p>Date: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestPage;
