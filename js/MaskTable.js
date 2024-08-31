
// set variables that can be updated in html or elsewhere
let queryResults = [];
let addOptions = true;
let pageSize = 10;
let currentPage = 1;
let options = [];

function setMenuOff() {
  addOptions = false;
}

export { setMenuOff };

function displayTable(apiUrl, new_options = ['Plot', 'Details', 'Fits File']) {
  options = new_options
  fetch('js/MaskConfig.json')
  .then(response => response.json())
  .then(config => {
    const apiRootUrl = config.apiRootUrl;
    getTableInfo(apiUrl, apiRootUrl);
  })
  .catch(error => {
      alert(`Error reading configuration: ${error}`);
  });
}

export { displayTable };


function getTableInfo(apiUrl, apiRootUrl) {
  fetch(apiRootUrl + apiUrl, {
    mode: 'cors',
    credentials: 'include' // cookies
  })
  .then(response => response.json())
  .then(data => {
    queryResults = data.data;
    StandardMaskTable(queryResults);
  })
  .catch(error => {
    alert(`Error accessing data, check Slitmask Database API at ${apiRootUrl}${apiUrl}`);
  });
}


// allow enter in the search field the same as clicking the search button
document.getElementById("searchInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchTable();
  }
});


// expose search to the MaskHome once loaded via tables
window.searchTable = function() {
  currentPage = 1;
  renderTable();
}

function renderTable() {
  let input, filter, tr, td, i, j, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();

  let filteredData = queryResults.filter(row => {
    for (const value of Object.values(row)) {
      if (String(value).toUpperCase().includes(filter)) {
        return true;
      }
    }
    return false;
  });
  StandardMaskTable(filteredData);
}

function StandardMaskTable(data) {
  const tableBody = document.getElementById('GeneratedMaskTable');
  const headerRow = document.getElementById('headerRow');

  tableBody.innerHTML = '';
  headerRow.innerHTML = '';

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
    // If data is empty, display "No Results" message
    const noResultsRow = document.createElement('tr');
    const noResultsCell = document.createElement('td');
    noResultsCell.textContent = 'No Results';
    noResultsRow.appendChild(noResultsCell);
    tableBody.appendChild(noResultsRow);

    // Hide any left-behind pagination buttons
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.style.display = 'none';

    return;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  // Display table rows for the current page
  for (let i = startIndex; i < endIndex; i++) {
    const rowData = data[i];
    const row = document.createElement('tr');

    // flags to determine special row colors
    let archiveRow = false;
    let warnRow = false;

    // Object.values(rowData).forEach(value => {
    Object.entries(rowData).forEach(([key, value]) => {
      const cell = document.createElement('td');
      cell.textContent = value;

      // Check if the mask has status archived
      if (value && value.toString() === 'ARCHIVED') {
        archiveRow = true;
      } else if (key === 'Days-Notice' && parseInt(value, 10) < 35) {
        warnRow = true;
      }

      row.appendChild(cell);
    });

    if (archiveRow) {
      row.classList.add('archive-row');
    } else if (warnRow) {
      row.classList.add('warning-row');
    }

    // Add hover menu of options
    if (addOptions) {
      // Create the menu for each row
      const menu = document.createElement('div');
      menu.classList.add('menu');
      addMenuItems(menu, rowData);
      document.body.appendChild(menu); // Append menu to body to get accurate cursor position

      // Show menu on row hover
      row.addEventListener('mouseenter', function (event) {
        const x = event.clientX;
        const y = event.clientY;
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = x + 10; // Add an offset to the right of the cursor
        let top = y;

        // Adjust position to fit within window bounds
        if (left + menuWidth > windowWidth) {
          left = windowWidth - menuWidth;
        }
        if (top + menuHeight > windowHeight) {
          top = windowHeight - menuHeight;
        }

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';

        menu.style.display = 'block';

        if (archiveRow) {
          row.classList.add('highlighted-archive-row');
        } else if (warnRow) {
          row.classList.add('highlighted-warning-row');
        } else {
          row.classList.add('highlighted-row');
        }
      });

      // Hide menu on row exit or when mouse leaves the menu
      row.addEventListener('mouseleave', function (event) {
        if (!menu.contains(event.relatedTarget)) {
          menu.style.display = 'none';
        }
        if (archiveRow) {
          row.classList.remove('highlighted-archive-row');
        } else if (warnRow) {
          row.classList.remove('highlighted-warning-row');
        } else {
          row.classList.remove('highlighted-row');
        }
      });

      // Hide menu when mouse leaves the menu
      menu.addEventListener('mouseenter', function (event) {
        row.classList.add('highlighted-row');
      });

      // Hide menu when mouse leaves the menu
      menu.addEventListener('mouseleave', function (event) {
        if (!row.contains(event.relatedTarget)) {
          menu.style.display = 'none';
          row.classList.remove('highlighted-row');
        }
      });
    }

    tableBody.appendChild(row);
  }

  // Display pagination controls
  displayPagination(data.length);
}


