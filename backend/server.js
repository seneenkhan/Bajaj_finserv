const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const isValidFile = (file) => {
  if (!file) return { valid: false, mimeType: null, sizeKb: 0 };
  
  try {
    const buffer = Buffer.from(file, 'base64');
    const fileSizeKb = Math.round(buffer.length / 1024);
    
    // Simple MIME type check (you might want to implement a more robust check)
    const mimeType = buffer[0] === 0xff && buffer[1] === 0xd8 ? "image/jpeg" : 
                     buffer[0] === 0x89 && buffer[1] === 0x50 ? "image/png" : 
                     "application/octet-stream";
    
    return { valid: true, mimeType, sizeKb: fileSizeKb };
  } catch (error) {
    console.error('Error processing file:', error);
    return { valid: false, mimeType: null, sizeKb: 0 };
  }
};

app.post('/bfhl', (req, res) => {
  try {
    const { data, file_b64 } = req.body;
    
    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: "Invalid data format" });
    }

    const user_id = "seneen.k";
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    
    const highestLowercase = alphabets
      .filter(item => item === item.toLowerCase())
      .sort((a, b) => b.localeCompare(a))[0];
    
    const { valid, mimeType, sizeKb } = isValidFile(file_b64);
    
    res.json({
      is_success: true,
      user_id: user_id,
      email: "khan.seneen333@gmail.com",
      roll_number: "RA2111003011482",
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      file_valid: valid,
      file_mime_type: mimeType,
      file_size_kb: sizeKb
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ is_success: false, error: "Internal server error" });
  }
});

app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});