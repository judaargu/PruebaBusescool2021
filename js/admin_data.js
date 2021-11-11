let markers = [];
let markersRoute = [];
let fligthPaths;

/**
 * @description Starts the selectTimeOfDay function
 */
function routeData() {
  selectTimeOfDay();
}

//gets AM routes
function amRoutes(bData) {
  let am = Object.keys(bData.Rutas_AM);
  return am;
}

//gets PM routes
function pmRoutes(bData) {
  let pm = Object.keys(bData.Rutas_PM);
  return pm;
}

/**
 * @description Receives the AM or PM value and assigns the corresponding routes
 * @param {String} time : time with the value
 */
function selectTimeOfDay() {
  const bPath = "/data/Trayecto con paraderos.json";
  let time = $("#seasson").val();

  //Receives AM and PM values from amRoutes and pmRoutes functions
  $.getJSON(bPath, (bData) => {
    let dataRouteJson = bData;
    let am = amRoutes(dataRouteJson);
    let pm = pmRoutes(dataRouteJson);

    $("#bus").empty();

    //Assigns the appropriate value according to the value of time
    if (time == "AM") {
      am.forEach(function (route) {
        var $newOpt = $("<option>").attr("value", route).text(route);

        $("#bus").append($newOpt);
      });
      $("select").formSelect();
    } else {
      pm.forEach(function (route) {
        var $newOpt = $("<option>").attr("value", route).text(route);

        $("#bus").append($newOpt);
      });
      $("select").formSelect();
    }
  });
}

/**
 * @description Updates students table with the provided data
 * @param {String} studentName : Students to display on table
 */
function createStudentTable(studentName, date) {
  let table = "";
  table = table.concat("<tr>");
  table = table.concat("<td>" + studentName + "</td>");
  table = table.concat("<td>" + date + "</td>");
  table = table.concat("</tr>");

  $("#st").append(table);
}

/**
 * @description Cleans table values and add new headers
 * @param {String} table : table to display without values
 */
function emptyTable() {
  let table = "";
  $("#st").empty();
  table = table.concat("<th>" + "Nombre estudiante" + "</th>");
  table = table.concat("<th>" + "Hora de llegada" + "</th>");
  $("#st").append(table);
}

/**
 * @description Route of the routes with stops
 * @param {Array} markers : with parameters of stops
 */
function busRoute() {
  let route = $("#bus").val();
  let seasson = $("#seasson").val();
  const bPath = "/data/Trayecto con paraderos.json";

  //Cleans markers and markersRoute arrays
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setVisible(false);
    }
  }
  if (markersRoute.length > 0) {
    for (let i = 0; i < markersRoute.length; i++) {
      markersRoute[i].setVisible(false);
    }
  }
  markers = [];
  markersRoute = [];
  //Gets the latitude and longitude values from dataset
  $.getJSON(bPath, (bData) => {
    let dataRouteJson = bData["Rutas_" + seasson][route].LatLong;
    let count = 0;
    let finalCount = 0;
    let coordinates = [];
    Object.keys(dataRouteJson).forEach(function (keyLog) {
      //An array is created with the coordinates of the points
      coordinates.push({
        lat: dataRouteJson[keyLog].Latitud_Ruta,
        lon: dataRouteJson[keyLog].Longitud_Ruta,
      });
    });
    let distance = totalDistance(coordinates);
    //Gets the student code value from dataset
    Object.keys(dataRouteJson).forEach(function (keyLog) {
      let studentCode = dataRouteJson[keyLog].Log_Status.split(":")[4];
      finalCount++;
      //It is defined if it is a stopping point, end or route
      if (
        dataRouteJson[keyLog].Log_Status.split(":")[0] == "Parada" &&
        dataRouteJson[keyLog].Log_Status.split(":")[4] != undefined
      ) {
        count++;
        //using the timeHours function the schedule is obtained from data array
        let timeUnix = timeHours(dataRouteJson[keyLog].TimeStamp);
        let icon = "/media/Pin_estudiante_" + count + ".png";
        markers.push(
          drawPoints(
            dataRouteJson[keyLog].Latitud_Ruta,
            dataRouteJson[keyLog].Longitud_Ruta,
            icon,
            studentCode,
            timeUnix,
            null
          )
        );
      }
      if (finalCount == Object.keys(dataRouteJson).length) {
        let icon = "/media/Bus2.png";
        markersRoute.push(
          drawPoints(
            dataRouteJson[keyLog].Latitud_Ruta,
            dataRouteJson[keyLog].Longitud_Ruta,
            icon,
            null,
            null,
            distance
          )
        );
      }
      if (dataRouteJson[keyLog].Log_Status == "-") {
        let icon = "/media/dot-blue.png";
        markersRoute.push(
          drawPoints(
            dataRouteJson[keyLog].Latitud_Ruta,
            dataRouteJson[keyLog].Longitud_Ruta,
            icon,
            null,
            null,
            null
          )
        );
      }
    });
    drawFligthPaths(coordinates);
  });
}


