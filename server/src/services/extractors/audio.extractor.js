const axios = require("axios");
const FormData = require("form-data");

const extract = async (file) => {

  const formData = new FormData();

  formData.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });



  const response = await axios.post(
    "http://127.0.0.1:8000/transcribe",
    formData,
    {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    }
  );



  const text = response.data.text || "";
  return {
    extractedText: text,
    wordCount: text ? text.split(/\s+/).length : 0,
  };

};

module.exports = {
  extract,
};