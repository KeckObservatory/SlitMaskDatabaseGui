
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
        console.log('here', adminSearchButton);
        if (adminSearchButton) {
          adminSearchButton.style.display = 'block';
          console.log('update', adminSearchButton);
        }
      }
    })
    .catch(error => {
      console.error('Error fetching Admin Status:', error);
    });
  }
}

