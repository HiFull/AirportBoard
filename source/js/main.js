'use strict';

var
  DATA_URL = 'data.json',
  flightsBoard = document.querySelector('.board');

// AJAX
window.load = (function () {
  return function (url, onLoad) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function (evt) {
      if (evt.target.status >= 200 && evt.target.status <= 400) {
        onLoad(evt.target.response);
      }
    });

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
  };
})();
// =========================END AJAX======================================

// MAIN
window.load(DATA_URL, function (data) {
  window.uploadData = data;

  renderContainer(data);
  window.filtersControl(data);
});

function renderContainer(data) {
  flightsBoard.innerText = '';
  var flights = data;
  if (!Array.isArray(data)) {
    flights = data.flights;
  }

  if (!flights.length) {
    var noresult = document.createElement('div');
    noresult.classList.add('board__noresult');
    noresult.innerText = 'No Results';
    flightsBoard.appendChild(noresult);

  }

  flights.forEach(function (flight) {
    flightsBoard.appendChild(window.flightRender(flight, data));
  });
}
// =========================END MAIN======================================

// RENDER
window.flightRender = (function () {
  var
    flightTemplate = document.querySelector('#flight-template'),
    flightElement = flightTemplate.content.querySelector('.flight');

  return function (flight) {
    var
      newFlightElement = flightElement.cloneNode(true),
      flightHeader = newFlightElement.querySelector('.flight__title'),
      flightFrom = newFlightElement.querySelector('.flight__from'),
      flightTo = newFlightElement.querySelector('.flight__to'),
      flightPlane = newFlightElement.querySelector('.flight__plane'),
      flightCompany = newFlightElement.querySelector('.flight__company'),
      flightStatus = newFlightElement.querySelector('.flight__state');

    function setStatus(flight, flightStatus) {
      flightStatus.classList.add(flightStatus.className + '--' + flight.status);
    }

    setStatus(flight, flightStatus);

    flightHeader.textContent = `Flight №${flight.flightNumber}`;
    flightFrom.textContent = flight.from;
    flightTo.textContent = flight.to;
    flightPlane.textContent = flight.plane;
    flightCompany.textContent = flight.company;
    flightStatus.textContent = flight.status;

    return newFlightElement;
  };
})();
// =============================END RENDER==================================

// FILTER
window.filtersControl = (function () {
  var filterControlFlights = document.querySelector('#filter-control-flights');
  var searchControlFlights = document.querySelector('#flight-search');
  var filteredFlights = [];

  return function (data) {

    // FILTERING
    filterControlFlights.addEventListener('change', onFiltersClick);

    function onFiltersClick(evt) {
      renderFlightsByFilter(evt.target.value)
    }

    function renderFlightsByFilter(value) {
      if (value) {
        filteredFlights = getFilteredFlights(value);
      } else {
        filteredFlights = uploadData;
      }
      renderContainer(filteredFlights);
    }

    function getFilteredFlights(value) {
      return data.flights.filter(function (flight) {
        if (Array.isArray(flight.status)) {
          return flight.status.indexOf(value) !== -1;
        } else {
          return flight.status === value;
        }
      });
    }
    // =========================END FILTERING===============================

    // SEARCHING
    searchControlFlights.addEventListener('search', onSearchSubmit);
    function onSearchSubmit(evt) {
      filterControlFlights.selectedIndex = 0;
      renderFlightsBySearch(evt.target.value)
    }

    function renderFlightsBySearch(value) {
      if (value) {
        filteredFlights = getFoundFlights(value);
      } else {
        filteredFlights = uploadData;
      }
      renderContainer(filteredFlights)
    }

    function getFoundFlights(value) {
      return data.flights.filter(function (flight) {
        if (Array.isArray(flight.flightNumber)) {
          return flight.flightNumber.indexOf(value) !== -1;
        } else {
          return flight.flightNumber === value;
        }
      });
    }
    // =========================END SEARCHING===============================
  };
})();
// =============================END FILTER==================================
