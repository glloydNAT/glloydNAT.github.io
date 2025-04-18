async function getGeojson(zipfile) {

    //for the shapefiles in the files folder called pandr.shp
    const gj = await shp("data/regionShapes/" + zipfile);
    // console.log(geojson['features'][0]);
    L.geoJSON(gj['features'][0]).addTo(mymap);


    return 0;

}

const regionShapesArray = [];
regionShapesArray[0] = getGeojson("1_Piro.zip");
regionShapesArray[1] = getGeojson("1a_Piro.zip");
regionShapesArray[2] = getGeojson("2_Tompiro.zip");
regionShapesArray[3] = getGeojson("3_Jumano.zip");
regionShapesArray[4] = getGeojson("3a_Jumano.zip");
regionShapesArray[5] = getGeojson("4_WestTiwa.zip");
regionShapesArray[6] = getGeojson("4a_WestTiwa.zip");
regionShapesArray[7] = getGeojson("5_EastTiwa.zip");
regionShapesArray[8] = getGeojson("6_Keres.zip");
regionShapesArray[9] = getGeojson("7_TanoTowa.zip");
regionShapesArray[10] = getGeojson("7a_TanoTowa.zip");
regionShapesArray[11] = getGeojson("8_NorthTiwa.zip");

if (regionShapesArray.includes(1)) {
    console.log("error in regionShapes array");
} else {
    console.log("all good in regionShapes array");
}


var mymap = L.map('mapId').setView([35.08539970090307, -106.62437969380134], 17);


// create a variable named "osm" that is used to hold OpenStreetMap tile layer
// var osm = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

/*
var osm = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
minZoom: 4,
maxZoom: 7,
attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
ext: 'jpg'
});*/



var osm = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 7,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});



// add the OpenStreetMap tile layer (i.e. the variable osm above) to the map
osm.addTo(mymap);