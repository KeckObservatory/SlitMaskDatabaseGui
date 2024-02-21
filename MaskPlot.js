function getPlot(designID) {
  const apiUrl = 'https://vm-appserver.keck.hawaii.edu/slitmask/mask-plot?design-id=' + designID;

  fetch(apiUrl, {
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to get Plot file from the API');
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


