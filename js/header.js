
// main function to load all the header elements
async function loadHeader() {
  try {
    const configResponse = await fetch('MaskConfig.json');
    const configInfo = await configResponse.json();

    const page_name_div = document.getElementById('pageName');
    const page_name = page_name_div.textContent;
    const userinfo = await checkLogin(configInfo);

    const headerResponse = await fetch('header.html');
    const html = await headerResponse.text();

    const headerContainer = document.getElementById('headerContainer');
    headerContainer.innerHTML = html;

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

    // add the title of the page
    const header_title = headerContainer.querySelector('#headerTitle');
    if (header_title) {
      header_title.innerHTML = page_name;
    }

    // add the username
    const user_name = headerContainer.querySelector('#userName');
    if (user_name) {
      user_name.innerHTML = userinfo.Title + " " + userinfo.FirstName + " " + userinfo.LastName + " ";

      // Add dots indicate the menu button
      const optionsDotSpan = document.createElement('span');
      optionsDotSpan.textContent = '...';
      optionsDotSpan.classList.add('options-dots');  // for styling
      user_name.appendChild(optionsDotSpan);
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

    console.log()

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

  // create the dropdown container for the username
  const dropdownContainer = document.createElement('div');
  dropdownContainer.classList.add('dropdown-container');

  // create the username label
  const userNameLabel = document.createElement('span');
  userNameLabel.setAttribute('id', 'userName');
  userNameLabel.textContent = 'UNDEFINED USER';
  dropdownContainer.appendChild(userNameLabel);

  // create the dropdown content
  const dropdownContent = document.createElement('div');
  dropdownContent.classList.add('dropdown-content');

  buttonLinks.forEach(link => {
    const newLink = document.createElement('a');
    newLink.textContent = link.name;
    newLink.setAttribute('href', link.url);
    dropdownContent.appendChild(newLink);
  });

  // append the dropdown content to the dropdown container
  dropdownContainer.appendChild(dropdownContent);

  // append the dropdown container to the button links table
  infoDropdown.appendChild(dropdownContainer);

  // add event listener to toggle dropdown content
  userNameLabel.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
  });

}


function imgLink(config) {

  // add the home page link to the keck image banner
  const keckLogoLink = config.wwwBaseLoc + '/MaskMain.html';
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

// add the common header
window.addEventListener('DOMContentLoaded', loadHeader);




