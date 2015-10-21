(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        module.exports = mod();
    else if (typeof define == "function" && define.amd) // AMD
        return define([], mod);
    else // Plain browser env
        this.GeoPromise = mod();
})(function() {
    "use strict";

    function constructGeoParams(options) {
        var defaults = {
                enabledHighAccuracy: false,
                timeout: Infinity,
                maximumAge: 0
            };

        return Object.assign(defaults, options);
    };

    function handleGeoUpdate(data) {
        var updateEvent = new CustomEvent('GeolocationUpdate', {
            detail: data
        });

        window.dispatchEvent(updateEvent);
    };

    function handleFailure() {
        console.info(arguments);
    };

    function GeoPromise() {
        var options = options = constructGeoParams({});

        this.__proto__.watchID = undefined;

        Object.defineProperty(this, 'geo', {
            value: (function() {
                if ('geolocation' in navigator) {
                    return navigator.geolocation;
                }

                return false;
            })()
        });
        Object.defineProperty(this, 'options', {
            set: function (value) {
                if ('object' !== typeof value) {
                    throw new TypeError('Expected Object but found ' + typeof value);
                }

                options = constructGeoParams(value);
            },
            get: function() {
                return options;
            }
        });

        if (!this.geo) {
            throw new InternalError('GeoLocation not supported');
        }

        if ('freeze' in Object) {
            Object.freeze(this);
        } else if ('seal' in Object) {
            Object.seal(this);
        }
    };

    GeoPromise.getCurrentPosition = function(options) {
        return new Promise(function(resolve, reject) {
            if ( !('geolocation' in navigator) ) {
                return reject('Not Supported');
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, constructGeoParams(options));
        });
    };

    GeoPromise.watchPosition = function(options) {
        return new Promise(function(resolve, reject) {
            if ( !('geolocation' in navigator) ) {
                return reject('Not Supported');
            }

            resolve(
                navigator.geolocation
                    .watchPosition(handleGeoUpdate, handleFailure, constructGeoParams(options))
            );
        });
    };

    GeoPromise.prototype = Object.create(Object.prototype);
    GeoPromise.prototype.constructor = GeoPromise;

    GeoPromise.prototype.getCurrentPosition = function(options) {
        if (options) {
            this.options = Object.assign(constructGeoParams(this.options), options);
        }

         return new Promise(function(resolve, reject) {
            this.geo.getCurrentPosition(resolve, reject, this.options);
        }.bind(this));
    };

    GeoPromise.prototype.watchPosition = function(options) {
        if (options) {
            this.options = Object.assign(constructGeoParams(this.options), options);
        }

        return new Promise(function(resolve, reject) {
            this.__proto__.watchID = this.geo.watchPosition(handleGeoUpdate, handleFailure, this.options);

            resolve(this.__proto__.watchID);
        }.bind(this));
    };

    GeoPromise.prototype.clearWatch = function() {
        return new Promise(function(resolve, reject) {
            try {
                this.geo.clearWatch(this.__proto__.watchID);
                this.__proto__.watchID = undefined;
                resolve();
            } catch (error) {
                reject(error);
            }
        }.bind(this));
    };

    Object.preventExtensions(GeoPromise);

    return GeoPromise;
});
