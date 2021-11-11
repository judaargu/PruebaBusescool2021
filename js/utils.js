/**
 * @description Receives the map and assigns the properties
 * @param {String} time : json with the data
 */
function timeHours(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp);
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();

  let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  let sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  let time = hour + ":" + min + ":" + sec;
  return time;
}

/**
 * @description Receives the points coordinates and calculates the total distance
 * @param {Number} tDistance : Total distance in meters
 */
function totalDistance(coordinates) {
  let totalD;
  let tDistance = 0;
  for (let i = 0; i < coordinates.length; i++) {
    if (i < coordinates.length -1 ) {
      let distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng({
          lat: coordinates[i].lat,
          lng: coordinates[i].lon,
        }),
        new google.maps.LatLng({
          lat: coordinates[i+1].lat,
          lng: coordinates[i+1].lon,
        })
      );
      tDistance = tDistance + distance;
    }
  }
  totalD = tDistance * 0.001;
  return totalD;
}
