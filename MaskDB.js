
var wwwRootUrl = ''; // Define wwwRootUrl globally

fetch('mask_config.json')
.then(response => response.json())
.then(config => {
  wwwRootUrl = config.wwwRootUrl;
})
.catch(error => console.error('Error loading config:', error));


async function get_api_data(url) {
  const options = {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include'
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    Object.keys(data).forEach(function(key) {
      console.log(key + ": " + data[key]);
    });

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {};
  }
}

async function slitmask_table() {
  const table_body = document.getElementById('SlitMaskRender');

  // this is temporary until API call to get data
  const url = wwwRootUrl + '/userinfo/';
  let table_data = await get_api_data(url);

  if (typeof table_data === 'object') {
    table_data = [table_data]
  }

  // set up fake data
  const fake_row = {'FirstName': 'Other', 'LastName': 'Entry',
    'Email': 'undefined@undef', 'Id': 555};

  table_data.push(fake_row);

  // Generate table rows based on the fetched data
  const rows = table_data.map(item => {
    return `<tr>
              <td class="SlitMaskClass">${item.FirstName}</td>
              <td class="SlitMaskClass">${item.LastName}</td>
              <td class="SlitMaskClass">${item.Email}</td>
              <td class="SlitMaskClass">${item.Id}</td>
            </tr>`;
  });

  // Append the rows to the table body
  table_body.innerHTML = rows.join('');
}

function uploadFile() {
  const fileInput = document.getElementById('fileLoad');
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    // upload the file
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/file-upload-endpoint', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        // File upload successful
        console.log('File uploaded successfully.');
      } else {
        // File upload failed
        console.error('File upload failed.');
      }
    };
    xhr.send(formData);
  }
}


function sortTable(columnIndex) {
  const table = document.getElementById(tableId);
  const rows = Array.from(table.rows).slice(1); // Exclude the table header row

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();

    return cellA.localeCompare(cellB);
  });

  if (table.classList.contains("sorted")) {
    rows.reverse(); // Reverse the order if already sorted
    table.classList.remove("sorted");
  } else {
    table.classList.add("sorted");
  }

  // Reattach the sorted rows to the table
  for (let row of rows) {
    table.tBodies[0].appendChild(row);
  }
}


// Header functions
async function checkLogin() {
  const url = wwwRootUrl + '/userinfo/';
  const userinfo = await get_api_data(url);
  console.log("user" + userinfo + userinfo.FirstName);

  let currentURL = window.location.href;
  currentURL = currentURL.replace(/^https?:\/\//, 'http://');

  if (!userinfo.hasOwnProperty('LastName')) {
    window.location.href = wwwRootUrl + '/login/?url=' + currentURL;
  }

  return userinfo
}

async function loadHeader() {
  const page_name_div = document.getElementById('pageName');
  const page_name = page_name_div.textContent;
  const userinfo = await checkLogin();

  fetch('header.html')
  .then(response => response.text())
  .then(html => {
    const headerContainer = document.getElementById('headerContainer');
    headerContainer.innerHTML = html;

    // add the links
    var links_table = headerContainer.querySelector('#linksTable');
    if (links_table) {
      links_table.innerHTML = gen_links_menu();
    }

    // add the name of the page to the header
    var header_name = headerContainer.querySelector('#headerName');
    if (header_name) {
      header_name.innerHTML = page_name;
    }

    // add the title of the page
    var header_title = headerContainer.querySelector('#headerTitle');
    if (header_title) {
      header_title.innerHTML = page_name;
    }

    // add the username
    var user_name = headerContainer.querySelector('#userName');
    if (user_name) {
      user_name.innerHTML = userinfo.Title + " " + userinfo.FirstName + " " + userinfo.LastName;
    }

  })
  .catch(error => {
    console.error('Failed to load header:', error);
  });
}

function gen_links_menu() {
  const link_list = [
    ["Keck Home", "http://keckobservatory.org/"],
    ["Instruments", "http://www2.keck.hawaii.edu/inst/index.php"],
    ["Schedule", "http://www2.keck.hawaii.edu/observing/keckChedule/keckSchedule/index.php"],
    ["Observing", "http://keckobservatory.org/observing"],
  ];

  const cols = link_list.map((element) => {
    let link = "<td nowrap bgcolor=#FFFFAA height=10><font color=black size=2>" +
      "&nbsp&nbsp<a href=" + element[1] + ">" + element[0] + "</a>&nbsp&nbsp</font></td>";
    return link;
  });

  return cols
}
// End Header functions

// adds the common header
window.addEventListener('DOMContentLoaded', loadHeader);

// run on-load functions

// async function display_svg(url) {
//   try {
//     console.log("Fetching:");
//     const response = await fetch(url);
//     const svgContent = await response.text();
//
//     const svgContainer = document.getElementById("svg-container");
//     svgContainer.innerHTML = svgContent;
//   } catch (error) {
//     console.error("Error fetching SVG:", error);
//   }
// }

// Call the function with the URL of the SVG file
// const svgUrl = "./file.svg";
// display_svg(svgUrl);

// const svgElement = document.getElementById("my-svg");
// let scale = 1;
//
// function handleWheel(event) {
//   event.preventDefault();
//
//   // Check if the scroll direction is positive or negative
//   const scrollDirection = event.deltaY > 0 ? -1 : 1;
//
//   // Adjust the scale based on the scroll direction
//   scale += 0.1 * scrollDirection;
//
//   updateTransform();
// }

// function updateTransform() {
//   svgElement.style.transform = `scale(${scale})`;
// }
//
// // Attach the wheel event listener to the SVG element
// svgElement.addEventListener("wheel", handleWheel);
//
// // adds the common header
// window.addEventListener('DOMContentLoaded', loadHeader);

// const svgIframe = document.getElementById("my-svg");
// let scale = 1;
//
// function handleWheel(event) {
//   event.preventDefault();
//
//   // Check if the scroll direction is positive or negative
//   const scrollDirection = event.deltaY > 0 ? -1 : 1;
//
//   // Adjust the scale based on the scroll direction
//   scale += 0.1 * scrollDirection;
//
//   updateTransform();
// }
//
// function updateTransform() {
//   svgIframe.style.transform = `scale(${scale})`;
// }

// Attach the wheel event listener to the SVG iframe
// svgIframe.addEventListener("wheel", handleWheel);






