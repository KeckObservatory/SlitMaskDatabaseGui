
async function loadSideBar() {
  try {
    const configResponse = await fetch('MaskConfig.json');
    const configInfo = await configResponse.json();

    const sidebarHtml = await fetch('sidebar.html');
    const html = await sidebarHtml.text();

    const sidebarContainer = document.getElementById('sidedrawer');
    sidebarContainer.innerHTML = html;

    genLinks(configInfo)

  } catch (error) {
    console.error('Failed to load sidebar:', error);
  }
}

function genLinks(config) {
  const sidebarLinksElem = document.getElementById('sidebarLinks');
  const sidebarLinks = config.sidebarLinks;

  sidebarLinks.forEach(section => {

    // Create section title
    const sectionTitle = document.createElement('strong');
    sectionTitle.textContent = section.title;
    const sectionList = document.createElement('ul');

    // Create list item for each link
    section.links.forEach(link => {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.textContent = link.text;
      anchor.href = link.url;
      // open in new tab
      anchor.target = "_blank";
      // for css
      anchor.classList.add("sidebar-link");
      listItem.appendChild(anchor);
      sectionList.appendChild(listItem);
    });

    // Create section container
    const sectionContainer = document.createElement('div');
    sectionContainer.classList.add('mui--no-user-select');

    // Append section title and list to section container
    sectionContainer.appendChild(sectionTitle);
    sectionContainer.appendChild(sectionList);

    // Append section container to sidebar container
    sidebarLinksElem.appendChild(sectionContainer);
  });
}


// adds the common sidebar
window.addEventListener('DOMContentLoaded', loadSideBar);