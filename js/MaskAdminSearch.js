import { displayTable } from './MaskTable.js';

function adminSearch() {
  const optionsList = [
    {label: 'Email', name: 'email'},
    {label: 'Design (Blue) Name', name: 'name'},
    {label: 'GUI Name', name: 'guiname'},
    {label: 'Blue ID', name: 'bluid', array: true},
    {label: 'Design ID', name: 'desid', array: true},
    {label: 'Mill Sequence', name: 'millseq', array: true},
    {label: 'Barcode', name: 'barcode', array: true},
    {label: 'Milled', name: 'milled'},
    {label: 'Number of days', name: 'caldays'},
  ];

  const optionsDropdown = document.getElementById('optionsDropdown');

  // Populate the dropdown with options from optionsList
  optionsList.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.name;
    optionElement.textContent = option.label;
    optionsDropdown.appendChild(optionElement);
  });

  const helpText = document.getElementById('helpText');

  // Event listener for dropdown change
  optionsDropdown.addEventListener('change', function() {
    const selectedName = optionsDropdown.value;
    const selectedOption = optionsList.find(option => option.name === selectedName);
    let showBox = false;

    if (selectedOption) {
      switch (selectedOption.name) {
        // Blue ID / Design ID / Mill Seq. / Barcode Searches
        case 'bluid':
        case 'desid':
        case 'millseq':
        case 'barcode':
          helpText.textContent = 'One value = exact match, two IDs = range, >2 = list of masks.  ' +
            'It can be space or comma separated.';
          showBox = true;
          break;
        case 'milled':
          helpText.textContent = 'Milled - options are yes or no. The default is yes';
          showBox = true;
          break;
        case 'name':
          helpText.textContent = 'Search be the Design Name or Blue Name.';
          showBox = true;
          break;
        case 'caldays':
          helpText.textContent = 'Search for the Date Use within X days or today.';
          showBox = true;
          break;
        default:
          helpText.textContent = '';
          showBox = false;
          break;
      }
    } else {
      showBox = false;
      helpText.textContent = '';
    }
    // Show or hide the help box
    if (showBox) {
      helpText.classList.add('show');
    } else {
      helpText.classList.remove('show');
    }
  });



  // load all results on page load
  submitForm();

  // Add event listener for Enter key press on searchInput field
  document.getElementById('searchInputForm').addEventListener('keypress', function (event) {
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
    const searchValue = document.getElementById('searchInputForm').value.trim();

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

    let options = ['Edit Use Date', 'Archive', 'ReMill', 'Plot', 'Details', 'Fits File', 'Mill File'];

    displayTable(fullUrl, options);

  }

};

export { adminSearch };
