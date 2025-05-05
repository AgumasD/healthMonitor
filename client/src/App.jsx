import React, { useState } from 'react';
import './App.css';

function App() {
  const [features, setFeatures] = useState({
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: '',
    feature5: '' // Add the missing feature
  });
  const [prediction, setPrediction] = useState(null);
  const [category, setCategory] = useState(''); // Add a state for the category

  const handleChange = (e) => {
    setFeatures({
      ...features,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature1: parseFloat(features.feature1),
          feature2: parseFloat(features.feature2),
          feature3: parseFloat(features.feature3),
          feature4: parseFloat(features.feature4),
          feature5: parseFloat(features.feature5), // Include feature5
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);

      // Categorize the prediction
      if (data.prediction === 0) {
        setCategory('The Patient Condition is Low');
      } else if (data.prediction === 1) {
        setCategory('The Patient Condition is Medium');
      } else if (data.prediction === 2) {
        setCategory('The Patient Condition is High');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching the prediction.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>Real-Time Health Monitor</h2>
      <form onSubmit={handleSubmit}>
        {['feature1', 'feature2', 'feature3', 'feature4', 'feature5'].map((feature) => (
          <div key={feature} style={{ marginBottom: '1rem' }}>
            <label>{feature}: </label>
            <input
              type="number"
              name={feature}
              value={features[feature]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>

      {prediction !== null && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Prediction Result:</h3>
          <p><strong>{prediction} ({category})</strong></p>
        </div>
      )}
    </div>
  );
}

export default App;
