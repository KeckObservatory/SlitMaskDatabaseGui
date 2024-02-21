function submitMask() {
  // Prevent the default form submission
  event.preventDefault();

  // Get the file input element
  const fileInput = document.querySelector('input[type="file"]');

  // Check if a file is selected
  if (fileInput.files.length === 0) {
    alert("Please select a file.");
    return false;
  }

  // Get the first file selected by the user
  const file = fileInput.files[0];

  // Prepare form data to send
  const formData = new FormData();
  formData.append('maskFile', file);

  // Set up the API URL
  const apiUrl = 'https://vm-appserver.keck.hawaii.edu/slitmask/upload-mdf';

  // Send the file to the server using Fetch API
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
    // Handle the response data here
    console.log('File uploaded successfully:', data);

    // Submit the form programmatically
    document.querySelector('form').submit();
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error.message);
  });

  return false;
}
