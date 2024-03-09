function submitMask() {
  let apiRootUrl = ''
  fetch('MaskConfig.json')
  .then(config => {
    apiRootUrl = config.apiRootUrl;

  })
  .catch(error => console.error('Error loading config:', error));

  event.preventDefault();
  const fileInput = document.querySelector('input[type="file"]');

  if (fileInput.files.length === 0) {
    alert("Please select a file.");
    return false;
  }

  // the input file
  const file = fileInput.files[0];

  // Prepare form data to send
  const formData = new FormData();
  formData.append('maskFile', file);
  const apiUrl = apiRootUrl + '/slitmask/upload-mdf';

  // Send the file to the API
  fetch(apiUrl, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      // If the response status is not OK, throw an error with the JSON response
      return response.json().then(jsonResponse => {
        throw new Error(jsonResponse.error ? (Array.isArray(jsonResponse.error) ? jsonResponse.error.join('\n') : jsonResponse.error) : 'Error uploading file.');
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('File uploaded successfully:', data);
    document.querySelector('form').submit();
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error.message);
  });

  return false;
}
