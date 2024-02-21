function getPlot(designID) {
  let apiRootUrl = ''
  fetch('mask_config.json')
  .then(config => {
    apiRootUrl = config.apiRootUrl;

  })
  .catch(error => console.error('Error loading config:', error));

  const apiUrl = apiRootUrl + "/slitmask/mask-plot?design-id=" + designID;

    fetch(apiUrl, {
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to get Plot file!');
    }
    return response.text();
  })
  .then(svgContent => {
    // Append the SVG content to the container
    const svgPlot = document.getElementById("svgPlot");
    svgPlot.innerHTML = svgContent;
  })
  .catch(error => {
    console.error('Error:', error);
    reject(error)
  });
}

function displayNoPlotMessage() {
  const svgPlot = document.getElementById("svgPlot");
  svgPlot.innerHTML = "<p>No plot found</p>";
}


