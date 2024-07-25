import { displayTable } from './MaskTable.js';

function adminSearch() {
  const optionsList = [
    {label: 'Email:', name: 'email'},
    {label: 'Design Name:', name: 'name'},
    {label: 'Project Name:', name: 'guiname'},
    {label: 'Blue ID', name: 'bluid', array: true},
    {label: 'Design ID', name: 'desid', array: true},
    {label: 'Mill Sequence', name: 'millseq'},
    {label: 'Barcode', name: 'barcode', array: true},
    {label: 'Milled', name: 'milled'},
    {label: 'Calibration days', name: 'caldays'},
  ];

  const optionsDropdown = document.getElementById('optionsDropdown');

  // Populate the dropdown with options from optionsList
  optionsList.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.name;
    optionElement.textContent = option.label;
    optionsDropdown.appendChild(optionElement);
  });


  // load all results on page load
  submitForm();

  // Add event listener for Enter key press on searchInput field
  document.getElementById('searchInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitForm();
    }
  });

  // submit button
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    submitForm();
  });

  // Function to handle form submission
  function submitForm() {
    const optionName = optionsDropdown.value;
    const searchValue = document.getElementById('searchInput').value.trim();

    // Construct the search query based on the selected option and input value
    let searchQuery = {};

    // Handle array options
    if (optionsList.find(option => option.name === optionName && option.array)) {
      const arrayValues = searchValue.split(/[;, ]+/).map(val => val.trim());
      searchQuery[optionName] = arrayValues;
    } else {
      // Handle dropdown options
      if (optionsList.find(option => option.name === optionName && option.dropdown)) {
        if (searchValue === 'yes' || searchValue === 'no') {
          searchQuery[optionName] = searchValue;
        }
      } else {
        // Handle other options
        searchQuery[optionName] = searchValue;
      }
    }

    // Results:
    const apiUrl = `/admin-search`;
    const queryString = `search-options=${encodeURIComponent(JSON.stringify(searchQuery))}`;
    const fullUrl = `${apiUrl}?${queryString}`;

    let options = ['Edit Use Date', 'Forget', 'ReMill', 'Plot', 'Details', 'Fits File', 'Mill File'];

    displayTable(fullUrl, options);

  }

};

export { adminSearch };
