(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        module.exports = mod();
    else if (typeof define == "function" && define.amd) // AMD
        return define([], mod);
    else // Plain browser env
        this.GeoPromise = mod();
})(function() {
    "use strict";

    /*!
     * Copyright 2015 Google Inc. All rights reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
     * or implied. See the License for the specific language governing
     * permissions and limitations under the License.
     */

    /*
     * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
     */
    window.requestIdleCallback = window.requestIdleCallback ||
        function(cb) {
            return setTimeout(function() {
                cb({
                    didTimeout: false,
                    timeRemaining: function() {
                        return 50;
                    }
                });
            }, 1);
        }

    window.cancelIdleCallback = window.cancelIdleCallback ||
        function(id) {
            clearTimeout(id);
        }


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
