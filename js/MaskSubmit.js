

// add the listener to the submit button in MaskSubmit.html
document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submitMaskBtn');
  submitBtn.addEventListener('click', submitMask);
});


async function submitMask() {
  try {
  // Fetch the API root URL from MaskConfig.json
  const configResponse = await fetch('MaskConfig.json');
  const configInfo = await configResponse.json();
  const apiRootUrl = configInfo.apiRootUrl;

  // Retrieve the form and the file input
  const form = document.getElementById('maskSubmitForm');
  const fileInput = form.querySelector('input[type="file"]');

  // Check if a file is selected
  if (fileInput.files.length === 0) {
  alert("Please select a file.");
  return false;
}

  // Get the first selected file
  const file = fileInput.files[0];

  // Prepare form data
  const formData = new FormData();
  formData.append('maskFile', file);

  // Send a POST request to the API endpoint
  const apiUrl = apiRootUrl + '/slitmask/upload-mdf';
  const response = await fetch(apiUrl, {
  method: 'POST',
  body: formData,
  credentials: 'include'
});

  // Check if the response is OK
  if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || 'Error uploading file.');
}

  // Parse response data into text
  const responseData = await response.text();
  console.log('Response from server:', responseData);

  // Alert response data
  alert(responseData);

  // Redirect to home page
  window.location.href = 'index.html';
} catch (error) {

  // Log error message and display alert
  console.error('Error:', error);
  alert(error.message);
}
}


// Expose the submitMask function globally
// window.submitMask = submitMask;