// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(meta => meta.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        // Append a new <h6> tag for each key-value pair
        panel.append("h6").text(`${key}: ${value}`);
      });
    } else {
      panel.append("h6").text("No metadata found for this sample.");
    }
  }).catch(error => {
    console.error("Error fetching metadata: ", error);
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
        opacity: 0.6
      }
    };
    
    const bubbleData = [bubbleTrace];

    const bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      hovermode: 'closest'
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);

    // Build a Bar Chart
    const barTrace = {
      x: sample_values.slice(0, 10).reverse(), // Slice and reverse the input data
      y: yticks.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h' // Horizontal bar chart
    };

    const barData = [barTrace];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  }).catch(error => {
    console.error("Error fetching the samples data: ", error);
  });
}
  
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach(sample => {
      dropdown.append("option").text(sample).property("value", sample);
    });
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }).catch(error => {
    console.error("Error fetching the samples data: ", error);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