function addMenuItems(menu, rowData) {
  options.forEach(option => {
    const optionLink = document.createElement('a');
    optionLink.textContent = option;
    optionLink.classList.add('menu-item');

    const blueId = rowData['Blue-ID'] ? 'blue-id=' + rowData['Blue-ID']
                  : rowData['bluid'] ? 'blue-id=' + rowData['bluid'] : null;
    const designId = rowData['Design-ID'] ? 'design-id=' + rowData['Design-ID']
                    : rowData['desid'] ? 'design-id=' + rowData['desid'] : null;

    const blueDesignOrBoth = (blueId ? blueId : '') + (designId ? (blueId ? '&' : '') + designId : '') || 'undefined';

    let optionUrl = '';
    if (option === 'Plot') {
      optionUrl = 'index.html?url=MaskPlot.html&' + blueDesignOrBoth;
    } else if (option === 'Details') {
      optionUrl = 'index.html?url=MaskDetails.html&' + designId;
    } else if (option === 'Fits File') {
      optionUrl = 'index.html?url=MaskFitsFile.html&' + blueDesignOrBoth;
    } else if (option === 'Edit Use Date') {
      optionUrl = 'index.html?url=MaskUseDate.html&' + designId;
    } else if (option === 'Archive') {
      optionUrl = 'index.html?url=MaskArchive.html&' + blueDesignOrBoth;
    } else if (option === 'ReMill') {
      optionUrl = 'index.html?url=MaskRemill.html&' + blueDesignOrBoth;
    } else if (option === 'Mill File') {
      optionUrl = 'index.html?url=MaskMillFile.html&' + blueDesignOrBoth;
    } else if (option === 'Delete Barcode') {
      optionUrl = 'index.html?url=MaskDelete.html&' + blueDesignOrBoth;
    }
    optionLink.href = optionUrl;
    menu.appendChild(optionLink);
  });
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
        renderTable();
      }
    };
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(document.createTextNode(' '));

    // Add current page number
    const currentPageSpan = document.createElement('span');
    currentPageSpan.textContent = 'Page ' + currentPage + '/' + totalPages;
    paginationContainer.appendChild(currentPageSpan);
    paginationContainer.appendChild(document.createTextNode(' '));

    // Add "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        // searchTable();
        renderTable();
      }
    };
    paginationContainer.appendChild(nextButton);

    paginationContainer.style.display = 'block';
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

// Update the page size based on the user's input
function updatePageSize() {
  const pageSizeInput = document.getElementById('pageSizeInput');
  const newPageSize = parseInt(pageSizeInput.value, 10);

  if (newPageSize > 0) {
    pageSize = newPageSize;
    // reset to the first page
    currentPage = 1;
    // re-render the table
    renderTable();
  } else {
    alert('Page size must be greater than 0');
  }
}

// Attach this function to window so it's accessible from HTML
window.updatePageSize = updatePageSize;
