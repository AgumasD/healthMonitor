import React, { useState } from 'react';
import './App.css';

function App() {
  const [features, setFeatures] = useState({
    ecg: '',
    bloodPressure: '',
    temperature: '',
    respiratoryRate: '',
    eeg: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [category, setCategory] = useState('');

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
          feature5: parseFloat(features.eeg),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);

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
    <div style={styles.container}>
      <h2 style={styles.header}>Real-Time Health Monitor</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { name: 'ecg', label: 'ECG' },
          { name: 'bloodPressure', label: 'Blood Pressure' },
          { name: 'temperature', label: 'Temperature' },
          { name: 'respiratoryRate', label: 'Respiratory Rate' },
          { name: 'eeg', label: 'EEG' }
        ].map((feature) => (
          <div key={feature.name} style={styles.inputGroup}>
            <label style={styles.label}>{feature.label}: </label>
            <input
              type="number"
              name={feature.name}
              value={features[feature.name]}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        ))}
        <button type="submit" style={styles.button}>Predict</button>
      </form>

      {prediction !== null && (
        <div style={styles.result}>
          <h3 style={styles.resultHeader}>Prediction Result:</h3>
          <p style={styles.resultText}>
            <strong>{prediction} ({category})</strong>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  result: {
    marginTop: '2rem',
    textAlign: 'center',
    backgroundColor: '#e9ecef',
    padding: '1rem',
    borderRadius: '8px',
  },
  resultHeader: {
    color: '#333',
  },
  resultText: {
    fontSize: '1.2rem',
    color: '#007BFF',
  },
};

export default App;
