import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // New state for error handling

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);  // Ensure input is valid JSON
      const response = await axios.post('http://localhost:3000/bfhl', parsedInput);  // Replace with your backend URL
      setResponseData(response.data);
      setErrorMessage(''); // Clear any error messages if the request is successful
    } catch (error) {
      // Handle both JSON parsing errors and network errors
      if (error.response) {
        // The server responded with a status other than 2xx
        setErrorMessage(`Server Error: ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage('No response from the server. Please check your backend.');
      } else {
        // Error in setting up the request or JSON parsing error
        setErrorMessage('Invalid JSON input or request error.');
      }
      console.error('Error:', error);
    }
  };

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;

    return (
      <div className="response-section">
        {selectedOptions.includes('Numbers') && <div>Numbers: {numbers.join(', ')}</div>}
        {selectedOptions.includes('Alphabets') && <div>Alphabets: {alphabets.join(', ')}</div>}
        {selectedOptions.includes('Highest Lowercase') && <div>Highest Lowercase Alphabet: {highest_lowercase_alphabet}</div>}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Input</h1>
      <div className="input-container">
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON like {"data": ["A", "b", "1"]}'
          className="json-input"
        />
        <button onClick={handleSubmit} className="submit-btn">Submit</button>

        <div className="circle-select">
          <label>
            <input
              type="checkbox"
              value="Numbers"
              onChange={() => handleSelect('Numbers')}
            />
            <span className="circle-label">Numbers</span>
          </label>
          <label>
            <input
              type="checkbox"
              value="Alphabets"
              onChange={() => handleSelect('Alphabets')}
            />
            <span className="circle-label">Alphabets</span>
          </label>
          <label>
            <input
              type="checkbox"
              value="Highest Lowercase"
              onChange={() => handleSelect('Highest Lowercase')}
            />
            <span className="circle-label">Highest Lowercase</span>
          </label>
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {renderResponse()}
    </div>
  );
}

export default App;
