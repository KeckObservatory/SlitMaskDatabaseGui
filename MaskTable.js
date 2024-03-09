
// set variables that can be updated elsewhere
var queryResults = [];
var addOptions = true;
var pageSize = 10;
var currentPage = 1;


function displayTable(apiUrl) {
  fetch('MaskConfig.json')
  .then(response => response.json())
  .then(config => {
    const wwwBaseLoc = config.wwwBaseLoc;
    const apiRootUrl = config.apiRootUrl;
    queryApi(apiUrl, apiRootUrl, wwwBaseLoc);
  })
  .catch(error => console.error('Error loading config:', error));
}

export { displayTable };


function queryApi(apiUrl, apiRootUrl, wwwBaseLoc) {
  console.log('root api ', apiRootUrl + apiUrl)
  fetch(apiRootUrl + apiUrl, {
    mode: 'cors',
    credentials: 'include' // cookies
  })
  .then(response => response.json())
  .then(data => {
    queryResults = data.data;
    StandardMaskTable(queryResults, wwwBaseLoc);
  })
  .catch(error => console.error('Error accessing data:', error));
}

// allow searchTable to be used in the MaskMain once loaded via tables
window.searchTable = function() {
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

  // Reset pagination to page 1 (to display the results)
  currentPage = 1;
}

function StandardMaskTable(data, wwwBaseLoc) {

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
      cell.onclick = () => sortTable(columnIndex);
      const sortIcon = document.createElement('span');
      sortIcon.className = 'sort-icon';
      sortIcon.innerHTML = '&uarr;&darr;';
      cell.appendChild(sortIcon);
      headerRow.appendChild(cell);
    });
  } else {
    console.log('no results')
    // If data is empty, display "No Results" message
    const noResultsRow = document.createElement('tr');
    const noResultsCell = document.createElement('td');
    noResultsCell.textContent = 'No Results';
    noResultsRow.appendChild(noResultsCell);
    tableBody.appendChild(noResultsRow);
    return;
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

      // determine if desid or bluid should be used and which syntax
      const designId = (rowData['Design-ID'] ? rowData['Design-ID'] : rowData['desid'] ? rowData['desid'] : '')
      const blueId = (rowData['Blue-ID'] ? rowData['Blue-ID'] : rowData['bluid'] ? rowData['bluid'] : '')
      let blueParam = '';
      if (blueId === '') {
        blueParam = 'design-id=' + designId;
      } else {
        blueParam = 'blue-id=' + blueId;
      }

      const options_urls = [
        wwwBaseLoc + 'MaskPlot.html?' + blueParam,
        wwwBaseLoc + 'MaskDetails.html?design-id=' + designId,
        'Fits File'
      ];
      options.forEach((option, index) => {
        const optionLink = document.createElement('a');
        optionLink.textContent = option;
        optionLink.href = options_urls[index];
        optionLink.target = "_blank";
        dropdownContent.appendChild(optionLink);
      });
      dropdownContainer.appendChild(dropdownContent);
      row.appendChild(dropdownContainer);

      // Show dropdown near cursor when hovering over the row or dropdown
      row.addEventListener('mouseover', function (event) {
        const dropdown = this.querySelector('.dropdown');
        if (dropdown && !dropdown.contains(event.relatedTarget)) {
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
  let totalPages = Math.ceil(totalRows / pageSize);
  if (isNaN(totalPages)) {
    totalPages = 0;
  }

  const paginationContainer = document.getElementById('paginationContainer');

  if (totalPages > 1) {
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
        searchTable();
      }
    };
    paginationContainer.appendChild(nextButton);

    paginationContainer.style.display = 'block'; // Ensure pagination container is visible
  } else {
    // Hide pagination container if there are no pages to display
    paginationContainer.style.display = 'none';
  }
}


function sortTable(columnIndex) {

  const key = Object.keys(queryResults[0])[columnIndex];

  // ascending or descending
  if (queryResults.sortKey === key && !queryResults.sortDesc) {
    queryResults.sort((a, b) => (a[key] > b[key]) ? -1 : ((a[key] < b[key]) ? 1 : 0));
    queryResults.sortDesc = true;
  } else {
    queryResults.sort((a, b) => (a[key] < b[key]) ? -1 : ((a[key] > b[key]) ? 1 : 0));
    queryResults.sortDesc = false;
    queryResults.sortKey = key;
  }

  // Reset to the first page
  currentPage = 1;

  // Re-render the table with sorted results
  StandardMaskTable(queryResults);
}

