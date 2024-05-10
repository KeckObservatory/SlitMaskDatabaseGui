


// main function to load all the header elements
async function loadHeader() {
  try {
    const configResponse = await fetch('MaskConfig.json');
    const configInfo = await configResponse.json();

    // todo want to move out of index.html
    // const appHtml = await fetch('appbar.html');
    // const html = await appHtml.text();

    // const headerContainer = document.getElementById('shared-header');
    // headerContainer.innerHTML = html;

    const headerContainer = document.getElementById('shared-header');

    // add the username and check login,  redirects if not logged in
    const userinfo = await checkLogin(configInfo);

    // add link inside keck image
    imgLink(configInfo);

    // username,  logout
    const infoDropdown = document.getElementById('infoDropdown');
    if (infoDropdown) {
      addInfoDropDown(configInfo.buttonLinks);
    }

    // add the name of the page to the header
    const header_name = headerContainer.querySelector('#headerName');
    if (header_name) {
      header_name.innerHTML = page_name;
    }

    // add the username
    const user_name = headerContainer.querySelector('#userName');
    if (user_name) {
      user_name.innerHTML = userinfo.FirstName + " " + userinfo.LastName + " ";
    }
  } catch (error) {
    console.error('Failed to load header:', error);
  }
}


// confirm the user is logged in
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


function addInfoDropDown(buttonLinks) {
  const infoDropdown = document.getElementById('infoDropdown');

  // Create the container for the username and dropdown button
  const container = document.createElement('div');
  container.classList.add('user-dropdown-container');

  // Create the username label
  const userNameLabel = document.createElement('span');
  userNameLabel.setAttribute('id', 'userName');
  userNameLabel.textContent = 'UNDEFINED USER';
  userNameLabel.style.marginLeft = '10px';

  // Create the dropdown container
  const dropdownContainer = document.createElement('div');
  dropdownContainer.appendChild(userNameLabel);

  dropdownContainer.classList.add('dropdown-container');

  // Create the button
  const dropdownButton = document.createElement('button');
  dropdownButton.classList.add('mui-btn', 'mui-btn--flat', 'data-mui-toggle="dropdown"');

  dropdownButton.setAttribute('data-mui-toggle', 'dropdown');

  // dropdownButton.textContent = '☰';
  const muiCaret = document.createElement('div');
  muiCaret.classList.add('mui-caret');

  // add carat and username
  dropdownButton.appendChild(muiCaret);
  dropdownButton.appendChild(userNameLabel);

  dropdownButton.style.backgroundColor = 'inherit';
  dropdownButton.style.color = '#fff';
  dropdownButton.style.fontSize = '14px';

  dropdownContainer.appendChild(dropdownButton);

  // Create the dropdown menu
  const dropdownMenu = document.createElement('ul');
  dropdownMenu.classList.add('mui-dropdown__menu');

  buttonLinks.forEach(link => {
    const listItem = document.createElement('li');
    const newLink = document.createElement('a');
    newLink.setAttribute('href', link.url);
    newLink.textContent = link.name;
    listItem.appendChild(newLink);
    dropdownMenu.appendChild(listItem);
  });

  // Append dropdown menu to dropdown container
  dropdownContainer.appendChild(dropdownMenu);

  // Append dropdown container to the container
  container.appendChild(dropdownContainer);

  // Append container to the infoDropdown element
  infoDropdown.appendChild(container);
}


function imgLink(config) {
  // add the home page link to the keck image banner
  const keckLogoLink = config.wwwBaseLoc + '/index.html';
  const logoLink = document.getElementById('logoLink');
  logoLink.setAttribute('href', keckLogoLink);
}


// used by get userinfo to check login
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

