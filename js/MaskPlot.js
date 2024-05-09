function getPlot(blueIdStr) {
  return new Promise((resolve, reject) => {
    fetch('MaskConfig.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load configuration file');
      }
      return response.json();
    })
    .then(config => {
      console.log('here1');
      const apiRootUrl = config.apiRootUrl;
      const apiUrl = `${apiRootUrl}/mask-plot?${blueIdStr}`;

      return fetch(apiUrl, {
        mode: 'cors',
        credentials: 'include'
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to get plot file');
      }
      return response.text();
    })
    .then(svgContent => {
      const svgPlot = document.getElementById("svgPlot");
      svgPlot.innerHTML = svgContent;
      // svgPlot.setAttribute('src', svgContent);

      readSvgJs(svgContent);
      resolve();
      initSVG();
      initializeSvgPanZoom(svgPlot);

    })
    .catch(error => {
      console.error('Error:', error);
      reject(error);
    });
  });
}

function initSVG() {
  var svgPlot = document.getElementById('svgPlot');
  svgPlot.addEventListener('load', function() {
    var svgDoc = svgPlot.contentDocument || svgPlot.getSVGDocument();
    gnuplot_svg.Init({ target: svgDoc });

    // Access the root SVG element
    var svgRoot = svgDoc.documentElement;

    // Add event listener for click directly to the SVG document
    svgRoot.addEventListener('click', function(evt) {
    });

    // Add event listener for wheel directly to the SVG document
    svgRoot.addEventListener('wheel', function(evt) {
      handleZoom(evt);
    });
  });
}


  // Function to handle zoom using mouse wheel
function handleZoom(evt) {
  // Prevent default zoom behavior
  evt.preventDefault();

  var svgPlot = document.getElementById('svgPlot');
  var svgDoc = svgPlot.contentDocument || svgPlot.getSVGDocument();
  var svgRoot = svgDoc.documentElement;

  var currentTransform = svgRoot.getAttribute('transform');
  var scale = currentTransform ? parseFloat(currentTransform.match(/scale\((.*?)\)/)[1]) : 1;

  // Calculate new scale value based on wheel delta (adjust the zoom speed here)
  var zoomFactor = evt.deltaY > 0 ? 1.1 : 0.9;
  var newScale = scale * zoomFactor;

  svgRoot.setAttribute('transform', 'scale(' + newScale + ')');
}

function readSvgJs(svgContent) {
  // Create a temporary div element to hold the SVG content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = svgContent;

  // Extract all script elements from the SVG content
  const scriptElements = tempDiv.getElementsByTagName('script');

  // Append each script element to the SVG container
  const svgContainer = document.getElementById('svgPlot');
  for (let i = 0; i < scriptElements.length; i++) {
    const scriptContent = scriptElements[i].textContent;
    const scriptElement = document.createElement('script');
    scriptElement.textContent = scriptContent;
    svgContainer.appendChild(scriptElement);
  }
}


// Function to initialize SVG pan and zoom
function initializeSvgPanZoom() {
  // Check if the library is loaded and svgPanZoom function is available
  if (typeof svgPanZoom === 'function') {
    // Your initialization code here
    var svgPlot = document.getElementById('svgPlot');
    svgPanZoom(svgPlot, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 10
    });
  } else {
    // Log an error if the function is not available
    console.error('Error: svgPanZoom function is not defined.');
  }
}

// Initialize zoom once svg fully load
window.onload = function() {

  var svgPlot = document.getElementById('svgPlot');
  var svgDoc = svgPlot.contentDocument;

  initializeSvgPanZoom(svgDoc);
};


function displayNoPlotMessage() {
  const svgPlot = document.getElementById("svgPlot");
  svgPlot.innerHTML = "<p>No plot found</p>";
}
