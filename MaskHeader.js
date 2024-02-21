
async function checkLogin() {
  try {
    const response = await fetch('mask_config.json');
    const config = await response.json();
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
      links_table.innerHTML = genLinksMenu();
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


function genLinksMenu() {
  fetch('mask_config.json')
  .then(response => response.json())
  .then(config => {

    // add the slitmask home page link to the keck logo
    const keckLogoLink = config.wwwBaseLoc + '/MaskMain.html';
    const logoLink = document.getElementById('logoLink');
    logoLink.setAttribute('href', keckLogoLink);

    const links = config.header_links;
    const cols = links.map(link => {
      return `<td nowrap bgcolor=#FFFFAA height=30><font color=black size=2>
                &nbsp&nbsp<a href="${link.url}">${link.name}</a>&nbsp&nbsp</font>
              </td>`;
    });
    const linksTable = document.getElementById('linksTable');
    if (linksTable) {
      linksTable.innerHTML = cols.join('');
    }
  })
  .catch(error => console.error('Error loading config:', error));
}

// adds the common header
window.addEventListener('DOMContentLoaded', loadHeader);




