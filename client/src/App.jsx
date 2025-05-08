import React, { useState } from 'react';
import './App.css';

function App() {
  const [features, setFeatures] = useState({
    ecg: '',
    bloodPressure: '',
    temperature: '',
    respiratoryRate: '',
    eeg: '' // Updated feature names
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
          feature1: parseFloat(features.ecg),
          feature2: parseFloat(features.bloodPressure),
          feature3: parseFloat(features.temperature),
          feature4: parseFloat(features.respiratoryRate),
          feature5: parseFloat(features.eeg), // Updated feature names
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
        {[
          { name: 'ecg', label: 'ECG' },
          { name: 'bloodPressure', label: 'Blood Pressure' },
          { name: 'temperature', label: 'Temperature' },
          { name: 'respiratoryRate', label: 'Respiratory Rate' },
          { name: 'eeg', label: 'EEG' }
        ].map((feature) => (
          <div key={feature.name} style={{ marginBottom: '1rem' }}>
            <label>{feature.label}: </label>
            <input
              type="number"
              name={feature.name}
              value={features[feature.name]}
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
