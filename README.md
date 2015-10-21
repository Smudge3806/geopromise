# geopromise
A Promise Wrapper for GeoLocation API

## Usage

GeoPromise has both static and prototype methods.

### Static Interface

#### getCurrentPosition

#####Parameters

options: Optional `<Object>`. Uses the [PositionOptions interface] (https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

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

options: Optional `<Object>`. Uses the [PositionOptions interface] (https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)

#####Returns

[ES6 Promise] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

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
