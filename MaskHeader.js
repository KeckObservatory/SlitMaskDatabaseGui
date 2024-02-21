var wwwRootUrl = '';

fetch('mask_config.json')
.then(response => response.json())
.then(config => {
  wwwRootUrl = config.wwwRootUrl;
})
.catch(error => console.error('Error loading config:', error));

async function getApiData(url) {
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


// Header functions
async function checkLogin() {
  const url = wwwRootUrl + '/userinfo/';
  const userinfo = await getApiData(url);
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
