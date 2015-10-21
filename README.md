# geopromise
A Promise Wrapper for GeoLocation API

## Usage

GeoPromise has both static and prototype methods.
- - -
### Static Interface

#### getCurrentPosition

#####Parameters

options: Optional `<Object>`. Uses the [PositionOptions interface](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
GeoPromise.getCurrentPosition({ enableHighAccuracy: true }).done(function(CurrentPosition) {
  let targetPosition = {
    lat: 15,
    long: 37
  };

  if (/* If CurrentPosition.Coords matchs target coords */) {
    alert('You have arrived at your destination!');
  }
});
```

#### watchPosition

#####Parameters

options: Optional `<Object>`. Uses the [PositionOptions interface](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
window.addEventListener('GeolocationUpdate', function(ev) {
  // We have movement!!
});

GeoPromise.watchPosition({ enableHighAccuracy: true });
```

*Note* binding the event listener first will capture the starting position. It will also continue to life if there is a rejection.

```javascript
GeoPromise.watchPosition({ enableHighAccuracy: true })
  .done(function(watchID) {
    requestIdleCallback(function() {
      window.addEventListener('Geolocation.Update', function(ev) {
        // We have movement
      });
    });
  });

  ```
#### clearWatch

#####Parameters

ID: (integer)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
var watchID;

GeoPromise.watchPosition({ enableHighAccuracy: true })
  .done(function(id) {
    watchID = id;
  });

GeoPromise.clearWatch(watchID).then(function() {
  watchID = null;
});
```
- - -
### Prototype Interface

#### Constructor

#####Parameters

options: Optional `<Object>`. Uses the [PositionOptions interface](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
var geolocation = new GeoPromise({ enableHighAccuracy: true });
```

#### getCurrentPosition

#####Parameters

options: Optional `<Object>`. Uses the [PositionOptions interface](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
var geolocation = new GeoPromise({ enableHighAccuracy: true });

geolocation.getCurrentPosition().done(function(CurrentPosition) {
  let targetPosition = {
    lat: 15,
    long: 37
  };

  if (/* If CurrentPosition.Coords matchs target coords */) {
    alert('You have arrived at your destination!');
  }
});
```

#### watchPosition

#####Parameters

options: Optional `<Object>`. Uses the [PositionOptions interface](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
var geolocation = new GeoPromise({ enableHighAccuracy: true });

window.addEventListener('GeolocationUpdate', function(ev) {
  // We have movement!!
});

geolocation.watchPosition();
```

*Note* binding the event listener first will capture the starting position. It will also continue to life if there is a rejection.

```javascript
geolocation.watchPosition()
  .then(function(watchID) {
    requestIdleCallback(function() {
      window.addEventListener('Geolocation.Update', function(ev) {
        // We have movement
      });
    });
  });

  ```
#### clearWatch

#####Parameters

ID: (integer)

#####Returns

[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#####Syntax
```javascript
var geolocation = new GeoPromise({ enableHighAccuracy: true }),
  updateFunc = function(ev) {
    // We have movement
    if (hasReachedTarget) {
      geolocation.clearWatch().then(function() {
        window.removeEvent('Geolocation.Update', updateFunc);
      });
    }
  };

geolocation.watchPosition()
  .then(function(id) {
    requestIdleCallback(function() {
      window.addEventListener('Geolocation.Update', updateFunc);
    });
  });

GeoPromise.clearWatch(watchID).then(function() {
  watchID = null;
});
```
