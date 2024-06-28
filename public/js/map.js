
mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });


    const marker = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({offset: 32})
            .setHTML(`<h4><b>${listing.location}</b></h4>`)
        )
        .addTo(map);