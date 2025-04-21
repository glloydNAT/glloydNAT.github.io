/* 
Digital Mera: Population Change in the Rio Grande Glaze-paint Area
Garrett Lloyd, Gavin Schorr, Benno Lee
*/

const regionShapesArray = [], sitesShapesArray = [];

const regions =[
    ["1_Piro.zip","#fff5eb"],
    ["1a_Piro.zip","#fff5eb"],
    ["2_Tompiro.zip","#fee6ce"],
    ["3_Jumano.zip","#fdd0a2"],
    ["3a_Jumano.zip","#fdd0a2"],
    ["4_WestTiwa.zip","#fdae6b"],
    ["4a_WestTiwa.zip","#fdae6b"],
    ["5_EastTiwa.zip","#fd8d3c"],
    ["6_Keres.zip","#f16913"],
    ["7_TanoTowa.zip","#d94801"],
    ["7a_TanoTowa.zip","#d94801"],
    ["8_NorthTiwa.zip","#8c2d04"]
]

//define the map
var mymap = L.map('mapId',{
    
    fullscreenControl: {
        pseudoFullscreen: true // if true, fullscreen to page width and height
    }
}).setView([35.08539970090307, -106.62437969380134], 7.5);


async function getShapeGeojson(zipfile, colorCode) {
    //get the shapefiles
    try {
        const gj = await shp("data/regionShapes/" + zipfile);
        
        // define the regional shape (outline) style
        var thisStyle={
            "color": colorCode,
            "weight":2,
            "opacity": 0.5
        }
      
        // add the shape
        L.geoJSON(gj['features'][0], {
            style: thisStyle
        }).addTo(mymap);

        return 0;
    } catch (error) {
        console.log(error.message);
        return 1;
    }
}

async function getSiteGeojson(zipfile, period) {
    var marker;
    try {
        //get the shapefile
        const gj = await shp("data/siteShapes/" + zipfile);

        // process per-period features in shapefile 
        gj["features"].forEach(feature => {
            if (feature['properties']['Periods'].includes(period)) {
                var lat = parseFloat(feature['geometry']['coordinates'][1]);
                var long = parseFloat(feature['geometry']['coordinates'][0]);
                marker = L.marker([lat, long]);
                marker.addTo(mymap);
                marker.bindPopup("Site Number: " + feature['properties']['SiteNo']);
            }
        });
        return 0;
    } catch (error) {
        console.log(error.message);
        return 1;
    }
}

// function called by the timeline slider changing
changeMapFunction = async function ({ label, value, map }) {    

    // removes previous layers 
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // add the sites per period    
    switch (value){
        case "1":
            getSiteGeojson("04_West-Tiwa-all.zip","1")
            break;
        case "2":
            getSiteGeojson("04_West-Tiwa-all.zip","2")
            break;
        case "3":
            getSiteGeojson("04_West-Tiwa-all.zip","3")
            break;    
        case "4":
            getSiteGeojson("04_West-Tiwa-all.zip","4")
            break;
        case "5":
            getSiteGeojson("04_West-Tiwa-all.zip","5")
            break;
        } 
}

// MAIN ROUTINE BEGINS HERE

// add the region shapes
for (let i=0;i < regions.length;i++){
    regionShapesArray[i] = getShapeGeojson(regions[i][0],regions[i][1]);
}

// make sure regionShapeArrays are all present.
if (regionShapesArray.includes(1)) {
    console.log("error in regionShapes array");
} else {
    console.log("all good in arrays");
}

// define our timeline slider
// https://github.com/svitkin/leaflet-timeline-slider/
L.control.timelineSlider({
    timelineItems: ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5"],
    initializeChange: true,
    changeMap: changeMapFunction
}).addTo(mymap);



// TODO: basemap changer

// define our default basemap
var osm = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});


// add the OpenStreetMap tile layer (i.e. the variable osm above) to the map
osm.addTo(mymap);


