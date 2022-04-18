# airnow.js

airnow is a module for making HTTP requests to the airnowapi.org webservices API.

## Installation

npm install airnow --save

## Quick Examples

```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// get the forecast by zip
client.getForecastByZipCode({ zipCode: "53703" }, function(err, forecast){
	
});

// get the forecast by latitude and longitude
client.getForecastByLatLong({ latitude: 39.0509, longitude: -121.4453}, function(err, forecast){
	
});

// get the observations by zip
client.getObservationsByZipCode({ zipCode: "53703" }, function(err, observations){
	
});

// get the observations by latitude and longitude
client.getObservationsByLatLng({ latitude: 39.0509, longitude:-121.4453 }, function(err, observations){
	
});

// get the observations by a bounded box monitoring site
client.getObservationsByMonitoringSite({ bbox:{ minX: -122.715607, minY: 38.181254, maxX: -120.012970, maxY: 39.022646}, parameters:["pm25","o3"], datatype:"C"}, function(err, observations){
	
});

// get historical observations by a zip code
client.getHistoricalObservationsByZipCode({ zipCode:"53703", date: new Date(1448984256072) }, function(err, observations){
	
});

// get historical observations by latitude and longitude
client.getHistoricalObservationsByLatLng({ latitude: 39.0509, longitude:-121.4453, date: new Date(1448984256072) }, function(err, observations){
	
});
```

## Features

1. Forecasts
2. Observations (current & historical)
3. Brute force retries of the HTTP calls

## getForecastByZipCode

Get a forecast for a zip code on a particular date.

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	zipCode: "53703",
	date: new Date(),
	distance: 100,
	format: "application/json"
};

// get the forecast by zip
client.getForecastByZipCode(options, function(err, forecast){
	if (err){
		console.log('derp! an error calling getForecastByZipCode: ' + err);
	} else {
		// the world is good! start processing the forecast
	}
});
```

### options
| Parameter | Description                                                                                                                                                    | Type   | Required |
|:---------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  zipCode  | Zip code                                                                                                                                                       | String |    Yes   |
|    date   | Date of forecast. If date is omitted, the current forecast is returned.                                                                                        | Date   |    No    |
|  distance | If no reporting area is associated with the specified Zip Code, return a forecast from a nearby reporting area within this distance (in miles).                | Number |    No    |
|   format  | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## getForecastByLatLong

Get a forecast for a latitude and longitude pair for a particular date

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	latitude: 38.33,
	longitude: -122.28,
	date: new Date(),
	distance: 100,
	format: "application/json"
};

// get the forecast by latitude and longitude
client.getForecastByLatLong(options, function(err, forecast){
	if (err){
		console.log('derp! an error calling getForecastByZipCode: ' + err);
	} else {
		// the world is good! start processing the forecast
	}
});
```

### options
| Parameter   | Description                                                                                                                                                    | Type   | Required |
|:-----------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  latitude   | Latitude in decimal degrees                                                                                                                                    | Number |    Yes   |
|  longitude  | Longitude in decimal degrees                                                                                                                                   | Number |    Yes   |
|    date     | Date of forecast. If date is omitted, the current forecast is returned.                                                                                        | Date   |    No    |
|  distance   | If no reporting area is associated with the specified latitude and longitude, return a forecast from a nearby reporting area within this distance (in miles).  | Number |    No    |
|   format    | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## getObservationsByZipCode

Gets the current observations for a single zip code.

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	zipCode: "53703",
	distance: 100,
	format: "application/json"
};

// get the current observations by zip
client.getObservationsByZipCode(options, function(err, observations){
	if (err){
		console.log('derp! an error calling getObservationsByZipCode: ' + err);
	} else {
		// the world is good! start processing the observations
	}
});
```

### options
| Parameter   | Description                                                                                                                                                    | Type   | Required |
|:-----------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  zipCode    | Zip Code                                                                                                                                           	           | String |    Yes   |
|  distance   | If no reporting area is associated with the specified Zip Code, return a forecast from a nearby reporting area within this distance (in miles).                | Number |    No    |
|   format    | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## getObservationsByLatLng

Gets the current observations for a latitude and longitude pair.

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	latitude: 38.33,
	longitude: -122.28,
	distance: 100,
	format: "application/json"
};

// get the current observations by latitude and longitude
client.getObservationsByLatLng(options, function(err, observations){
	if (err){
		console.log('derp! an error calling getObservationsByLatLng: ' + err);
	} else {
		// the world is good! start processing the observations
	}
});
```

