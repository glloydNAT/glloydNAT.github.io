/* 
Digital Mera: Population Change in the Rio Grande Glaze-paint Area
Garrett Lloyd, Gavin Schorr, Benno Lee
*/

const regionShapesArray = [], sitesShapesArray = [];

// define our regions
const regions =[
    ["1_Piro.zip","#8c510a"], //0
    ["1a_Piro.zip","#8c510a"], //1
    ["2_Tompiro.zip","#bf812d"], //2
    ["3_Jumano.zip","#dfc27d"], //3
    ["3a_Jumano.zip","#dfc27d"], //4
    ["4_WestTiwa.zip","#f6e8c3"], //5
    ["4a_WestTiwa.zip","#f6e8c3"], //6
    ["5_EastTiwa.zip","#c7eae5"], //7
    ["6_Keres.zip","#80cdc1"], //8
    ["7_TanoTowa.zip","#35978f"], //9
    ["7a_TanoTowa.zip","#35978f"], //10
    ["8_NorthTiwa.zip","#01665e"] //11
]

// define our sites
const sites = [
    ["01_Piro-all.zip"],
    ["02_Tompiro-all.zip"],
    ["03_Jumano-all.zip"],
    ["04_West-Tiwa-all.zip"],
    ["05_EastTiwa-all.zip"],
    ["06_Keres-all.zip"],
    ["07_TanoTowa-all.zip"],
    ["08_NorthTiwa-all.zip"],
    ["diagnosticSites-all.zip"]
]

// default basemap
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

//define the map
var mymap = L.map('mapId',{
    
    fullscreenControl: {
        pseudoFullscreen: true, // if true, fullscreen to page width and height
        position: "topright"
    },
    layers: Esri_WorldImagery,
    zoomControl: false
}).setView([35.08539970090307, -106.62437969380134], 7.5);

// custom zoom controls
L.control.zoom({
    position: "topright"
}).addTo(mymap);

// get and convert the *individual* region shapefiles into geojson
async function getShapeGeojson(zipfile, colorCode) {
    //get the shapefiles
    try {
        const gj = await shp("/DigitalMera/data/regionShapes/" + zipfile);
        
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

// get and convert the *individual* site shapefiles into geojson
async function getSiteGeojson(zipfile, period) {
    var marker;
    try {
        // custom icon
        var iconOptions = {
            iconUrl: "/DigitalMera/myCss_styleFiles/DM_siteIcon.png",
            iconSize: [25,25]
        }
        var customIcon = L.icon(iconOptions);

        // marker options
        var markerOptions = {
            clickable: true,
            draggable: false,
            icon: customIcon
        }

        //get the shapefile
        const gj = await shp("/DigitalMera/data/siteShapes/" + zipfile);

        // process per-period features in shapefile 
        gj["features"].forEach(feature => {
            if (feature['properties']['Periods'].includes(period)) {
                var lat = parseFloat(feature['geometry']['coordinates'][1]);
                var long = parseFloat(feature['geometry']['coordinates'][0]);
                marker = L.marker([lat, long], markerOptions);
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
// this will invoke the getSiteGeoJson function
changeMapFunction = async function ({ label, value, map }) {    

    // removes previous layers 
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // add the sites per period    
    for (let i=0;i < sites.length;i++){
        switch (value){
            case "1":
                getSiteGeojson(sites[i][0],value)
                break;
            case "2":
                getSiteGeojson(sites[i][0],value)
                break;
            case "3":
                getSiteGeojson(sites[i][0],value)
                break;    
            case "4":
                getSiteGeojson(sites[i][0],value)
                break;
            case "5":
                getSiteGeojson(sites[i][0],value)
                break;
            } 
     }
}


// MAIN ROUTINE BEGINS HERE

// add all the region shapes
for (let i=0;i < regions.length;i++){
    regionShapesArray[i] = getShapeGeojson(regions[i][0],regions[i][1]);
}

// make sure region shapes are all present in the array
if (regionShapesArray.includes(1)) {
    console.log("error in regionShapes array");
} else {
    console.log("all good in arrays");
}

// define our timeline slider
// https://github.com/svitkin/leaflet-timeline-slider/
L.control.timelineSlider({
    timelineItems: ["Period 1\n(1350-1450)", "Period 2\n(1450-1490)", "Period 3\n(1490-1515)", "Period 4\n(1515-1650)", "Period 5\n(1650-1700)"],
    initializeChange: true,
    changeMap: changeMapFunction
}).addTo(mymap);

// define our nav control
new L.Control.BootstrapDropdowns({
    position: "topleft",
    className: "legend",
    menuItems: [
        {
            html: '<i class="fas fa-map-marked-alt"></i>About',
            title: "About",
            afterClick: ()=>{
                splashScreen.show();
            }
        },
        {
            html: '<i class="fas fa-map-marked-alt"></i>Introduction',
            title: "About",
            afterClick: ()=>{
                introChapter.show();
            }
        }
    ],
}).addTo(mymap);

// define our legend
var polygonSides = '4';

var legendItems = [
    {
        label: "Site",
        type: "image",
        url: "/DigitalMera/myCss_styleFiles/DM_siteIcon.png",
    },
    {
        label: "Piro",
        type: "polygon",
        sides: polygonSides,
        color: regions[0][1],
        fill: false,
    },
    {
        label: "Tompiro",
        type: "polygon",
        sides: polygonSides,
        color: regions[2][1],
        fill: false,
    },
    {
        label: "Jumano",
        type: "polygon",
        sides: polygonSides,
        color: regions[3][1],
        fill: false,
    },
    {
        label: "West Tiwa",
        type: "polygon",
        sides: polygonSides,
        color: regions[5][1],
        fill: false,
    },
    {
        label: "East Tiwa",
        type: "polygon",
        sides: polygonSides,
        color: regions[7][1],
        fill: false,
    },
    {
        label: "Keres",
        type: "polygon",
        sides: polygonSides,
        color: regions[8][1],
        fill: false,
    },
    {
        label: "Tano Towa",
        type: "polygon",
        sides: polygonSides,
        color: regions[9][1],
        fill: false,
    },
    {
        label: "North Tiwa",
        type: "polygon",
        sides: polygonSides,
        color: regions[11][1],
        fill: false,
    }
];

L.control.Legend({
    position: "bottomleft",
    legends: legendItems,
    column: 2
}).addTo(mymap);

// basemap changer

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var basemaps = {
    "<span style='color: black'>ESRI Imagery</span>" : Esri_WorldImagery,
    "<span style='color: black'>OSM Hot</span>": OpenStreetMap_HOT
};

var layerControl = L.control.layers(basemaps).addTo(mymap);


