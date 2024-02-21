
var apiUrl = ''; // define the api Url in the HTML
var apiRootUrl = ''; // define the api Url in the HTML
var queryResults = []; // store the data to be used by the sort
var addOptions = true;
var pageSize = 12;
var currentPage = 1;


fetch('mask_config.json')
.then(response => response.json())
.then(config => {
  wwwBaseLoc = config.wwwBaseLoc;
  apiRootUrl = config.apiRootUrl;
  console.log('api root', apiRootUrl);
  queryApi();
})
.catch(error => console.error('Error loading config:', error));


function StandardMaskTable(data) {

  const tableBody = document.getElementById('BasicMaskRenderer');
  const headerRow = document.getElementById('headerRow');

  tableBody.innerHTML = '';
  headerRow.innerHTML = '';

  // Display pagination controls
  displayPagination(data.length);

  // Display table header
  if (data.length > 0) {
    Object.keys(data[0]).forEach((key, columnIndex) => {
      const cell = document.createElement('th');
      cell.className = 'tab';
      cell.textContent = key.replace(/-/g, ' ');
      cell.onclick = () => sortTable(columnIndex); // Set click event for sorting
      const sortIcon = document.createElement('span');
      sortIcon.className = 'sort-icon';
      sortIcon.innerHTML = '&uarr;&darr;';
      cell.appendChild(sortIcon);
      headerRow.appendChild(cell);
    });
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  // Display table rows for current page
  for (let i = startIndex; i < endIndex; i++) {
    const rowData = data[i];
    const row = document.createElement('tr');

    Object.values(rowData).forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });

    // Add dropdown for options to each row
    if (addOptions) {
      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'dropdown';
      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'dropdown-content';
      const options = ['Plot', 'Details', 'Fits File'];
      const options_urls = [
        // plotUrl + '?blue-id=' + rowData['Blue-ID'],
        wwwBaseLoc + 'MaskPlot.html?design-id=' + rowData['Design-ID'],
        wwwBaseLoc + 'MaskDetails.html?design-id=' + rowData['Design-ID'],
        'Fits File'
      ];
      options.forEach((option, index) => {
        const optionLink = document.createElement('a');
        optionLink.textContent = option;
        optionLink.href = options_urls[index];
        dropdownContent.appendChild(optionLink);
      });
      dropdownContainer.appendChild(dropdownContent);
      row.appendChild(dropdownContainer);

      // Show dropdown near cursor when hovering over the row or dropdown
      row.addEventListener('mouseover', function (event) {
        const dropdown = this.querySelector('.dropdown');
        if (dropdown && !dropdown.contains(event.relatedTarget)) { // Check if the cursor is not on the dropdown content
          dropdown.style.display = 'block';
          dropdown.style.left = event.clientX + 'px';
          dropdown.style.top = event.clientY + 'px';
        }
      });

      // Hide dropdown when mouse leaves the row
      row.addEventListener('mouseleave', function () {
        const dropdown = this.querySelector('.dropdown');
        if (dropdown) {
          dropdown.style.display = 'none';
        }
      });
    }

    tableBody.appendChild(row);
  }
}

function displayPagination(totalRows) {
  const totalPages = Math.ceil(totalRows / pageSize);
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';

  // Add "Previous" button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      searchTable();
    }
  };
  paginationContainer.appendChild(prevButton);

  // Add current page number
  const currentPageSpan = document.createElement('span');
  currentPageSpan.textContent = 'Page ' + currentPage + '/' + totalPages;
  paginationContainer.appendChild(currentPageSpan);

  // Add "Next" button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      searchTable(); // Update search results when navigating pages
    }
  };
  paginationContainer.appendChild(nextButton);
}

function queryApi() {
  console.log('root api ', apiRootUrl + apiUrl)
  fetch(apiRootUrl + apiUrl, {
    mode: 'cors',
    credentials: 'include' // cookies
  })
  .then(response => response.json())
  .then(data => {
    queryResults = data.data; // Store the original data
    StandardMaskTable(queryResults); // Display the data in the table
  })
  .catch(error => console.error('Error accessing data:', error));
}

function searchTable() {
  var input, filter, tr, td, i, j, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  
  var filteredData = queryResults.filter(row => {
    for (const value of Object.values(row)) {
      if (String(value).toUpperCase().includes(filter)) {
        return true; 
      }
    }
    return false; 
  });

  StandardMaskTable(filteredData);
}

function sortTable(columnIndex) {
  const table = document.getElementById("BasicMaskTable");
  const rows = Array.from(table.rows).slice(1);

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();

    return cellA.localeCompare(cellB);
  });

  if (table.classList.contains("sorted")) {
    rows.reverse();
    table.classList.remove("sorted");
  } else {
    table.classList.add("sorted");
  }

  for (let row of rows) {
    table.tBodies[0].appendChild(row);
  }
}
