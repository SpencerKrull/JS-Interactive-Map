// create map
const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},

    // leaflet map
    makeMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 12,
    });

    // openstreetmap files
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
    }).addTo(this.map)

    // geolocation marker
    const marker = L.marker(this.coordinates)
    marker
    .addTo(this.map)
    .bindPopup('<p1><b>You Are Here</b><br></p1>')
    .openPopup()
    },

    // add business markers
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.markers[i].lat,
                this.markers[i].lon,
            ])
            .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map)
        }
    },
}

// get coordinates via geolocation api
async function getCoords(){
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare businesses
async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'fsq3aHmSdQJTy4pw8baSoyeXj06TarIlFB8tYxuxvaseWkw='
        }
      }
      let limit = 5
      let lat = myMap.coordinates[0]
      let lon = myMap.coordinates[1]
      let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
      let data = await response.text()
      let parsedData = JSON.parse(data)
      let businesses = parsedData.results
      return businesses
}

// process foursquare array
function processBusiness(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            lon: element.geocodes.main.longitude
        };
        return location
    })
    return businesses
}

// event handlers
// window load
window.onload = async () => {
    const coords = await getCoords()
    myMap.coordinates = coords
    myMap.makeMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) =>{
    event.preventDefault;
    let business = document.getElementById('businesses').value
    let data = await getFoursquare(business)
    myMap.businesses = processBusiness(data)
    myMap.addMarkers()
})