### options
| Parameter   | Description                                                                                                                                                    | Type   | Required |
|:-----------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  latitude   | Latitude in decimal degrees                                                                                                                                    | Number |    Yes   |
|  longitude  | Longitude in decimal degrees                                                                                                                                   | Number |    Yes   |
|  distance   | If no reporting area is associated with the specified latitude and longitude, return a forecast from a nearby reporting area within this distance (in miles).  | Number |    No    |
|   format    | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## getObservationsByMonitoringSite

Get observations for a bounded box monitoring site.

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	latitude: 38.33,
	longitude: -122.28,
	distance: 100,
	format: "application/json"
};

// get the observations by monitoring site
client.getObservationsByMonitoringSite(options, function(err, observations){
	if (err){
		console.log('derp! an error calling getObservationsByMonitoringSite: ' + err);
	} else {
		// the world is good! start processing the observations
	}
});
```

### options
| Parameter   | Description                                                                                                                                                    | Type   | Required |
|:-----------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  latitude   | Latitude in decimal degrees                                                                                                                                    | Number |    Yes   |
|  longitude  | Longitude in decimal degrees                                                                                                                                   | Number |    Yes   |
|  distance   | If no reporting area is associated with the specified latitude and longitude, return a forecast from a nearby reporting area within this distance (in miles).  | Number |    No    |
|   format    | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## getHistoricalObservationsByZipCode

Get historical observations for a zip.

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	zipCode: "53703",
	date: new Date(1448984256072),
	distance: 100,
	format: "application/json"
};

// get the historical observations by zip code
client.getHistoricalObservationsByZipCode(options, function(err, observations){
	if (err){
		console.log('derp! an error calling getHistoricalObservationsByZipCode: ' + err);
	} else {
		// the world is good! start processing the observations
	}
});
```

### options
| Parameter   | Description                                                                                                                                                    | Type   | Required |
|:-----------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  zipCode    | Zip Code                                                                                                                                                       | String |    Yes   |
|    date     | date of observations                                                                                                                                           | Date   |    Yes   |
|  distance   | If no reporting area is associated with the specified Zip Code, return a forecast from a nearby reporting area within this distance (in miles).                | Number |    No    |
|   format    | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## getHistoricalObservationsByLatLng

Get historical observations for a latitude and longitude pair.

### example
```javascript
var airnow = require('airnow');

var client = airnow({ apiKey: 'my airnow.org key' });

// build my options
var options = {
	latitude: 38.33,
	longitude: -122.28,
	date: new Date(1448984256072),
	distance: 100,
	format: "application/json"
};

// get the historical observations by latitude and longitude
client.getHistoricalObservationsByLatLng(options, function(err, observations){
	if (err){
		console.log('derp! an error calling getHistoricalObservationsByLatLng: ' + err);
	} else {
		// the world is good! start processing the observations
	}
});
```

### options
| Parameter   | Description                                                                                                                                                    | Type   | Required |
|:-----------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
|  latitude   | Latitude in decimal degrees                                                                                                                                    | Number |    Yes   |
|  longitude  | Longitude in decimal degrees                                                                                                                                   | Number |    Yes   |
|    date     | date of observations                                                                                                                                           | Date   |    Yes   |
|  distance   | If no reporting area is associated with the specified latitude and longitude, return a forecast from a nearby reporting area within this distance (in miles).  | Number |    No    |
|   format    | Format of the payload returned.  Defaults to "application/json" and the response will be a parsed JSON object. "text/csv" "application/json" "application/xml" | String |    No    |

## Contributing

The more PRs the merrier. :-)