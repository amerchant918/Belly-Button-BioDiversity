function getPlots(id) {
    //Read samples.json
        d3.json("samples.json").then (sampledata =>{
            console.log(sampledata)
            var ids = sampledata.samples[0].otu_ids;
            console.log(ids)
            var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
            console.log(sampleValues)
            var labels =  sampledata.samples[0].otu_labels.slice(0,10);
            console.log (labels)
        // get only top 10 otu ids for the plot OTU and reversing it. 
            var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
        // get the otu id's to the desired form for the plot
            var OTU_id = OTU_top.map(d => "OTU " + d);
            console.log(`OTU IDS: ${OTU_id}`)
         // get the top 10 labels for the plot
            var labels =  sampledata.samples[0].otu_labels.slice(0,10);
            console.log(`OTU_labels: ${labels}`)
            var trace = {
                x: sampleValues,
                y: OTU_id,
                text: labels,
                marker: {
                color: 'blue'},
                type:"bar",
                orientation: "h",
            };
            // create data variable
            var data = [trace];
            // create layout variable to set plots layout
            var layout = {
                title: "Top 10 OTU",
                yaxis:{
                    tickmode:"linear",
                },
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 30
                }
            };
            // create the bar plot
        Plotly.newPlot("bar", data, layout);
            // The bubble chart
            var trace1 = {
                x: sampledata.samples[0].otu_ids,
                y: sampledata.samples[0].sample_values,
                mode: "markers",
                marker: {
                    size: sampledata.samples[0].sample_values,
                    color: sampledata.samples[0].otu_ids
                },
                text:  sampledata.samples[0].otu_labels
            };
            // set the layout for the bubble plot
            var layout_2 = {
                xaxis:{title: "OTU ID"},
                height: 600,
                width: 1000
            };
            // creating data variable 
            var data1 = [trace1];
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_2); 
        });
    }  
// Function for Gauge Visual
function buildGague(sample) {

    d3.json("samples.json").then((data) => {
        // Extract sample data
        var samples = data.metadata;
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = sampleArray[0];

        // Gague labels, I put them in the wrong order so calling reverse method to flip em
        gagueVales = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '']
        gagueVales.reverse()
        // How much hand washing result data, since we're using half a pie chart
        // need to multiply by 20 to equal 180
        var level = result.wfreq * 20;
        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        // Path: may have to change to create a better triangle

        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';

        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        var data = [{
                type: 'scatter',
                x: [0],
                y: [0],
                marker: {
                    size: 14,
                    color: '850000'
                },

                showlegend: false,
                name: 'speed',
                text: level
            },
            {
                values: [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
                rotation: 90,
                text: gagueVales,
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: [
                        "rgba(255,255,255,0.5)",
                        "rgba(0, 158,0,1.0)",
                        "rgba(0, 148,0,0.8)",
                        "rgba(0, 138,0,0.6))",
                        "rgba(160,198,70,0.8)",
                        "rgba(180, 202, 82,.8)",
                        "rgba(182, 219, 105,.5)",
                        "rgba(190, 246, 145,.5)",
                        "rgba(195, 256,105,.5)",
                        "rgba(220, 370, 125,.5)"
                    ]
                },
                hoverinfo: 'text',
                hole: .5,
                type: 'pie',
                showlegend: false,
                title: {
                    text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                    position: 'top center'
                }
            }
        ];
        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            height: 500,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            autosize: true,
            margin: {
                l: 20,
                r: 100,
                b: 0,
                t: 0,
                pad: 4
            }
        };
        // Render the plot to the div tag with id "gauge"
        Plotly.newPlot("gauge", data, layout, {
            displayModeBar: false
			});
    })
}


    // create the function to get the necessary data
    function getDemoInfo(id) {
    // read the json file to get data
        d3.json("samples.json").then((data)=> {
    // get the metadata info for the demographic panel
            var metadata = data.metadata;
            console.log(metadata)
          // filter meta data info by id
           var result = metadata.filter(meta => meta.id.toString() === id)[0];
          // select demographic panel to put data
           var demographicInfo = d3.select("#sample-metadata");
         // empty the demographic info panel each time before getting new id info
           demographicInfo.html("");
         // grab the necessary demographic data data for the id and append the info to the panel
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
        });
    }
    // create the function for the change event
    function optionChanged(id) {
        getPlots(id);
        buildGague(id);
        getDemoInfo(id);
    }
    // create the function for the initial data rendering
    function init() {
        // select dropdown menu 
        var dropdown = d3.select("#selDataset");
        // read the data 
        d3.json("samples.json").then((data)=> {
            console.log(data)
            // get the id data to the dropdwown menu
            data.names.forEach(function(name) {
                dropdown.append("option").text(name).property("value");
            });
            // call the functions to display the data and the plots to the page
            getPlots(data.names[0]);
            getDemoInfo(data.names[0]);
        });
    }
    init();
    buildGague('940');