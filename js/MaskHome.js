
export function addAdminButton() {
  let apiRootUrl;

  fetch('js/MaskConfig.json')
  .then(response => response.json())
  .then(config => {
    apiRootUrl = config.apiRootUrl;
    queryApi();
  })
  .catch(error => {
      alert(`Error reading configuration: ${error}`);
  });

  function queryApi() {
    if (!apiRootUrl) return;
    const apiUrl = apiRootUrl + `/user-type`;

    fetch(apiUrl, {
      mode: 'cors',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(info => {
      const userType = info.data['user_type'];

      if (userType === "maskadmin") {
        const adminSearchButton = document.getElementById('adminSearchButton');
        if (adminSearchButton) {
          adminSearchButton.style.display = 'block';
        }
        const timelineButton = document.getElementById('timelineButton');
        if (timelineButton) {
          timelineButton.style.display = 'block';
        }
        const recentBarButton = document.getElementById('recentBarButton');
        if (recentBarButton) {
          recentBarButton.style.display = 'block';
        }
      }
    })
    .catch(error => {
        console.log(`Error fetching Admin Status: ${error}`);
      });
    }
}

export function loadContent(url) {
  fetch(url)
  .then(response => response.text())
    .then(data => {
      const mainContent = document.getElementById('content');
      mainContent.innerHTML = data;

      // Find and execute scripts within the loaded content
      const scripts = mainContent.querySelectorAll('script[type="module"]');
      scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.type = 'module';
      newScript.text = script.text;
      document.body.appendChild(newScript);
    });
  })
  .catch(error => {
    alert(`Error loading content: ${error}`);
  });

}


