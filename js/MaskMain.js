
export function addAdminButton() {
  let apiRootUrl;

  fetch('MaskConfig.json')
  .then(response => response.json())
  .then(config => {
    apiRootUrl = config.apiRootUrl;
    console.log('api root', apiRootUrl);
    queryApi();
  })
  .catch(error => console.error('Error loading config file:', error));

  function queryApi() {
    if (!apiRootUrl) return;

    const apiUrl = apiRootUrl + `/slitmask/user-type`;

    fetch(apiUrl, {
      mode: 'cors',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(info => {
      console.log('user', info.data['user_type']);
      const userType = info.data['user_type'];

      if (userType === "maskadmin") {
        const adminSearchButton = document.getElementById('adminSearchButton');
        if (adminSearchButton) {
          adminSearchButton.style.display = 'block';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching Admin Status:', error);
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
  .catch(error => console.error('Error loading content:', error));
}


