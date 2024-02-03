import React from 'react';
import './App.css';
import HeaderContent from './components/header';
import CustomEditor from './components/editor';
import SaveButton from './components/button';

function App() {
  return (
    <>
      <HeaderContent />
      <CustomEditor />
    </>
  );
}

export default App;
