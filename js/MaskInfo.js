// functions to be used to display the info table with:
// Mask Design Id - Mask Blueprint Id - Mask Design Name - Current Use Date - Mask Status


function loadParams() {
  fetch('js/MaskConfig.json')
  .then(response => response.json())
  .then(config => {
    apiRootUrl = config.apiRootUrl;

    showId();
    showInfo();
  })
  .catch(error => {
    alert(`Error reading configuration: ${error}`);
  });
}

function showId() {
  const urlParams = new URLSearchParams(window.location.search);

  designId = urlParams.get('design-id');
  const designIdDiv = document.getElementById("design-id");
  designIdDiv.innerText = designId;

  blueId = urlParams.get('blue-id');
  const blueIdDiv = document.getElementById("blue-id");
  blueIdDiv.innerText = blueId;
}

function showInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const designId = urlParams.get('design-id');
  const blueIdId = document.getElementById("blue-id");
  const designNameId = document.getElementById("design-name-id");
  const useDateId = document.getElementById("use-date-id");
  const maskStatId = document.getElementById("mask-status-id");

  let fullUrl = `${apiRootUrl}/mask-detail?design-id=${designId}`;

  fetch(fullUrl, {
    mode: 'cors',
    credentials: 'include' // cookies
  })
  .then(response => {
      if (!response.ok) {
        // throw an error if the API did not return a 200 response
        return response.json().then(errData => {
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();  // Only parse JSON if the response is OK
  })
  .then(data => {

    // get the date-use and blue-id (if needed)
    const blueprintObject = data.data.find(item => item[0] === "Blueprint");
    if (blueprintObject) {
      const dateUse = new Date(blueprintObject[1][0].date_use);
      const year = dateUse.getFullYear();
      const month = String(dateUse.getMonth() + 1).padStart(2, '0');
      const day = String(dateUse.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      useDateId.innerText = formattedDate;
      if (blueId === null) {
        blueId = blueprintObject[1][0].bluid
        blueIdId.innerText = blueId;
      }
      maskStatId.innerText = blueprintObject[1][0].status
    } else {
      console.log("Blueprint not found in the data.");
    }

    // get the design name
    const maskDesign = data.data.find(item => item[0] === "Mask Design");
    if (maskDesign) {
      const designName = maskDesign[1][0]["Design-Name"];
      designNameId.innerText = designName;
    } else {
      console.log("Mask Design not found in the data.");
    }
  })
  .catch(error => {
    alert(`Issue accessing data: ${error}`);
  });
}

function reloadPage() {
  window.location.reload(); // Reload the page
  window.removeEventListener('focus', reloadPage); // Remove the event listener to prevent multiple reloads
}

function showLoadingIndicator() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.disabled = true;
  }
}

// Function to hide loading indicator and show download button
function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.style.display = 'block';
  }
}

function getNewUseDate() {
  var selectedDate = document.getElementById('new-use-date-id').value;

  // make sure date is selected
  if (!selectedDate) {
    alert("Please select a date.");
    return null;
  }

  // Split the selected date string into components
  var dateComponents = selectedDate.split('-');

  var selectedDateTime = new Date(selectedDate);
  var today = new Date();

  // check if the selected date is in the future
  if (selectedDateTime <= today) {
    alert("Please select a future date after today.");
    return null;
  }

  // format into a date string
  var month = parseInt(dateComponents[0], 10);
  var day = parseInt(dateComponents[1], 10);
  var year = parseInt(dateComponents[2], 10);
  var formattedDate = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + '-' + year;

  return formattedDate
}
