
// main function to load all the header elements
async function loadHeader() {
  try {
    const configResponse = await fetch('mask_config.json');
    const configInfo = await configResponse.json();

    const page_name_div = document.getElementById('pageName');
    const page_name = page_name_div.textContent;
    const userinfo = await checkLogin(configInfo);

    const headerResponse = await fetch('header.html');
    const html = await headerResponse.text();

    const headerContainer = document.getElementById('headerContainer');
    headerContainer.innerHTML = html;

    // Add links menu
    const linksTable = document.getElementById('linksTable');
    if (linksTable) {
      genLinksMenu(configInfo); // Call genLinksMenu here
    }

    const buttonLinksTable = document.getElementById('buttonLinksTable');
    if (buttonLinksTable) {
      addButtons(configInfo.buttonLinks);
    }
    // add the name of the page to the header
    const header_name = headerContainer.querySelector('#headerName');
    if (header_name) {
      header_name.innerHTML = page_name;
    }

    // add the title of the page
    const header_title = headerContainer.querySelector('#headerTitle');
    if (header_title) {
      header_title.innerHTML = page_name;
    }

    // add the username
    const user_name = headerContainer.querySelector('#userName');
    if (user_name) {
      user_name.innerHTML = userinfo.Title + " " + userinfo.FirstName + " " + userinfo.LastName;
    }
  } catch (error) {
    console.error('Failed to load header:', error);
  }
}


// confirm the user is logged in and add the button links
async function checkLogin(config) {
  try {
    const wwwRootUrl = config.wwwRootUrl;

    const url = wwwRootUrl + '/userinfo/';
    const userinfo = await getApiData(url);

    // redirect if not logged in
    let currentURL = window.location.href;
    if (!userinfo.hasOwnProperty('Id')) {
      window.location.href = wwwRootUrl + '/login/?url=' + currentURL;
    }
    return userinfo;

  } catch (error) {
    console.error('Error loading config:', error);
  }
}

function addButtons(buttonLinks) {
  const buttonLinksTable = document.getElementById('buttonLinksTable');
  const row = document.createElement('tr'); // Create a table row

  // add the name cell
  const userNameCell = document.createElement('td');
  const userNameSpan = document.createElement('span');
  userNameSpan.setAttribute('id', 'userName');
  userNameSpan.textContent = 'UNDEFINED USER';
  userNameCell.appendChild(userNameSpan);
  row.appendChild(userNameCell);

  // add a cell for each button
  buttonLinks.forEach(link => {
    const cell = document.createElement('td');
    const form = document.createElement('form');
    const input = document.createElement('input');

    input.setAttribute('class', 'buttonWhite');
    input.setAttribute('type', 'submit');
    input.setAttribute('value', link.name);
    form.setAttribute('action', link.url);
    form.appendChild(input);
    cell.appendChild(form); // Append the form to the cell
    row.appendChild(cell); // Append the cell to the row
  });

  // Create a table cell for alignment
  const alignRightCell = document.createElement('td');
  alignRightCell.setAttribute('align', 'right');
  alignRightCell.appendChild(row); // Append the row to the alignment cell

  // Append the alignment cell to the table
  buttonLinksTable.appendChild(alignRightCell);
}

function genLinksMenu(config) {
  // add the slitmask home page link to the keck star banner
  const keckLogoLink = config.wwwBaseLoc + '/MaskMain.html';
  const logoLink = document.getElementById('logoLink');
  logoLink.setAttribute('href', keckLogoLink);

  // add the links menu that is in the image
  const links = config.headerLinks;
  const linksTable = document.getElementById('linksTable');

  links.forEach(link => {
    const cell = document.createElement('td');
    cell.setAttribute('nowrap', 'true');
    cell.setAttribute('bgcolor', '#FFFFAA');
    cell.setAttribute('height', '17');

    const font = document.createElement('font');
    font.setAttribute('color', 'black');
    font.setAttribute('size', '2');

    const anchor = document.createElement('a');
    anchor.setAttribute('href', link.url);
    anchor.textContent = link.name;

    font.appendChild(document.createTextNode('\u00A0\u00A0'));
    font.appendChild(anchor);
    font.appendChild(document.createTextNode('\u00A0\u00A0')); 

    cell.appendChild(font);
    linksTable.appendChild(cell);
  });
}




async function getApiData(url) {
  const options = {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include'
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return data;

  } catch (error) {
    console.error('Error fetching data:', error);

    return {};
  }
}


// adds the common header
window.addEventListener('DOMContentLoaded', loadHeader);




