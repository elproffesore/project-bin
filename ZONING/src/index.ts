import mapboxgl from 'mapbox-gl'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Tilebelt from '@mapbox/tilebelt'
const util = require('util')
const accessToken = "" //gere comes the mapbox access token
mapboxgl.accessToken = accessToken
//create the mapbox instance
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 9,
    minZoom: 9,
    center: [13.381777,52.531677],
    style: 'mapbox://styles/proff/cljsdbmwq018801qw9jsvdfzg',
    attributionControl: false,
})
map.setProjection('globe')
const modes = MapboxDraw.modes;
modes.draw_rectangle = DrawRectangle;
const draw = new MapboxDraw({
    displayControlsDefault: false,
    modes,
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: 'draw_rectangle',
    styles: [
    // ACTIVE (being drawn)
    // line stroke
    {
        "id": "gl-draw-line",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#D20C0C",
          "line-width": 2
        }
    },
    // polygon fill
    {
      "id": "gl-draw-polygon-fill",
      "type": "fill",
      "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      "paint": {
        "fill-color": "#D20C0C",
        "fill-outline-color": "#D20C0C",
        "fill-opacity": 0
      }
    },
    // polygon mid points
    {
      'id': 'gl-draw-polygon-midpoint',
      'type': 'circle',
      'filter': ['all',
        ['==', '$type', 'Point'],
        ['==', 'meta', 'midpoint']],
      'paint': {
        'circle-radius': 3,
        'circle-color': '#fbb03b'
      }
    },
    // polygon outline stroke
    // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
    {
      "id": "gl-draw-polygon-stroke-active",
      "type": "line",
      "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#D20C0C",
        "line-width": 2
      }
    },
    // vertex point halos
    {
      "id": "gl-draw-polygon-and-line-vertex-halo-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 5,
        "circle-color": "#FFF"
      }
    },
    // vertex points
    {
      "id": "gl-draw-polygon-and-line-vertex-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 3,
        "circle-color": "#D20C0C",
      }
    },

    // INACTIVE (static, already drawn)
    // line stroke
    {
        "id": "gl-draw-line-static",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#000",
          "line-width": 3
        }
    },
    // polygon fill
    {
      "id": "gl-draw-polygon-fill-static",
      "type": "fill",
      "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
      "paint": {
        "fill-color": "#000",
        "fill-outline-color": "#000",
        "fill-opacity": 0
      }
    },
    // polygon outline
    {
      "id": "gl-draw-polygon-stroke-static",
      "type": "line",
      "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#000",
        "line-width": 3
      }
    }
  ]
});
map.addControl(draw)
map.on('draw.create', async function (e) {
  console.log(e)
    let latLng = e.features[0].geometry.coordinates[0][0];
    let tile = Tilebelt.pointToTile(latLng[0],latLng[1],map.getZoom());
    let request = util.format('https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/%d/%d/%d.mvt?style=mapbox://styles/proff/clk0xfvsl00ao01peg1et1gni@00&access_token=%s',Math.round(map.getZoom()),tile[0],tile[1],accessToken)
    console.log(request)
    await createTile(request)
    setTimeout(() => {draw.changeMode('draw_rectangle')},0);
});






const VectorTile = require("@mapbox/vector-tile").VectorTile
const Protobuf = require('pbf/dist/pbf')
const d3 = require('d3')
const d3tile = require('d3-tile')
const d3geo = require('d3-geo')
const diagramObject = document.getElementById("diagram")
const width = diagramObject!.offsetWidth
const height = diagramObject!.offsetHeight
const projection = d3.geoMercator()
    .center([13.381777,52.531677])
    .scale(Math.pow(2, 21) / (2 * Math.PI))
    .translate([width / 2, height / 2])
    .precision(0)

const tile = d3tile.tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))

const path = d3.geoPath(projection)

function geojson([x, y, z]:number[], layer: any, filter = (f?: any, i?: any, features?: any) => true) {
    if (!layer) return;
    const features = [];
    for (let i = 0; i < layer.length; ++i) {
      const f = layer.feature(i).toGeoJSON(x, y, z);
      if (filter.call(null, f, i, features)) features.push(f);
    }
    return {type: "FeatureCollection", features};
  }

async function createTile(request: String){
    let tiles = await Promise.all(tile().map(async (d:any) => {
        d.layers = new VectorTile(new Protobuf(await d3.buffer(request))).layers; // Sign up for an API key: https://www.nextzen.org
        return d;
      }))
      
    console.log(tiles)
    let map = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${tiles.map(d =>`
        <path fill="#eee" d="${path(geojson(d, d.layers.water, d => !d.properties.boundary))}"></path>
        `)}
    </svg>`
    document.getElementById("diagram")!.innerHTML = map
  }