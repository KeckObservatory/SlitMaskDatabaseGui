
async function submitMask() {
  try {
  // Fetch the API root URL from MaskConfig.json
  const configResponse = await fetch('js/MaskConfig.json');
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

  // TODO this seems like the location to submit more than one
  // Get the first selected file
  const file = fileInput.files[0];

  // Prepare form data
  const formData = new FormData();
  formData.append('mask-file', file);

  // Send a POST request to the API endpoint
  const apiUrl = apiRootUrl + '/upload-mdf';
  const response = await fetch(apiUrl, {
  method: 'POST',
  body: formData,
  credentials: 'include'
  });

  // Check the response status
  if (response.status === 401) {
    // Handle 401 Unauthorized
    alert('Unauthorized access, redirecting to login page.');
    const currentUrl = window.location.href;
    const loginUrl = `/login?url=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
    return;
  }

  // Check if the response is OK
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      if (response.status === 413 && errorData.error && errorData.error.includes('Payload Too Large')) {
        throw new Error('File size too large!');
      } else {
        throw new Error(errorData.error || 'Error uploading file.');
      }
    } else {
      // Read the response body as text
      const errorText = await response.text();
      throw new Error(errorText || 'Error uploading file.');
    }
  } else {

    // Parse response data into text
    const responseData = await response.json();

    // Alert response data
    var alertMsg = stripQuotes(JSON.stringify(responseData.data.msg));

    if (responseData.data.warning) {
      alertMsg += "\n\nWARNING:";
      responseData.data.warning.forEach(function(item) {
        alertMsg += "\n• " + stripQuotes(JSON.stringify(item));
      });
    }

    alert(alertMsg);

    // Redirect to home page
    window.location.href = 'index.html';
  }
} catch (error) {

  // Log error message and display alert
  console.error('Error:', error);

  alert(error.message);
}
}

function stripQuotes(str) {
  return str.replace(/^"(.*)"$/, '$1');
}
