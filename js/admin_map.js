/**
 * @description Receives the map and assigns the properties
 * @param {Object} map : map with its parameters
 */
function initMap() {
  //Receive the map by its id and geographically position it with latitude and longitude
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lng: -74.1102068,
      lat: 4.6599933,
    },
    // Map control options
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    // Zoom control options
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
}

/**
 * @description Draws the points of the routes on the map
 * @param {String} studentInfo : with code of students
 */
 function drawPoints(lat, lon, icon, studentInfo, timeUnix, distance) {
  //Draws markers of stops on the map
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lon),
    icon: icon,
    //draggable: true,
    //animation: google.maps.Animation.DROP,
    map: map,
  });

  //Draws info window when the user click on markers of stops
  if (studentInfo) {
    const sPath = "/data/Estudiantes.json";
    let route = $("#bus").val();
    let seasson = $("#seasson").val();

    // Gets name, last name and grade of student from dataset
    $.getJSON(sPath, (sData) => {
      let studentData = sData[route].Orden[studentInfo];
      let studentName;
      let studentGrade;
      if (studentData != undefined) {
        studentName = studentData.Nombres_Estudiante;
        studentGrade = studentData.Curso;
      } else {
        studentName = studentInfo;
        studentGrade = studentInfo;
      }
      //Sends student's name and hour of arrive to the function createStudentTable for display data
      createStudentTable(studentName, timeUnix);

      //HTML code and creation of info window
      var content =
        '<div id="content">' +
        '<div id="bodyContent">' +
        "<table>" +
        "<tbody>" +
        "<tr>" +
        '<td style="padding-top: 3px; padding-bottom: 3px;" ><b>Nombre</b></td>' +
        '<td style="padding-top: 3px; padding-bottom: 3px;" >' +
        studentName +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style="padding-top: 3px; padding-bottom: 3px;" ><b>ID</b></td>' +
        '<td style="padding-top: 3px; padding-bottom: 3px;" >' +
        studentInfo +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style="padding-top: 3px; padding-bottom: 3px;" ><b>Grado</b></td>' +
        '<td style="padding-top: 3px; padding-bottom: 3px;" >' +
        studentGrade +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style="padding-top: 3px; padding-bottom: 3px;" ><b>Ruta</b></td>' +
        '<td style="padding-top: 3px; padding-bottom: 3px;" >' +
        route +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style="padding-top: 3px; padding-bottom: 3px;" ><b>Trayecto</b></td>' +
        '<td style="padding-top: 3px; padding-bottom: 3px;" >' +
        seasson +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>";
      var infoWindow = new google.maps.InfoWindow({
        content: content,
      });
      google.maps.event.addListener(
        marker,
        "click",
        (function (pointer, bubble) {
          return function () {
            bubble.open(map, pointer);
          };
        })(marker, infoWindow)
      );
    });
  }

  //Draws info window when the user clicks on the bus icon
  if (icon == "/media/Bus2.png") {
    var content =
      '<div id="content">' +
      '<div id="bodyContent">' +
      "<table>" +
      "<tbody>" +
      "<tr>" +
      '<td style="padding-top: 3px; padding-bottom: 3px;" ><b>Distancia_km</b></td>' +
      '<td style="padding-top: 3px; padding-bottom: 3px;" >' +
      distance +
      "</td>" +
      "</tr>";
    var infoWindow = new google.maps.InfoWindow({
      content: content,
    });
    google.maps.event.addListener(
      marker,
      "click",
      (function (pointer, bubble) {
        return function () {
          bubble.open(map, pointer);
        };
      })(marker, infoWindow)
    );
  }
  return marker;
}

/**
 * @description Draws a polyline connecting points
 * @param {Array} fligthPaths : with coordinates of the points
 */
function drawFligthPaths(coordinates) {
  let flightPlanCoordinates = [];

  //Cleans fligthPaths array
  if (fligthPaths) {
    fligthPaths.setMap(null);
    fligthPaths = null;
  }
  //Puts coordinates into the fligthPaths array
  for (let i = 0; i < coordinates.length; i++) {
    flightPlanCoordinates.push({
      lat: coordinates[i].lat,
      lng: coordinates[i].lon,
    });
  }

  //Assigns the parameters of the polyline
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: "#2D62ED",
    strokeOpacity: 0.7,
    strokeWeight: 5,
  });

  fligthPaths = flightPath;

  flightPath.setMap(map);
}
