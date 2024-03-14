
async function loadSideBar() {
  try {
    const configResponse = await fetch('MaskConfig.json');
    const configInfo = await configResponse.json();

    genLinks(configInfo)
  } catch (error) {
    console.error('Failed to load sidebar:', error);
  }
}

function genLinks(config) {
  const sidebarLinksContainer = document.getElementById('sidebarLinks');
  const sidebarLinks = config.sidebarLinks;

  sidebarLinks.forEach(section => {
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = section.title;
    sidebarLinksContainer.appendChild(sectionTitle);

    const sectionList = document.createElement('ul');
    section.links.forEach(link => {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.textContent = link.text;
      anchor.href = link.url;
      anchor.target = "_blank"; // Open link in a new tab
      listItem.appendChild(anchor);
      sectionList.appendChild(listItem);
    });

    sidebarLinksContainer.appendChild(sectionList);
  });
}

// adds the common sidebar
window.addEventListener('DOMContentLoaded', loadSideBar);