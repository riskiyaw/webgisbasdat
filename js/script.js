// Inisialisasi peta
const map = L.map('map').setView([-6.903, 107.6510], 13);

// Basemap
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
}).addTo(map);

const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Basemap control
const baseMaps = {
    "OpenStreetMap": basemapOSM,
    "OSM Humanitarian": osmHOT,
    "Google Maps": baseMapGoogle
};
// Tombol fullscreen
map.addControl(new L.Control.Fullscreen({ position: 'topleft' }));

// Tombol Home
const home = { lat: -6.903, lng: 107.6510, zoom: 12 };
L.easyButton('fa-home', function (btn, map) {
    map.setView([home.lat, home.lng], home.zoom);
}, 'Kembali ke Home').addTo(map);

// Tombol Lokasi Saya
L.control.locate({
    position: 'topleft',
    setView: 'once',
    flyTo: true,
    keepCurrentZoomLevel: false,
    showPopup: false,
    locateOptions: { enableHighAccuracy: true }
}).addTo(map);

// Layer Jembatan
const symbologyPoint = {
    radius: 5,
    fillColor: "#00FF00", // Hijau terang
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const jembatanPT = new L.LayerGroup();
$.getJSON("./asset/data-spasial/jembatan_pt.geojson", function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, symbologyPoint);
        }
    }).addTo(jembatanPT);
});
jembatanPT.addTo(map);

// Layer Batas Administrasi
const adminKelurahanAR = new L.LayerGroup();
$.getJSON("./asset/data-spasial/admin_kelurahan_ln.geojson", function (data) {
    L.geoJSON(data, {
        style: {
            color: "black", // Hitam
            weight: 2,
            opacity: 1,
            dashArray: '3,3,20,3,20,3,20,3,20,3,20',
            lineJoin: 'round'
        }
    }).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);

// Layer Tutupan Lahan
const landcover = new L.LayerGroup();
$.getJSON("./asset/data-spasial/landcover_ar.geojson", function (data) {
    L.geoJSON(data, {
        style: function (feature) {
            switch (feature.properties.REMARK) {
                case 'Danau/Situ':
                    return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#97DBF2" }; // Biru muda
                case 'Empang':
                    return { fillColor: "#0000FF", fillOpacity: 0.8, weight: 0.5, color: "#0000FF" }; // Biru
                case 'Hutan Rimba':
                    return { fillColor: "#006400", fillOpacity: 0.8, weight: 0.5, color: "#006400" }; // Hijau tua
                case 'Perkebunan/Kebun':
                    return { fillColor: "#90EE90", fillOpacity: 0.8, weight: 0.5, color: "#90EE90" }; // Hijau muda
                case 'Permukiman dan Tempat Kegiatan':
                    return { fillColor: "#FFC0CB", fillOpacity: 0.8, weight: 0.5, color: "#FFC0CB" }; // Merah muda
                case 'Sawah':
                    return { fillColor: "#FFFF00", fillOpacity: 0.8, weight: 0.5, color: "#FFFF00" }; // Kuning
                case 'Semak Belukar':
                    return { fillColor: "#98FB98", fillOpacity: 0.8, weight: 0.5, color: "#98FB98" }; // Hijau pudar
                case 'Sungai':
                    return { fillColor: "#00008B", fillOpacity: 0.8, weight: 0.5, color: "#00008B" }; // Biru tua
                case 'Tanah Kosong/Gundul':
                    return { fillColor: "#808080", fillOpacity: 0.8, weight: 0.5, color: "#808080" }; // Abu-abu
                case 'Tegalan/Ladang':
                    return { fillColor: "#FFFFE0", fillOpacity: 0.8, weight: 0.5, color: "#FFFFE0" }; // Kuning muda
                case 'Vegetasi Non Budidaya Lainnya':
                    return { fillColor: "#000000", fillOpacity: 0.8, weight: 0.5, color: "#000000" }; // Hitam
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Tutupan Lahan: </b>' + feature.properties.REMARK);
        }
    }).addTo(landcover);
});
landcover.addTo(map);

// Layer kontrol
const Component = {
    "Jembatan": jembatanPT,
    "Batas Administrasi": adminKelurahanAR,
    "Tutupan Lahan": landcover
};

L.control.layers(baseMaps, Component).addTo(map);

// Legenda
let legend = L.control({ position: "topright" });


legend.onAdd = function () { 
    let div = L.DomUtil.create("div", "legend"); 
    div.innerHTML = 
        // Judul Legenda 
        '<p style="font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Legenda</p>' + 
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Infrastruktur</p>' + 
        '<div><svg style="display:block;margin:auto;text-align:center;stroke-width:1;stroke:rgb(0,0,0);"><circle cx="15" cy="8" r="5" fill="#00FF00" /></svg></div>Jembatan<br>' + 
        // Legenda Layer Batas Administrasi 
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Batas Administrasi</p>' + 
        '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>Batas Desa/Kelurahan<br>' + 
        // Legenda Layer Tutupan Lahan 
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Tutupan Lahan</p>' + 
        '<div style="background-color: #97DBF2; height: 10px;"></div>Danau/Situ<br>' + 
        '<div style="background-color: #0000FF; height: 10px;"></div>Empang<br>' + 
        '<div style="background-color: #006400; height: 10px;"></div>Hutan Rimba<br>' + 
        '<div style="background-color: #90EE90; height: 10px;"></div>Perkebunan/Kebun<br>' + 
        '<div style="background-color: #FFC0CB; height: 10px;"></div>Permukiman dan Tempat Kegiatan<br>' + 
        '<div style="background-color: #FFFF00; height: 10px;"></div>Sawah<br>' + 
        '<div style="background-color: #98FB98; height: 10px;"></div>Semak Belukar<br>' + 
        '<div style="background-color: #00008B; height: 10px;"></div>Sungai<br>' + 
        '<div style="background-color: #808080; height: 10px;"></div>Tanah Kosong/Gundul<br>' + 
        '<div style="background-color: #FFFFE0; height: 10px;"></div>Tegalan/Ladang<br>' + 
        '<div style="background-color: #000000; height: 10px;"></div>Vegetasi Non Budidaya Lainnya<br>'; 
    return div; 
}; 

legend.addTo(map);
