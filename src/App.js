import React from 'react';
import './App.css';
import CropRecommendationForm from './components/cropRecommendForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Agricultural Crop Recommendation System</h1>
      </header>
      <main>
        <CropRecommendationForm />
      </main>
      <footer>
        <p>Footer content goes here.</p>
      </footer>
    </div>
  );
}

export default App;
