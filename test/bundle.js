(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//! moment.js
//! version : 2.14.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        var k;
        for (k in obj) {
            // even if its not own property I'd still call it non-empty
            return false;
        }
        return true;
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (utils_hooks__hooks.deprecationHandler != null) {
                utils_hooks__hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (utils_hooks__hooks.deprecationHandler != null) {
            utils_hooks__hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;
    utils_hooks__hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function units_month__handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = create_utc__createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return units_month__handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function day_of_week__handleStrictParse(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = create_utc__createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = create_utc__createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        ordinalParse: defaultOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, parentConfig = baseConfig;
            // MERGE
            if (locales[name] != null) {
                parentConfig = locales[name]._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (isDate(input)) {
            config._d = input;
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = utils_hooks__hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIOROITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = stringGet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = stringSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    momentPrototype__proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var prototype__proto = Locale.prototype;

    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto.ordinal         = ordinal;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    prototype__proto.weekdaysRegex       =        weekdaysRegex;
    prototype__proto.weekdaysShortRegex  =        weekdaysShortRegex;
    prototype__proto.weekdaysMinRegex    =        weekdaysMinRegex;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = lists__get(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = locale_locales__getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return lists__get(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = lists__get(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function lists__listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function lists__listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function lists__listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function lists__listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function duration_humanize__getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.14.1';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeRounding = duration_humanize__getSetRelativeTimeRounding;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.calendarFormat        = getCalendarFormat;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],2:[function(require,module,exports){
/**
 * Created by rburson on 1/27/16.
 */
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}
__export(require('./catavolt/util'));
__export(require('./catavolt/fp'));
__export(require('./catavolt/ws'));
__export(require('./catavolt/dialog'));
__export(require('./catavolt/print'));

},{"./catavolt/dialog":3,"./catavolt/fp":4,"./catavolt/print":5,"./catavolt/util":6,"./catavolt/ws":7}],3:[function(require,module,exports){
"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};var __extends=undefined&&undefined.__extends||function(d,b){for(var p in b){if(b.hasOwnProperty(p))d[p]=b[p];}function __(){this.constructor=d;}d.prototype=b===null?Object.create(b):(__.prototype=b.prototype,new __());}; /**
 * Created by rburson on 3/27/15.
 */var util_1=require("./util");var fp_1=require("./fp");var ws_1=require("./ws");var moment=require('moment'); /*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */ /**
 * *********************************
 */var CellValueDef=function(){function CellValueDef(_style){this._style=_style;} /* Note compact deserialization will be handled normally by OType */CellValueDef.fromWS=function(otype,jsonObj){if(jsonObj['attributeCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'],'WSAttributeCellValueDef',OType.factoryFn);}else if(jsonObj['forcedLineCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'],'WSForcedLineCellValueDef',OType.factoryFn);}else if(jsonObj['labelCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'],'WSLabelCellValueDef',OType.factoryFn);}else if(jsonObj['substitutionCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'],'WSSubstitutionCellValueDef',OType.factoryFn);}else if(jsonObj['tabCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'],'WSTabCellValueDef',OType.factoryFn);}else {return new fp_1.Failure('CellValueDef::fromWS: unknown CellValueDef type: '+util_1.ObjUtil.formatRecAttr(jsonObj));}};Object.defineProperty(CellValueDef.prototype,"isInlineMediaStyle",{get:function get(){return this.style&&(this.style===PropDef.STYLE_INLINE_MEDIA||this.style===PropDef.STYLE_INLINE_MEDIA2);},enumerable:true,configurable:true});Object.defineProperty(CellValueDef.prototype,"style",{get:function get(){return this._style;},enumerable:true,configurable:true});return CellValueDef;}();exports.CellValueDef=CellValueDef; /**
 * *********************************
 */var AttributeCellValueDef=function(_super){__extends(AttributeCellValueDef,_super);function AttributeCellValueDef(_propertyName,_presentationLength,_entryMethod,_autoFillCapable,_hint,_toolTip,_fieldActions,style){_super.call(this,style);this._propertyName=_propertyName;this._presentationLength=_presentationLength;this._entryMethod=_entryMethod;this._autoFillCapable=_autoFillCapable;this._hint=_hint;this._toolTip=_toolTip;this._fieldActions=_fieldActions;}Object.defineProperty(AttributeCellValueDef.prototype,"autoFileCapable",{get:function get(){return this._autoFillCapable;},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"entryMethod",{get:function get(){return this._entryMethod;},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"fieldActions",{get:function get(){return this._fieldActions;},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"hint",{get:function get(){return this._hint;},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"isComboBoxEntryMethod",{get:function get(){return this.entryMethod&&this.entryMethod==='ENTRY_METHOD_COMBO_BOX';},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"isDropDownEntryMethod",{get:function get(){return this.entryMethod&&this.entryMethod==='ENTRY_METHOD_DROP_DOWN';},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"isTextFieldEntryMethod",{get:function get(){return !this.entryMethod||this.entryMethod==='ENTRY_METHOD_TEXT_FIELD';},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"presentationLength",{get:function get(){return this._presentationLength;},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"propertyName",{get:function get(){return this._propertyName;},enumerable:true,configurable:true});Object.defineProperty(AttributeCellValueDef.prototype,"toolTip",{get:function get(){return this._toolTip;},enumerable:true,configurable:true});return AttributeCellValueDef;}(CellValueDef);exports.AttributeCellValueDef=AttributeCellValueDef; /**
 * *********************************
 */var ForcedLineCellValueDef=function(_super){__extends(ForcedLineCellValueDef,_super);function ForcedLineCellValueDef(){_super.call(this,null);}return ForcedLineCellValueDef;}(CellValueDef);exports.ForcedLineCellValueDef=ForcedLineCellValueDef; /**
 * *********************************
 */var LabelCellValueDef=function(_super){__extends(LabelCellValueDef,_super);function LabelCellValueDef(_value,style){_super.call(this,style);this._value=_value;}Object.defineProperty(LabelCellValueDef.prototype,"value",{get:function get(){return this._value;},enumerable:true,configurable:true});return LabelCellValueDef;}(CellValueDef);exports.LabelCellValueDef=LabelCellValueDef; /**
 * *********************************
 */var SubstitutionCellValueDef=function(_super){__extends(SubstitutionCellValueDef,_super);function SubstitutionCellValueDef(_value,style){_super.call(this,style);this._value=_value;}Object.defineProperty(SubstitutionCellValueDef.prototype,"value",{get:function get(){return this._value;},enumerable:true,configurable:true});return SubstitutionCellValueDef;}(CellValueDef);exports.SubstitutionCellValueDef=SubstitutionCellValueDef; /**
 * *********************************
 */var TabCellValueDef=function(_super){__extends(TabCellValueDef,_super);function TabCellValueDef(){_super.call(this,null);}return TabCellValueDef;}(CellValueDef);exports.TabCellValueDef=TabCellValueDef; /**
 * *********************************
 */var Attachment=function(){function Attachment(name,attachmentData){this.name=name;this.attachmentData=attachmentData;};return Attachment;}();exports.Attachment=Attachment; /**
 * *********************************
 */ /**
 * Top-level class, representing a Catavolt 'Pane' definition.
 * All 'Context' classes have a composite {@link PaneDef} that defines the Pane along with a single record
 * or a list of records.  See {@EntityRecord}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var PaneContext=function(){ /**
     *
     * @param paneRef
     * @private
     */function PaneContext(paneRef){this._lastRefreshTime=new Date(0);this._parentContext=null;this._paneRef=null;this._paneRef=paneRef;this._binaryCache={};} /**
     * Updates a settings object with the new settings from a 'Navigation'
     * @param initialSettings
     * @param navRequest
     * @returns {StringDictionary}
     */PaneContext.resolveSettingsFromNavRequest=function(initialSettings,navRequest){var result=util_1.ObjUtil.addAllProps(initialSettings,{});if(navRequest instanceof FormContext){util_1.ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties,result);util_1.ObjUtil.addAllProps(navRequest.offlineProps,result);}else if(navRequest instanceof NullNavRequest){util_1.ObjUtil.addAllProps(navRequest.fromDialogProperties,result);}var destroyed=result['fromDialogDestroyed'];if(destroyed)result['destroyed']=true;return result;};Object.defineProperty(PaneContext.prototype,"actionSource",{ /**
         * Get the action source for this Pane
         * @returns {ActionSource}
         */get:function get(){return this.parentContext?this.parentContext.actionSource:null;},enumerable:true,configurable:true}); /**
     * Load a Binary property from a record
     * @param propName
     * @param entityRec
     * @returns {any}
     */PaneContext.prototype.binaryAt=function(propName,entityRec){var prop=entityRec.propAtName(propName);if(prop){if(prop.value instanceof InlineBinaryRef){var binRef=prop.value;return fp_1.Future.createSuccessfulFuture('binaryAt',new EncodedBinary(binRef.inlineData,binRef.settings['mime-type']));}else if(prop.value instanceof ObjectBinaryRef){var binRef=prop.value;if(binRef.settings['webURL']){return fp_1.Future.createSuccessfulFuture('binaryAt',new UrlBinary(binRef.settings['webURL']));}else {return this.readBinary(propName,entityRec);}}else if(typeof prop.value==='string'){return fp_1.Future.createSuccessfulFuture('binaryAt',new UrlBinary(prop.value));}else {return fp_1.Future.createFailedFuture('binaryAt','No binary found at '+propName);}}else {return fp_1.Future.createFailedFuture('binaryAt','No binary found at '+propName);}};Object.defineProperty(PaneContext.prototype,"dialogAlias",{ /**
         * Get the dialog alias
         * @returns {any}
         */get:function get(){return this.dialogRedirection.dialogProperties['dialogAlias'];},enumerable:true,configurable:true}); /**
     * Find a menu def on this Pane with the given actionId
     * @param actionId
     * @returns {MenuDef}
     */PaneContext.prototype.findMenuDefAt=function(actionId){var result=null;if(this.menuDefs){this.menuDefs.some(function(md){result=md.findAtId(actionId);return result!=null;});}return result;}; /**
     * Get a string representation of this property suitable for 'reading'
     * @param propValue
     * @param propName
     * @returns {string}
     */PaneContext.prototype.formatForRead=function(prop,propName){return PropFormatter.formatForRead(prop,this.propDefAtName(propName));}; /**
     * Get a string representation of this property suitable for 'writing'
     * @param propValue
     * @param propName
     * @returns {string}
     */PaneContext.prototype.formatForWrite=function(prop,propName){return PropFormatter.formatForWrite(prop,this.propDefAtName(propName));};Object.defineProperty(PaneContext.prototype,"formDef",{ /**
         * Get the underlying form definition {@link FormDef} for this Pane.
         * If this is not a {@link FormContext} this will be the {@link FormDef} of the owning/parent Form
         * @returns {FormDef}
         */get:function get(){return this.parentContext.formDef;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"hasError",{ /**
         * Returns whether or not this pane loaded properly
         * @returns {boolean}
         */get:function get(){return this.paneDef instanceof ErrorDef;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"error",{ /**
         * Return the error associated with this pane, if any
         * @returns {any}
         */get:function get(){if(this.hasError){return this.paneDef.exception;}else {return null;}},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"isRefreshNeeded",{ /**
         * Returns whether or not the data in this pane is out of date
         * @returns {boolean}
         */get:function get(){return this._lastRefreshTime.getTime()<AppContext.singleton.lastMaintenanceTime.getTime();},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"lastRefreshTime",{ /**
         * Get the last time this pane's data was refreshed
         * @returns {Date}
         */get:function get(){return this._lastRefreshTime;}, /**
         * @param time
         */set:function set(time){this._lastRefreshTime=time;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"menuDefs",{ /**
         * Get the all {@link MenuDef}'s associated with this Pane
         * @returns {Array<MenuDef>}
         */get:function get(){return this.paneDef.menuDefs;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"offlineCapable",{ /**
         * @private
         * @returns {FormContext|boolean}
         */get:function get(){return this._parentContext&&this._parentContext.offlineCapable;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"paneDef",{ /**
         * Get the underlying @{link PaneDef} associated with this Context
         * @returns {PaneDef}
         */get:function get(){if(this.paneRef==null){return this.formDef.headerDef;}else {return this.formDef.childrenDefs[this.paneRef];}},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"paneRef",{ /**
         * Get the numeric value, representing this Pane's place in the parent {@link FormContext}'s list of child panes.
         * See {@link FormContext.childrenContexts}
         * @returns {number}
         */get:function get(){return this._paneRef;},set:function set(paneRef){this._paneRef=paneRef;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"paneTitle",{ /**
         * Get the title of this Pane
         * @returns {string}
         */get:function get(){return this.paneDef.findTitle();},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"parentContext",{ /**
         * Get the parent {@link FormContext}
         * @returns {FormContext}
         */get:function get(){return this._parentContext;},set:function set(parentContext){this._parentContext=parentContext;this.initialize();},enumerable:true,configurable:true}); /**
     * Parses a value to prepare for 'writing' back to the server
     * @param formattedValue
     * @param propName
     * @returns {any}
     */PaneContext.prototype.parseValue=function(formattedValue,propName){return PropFormatter.parse(formattedValue,this.propDefAtName(propName));}; /**
     * Get the propery definition for a property name
     * @param propName
     * @returns {PropDef}
     */PaneContext.prototype.propDefAtName=function(propName){return this.entityRecDef.propDefAtName(propName);};Object.defineProperty(PaneContext.prototype,"sessionContext",{ /**
         * Get the session information
         * @returns {SessionContext}
         */get:function get(){return this.parentContext.sessionContext;},enumerable:true,configurable:true});Object.defineProperty(PaneContext.prototype,"dialogRedirection",{ /**
         * Get the {@link DialogRedirection} with which this Pane was constructed
         * @returns {DialogRedirection}
         */get:function get(){return this.paneDef.dialogRedirection;},enumerable:true,configurable:true}); //abstract
PaneContext.prototype.initialize=function(){}; /**
     * Read all the Binary values in this {@link EntityRec}
     * @param entityRec
     * @returns {Future<Array<Try<Binary>>>}
     */PaneContext.prototype.readBinaries=function(entityRec){var _this=this;return fp_1.Future.sequence(this.entityRecDef.propDefs.filter(function(propDef){return propDef.isBinaryType;}).map(function(propDef){return _this.readBinary(propDef.name,entityRec);}));};PaneContext.prototype.writeAttachment=function(attachment){return DialogService.addAttachment(this.dialogRedirection.dialogHandle,attachment,this.sessionContext);};PaneContext.prototype.writeAttachments=function(entityRec){var _this=this;return fp_1.Future.sequence(entityRec.props.filter(function(prop){return prop.value instanceof Attachment;}).map(function(prop){var attachment=prop.value;return _this.writeAttachment(attachment);}));}; /**
     * Write all Binary values in this {@link EntityRecord} back to the server
     * @param entityRec
     * @returns {Future<Array<Try<XWritePropertyResult>>>}
     */PaneContext.prototype.writeBinaries=function(entityRec){var _this=this;return fp_1.Future.sequence(entityRec.props.filter(function(prop){return prop.value instanceof EncodedBinary;}).map(function(prop){var ptr=0;var encBin=prop.value;var data=encBin.data;var writeFuture=fp_1.Future.createSuccessfulFuture('startSeq',{});while(ptr<data.length){var boundPtr=function boundPtr(ptr){writeFuture=writeFuture.bind(function(prevResult){var encSegment=ptr+PaneContext.CHAR_CHUNK_SIZE<=data.length?data.substring(ptr,PaneContext.CHAR_CHUNK_SIZE):data.substring(ptr);return DialogService.writeProperty(_this.paneDef.dialogRedirection.dialogHandle,prop.name,encSegment,ptr!=0,_this.sessionContext);});};boundPtr(ptr);ptr+=PaneContext.CHAR_CHUNK_SIZE;}return writeFuture;}));}; //protected
//abstract
PaneContext.prototype.readBinary=function(propName,entityRec){return null;};PaneContext.ANNO_NAME_KEY="com.catavolt.annoName";PaneContext.PROP_NAME_KEY="com.catavolt.propName";PaneContext.CHAR_CHUNK_SIZE=128*1000; //size in chars for encoded 'write' operation
PaneContext.BINARY_CHUNK_SIZE=256*1024; //size in  byes for 'read' operation
return PaneContext;}();exports.PaneContext=PaneContext; /**
 * *********************************
 */ /**
 * PanContext Subtype that represents an 'Editor Pane'.
 * An 'Editor' represents and is backed by a single Record and Record definition.
 * See {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var EditorContext=function(_super){__extends(EditorContext,_super); /**
     * @private
     * @param paneRef
     */function EditorContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(EditorContext.prototype,"buffer",{ /**
         * Get the current buffered record
         * @returns {EntityBuffer}
         */get:function get(){if(!this._buffer){this._buffer=new EntityBuffer(NullEntityRec.singleton);}return this._buffer;},enumerable:true,configurable:true}); /**
     * Toggle the current mode of this Editor
     * @param paneMode
     * @returns {Future<EntityRecDef>}
     */EditorContext.prototype.changePaneMode=function(paneMode){var _this=this;return DialogService.changePaneMode(this.paneDef.dialogHandle,paneMode,this.sessionContext).bind(function(changePaneModeResult){_this.putSettings(changePaneModeResult.dialogProps);if(_this.isDestroyedSetting){_this._editorState=EditorState.DESTROYED;}else {_this.entityRecDef=changePaneModeResult.entityRecDef;if(_this.isReadModeSetting){_this._editorState=EditorState.READ;}else {_this._editorState=EditorState.WRITE;}}return fp_1.Future.createSuccessfulFuture('EditorContext::changePaneMode',_this.entityRecDef);});};Object.defineProperty(EditorContext.prototype,"entityRec",{ /**
         * Get the associated entity record
         * @returns {EntityRec}
         */get:function get(){return this._buffer.toEntityRec();},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"entityRecNow",{ /**
         * Get the current version of the entity record, with any pending changes present
         * @returns {EntityRec}
         */get:function get(){return this.entityRec;},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"entityRecDef",{ /**
         * Get the associated entity record definition
         * @returns {EntityRecDef}
         */get:function get(){return this._entityRecDef;},set:function set(entityRecDef){this._entityRecDef=entityRecDef;},enumerable:true,configurable:true}); /**
     * Get the possible values for a 'constrained value' property
     * @param propName
     * @returns {Future<Array<any>>}
     */EditorContext.prototype.getAvailableValues=function(propName){return DialogService.getAvailableValues(this.paneDef.dialogHandle,propName,this.buffer.afterEffects(),this.sessionContext).map(function(valuesResult){return valuesResult.list;});}; /**
     * Returns whether or not this cell definition contains a binary value
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */EditorContext.prototype.isBinary=function(cellValueDef){var propDef=this.propDefAtName(cellValueDef.propertyName);return propDef&&(propDef.isBinaryType||propDef.isURLType&&cellValueDef.isInlineMediaStyle);};Object.defineProperty(EditorContext.prototype,"isDestroyed",{ /**
         * Returns whether or not this Editor Pane is destroyed
         * @returns {boolean}
         */get:function get(){return this._editorState===EditorState.DESTROYED;},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"isReadMode",{ /**
         * Returns whether or not this Editor is in 'read' mode
         * @returns {boolean}
         */get:function get(){return this._editorState===EditorState.READ;},enumerable:true,configurable:true}); /**
     * Returns whether or not this property is read-only
     * @param propName
     * @returns {boolean}
     */EditorContext.prototype.isReadModeFor=function(propName){if(!this.isReadMode){var propDef=this.propDefAtName(propName);return !propDef||!propDef.maintainable||!propDef.writeEnabled;}return true;};Object.defineProperty(EditorContext.prototype,"isWriteMode",{ /**
         * Returns whether or not this property is 'writable'
         * @returns {boolean}
         */get:function get(){return this._editorState===EditorState.WRITE;},enumerable:true,configurable:true}); /**
     * Perform the action associated with the given MenuDef on this EditorPane.
     * Given that the Editor could possibly be destroyed as a result of this action,
     * any provided pending writes will be saved if present.
     * @param menuDef
     * @param pendingWrites
     * @returns {Future<NavRequest>}
     */EditorContext.prototype.performMenuAction=function(menuDef,pendingWrites){var _this=this;return DialogService.performEditorAction(this.paneDef.dialogHandle,menuDef.actionId,pendingWrites,this.sessionContext).bind(function(redirection){var ca=new ContextAction(menuDef.actionId,_this.parentContext.dialogRedirection.objectId,_this.actionSource);return NavRequestUtil.fromRedirection(redirection,ca,_this.sessionContext).map(function(navRequest){_this._settings=PaneContext.resolveSettingsFromNavRequest(_this._settings,navRequest);if(_this.isDestroyedSetting){_this._editorState=EditorState.DESTROYED;}if(_this.isRefreshSetting){AppContext.singleton.lastMaintenanceTime=new Date();}return navRequest;});});}; /**
     * Properties whose {@link PropDef.canCauseSideEffects} value is true, may change other underlying values in the model.
     * This method will update those underlying values, given the property name that is changing, and the new value.
     * This is frequently used with {@link EditorContext.getAvailableValues}.  When a value is seleted, other properties
     * available values may change. (i.e. Country, State, City dropdowns)
     * @param propertyName
     * @param value
     * @returns {Future<null>}
     */EditorContext.prototype.processSideEffects=function(propertyName,value){var _this=this;var sideEffectsFr=DialogService.processSideEffects(this.paneDef.dialogHandle,this.sessionContext,propertyName,value,this.buffer.afterEffects()).map(function(changeResult){return changeResult.sideEffects?changeResult.sideEffects.entityRec:new NullEntityRec();});return sideEffectsFr.map(function(sideEffectsRec){var originalProps=_this.buffer.before.props;var userEffects=_this.buffer.afterEffects().props;var sideEffects=sideEffectsRec.props;sideEffects=sideEffects.filter(function(prop){return prop.name!==propertyName;});_this._buffer=EntityBuffer.createEntityBuffer(_this.buffer.objectId,EntityRecUtil.union(originalProps,sideEffects),EntityRecUtil.union(originalProps,EntityRecUtil.union(userEffects,sideEffects)));return null;});}; /**
     * Read (load) the {@link EntityRec} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<EntityRec>}
     */EditorContext.prototype.read=function(){var _this=this;return DialogService.readEditorModel(this.paneDef.dialogHandle,this.sessionContext).map(function(readResult){_this.entityRecDef=readResult.entityRecDef;return readResult.entityRec;}).map(function(entityRec){_this.initBuffer(entityRec);_this.lastRefreshTime=new Date();return entityRec;});}; /**
     * Get the requested GPS accuracy
     * @returns {Number}
     */EditorContext.prototype.requestedAccuracy=function(){var accuracyStr=this.paneDef.settings[EditorContext.GPS_ACCURACY];return accuracyStr?Number(accuracyStr):500;}; /**
     * Get the requested GPS timeout in seconds
     * @returns {Number}
     */EditorContext.prototype.requestedTimeoutSeconds=function(){var timeoutStr=this.paneDef.settings[EditorContext.GPS_SECONDS];return timeoutStr?Number(timeoutStr):30;}; /**
     * Set the value of a property in this {@link EntityRecord}.
     * Values may be already constructed target types (CodeRef, TimeValue, Date, etc.)
     * or primitives, in which case the values will be parsed and objects constructed as necessary.
     * @param name
     * @param value
     * @returns {any}
     */EditorContext.prototype.setPropValue=function(name,value){var propDef=this.propDefAtName(name);var parsedValue=null;if(propDef){parsedValue=value!==null&&value!==undefined?this.parseValue(value,propDef.name):null;this.buffer.setValue(propDef.name,parsedValue);}return parsedValue;}; /**
     * Set a binary property from a string formatted as a 'data url'
     * See {@link https://en.wikipedia.org/wiki/Data_URI_scheme}
     * @param name
     * @param dataUrl
     */EditorContext.prototype.setBinaryPropWithDataUrl=function(name,dataUrl){var urlObj=new util_1.DataUrl(dataUrl);this.setBinaryPropWithEncodedData(name,urlObj.data,urlObj.mimeType);}; /**
     * Set a binary property with base64 encoded data
     * @param name
     * @param encodedData
     * @param mimeType
     */EditorContext.prototype.setBinaryPropWithEncodedData=function(name,encodedData,mimeType){var propDef=this.propDefAtName(name);if(propDef){var value=new EncodedBinary(encodedData,mimeType);this.buffer.setValue(propDef.name,value);}}; /**
     * Write this record (i.e. {@link EntityRec}} back to the server
     * @returns {Future<Either<NavRequest, EntityRec>>}
     */EditorContext.prototype.write=function(){var _this=this;var deltaRec=this.buffer.afterEffects(); /* Write the 'special' props first */return this.writeBinaries(deltaRec).bind(function(binResult){return _this.writeAttachments(deltaRec).bind(function(atResult){ /* Remove special property types before writing the actual record */deltaRec=_this.removeSpecialProps(deltaRec);var result=DialogService.writeEditorModel(_this.paneDef.dialogRedirection.dialogHandle,deltaRec,_this.sessionContext).bind(function(either){if(either.isLeft){var ca=new ContextAction('#write',_this.parentContext.dialogRedirection.objectId,_this.actionSource);return NavRequestUtil.fromRedirection(either.left,ca,_this.sessionContext).map(function(navRequest){return fp_1.Either.left(navRequest);});}else {var writeResult=either.right;_this.putSettings(writeResult.dialogProps);_this.entityRecDef=writeResult.entityRecDef;return fp_1.Future.createSuccessfulFuture('EditorContext::write',fp_1.Either.right(writeResult.entityRec));}});return result.map(function(successfulWrite){var now=new Date();AppContext.singleton.lastMaintenanceTime=now;_this.lastRefreshTime=now;if(successfulWrite.isLeft){_this._settings=PaneContext.resolveSettingsFromNavRequest(_this._settings,successfulWrite.left);}else {_this.initBuffer(successfulWrite.right);}if(_this.isDestroyedSetting){_this._editorState=EditorState.DESTROYED;}else {if(_this.isReadModeSetting){_this._editorState=EditorState.READ;}}return successfulWrite;});});});}; //Module level methods
/**
     * @private
     */EditorContext.prototype.initialize=function(){this._entityRecDef=this.paneDef.entityRecDef;this._settings=util_1.ObjUtil.addAllProps(this.dialogRedirection.dialogProperties,{});this._editorState=this.isReadModeSetting?EditorState.READ:EditorState.WRITE;};Object.defineProperty(EditorContext.prototype,"settings",{ /**
         * Get this Editor Pane's settings
         * @returns {StringDictionary}
         */get:function get(){return this._settings;},enumerable:true,configurable:true}); //protected 
EditorContext.prototype.readBinary=function(propName,entityRec){var _this=this;var seq=0;var buffer='';var f=function f(result){buffer+=result.data;if(result.hasMore){return DialogService.readEditorProperty(_this.paneDef.dialogRedirection.dialogHandle,propName,++seq,PaneContext.BINARY_CHUNK_SIZE,_this.sessionContext).bind(f);}else {return fp_1.Future.createSuccessfulFuture('readProperty',new EncodedBinary(buffer));}};return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,propName,seq,PaneContext.BINARY_CHUNK_SIZE,this.sessionContext).bind(f);}; //Private methods
EditorContext.prototype.removeSpecialProps=function(entityRec){entityRec.props=entityRec.props.filter(function(prop){ /* Remove the Binary(s) as they have been written seperately */return !(prop.value instanceof EncodedBinary);}).map(function(prop){ /*
             Remove the Attachment(s) (as they have been written seperately) but replace
             the property value with the file name of the attachment prior to writing
             */if(prop.value instanceof Attachment){var attachment=prop.value;return new Prop(prop.name,attachment.name,prop.annos);}else {return prop;}});return entityRec;};EditorContext.prototype.initBuffer=function(entityRec){this._buffer=entityRec?new EntityBuffer(entityRec):new EntityBuffer(NullEntityRec.singleton);};Object.defineProperty(EditorContext.prototype,"isDestroyedSetting",{get:function get(){var str=this._settings['destroyed'];return str&&str.toLowerCase()==='true';},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"isGlobalRefreshSetting",{get:function get(){var str=this._settings['globalRefresh'];return str&&str.toLowerCase()==='true';},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"isLocalRefreshSetting",{get:function get(){var str=this._settings['localRefresh'];return str&&str.toLowerCase()==='true';},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"isReadModeSetting",{get:function get(){var paneMode=this.paneModeSetting;return paneMode&&paneMode.toLowerCase()==='read';},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"isRefreshSetting",{get:function get(){return this.isLocalRefreshSetting||this.isGlobalRefreshSetting;},enumerable:true,configurable:true});Object.defineProperty(EditorContext.prototype,"paneModeSetting",{get:function get(){return this._settings['paneMode'];},enumerable:true,configurable:true});EditorContext.prototype.putSetting=function(key,value){this._settings[key]=value;};EditorContext.prototype.putSettings=function(settings){util_1.ObjUtil.addAllProps(settings,this._settings);};EditorContext.GPS_ACCURACY='com.catavolt.core.domain.GeoFix.accuracy';EditorContext.GPS_SECONDS='com.catavolt.core.domain.GeoFix.seconds';return EditorContext;}(PaneContext);exports.EditorContext=EditorContext; /**
 * *********************************
 */ /**
 * PaneContext Subtype that represents a Catavolt Form Definition
 * A form is a 'container' composed of child panes of various concrete types.
 * A FormContext parallels this design, and contains a list of 'child' contexts
 * See also {@link FormDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var FormContext=function(_super){__extends(FormContext,_super); /**
     * @private
     * @param _dialogRedirection
     * @param _actionSource
     * @param _formDef
     * @param _childrenContexts
     * @param _offlineCapable
     * @param _offlineData
     * @param _sessionContext
     */function FormContext(_dialogRedirection,_actionSource,_formDef,_childrenContexts,_offlineCapable,_offlineData,_sessionContext){var _this=this;_super.call(this,null);this._dialogRedirection=_dialogRedirection;this._actionSource=_actionSource;this._formDef=_formDef;this._childrenContexts=_childrenContexts;this._offlineCapable=_offlineCapable;this._offlineData=_offlineData;this._sessionContext=_sessionContext;this._destroyed=false;this._offlineProps={};this._childrenContexts=_childrenContexts||[];this._childrenContexts.forEach(function(c){c.parentContext=_this;});}Object.defineProperty(FormContext.prototype,"actionSource",{ /**
         * Get the action source for this Pane
         * @returns {ActionSource}
         */get:function get(){return this.parentContext?this.parentContext.actionSource:this._actionSource;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"childrenContexts",{ /**
         * Get the list of child contexts that 'compose' this Form
         * @returns {Array<PaneContext>}
         */get:function get(){return this._childrenContexts;},enumerable:true,configurable:true}); /**
     * Close this form
     * @returns {Future<VoidResult>}
     */FormContext.prototype.close=function(){return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle,this.sessionContext);};Object.defineProperty(FormContext.prototype,"dialogRedirection",{ /**
         * Get the {@link DialogRedirection} with which this Pane was constructed
         * @returns {DialogRedirection}
         */get:function get(){return this._dialogRedirection;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"entityRecDef",{ /**
         * Get the entity record definition
         * @returns {EntityRecDef}
         */get:function get(){return this.formDef.entityRecDef;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"formDef",{ /**
         * Get the underlying Form definition for this FormContext
         * @returns {FormDef}
         */get:function get(){return this._formDef;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"headerContext",{ /**
         * @private
         */get:function get(){throw new Error('FormContext::headerContext: Needs Impl');},enumerable:true,configurable:true}); /**
     * Perform the action associated with the given MenuDef on this Form
     * @param menuDef
     * @returns {Future<NavRequest>}
     */FormContext.prototype.performMenuAction=function(menuDef){var _this=this;return DialogService.performEditorAction(this.paneDef.dialogHandle,menuDef.actionId,NullEntityRec.singleton,this.sessionContext).bind(function(value){var destroyedStr=value.fromDialogProperties['destroyed'];if(destroyedStr&&destroyedStr.toLowerCase()==='true'){_this._destroyed=true;}var ca=new ContextAction(menuDef.actionId,_this.dialogRedirection.objectId,_this.actionSource);return NavRequestUtil.fromRedirection(value,ca,_this.sessionContext);});};Object.defineProperty(FormContext.prototype,"isDestroyed",{ /**
         * Returns whether or not this Form is destroyed
         * @returns {boolean}
         */get:function get(){return this._destroyed||this.isAnyChildDestroyed;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"offlineCapable",{ /**
         * @private
         * @returns {boolean}
         */get:function get(){return this._offlineCapable;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"menuDefs",{ /**
         * Get the all {@link MenuDef}'s associated with this Pane
         * @returns {Array<MenuDef>}
         */get:function get(){return this.formDef.menuDefs;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"offlineProps",{ /**
         * @private
         * @returns {StringDictionary}
         */get:function get(){return this._offlineProps;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"paneDef",{ /**
         * Get the underlying form definition associated with this FormContext
         * @returns {FormDef}
         */get:function get(){return this.formDef;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"sessionContext",{ /**
         * Get the current session information
         * @returns {SessionContext}
         */get:function get(){return this._sessionContext;},enumerable:true,configurable:true});Object.defineProperty(FormContext.prototype,"isAnyChildDestroyed",{ /** --------------------- MODULE ------------------------------*/ //*** let's pretend this has module level visibility (no such thing (yet!))
/**
         * @private
         * @returns {boolean}
         */get:function get(){return this.childrenContexts.some(function(paneContext){if(paneContext instanceof EditorContext||paneContext instanceof QueryContext){return paneContext.isDestroyed;}return false;});},enumerable:true,configurable:true}); /**
     * @private
     * @param navRequest
     */FormContext.prototype.processNavRequestForDestroyed=function(navRequest){var fromDialogProps={};if(navRequest instanceof FormContext){fromDialogProps=navRequest.offlineProps;}else if(navRequest instanceof NullNavRequest){fromDialogProps=navRequest.fromDialogProperties;}var destroyedStr=fromDialogProps['destroyed'];if(destroyedStr&&destroyedStr.toLowerCase()==='true'){this._destroyed=true;}var fromDialogDestroyed=fromDialogProps['fromDialogDestroyed'];if(fromDialogDestroyed){this._destroyed=true;}};return FormContext;}(PaneContext);exports.FormContext=FormContext; /**
 * *********************************
 */ /**
 * Enum to manage query states
 */var QueryState;(function(QueryState){QueryState[QueryState["ACTIVE"]=0]="ACTIVE";QueryState[QueryState["DESTROYED"]=1]="DESTROYED";})(QueryState||(QueryState={})); /**
 * Enum specifying query direction
 */(function(QueryDirection){QueryDirection[QueryDirection["FORWARD"]=0]="FORWARD";QueryDirection[QueryDirection["BACKWARD"]=1]="BACKWARD";})(exports.QueryDirection||(exports.QueryDirection={}));var QueryDirection=exports.QueryDirection; /**
 * PaneContext Subtype that represents a 'Query Pane'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var QueryContext=function(_super){__extends(QueryContext,_super); /**
     * @private
     * @param paneRef
     * @param _offlineRecs
     * @param _settings
     */function QueryContext(paneRef,_offlineRecs,_settings){if(_offlineRecs===void 0){_offlineRecs=[];}if(_settings===void 0){_settings={};}_super.call(this,paneRef);this._offlineRecs=_offlineRecs;this._settings=_settings;}Object.defineProperty(QueryContext.prototype,"entityRecDef",{ /**
         * Get the entity record definition
         * @returns {EntityRecDef}
         */get:function get(){return this.paneDef.entityRecDef;},enumerable:true,configurable:true}); /**
     * Returns whether or not a column is of a binary type
     * @param columnDef
     * @returns {PropDef|boolean}
     */QueryContext.prototype.isBinary=function(columnDef){var propDef=this.propDefAtName(columnDef.name);return propDef&&(propDef.isBinaryType||propDef.isURLType&&columnDef.isInlineMediaStyle);};Object.defineProperty(QueryContext.prototype,"isDestroyed",{ /**
         * Returns whether or not this Query Pane is destroyed
         * @returns {boolean}
         */get:function get(){return this._queryState===QueryState.DESTROYED;},enumerable:true,configurable:true});Object.defineProperty(QueryContext.prototype,"lastQueryFr",{ /**
         * Get the last query result as a {@link Future}
         * @returns {Future<QueryResult>}
         */get:function get(){return this._lastQueryFr;},enumerable:true,configurable:true});Object.defineProperty(QueryContext.prototype,"offlineRecs",{ /**
         * @private
         * @returns {Array<EntityRec>}
         */get:function get(){return this._offlineRecs;},set:function set(offlineRecs){this._offlineRecs=offlineRecs;},enumerable:true,configurable:true});Object.defineProperty(QueryContext.prototype,"paneMode",{ /**
         * Get the pane mode
         * @returns {string}
         */get:function get(){return this._settings['paneMode'];},enumerable:true,configurable:true}); /**
     * Perform this action associated with the given MenuDef on this Pane.
     * The targets array is expected to be an array of object ids.
     * @param menuDef
     * @param targets
     * @returns {Future<NavRequest>}
     */QueryContext.prototype.performMenuAction=function(menuDef,targets){var _this=this;return DialogService.performQueryAction(this.paneDef.dialogHandle,menuDef.actionId,targets,this.sessionContext).bind(function(redirection){var target=targets.length>0?targets[0]:null;var ca=new ContextAction(menuDef.actionId,target,_this.actionSource);return NavRequestUtil.fromRedirection(redirection,ca,_this.sessionContext);}).map(function(navRequest){_this._settings=PaneContext.resolveSettingsFromNavRequest(_this._settings,navRequest);if(_this.isDestroyedSetting){_this._queryState=QueryState.DESTROYED;}return navRequest;});}; /**
     * Perform a query
     * Note: {@link QueryScroller} is the preferred way to perform a query.
     * see {@link QueryContext.newScroller} and {@link QueryContext.setScroller}
     * @param maxRows
     * @param direction
     * @param fromObjectId
     * @returns {Future<QueryResult>}
     */QueryContext.prototype.query=function(maxRows,direction,fromObjectId){var _this=this;return DialogService.queryQueryModel(this.paneDef.dialogHandle,direction,maxRows,fromObjectId,this.sessionContext).bind(function(value){var result=new QueryResult(value.entityRecs,value.hasMore);if(_this.lastRefreshTime===new Date(0)){_this.lastRefreshTime=new Date();}return fp_1.Future.createSuccessfulFuture('QueryContext::query',result);});}; /**
     * Clear the QueryScroller's buffer and perform this query
     * @returns {Future<Array<EntityRec>>}
     */QueryContext.prototype.refresh=function(){return this._scroller.refresh();};Object.defineProperty(QueryContext.prototype,"scroller",{ /**
         * Get the associated QueryScroller
         * @returns {QueryScroller}
         */get:function get(){if(!this._scroller){this._scroller=this.newScroller();}return this._scroller;},enumerable:true,configurable:true}); /**
     * Creates a new QueryScroller with the given values
     * @param pageSize
     * @param firstObjectId
     * @param markerOptions
     * @returns {QueryScroller}
     */QueryContext.prototype.setScroller=function(pageSize,firstObjectId,markerOptions){this._scroller=new QueryScroller(this,pageSize,firstObjectId,markerOptions);return this._scroller;}; /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */QueryContext.prototype.newScroller=function(){return this.setScroller(50,null,[QueryMarkerOption.None]);}; /**
     * Get the settings associated with this Query
     * @returns {StringDictionary}
     */QueryContext.prototype.settings=function(){return this._settings;}; //protected 
QueryContext.prototype.readBinary=function(propName,entityRec){var _this=this;var seq=0;var buffer='';var f=function f(result){buffer+=result.data;if(result.hasMore){return DialogService.readQueryProperty(_this.paneDef.dialogRedirection.dialogHandle,propName,entityRec.objectId,++seq,PaneContext.BINARY_CHUNK_SIZE,_this.sessionContext).bind(f);}else {return fp_1.Future.createSuccessfulFuture('readProperty',new EncodedBinary(buffer));}};return DialogService.readQueryProperty(this.paneDef.dialogRedirection.dialogHandle,propName,entityRec.objectId,seq,PaneContext.BINARY_CHUNK_SIZE,this.sessionContext).bind(f);};Object.defineProperty(QueryContext.prototype,"isDestroyedSetting",{get:function get(){var str=this._settings['destroyed'];return str&&str.toLowerCase()==='true';},enumerable:true,configurable:true});Object.defineProperty(QueryContext.prototype,"isGlobalRefreshSetting",{get:function get(){var str=this._settings['globalRefresh'];return str&&str.toLowerCase()==='true';},enumerable:true,configurable:true});Object.defineProperty(QueryContext.prototype,"isLocalRefreshSetting",{get:function get(){var str=this._settings['localRefresh'];return str&&str.toLowerCase()==='true';},enumerable:true,configurable:true});Object.defineProperty(QueryContext.prototype,"isRefreshSetting",{get:function get(){return this.isLocalRefreshSetting||this.isGlobalRefreshSetting;},enumerable:true,configurable:true});return QueryContext;}(PaneContext);exports.QueryContext=QueryContext; /**
 * EditorContext Subtype that represents a 'BarcodeScan Pane'.
 * A Barcode Scan is an Editor Pane with the purpose of displaying property values for a single record that
 * represents barcode information.
 * See {@link GeoLocationDef}, {@link EntityRec} and {@link EntityRecDef}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}.
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var BarcodeScanContext=function(_super){__extends(BarcodeScanContext,_super);function BarcodeScanContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(BarcodeScanContext.prototype,"barcodeScanDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return BarcodeScanContext;}(EditorContext);exports.BarcodeScanContext=BarcodeScanContext; /**
 * EditorContext Subtype that represents a 'Details Pane'.
 * A Details Pane is an Editor Pane with the purpose of displaying property values for a single record,
 * usually as names/values in a tabular arrangement.
 * See {@link DetailsDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var DetailsContext=function(_super){__extends(DetailsContext,_super);function DetailsContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(DetailsContext.prototype,"detailsDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});Object.defineProperty(DetailsContext.prototype,"printMarkupURL",{get:function get(){return this.paneDef.dialogRedirection.dialogProperties['formsURL'];},enumerable:true,configurable:true});return DetailsContext;}(EditorContext);exports.DetailsContext=DetailsContext; /**
 * EditorContext Subtype that represents a 'GeoFix Pane'.
 * A GeoFix Pane is an Editor Pane with the purpose of displaying property values for a single record that
 * represents a GPS location
 * See {@link GeoFixDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var GeoFixContext=function(_super){__extends(GeoFixContext,_super);function GeoFixContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(GeoFixContext.prototype,"geoFixDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return GeoFixContext;}(EditorContext);exports.GeoFixContext=GeoFixContext; /**
 * EditorContext Subtype that represents a 'GeoLocation Pane'.
 * A GeoLocation Pane is an Editor Pane with the purpose of displaying property values for a single record that
 * represents a GPS location
 * See {@link GeoLocationDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var GeoLocationContext=function(_super){__extends(GeoLocationContext,_super);function GeoLocationContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(GeoLocationContext.prototype,"geoLocationDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return GeoLocationContext;}(EditorContext);exports.GeoLocationContext=GeoLocationContext; /**
 * QueryContext Subtype that represents a 'Calendar Pane'.
 * A 'Calendar' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying Calendar related information.
 * See {@link CalendarDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var CalendarContext=function(_super){__extends(CalendarContext,_super);function CalendarContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(CalendarContext.prototype,"calendarDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return CalendarContext;}(QueryContext);exports.CalendarContext=CalendarContext; /**
 * QueryContext Subtype that represents a 'Graph Pane'.
 * A 'Graph' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying graphs and charts.
 * See {@link GraphDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var GraphContext=function(_super){__extends(GraphContext,_super);function GraphContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(GraphContext.prototype,"graphDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return GraphContext;}(QueryContext);exports.GraphContext=GraphContext; /**
* QueryContext Subtype that represents an 'Image Picker Pane'.
* An 'Image Picker' is a type of query backed by a list of Records and a single Record definition, with the
* purpose of displaying an Image Picker component.
* See {@link ImagePickerDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
*/var ImagePickerContext=function(_super){__extends(ImagePickerContext,_super);function ImagePickerContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(ImagePickerContext.prototype,"imagePickerDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return ImagePickerContext;}(QueryContext);exports.ImagePickerContext=ImagePickerContext; /**
 * QueryContext Subtype that represents a 'List Pane'.
 * An 'List' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying a tabular list of records.
 * See {@link ListDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var ListContext=function(_super){__extends(ListContext,_super);function ListContext(paneRef,offlineRecs,settings){if(offlineRecs===void 0){offlineRecs=[];}if(settings===void 0){settings={};}_super.call(this,paneRef,offlineRecs,settings);}Object.defineProperty(ListContext.prototype,"columnHeadings",{get:function get(){return this.listDef.activeColumnDefs.map(function(cd){return cd.heading;});},enumerable:true,configurable:true});Object.defineProperty(ListContext.prototype,"listDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});ListContext.prototype.rowValues=function(entityRec){return this.listDef.activeColumnDefs.map(function(cd){return entityRec.valueAtName(cd.name);});};Object.defineProperty(ListContext.prototype,"style",{get:function get(){return this.listDef.style;},enumerable:true,configurable:true});return ListContext;}(QueryContext);exports.ListContext=ListContext; /**
 * QueryContext Subtype that represents a 'Map Pane'.
 * A 'Map' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying an annotated map with location markers.
 * See {@link MapDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */var MapContext=function(_super){__extends(MapContext,_super);function MapContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(MapContext.prototype,"mapDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return MapContext;}(QueryContext);exports.MapContext=MapContext;var PrintMarkupContext=function(_super){__extends(PrintMarkupContext,_super);function PrintMarkupContext(paneRef){_super.call(this,paneRef);}Object.defineProperty(PrintMarkupContext.prototype,"printMarkupDef",{get:function get(){return this.paneDef;},enumerable:true,configurable:true});return PrintMarkupContext;}(EditorContext);exports.PrintMarkupContext=PrintMarkupContext; /**
 * A PaneDef represents a Catavolt 'Pane' definition.  A Pane can be thought of as a 'panel' or UI component
 * that is responsible for displaying a data record or records. The Pane describes 'how' and 'where' the data will be
 * displayed, as well as surrounding 'meta' data (i.e. the Pane title, the Pane's menus).  The Pane itself does not contain
 * the record or records to be displayed, but may be combined with a {@link EntityRecord}(s) to display the data.
 */var PaneDef=function(){ /**
     * @private
     * @param _paneId
     * @param _name
     * @param _label
     * @param _title
     * @param _menuDefs
     * @param _entityRecDef
     * @param _dialogRedirection
     * @param _settings
     */function PaneDef(_paneId,_name,_label,_title,_menuDefs,_entityRecDef,_dialogRedirection,_settings){this._paneId=_paneId;this._name=_name;this._label=_label;this._title=_title;this._menuDefs=_menuDefs;this._entityRecDef=_entityRecDef;this._dialogRedirection=_dialogRedirection;this._settings=_settings;} /**
     * @private
     * @param childXOpenResult
     * @param childXComp
     * @param childXPaneDefRef
     * @param childXPaneDef
     * @param childXActiveColDefs
     * @param childMenuDefs
     * @returns {any}
     */PaneDef.fromOpenPaneResult=function(childXOpenResult,childXComp,childXPaneDefRef,childXPaneDef,childXActiveColDefs,childMenuDefs,printMarkupXML){var settings={};util_1.ObjUtil.addAllProps(childXComp.redirection.dialogProperties,settings);var newPaneDef;if(childXOpenResult instanceof XOpenDialogModelErrorResult){var xOpenDialogModelErrorResult=childXOpenResult;newPaneDef=new ErrorDef(childXComp.redirection,settings,xOpenDialogModelErrorResult.exception);}else if(childXPaneDef instanceof XListDef){var xListDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new ListDef(xListDef.paneId,xListDef.name,childXComp.label,xListDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xListDef.style,xListDef.initialColumns,childXActiveColDefs.columnDefs,xListDef.columnsStyle,xOpenQueryModelResult.defaultActionId,xListDef.graphicalMarkup);}else if(childXPaneDef instanceof XDetailsDef){var xDetailsDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;if(printMarkupXML){newPaneDef=new PrintMarkupDef(xDetailsDef.paneId,xDetailsDef.name,childXComp.label,xDetailsDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings,xDetailsDef.cancelButtonText,xDetailsDef.commitButtonText,xDetailsDef.editable,xDetailsDef.focusPropertyName,printMarkupXML,xDetailsDef.rows);}else {newPaneDef=new DetailsDef(xDetailsDef.paneId,xDetailsDef.name,childXComp.label,xDetailsDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings,xDetailsDef.cancelButtonText,xDetailsDef.commitButtonText,xDetailsDef.editable,xDetailsDef.focusPropertyName,xDetailsDef.graphicalMarkup,xDetailsDef.rows);}}else if(childXPaneDef instanceof XMapDef){var xMapDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new MapDef(xMapDef.paneId,xMapDef.name,childXComp.label,xMapDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xMapDef.descriptionProperty,xMapDef.streetProperty,xMapDef.cityProperty,xMapDef.stateProperty,xMapDef.postalCodeProperty,xMapDef.latitudeProperty,xMapDef.longitudeProperty);}else if(childXPaneDef instanceof XGraphDef){var xGraphDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new GraphDef(xGraphDef.paneId,xGraphDef.name,childXComp.label,xGraphDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xOpenQueryModelResult.defaultActionId,xGraphDef.graphType,xGraphDef.displayQuadrantLines,xGraphDef.identityDataPoint,xGraphDef.groupingDataPoint,xGraphDef.dataPoints,xGraphDef.filterDataPoints,xGraphDef.sampleModel,xGraphDef.xAxisLabel,xGraphDef.xAxisRangeFrom,xGraphDef.xAxisRangeTo,xGraphDef.yAxisLabel,xGraphDef.yAxisRangeFrom,xGraphDef.yAxisRangeTo);}else if(childXPaneDef instanceof XBarcodeScanDef){var xBarcodeScanDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new BarcodeScanDef(xBarcodeScanDef.paneId,xBarcodeScanDef.name,childXComp.label,xBarcodeScanDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings);}else if(childXPaneDef instanceof XGeoFixDef){var xGeoFixDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new GeoFixDef(xGeoFixDef.paneId,xGeoFixDef.name,childXComp.label,xGeoFixDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings);}else if(childXPaneDef instanceof XGeoLocationDef){var xGeoLocationDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new GeoLocationDef(xGeoLocationDef.paneId,xGeoLocationDef.name,childXComp.label,xGeoLocationDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings);}else if(childXPaneDef instanceof XCalendarDef){var xCalendarDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new CalendarDef(xCalendarDef.paneId,xCalendarDef.name,childXComp.label,xCalendarDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xCalendarDef.descriptionProperty,xCalendarDef.initialStyle,xCalendarDef.startDateProperty,xCalendarDef.startTimeProperty,xCalendarDef.endDateProperty,xCalendarDef.endTimeProperty,xCalendarDef.occurDateProperty,xCalendarDef.occurTimeProperty,xOpenQueryModelResult.defaultActionId);}else if(childXPaneDef instanceof XImagePickerDef){var xImagePickerDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new ImagePickerDef(xImagePickerDef.paneId,xImagePickerDef.name,childXComp.label,xImagePickerDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xImagePickerDef.URLProperty,xImagePickerDef.defaultActionId);}else {return new fp_1.Failure('PaneDef::fromOpenPaneResult needs impl for: '+util_1.ObjUtil.formatRecAttr(childXPaneDef));}return new fp_1.Success(newPaneDef);};Object.defineProperty(PaneDef.prototype,"dialogHandle",{ /**
         * Get the {@link DialogHandle} associated with this PaneDef
         * @returns {DialogHandle}
         */get:function get(){return this._dialogRedirection.dialogHandle;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"dialogRedirection",{ /**
         * Get the {@link DialogRedirection} with which this Pane was constructed
         * @returns {DialogRedirection}
         */get:function get(){return this._dialogRedirection;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"entityRecDef",{ /**
         * Get the entity record definition
         * @returns {EntityRecDef}
         */get:function get(){return this._entityRecDef;},enumerable:true,configurable:true}); /**
     * Find the title for this Pane
     * @returns {string}
     */PaneDef.prototype.findTitle=function(){var result=this._title?this._title.trim():'';result=result==='null'?'':result;if(result===''){result=this._label?this._label.trim():'';result=result==='null'?'':result;}return result;};Object.defineProperty(PaneDef.prototype,"label",{ /**
         * Get the label for this Pane
         * @returns {string}
         */get:function get(){return this._label;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"menuDefs",{ /**
         * Get the all {@link MenuDef}'s associated with this Pane
         * @returns {Array<MenuDef>}
         */get:function get(){return this._menuDefs;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"paneId",{get:function get(){return this._paneId;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"settings",{get:function get(){return this._settings;},enumerable:true,configurable:true});Object.defineProperty(PaneDef.prototype,"title",{get:function get(){return this._title;},enumerable:true,configurable:true});return PaneDef;}();exports.PaneDef=PaneDef; /**
 * PaneDef Subtype that describes a Barcode Pane
 */var BarcodeScanDef=function(_super){__extends(BarcodeScanDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */function BarcodeScanDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);}return BarcodeScanDef;}(PaneDef);exports.BarcodeScanDef=BarcodeScanDef; /**
 * PaneDef Subtype that describes a Calendar Pane
 */var CalendarDef=function(_super){__extends(CalendarDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _descriptionPropName
     * @param _initialStyle
     * @param _startDatePropName
     * @param _startTimePropName
     * @param _endDatePropName
     * @param _endTimePropName
     * @param _occurDatePropName
     * @param _occurTimePropName
     * @param _defaultActionId
     */function CalendarDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_descriptionPropName,_initialStyle,_startDatePropName,_startTimePropName,_endDatePropName,_endTimePropName,_occurDatePropName,_occurTimePropName,_defaultActionId){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._descriptionPropName=_descriptionPropName;this._initialStyle=_initialStyle;this._startDatePropName=_startDatePropName;this._startTimePropName=_startTimePropName;this._endDatePropName=_endDatePropName;this._endTimePropName=_endTimePropName;this._occurDatePropName=_occurDatePropName;this._occurTimePropName=_occurTimePropName;this._defaultActionId=_defaultActionId;}Object.defineProperty(CalendarDef.prototype,"descriptionPropName",{get:function get(){return this._descriptionPropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"initialStyle",{get:function get(){return this._initialStyle;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"startDatePropName",{get:function get(){return this._startDatePropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"startTimePropName",{get:function get(){return this._startTimePropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"endDatePropName",{get:function get(){return this._endDatePropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"endTimePropName",{get:function get(){return this._endTimePropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"occurDatePropName",{get:function get(){return this._occurDatePropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"occurTimePropName",{get:function get(){return this._occurTimePropName;},enumerable:true,configurable:true});Object.defineProperty(CalendarDef.prototype,"defaultActionId",{get:function get(){return this._defaultActionId;},enumerable:true,configurable:true});return CalendarDef;}(PaneDef);exports.CalendarDef=CalendarDef; /**
 * PaneDef Subtype that describes a Details Pane
 */var DetailsDef=function(_super){__extends(DetailsDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _cancelButtonText
     * @param _commitButtonText
     * @param _editable
     * @param _focusPropName
     * @param _graphicalMarkup
     * @param _rows
     */function DetailsDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_cancelButtonText,_commitButtonText,_editable,_focusPropName,_graphicalMarkup,_rows){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._cancelButtonText=_cancelButtonText;this._commitButtonText=_commitButtonText;this._editable=_editable;this._focusPropName=_focusPropName;this._graphicalMarkup=_graphicalMarkup;this._rows=_rows;}Object.defineProperty(DetailsDef.prototype,"cancelButtonText",{get:function get(){return this._cancelButtonText;},enumerable:true,configurable:true});Object.defineProperty(DetailsDef.prototype,"commitButtonText",{get:function get(){return this._commitButtonText;},enumerable:true,configurable:true});Object.defineProperty(DetailsDef.prototype,"editable",{get:function get(){return this._editable;},enumerable:true,configurable:true});Object.defineProperty(DetailsDef.prototype,"focusPropName",{get:function get(){return this._focusPropName;},enumerable:true,configurable:true});Object.defineProperty(DetailsDef.prototype,"graphicalMarkup",{get:function get(){return this._graphicalMarkup;},enumerable:true,configurable:true});Object.defineProperty(DetailsDef.prototype,"rows",{get:function get(){return this._rows;},enumerable:true,configurable:true});return DetailsDef;}(PaneDef);exports.DetailsDef=DetailsDef; /**
 * PaneDef Subtype that represents an error
 */var ErrorDef=function(_super){__extends(ErrorDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */function ErrorDef(dialogRedirection,settings,exception){_super.call(this,null,null,null,null,null,null,dialogRedirection,settings);this.exception=exception;}return ErrorDef;}(PaneDef);exports.ErrorDef=ErrorDef; /**
 * PaneDef Subtype that describes a Form Pane
 */var FormDef=function(_super){__extends(FormDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _formLayout
     * @param _formStyle
     * @param _borderStyle
     * @param _headerDef
     * @param _childrenDefs
     */function FormDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_formLayout,_formStyle,_borderStyle,_headerDef,_childrenDefs){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._formLayout=_formLayout;this._formStyle=_formStyle;this._borderStyle=_borderStyle;this._headerDef=_headerDef;this._childrenDefs=_childrenDefs;} /**
     * @private
     * @param formXOpenResult
     * @param formXFormDef
     * @param formMenuDefs
     * @param childrenXOpens
     * @param childrenXPaneDefs
     * @param childrenXActiveColDefs
     * @param childrenMenuDefs
     * @returns {any}
     */FormDef.fromOpenFormResult=function(formXOpenResult,formXFormDef,formMenuDefs,childrenXOpens,childrenXPaneDefs,childrenXActiveColDefs,childrenMenuDefs,childrenPrintMarkupXML){var settings={'open':true};util_1.ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties,settings);var headerDef=null;var childrenDefs=[];for(var i=0;i<childrenXOpens.length;i++){var childXOpen=childrenXOpens[i];var childXPaneDef=childrenXPaneDefs[i];var childXActiveColDefs=childrenXActiveColDefs[i];var childMenuDefs=childrenMenuDefs[i];var childXComp=formXOpenResult.formModel.children[i];var childXPaneDefRef=formXFormDef.paneDefRefs[i];var childPrintMarkupXML=childrenPrintMarkupXML[i];var paneDefTry=PaneDef.fromOpenPaneResult(childXOpen,childXComp,childXPaneDefRef,childXPaneDef,childXActiveColDefs,childMenuDefs,childPrintMarkupXML);if(paneDefTry.isFailure){return new fp_1.Failure(paneDefTry.failure);}else {childrenDefs.push(paneDefTry.success);}}return new fp_1.Success(new FormDef(formXFormDef.paneId,formXFormDef.name,formXOpenResult.formModel.form.label,formXFormDef.title,formMenuDefs,formXOpenResult.entityRecDef,formXOpenResult.formRedirection,settings,formXFormDef.formLayout,formXFormDef.formStyle,formXFormDef.borderStyle,headerDef,childrenDefs));};Object.defineProperty(FormDef.prototype,"borderStyle",{get:function get(){return this._borderStyle;},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"childrenDefs",{get:function get(){return this._childrenDefs;},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"formLayout",{get:function get(){return this._formLayout;},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"formStyle",{get:function get(){return this._formStyle;},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"headerDef",{get:function get(){return this._headerDef;},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isCompositeForm",{get:function get(){return this.formStyle==='COMPOSITE_FORM';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isFlowingLayout",{get:function get(){return this.formLayout&&this.formLayout==='FLOWING';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isFlowingTopDownLayout",{get:function get(){return this.formLayout&&this.formLayout==='FLOWING_TOP_DOWN';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isFourBoxSquareLayout",{get:function get(){return this.formLayout&&this.formLayout==='FOUR_BOX_SQUARE';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isHorizontalLayout",{get:function get(){return this.formLayout&&this.formLayout==='H';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isOptionsFormLayout",{get:function get(){return this.formLayout&&this.formLayout==='OPTIONS_FORM';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isTabsLayout",{get:function get(){return this.formLayout&&this.formLayout==='TABS';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isThreeBoxOneLeftLayout",{get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_LEFT';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isThreeBoxOneOverLayout",{get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_OVER';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isThreeBoxOneRightLayout",{get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_RIGHT';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isThreeBoxOneUnderLayout",{get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_UNDER';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isTopDownLayout",{get:function get(){return this.formLayout&&this.formLayout==='TOP_DOWN';},enumerable:true,configurable:true});Object.defineProperty(FormDef.prototype,"isTwoVerticalLayout",{get:function get(){return this.formLayout&&this.formLayout==='H(2,V)';},enumerable:true,configurable:true});return FormDef;}(PaneDef);exports.FormDef=FormDef; /**
 * PaneDef Subtype that describes a GeoFix Pane
 */var GeoFixDef=function(_super){__extends(GeoFixDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */function GeoFixDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);}return GeoFixDef;}(PaneDef);exports.GeoFixDef=GeoFixDef; /**
 * *********************************
 */ /**
 * PaneDef Subtype that describes a GeoLocation Pane
 */var GeoLocationDef=function(_super){__extends(GeoLocationDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */function GeoLocationDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);}return GeoLocationDef;}(PaneDef);exports.GeoLocationDef=GeoLocationDef; /**
 * PaneDef Subtype that describes a Graph Pane
 */var GraphDef=function(_super){__extends(GraphDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _defaultActionId
     * @param _graphType
     * @param _displayQuadrantLines
     * @param _identityDataPointDef
     * @param _groupingDataPointDef
     * @param _dataPointDefs
     * @param _filterDataPointDefs
     * @param _sampleModel
     * @param _xAxisLabel
     * @param _xAxisRangeFrom
     * @param _xAxisRangeTo
     * @param _yAxisLabel
     * @param _yAxisRangeFrom
     * @param _yAxisRangeTo
     */function GraphDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_defaultActionId,_graphType,_displayQuadrantLines,_identityDataPointDef,_groupingDataPointDef,_dataPointDefs,_filterDataPointDefs,_sampleModel,_xAxisLabel,_xAxisRangeFrom,_xAxisRangeTo,_yAxisLabel,_yAxisRangeFrom,_yAxisRangeTo){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._defaultActionId=_defaultActionId;this._graphType=_graphType;this._displayQuadrantLines=_displayQuadrantLines;this._identityDataPointDef=_identityDataPointDef;this._groupingDataPointDef=_groupingDataPointDef;this._dataPointDefs=_dataPointDefs;this._filterDataPointDefs=_filterDataPointDefs;this._sampleModel=_sampleModel;this._xAxisLabel=_xAxisLabel;this._xAxisRangeFrom=_xAxisRangeFrom;this._xAxisRangeTo=_xAxisRangeTo;this._yAxisLabel=_yAxisLabel;this._yAxisRangeFrom=_yAxisRangeFrom;this._yAxisRangeTo=_yAxisRangeTo;}Object.defineProperty(GraphDef.prototype,"dataPointDefs",{get:function get(){return this._dataPointDefs;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"defaultActionId",{get:function get(){return this._defaultActionId;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"displayQuadrantLines",{get:function get(){return this._displayQuadrantLines;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"filterDataPointDefs",{get:function get(){return this._filterDataPointDefs;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"identityDataPointDef",{get:function get(){return this._identityDataPointDef;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"graphType",{get:function get(){return this._graphType;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"groupingDataPointDef",{get:function get(){return this._groupingDataPointDef;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"sampleModel",{get:function get(){return this._sampleModel;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"xAxisLabel",{get:function get(){return this._xAxisLabel;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"xAxisRangeFrom",{get:function get(){return this._xAxisRangeFrom;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"xAxisRangeTo",{get:function get(){return this._xAxisRangeTo;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"yAxisLabel",{get:function get(){return this._yAxisLabel;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"yAxisRangeFrom",{get:function get(){return this._yAxisRangeFrom;},enumerable:true,configurable:true});Object.defineProperty(GraphDef.prototype,"yAxisRangeTo",{get:function get(){return this._yAxisRangeTo;},enumerable:true,configurable:true});GraphDef.GRAPH_TYPE_CARTESIAN="GRAPH_TYPE_BAR";GraphDef.GRAPH_TYPE_PIE="GRAPH_TYPE_PIE";GraphDef.PLOT_TYPE_BAR="BAR";GraphDef.PLOT_TYPE_BUBBLE="BUBBLE";GraphDef.PLOT_TYPE_LINE="LINE";GraphDef.PLOT_TYPE_SCATTER="SCATTER";GraphDef.PLOT_TYPE_STACKED="STACKED";return GraphDef;}(PaneDef);exports.GraphDef=GraphDef; /**
 * PaneDef Subtype that describes a ImagePicker Pane
 */var ImagePickerDef=function(_super){__extends(ImagePickerDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _URLPropName
     * @param _defaultActionId
     */function ImagePickerDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_URLPropName,_defaultActionId){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._URLPropName=_URLPropName;this._defaultActionId=_defaultActionId;}Object.defineProperty(ImagePickerDef.prototype,"defaultActionId",{get:function get(){return this._defaultActionId;},enumerable:true,configurable:true});Object.defineProperty(ImagePickerDef.prototype,"URLPropName",{get:function get(){return this._URLPropName;},enumerable:true,configurable:true});return ImagePickerDef;}(PaneDef);exports.ImagePickerDef=ImagePickerDef; /**
 * PaneDef Subtype that describes a List Pane
 */var ListDef=function(_super){__extends(ListDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _style
     * @param _initialColumns
     * @param _activeColumnDefs
     * @param _columnsStyle
     * @param _defaultActionId
     * @param _graphicalMarkup
     */function ListDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_style,_initialColumns,_activeColumnDefs,_columnsStyle,_defaultActionId,_graphicalMarkup){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._style=_style;this._initialColumns=_initialColumns;this._activeColumnDefs=_activeColumnDefs;this._columnsStyle=_columnsStyle;this._defaultActionId=_defaultActionId;this._graphicalMarkup=_graphicalMarkup;}Object.defineProperty(ListDef.prototype,"activeColumnDefs",{get:function get(){return this._activeColumnDefs;},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"columnsStyle",{get:function get(){return this._columnsStyle;},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"defaultActionId",{get:function get(){return this._defaultActionId;},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"graphicalMarkup",{get:function get(){return this._graphicalMarkup;},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"initialColumns",{get:function get(){return this._initialColumns;},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"isDefaultStyle",{get:function get(){return this.style&&this.style==='DEFAULT';},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"isDetailsFormStyle",{get:function get(){return this.style&&this.style==='DETAILS_FORM';},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"isFormStyle",{get:function get(){return this.style&&this.style==='FORM';},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"isTabularStyle",{get:function get(){return this.style&&this.style==='TABULAR';},enumerable:true,configurable:true});Object.defineProperty(ListDef.prototype,"style",{get:function get(){return this._style;},enumerable:true,configurable:true});return ListDef;}(PaneDef);exports.ListDef=ListDef; /**
 * PaneDef Subtype that describes a Map Pane
 */var MapDef=function(_super){__extends(MapDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _descriptionPropName
     * @param _streetPropName
     * @param _cityPropName
     * @param _statePropName
     * @param _postalCodePropName
     * @param _latitudePropName
     * @param _longitudePropName
     */function MapDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_descriptionPropName,_streetPropName,_cityPropName,_statePropName,_postalCodePropName,_latitudePropName,_longitudePropName){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._descriptionPropName=_descriptionPropName;this._streetPropName=_streetPropName;this._cityPropName=_cityPropName;this._statePropName=_statePropName;this._postalCodePropName=_postalCodePropName;this._latitudePropName=_latitudePropName;this._longitudePropName=_longitudePropName;}Object.defineProperty(MapDef.prototype,"cityPropName",{get:function get(){return this._cityPropName;},enumerable:true,configurable:true});Object.defineProperty(MapDef.prototype,"descriptionPropName",{get:function get(){return this._descriptionPropName;},enumerable:true,configurable:true});Object.defineProperty(MapDef.prototype,"latitudePropName",{get:function get(){return this._latitudePropName;},enumerable:true,configurable:true});Object.defineProperty(MapDef.prototype,"longitudePropName",{get:function get(){return this._longitudePropName;},enumerable:true,configurable:true});Object.defineProperty(MapDef.prototype,"postalCodePropName",{get:function get(){return this._postalCodePropName;},enumerable:true,configurable:true});Object.defineProperty(MapDef.prototype,"statePropName",{get:function get(){return this._statePropName;},enumerable:true,configurable:true});Object.defineProperty(MapDef.prototype,"streetPropName",{get:function get(){return this._streetPropName;},enumerable:true,configurable:true});return MapDef;}(PaneDef);exports.MapDef=MapDef; /**
 * *********************************
 */ /**
 * PaneDef Subtype that describes a Details Pane to be displayed as form
 */var PrintMarkupDef=function(_super){__extends(PrintMarkupDef,_super); /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _cancelButtonText
     * @param _commitButtonText
     * @param _editable
     * @param _focusPropName
     * @param _printMarkup
     * @param _rows
     */function PrintMarkupDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_cancelButtonText,_commitButtonText,_editable,_focusPropName,_printMarkupXML,_rows){_super.call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings);this._cancelButtonText=_cancelButtonText;this._commitButtonText=_commitButtonText;this._editable=_editable;this._focusPropName=_focusPropName;this._printMarkupXML=_printMarkupXML;this._rows=_rows;}Object.defineProperty(PrintMarkupDef.prototype,"cancelButtonText",{get:function get(){return this._cancelButtonText;},enumerable:true,configurable:true});Object.defineProperty(PrintMarkupDef.prototype,"commitButtonText",{get:function get(){return this._commitButtonText;},enumerable:true,configurable:true});Object.defineProperty(PrintMarkupDef.prototype,"editable",{get:function get(){return this._editable;},enumerable:true,configurable:true});Object.defineProperty(PrintMarkupDef.prototype,"focusPropName",{get:function get(){return this._focusPropName;},enumerable:true,configurable:true});Object.defineProperty(PrintMarkupDef.prototype,"printMarkupXML",{get:function get(){return this._printMarkupXML;},enumerable:true,configurable:true});Object.defineProperty(PrintMarkupDef.prototype,"rows",{get:function get(){return this._rows;},enumerable:true,configurable:true});return PrintMarkupDef;}(PaneDef);exports.PrintMarkupDef=PrintMarkupDef; /**
 * *********************************
 */var BinaryRef=function(){function BinaryRef(_settings){this._settings=_settings;}BinaryRef.fromWSValue=function(encodedValue,settings){if(encodedValue&&encodedValue.length>0){return new fp_1.Success(new InlineBinaryRef(encodedValue,settings));}else {return new fp_1.Success(new ObjectBinaryRef(settings));}};Object.defineProperty(BinaryRef.prototype,"settings",{get:function get(){return this._settings;},enumerable:true,configurable:true});return BinaryRef;}();exports.BinaryRef=BinaryRef;var InlineBinaryRef=function(_super){__extends(InlineBinaryRef,_super);function InlineBinaryRef(_inlineData,settings){_super.call(this,settings);this._inlineData=_inlineData;}Object.defineProperty(InlineBinaryRef.prototype,"inlineData",{ /* Base64 encoded data */get:function get(){return this._inlineData;},enumerable:true,configurable:true});InlineBinaryRef.prototype.toString=function(){return this._inlineData;};return InlineBinaryRef;}(BinaryRef);exports.InlineBinaryRef=InlineBinaryRef;var ObjectBinaryRef=function(_super){__extends(ObjectBinaryRef,_super);function ObjectBinaryRef(settings){_super.call(this,settings);}return ObjectBinaryRef;}(BinaryRef);exports.ObjectBinaryRef=ObjectBinaryRef; /**
 * Represents a base64 encoded binary
 */var EncodedBinary=function(){function EncodedBinary(_data,_mimeType){this._data=_data;this._mimeType=_mimeType;}Object.defineProperty(EncodedBinary.prototype,"data",{ /**
         * Get the base64 encoded data
         * @returns {string}
         */get:function get(){return this._data;},enumerable:true,configurable:true});Object.defineProperty(EncodedBinary.prototype,"mimeType",{ /**
         * Get the mime-type
         * @returns {string|string}
         */get:function get(){return this._mimeType||'application/octet-stream';},enumerable:true,configurable:true}); /**
     * Returns a 'data url' representation of this binary, including the encoded data
     * @returns {string}
     */EncodedBinary.prototype.toUrl=function(){return util_1.DataUrl.createDataUrl(this.mimeType,this.data);};return EncodedBinary;}();exports.EncodedBinary=EncodedBinary; /**
 * Represents a remote binary
 */var UrlBinary=function(){function UrlBinary(_url){this._url=_url;}Object.defineProperty(UrlBinary.prototype,"url",{get:function get(){return this._url;},enumerable:true,configurable:true}); /**
     * Returns a url that 'points to' the binary data
     * @returns {string}
     */UrlBinary.prototype.toUrl=function(){return this.url;};return UrlBinary;}();exports.UrlBinary=UrlBinary; /**
 * An object that directs the client to a new resource
 */var Redirection=function(){function Redirection(){}Redirection.fromWS=function(otype,jsonObj){if(jsonObj&&jsonObj['webURL']){return OType.deserializeObject(jsonObj,'WSWebRedirection',OType.factoryFn);}else if(jsonObj&&jsonObj['workbenchId']){return OType.deserializeObject(jsonObj,'WSWorkbenchRedirection',OType.factoryFn);}else {return OType.deserializeObject(jsonObj,'WSDialogRedirection',OType.factoryFn);}};return Redirection;}();exports.Redirection=Redirection; /**
 * Type of Redirection that represents a new Catavolt resource on the server
 */var DialogRedirection=function(_super){__extends(DialogRedirection,_super);function DialogRedirection(_dialogHandle,_dialogType,_dialogMode,_paneMode,_objectId,_open,_domainClassName,_dialogModelClassName,_dialogProperties,_fromDialogProperties){_super.call(this);this._dialogHandle=_dialogHandle;this._dialogType=_dialogType;this._dialogMode=_dialogMode;this._paneMode=_paneMode;this._objectId=_objectId;this._open=_open;this._domainClassName=_domainClassName;this._dialogModelClassName=_dialogModelClassName;this._dialogProperties=_dialogProperties;this._fromDialogProperties=_fromDialogProperties;}Object.defineProperty(DialogRedirection.prototype,"dialogHandle",{get:function get(){return this._dialogHandle;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"dialogMode",{get:function get(){return this._dialogMode;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"dialogModelClassName",{get:function get(){return this._dialogModelClassName;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"dialogProperties",{get:function get(){return this._dialogProperties;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"dialogType",{get:function get(){return this._dialogType;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"domainClassName",{get:function get(){return this._domainClassName;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"fromDialogProperties",{get:function get(){return this._fromDialogProperties;},set:function set(props){this._fromDialogProperties=props;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"isEditor",{get:function get(){return this._dialogType==='EDITOR';},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"isQuery",{get:function get(){return this._dialogType==='QUERY';},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"objectId",{get:function get(){return this._objectId;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"open",{get:function get(){return this._open;},enumerable:true,configurable:true});Object.defineProperty(DialogRedirection.prototype,"paneMode",{get:function get(){return this._paneMode;},enumerable:true,configurable:true});return DialogRedirection;}(Redirection);exports.DialogRedirection=DialogRedirection;var NullRedirection=function(_super){__extends(NullRedirection,_super);function NullRedirection(fromDialogProperties){_super.call(this);this.fromDialogProperties=fromDialogProperties;}return NullRedirection;}(Redirection);exports.NullRedirection=NullRedirection;var WebRedirection=function(_super){__extends(WebRedirection,_super);function WebRedirection(_webURL,_open,_dialogProperties,_fromDialogProperties){_super.call(this);this._webURL=_webURL;this._open=_open;this._dialogProperties=_dialogProperties;this._fromDialogProperties=_fromDialogProperties;}Object.defineProperty(WebRedirection.prototype,"fromDialogProperties",{get:function get(){return this._fromDialogProperties;},set:function set(props){this._fromDialogProperties=props;},enumerable:true,configurable:true});Object.defineProperty(WebRedirection.prototype,"open",{get:function get(){return this._open;},enumerable:true,configurable:true});Object.defineProperty(WebRedirection.prototype,"webURL",{get:function get(){return this._webURL;},enumerable:true,configurable:true});return WebRedirection;}(Redirection);exports.WebRedirection=WebRedirection;var WorkbenchRedirection=function(_super){__extends(WorkbenchRedirection,_super);function WorkbenchRedirection(_workbenchId,_dialogProperties,_fromDialogProperties){_super.call(this);this._workbenchId=_workbenchId;this._dialogProperties=_dialogProperties;this._fromDialogProperties=_fromDialogProperties;}Object.defineProperty(WorkbenchRedirection.prototype,"workbenchId",{get:function get(){return this._workbenchId;},enumerable:true,configurable:true});Object.defineProperty(WorkbenchRedirection.prototype,"dialogProperties",{get:function get(){return this._dialogProperties;},enumerable:true,configurable:true});Object.defineProperty(WorkbenchRedirection.prototype,"fromDialogProperties",{get:function get(){return this._fromDialogProperties;},set:function set(props){this._fromDialogProperties=props;},enumerable:true,configurable:true});return WorkbenchRedirection;}(Redirection);exports.WorkbenchRedirection=WorkbenchRedirection; /**
 * Utility for working with EntityRecs
 */var EntityRecUtil=function(){function EntityRecUtil(){}EntityRecUtil.newEntityRec=function(objectId,props,annos){return annos?new EntityRecImpl(objectId,util_1.ArrayUtil.copy(props),util_1.ArrayUtil.copy(annos)):new EntityRecImpl(objectId,util_1.ArrayUtil.copy(props));};EntityRecUtil.union=function(l1,l2){var result=util_1.ArrayUtil.copy(l1);l2.forEach(function(p2){if(!l1.some(function(p1,i){if(p1.name===p2.name){result[i]=p2;return true;}return false;})){result.push(p2);}});return result;}; //module level functions
EntityRecUtil.fromWSEditorRecord=function(otype,jsonObj){var objectId=jsonObj['objectId'];var namesJson=jsonObj['names'];if(namesJson['WS_LTYPE']!=='String'){return new fp_1.Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found '+namesJson['WS_LTYPE']);}var namesRaw=namesJson['values'];var propsJson=jsonObj['properties'];if(propsJson['WS_LTYPE']!=='Object'){return new fp_1.Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found '+propsJson['WS_LTYPE']);}var propsRaw=propsJson['values'];var propsTry=Prop.fromWSNamesAndValues(namesRaw,propsRaw);if(propsTry.isFailure)return new fp_1.Failure(propsTry.failure);var props=propsTry.success;if(jsonObj['propertyAnnotations']){var propAnnosObj=jsonObj['propertyAnnotations'];var annotatedPropsTry=DataAnno.annotatePropsUsingWSDataAnnotation(props,propAnnosObj);if(annotatedPropsTry.isFailure)return new fp_1.Failure(annotatedPropsTry.failure);props=annotatedPropsTry.success;}var recAnnos=null;if(jsonObj['recordAnnotation']){var recAnnosTry=DataAnno.fromWS('WSDataAnnotation',jsonObj['recordAnnotation']);if(recAnnosTry.isFailure)return new fp_1.Failure(recAnnosTry.failure);recAnnos=recAnnosTry.success;}return new fp_1.Success(new EntityRecImpl(objectId,props,recAnnos));};return EntityRecUtil;}();exports.EntityRecUtil=EntityRecUtil; /**
 * An {@link EntityRec} that manages two copies internally, a before and after, for 'undo' and comparison purposes.
 * An EntityRec Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */var EntityBuffer=function(){function EntityBuffer(_before,_after){this._before=_before;this._after=_after;if(!_before)throw new Error('_before is null in EntityBuffer');if(!_after)this._after=_before;}EntityBuffer.createEntityBuffer=function(objectId,before,after){return new EntityBuffer(EntityRecUtil.newEntityRec(objectId,before),EntityRecUtil.newEntityRec(objectId,after));};Object.defineProperty(EntityBuffer.prototype,"after",{get:function get(){return this._after;},enumerable:true,configurable:true});Object.defineProperty(EntityBuffer.prototype,"annos",{get:function get(){return this._after.annos;},enumerable:true,configurable:true});EntityBuffer.prototype.annosAtName=function(propName){return this._after.annosAtName(propName);};EntityBuffer.prototype.afterEffects=function(afterAnother){if(afterAnother){return this._after.afterEffects(afterAnother);}else {return this._before.afterEffects(this._after);}};Object.defineProperty(EntityBuffer.prototype,"backgroundColor",{get:function get(){return this._after.backgroundColor;},enumerable:true,configurable:true});EntityBuffer.prototype.backgroundColorFor=function(propName){return this._after.backgroundColorFor(propName);};Object.defineProperty(EntityBuffer.prototype,"before",{get:function get(){return this._before;},enumerable:true,configurable:true});Object.defineProperty(EntityBuffer.prototype,"foregroundColor",{get:function get(){return this._after.foregroundColor;},enumerable:true,configurable:true});EntityBuffer.prototype.foregroundColorFor=function(propName){return this._after.foregroundColorFor(propName);};Object.defineProperty(EntityBuffer.prototype,"imageName",{get:function get(){return this._after.imageName;},enumerable:true,configurable:true});EntityBuffer.prototype.imageNameFor=function(propName){return this._after.imageNameFor(propName);};Object.defineProperty(EntityBuffer.prototype,"imagePlacement",{get:function get(){return this._after.imagePlacement;},enumerable:true,configurable:true});EntityBuffer.prototype.imagePlacementFor=function(propName){return this._after.imagePlacement;};Object.defineProperty(EntityBuffer.prototype,"isBoldText",{get:function get(){return this._after.isBoldText;},enumerable:true,configurable:true});EntityBuffer.prototype.isBoldTextFor=function(propName){return this._after.isBoldTextFor(propName);};EntityBuffer.prototype.isChanged=function(name){var before=this._before.propAtName(name);var after=this._after.propAtName(name);return before&&after?!before.equals(after):!(!before&&!after);};Object.defineProperty(EntityBuffer.prototype,"isItalicText",{get:function get(){return this._after.isItalicText;},enumerable:true,configurable:true});EntityBuffer.prototype.isItalicTextFor=function(propName){return this._after.isItalicTextFor(propName);};Object.defineProperty(EntityBuffer.prototype,"isPlacementCenter",{get:function get(){return this._after.isPlacementCenter;},enumerable:true,configurable:true});EntityBuffer.prototype.isPlacementCenterFor=function(propName){return this._after.isPlacementCenterFor(propName);};Object.defineProperty(EntityBuffer.prototype,"isPlacementLeft",{get:function get(){return this._after.isPlacementLeft;},enumerable:true,configurable:true});EntityBuffer.prototype.isPlacementLeftFor=function(propName){return this._after.isPlacementLeftFor(propName);};Object.defineProperty(EntityBuffer.prototype,"isPlacementRight",{get:function get(){return this._after.isPlacementRight;},enumerable:true,configurable:true});EntityBuffer.prototype.isPlacementRightFor=function(propName){return this._after.isPlacementRightFor(propName);};Object.defineProperty(EntityBuffer.prototype,"isPlacementStretchUnder",{get:function get(){return this._after.isPlacementStretchUnder;},enumerable:true,configurable:true});EntityBuffer.prototype.isPlacementStretchUnderFor=function(propName){return this._after.isPlacementStretchUnderFor(propName);};Object.defineProperty(EntityBuffer.prototype,"isPlacementUnder",{get:function get(){return this._after.isPlacementUnder;},enumerable:true,configurable:true});EntityBuffer.prototype.isPlacementUnderFor=function(propName){return this._after.isPlacementUnderFor(propName);};Object.defineProperty(EntityBuffer.prototype,"isUnderline",{get:function get(){return this._after.isUnderline;},enumerable:true,configurable:true});EntityBuffer.prototype.isUnderlineFor=function(propName){return this._after.isUnderlineFor(propName);};Object.defineProperty(EntityBuffer.prototype,"objectId",{get:function get(){return this._after.objectId;},enumerable:true,configurable:true});Object.defineProperty(EntityBuffer.prototype,"overrideText",{get:function get(){return this._after.overrideText;},enumerable:true,configurable:true});EntityBuffer.prototype.overrideTextFor=function(propName){return this._after.overrideTextFor(propName);};EntityBuffer.prototype.propAtIndex=function(index){return this.props[index];};EntityBuffer.prototype.propAtName=function(propName){return this._after.propAtName(propName);};Object.defineProperty(EntityBuffer.prototype,"propCount",{get:function get(){return this._after.propCount;},enumerable:true,configurable:true});Object.defineProperty(EntityBuffer.prototype,"propNames",{get:function get(){return this._after.propNames;},enumerable:true,configurable:true});Object.defineProperty(EntityBuffer.prototype,"props",{get:function get(){return this._after.props;},enumerable:true,configurable:true});Object.defineProperty(EntityBuffer.prototype,"propValues",{get:function get(){return this._after.propValues;},enumerable:true,configurable:true});EntityBuffer.prototype.setValue=function(name,value){var newProps=[];var found=false;this.props.forEach(function(prop){if(prop.name===name){newProps.push(new Prop(name,value));found=true;}else {newProps.push(prop);}});if(!found){newProps.push(new Prop(name,value));}this._after=EntityRecUtil.newEntityRec(this.objectId,newProps,this.annos);};Object.defineProperty(EntityBuffer.prototype,"tipText",{get:function get(){return this._after.tipText;},enumerable:true,configurable:true});EntityBuffer.prototype.tipTextFor=function(propName){return this._after.tipTextFor(propName);};EntityBuffer.prototype.toEntityRec=function(){return EntityRecUtil.newEntityRec(this.objectId,this.props);};EntityBuffer.prototype.toWSEditorRecord=function(){return this.afterEffects().toWSEditorRecord();};EntityBuffer.prototype.toWS=function(){return this.afterEffects().toWS();};EntityBuffer.prototype.valueAtName=function(propName){return this._after.valueAtName(propName);};return EntityBuffer;}();exports.EntityBuffer=EntityBuffer; /**
 * *********************************
 */ /**
 * The implementation of {@link EntityRec}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */var EntityRecImpl=function(){function EntityRecImpl(objectId,props,annos){if(props===void 0){props=[];}if(annos===void 0){annos=[];}this.objectId=objectId;this.props=props;this.annos=annos;}EntityRecImpl.prototype.annosAtName=function(propName){var p=this.propAtName(propName);return p?p.annos:[];};EntityRecImpl.prototype.afterEffects=function(after){var _this=this;var effects=[];after.props.forEach(function(afterProp){var beforeProp=_this.propAtName(afterProp.name);if(!afterProp.equals(beforeProp)){effects.push(afterProp);}});return new EntityRecImpl(after.objectId,effects);};Object.defineProperty(EntityRecImpl.prototype,"backgroundColor",{get:function get(){return DataAnno.backgroundColor(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.backgroundColorFor=function(propName){var p=this.propAtName(propName);return p&&p.backgroundColor?p.backgroundColor:this.backgroundColor;};Object.defineProperty(EntityRecImpl.prototype,"foregroundColor",{get:function get(){return DataAnno.foregroundColor(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.foregroundColorFor=function(propName){var p=this.propAtName(propName);return p&&p.foregroundColor?p.foregroundColor:this.foregroundColor;};Object.defineProperty(EntityRecImpl.prototype,"imageName",{get:function get(){return DataAnno.imageName(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.imageNameFor=function(propName){var p=this.propAtName(propName);return p&&p.imageName?p.imageName:this.imageName;};Object.defineProperty(EntityRecImpl.prototype,"imagePlacement",{get:function get(){return DataAnno.imagePlacement(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.imagePlacementFor=function(propName){var p=this.propAtName(propName);return p&&p.imagePlacement?p.imagePlacement:this.imagePlacement;};Object.defineProperty(EntityRecImpl.prototype,"isBoldText",{get:function get(){return DataAnno.isBoldText(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isBoldTextFor=function(propName){var p=this.propAtName(propName);return p&&p.isBoldText?p.isBoldText:this.isBoldText;};Object.defineProperty(EntityRecImpl.prototype,"isItalicText",{get:function get(){return DataAnno.isItalicText(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isItalicTextFor=function(propName){var p=this.propAtName(propName);return p&&p.isItalicText?p.isItalicText:this.isItalicText;};Object.defineProperty(EntityRecImpl.prototype,"isPlacementCenter",{get:function get(){return DataAnno.isPlacementCenter(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isPlacementCenterFor=function(propName){var p=this.propAtName(propName);return p&&p.isPlacementCenter?p.isPlacementCenter:this.isPlacementCenter;};Object.defineProperty(EntityRecImpl.prototype,"isPlacementLeft",{get:function get(){return DataAnno.isPlacementLeft(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isPlacementLeftFor=function(propName){var p=this.propAtName(propName);return p&&p.isPlacementLeft?p.isPlacementLeft:this.isPlacementLeft;};Object.defineProperty(EntityRecImpl.prototype,"isPlacementRight",{get:function get(){return DataAnno.isPlacementRight(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isPlacementRightFor=function(propName){var p=this.propAtName(propName);return p&&p.isPlacementRight?p.isPlacementRight:this.isPlacementRight;};Object.defineProperty(EntityRecImpl.prototype,"isPlacementStretchUnder",{get:function get(){return DataAnno.isPlacementStretchUnder(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isPlacementStretchUnderFor=function(propName){var p=this.propAtName(propName);return p&&p.isPlacementStretchUnder?p.isPlacementStretchUnder:this.isPlacementStretchUnder;};Object.defineProperty(EntityRecImpl.prototype,"isPlacementUnder",{get:function get(){return DataAnno.isPlacementUnder(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isPlacementUnderFor=function(propName){var p=this.propAtName(propName);return p&&p.isPlacementUnder?p.isPlacementUnder:this.isPlacementUnder;};Object.defineProperty(EntityRecImpl.prototype,"isUnderline",{get:function get(){return DataAnno.isUnderlineText(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.isUnderlineFor=function(propName){var p=this.propAtName(propName);return p&&p.isUnderline?p.isUnderline:this.isUnderline;};Object.defineProperty(EntityRecImpl.prototype,"overrideText",{get:function get(){return DataAnno.overrideText(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.overrideTextFor=function(propName){var p=this.propAtName(propName);return p&&p.overrideText?p.overrideText:this.overrideText;};EntityRecImpl.prototype.propAtIndex=function(index){return this.props[index];};EntityRecImpl.prototype.propAtName=function(propName){var prop=null;this.props.some(function(p){if(p.name===propName){prop=p;return true;}return false;});return prop;};Object.defineProperty(EntityRecImpl.prototype,"propCount",{get:function get(){return this.props.length;},enumerable:true,configurable:true});Object.defineProperty(EntityRecImpl.prototype,"propNames",{get:function get(){return this.props.map(function(p){return p.name;});},enumerable:true,configurable:true});Object.defineProperty(EntityRecImpl.prototype,"propValues",{get:function get(){return this.props.map(function(p){return p.value;});},enumerable:true,configurable:true});Object.defineProperty(EntityRecImpl.prototype,"tipText",{get:function get(){return DataAnno.tipText(this.annos);},enumerable:true,configurable:true});EntityRecImpl.prototype.tipTextFor=function(propName){var p=this.propAtName(propName);return p&&p.tipText?p.tipText:this.tipText;};EntityRecImpl.prototype.toEntityRec=function(){return this;};EntityRecImpl.prototype.toWSEditorRecord=function(){var result={'WS_OTYPE':'WSEditorRecord'};if(this.objectId)result['objectId']=this.objectId;result['names']=Prop.toWSListOfString(this.propNames);result['properties']=Prop.toWSListOfProperties(this.propValues);return result;};EntityRecImpl.prototype.toWS=function(){var result={'WS_OTYPE':'WSEntityRec'};if(this.objectId)result['objectId']=this.objectId;result['props']=Prop.toListOfWSProp(this.props);if(this.annos)result['annos']=DataAnno.toListOfWSDataAnno(this.annos);return result;};EntityRecImpl.prototype.valueAtName=function(propName){var value=null;this.props.some(function(p){if(p.name===propName){value=p.value;return true;}return false;});return value;};return EntityRecImpl;}();exports.EntityRecImpl=EntityRecImpl; /**
 * *********************************
 */ /**
 * An empty or uninitialized {@link EntityRec}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */var NullEntityRec=function(){function NullEntityRec(){}Object.defineProperty(NullEntityRec.prototype,"annos",{get:function get(){return [];},enumerable:true,configurable:true});NullEntityRec.prototype.annosAtName=function(propName){return [];};NullEntityRec.prototype.afterEffects=function(after){return after;};Object.defineProperty(NullEntityRec.prototype,"backgroundColor",{get:function get(){return null;},enumerable:true,configurable:true});NullEntityRec.prototype.backgroundColorFor=function(propName){return null;};Object.defineProperty(NullEntityRec.prototype,"foregroundColor",{get:function get(){return null;},enumerable:true,configurable:true});NullEntityRec.prototype.foregroundColorFor=function(propName){return null;};Object.defineProperty(NullEntityRec.prototype,"imageName",{get:function get(){return null;},enumerable:true,configurable:true});NullEntityRec.prototype.imageNameFor=function(propName){return null;};Object.defineProperty(NullEntityRec.prototype,"imagePlacement",{get:function get(){return null;},enumerable:true,configurable:true});NullEntityRec.prototype.imagePlacementFor=function(propName){return null;};Object.defineProperty(NullEntityRec.prototype,"isBoldText",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isBoldTextFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isItalicText",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isItalicTextFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isPlacementCenter",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isPlacementCenterFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isPlacementLeft",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isPlacementLeftFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isPlacementRight",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isPlacementRightFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isPlacementStretchUnder",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isPlacementStretchUnderFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isPlacementUnder",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isPlacementUnderFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"isUnderline",{get:function get(){return false;},enumerable:true,configurable:true});NullEntityRec.prototype.isUnderlineFor=function(propName){return false;};Object.defineProperty(NullEntityRec.prototype,"objectId",{get:function get(){return null;},enumerable:true,configurable:true});Object.defineProperty(NullEntityRec.prototype,"overrideText",{get:function get(){return null;},enumerable:true,configurable:true});NullEntityRec.prototype.overrideTextFor=function(propName){return null;};NullEntityRec.prototype.propAtIndex=function(index){return null;};NullEntityRec.prototype.propAtName=function(propName){return null;};Object.defineProperty(NullEntityRec.prototype,"propCount",{get:function get(){return 0;},enumerable:true,configurable:true});Object.defineProperty(NullEntityRec.prototype,"propNames",{get:function get(){return [];},enumerable:true,configurable:true});Object.defineProperty(NullEntityRec.prototype,"props",{get:function get(){return [];},enumerable:true,configurable:true});Object.defineProperty(NullEntityRec.prototype,"propValues",{get:function get(){return [];},enumerable:true,configurable:true});Object.defineProperty(NullEntityRec.prototype,"tipText",{get:function get(){return null;},enumerable:true,configurable:true});NullEntityRec.prototype.tipTextFor=function(propName){return null;};NullEntityRec.prototype.toEntityRec=function(){return this;};NullEntityRec.prototype.toWSEditorRecord=function(){var result={'WS_OTYPE':'WSEditorRecord'};if(this.objectId)result['objectId']=this.objectId;result['names']=Prop.toWSListOfString(this.propNames);result['properties']=Prop.toWSListOfProperties(this.propValues);return result;};NullEntityRec.prototype.toWS=function(){var result={'WS_OTYPE':'WSEntityRec'};if(this.objectId)result['objectId']=this.objectId;result['props']=Prop.toListOfWSProp(this.props);if(this.annos)result['annos']=DataAnno.toListOfWSDataAnno(this.annos);return result;};NullEntityRec.prototype.valueAtName=function(propName){return null;};NullEntityRec.singleton=new NullEntityRec();return NullEntityRec;}();exports.NullEntityRec=NullEntityRec; /**
 * *********************************
 */var AppContextState;(function(AppContextState){AppContextState[AppContextState["LOGGED_OUT"]=0]="LOGGED_OUT";AppContextState[AppContextState["LOGGED_IN"]=1]="LOGGED_IN";})(AppContextState||(AppContextState={}));var AppContextValues=function(){function AppContextValues(sessionContext,appWinDef,tenantSettings){this.sessionContext=sessionContext;this.appWinDef=appWinDef;this.tenantSettings=tenantSettings;}return AppContextValues;}(); /**
 * Top-level entry point into the Catavolt API
 */var AppContext=function(){ /**
     * Construct an AppContext
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */function AppContext(){if(AppContext._singleton){throw new Error("Singleton instance already created");}this._deviceProps=[];this.setAppContextStateToLoggedOut();AppContext._singleton=this;}Object.defineProperty(AppContext,"defaultTTLInMillis",{get:function get(){return AppContext.ONE_HOUR_IN_MILLIS;},enumerable:true,configurable:true});Object.defineProperty(AppContext,"singleton",{ /**
         * Get the singleton instance of the AppContext
         * @returns {AppContext}
         */get:function get(){if(!AppContext._singleton){AppContext._singleton=new AppContext();}return AppContext._singleton;},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"appWinDefTry",{ /**
         * Get the AppWinDef Try
         * @returns {Try<AppWinDef>}
         */get:function get(){return this._appWinDefTry;},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"deviceProps",{ /**
         * Get the device props
         * @returns {Array<string>}
         */get:function get(){return this._deviceProps;},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"isLoggedIn",{ /**
         * Checked logged in status
         * @returns {boolean}
         */get:function get(){return this._appContextState===AppContextState.LOGGED_IN;},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"clientTimeoutMillis",{ /**
         * Get the number of millis that the client will remain active between calls
         * to the server.
         * @returns {number}
         */get:function get(){if(this.tenantSettingsTry.isSuccess){var mins=this.tenantSettingsTry.success['clientTimeoutMinutes'];return mins?Number(mins)*60*1000:AppContext.defaultTTLInMillis;}else {return AppContext.defaultTTLInMillis;}},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"remainingSessionTime",{ /**
         * Time remaining before this session is expired by the server
         * @returns {number}
         */get:function get(){return this.clientTimeoutMillis-(new Date().getTime()-ws_1.Call.lastSuccessfulActivityTime.getTime());},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"sessionHasExpired",{ /**
         * Return whether or not the session has expired
         * @returns {boolean}
         */get:function get(){return this.remainingSessionTime<0;},enumerable:true,configurable:true}); /**
     * Open a {@link WorkbenchLaunchAction} expecting a Redirection
     * @param launchAction
     * @returns {Future<Redirection>}
     */AppContext.prototype.getRedirForLaunchAction=function(launchAction){return WorkbenchService.performLaunchAction(launchAction.id,launchAction.workbenchId,this.sessionContextTry.success);}; /**
     * Get a Worbench by workbenchId
     * @param sessionContext
     * @param workbenchId
     * @returns {Future<Workbench>}
     */AppContext.prototype.getWorkbench=function(sessionContext,workbenchId){if(this._appContextState===AppContextState.LOGGED_OUT){return fp_1.Future.createFailedFuture("AppContext::getWorkbench","User is logged out");}return WorkbenchService.getWorkbench(sessionContext,workbenchId);}; /**
     * Log in and retrieve the AppWinDef
     * @param gatewayHost
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @returns {Future<AppWinDef>}
     */AppContext.prototype.login=function(gatewayHost,tenantId,clientType,userId,password){var _this=this;if(this._appContextState===AppContextState.LOGGED_IN){return fp_1.Future.createFailedFuture("AppContext::login","User is already logged in");}var answer;var appContextValuesFr=this.loginOnline(gatewayHost,tenantId,clientType,userId,password,this.deviceProps);return appContextValuesFr.bind(function(appContextValues){_this.setAppContextStateToLoggedIn(appContextValues);return fp_1.Future.createSuccessfulFuture('AppContext::login',appContextValues.appWinDef);});}; /**
     * Login directly to a given url, bypassing the gateway host
     * @param url
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @returns {Future<AppWinDef>}
     */AppContext.prototype.loginDirectly=function(url,tenantId,clientType,userId,password){var _this=this;if(this._appContextState===AppContextState.LOGGED_IN){return fp_1.Future.createFailedFuture("AppContext::loginDirectly","User is already logged in");}return this.loginFromSystemContext(new SystemContextImpl(url),tenantId,userId,password,this.deviceProps,clientType).bind(function(appContextValues){_this.setAppContextStateToLoggedIn(appContextValues);return fp_1.Future.createSuccessfulFuture('AppContext::loginDirectly',appContextValues.appWinDef);});}; /**
     * Logout and destroy the session
     * @returns {any}
     */AppContext.prototype.logout=function(){if(this._appContextState===AppContextState.LOGGED_OUT){return fp_1.Future.createFailedFuture("AppContext::loginDirectly","User is already logged out");}var result=SessionService.deleteSession(this.sessionContextTry.success);result.onComplete(function(deleteSessionTry){if(deleteSessionTry.isFailure){util_1.Log.error('Error while logging out: '+util_1.ObjUtil.formatRecAttr(deleteSessionTry.failure));}});this.setAppContextStateToLoggedOut();return result;}; /**
     * Login and create a new SessionContext
     *
     * @param systemContext
     * @param tenantId
     * @param userId
     * @param password
     * @param deviceProps
     * @param clientType
     * @returns {Future<SessionContext>}
     */AppContext.prototype.newSessionContext=function(systemContext,tenantId,userId,password,deviceProps,clientType){return SessionService.createSession(tenantId,userId,password,clientType,systemContext);}; /**
     * Get a SystemContext obj (containing the server endpoint)
     *
     * @param gatewayHost
     * @param tenantId
     * @returns {Future<SystemContextImpl>}
     */AppContext.prototype.newSystemContext=function(gatewayHost,tenantId){var serviceEndpoint=GatewayService.getServiceEndpoint(tenantId,'soi-json',gatewayHost);return serviceEndpoint.map(function(serviceEndpoint){return new SystemContextImpl(serviceEndpoint.serverAssignment);});}; /**
     * Open a redirection
     *
     * @param redirection
     * @param actionSource
     * @returns {Future<NavRequest>}
     */AppContext.prototype.openRedirection=function(redirection,actionSource){return NavRequestUtil.fromRedirection(redirection,actionSource,this.sessionContextTry.success);}; /**
     * Open a {@link WorkbenchLaunchAction}
     * @param launchAction
     * @returns {any}
     */AppContext.prototype.performLaunchAction=function(launchAction){if(this._appContextState===AppContextState.LOGGED_OUT){return fp_1.Future.createFailedFuture("AppContext::performLaunchAction","User is logged out");}return this.performLaunchActionOnline(launchAction,this.sessionContextTry.success);}; /**
     * Refresh the AppContext
     * @param sessionContext
     * @param deviceProps
     * @returns {Future<AppWinDef>}
     */AppContext.prototype.refreshContext=function(sessionContext){var _this=this;var appContextValuesFr=this.finalizeContext(sessionContext,this.deviceProps);return appContextValuesFr.bind(function(appContextValues){_this.setAppContextStateToLoggedIn(appContextValues);return fp_1.Future.createSuccessfulFuture('AppContext::login',appContextValues.appWinDef);});};Object.defineProperty(AppContext.prototype,"sessionContextTry",{ /**
         * Get the SessionContext Try
         * @returns {Try<SessionContext>}
         */get:function get(){return this._sessionContextTry;},enumerable:true,configurable:true});Object.defineProperty(AppContext.prototype,"tenantSettingsTry",{ /**
         * Get the tenant settings Try
         * @returns {Try<StringDictionary>}
         */get:function get(){return this._tenantSettingsTry;},enumerable:true,configurable:true});AppContext.prototype.finalizeContext=function(sessionContext,deviceProps){var devicePropName="com.catavolt.session.property.DeviceProperties";return SessionService.setSessionListProperty(devicePropName,deviceProps,sessionContext).bind(function(setPropertyListResult){var listPropName="com.catavolt.session.property.TenantProperties";return SessionService.getSessionListProperty(listPropName,sessionContext).bind(function(listPropertyResult){return WorkbenchService.getAppWinDef(sessionContext).bind(function(appWinDef){return fp_1.Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext",new AppContextValues(sessionContext,appWinDef,listPropertyResult.valuesAsDictionary()));});});});};AppContext.prototype.loginOnline=function(gatewayHost,tenantId,clientType,userId,password,deviceProps){var _this=this;var systemContextFr=this.newSystemContext(gatewayHost,tenantId);return systemContextFr.bind(function(sc){return _this.loginFromSystemContext(sc,tenantId,userId,password,deviceProps,clientType);});};AppContext.prototype.loginFromSystemContext=function(systemContext,tenantId,userId,password,deviceProps,clientType){var _this=this;var sessionContextFuture=SessionService.createSession(tenantId,userId,password,clientType,systemContext);return sessionContextFuture.bind(function(sessionContext){return _this.finalizeContext(sessionContext,deviceProps);});};AppContext.prototype.performLaunchActionOnline=function(launchAction,sessionContext){var redirFr=WorkbenchService.performLaunchAction(launchAction.id,launchAction.workbenchId,sessionContext);return redirFr.bind(function(r){return NavRequestUtil.fromRedirection(r,launchAction,sessionContext);});};AppContext.prototype.setAppContextStateToLoggedIn=function(appContextValues){this._appWinDefTry=new fp_1.Success(appContextValues.appWinDef);this._tenantSettingsTry=new fp_1.Success(appContextValues.tenantSettings);this._sessionContextTry=new fp_1.Success(appContextValues.sessionContext);this._appContextState=AppContextState.LOGGED_IN;};AppContext.prototype.setAppContextStateToLoggedOut=function(){this._appWinDefTry=new fp_1.Failure("Not logged in");this._tenantSettingsTry=new fp_1.Failure('Not logged in"');this._sessionContextTry=new fp_1.Failure('Not loggged in');this._appContextState=AppContextState.LOGGED_OUT;};AppContext.ONE_HOUR_IN_MILLIS=60*60*1000;return AppContext;}();exports.AppContext=AppContext; /**
 * *********************************
 */ /**
 * Represents a singlel 'Window' definition, retrieved upon login.
 * Workbenches can be obtained through this object.
 */var AppWinDef=function(){ /**
     * Create a new AppWinDef
     *
     * @private
     *
     * @param workbenches
     * @param appVendors
     * @param windowTitle
     * @param windowWidth
     * @param windowHeight
     */function AppWinDef(workbenches,appVendors,windowTitle,windowWidth,windowHeight){this._workbenches=workbenches||[];this._applicationVendors=appVendors||[];this._windowTitle=windowTitle;this._windowWidth=windowWidth;this._windowHeight=windowHeight;}Object.defineProperty(AppWinDef.prototype,"appVendors",{ /**
         * Get the app vendors array
         * @returns {Array<string>}
         */get:function get(){return this._applicationVendors;},enumerable:true,configurable:true});Object.defineProperty(AppWinDef.prototype,"windowHeight",{ /**
         * Get the window height
         * @returns {number}
         */get:function get(){return this._windowHeight;},enumerable:true,configurable:true});Object.defineProperty(AppWinDef.prototype,"windowTitle",{ /**
         * Get the window title
         * @returns {string}
         */get:function get(){return this._windowTitle;},enumerable:true,configurable:true});Object.defineProperty(AppWinDef.prototype,"windowWidth",{ /**
         * Get the window width
         * @returns {number}
         */get:function get(){return this._windowWidth;},enumerable:true,configurable:true});Object.defineProperty(AppWinDef.prototype,"workbenches",{ /**
         * Get the list of available Workbenches
         * @returns {Array<Workbench>}
         */get:function get(){return this._workbenches;},enumerable:true,configurable:true});return AppWinDef;}();exports.AppWinDef=AppWinDef; /**
 * *********************************
 */var CellDef=function(){function CellDef(_values){this._values=_values;}Object.defineProperty(CellDef.prototype,"values",{get:function get(){return this._values;},enumerable:true,configurable:true});return CellDef;}();exports.CellDef=CellDef; /**
 * *********************************
 */var CodeRef=function(){function CodeRef(_code,_description){this._code=_code;this._description=_description;}CodeRef.fromFormattedValue=function(value){var pair=util_1.StringUtil.splitSimpleKeyValuePair(value);return new CodeRef(pair[0],pair[1]);};Object.defineProperty(CodeRef.prototype,"code",{get:function get(){return this._code;},enumerable:true,configurable:true});Object.defineProperty(CodeRef.prototype,"description",{get:function get(){return this._description;},enumerable:true,configurable:true});CodeRef.prototype.toString=function(){return this.code+":"+this.description;};return CodeRef;}();exports.CodeRef=CodeRef; /**
 * *********************************
 */var ColumnDef=function(){function ColumnDef(_name,_heading,_propertyDef){this._name=_name;this._heading=_heading;this._propertyDef=_propertyDef;}Object.defineProperty(ColumnDef.prototype,"heading",{get:function get(){return this._heading;},enumerable:true,configurable:true});Object.defineProperty(ColumnDef.prototype,"isInlineMediaStyle",{get:function get(){return this._propertyDef.isInlineMediaStyle;},enumerable:true,configurable:true});Object.defineProperty(ColumnDef.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(ColumnDef.prototype,"propertyDef",{get:function get(){return this._propertyDef;},enumerable:true,configurable:true});return ColumnDef;}();exports.ColumnDef=ColumnDef; /**
 * *********************************
 */var ContextAction=function(){function ContextAction(actionId,objectId,fromActionSource){this.actionId=actionId;this.objectId=objectId;this.fromActionSource=fromActionSource;}Object.defineProperty(ContextAction.prototype,"virtualPathSuffix",{get:function get(){return [this.objectId,this.actionId];},enumerable:true,configurable:true});return ContextAction;}();exports.ContextAction=ContextAction; /**
 * *********************************
 */var DataAnno=function(){function DataAnno(_name,_value){this._name=_name;this._value=_value;}DataAnno.annotatePropsUsingWSDataAnnotation=function(props,jsonObj){return DialogTriple.fromListOfWSDialogObject(jsonObj,'WSDataAnnotation',OType.factoryFn).bind(function(propAnnos){var annotatedProps=[];for(var i=0;i<props.length;i++){var p=props[i];var annos=propAnnos[i];if(annos){annotatedProps.push(new Prop(p.name,p.value,annos));}else {annotatedProps.push(p);}}return new fp_1.Success(annotatedProps);});};DataAnno.backgroundColor=function(annos){var result=util_1.ArrayUtil.find(annos,function(anno){return anno.isBackgroundColor;});return result?result.backgroundColor:null;};DataAnno.foregroundColor=function(annos){var result=util_1.ArrayUtil.find(annos,function(anno){return anno.isForegroundColor;});return result?result.foregroundColor:null;};DataAnno.fromWS=function(otype,jsonObj){var stringObj=jsonObj['annotations'];if(stringObj['WS_LTYPE']!=='String'){return new fp_1.Failure('DataAnno:fromWS: expected WS_LTYPE of String but found '+stringObj['WS_LTYPE']);}var annoStrings=stringObj['values'];var annos=[];for(var i=0;i<annoStrings.length;i++){annos.push(DataAnno.parseString(annoStrings[i]));}return new fp_1.Success(annos);};DataAnno.imageName=function(annos){var result=util_1.ArrayUtil.find(annos,function(anno){return anno.isImageName;});return result?result.value:null;};DataAnno.imagePlacement=function(annos){var result=util_1.ArrayUtil.find(annos,function(anno){return anno.isImagePlacement;});return result?result.value:null;};DataAnno.isBoldText=function(annos){return annos.some(function(anno){return anno.isBoldText;});};DataAnno.isItalicText=function(annos){return annos.some(function(anno){return anno.isItalicText;});};DataAnno.isPlacementCenter=function(annos){return annos.some(function(anno){return anno.isPlacementCenter;});};DataAnno.isPlacementLeft=function(annos){return annos.some(function(anno){return anno.isPlacementLeft;});};DataAnno.isPlacementRight=function(annos){return annos.some(function(anno){return anno.isPlacementRight;});};DataAnno.isPlacementStretchUnder=function(annos){return annos.some(function(anno){return anno.isPlacementStretchUnder;});};DataAnno.isPlacementUnder=function(annos){return annos.some(function(anno){return anno.isPlacementUnder;});};DataAnno.isUnderlineText=function(annos){return annos.some(function(anno){return anno.isUnderlineText;});};DataAnno.overrideText=function(annos){var result=util_1.ArrayUtil.find(annos,function(anno){return anno.isOverrideText;});return result?result.value:null;};DataAnno.tipText=function(annos){var result=util_1.ArrayUtil.find(annos,function(anno){return anno.isTipText;});return result?result.value:null;};DataAnno.toListOfWSDataAnno=function(annos){var result={'WS_LTYPE':'WSDataAnno'};var values=[];annos.forEach(function(anno){values.push(anno.toWS());});result['values']=values;return result;};DataAnno.parseString=function(formatted){var pair=util_1.StringUtil.splitSimpleKeyValuePair(formatted);return new DataAnno(pair[0],pair[1]);};Object.defineProperty(DataAnno.prototype,"backgroundColor",{get:function get(){return this.isBackgroundColor?this.value:null;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"foregroundColor",{get:function get(){return this.isForegroundColor?this.value:null;},enumerable:true,configurable:true});DataAnno.prototype.equals=function(dataAnno){return this.name===dataAnno.name;};Object.defineProperty(DataAnno.prototype,"isBackgroundColor",{get:function get(){return this.name===DataAnno.BACKGROUND_COLOR;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isBoldText",{get:function get(){return this.name===DataAnno.BOLD_TEXT&&this.value===DataAnno.TRUE_VALUE;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isForegroundColor",{get:function get(){return this.name===DataAnno.FOREGROUND_COLOR;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isImageName",{get:function get(){return this.name===DataAnno.IMAGE_NAME;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isImagePlacement",{get:function get(){return this.name===DataAnno.IMAGE_PLACEMENT;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isItalicText",{get:function get(){return this.name===DataAnno.ITALIC_TEXT&&this.value===DataAnno.TRUE_VALUE;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isOverrideText",{get:function get(){return this.name===DataAnno.OVERRIDE_TEXT;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isPlacementCenter",{get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_CENTER;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isPlacementLeft",{get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_LEFT;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isPlacementRight",{get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_RIGHT;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isPlacementStretchUnder",{get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_STRETCH_UNDER;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isPlacementUnder",{get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_UNDER;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isTipText",{get:function get(){return this.name===DataAnno.TIP_TEXT;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"isUnderlineText",{get:function get(){return this.name===DataAnno.UNDERLINE&&this.value===DataAnno.TRUE_VALUE;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(DataAnno.prototype,"value",{get:function get(){return this._value;},enumerable:true,configurable:true});DataAnno.prototype.toWS=function(){return {'WS_OTYPE':'WSDataAnno','name':this.name,'value':this.value};};DataAnno.BOLD_TEXT="BOLD_TEXT";DataAnno.BACKGROUND_COLOR="BGND_COLOR";DataAnno.FOREGROUND_COLOR="FGND_COLOR";DataAnno.IMAGE_NAME="IMAGE_NAME";DataAnno.IMAGE_PLACEMENT="IMAGE_PLACEMENT";DataAnno.ITALIC_TEXT="ITALIC_TEXT";DataAnno.OVERRIDE_TEXT="OVRD_TEXT";DataAnno.TIP_TEXT="TIP_TEXT";DataAnno.UNDERLINE="UNDERLINE";DataAnno.TRUE_VALUE="1";DataAnno.PLACEMENT_CENTER="CENTER";DataAnno.PLACEMENT_LEFT="LEFT";DataAnno.PLACEMENT_RIGHT="RIGHT";DataAnno.PLACEMENT_UNDER="UNDER";DataAnno.PLACEMENT_STRETCH_UNDER="STRETCH_UNDER";return DataAnno;}();exports.DataAnno=DataAnno; /**
 * *********************************
 */var DialogException=function(){function DialogException(iconName,message,name,stackTrace,title,cause,userMessages){this.iconName=iconName;this.message=message;this.name=name;this.stackTrace=stackTrace;this.title=title;this.cause=cause;this.userMessages=userMessages;}return DialogException;}();exports.DialogException=DialogException;var UserMessage=function(){function UserMessage(message,messageType,explanation,propertyNames){this.message=message;this.messageType=messageType;this.explanation=explanation;this.propertyNames=propertyNames;}return UserMessage;}();exports.UserMessage=UserMessage; /**
 * *********************************
 */var DialogHandle=function(){function DialogHandle(handleValue,sessionHandle){this.handleValue=handleValue;this.sessionHandle=sessionHandle;}return DialogHandle;}();exports.DialogHandle=DialogHandle; /**
 * *********************************
 */ /**
 * @private
 */var DialogService=function(){function DialogService(){}DialogService.addAttachment=function(dialogHandle,attachment,sessionContext){var formData=new FormData();formData.append('sessionHandle',sessionContext.sessionHandle);formData.append('dialogHandle',String(dialogHandle.handleValue));formData.append('encodedFilename',util_1.Base64.encode(attachment.name));formData.append('Filedata',attachment.attachmentData,attachment.name);var pathPrefix=sessionContext.systemContext.urlString;if(pathPrefix&&pathPrefix.charAt(pathPrefix.length-1)!=='/'){pathPrefix+='/';}var url=pathPrefix+=DialogService.ATTACHMENT_PATH;return ws_1.ClientFactory.getClient().postMultipart(url,formData);};DialogService.changePaneMode=function(dialogHandle,paneMode,sessionContext){var method='changePaneMode';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'paneMode':PaneMode[paneMode]};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('changePaneMode',DialogTriple.fromWSDialogObject(result,'WSChangePaneModeResult',OType.factoryFn));});};DialogService.closeEditorModel=function(dialogHandle,sessionContext){var method='close';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createSuccessfulFuture('closeEditorModel',result);});};DialogService.getAvailableValues=function(dialogHandle,propertyName,pendingWrites,sessionContext){var method='getAvailableValues';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName};if(pendingWrites)params['pendingWrites']=pendingWrites.toWSEditorRecord();var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getAvailableValues',DialogTriple.fromWSDialogObject(result,'WSGetAvailableValuesResult',OType.factoryFn));});};DialogService.getActiveColumnDefs=function(dialogHandle,sessionContext){var method='getActiveColumnDefs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getActiveColumnDefs',DialogTriple.fromWSDialogObject(result,'WSGetActiveColumnDefsResult',OType.factoryFn));});};DialogService.getAvailableEditorViewDescs=function(dialogHandle,sessionContext){var method='getAvailableViewDescs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getAvailableEditorViewDescs',DialogTriple.fromWSDialogObject(result,'WSGetAvailableViewDescsResult',OType.factoryFn));});};DialogService.getAvailableQueryViewDescs=function(dialogHandle,sessionContext){var method='getAvailableViewDescs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getAvailableQueryViewDescs',DialogTriple.fromWSDialogObject(result,'WSGetAvailableViewDescsResult',OType.factoryFn));});};DialogService.getEditorModelMenuDefs=function(dialogHandle,sessionContext){var method='getMenuDefs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getEditorModelMenuDefs',DialogTriple.fromWSDialogObjectsResult(result,'WSGetMenuDefsResult','WSMenuDef','menuDefs',OType.factoryFn));});};DialogService.getEditorModelPaneDef=function(dialogHandle,paneId,sessionContext){var method='getPaneDef';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};params['paneId']=paneId;var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getEditorModelPaneDef',DialogTriple.fromWSDialogObjectResult(result,'WSGetPaneDefResult','WSPaneDef','paneDef',OType.factoryFn));});};DialogService.getQueryModelMenuDefs=function(dialogHandle,sessionContext){var method='getMenuDefs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getQueryModelMenuDefs',DialogTriple.fromWSDialogObjectsResult(result,'WSGetMenuDefsResult','WSMenuDef','menuDefs',OType.factoryFn));});};DialogService.getSelectedEditorViewId=function(dialogHandle,sessionContext){var method='getSelectedViewId';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getSelectedEditorViewId',DialogTriple.fromWSDialogObject(result,'WSViewId',OType.factoryFn));});};DialogService.getSelectedQueryViewId=function(dialogHandle,sessionContext){var method='getSelectedViewId';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('getSelectedQueryViewId',DialogTriple.fromWSDialogObject(result,'WSViewId',OType.factoryFn));});};DialogService.openEditorModelFromRedir=function(redirection,sessionContext){var method='reopen';var params={'editorMode':redirection.dialogMode,'dialogHandle':OType.serializeObject(redirection.dialogHandle,'WSDialogHandle')};if(redirection.objectId)params['objectId']=redirection.objectId;var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('openEditorModelFromRedir',DialogTriple.fromWSDialogObject(result,'WSOpenEditorModelResult',OType.factoryFn));});};DialogService.openQueryModelFromRedir=function(redirection,sessionContext){if(!redirection.isQuery)return fp_1.Future.createFailedFuture('DialogService::openQueryModelFromRedir','Redirection must be a query');var method='open';var params={'dialogHandle':OType.serializeObject(redirection.dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('openQueryModelFromRedir',DialogTriple.fromWSDialogObject(result,'WSOpenQueryModelResult',OType.factoryFn));});};DialogService.performEditorAction=function(dialogHandle,actionId,pendingWrites,sessionContext){var method='performAction';var params={'actionId':actionId,'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};if(pendingWrites)params['pendingWrites']=pendingWrites.toWSEditorRecord();var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var redirectionTry=DialogTriple.extractRedirection(result,'WSPerformActionResult');if(redirectionTry.isSuccess){var r=redirectionTry.success;r.fromDialogProperties=result['dialogProperties'];redirectionTry=new fp_1.Success(r);}return fp_1.Future.createCompletedFuture('performEditorAction',redirectionTry);});};DialogService.performQueryAction=function(dialogHandle,actionId,targets,sessionContext){var method='performAction';var params={'actionId':actionId,'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};if(targets){params['targets']=targets;}var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var redirectionTry=DialogTriple.extractRedirection(result,'WSPerformActionResult'); /* If an attachment action is performed, the result will have a 'value' with URL instead of a WebRedirection */if(redirectionTry.isSuccess&&redirectionTry.success instanceof NullRedirection){if(result['value']){redirectionTry=new fp_1.Success(new WebRedirection(result['value'],true,{},{}));}}if(redirectionTry.isSuccess){var r=redirectionTry.success;r.fromDialogProperties=result['dialogProperties'];redirectionTry=new fp_1.Success(r);}return fp_1.Future.createCompletedFuture('performQueryAction',redirectionTry);});};DialogService.processSideEffects=function(dialogHandle,sessionContext,propertyName,propertyValue,pendingWrites){var method='handlePropertyChange';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName,'propertyValue':Prop.toWSProperty(propertyValue),'pendingWrites':pendingWrites.toWSEditorRecord()};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('processSideEffects',DialogTriple.fromWSDialogObject(result,'WSHandlePropertyChangeResult',OType.factoryFn));});};DialogService.queryQueryModel=function(dialogHandle,direction,maxRows,fromObjectId,sessionContext){var method='query';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'maxRows':maxRows,'direction':direction===QueryDirection.BACKWARD?'BACKWARD':'FORWARD'};if(fromObjectId&&fromObjectId.trim()!==''){params['fromObjectId']=fromObjectId.trim();}util_1.Log.info('Running query');var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return fp_1.Future.createCompletedFuture('DialogService::queryQueryModel',DialogTriple.fromWSDialogObject(result,'WSQueryResult',OType.factoryFn));});};DialogService.readEditorModel=function(dialogHandle,sessionContext){var method='read';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('readEditorModel',DialogTriple.fromWSDialogObject(result,'WSReadResult',OType.factoryFn));});};DialogService.readEditorProperty=function(dialogHandle,propertyName,readSeq,readLength,sessionContext){var method='readProperty';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName,'readSeq':readSeq,'readLength':readLength};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('readProperty',DialogTriple.fromWSDialogObject(result,'WSReadPropertyResult',OType.factoryFn));});};DialogService.readQueryProperty=function(dialogHandle,propertyName,objectId,readSeq,readLength,sessionContext){var method='readProperty';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName,'objectId':objectId,'readSeq':readSeq,'readLength':readLength};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('readProperty',DialogTriple.fromWSDialogObject(result,'WSReadPropertyResult',OType.factoryFn));});};DialogService.setSelectedEditorViewId=function(dialogHandle,viewId,sessionContext){var method='setSelectedViewId';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),viewId:viewId};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('setSelectedEditorViewId',DialogTriple.fromWSDialogObject(result,'WSSetSelectedViewIdEditorModelResult',OType.factoryFn));});};DialogService.setSelectedQueryViewId=function(dialogHandle,viewId,sessionContext){var method='setSelectedViewId';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),viewId:viewId};var call=ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('setSelectedQueryViewId',DialogTriple.fromWSDialogObject(result,'WSSetSelectedViewIdQueryModelResult',OType.factoryFn));});};DialogService.writeEditorModel=function(dialogHandle,entityRec,sessionContext){var method='write';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'editorRecord':entityRec.toWSEditorRecord()};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var writeResultTry=DialogTriple.extractTriple(result,'WSWriteResult',function(){return OType.deserializeObject(result,'XWriteResult',OType.factoryFn);});if(writeResultTry.isSuccess&&writeResultTry.success.isLeft){var redirection=writeResultTry.success.left;redirection.fromDialogProperties=result['dialogProperties']||{};writeResultTry=new fp_1.Success(fp_1.Either.left(redirection));}return fp_1.Future.createCompletedFuture('writeEditorModel',writeResultTry);});};DialogService.writeProperty=function(dialogHandle,propertyName,data,append,sessionContext){var method='writeProperty';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName,'data':data,'append':append};var call=ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture('writeProperty',DialogTriple.fromWSDialogObject(result,'WSWritePropertyResult',OType.factoryFn));});};DialogService.EDITOR_SERVICE_NAME='EditorService';DialogService.EDITOR_SERVICE_PATH='soi-json-v02/'+DialogService.EDITOR_SERVICE_NAME;DialogService.QUERY_SERVICE_NAME='QueryService';DialogService.QUERY_SERVICE_PATH='soi-json-v02/'+DialogService.QUERY_SERVICE_NAME;DialogService.ATTACHMENT_PATH='upload/path';return DialogService;}();exports.DialogService=DialogService; /**
 * *********************************
 */ /**
 * @private
 */var DialogTriple=function(){function DialogTriple(){}DialogTriple.extractList=function(jsonObject,Ltype,extractor){var result;if(jsonObject){var lt=jsonObject['WS_LTYPE'];if(Ltype===lt){if(jsonObject['values']){var realValues=[];var values=jsonObject['values'];values.every(function(item){var extdValue=extractor(item);if(extdValue.isFailure){result=new fp_1.Failure(extdValue.failure);return false;}realValues.push(extdValue.success);return true;});if(!result){result=new fp_1.Success(realValues);}}else {result=new fp_1.Failure("DialogTriple::extractList: Values array not found");}}else {result=new fp_1.Failure("DialogTriple::extractList: Expected WS_LTYPE "+Ltype+" but found "+lt);}}return result;};DialogTriple.extractRedirection=function(jsonObject,Otype){var tripleTry=DialogTriple._extractTriple(jsonObject,Otype,false,function(){return new fp_1.Success(new NullRedirection({}));});var answer;if(tripleTry.isSuccess){var triple=tripleTry.success;answer=triple.isLeft?new fp_1.Success(triple.left):new fp_1.Success(triple.right);}else {answer=new fp_1.Failure(tripleTry.failure);}return answer;};DialogTriple.extractTriple=function(jsonObject,Otype,extractor){return DialogTriple._extractTriple(jsonObject,Otype,false,extractor);};DialogTriple.extractValue=function(jsonObject,Otype,extractor){return DialogTriple._extractValue(jsonObject,Otype,false,extractor);};DialogTriple.extractValueIgnoringRedirection=function(jsonObject,Otype,extractor){return DialogTriple._extractValue(jsonObject,Otype,true,extractor);};DialogTriple.fromWSDialogObject=function(obj,Otype,factoryFn,ignoreRedirection){if(ignoreRedirection===void 0){ignoreRedirection=false;}if(!obj){return new fp_1.Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');}else if((typeof obj==="undefined"?"undefined":_typeof(obj))!=='object'){return new fp_1.Success(obj);}try{if(!factoryFn){ /* Assume we're just going to coerce the exiting object */return DialogTriple.extractValue(obj,Otype,function(){return new fp_1.Success(obj);});}else {if(ignoreRedirection){return DialogTriple.extractValueIgnoringRedirection(obj,Otype,function(){return OType.deserializeObject(obj,Otype,factoryFn);});}else {return DialogTriple.extractValue(obj,Otype,function(){return OType.deserializeObject(obj,Otype,factoryFn);});}}}catch(e){return new fp_1.Failure('DialogTriple::fromWSDialogObject: '+e.name+": "+e.message);}};DialogTriple.fromListOfWSDialogObject=function(jsonObject,Ltype,factoryFn,ignoreRedirection){if(ignoreRedirection===void 0){ignoreRedirection=false;}return DialogTriple.extractList(jsonObject,Ltype,function(value){ /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
             i.e. list items should be lype assignment compatible*/if(!value)return new fp_1.Success(null);var Otype=value['WS_OTYPE']||Ltype;return DialogTriple.fromWSDialogObject(value,Otype,factoryFn,ignoreRedirection);});};DialogTriple.fromWSDialogObjectResult=function(jsonObject,resultOtype,targetOtype,objPropName,factoryFn){return DialogTriple.extractValue(jsonObject,resultOtype,function(){return DialogTriple.fromWSDialogObject(jsonObject[objPropName],targetOtype,factoryFn);});};DialogTriple.fromWSDialogObjectsResult=function(jsonObject,resultOtype,targetLtype,objPropName,factoryFn){return DialogTriple.extractValue(jsonObject,resultOtype,function(){return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName],targetLtype,factoryFn);});};DialogTriple._extractTriple=function(jsonObject,Otype,ignoreRedirection,extractor){if(!jsonObject){return new fp_1.Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE '+Otype+' because json object is null');}else {if(Array.isArray(jsonObject)){ //verify we're dealing with a nested List
if(Otype.indexOf('List')!==0){return new fp_1.Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");}}else {var ot=jsonObject['WS_OTYPE'];if(!ot||Otype!==ot){return new fp_1.Failure('DialogTriple:extractTriple: expected O_TYPE '+Otype+' but found '+ot);}else {if(jsonObject['exception']){var dialogExceptionTry=OType.deserializeObject(jsonObject['exception'],'WSException',OType.factoryFn);if(dialogExceptionTry.isFailure){util_1.Log.error('Failed to deserialize exception obj: '+util_1.ObjUtil.formatRecAttr(jsonObject['exception']));return new fp_1.Failure(jsonObject['exception']);}else {return new fp_1.Failure(dialogExceptionTry.success);}}else if(jsonObject['redirection']&&!ignoreRedirection){var drt=DialogTriple.fromWSDialogObject(jsonObject['redirection'],'WSRedirection',OType.factoryFn);if(drt.isFailure){return new fp_1.Failure(drt.failure);}else {var either=fp_1.Either.left(drt.success);return new fp_1.Success(either);}}}}var result;if(extractor){var valueTry=extractor();if(valueTry.isFailure){result=new fp_1.Failure(valueTry.failure);}else {result=new fp_1.Success(fp_1.Either.right(valueTry.success));}}else {result=new fp_1.Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');}return result;}};DialogTriple._extractValue=function(jsonObject,Otype,ignoreRedirection,extractor){var tripleTry=DialogTriple._extractTriple(jsonObject,Otype,ignoreRedirection,extractor);var result;if(tripleTry.isFailure){result=new fp_1.Failure(tripleTry.failure);}else {var triple=tripleTry.success;if(triple.isLeft){result=new fp_1.Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: '+Otype);}else {result=new fp_1.Success(triple.right);}}return result;};return DialogTriple;}();exports.DialogTriple=DialogTriple; /**
 * *********************************
 */var EditorState;(function(EditorState){EditorState[EditorState["READ"]=0]="READ";EditorState[EditorState["WRITE"]=1]="WRITE";EditorState[EditorState["DESTROYED"]=2]="DESTROYED";})(EditorState||(EditorState={}));; /**
 * In the same way that a {@link PropDef} describes a {@link Prop}, an EntityRecDef describes an {@link EntityRec}.
 * It is composed of {@link PropDef}s while the {@link EntityRec} is composed of {@link Prop}s.
 * In other words it describes the structure or makeup of a row or record, but does not contain the data values themselves.
 * The corresponding {@link EntityRec} contains the actual values.
  */var EntityRecDef=function(){function EntityRecDef(_propDefs){this._propDefs=_propDefs;}Object.defineProperty(EntityRecDef.prototype,"propCount",{get:function get(){return this.propDefs.length;},enumerable:true,configurable:true});EntityRecDef.prototype.propDefAtName=function(name){var propDef=null;this.propDefs.some(function(p){if(p.name===name){propDef=p;return true;}return false;});return propDef;};Object.defineProperty(EntityRecDef.prototype,"propDefs",{ // Note we need to support both 'propDefs' and 'propertyDefs' as both
// field names seem to be used in the dialog model
get:function get(){return this._propDefs;},set:function set(propDefs){this._propDefs=propDefs;},enumerable:true,configurable:true});Object.defineProperty(EntityRecDef.prototype,"propertyDefs",{get:function get(){return this._propDefs;},set:function set(propDefs){this._propDefs=propDefs;},enumerable:true,configurable:true});Object.defineProperty(EntityRecDef.prototype,"propNames",{get:function get(){return this.propDefs.map(function(p){return p.name;});},enumerable:true,configurable:true});return EntityRecDef;}();exports.EntityRecDef=EntityRecDef; /**
 * Utility to construct a FormContext hierarchy from a {@link DialogRedirection}.
 */var FormContextBuilder=function(){function FormContextBuilder(){}FormContextBuilder.createWithRedirection=function(dialogRedirection,actionSource,sessionContext){var fb=new FormContextBuilder();fb._dialogRedirection=dialogRedirection;fb._actionSource=actionSource;fb._sessionContext=sessionContext;return fb;};FormContextBuilder.createWithInitialForm=function(initialFormXOpenFr,initialXFormDefFr,dialogRedirection,actionSource,sessionContext){var fb=new FormContextBuilder();fb._initialFormXOpenFr=initialFormXOpenFr;fb._initialXFormDefFr=initialXFormDefFr;fb._dialogRedirection=dialogRedirection;fb._actionSource=actionSource;fb._sessionContext=sessionContext;return fb;};Object.defineProperty(FormContextBuilder.prototype,"actionSource",{ /**
         * Get the action source for this Pane
         * @returns {ActionSource}
         */get:function get(){return this._actionSource;},enumerable:true,configurable:true});FormContextBuilder.prototype.build=function(){var _this=this;if(this.dialogRedirection&&!this.dialogRedirection.isEditor){return fp_1.Future.createFailedFuture('FormContextBuilder::build','Forms with a root query model are not supported');}var xOpenFr=this._initialFormXOpenFr?this._initialFormXOpenFr:DialogService.openEditorModelFromRedir(this.dialogRedirection,this.sessionContext);var openAllFr=xOpenFr.bind(function(formXOpen){var formXOpenFr=fp_1.Future.createSuccessfulFuture('FormContext/open/openForm',formXOpen);var formXFormDefFr=_this._initialXFormDefFr?_this._initialXFormDefFr:_this.fetchXFormDefWithXOpenResult(formXOpen);var formMenuDefsFr=DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle,_this.sessionContext); //expect a sequence of child def components or a sequence of FormContexts (nested forms)
var formChildrenFr=formXFormDefFr.bind(function(xFormDef){if(!_this.containsNestedForms(formXOpen,xFormDef)){var childrenXOpenFr=_this.openChildren(formXOpen);var childrenXPaneDefsFr=_this.fetchChildrenXPaneDefs(formXOpen,xFormDef);var childrenActiveColDefsFr=_this.fetchChildrenActiveColDefs(formXOpen);var childrenMenuDefsFr=_this.fetchChildrenMenuDefs(formXOpen);var childrenViewDescsFr=_this.fetchChildrenViewDescs(formXOpen);var childrenPrintMarkupXMLFr=_this.fetchChildrenPrintMarkupXMLs(formXOpen);return fp_1.Future.sequence([childrenXOpenFr,childrenXPaneDefsFr,childrenActiveColDefsFr,childrenMenuDefsFr,childrenPrintMarkupXMLFr]);}else { //added to support nested forms
return fp_1.Future.sequence(_this.loadNestedForms(formXOpen,xFormDef));}});return fp_1.Future.sequence([formXOpenFr,formXFormDefFr,formMenuDefsFr,formChildrenFr]);});return openAllFr.bind(function(value){var flattenedTry=_this.getFlattenedResults(value);if(flattenedTry.failure){return fp_1.Future.createCompletedFuture('FormContextBuilder::build',new fp_1.Failure(flattenedTry.failure));}var formDefTry=_this.completeOpenPromise(flattenedTry.success); //check for nested form contexts and set the paneRefs
var formContexts=_this.retrieveChildFormContexts(flattenedTry.success).map(function(formContext,n){formContext.paneRef=n;return formContext;});var formContextTry=null;if(formDefTry.isFailure){formContextTry=new fp_1.Failure(formDefTry.failure);}else {var formDef=formDefTry.success; //if this is a nested form, use the child form contexts, otherwise, create new children
var childContexts=formContexts&&formContexts.length>0?formContexts:_this.createChildrenContexts(formDef);if(_this.dialogRedirection&&_this.dialogRedirection.fromDialogProperties){formDef.dialogRedirection.fromDialogProperties=util_1.ObjUtil.addAllProps(_this.dialogRedirection.fromDialogProperties,{});}var formContext=new FormContext(formDef.dialogRedirection,_this._actionSource,formDef,childContexts,false,false,_this.sessionContext);formContextTry=new fp_1.Success(formContext);}return fp_1.Future.createCompletedFuture('FormContextBuilder::build',formContextTry);});};Object.defineProperty(FormContextBuilder.prototype,"dialogRedirection",{ /**
         * Get the {@link DialogRedirection} with which this Form was constructed
         * @returns {DialogRedirection}
         */get:function get(){return this._dialogRedirection;},enumerable:true,configurable:true});Object.defineProperty(FormContextBuilder.prototype,"sessionContext",{get:function get(){return this._sessionContext;},enumerable:true,configurable:true}); //added to support nested forms
FormContextBuilder.prototype.buildFormModelForNestedForm=function(topFormXOpen,formModelComp,childFormModelComps){var formModel=new XFormModel(formModelComp,topFormXOpen.formModel.header,childFormModelComps,topFormXOpen.formModel.placement,topFormXOpen.formModel.refreshTimer,topFormXOpen.formModel.sizeToWindow);return formModel;};FormContextBuilder.prototype.completeOpenPromise=function(flattened){if(flattened.length!=4)return new fp_1.Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');var formXOpen=flattened[0];var formXFormDef=flattened[1];var formMenuDefs=flattened[2];var formChildren=flattened[3];if(formChildren.length===0)return new fp_1.Failure('FormContextBuilder::build: Form has no children');if(formChildren[0] instanceof FormContext){ //we're dealing with a nested form
var childPaneDefs=formChildren.map(function(formContext){return formContext.formDef;});var settings={'open':true};util_1.ObjUtil.addAllProps(formXOpen.formRedirection.dialogProperties,settings);var headerDef=null;return new fp_1.Success(new FormDef(formXOpen.formPaneId,formXFormDef.name,formXOpen.formModel.form.label,formXFormDef.title,formMenuDefs,formXOpen.entityRecDef,formXOpen.formRedirection,settings,formXFormDef.formLayout,formXFormDef.formStyle,formXFormDef.borderStyle,headerDef,childPaneDefs));}else { //build the form with child components
if(formChildren.length!=5)return new fp_1.Failure('FormContextBuilder::build: Open form should have resulted in 5 elements for children panes');var childrenXOpens=formChildren[0];var childrenXPaneDefs=formChildren[1];var childrenXActiveColDefs=formChildren[2];var childrenMenuDefs=formChildren[3];var childrenPrintMarkupXML=formChildren[4];return FormDef.fromOpenFormResult(formXOpen,formXFormDef,formMenuDefs,childrenXOpens,childrenXPaneDefs,childrenXActiveColDefs,childrenMenuDefs,childrenPrintMarkupXML);}};FormContextBuilder.prototype.containsNestedForms=function(formXOpen,xFormDef){return xFormDef.paneDefRefs.some(function(paneDefRef){return paneDefRef.type===XPaneDefRef.FORM_TYPE;});};FormContextBuilder.prototype.createChildrenContexts=function(formDef){var result=[];formDef.childrenDefs.forEach(function(paneDef,i){if(paneDef instanceof ListDef){result.push(new ListContext(i));}else if(paneDef instanceof DetailsDef){result.push(new DetailsContext(i));}else if(paneDef instanceof PrintMarkupDef){result.push(new PrintMarkupContext(i));}else if(paneDef instanceof MapDef){result.push(new MapContext(i));}else if(paneDef instanceof GraphDef){result.push(new GraphContext(i));}else if(paneDef instanceof CalendarDef){result.push(new CalendarContext(i));}else if(paneDef instanceof ImagePickerDef){result.push(new ImagePickerContext(i));}else if(paneDef instanceof BarcodeScanDef){result.push(new BarcodeScanContext(i));}else if(paneDef instanceof GeoFixDef){result.push(new GeoFixContext(i));}else if(paneDef instanceof GeoLocationDef){result.push(new GeoLocationContext(i));}else if(paneDef instanceof ErrorDef){result.push(new PaneContext(i));}});return result;};FormContextBuilder.prototype.fetchChildrenActiveColDefs=function(formXOpen){var _this=this;var xComps=formXOpen.formModel.children;var seqOfFutures=xComps.map(function(xComp){if(xComp.redirection.isQuery){return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle,_this.sessionContext);}else {return fp_1.Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs',null);}});return fp_1.Future.sequence(seqOfFutures);};FormContextBuilder.prototype.fetchChildrenMenuDefs=function(formXOpen){var _this=this;var xComps=formXOpen.formModel.children;var seqOfFutures=xComps.map(function(xComp){if(xComp.redirection.isEditor){return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle,_this.sessionContext);}else {return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle,_this.sessionContext);}});return fp_1.Future.sequence(seqOfFutures);};FormContextBuilder.prototype.fetchChildrenViewDescs=function(formXOpen){var _this=this;var xComps=formXOpen.formModel.children;var seqOfFutures=xComps.map(function(xComp){if(xComp.redirection.isEditor){return DialogService.getAvailableEditorViewDescs(xComp.redirection.dialogHandle,_this.sessionContext);}else {return DialogService.getAvailableQueryViewDescs(xComp.redirection.dialogHandle,_this.sessionContext);}});return fp_1.Future.sequence(seqOfFutures);};FormContextBuilder.prototype.fetchChildrenXPaneDefs=function(formXOpen,xFormDef){var _this=this;var formHandle=formXOpen.formModel.form.redirection.dialogHandle;var xRefs=xFormDef.paneDefRefs;var seqOfFutures=xRefs.map(function(xRef){return DialogService.getEditorModelPaneDef(formHandle,xRef.paneId,_this.sessionContext);});return fp_1.Future.sequence(seqOfFutures);};FormContextBuilder.prototype.fetchChildrenPrintMarkupXMLs=function(formXOpen){var seqOfFutures=[];for(var _i=0,_a=formXOpen.formModel.children;_i<_a.length;_i++){var x=_a[_i];var url=""; // x.redirection.dialogProperties["formsURL"];  // Prevent pre-ship of Print function
var f=null;if(url){url="https://dl.dropboxusercontent.com/u/81169924/formR0.xml"; // Test form as others are zipped.
var wC=ws_1.ClientFactory.getClient();f=wC.stringGet(url);}else {f=fp_1.Future.createSuccessfulFuture('fetchChildrenPrintMarkupXMLs/printMarkupXML',"");}seqOfFutures.push(f);}return fp_1.Future.sequence(seqOfFutures);};FormContextBuilder.prototype.fetchXFormDefWithXOpenResult=function(xformOpenResult){var dialogHandle=xformOpenResult.formRedirection.dialogHandle;var formPaneId=xformOpenResult.formPaneId;return this.fetchXFormDef(dialogHandle,formPaneId);};FormContextBuilder.prototype.fetchXFormDef=function(dialogHandle,formPaneId){return DialogService.getEditorModelPaneDef(dialogHandle,formPaneId,this.sessionContext).bind(function(value){if(value instanceof XFormDef){return fp_1.Future.createSuccessfulFuture('fetchXFormDef/success',value);}else {return fp_1.Future.createFailedFuture('fetchXFormDef/failure','Expected reponse to contain an XFormDef but got '+util_1.ObjUtil.formatRecAttr(value));}});};FormContextBuilder.prototype.getFlattenedResults=function(openAllResults){var flattenedTry=fp_1.Try.flatten(openAllResults);if(flattenedTry.isFailure){return new fp_1.Failure('FormContextBuilder::build: '+util_1.ObjUtil.formatRecAttr(flattenedTry.failure));}return flattenedTry;};FormContextBuilder.prototype.loadNestedForms=function(formXOpen,xFormDef){var _this=this;var seqOfFutures=xFormDef.paneDefRefs.filter(function(paneDefRef){return paneDefRef.type===XPaneDefRef.FORM_TYPE;}).map(function(paneDefRef){ //find the child 'formComp' (from the XOpenEditorModelResult) for each 'child pane' in the formDef (from the XFormDef)
var xChildFormCompForPaneDefRef=util_1.ArrayUtil.find(formXOpen.formModel.children,function(xChildComp){return xChildComp.paneId===paneDefRef.paneId;}); //fetch the form def, for the child form
return _this.fetchXFormDef(xChildFormCompForPaneDefRef.redirection.dialogHandle,xChildFormCompForPaneDefRef.paneId).bind(function(childXFormDef){ //fetch child form's children (child comps)
var childFormModelComps=childXFormDef.paneDefRefs.map(function(childPaneDefRef){return util_1.ArrayUtil.find(formXOpen.formModel.children,function(xChildComp){return xChildComp.paneId===childPaneDefRef.paneId;});});var xFormModel=_this.buildFormModelForNestedForm(formXOpen,xChildFormCompForPaneDefRef,childFormModelComps);var xOpenEditorModelResult=new XOpenEditorModelResult(formXOpen.editorRecordDef,xFormModel);var formContextFr=FormContextBuilder.createWithInitialForm(fp_1.Future.createSuccessfulFuture('FormContextBuilder::loadNestedForms',xOpenEditorModelResult),fp_1.Future.createSuccessfulFuture('FormContextBuilder::loadNestedForms',childXFormDef),xChildFormCompForPaneDefRef.redirection,_this.actionSource,_this.sessionContext).build();return formContextFr;});});return seqOfFutures;};FormContextBuilder.prototype.openChildren=function(formXOpen){var _this=this;var xComps=formXOpen.formModel.children;var seqOfFutures=[];xComps.forEach(function(nextXComp){var nextFr=null;if(nextXComp.redirection.isEditor){nextFr=DialogService.openEditorModelFromRedir(nextXComp.redirection,_this.sessionContext);}else {nextFr=DialogService.openQueryModelFromRedir(nextXComp.redirection,_this.sessionContext);}seqOfFutures.push(nextFr);});return fp_1.Future.sequence(seqOfFutures).map(function(results){return results.map(function(openTry){return openTry.isFailure?new fp_1.Success(new XOpenDialogModelErrorResult(openTry.failure)):openTry;});});};FormContextBuilder.prototype.retrieveChildFormContexts=function(flattened){var formContexts=[];if(flattened.length>3){var formChildren=flattened[3];if(formChildren&&formChildren.length>0){if(formChildren[0] instanceof FormContext){formContexts=formChildren;}}}return formContexts;};return FormContextBuilder;}();exports.FormContextBuilder=FormContextBuilder; /**
 * *********************************
 */ /**
 * @private
 */var GatewayService=function(){function GatewayService(){}GatewayService.getServiceEndpoint=function(tenantId,serviceName,gatewayHost){var f=ws_1.Get.fromUrl('https://'+gatewayHost+'/'+tenantId+'/'+serviceName).perform();var endPointFuture=f.bind(function(jsonObject){ //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
return fp_1.Future.createSuccessfulFuture("serviceEndpoint",jsonObject);});return endPointFuture;};return GatewayService;}();exports.GatewayService=GatewayService; /**
 * *********************************
 */var GeoFix=function(){function GeoFix(_latitude,_longitude,_source,_accuracy){this._latitude=_latitude;this._longitude=_longitude;this._source=_source;this._accuracy=_accuracy;}GeoFix.fromFormattedValue=function(value){var pair=util_1.StringUtil.splitSimpleKeyValuePair(value);return new GeoFix(Number(pair[0]),Number(pair[1]),null,null);};Object.defineProperty(GeoFix.prototype,"latitude",{get:function get(){return this._latitude;},enumerable:true,configurable:true});Object.defineProperty(GeoFix.prototype,"longitude",{get:function get(){return this._longitude;},enumerable:true,configurable:true});Object.defineProperty(GeoFix.prototype,"source",{get:function get(){return this._source;},enumerable:true,configurable:true});Object.defineProperty(GeoFix.prototype,"accuracy",{get:function get(){return this._accuracy;},enumerable:true,configurable:true});GeoFix.prototype.toString=function(){return this.latitude+":"+this.longitude;};return GeoFix;}();exports.GeoFix=GeoFix; /**
 * *********************************
 */var GeoLocation=function(){function GeoLocation(_latitude,_longitude){this._latitude=_latitude;this._longitude=_longitude;}GeoLocation.fromFormattedValue=function(value){var pair=util_1.StringUtil.splitSimpleKeyValuePair(value);return new GeoLocation(Number(pair[0]),Number(pair[1]));};Object.defineProperty(GeoLocation.prototype,"latitude",{get:function get(){return this._latitude;},enumerable:true,configurable:true});Object.defineProperty(GeoLocation.prototype,"longitude",{get:function get(){return this._longitude;},enumerable:true,configurable:true});GeoLocation.prototype.toString=function(){return this.latitude+":"+this.longitude;};return GeoLocation;}();exports.GeoLocation=GeoLocation; /**
 * *********************************
 */var GraphDataPointDef=function(){function GraphDataPointDef(name,type,plotType,legendKey,bubbleRadiusName,bubbleRadiusType,seriesColor,xAxisName,xAxisType){this.name=name;this.type=type;this.plotType=plotType;this.legendKey=legendKey;this.bubbleRadiusName=bubbleRadiusName;this.bubbleRadiusType=bubbleRadiusType;this.seriesColor=seriesColor;this.xAxisName=xAxisName;this.xAxisType=xAxisType;}return GraphDataPointDef;}();exports.GraphDataPointDef=GraphDataPointDef; /**
 * *********************************
 */var MenuDef=function(){function MenuDef(_name,_type,_actionId,_mode,_label,_iconName,_directive,_showOnMenu,_menuDefs){this._name=_name;this._type=_type;this._actionId=_actionId;this._mode=_mode;this._label=_label;this._iconName=_iconName;this._directive=_directive;this._showOnMenu=_showOnMenu;this._menuDefs=_menuDefs;}MenuDef.findSubMenuDef=function(md,matcher){if(matcher(md))return md;if(md.menuDefs){for(var i=0;i<md.menuDefs.length;i++){var result=MenuDef.findSubMenuDef(md.menuDefs[i],matcher);if(result)return result;}}return null;};Object.defineProperty(MenuDef.prototype,"actionId",{get:function get(){return this._actionId;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"directive",{get:function get(){return this._directive;},enumerable:true,configurable:true});MenuDef.prototype.findAtId=function(actionId){if(this.actionId===actionId)return this;var result=null;if(this.menuDefs){this.menuDefs.some(function(md){result=md.findAtId(actionId);return result!=null;});}return result;};MenuDef.prototype.findContextMenuDef=function(){return MenuDef.findSubMenuDef(this,function(md){return md.name==='CONTEXT_MENU';});};Object.defineProperty(MenuDef.prototype,"iconName",{get:function get(){return this._iconName;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"isPresaveDirective",{get:function get(){return this._directive&&this._directive==='PRESAVE';},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"isRead",{get:function get(){return this._mode&&this._mode.indexOf('R')>-1;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"isSeparator",{get:function get(){return this._type&&this._type==='separator';},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"isWrite",{get:function get(){return this._mode&&this._mode.indexOf('W')>-1;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"label",{get:function get(){return this._label;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"menuDefs",{ /**
         * Get the child {@link MenuDef}'s
         * @returns {Array<MenuDef>}
         */get:function get(){return this._menuDefs;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"mode",{get:function get(){return this._mode;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"showOnMenu",{get:function get(){if(this._showOnMenu==null){return true;}else {return this._showOnMenu;}},enumerable:true,configurable:true});Object.defineProperty(MenuDef.prototype,"type",{get:function get(){return this._type;},enumerable:true,configurable:true});return MenuDef;}();exports.MenuDef=MenuDef;var NavRequestUtil=function(){function NavRequestUtil(){}NavRequestUtil.fromRedirection=function(redirection,actionSource,sessionContext){var result;if(redirection instanceof WebRedirection){result=fp_1.Future.createSuccessfulFuture('NavRequest::fromRedirection',redirection);}else if(redirection instanceof WorkbenchRedirection){var wbr=redirection;result=AppContext.singleton.getWorkbench(sessionContext,wbr.workbenchId).map(function(wb){return wb;});}else if(redirection instanceof DialogRedirection){var dr=redirection;var fcb=FormContextBuilder.createWithRedirection(dr,actionSource,sessionContext);result=fcb.build();}else if(redirection instanceof NullRedirection){var nullRedir=redirection;var nullNavRequest=new NullNavRequest();util_1.ObjUtil.addAllProps(nullRedir.fromDialogProperties,nullNavRequest.fromDialogProperties);result=fp_1.Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection',nullNavRequest);}else {result=fp_1.Future.createFailedFuture('NavRequest::fromRedirection','Unrecognized type of Redirection '+util_1.ObjUtil.formatRecAttr(redirection));}return result;};return NavRequestUtil;}();exports.NavRequestUtil=NavRequestUtil; /**
 * *********************************
 */var NullNavRequest=function(){function NullNavRequest(){this.fromDialogProperties={};}return NullNavRequest;}();exports.NullNavRequest=NullNavRequest; /**
 * *********************************
 */var ObjectRef=function(){function ObjectRef(_objectId,_description){this._objectId=_objectId;this._description=_description;}ObjectRef.fromFormattedValue=function(value){var pair=util_1.StringUtil.splitSimpleKeyValuePair(value);return new ObjectRef(pair[0],pair[1]);};Object.defineProperty(ObjectRef.prototype,"description",{get:function get(){return this._description;},enumerable:true,configurable:true});Object.defineProperty(ObjectRef.prototype,"objectId",{get:function get(){return this._objectId;},enumerable:true,configurable:true});ObjectRef.prototype.toString=function(){return this.objectId+":"+this.description;};return ObjectRef;}();exports.ObjectRef=ObjectRef; /**
 * *********************************
 */(function(PaneMode){PaneMode[PaneMode["READ"]=0]="READ";PaneMode[PaneMode["WRITE"]=1]="WRITE";})(exports.PaneMode||(exports.PaneMode={}));var PaneMode=exports.PaneMode; /**
 * Contains information that 'defines' a property {@link Prop} (name/value)
 * The information describes the property and can be thought of as the property 'type.
 * An instance of the {@link Prop} contains the actual data value.
 */var PropDef=function(){function PropDef(_name,_type,_elementType,_style,_propertyLength,_propertyScale,_presLength,_presScale,_dataDictionaryKey,_maintainable,_writeEnabled,_canCauseSideEffects){this._name=_name;this._type=_type;this._elementType=_elementType;this._style=_style;this._propertyLength=_propertyLength;this._propertyScale=_propertyScale;this._presLength=_presLength;this._presScale=_presScale;this._dataDictionaryKey=_dataDictionaryKey;this._maintainable=_maintainable;this._writeEnabled=_writeEnabled;this._canCauseSideEffects=_canCauseSideEffects;}Object.defineProperty(PropDef.prototype,"canCauseSideEffects",{ /**
         * Gets whether or not a refresh is needed after a change in this property's value
         * @returns {boolean}
         */get:function get(){return this._canCauseSideEffects;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"dataDictionaryKey",{get:function get(){return this._dataDictionaryKey;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"elementType",{get:function get(){return this._elementType;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isBarcodeType",{get:function get(){return this.type&&this.type==='STRING'&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_BARCODE';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isBinaryType",{get:function get(){return this.isLargeBinaryType;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isBooleanType",{get:function get(){return this.type&&this.type==='BOOLEAN';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isCodeRefType",{get:function get(){return this.type&&this.type==='CODE_REF';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isDateType",{get:function get(){return this.type&&this.type==='DATE';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isDateTimeType",{get:function get(){return this.type&&this.type==='DATE_TIME';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isDecimalType",{get:function get(){return this.type&&this.type==='DECIMAL';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isDoubleType",{get:function get(){return this.type&&this.type==='DOUBLE';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isEmailType",{get:function get(){return this.type&&this.type==='DATA_EMAIL';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isFileAttachment",{get:function get(){return this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_UPLOAD_FILE';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isGeoFixType",{get:function get(){return this.type&&this.type==='GEO_FIX';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isGeoLocationType",{get:function get(){return this.type&&this.type==='GEO_LOCATION';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isHTMLType",{get:function get(){return this.type&&this.type==='DATA_HTML';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isListType",{get:function get(){return this.type&&this.type==='LIST';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isInlineMediaStyle",{get:function get(){return this.style&&(this.style===PropDef.STYLE_INLINE_MEDIA||this.style===PropDef.STYLE_INLINE_MEDIA2);},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isIntType",{get:function get(){return this.type&&this.type==='INT';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isLargeBinaryType",{get:function get(){return this.type&&this.type==='com.dgoi.core.domain.BinaryRef'&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_LARGEBINARY';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isLongType",{get:function get(){return this.type&&this.type==='LONG';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isMoneyType",{get:function get(){return this.isNumericType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_MONEY';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isNumericType",{get:function get(){return this.isDecimalType||this.isDoubleType||this.isIntType||this.isLongType;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isObjRefType",{get:function get(){return this.type&&this.type==='OBJ_REF';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isPasswordType",{get:function get(){return this.isStringType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_PASSWORD';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isPercentType",{get:function get(){return this.isNumericType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_PERCENT';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isStringType",{get:function get(){return this.type&&this.type==='STRING';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isTelephoneType",{get:function get(){return this.isStringType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_TELEPHONE';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isTextBlock",{get:function get(){return this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_TEXT_BLOCK';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isTimeType",{get:function get(){return this.type&&this.type==='TIME';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isUnformattedNumericType",{get:function get(){return this.isNumericType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_UNFORMATTED_NUMBER';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"isURLType",{get:function get(){return this.isStringType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_URL';},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"maintainable",{get:function get(){return this._maintainable;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"presLength",{get:function get(){return this._presLength;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"presScale",{get:function get(){return this._presScale;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"propertyLength",{get:function get(){return this._propertyLength;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"propertyScale",{get:function get(){return this._propertyScale;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"style",{get:function get(){return this._style;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"type",{get:function get(){return this._type;},enumerable:true,configurable:true});Object.defineProperty(PropDef.prototype,"writeEnabled",{get:function get(){return this._writeEnabled;},enumerable:true,configurable:true});PropDef.STYLE_INLINE_MEDIA="inlineMedia";PropDef.STYLE_INLINE_MEDIA2="Image/Video";return PropDef;}();exports.PropDef=PropDef; /**
 * Helper for transforming values to and from formats suitable for reading and writing to the server
 * (i.e. object to string and string to object)
 */var PropFormatter=function(){function PropFormatter(){} /**
     * Get a string representation of this property suitable for 'reading'
     * @param prop
     * @param propDef
     * @returns {string}
     */PropFormatter.formatForRead=function(prop,propDef){if(prop===null||prop===undefined||prop.value===null||prop.value===undefined){return '';}else {return PropFormatter.formatValueForRead(prop.value,propDef);}};PropFormatter.formatValueForRead=function(value,propDef){if(propDef&&propDef.isCodeRefType||value instanceof CodeRef){return value.description;}else if(propDef&&propDef.isObjRefType||value instanceof ObjectRef){return value.description;}else {return PropFormatter.toString(value,propDef);}}; /**
     * Get a string representation of this property suitable for 'writing'
     * @param prop
     * @param propDef
     * @returns {string}
     */PropFormatter.formatForWrite=function(prop,propDef){if(prop===null||prop===undefined||prop.value===null||prop.value===undefined){return null;}else if(propDef&&propDef.isCodeRefType||prop.value instanceof CodeRef){return prop.value.description;}else if(propDef&&propDef.isObjRefType||prop.value instanceof ObjectRef){return prop.value.description;}else {return PropFormatter.toString(prop.value,propDef);}}; /**
     * Attempt to construct (or preserve) the appropriate data type given primitive (or already constructed) value.
     * @param value
     * @param propDef
     * @returns {any}
     */PropFormatter.parse=function(value,propDef){var propValue=value;if(propDef.isDecimalType){propValue=Number(value);}else if(propDef.isLongType){propValue=Number(value);}else if(propDef.isBooleanType){if(typeof value==='string'){propValue=value!=='false';}else {propValue=!!value;}}else if(propDef.isDateType){ //this could be a DateValue, a Date, or a string    
if(value instanceof util_1.DateValue){propValue=value;}else if((typeof value==="undefined"?"undefined":_typeof(value))==='object'){propValue=new util_1.DateValue(value);}else { //parse as local time
propValue=new util_1.DateValue(moment(value).toDate());}}else if(propDef.isDateTimeType){ //this could be a DateTimeValue, a Date, or a string    
if(value instanceof util_1.DateTimeValue){propValue=value;}else if((typeof value==="undefined"?"undefined":_typeof(value))==='object'){propValue=new util_1.DateTimeValue(value);}else { //parse as local time
propValue=new util_1.DateTimeValue(moment(value).toDate());}}else if(propDef.isTimeType){propValue=value instanceof util_1.TimeValue?value:util_1.TimeValue.fromString(value);}else if(propDef.isObjRefType){propValue=value instanceof ObjectRef?value:ObjectRef.fromFormattedValue(value);}else if(propDef.isCodeRefType){propValue=value instanceof CodeRef?value:CodeRef.fromFormattedValue(value);}else if(propDef.isGeoFixType){propValue=value instanceof GeoFix?value:GeoFix.fromFormattedValue(value);}else if(propDef.isGeoLocationType){propValue=value instanceof GeoLocation?value:GeoLocation.fromFormattedValue(value);}return propValue;}; /**
     * Render this value as a string
     * @param o
     * @param propDef
     * @returns {any}
     */PropFormatter.toString=function(o,propDef){if(typeof o==='number'){if(propDef){if(propDef.isMoneyType){return o.toFixed(2);}else if(propDef.isIntType||propDef.isLongType){return o.toFixed(0);}else if(propDef.isDecimalType||propDef.isDoubleType){return o.toFixed(Math.max(2,(o.toString().split('.')[1]||[]).length));}}else {return String(o);}}else if((typeof o==="undefined"?"undefined":_typeof(o))==='object'){if(o instanceof Date){return o.toISOString();}else if(o instanceof util_1.DateValue){return o.dateObj.toISOString();}else if(o instanceof util_1.DateTimeValue){return o.dateObj.toISOString();}else if(o instanceof util_1.TimeValue){return o.toString();}else if(o instanceof CodeRef){return o.toString();}else if(o instanceof ObjectRef){return o.toString();}else if(o instanceof GeoFix){return o.toString();}else if(o instanceof GeoLocation){return o.toString();}else {return String(o);}}else {return String(o);}};return PropFormatter;}();exports.PropFormatter=PropFormatter; /**
 * Represents a 'value' or field in a row or record. See {@link EntityRec}
 * A Prop has a corresponding {@link PropDef} that describes the property.
 * Like an {@link EntityRec}, a Prop may also have {@link DataAnno}s (style annotations),
 * but these apply to the property only
 */var Prop=function(){ /**
     *
     * @private
     * @param _name
     * @param _value
     * @param _annos
     */function Prop(_name,_value,_annos){if(_annos===void 0){_annos=[];}this._name=_name;this._value=_value;this._annos=_annos;} /**
     * @private
     * @param values
     * @returns {Success}
     */Prop.fromListOfWSValue=function(values){var props=[];values.forEach(function(v){var propTry=Prop.fromWSValue(v);if(propTry.isFailure)return new fp_1.Failure(propTry.failure);props.push(propTry.success);});return new fp_1.Success(props);}; /**
     * @private
     * @param name
     * @param value
     * @returns {any}
     */Prop.fromWSNameAndWSValue=function(name,value){var propTry=Prop.fromWSValue(value);if(propTry.isFailure){return new fp_1.Failure(propTry.failure);}return new fp_1.Success(new Prop(name,propTry.success));}; /**
     * @private
     * @param names
     * @param values
     * @returns {any}
     */Prop.fromWSNamesAndValues=function(names,values){if(names.length!=values.length){return new fp_1.Failure("Prop::fromWSNamesAndValues: names and values must be of same length");}var list=[];for(var i=0;i<names.length;i++){var propTry=Prop.fromWSNameAndWSValue(names[i],values[i]);if(propTry.isFailure){return new fp_1.Failure(propTry.failure);}list.push(propTry.success);}return new fp_1.Success(list);}; /**
     * @private
     * @param value
     * @returns {any}
     */Prop.fromWSValue=function(value){var propValue=value;if(value&&'object'===(typeof value==="undefined"?"undefined":_typeof(value))){var PType=value['WS_PTYPE'];var strVal=value['value'];if(PType){if(PType==='Decimal'){propValue=Number(strVal);}else if(PType==='Date'){ //parse as ISO - no offset specified by server right now, so we assume local time
propValue=moment(strVal,'YYYY-M-D').toDate();}else if(PType==='DateTime'){ //parse as ISO - no offset specified by server right now, so we assume local time
//strip invalid suffix (sometimes) provided by server 
var i=strVal.indexOf('T0:');propValue=moment(i>-1?strVal.substring(0,i):strVal).toDate();}else if(PType==='Time'){propValue=util_1.TimeValue.fromString(strVal);}else if(PType==='BinaryRef'){var binaryRefTry=BinaryRef.fromWSValue(strVal,value['properties']);if(binaryRefTry.isFailure)return new fp_1.Failure(binaryRefTry.failure);propValue=binaryRefTry.success;}else if(PType==='ObjectRef'){propValue=ObjectRef.fromFormattedValue(strVal);}else if(PType==='CodeRef'){propValue=CodeRef.fromFormattedValue(strVal);}else if(PType==='GeoFix'){propValue=GeoFix.fromFormattedValue(strVal);}else if(PType==='GeoLocation'){propValue=GeoLocation.fromFormattedValue(strVal);}else {return new fp_1.Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: '+PType);}}else if(value['WS_LTYPE']){return Prop.fromListOfWSValue(value['values']);}}return new fp_1.Success(propValue);}; /**
     * @private
     * @param otype
     * @param jsonObj
     * @returns {any}
     */Prop.fromWS=function(otype,jsonObj){var name=jsonObj['name'];var valueTry=Prop.fromWSValue(jsonObj['value']);if(valueTry.isFailure)return new fp_1.Failure(valueTry.failure);var annos=null;if(jsonObj['annos']){var annosListTry=DialogTriple.fromListOfWSDialogObject(jsonObj['annos'],'WSDataAnno',OType.factoryFn);if(annosListTry.isFailure)return new fp_1.Failure(annosListTry.failure);annos=annosListTry.success;}return new fp_1.Success(new Prop(name,valueTry.success,annos));}; /**
     * @private
     * @param o
     * @returns {any}
     */Prop.toWSProperty=function(o){if(typeof o==='number'){return {'WS_PTYPE':'Decimal','value':String(o)};}else if((typeof o==="undefined"?"undefined":_typeof(o))==='object'){if(o instanceof Date){ //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
return {'WS_PTYPE':'DateTime','value':o.toISOString().slice(0,-1)};}else if(o instanceof util_1.DateTimeValue){ //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
return {'WS_PTYPE':'DateTime','value':o.dateObj.toISOString().slice(0,-1)};}else if(o instanceof util_1.DateValue){ //remove all Time information from the end of the ISO string from the 'T' to the end...
var isoString=o.dateObj.toISOString();return {'WS_PTYPE':'Date','value':isoString.slice(0,isoString.indexOf('T'))};}else if(o instanceof util_1.TimeValue){return {'WS_PTYPE':'Time','value':o.toString()};}else if(o instanceof CodeRef){return {'WS_PTYPE':'CodeRef','value':o.toString()};}else if(o instanceof ObjectRef){return {'WS_PTYPE':'ObjectRef','value':o.toString()};}else if(o instanceof GeoFix){return {'WS_PTYPE':'GeoFix','value':o.toString()};}else if(o instanceof GeoLocation){return {'WS_PTYPE':'GeoLocation','value':o.toString()};}else if(o instanceof InlineBinaryRef){return {'WS_PTYPE':'BinaryRef','value':o.toString(),properties:o.settings};}else if(Array.isArray(o)){return Prop.toWSListOfProperties(o);}else {return o;}}else {return o;}}; /**
     *
     * @param list
     * @returns {StringDictionary}
     */Prop.toWSListOfProperties=function(list){var result={'WS_LTYPE':'Object'};var values=[];list.forEach(function(o){values.push(Prop.toWSProperty(o));});result['values']=values;return result;}; /**
     * @private
     * @param list
     * @returns {{WS_LTYPE: string, values: Array<string>}}
     */Prop.toWSListOfString=function(list){return {'WS_LTYPE':'String','values':list};}; /**
     *
     * @private
     * @param props
     * @returns {StringDictionary}
     */Prop.toListOfWSProp=function(props){var result={'WS_LTYPE':'WSProp'};var values=[];props.forEach(function(prop){values.push(prop.toWS());});result['values']=values;return result;};Object.defineProperty(Prop.prototype,"annos",{ /**
         * Get the data annotations associated with this property
         * @returns {Array<DataAnno>}
         */get:function get(){return this._annos;},enumerable:true,configurable:true});Prop.prototype.equals=function(prop){return this.name===prop.name&&this.value===prop.value;};Object.defineProperty(Prop.prototype,"backgroundColor",{get:function get(){return DataAnno.backgroundColor(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"foregroundColor",{get:function get(){return DataAnno.foregroundColor(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"imageName",{get:function get(){return DataAnno.imageName(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"imagePlacement",{get:function get(){return DataAnno.imagePlacement(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isBoldText",{get:function get(){return DataAnno.isBoldText(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isItalicText",{get:function get(){return DataAnno.isItalicText(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isPlacementCenter",{get:function get(){return DataAnno.isPlacementCenter(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isPlacementLeft",{get:function get(){return DataAnno.isPlacementLeft(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isPlacementRight",{get:function get(){return DataAnno.isPlacementRight(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isPlacementStretchUnder",{get:function get(){return DataAnno.isPlacementStretchUnder(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isPlacementUnder",{get:function get(){return DataAnno.isPlacementUnder(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"isUnderline",{get:function get(){return DataAnno.isUnderlineText(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"name",{ /**
         * Get the property name
         * @returns {string}
         */get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"overrideText",{get:function get(){return DataAnno.overrideText(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"tipText",{get:function get(){return DataAnno.tipText(this.annos);},enumerable:true,configurable:true});Object.defineProperty(Prop.prototype,"value",{ /**
         * Get the property value
         * @returns {any}
         */get:function get(){return this._value;},set:function set(value){this._value=value;},enumerable:true,configurable:true}); /**
     * @private
     * @returns {StringDictionary}
     */Prop.prototype.toWS=function(){var result={'WS_OTYPE':'WSProp','name':this.name,'value':Prop.toWSProperty(this.value)};if(this.annos){result['annos']=DataAnno.toListOfWSDataAnno(this.annos);}return result;};return Prop;}();exports.Prop=Prop; /**
 * *********************************
 */var QueryResult=function(){function QueryResult(entityRecs,hasMore){this.entityRecs=entityRecs;this.hasMore=hasMore;}return QueryResult;}();exports.QueryResult=QueryResult; /**
 * *********************************
 */var HasMoreQueryMarker=function(_super){__extends(HasMoreQueryMarker,_super);function HasMoreQueryMarker(){_super.apply(this,arguments);}HasMoreQueryMarker.singleton=new HasMoreQueryMarker();return HasMoreQueryMarker;}(NullEntityRec);exports.HasMoreQueryMarker=HasMoreQueryMarker;var IsEmptyQueryMarker=function(_super){__extends(IsEmptyQueryMarker,_super);function IsEmptyQueryMarker(){_super.apply(this,arguments);}IsEmptyQueryMarker.singleton=new IsEmptyQueryMarker();return IsEmptyQueryMarker;}(NullEntityRec);exports.IsEmptyQueryMarker=IsEmptyQueryMarker;(function(QueryMarkerOption){QueryMarkerOption[QueryMarkerOption["None"]=0]="None";QueryMarkerOption[QueryMarkerOption["IsEmpty"]=1]="IsEmpty";QueryMarkerOption[QueryMarkerOption["HasMore"]=2]="HasMore";})(exports.QueryMarkerOption||(exports.QueryMarkerOption={}));var QueryMarkerOption=exports.QueryMarkerOption;var QueryScroller=function(){function QueryScroller(_context,_pageSize,_firstObjectId,_markerOptions){if(_markerOptions===void 0){_markerOptions=[];}this._context=_context;this._pageSize=_pageSize;this._firstObjectId=_firstObjectId;this._markerOptions=_markerOptions;this.clear();}Object.defineProperty(QueryScroller.prototype,"buffer",{get:function get(){return this._buffer;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"bufferWithMarkers",{get:function get(){var result=util_1.ArrayUtil.copy(this._buffer);if(this.isComplete){if(this._markerOptions.indexOf(QueryMarkerOption.IsEmpty)>-1){if(this.isEmpty){result.push(IsEmptyQueryMarker.singleton);}}}else if(this._markerOptions.indexOf(QueryMarkerOption.HasMore)>-1){if(result.length===0){result.push(HasMoreQueryMarker.singleton);}else {if(this._hasMoreBackward){result.unshift(HasMoreQueryMarker.singleton);}if(this._hasMoreForward){result.push(HasMoreQueryMarker.singleton);}}}return result;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"context",{get:function get(){return this._context;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"firstObjectId",{get:function get(){return this._firstObjectId;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"hasMoreBackward",{get:function get(){return this._hasMoreBackward;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"hasMoreForward",{get:function get(){return this._hasMoreForward;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"isComplete",{get:function get(){return !this._hasMoreBackward&&!this._hasMoreForward;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"isCompleteAndEmpty",{get:function get(){return this.isComplete&&this._buffer.length===0;},enumerable:true,configurable:true});Object.defineProperty(QueryScroller.prototype,"isEmpty",{get:function get(){return this._buffer.length===0;},enumerable:true,configurable:true});QueryScroller.prototype.pageBackward=function(){var _this=this;if(!this._hasMoreBackward){return fp_1.Future.createSuccessfulFuture('QueryScroller::pageBackward',[]);}if(!this._prevPageFr||this._prevPageFr.isComplete){var fromObjectId=this._buffer.length===0?null:this._buffer[0].objectId;this._prevPageFr=this._context.query(this._pageSize,QueryDirection.BACKWARD,fromObjectId);}else {this._prevPageFr=this._prevPageFr.bind(function(queryResult){var fromObjectId=_this._buffer.length===0?null:_this._buffer[0].objectId;return _this._context.query(_this._pageSize,QueryDirection.BACKWARD,fromObjectId);});}var beforeSize=this._buffer.length;return this._prevPageFr.map(function(queryResult){var afterSize=beforeSize;_this._hasMoreBackward=queryResult.hasMore;if(queryResult.entityRecs.length>0){var newBuffer=[];for(var i=queryResult.entityRecs.length-1;i>-1;i--){newBuffer.push(queryResult.entityRecs[i]);}_this._buffer.forEach(function(entityRec){newBuffer.push(entityRec);});_this._buffer=newBuffer;afterSize=_this._buffer.length;}return queryResult.entityRecs;});};QueryScroller.prototype.pageForward=function(){var _this=this;if(!this._hasMoreForward){return fp_1.Future.createSuccessfulFuture('QueryScroller::pageForward',[]);}if(!this._nextPageFr||this._nextPageFr.isComplete){var fromObjectId=this._buffer.length===0?null:this._buffer[this._buffer.length-1].objectId;this._nextPageFr=this._context.query(this._pageSize,QueryDirection.FORWARD,fromObjectId);}else {this._nextPageFr=this._nextPageFr.bind(function(queryResult){var fromObjectId=_this._buffer.length===0?null:_this._buffer[_this._buffer.length-1].objectId;return _this._context.query(_this._pageSize,QueryDirection.FORWARD,fromObjectId);});}var beforeSize=this._buffer.length;return this._nextPageFr.map(function(queryResult){var afterSize=beforeSize;_this._hasMoreForward=queryResult.hasMore;if(queryResult.entityRecs.length>0){var newBuffer=[];_this._buffer.forEach(function(entityRec){newBuffer.push(entityRec);});queryResult.entityRecs.forEach(function(entityRec){newBuffer.push(entityRec);});_this._buffer=newBuffer;afterSize=_this._buffer.length;}return queryResult.entityRecs;});};Object.defineProperty(QueryScroller.prototype,"pageSize",{get:function get(){return this._pageSize;},enumerable:true,configurable:true});QueryScroller.prototype.refresh=function(){var _this=this;this.clear();return this.pageForward().map(function(entityRecList){if(entityRecList.length>0){_this._firstResultOid=entityRecList[0].objectId;}_this.context.lastRefreshTime=new Date();return entityRecList;});};QueryScroller.prototype.trimFirst=function(n){var newBuffer=[];for(var i=n;i<this._buffer.length;i++){newBuffer.push(this._buffer[i]);}this._buffer=newBuffer;this._hasMoreBackward=true;};QueryScroller.prototype.trimLast=function(n){var newBuffer=[];for(var i=0;i<this._buffer.length-n;i++){newBuffer.push(this._buffer[i]);}this._buffer=newBuffer;this._hasMoreForward=true;};QueryScroller.prototype.clear=function(){this._hasMoreBackward=!!this._firstObjectId;this._hasMoreForward=true;this._buffer=[];this._firstResultOid=null;};return QueryScroller;}();exports.QueryScroller=QueryScroller; /**
 * *********************************
 */var SessionContextImpl=function(){function SessionContextImpl(sessionHandle,userName,currentDivision,serverVersion,systemContext,tenantId){this.sessionHandle=sessionHandle;this.userName=userName;this.currentDivision=currentDivision;this.serverVersion=serverVersion;this.systemContext=systemContext;this.tenantId=tenantId;this._remoteSession=true;}SessionContextImpl.fromWSCreateSessionResult=function(jsonObject,systemContext,tenantId){var sessionContextTry=DialogTriple.fromWSDialogObject(jsonObject,'WSCreateSessionResult',OType.factoryFn);return sessionContextTry.map(function(sessionContext){sessionContext.systemContext=systemContext;sessionContext.tenantId=tenantId;return sessionContext;});};SessionContextImpl.createSessionContext=function(gatewayHost,tenantId,clientType,userId,password){var sessionContext=new SessionContextImpl(null,userId,"",null,null,tenantId);sessionContext._gatewayHost=gatewayHost;sessionContext._clientType=clientType;sessionContext._userId=userId;sessionContext._password=password;sessionContext._remoteSession=false;return sessionContext;};Object.defineProperty(SessionContextImpl.prototype,"clientType",{get:function get(){return this._clientType;},enumerable:true,configurable:true});Object.defineProperty(SessionContextImpl.prototype,"gatewayHost",{get:function get(){return this._gatewayHost;},enumerable:true,configurable:true});Object.defineProperty(SessionContextImpl.prototype,"isLocalSession",{get:function get(){return !this._remoteSession;},enumerable:true,configurable:true});Object.defineProperty(SessionContextImpl.prototype,"isRemoteSession",{get:function get(){return this._remoteSession;},enumerable:true,configurable:true});Object.defineProperty(SessionContextImpl.prototype,"password",{get:function get(){return this._password;},enumerable:true,configurable:true});Object.defineProperty(SessionContextImpl.prototype,"userId",{get:function get(){return this._userId;},enumerable:true,configurable:true});Object.defineProperty(SessionContextImpl.prototype,"online",{set:function set(online){this._remoteSession=online;},enumerable:true,configurable:true});return SessionContextImpl;}();exports.SessionContextImpl=SessionContextImpl; /**
 * *********************************
 */ /**
 * @private
 */var SessionService=function(){function SessionService(){}SessionService.createSession=function(tenantId,userId,password,clientType,systemContext){var method="createSessionDirectly";var params={'tenantId':tenantId,'userId':userId,'password':password,'clientType':clientType};var call=ws_1.Call.createCallWithoutSession(SessionService.SERVICE_PATH,method,params,systemContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture("createSession/extractSessionContextFromResponse",SessionContextImpl.fromWSCreateSessionResult(result,systemContext,tenantId));});};SessionService.deleteSession=function(sessionContext){var method="deleteSession";var params={'sessionHandle':sessionContext.sessionHandle};var call=ws_1.Call.createCall(SessionService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse",result);});};SessionService.getSessionListProperty=function(propertyName,sessionContext){var method="getSessionListProperty";var params={'propertyName':propertyName,'sessionHandle':sessionContext.sessionHandle};var call=ws_1.Call.createCall(SessionService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse",DialogTriple.fromWSDialogObject(result,'WSGetSessionListPropertyResult',OType.factoryFn));});};SessionService.setSessionListProperty=function(propertyName,listProperty,sessionContext){var method="setSessionListProperty";var params={'propertyName':propertyName,'listProperty':listProperty,'sessionHandle':sessionContext.sessionHandle};var call=ws_1.Call.createCall(SessionService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse",result);});};SessionService.SERVICE_NAME="SessionService";SessionService.SERVICE_PATH="soi-json-v02/"+SessionService.SERVICE_NAME;return SessionService;}();exports.SessionService=SessionService; /**
 * *********************************
 */var SortPropDef=function(){function SortPropDef(_name,_direction){this._name=_name;this._direction=_direction;}Object.defineProperty(SortPropDef.prototype,"direction",{get:function get(){return this._direction;},enumerable:true,configurable:true});Object.defineProperty(SortPropDef.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});return SortPropDef;}();exports.SortPropDef=SortPropDef; /**
 * *********************************
 */var SystemContextImpl=function(){function SystemContextImpl(_urlString){this._urlString=_urlString;}Object.defineProperty(SystemContextImpl.prototype,"urlString",{get:function get(){return this._urlString;},enumerable:true,configurable:true});return SystemContextImpl;}();exports.SystemContextImpl=SystemContextImpl; /**
 * *********************************
 */var WorkbenchLaunchAction=function(){function WorkbenchLaunchAction(id,workbenchId,name,alias,iconBase){this.id=id;this.workbenchId=workbenchId;this.name=name;this.alias=alias;this.iconBase=iconBase;}Object.defineProperty(WorkbenchLaunchAction.prototype,"actionId",{get:function get(){return this.id;},enumerable:true,configurable:true});Object.defineProperty(WorkbenchLaunchAction.prototype,"fromActionSource",{get:function get(){return null;},enumerable:true,configurable:true});Object.defineProperty(WorkbenchLaunchAction.prototype,"virtualPathSuffix",{get:function get(){return [this.workbenchId,this.id];},enumerable:true,configurable:true});return WorkbenchLaunchAction;}();exports.WorkbenchLaunchAction=WorkbenchLaunchAction; /**
 * *********************************
 */ /**
 * @private
 */var WorkbenchService=function(){function WorkbenchService(){}WorkbenchService.getAppWinDef=function(sessionContext){var method="getApplicationWindowDef";var params={'sessionHandle':sessionContext.sessionHandle};var call=ws_1.Call.createCall(WorkbenchService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture("createSession/extractAppWinDefFromResult",DialogTriple.fromWSDialogObjectResult(result,'WSApplicationWindowDefResult','WSApplicationWindowDef','applicationWindowDef',OType.factoryFn));});};WorkbenchService.getWorkbench=function(sessionContext,workbenchId){var method="getWorkbench";var params={'sessionHandle':sessionContext.sessionHandle,'workbenchId':workbenchId};var call=ws_1.Call.createCall(WorkbenchService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture("getWorkbench/extractObject",DialogTriple.fromWSDialogObjectResult(result,'WSWorkbenchResult','WSWorkbench','workbench',OType.factoryFn));});};WorkbenchService.performLaunchAction=function(actionId,workbenchId,sessionContext){var method="performLaunchAction";var params={'actionId':actionId,'workbenchId':workbenchId,'sessionHandle':sessionContext.sessionHandle};var call=ws_1.Call.createCall(WorkbenchService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return fp_1.Future.createCompletedFuture("performLaunchAction/extractRedirection",DialogTriple.fromWSDialogObject(result['redirection'],'WSRedirection',OType.factoryFn));});};WorkbenchService.SERVICE_NAME="WorkbenchService";WorkbenchService.SERVICE_PATH="soi-json-v02/"+WorkbenchService.SERVICE_NAME;return WorkbenchService;}();exports.WorkbenchService=WorkbenchService; /**
 * *********************************
 */var Workbench=function(){function Workbench(_id,_name,_alias,_actions){this._id=_id;this._name=_name;this._alias=_alias;this._actions=_actions;}Object.defineProperty(Workbench.prototype,"alias",{get:function get(){return this._alias;},enumerable:true,configurable:true});Workbench.prototype.getLaunchActionById=function(launchActionId){var result=null;this.workbenchLaunchActions.some(function(launchAction){if(launchAction.id=launchActionId){result=launchAction;return true;}});return result;};Object.defineProperty(Workbench.prototype,"name",{get:function get(){return this._name;},enumerable:true,configurable:true});Object.defineProperty(Workbench.prototype,"workbenchId",{get:function get(){return this._id;},enumerable:true,configurable:true});Object.defineProperty(Workbench.prototype,"workbenchLaunchActions",{get:function get(){return util_1.ArrayUtil.copy(this._actions);},enumerable:true,configurable:true});return Workbench;}();exports.Workbench=Workbench; /* XPane Classes */ /**
 * @private
 */var XPaneDef=function(){function XPaneDef(){}XPaneDef.fromWS=function(otype,jsonObj){if(jsonObj['listDef']){return DialogTriple.fromWSDialogObject(jsonObj['listDef'],'WSListDef',OType.factoryFn);}else if(jsonObj['detailsDef']){return DialogTriple.fromWSDialogObject(jsonObj['detailsDef'],'WSDetailsDef',OType.factoryFn);}else if(jsonObj['formDef']){return DialogTriple.fromWSDialogObject(jsonObj['formDef'],'WSFormDef',OType.factoryFn);}else if(jsonObj['mapDef']){return DialogTriple.fromWSDialogObject(jsonObj['mapDef'],'WSMapDef',OType.factoryFn);}else if(jsonObj['graphDef']){return DialogTriple.fromWSDialogObject(jsonObj['graphDef'],'WSGraphDef',OType.factoryFn);}else if(jsonObj['barcodeScanDef']){return DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'],'WSBarcodeScanDef',OType.factoryFn);}else if(jsonObj['imagePickerDef']){return DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'],'WSImagePickerDef',OType.factoryFn);}else if(jsonObj['geoFixDef']){return DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'],'WSGeoFixDef',OType.factoryFn);}else if(jsonObj['geoLocationDef']){return DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'],'WSGeoLocationDef',OType.factoryFn);}else if(jsonObj['calendarDef']){return DialogTriple.fromWSDialogObject(jsonObj['calendarDef'],'WSCalendarDef',OType.factoryFn);}else {return new fp_1.Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef '+util_1.ObjUtil.formatRecAttr(jsonObj));}};return XPaneDef;}();exports.XPaneDef=XPaneDef; /**
 * *********************************
 */ /**
 * @private
 */var XBarcodeScanDef=function(_super){__extends(XBarcodeScanDef,_super);function XBarcodeScanDef(paneId,name,title){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;}return XBarcodeScanDef;}(XPaneDef);exports.XBarcodeScanDef=XBarcodeScanDef; /**
 * *********************************
 */ /**
 * @private
 */var XCalendarDef=function(_super){__extends(XCalendarDef,_super);function XCalendarDef(paneId,name,title,descriptionProperty,initialStyle,startDateProperty,startTimeProperty,endDateProperty,endTimeProperty,occurDateProperty,occurTimeProperty){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;this.descriptionProperty=descriptionProperty;this.initialStyle=initialStyle;this.startDateProperty=startDateProperty;this.startTimeProperty=startTimeProperty;this.endDateProperty=endDateProperty;this.endTimeProperty=endTimeProperty;this.occurDateProperty=occurDateProperty;this.occurTimeProperty=occurTimeProperty;}return XCalendarDef;}(XPaneDef);exports.XCalendarDef=XCalendarDef; /**
 * *********************************
 */ /**
 * @private
 */var XChangePaneModeResult=function(){function XChangePaneModeResult(editorRecordDef,dialogProperties){this.editorRecordDef=editorRecordDef;this.dialogProperties=dialogProperties;}Object.defineProperty(XChangePaneModeResult.prototype,"entityRecDef",{get:function get(){return this.editorRecordDef;},enumerable:true,configurable:true});Object.defineProperty(XChangePaneModeResult.prototype,"dialogProps",{get:function get(){return this.dialogProperties;},enumerable:true,configurable:true});return XChangePaneModeResult;}();exports.XChangePaneModeResult=XChangePaneModeResult; /**
 * *********************************
 */ /**
 * @private
 */var XDetailsDef=function(_super){__extends(XDetailsDef,_super);function XDetailsDef(paneId,name,title,cancelButtonText,commitButtonText,editable,focusPropertyName,overrideGML,rows){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;this.cancelButtonText=cancelButtonText;this.commitButtonText=commitButtonText;this.editable=editable;this.focusPropertyName=focusPropertyName;this.overrideGML=overrideGML;this.rows=rows;}Object.defineProperty(XDetailsDef.prototype,"graphicalMarkup",{get:function get(){return this.overrideGML;},enumerable:true,configurable:true});return XDetailsDef;}(XPaneDef);exports.XDetailsDef=XDetailsDef; /**
 * *********************************
 */ /**
 * @private
 */var XFormDef=function(_super){__extends(XFormDef,_super);function XFormDef(borderStyle,formLayout,formStyle,name,paneId,title,headerDefRef,paneDefRefs){_super.call(this);this.borderStyle=borderStyle;this.formLayout=formLayout;this.formStyle=formStyle;this.name=name;this.paneId=paneId;this.title=title;this.headerDefRef=headerDefRef;this.paneDefRefs=paneDefRefs;}return XFormDef;}(XPaneDef);exports.XFormDef=XFormDef; /**
 * *********************************
 */ /**
 * @private
 */var XFormModelComp=function(){function XFormModelComp(paneId,redirection,label,title){this.paneId=paneId;this.redirection=redirection;this.label=label;this.title=title;}return XFormModelComp;}();exports.XFormModelComp=XFormModelComp; /**
 * *********************************
 */ /**
 * @private
 */var XFormModel=function(){function XFormModel(form,header,children,placement,refreshTimer,sizeToWindow){this.form=form;this.header=header;this.children=children;this.placement=placement;this.refreshTimer=refreshTimer;this.sizeToWindow=sizeToWindow;} /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */XFormModel.fromWS=function(otype,jsonObj){return DialogTriple.fromWSDialogObject(jsonObj['form'],'WSFormModelComp',OType.factoryFn,true).bind(function(form){var header=null;if(jsonObj['header']){var headerTry=DialogTriple.fromWSDialogObject(jsonObj['header'],'WSFormModelComp',OType.factoryFn,true);if(headerTry.isFailure)return new fp_1.Failure(headerTry.isFailure);header=headerTry.success;}return DialogTriple.fromListOfWSDialogObject(jsonObj['children'],'WSFormModelComp',OType.factoryFn,true).bind(function(children){return new fp_1.Success(new XFormModel(form,header,children,jsonObj['placement'],jsonObj['refreshTimer'],jsonObj['sizeToWindow']));});});};return XFormModel;}();exports.XFormModel=XFormModel; /**
 * *********************************
 */ /**
 * @private
 */var XGeoFixDef=function(_super){__extends(XGeoFixDef,_super);function XGeoFixDef(paneId,name,title){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;}return XGeoFixDef;}(XPaneDef);exports.XGeoFixDef=XGeoFixDef; /**
 * *********************************
 */ /**
 * @private
 */var XGeoLocationDef=function(_super){__extends(XGeoLocationDef,_super);function XGeoLocationDef(paneId,name,title){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;}return XGeoLocationDef;}(XPaneDef);exports.XGeoLocationDef=XGeoLocationDef; /**
 * *********************************
 */ /**
 * @private
 */var XGetActiveColumnDefsResult=function(){function XGetActiveColumnDefsResult(columnsStyle,columns){this.columnsStyle=columnsStyle;this.columns=columns;}Object.defineProperty(XGetActiveColumnDefsResult.prototype,"columnDefs",{get:function get(){return this.columns;},enumerable:true,configurable:true});return XGetActiveColumnDefsResult;}();exports.XGetActiveColumnDefsResult=XGetActiveColumnDefsResult; /**
 * *********************************
 */ /**
 * @private
 */var XGetAvailableViewDescsResult=function(){function XGetAvailableViewDescsResult(){}return XGetAvailableViewDescsResult;}();exports.XGetAvailableViewDescsResult=XGetAvailableViewDescsResult; /**
 * *********************************
 */ /**
 * @private
 */var XSetSelectedViewIdEditorModelResult=function(){function XSetSelectedViewIdEditorModelResult(){}return XSetSelectedViewIdEditorModelResult;}();exports.XSetSelectedViewIdEditorModelResult=XSetSelectedViewIdEditorModelResult; /**
 * *********************************
 */ /**
 * @private
 */var XSetSelectedViewIdQueryModelResult=function(){function XSetSelectedViewIdQueryModelResult(){}return XSetSelectedViewIdQueryModelResult;}();exports.XSetSelectedViewIdQueryModelResult=XSetSelectedViewIdQueryModelResult; /**
 * *********************************
 */ /**
 * @private
 */var XGetAvailableValuesResult=function(){function XGetAvailableValuesResult(list){this.list=list;}XGetAvailableValuesResult.fromWS=function(otype,jsonObj){var listJson=jsonObj['list'];if(listJson){var valuesJson=listJson['values'];return Prop.fromListOfWSValue(valuesJson).bind(function(values){return new fp_1.Success(new XGetAvailableValuesResult(values));});}else {return new fp_1.Success(new XGetAvailableValuesResult([]));}};return XGetAvailableValuesResult;}();exports.XGetAvailableValuesResult=XGetAvailableValuesResult; /**
 * *********************************
 */ /**
 * @private
 */var XGetSessionListPropertyResult=function(){function XGetSessionListPropertyResult(_list,_dialogProps){this._list=_list;this._dialogProps=_dialogProps;}Object.defineProperty(XGetSessionListPropertyResult.prototype,"dialogProps",{get:function get(){return this._dialogProps;},enumerable:true,configurable:true});Object.defineProperty(XGetSessionListPropertyResult.prototype,"values",{get:function get(){return this._list;},enumerable:true,configurable:true});XGetSessionListPropertyResult.prototype.valuesAsDictionary=function(){var result={};this.values.forEach(function(v){var pair=util_1.StringUtil.splitSimpleKeyValuePair(v);result[pair[0]]=pair[1];});return result;};return XGetSessionListPropertyResult;}();exports.XGetSessionListPropertyResult=XGetSessionListPropertyResult; /**
 * *********************************
 */ /**
 * @private
 */var XGraphDef=function(_super){__extends(XGraphDef,_super);function XGraphDef(paneId,name,title,graphType,displayQuadrantLines,identityDataPoint,groupingDataPoint,dataPoints,filterDataPoints,sampleModel,xAxisLabel,xAxisRangeFrom,xAxisRangeTo,yAxisLabel,yAxisRangeFrom,yAxisRangeTo){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;this.graphType=graphType;this.displayQuadrantLines=displayQuadrantLines;this.identityDataPoint=identityDataPoint;this.groupingDataPoint=groupingDataPoint;this.dataPoints=dataPoints;this.filterDataPoints=filterDataPoints;this.sampleModel=sampleModel;this.xAxisLabel=xAxisLabel;this.xAxisRangeFrom=xAxisRangeFrom;this.xAxisRangeTo=xAxisRangeTo;this.yAxisLabel=yAxisLabel;this.yAxisRangeFrom=yAxisRangeFrom;this.yAxisRangeTo=yAxisRangeTo;}return XGraphDef;}(XPaneDef);exports.XGraphDef=XGraphDef; /**
 * *********************************
 */ /**
 * @private
 */var XImagePickerDef=function(_super){__extends(XImagePickerDef,_super);function XImagePickerDef(paneId,name,title,URLProperty,defaultActionId){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;this.URLProperty=URLProperty;this.defaultActionId=defaultActionId;}return XImagePickerDef;}(XPaneDef);exports.XImagePickerDef=XImagePickerDef; /**
 * *********************************
 */ /**
 * @private
 */var XListDef=function(_super){__extends(XListDef,_super);function XListDef(paneId,name,title,style,initialColumns,columnsStyle,overrideGML){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;this.style=style;this.initialColumns=initialColumns;this.columnsStyle=columnsStyle;this.overrideGML=overrideGML;}Object.defineProperty(XListDef.prototype,"graphicalMarkup",{get:function get(){return this.overrideGML;},set:function set(graphicalMarkup){this.overrideGML=graphicalMarkup;},enumerable:true,configurable:true});return XListDef;}(XPaneDef);exports.XListDef=XListDef; /**
 * *********************************
 */ /**
 * @private
 */var XMapDef=function(_super){__extends(XMapDef,_super);function XMapDef(paneId,name,title,descriptionProperty,streetProperty,cityProperty,stateProperty,postalCodeProperty,latitudeProperty,longitudeProperty){_super.call(this);this.paneId=paneId;this.name=name;this.title=title;this.descriptionProperty=descriptionProperty;this.streetProperty=streetProperty;this.cityProperty=cityProperty;this.stateProperty=stateProperty;this.postalCodeProperty=postalCodeProperty;this.latitudeProperty=latitudeProperty;this.longitudeProperty=longitudeProperty;}Object.defineProperty(XMapDef.prototype,"descrptionProperty",{ //descriptionProperty is misspelled in json returned by server currently...
set:function set(prop){this.descriptionProperty=prop;},enumerable:true,configurable:true});return XMapDef;}(XPaneDef);exports.XMapDef=XMapDef; /**
 * *********************************
 */ /**
 * @private
 */var XOpenEditorModelResult=function(){function XOpenEditorModelResult(editorRecordDef,formModel){this.editorRecordDef=editorRecordDef;this.formModel=formModel;}Object.defineProperty(XOpenEditorModelResult.prototype,"entityRecDef",{get:function get(){return this.editorRecordDef;},enumerable:true,configurable:true});Object.defineProperty(XOpenEditorModelResult.prototype,"formPaneId",{get:function get(){return this.formModel.form.paneId;},enumerable:true,configurable:true});Object.defineProperty(XOpenEditorModelResult.prototype,"formRedirection",{get:function get(){return this.formModel.form.redirection;},enumerable:true,configurable:true});return XOpenEditorModelResult;}();exports.XOpenEditorModelResult=XOpenEditorModelResult; /**
 * *********************************
 */ /**
 * @private
 */var XOpenQueryModelResult=function(){function XOpenQueryModelResult(entityRecDef,sortPropertyDef,defaultActionId){this.entityRecDef=entityRecDef;this.sortPropertyDef=sortPropertyDef;this.defaultActionId=defaultActionId;}XOpenQueryModelResult.fromWS=function(otype,jsonObj){var queryRecDefJson=jsonObj['queryRecordDef'];var defaultActionId=queryRecDefJson['defaultActionId'];return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'],'WSPropertyDef',OType.factoryFn).bind(function(propDefs){var entityRecDef=new EntityRecDef(propDefs);return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'],'WSSortPropertyDef',OType.factoryFn).bind(function(sortPropDefs){return new fp_1.Success(new XOpenQueryModelResult(entityRecDef,sortPropDefs,defaultActionId));});});};return XOpenQueryModelResult;}();exports.XOpenQueryModelResult=XOpenQueryModelResult; /**
 * *********************************
 */ /**
 * @private
 */var XOpenDialogModelErrorResult=function(){function XOpenDialogModelErrorResult(exception){this.exception=exception;this.entityRecDef=null;}return XOpenDialogModelErrorResult;}();exports.XOpenDialogModelErrorResult=XOpenDialogModelErrorResult; /**
 * *********************************
 */ /**
 * @private
 */var XPaneDefRef=function(){function XPaneDefRef(name,paneId,title,type){this.name=name;this.paneId=paneId;this.title=title;this.type=type;}XPaneDefRef.FORM_TYPE='FORM';return XPaneDefRef;}();exports.XPaneDefRef=XPaneDefRef; /**
 * *********************************
 */ /**
 * @private
 */var XPropertyChangeResult=function(){function XPropertyChangeResult(availableValueChanges,propertyName,sideEffects,editorRecordDef){this.availableValueChanges=availableValueChanges;this.propertyName=propertyName;this.sideEffects=sideEffects;this.editorRecordDef=editorRecordDef;}Object.defineProperty(XPropertyChangeResult.prototype,"sideEffectsDef",{get:function get(){return this.editorRecordDef;},set:function set(sideEffectsDef){this.editorRecordDef=sideEffectsDef;},enumerable:true,configurable:true});return XPropertyChangeResult;}();exports.XPropertyChangeResult=XPropertyChangeResult; /**
 * *********************************
 */ /**
 * @private
 */var XQueryResult=function(){function XQueryResult(entityRecs,entityRecDef,hasMore,sortPropDefs,defaultActionId,dialogProps){this.entityRecs=entityRecs;this.entityRecDef=entityRecDef;this.hasMore=hasMore;this.sortPropDefs=sortPropDefs;this.defaultActionId=defaultActionId;this.dialogProps=dialogProps;}XQueryResult.fromWS=function(otype,jsonObj){return DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'],'WSQueryRecordDef',OType.factoryFn).bind(function(entityRecDef){var entityRecDefJson=jsonObj['queryRecordDef'];var actionId=jsonObj['defaultActionId'];return DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'],'WSSortPropertyDef',OType.factoryFn).bind(function(sortPropDefs){var queryRecsJson=jsonObj['queryRecords'];if(queryRecsJson['WS_LTYPE']!=='WSQueryRecord'){return new fp_1.Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found '+queryRecsJson['WS_LTYPE']);}var queryRecsValues=queryRecsJson['values'];var entityRecs=[];for(var i=0;i<queryRecsValues.length;i++){var queryRecValue=queryRecsValues[i];if(queryRecValue['WS_OTYPE']!=='WSQueryRecord'){return new fp_1.Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found '+queryRecValue['WS_LTYPE']);}var objectId=queryRecValue['objectId'];var recPropsObj=queryRecValue['properties'];if(recPropsObj['WS_LTYPE']!=='Object'){return new fp_1.Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found '+recPropsObj['WS_LTYPE']);}var recPropsObjValues=recPropsObj['values'];var propsTry=Prop.fromWSNamesAndValues(entityRecDef.propNames,recPropsObjValues);if(propsTry.isFailure)return new fp_1.Failure(propsTry.failure);var props=propsTry.success;if(queryRecValue['propertyAnnotations']){var propAnnosJson=queryRecValue['propertyAnnotations'];var annotatedPropsTry=DataAnno.annotatePropsUsingWSDataAnnotation(props,propAnnosJson);if(annotatedPropsTry.isFailure)return new fp_1.Failure(annotatedPropsTry.failure);props=annotatedPropsTry.success;}var recAnnos=null;if(queryRecValue['recordAnnotation']){var recAnnosTry=DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'],'WSDataAnnotation',OType.factoryFn);if(recAnnosTry.isFailure)return new fp_1.Failure(recAnnosTry.failure);recAnnos=recAnnosTry.success;}var entityRec=EntityRecUtil.newEntityRec(objectId,props,recAnnos);entityRecs.push(entityRec);}var dialogProps=jsonObj['dialogProperties'];var hasMore=jsonObj['hasMore'];return new fp_1.Success(new XQueryResult(entityRecs,entityRecDef,hasMore,sortPropDefs,actionId,dialogProps));});});};return XQueryResult;}();exports.XQueryResult=XQueryResult; /**
 * *********************************
 */ /**
 * @private
 */var XReadResult=function(){function XReadResult(_editorRecord,_editorRecordDef,_dialogProperties){this._editorRecord=_editorRecord;this._editorRecordDef=_editorRecordDef;this._dialogProperties=_dialogProperties;}Object.defineProperty(XReadResult.prototype,"entityRec",{get:function get(){return this._editorRecord;},enumerable:true,configurable:true});Object.defineProperty(XReadResult.prototype,"entityRecDef",{get:function get(){return this._editorRecordDef;},enumerable:true,configurable:true});Object.defineProperty(XReadResult.prototype,"dialogProps",{get:function get(){return this._dialogProperties;},enumerable:true,configurable:true});return XReadResult;}();exports.XReadResult=XReadResult; /**
 * *********************************
 */ /**
 * @private
 */var XWriteResult=function(){function XWriteResult(_editorRecord,_editorRecordDef,_dialogProperties){this._editorRecord=_editorRecord;this._editorRecordDef=_editorRecordDef;this._dialogProperties=_dialogProperties;}Object.defineProperty(XWriteResult.prototype,"dialogProps",{get:function get(){return this._dialogProperties;},enumerable:true,configurable:true});Object.defineProperty(XWriteResult.prototype,"entityRec",{get:function get(){return this._editorRecord;},enumerable:true,configurable:true});Object.defineProperty(XWriteResult.prototype,"entityRecDef",{get:function get(){return this._editorRecordDef;},enumerable:true,configurable:true});Object.defineProperty(XWriteResult.prototype,"isDestroyed",{get:function get(){var destoyedStr=this.dialogProps['destroyed'];return destoyedStr&&destoyedStr.toLowerCase()==='true';},enumerable:true,configurable:true});return XWriteResult;}();exports.XWriteResult=XWriteResult; /**
 * *********************************
 */ /**
 * @private
 */var XWritePropertyResult=function(){function XWritePropertyResult(dialogProperties){this.dialogProperties=dialogProperties;}return XWritePropertyResult;}();exports.XWritePropertyResult=XWritePropertyResult; /**
 * @private
 */var XReadPropertyResult=function(){function XReadPropertyResult(dialogProperties,hasMore,data,dataLength){this.dialogProperties=dialogProperties;this.hasMore=hasMore;this.data=data;this.dataLength=dataLength;}return XReadPropertyResult;}();exports.XReadPropertyResult=XReadPropertyResult; /*
 OType must be last as it references almost all other classes in the module
 */ /**
 * @private
 */var OType=function(){function OType(){}OType.typeInstance=function(name){var type=OType.types[name];return type&&new type();};OType.factoryFn=function(otype,jsonObj){var typeFn=OType.typeFns[otype];if(typeFn){return typeFn(otype,jsonObj);}return null;};OType.deserializeObject=function(obj,Otype,factoryFn){ //Log.debug('Deserializing ' + Otype);
if(Array.isArray(obj)){ //it's a nested array (no LTYPE!)
return OType.handleNestedArray(Otype,obj);}else {var newObj=null;var objTry=factoryFn(Otype,obj); //this returns null if there is no custom function
if(objTry){if(objTry.isFailure){var error='OType::deserializeObject: factory failed to produce object for '+Otype+" : "+util_1.ObjUtil.formatRecAttr(objTry.failure);util_1.Log.error(error);return new fp_1.Failure(error);}newObj=objTry.success;}else {newObj=OType.typeInstance(Otype);if(!newObj){util_1.Log.error('OType::deserializeObject: no type constructor found for '+Otype);return new fp_1.Failure('OType::deserializeObject: no type constructor found for '+Otype);}for(var prop in obj){var value=obj[prop]; //Log.debug("prop: " + prop + " is type " + typeof value);
if(value&&(typeof value==="undefined"?"undefined":_typeof(value))==='object'){if('WS_OTYPE' in value){var otypeTry=DialogTriple.fromWSDialogObject(value,value['WS_OTYPE'],OType.factoryFn);if(otypeTry.isFailure)return new fp_1.Failure(otypeTry.failure);OType.assignPropIfDefined(prop,otypeTry.success,newObj,Otype);}else if('WS_LTYPE' in value){var ltypeTry=DialogTriple.fromListOfWSDialogObject(value,value['WS_LTYPE'],OType.factoryFn);if(ltypeTry.isFailure)return new fp_1.Failure(ltypeTry.failure);OType.assignPropIfDefined(prop,ltypeTry.success,newObj,Otype);}else {OType.assignPropIfDefined(prop,obj[prop],newObj,Otype);}}else {OType.assignPropIfDefined(prop,obj[prop],newObj,Otype);}}}return new fp_1.Success(newObj);}};OType.serializeObject=function(obj,Otype,filterFn){var newObj={'WS_OTYPE':Otype};return util_1.ObjUtil.copyNonNullFieldsOnly(obj,newObj,function(prop){return prop.charAt(0)!=='_'&&(!filterFn||filterFn(prop));});};OType.handleNestedArray=function(Otype,obj){return OType.extractLType(Otype).bind(function(ltype){var newArrayTry=OType.deserializeNestedArray(obj,ltype);if(newArrayTry.isFailure)return new fp_1.Failure(newArrayTry.failure);return new fp_1.Success(newArrayTry.success);});};OType.deserializeNestedArray=function(array,ltype){var newArray=[];for(var i=0;i<array.length;i++){var value=array[i];if(value&&(typeof value==="undefined"?"undefined":_typeof(value))==='object'){var otypeTry=DialogTriple.fromWSDialogObject(value,ltype,OType.factoryFn);if(otypeTry.isFailure){return new fp_1.Failure(otypeTry.failure);}newArray.push(otypeTry.success);}else {newArray.push(value);}}return new fp_1.Success(newArray);};OType.extractLType=function(Otype){if(Otype.length>5&&Otype.slice(0,5)!=='List<'){return new fp_1.Failure('Expected OType of List<some_type> but found '+Otype);}var ltype=Otype.slice(5,-1);return new fp_1.Success(ltype);};OType.assignPropIfDefined=function(prop,value,target,otype){if(otype===void 0){otype='object';}try{if('_'+prop in target){target['_'+prop]=value;}else { //it may be public
if(prop in target){target[prop]=value;}else {}}}catch(error){util_1.Log.error('OType::assignPropIfDefined: Failed to set prop: '+prop+' on target: '+error);}};OType.types={'WSApplicationWindowDef':AppWinDef,'WSAttributeCellValueDef':AttributeCellValueDef,'WSBarcodeScanDef':XBarcodeScanDef,'WSCalendarDef':XCalendarDef,'WSCellDef':CellDef,'WSChangePaneModeResult':XChangePaneModeResult,'WSColumnDef':ColumnDef,'WSContextAction':ContextAction,'WSCreateSessionResult':SessionContextImpl,'WSDialogHandle':DialogHandle,'WSDataAnno':DataAnno,'WSDetailsDef':XDetailsDef,'WSDialogRedirection':DialogRedirection,'WSEditorRecordDef':EntityRecDef,'WSEntityRecDef':EntityRecDef,'WSForcedLineCellValueDef':ForcedLineCellValueDef,'WSFormDef':XFormDef,'WSFormModelComp':XFormModelComp,'WSGeoFixDef':XGeoFixDef,'WSGeoLocationDef':XGeoLocationDef,'WSGetActiveColumnDefsResult':XGetActiveColumnDefsResult,'WSGetSessionListPropertyResult':XGetSessionListPropertyResult,'WSGraphDataPointDef':GraphDataPointDef,'WSGraphDef':XGraphDef,'WSHandlePropertyChangeResult':XPropertyChangeResult,'WSImagePickerDef':XImagePickerDef,'WSLabelCellValueDef':LabelCellValueDef,'WSListDef':XListDef,'WSMapDef':XMapDef,'WSMenuDef':MenuDef,'WSOpenEditorModelResult':XOpenEditorModelResult,'WSOpenQueryModelResult':XOpenQueryModelResult,'WSPaneDefRef':XPaneDefRef,'WSPropertyDef':PropDef,'WSQueryRecordDef':EntityRecDef,'WSReadResult':XReadResult,'WSSortPropertyDef':SortPropDef,'WSSubstitutionCellValueDef':SubstitutionCellValueDef,'WSTabCellValueDef':TabCellValueDef,'WSWebRedirection':WebRedirection,'WSWorkbench':Workbench,'WSWorkbenchRedirection':WorkbenchRedirection,'WSWorkbenchLaunchAction':WorkbenchLaunchAction,'XWriteResult':XWriteResult,'WSWritePropertyResult':XWritePropertyResult,'WSReadPropertyResult':XReadPropertyResult,'WSException':DialogException,'WSUserMessage':UserMessage};OType.typeFns={'WSCellValueDef':CellValueDef.fromWS,'WSDataAnnotation':DataAnno.fromWS,'WSEditorRecord':EntityRecUtil.fromWSEditorRecord,'WSFormModel':XFormModel.fromWS,'WSGetAvailableValuesResult':XGetAvailableValuesResult.fromWS,'WSPaneDef':XPaneDef.fromWS,'WSOpenQueryModelResult':XOpenQueryModelResult.fromWS,'WSProp':Prop.fromWS,'WSQueryResult':XQueryResult.fromWS,'WSRedirection':Redirection.fromWS};return OType;}();exports.OType=OType; /**
 * *********************************
 */

},{"./fp":4,"./util":6,"./ws":7,"moment":1}],4:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require("./util");
var util_2 = require("./util");
/*
  IMPORTANT!
  Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
  Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
/**
 * Created by rburson on 3/16/15.
 */
var Try = function () {
    function Try() {}
    Try.flatten = function (tryList) {
        var successes = [];
        var failures = [];
        tryList.forEach(function (t) {
            if (t.isFailure) {
                failures.push(t.failure);
            } else {
                if (Array.isArray(t.success) && Try.isListOfTry(t.success)) {
                    var flattened = Try.flatten(t.success);
                    if (flattened.isFailure) {
                        failures.push(flattened.failure);
                    } else {
                        successes.push(flattened.success);
                    }
                } else {
                    successes.push(t.success);
                }
            }
        });
        if (failures.length > 0) {
            return new Failure(failures);
        } else {
            return new Success(successes);
        }
    };
    Try.isListOfTry = function (list) {
        return list.every(function (value) {
            return value instanceof Try;
        });
    };
    Try.prototype.bind = function (f) {
        return this.isFailure ? new Failure(this.failure) : f(this.success);
    };
    Object.defineProperty(Try.prototype, "failure", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isFailure", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isSuccess", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.map = function (f) {
        return this.isFailure ? new Failure(this.failure) : new Success(f(this.success));
    };
    Object.defineProperty(Try.prototype, "success", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Try;
}();
exports.Try = Try;
var Failure = function (_super) {
    __extends(Failure, _super);
    function Failure(_error) {
        _super.call(this);
        this._error = _error;
    }
    Object.defineProperty(Failure.prototype, "failure", {
        get: function get() {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Failure.prototype, "isFailure", {
        get: function get() {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Failure;
}(Try);
exports.Failure = Failure;
var Success = function (_super) {
    __extends(Success, _super);
    function Success(_value) {
        _super.call(this);
        this._value = _value;
    }
    Object.defineProperty(Success.prototype, "isSuccess", {
        get: function get() {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Success.prototype, "success", {
        get: function get() {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Success;
}(Try);
exports.Success = Success;
/**
 * Created by rburson on 3/5/15.
 */
var Either = function () {
    function Either() {}
    Either.left = function (left) {
        var either = new Either();
        either._left = left;
        return either;
    };
    Either.right = function (right) {
        var either = new Either();
        either._right = right;
        return either;
    };
    Object.defineProperty(Either.prototype, "isLeft", {
        get: function get() {
            return !!this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "isRight", {
        get: function get() {
            return !!this._right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "left", {
        get: function get() {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "right", {
        get: function get() {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    return Either;
}();
exports.Either = Either;
var Future = function () {
    /** --------------------- CONSTRUCTORS ------------------------------*/
    function Future(_label) {
        this._label = _label;
        this._completionListeners = new Array();
    }
    /** --------------------- PUBLIC STATIC ------------------------------*/
    Future.createCompletedFuture = function (label, result) {
        var f = new Future(label);
        return f.complete(result);
    };
    Future.createSuccessfulFuture = function (label, value) {
        return Future.createCompletedFuture(label, new Success(value));
    };
    Future.createFailedFuture = function (label, error) {
        return Future.createCompletedFuture(label, new Failure(error));
    };
    Future.createFuture = function (label) {
        var f = new Future(label);
        return f;
    };
    Future.sequence = function (seqOfFutures) {
        var start = Future.createSuccessfulFuture('Future::sequence/start', []);
        return seqOfFutures.reduce(function (seqFr, nextFr) {
            return seqFr.bind(function (seq) {
                var pr = new Promise('Future::sequence/nextFr');
                nextFr.onComplete(function (t) {
                    seq.push(t);
                    pr.complete(new Success(seq));
                });
                return pr.future;
            });
        }, start);
    };
    /** --------------------- PUBLIC ------------------------------*/
    Future.prototype.bind = function (f) {
        var p = new Promise('Future.bind:' + this._label);
        this.onComplete(function (t1) {
            if (t1.isFailure) {
                p.failure(t1.failure);
            } else {
                var a = t1.success;
                try {
                    var mb = f(a);
                    mb.onComplete(function (t2) {
                        p.complete(t2);
                    });
                } catch (error) {
                    p.complete(new Failure(error));
                }
            }
        });
        return p.future;
    };
    Object.defineProperty(Future.prototype, "failure", {
        get: function get() {
            return this._result ? this._result.failure : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "isComplete", {
        get: function get() {
            return !!this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "isCompleteWithFailure", {
        get: function get() {
            return !!this._result && this._result.isFailure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "isCompleteWithSuccess", {
        get: function get() {
            return !!this._result && this._result.isSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Future.prototype.map = function (f) {
        var p = new Promise('Future.map:' + this._label);
        this.onComplete(function (t1) {
            if (t1.isFailure) {
                p.failure(t1.failure);
            } else {
                var a = t1.success;
                try {
                    var b = f(a);
                    p.success(b);
                } catch (error) {
                    p.complete(new Failure(error));
                }
            }
        });
        return p.future;
    };
    Future.prototype.onComplete = function (listener) {
        this._result ? listener(this._result) : this._completionListeners.push(listener);
    };
    Future.prototype.onFailure = function (listener) {
        this.onComplete(function (t) {
            t.isFailure && listener(t.failure);
        });
    };
    Future.prototype.onSuccess = function (listener) {
        this.onComplete(function (t) {
            t.isSuccess && listener(t.success);
        });
    };
    Object.defineProperty(Future.prototype, "result", {
        get: function get() {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "success", {
        get: function get() {
            return this._result ? this.result.success : null;
        },
        enumerable: true,
        configurable: true
    });
    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility
    Future.prototype.complete = function (t) {
        var _this = this;
        var notifyList = new Array();
        //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
        if (t) {
            if (!this._result) {
                this._result = t;
                /* capture the listener set to prevent missing a notification */
                notifyList = util_1.ArrayUtil.copy(this._completionListeners);
            } else {
                util_2.Log.error("Future::complete() : Future " + this._label + " has already been completed");
            }
            notifyList.forEach(function (listener) {
                try {
                    listener(_this._result);
                } catch (error) {
                    util_2.Log.error("CompletionListener failed with " + error);
                    if (error.stack) util_2.Log.error(error.stack);
                }
            });
        } else {
            util_2.Log.error("Future::complete() : Can't complete Future with null result");
        }
        return this;
    };
    return Future;
}();
exports.Future = Future;
/**
 * Created by rburson on 3/6/15.
 */
var Promise = function () {
    function Promise(label) {
        this._future = Future.createFuture(label);
    }
    /** --------------------- PUBLIC ------------------------------*/
    Promise.prototype.isComplete = function () {
        return this._future.isComplete;
    };
    Promise.prototype.complete = function (t) {
        //Log.debug('Promise calling complete on Future...');
        this._future.complete(t);
        return this;
    };
    Promise.prototype.failure = function (error) {
        this.complete(new Failure(error));
    };
    Object.defineProperty(Promise.prototype, "future", {
        get: function get() {
            return this._future;
        },
        enumerable: true,
        configurable: true
    });
    Promise.prototype.success = function (value) {
        this.complete(new Success(value));
    };
    return Promise;
}();
exports.Promise = Promise;

},{"./util":6}],5:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require("./util");
/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
// Skipped in initial port: BarChart, BarcodeScanner, BarOrientation,
//                          DatePicker, Defaults, GaugeChart
var XML_CELL = "Cell";
var XML_FORM = "Form";
var XML_GRID = "Grid";
var XML_PAGE = "Page";
var XML_BUTTON = "Button";
var XML_CHECKBOX = "CheckBox";
var XML_IMAGE = "Image";
var XML_LABEL = "Label";
var XML_SIGNATURE_CAPTURE = "SignatureCapture";
var XML_TEXT_AREA = "TextArea";
var XML_TEXT_FIELD = "TextField";
var XML_TIME_PICKER = "TimePicker";
var XML_VALUE_PICKER = "ValuePicker";
var XML_CHILDREN = "Children";
var XML_ALLOW_ANNOTATIONS = "AllowAnnotations";
var XML_ALLOW_PICKER = "AllowPicker";
var XML_ALLOW_PICK_OPTIONS = "AllowPickOptions";
var XML_ALPHA = "Alpha";
var XML_ASPECT_MODE = "AspectMode";
var XML_BACKGROUND_COLOR = "BackgroundColor";
var XML_BINDING = "Binding";
var XML_BLUE = "Blue";
var XML_BOLD = "Bold";
var XML_BORDER_COLOR = "BorderColor";
var XML_BORDER_WIDTHS = "BorderWidths";
var XML_BOTTOM = "Bottom";
var XML_CAP_INSETS = "CapInsets";
var XML_CAPTURE_BOUNDS = "CaptureBounds";
var XML_CHECKED_COLOR = "CheckedColor";
var XML_COLUMN = "Column";
var XML_ENABLED_IN_READ_MODE = "EnabledInReadMode";
var XML_ENTRY_SEQ = "EntrySeq";
var XML_GREEN = "Green";
var XML_HEIGHT = "Height";
var XML_ID = "Id";
var XML_ITALIC = "Italic";
var XML_LAYOUT = "Layout";
var XML_LEFT = "Left";
var XML_LINE_COLOR = "LineColor";
var XML_LINE_WIDTH = "LineWidth";
var XML_NUMBER_OF_LINES = "NumberOfLines";
var XML_ORIGIN = "Origin";
var XML_PADDING = "Padding";
var XML_RADIO_GROUP = "RadioGroup";
var XML_RED = "Red";
var XML_REFRESH_TIMER = "RefreshTimer";
var XML_RESIZE_MODE = "ResizeMode";
var XML_RIGHT = "Right";
var XML_ROW = "Row";
var XML_SIZE = "Size";
var XML_TEXT = "Text";
var XML_TEXT_ALIGNMENT = "TextAlignment";
var XML_TEXT_COLOR = "TextColor";
var XML_TOP = "Top";
var XML_UNCHECKED_COLOR = "UncheckedColor";
var XML_UNDERLINE = "Underline";
var XML_UOM = "UOM";
var XML_URL = "URL";
var XML_WIDTH = "Width";
var XML_X = "X";
var XML_Y = "Y";
/**
 * *********************************
 */
var GenID = 1; //  Generate a unique number if need be for IDs
var Spec = function () {
    function Spec(node) {
        var _this = this;
        this.nodeChildDict = {};
        PrintUtil.forEachChildNode(node, function (n) {
            _this.nodeChildDict[n.nodeName] = n;
        });
    }
    return Spec;
}();
exports.Spec = Spec;
var Component = function (_super) {
    __extends(Component, _super);
    function Component(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BACKGROUND_COLOR], function (n) {
            _this._backgroundColor = new Color(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BINDING], function (n) {
            _this._binding = new Binding(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ID], function (n) {
            _this._id = PrintUtil.singleChildText(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_LAYOUT], function (n) {
            _this._layout = new Layout(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_PADDING], function (n) {
            _this._padding = new Edges(n);
        });
        if (!this.id) {
            this._id = "GenID-" + GenID++;
        }
    }
    Object.defineProperty(Component.prototype, "backgroundColor", {
        get: function get() {
            return this._backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "binding", {
        get: function get() {
            return this._binding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "id", {
        get: function get() {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "layout", {
        get: function get() {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "padding", {
        get: function get() {
            return this._padding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualHeights", {
        get: function get() {
            return this._actualHeights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualWidths", {
        get: function get() {
            return this._actualWidths;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualX", {
        get: function get() {
            return this._actualX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualY", {
        get: function get() {
            return this._actualY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "height", {
        get: function get() {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "width", {
        get: function get() {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "x", {
        get: function get() {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "y", {
        get: function get() {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return Component;
}(Spec);
exports.Component = Component;
var Container = function (_super) {
    __extends(Container, _super);
    function Container(node) {
        var _this = this;
        _super.call(this, node);
        this._children = new Array();
        if (this.nodeChildDict[XML_CHILDREN]) {
            PrintUtil.forEachChildNode(this.nodeChildDict[XML_CHILDREN], function (n) {
                var c = ComponentFactory.fromNode(n);
                if (c) {
                    _this._children.push(c);
                }
            });
        }
    }
    Object.defineProperty(Container.prototype, "children", {
        get: function get() {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Container;
}(Component);
exports.Container = Container;
var Property = function (_super) {
    __extends(Property, _super);
    function Property(node) {
        _super.call(this, node);
    }
    return Property;
}(Spec);
exports.Property = Property;
;
/**
 * *********************************
 */
(function (AspectMode) {
    AspectMode[AspectMode["None"] = 0] = "None";
    AspectMode[AspectMode["Fit"] = 1] = "Fit";
    AspectMode[AspectMode["Fill"] = 2] = "Fill";
})(exports.AspectMode || (exports.AspectMode = {}));
var AspectMode = exports.AspectMode;
;
(function (BindingType) {
    BindingType[BindingType["Data"] = 0] = "Data";
    BindingType[BindingType["Meta"] = 1] = "Meta";
})(exports.BindingType || (exports.BindingType = {}));
var BindingType = exports.BindingType;
(function (FormMode) {
    FormMode[FormMode["Display"] = 0] = "Display";
    FormMode[FormMode["Edit"] = 1] = "Edit";
})(exports.FormMode || (exports.FormMode = {}));
var FormMode = exports.FormMode;
;
(function (ResizeMode) {
    ResizeMode[ResizeMode["Stretch"] = 0] = "Stretch";
    ResizeMode[ResizeMode["Tile"] = 1] = "Tile";
})(exports.ResizeMode || (exports.ResizeMode = {}));
var ResizeMode = exports.ResizeMode;
;
(function (RichNumUsage) {
    RichNumUsage[RichNumUsage["Undefined"] = 0] = "Undefined";
    RichNumUsage[RichNumUsage["Absolute"] = 1] = "Absolute";
    RichNumUsage[RichNumUsage["FillParent"] = 2] = "FillParent";
    RichNumUsage[RichNumUsage["HorizontalCenter"] = 3] = "HorizontalCenter";
    RichNumUsage[RichNumUsage["HorizontalLeft"] = 4] = "HorizontalLeft";
    RichNumUsage[RichNumUsage["HorizontalRight"] = 5] = "HorizontalRight";
    RichNumUsage[RichNumUsage["PercentOfParent"] = 6] = "PercentOfParent";
    RichNumUsage[RichNumUsage["Remainder"] = 7] = "Remainder";
    RichNumUsage[RichNumUsage["VerticalBottom"] = 8] = "VerticalBottom";
    RichNumUsage[RichNumUsage["VerticalCenter"] = 9] = "VerticalCenter";
    RichNumUsage[RichNumUsage["VerticalTop"] = 10] = "VerticalTop";
})(exports.RichNumUsage || (exports.RichNumUsage = {}));
var RichNumUsage = exports.RichNumUsage;
(function (TextAlignment) {
    TextAlignment[TextAlignment["Left"] = 0] = "Left";
    TextAlignment[TextAlignment["Center"] = 1] = "Center";
    TextAlignment[TextAlignment["Right"] = 2] = "Right";
})(exports.TextAlignment || (exports.TextAlignment = {}));
var TextAlignment = exports.TextAlignment;
(function (ValuePlacement) {
    ValuePlacement[ValuePlacement["absolute"] = 0] = "absolute";
    ValuePlacement[ValuePlacement["none"] = 1] = "none";
})(exports.ValuePlacement || (exports.ValuePlacement = {}));
var ValuePlacement = exports.ValuePlacement;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Boolean"] = 1] = "Boolean";
    ValueType[ValueType["Date"] = 2] = "Date";
    ValueType[ValueType["DateTime"] = 3] = "DateTime";
    ValueType[ValueType["Decimal"] = 4] = "Decimal";
    ValueType[ValueType["Float"] = 5] = "Float";
    ValueType[ValueType["Integer"] = 6] = "Integer";
    ValueType[ValueType["LargeBinary"] = 7] = "LargeBinary";
    ValueType[ValueType["LargeString"] = 8] = "LargeString";
    ValueType[ValueType["String"] = 9] = "String";
    ValueType[ValueType["Time"] = 10] = "Time";
})(exports.ValueType || (exports.ValueType = {}));
var ValueType = exports.ValueType;
var Binding = function (_super) {
    __extends(Binding, _super);
    function Binding(node) {
        _super.call(this, node);
        this._type = BindingType.Data;
        this._path = PrintUtil.singleChildText(node);
    }
    ;
    Object.defineProperty(Binding.prototype, "path", {
        get: function get() {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "type", {
        get: function get() {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return Binding;
}(Property);
exports.Binding = Binding;
var Button = function (_super) {
    __extends(Button, _super);
    function Button(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], function (n) {
            _this._aspectMode = PrintUtil.enumValue(n, AspectMode);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], function (n) {
            _this._capInsets = new Edges(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], function (n) {
            _this._resizeMode = PrintUtil.enumValue(n, ResizeMode);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], function (n) {
            _this._URLString = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ENABLED_IN_READ_MODE], function (n) {
            _this._enabledInReadMode = PrintUtil.singleChildBoolean(node);
        });
    }
    Object.defineProperty(Button.prototype, "aspectMode", {
        get: function get() {
            return this._aspectMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "capInsets", {
        get: function get() {
            return this._capInsets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "resizeMode", {
        get: function get() {
            return this._resizeMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "URLString", {
        get: function get() {
            return this._URLString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "enableInReadMode", {
        get: function get() {
            return this._enabledInReadMode;
        },
        enumerable: true,
        configurable: true
    });
    return Button;
}(Component);
exports.Button = Button;
var CaptureBounds = function (_super) {
    __extends(CaptureBounds, _super);
    function CaptureBounds(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_HEIGHT], function (n) {
            _this._height = PrintUtil.singleChildNumber(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_WIDTH], function (n) {
            _this._width = PrintUtil.singleChildNumber(n);
        });
    }
    Object.defineProperty(CaptureBounds.prototype, "height", {
        get: function get() {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CaptureBounds.prototype, "width", {
        get: function get() {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    return CaptureBounds;
}(Property);
exports.CaptureBounds = CaptureBounds;
var Cell = function (_super) {
    __extends(Cell, _super);
    function Cell(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_COLOR], function (n) {
            _this._borderColor = new Color(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_WIDTHS], function (n) {
            _this._borderWidths = new Edges(n);
        });
    }
    Object.defineProperty(Cell.prototype, "borderColor", {
        get: function get() {
            return this._borderColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "borderWidths", {
        get: function get() {
            return this._borderWidths;
        },
        enumerable: true,
        configurable: true
    });
    return Cell;
}(Container);
exports.Cell = Cell;
var Checkbox = function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CHECKED_COLOR], function (n) {
            _this._checkedColor = new Color(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) {
            _this._entrySeq = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], function (n) {
            _this._lineColor = new Color(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_WIDTH], function (n) {
            _this._lineWidth = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_RADIO_GROUP], function (n) {
            _this._radioGroup = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNCHECKED_COLOR], function (n) {
            _this._uncheckedColor = new Color(node);
        });
    }
    Object.defineProperty(Checkbox.prototype, "checkedColor", {
        get: function get() {
            return this._checkedColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "entrySeq", {
        get: function get() {
            return this._entrySeq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "lineColor", {
        get: function get() {
            return this._lineColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "lineWidth", {
        get: function get() {
            return this._lineWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "radioGroup", {
        get: function get() {
            return this._radioGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "uncheckedColor", {
        get: function get() {
            return this._uncheckedColor;
        },
        enumerable: true,
        configurable: true
    });
    return Checkbox;
}(Component);
exports.Checkbox = Checkbox;
var Color = function (_super) {
    __extends(Color, _super);
    function Color(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_RED], function (n) {
            _this._red = PrintUtil.singleChildNumber(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BLUE], function (n) {
            _this._blue = PrintUtil.singleChildNumber(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_GREEN], function (n) {
            _this._green = PrintUtil.singleChildNumber(n);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ALPHA], function (n) {
            _this._alpha = PrintUtil.singleChildNumber(n);
        });
    }
    Object.defineProperty(Color.prototype, "alpha", {
        get: function get() {
            return this._alpha;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "red", {
        get: function get() {
            return this._red;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "green", {
        get: function get() {
            return this._green;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blue", {
        get: function get() {
            return this._blue;
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}(Spec);
exports.Color = Color;
var DatePicker = function (_super) {
    __extends(DatePicker, _super);
    function DatePicker(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) {
            _this._entrySeq = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) {
            _this._bold = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) {
            _this._text = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) {
            _this._textAlignment = PrintUtil.enumValue(node, TextAlignment);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) {
            _this._textColor = new Color(node);
        });
    }
    Object.defineProperty(DatePicker.prototype, "entrySeq", {
        get: function get() {
            return this._entrySeq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "bold", {
        get: function get() {
            return this._bold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "text", {
        get: function get() {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "textAlignment", {
        get: function get() {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "textColor", {
        get: function get() {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    return DatePicker;
}(Component);
exports.DatePicker = DatePicker;
var Edges = function (_super) {
    __extends(Edges, _super);
    function Edges(node, top, left, bottom, right) {
        var _this = this;
        _super.call(this, node);
        if (node) {
            PrintUtil.ifChild(this.nodeChildDict[XML_TOP], function (n) {
                _this._top = PrintUtil.singleChildNumber(n);
            });
            PrintUtil.ifChild(this.nodeChildDict[XML_LEFT], function (n) {
                _this._left = PrintUtil.singleChildNumber(n);
            });
            PrintUtil.ifChild(this.nodeChildDict[XML_BOTTOM], function (n) {
                _this._bottom = PrintUtil.singleChildNumber(n);
            });
            PrintUtil.ifChild(this.nodeChildDict[XML_RIGHT], function (n) {
                _this._right = PrintUtil.singleChildNumber(n);
            });
        } else {
            this._top = top;
            this._left = left;
            this._bottom = bottom;
            this._right = right;
        }
    }
    Object.defineProperty(Edges.prototype, "top", {
        get: function get() {
            return this._top;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edges.prototype, "left", {
        get: function get() {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edges.prototype, "bottom", {
        get: function get() {
            return this._bottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edges.prototype, "right", {
        get: function get() {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    return Edges;
}(Spec);
exports.Edges = Edges;
var Form = function (_super) {
    __extends(Form, _super);
    function Form(node) {
        _super.call(this, node);
    }
    Object.defineProperty(Form.prototype, "hideControlFraming", {
        get: function get() {
            return this._hideControlFraming;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "hideSaveCancelButtons", {
        get: function get() {
            return this._hideSaveCancelButtons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "settings", {
        get: function get() {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    return Form;
}(Container);
exports.Form = Form;
var Grid = function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
    }
    return Grid;
}(Container);
exports.Grid = Grid;
var Image = function (_super) {
    __extends(Image, _super);
    function Image(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_ANNOTATIONS], function (n) {
            _this._allowAnnotations = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICKER], function (n) {
            _this._allowPicker = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICK_OPTIONS], function (n) {
            _this._allowPickOptions = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], function (n) {
            _this._aspectMode = PrintUtil.enumValue(node, AspectMode);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], function (n) {
            _this._capInsets = new Edges(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], function (n) {
            _this._resizeMode = PrintUtil.enumValue(node, ResizeMode);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], function (n) {
            _this._urlString = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], function (n) {
            _this._captureBounds = new CaptureBounds(node);
        });
    }
    Object.defineProperty(Image.prototype, "allowAnnotations", {
        get: function get() {
            return this._allowAnnotations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "allowPicker", {
        get: function get() {
            return this._allowPicker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "allowPickOptions", {
        get: function get() {
            return this._allowPickOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "aspectMode", {
        get: function get() {
            return this._aspectMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "capInsets", {
        get: function get() {
            return this._capInsets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "resizeMode", {
        get: function get() {
            return this._resizeMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "urlString", {
        get: function get() {
            return this._urlString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "capatureBounds", {
        get: function get() {
            return this._captureBounds;
        },
        enumerable: true,
        configurable: true
    });
    return Image;
}(Component);
exports.Image = Image;
var Label = function (_super) {
    __extends(Label, _super);
    function Label(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) {
            _this._bold = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], function (n) {
            _this._italic = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], function (n) {
            _this._underline = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) {
            _this._numberOfLines = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) {
            _this._text = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) {
            _this._textAlignment = PrintUtil.enumValue(node, TextAlignment);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) {
            _this._textColor = new Color(node);
        });
    }
    Object.defineProperty(Label.prototype, "bold", {
        get: function get() {
            return this._bold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "italic", {
        get: function get() {
            return this._italic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "underline", {
        get: function get() {
            return this._underline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "numberOfLines", {
        get: function get() {
            return this._numberOfLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "text", {
        get: function get() {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textAlignment", {
        get: function get() {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textColor", {
        get: function get() {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    return Label;
}(Component);
exports.Label = Label;
var Layout = function (_super) {
    __extends(Layout, _super);
    function Layout(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_UOM], function (n) {
            _this._uom = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_COLUMN], function (n) {
            _this._column = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ROW], function (n) {
            _this._row = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_SIZE], function (n) {
            _this._heights = PrintUtil.arrayOfNumbers(n, "Height");
            _this._widths = PrintUtil.arrayOfNumbers(n, "Width");
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ORIGIN], function (n) {
            PrintUtil.forEachChildNode(n, function (n2) {
                switch (n2.nodeName) {
                    case "X":
                        _this._x = PrintUtil.singleChildNumber(n2);
                        break;
                    case "Y":
                        _this._y = PrintUtil.singleChildNumber(n2);
                        break;
                }
            });
        });
    }
    Object.defineProperty(Layout.prototype, "uom", {
        get: function get() {
            return this._uom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "heights", {
        get: function get() {
            return this._heights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "widths", {
        get: function get() {
            return this._widths;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "x", {
        get: function get() {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "y", {
        get: function get() {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "column", {
        get: function get() {
            return this._column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "row", {
        get: function get() {
            return this._row;
        },
        enumerable: true,
        configurable: true
    });
    return Layout;
}(Spec);
exports.Layout = Layout;
var Page = function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.apply(this, arguments);
    }
    return Page;
}(Container);
exports.Page = Page;
var Settings = function (_super) {
    __extends(Settings, _super);
    function Settings(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_REFRESH_TIMER], function (n) {
            _this._refreshTimer = PrintUtil.singleChildNumber(node);
        });
    }
    Object.defineProperty(Settings.prototype, "refreshTimer", {
        get: function get() {
            return this._refreshTimer;
        },
        enumerable: true,
        configurable: true
    });
    return Settings;
}(Spec);
exports.Settings = Settings;
var SignatureCapture = function (_super) {
    __extends(SignatureCapture, _super);
    function SignatureCapture(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], function (n) {
            _this._captureBounds = new CaptureBounds(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], function (n) {
            _this._lineColor = new Color(node);
        });
    }
    Object.defineProperty(SignatureCapture.prototype, "captureBounds", {
        get: function get() {
            return this._captureBounds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignatureCapture.prototype, "lineColor", {
        get: function get() {
            return this._lineColor;
        },
        enumerable: true,
        configurable: true
    });
    return SignatureCapture;
}(Component);
exports.SignatureCapture = SignatureCapture;
var TextArea = function (_super) {
    __extends(TextArea, _super);
    function TextArea(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) {
            _this._entrySeq = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) {
            _this._bold = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], function (n) {
            _this._italic = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], function (n) {
            _this._underline = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) {
            _this._numberOfLines = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) {
            _this._text = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) {
            _this._textColor = new Color(node);
        });
    }
    Object.defineProperty(TextArea.prototype, "entrySeq", {
        get: function get() {
            return this._entrySeq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "bold", {
        get: function get() {
            return this._bold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "italic", {
        get: function get() {
            return this._italic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "underline", {
        get: function get() {
            return this._underline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "numberOfLines", {
        get: function get() {
            return this._numberOfLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "text", {
        get: function get() {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "textColor", {
        get: function get() {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    return TextArea;
}(Component);
exports.TextArea = TextArea;
var TextField = function (_super) {
    __extends(TextField, _super);
    function TextField(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) {
            _this._entrySeq = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) {
            _this._bold = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], function (n) {
            _this._italic = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], function (n) {
            _this._underline = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) {
            _this._numberOfLines = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) {
            _this._text = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) {
            _this._textAlignment = PrintUtil.enumValue(node, TextAlignment);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) {
            _this._textColor = new Color(node);
        });
    }
    Object.defineProperty(TextField.prototype, "entrySeq", {
        get: function get() {
            return this._entrySeq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "bold", {
        get: function get() {
            return this._bold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "italic", {
        get: function get() {
            return this._italic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "underline", {
        get: function get() {
            return this._underline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "numberOfLines", {
        get: function get() {
            return this._numberOfLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "text", {
        get: function get() {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textAlignment", {
        get: function get() {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textColor", {
        get: function get() {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
}(Component);
exports.TextField = TextField;
var TimePicker = function (_super) {
    __extends(TimePicker, _super);
    function TimePicker(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) {
            _this._entrySeq = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) {
            _this._bold = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) {
            _this._text = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) {
            _this._textAlignment = PrintUtil.enumValue(node, TextAlignment);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) {
            _this._textColor = new Color(node);
        });
    }
    Object.defineProperty(TimePicker.prototype, "entrySeq", {
        get: function get() {
            return this._entrySeq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "bold", {
        get: function get() {
            return this._bold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "text", {
        get: function get() {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "textAlignment", {
        get: function get() {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "textColor", {
        get: function get() {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    return TimePicker;
}(Component);
exports.TimePicker = TimePicker;
var ValuePicker = function (_super) {
    __extends(ValuePicker, _super);
    function ValuePicker(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) {
            _this._entrySeq = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) {
            _this._bold = PrintUtil.singleChildBoolean(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) {
            _this._numberOfLines = PrintUtil.singleChildNumber(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) {
            _this._text = PrintUtil.singleChildText(node);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) {
            _this._textAlignment = PrintUtil.enumValue(node, TextAlignment);
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) {
            _this._textColor = new Color(node);
        });
    }
    Object.defineProperty(ValuePicker.prototype, "entrySeq", {
        get: function get() {
            return this._entrySeq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "bold", {
        get: function get() {
            return this._bold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "numberOfLines", {
        get: function get() {
            return this._numberOfLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "text", {
        get: function get() {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "textAlignment", {
        get: function get() {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "textColor", {
        get: function get() {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    return ValuePicker;
}(Component);
exports.ValuePicker = ValuePicker;
// export class RichNum {
//     constructor(node:Node, public value?:number, public usage:RichNumUsage=RichNumUsage.Absolute) {
//         if (node) {
//
//         } else {
//             // Values held by constructor line
//         }
//     }
//
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ComponentFactory = function () {
    function ComponentFactory() {}
    ComponentFactory.fromNode = function (node) {
        var answer = null;
        switch (node.nodeName) {
            case XML_BUTTON:
                answer = new Button(node);
                break;
            case XML_CHECKBOX:
                answer = new Checkbox(node);
                break;
            case XML_IMAGE:
                answer = new Image(node);
                break;
            case XML_LABEL:
                answer = new Label(node);
                break;
            case XML_SIGNATURE_CAPTURE:
                answer = new SignatureCapture(node);
                break;
            case XML_TEXT_AREA:
                answer = new TextArea(node);
                break;
            case XML_TEXT_FIELD:
                answer = new TextField(node);
                break;
            case XML_TIME_PICKER:
                answer = new TimePicker(node);
                break;
            case XML_VALUE_PICKER:
                answer = new ValuePicker(node);
                break;
            case XML_CELL:
                answer = new Cell(node);
                break;
            case XML_FORM:
                answer = new Form(node);
                break;
            case XML_GRID:
                answer = new Grid(node);
                break;
            case XML_PAGE:
                answer = new Page(node);
                break;
        }
        return answer;
    };
    return ComponentFactory;
}();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var PrintUtil = function () {
    function PrintUtil() {}
    PrintUtil.arrayOfNumbers = function (node, name) {
        var answer = [];
        PrintUtil.forEachChildNode(node, function (n) {
            if (n.nodeName == name) {
                answer.push(PrintUtil.singleChildNumber(n));
            }
        });
        return answer;
    };
    PrintUtil.enumValue = function (node, e) {
        var answer = null;
        var sv = PrintUtil.singleChildText(node);
        if (sv) {
            var nv = e[sv];
            if (!isNaN(nv)) {
                answer = e[nv];
            }
        }
        return answer;
    };
    PrintUtil.forEachChildNode = function (node, f) {
        for (var i = 0; i < node.childNodes.length; i++) {
            f(node.childNodes[i]);
        }
    };
    PrintUtil.ifChild = function (node, f) {
        if (node) {
            f(node);
        }
    };
    PrintUtil.singleChildBoolean = function (node) {
        var text = PrintUtil.singleChildText(node);
        if (text) {
            return text.toLocaleLowerCase() == "true";
        } else {
            return false;
        }
    };
    PrintUtil.singleChildNumber = function (node) {
        var answer = NaN;
        if (node.childNodes.length != 1) {
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected numeric node.");
        } else {
            answer = parseInt(node.childNodes[0].textContent);
        }
        return answer;
    };
    PrintUtil.singleChildText = function (node) {
        if (node.childNodes.length != 1) {
            var text = "ExpectedExactlyOneNode";
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            text = "ExpectedNodeText";
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected text node.");
        } else {
            text = node.childNodes[0].textContent;
        }
        return text;
    };
    return PrintUtil;
}();
/**
 * *********************************
 */
/**
 * *********************************
 */

},{"./util":6}],6:[function(require,module,exports){
/**
 * Created by rburson on 3/6/15.
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ArrayUtil = function () {
    function ArrayUtil() {}
    ArrayUtil.copy = function (source) {
        return source.map(function (e) {
            return e;
        });
    };
    ArrayUtil.find = function (source, f) {
        var value = null;
        source.some(function (v) {
            if (f(v)) {
                value = v;
                return true;
            }
            return false;
        });
        return value;
    };
    return ArrayUtil;
}();
exports.ArrayUtil = ArrayUtil;
/**
 * *****************************************************
 */
/*
 This implementation supports our ECMA 5.1 browser set, including IE9
 If we no longer need to support IE9, a TypedArray implementaion would be more efficient...
 */
var Base64 = function () {
    function Base64() {}
    Base64.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }
        return output;
    };
    Base64.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    };
    Base64._utf8_encode = function (s) {
        s = s.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < s.length; n++) {
            var c = s.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }
        return utftext;
    };
    Base64._utf8_decode = function (utftext) {
        var s = "";
        var i = 0;
        var c = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                s += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                s += String.fromCharCode((c & 31) << 6 | c2 & 63);
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                s += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                i += 3;
            }
        }
        return s;
    };
    Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return Base64;
}();
exports.Base64 = Base64;
/**
 * *****************************************************
 */
var DataUrl = function () {
    function DataUrl(dataUrl) {
        this._mimeType = DataUrl.getMimeType(dataUrl);
        this._data = DataUrl.getEncodedData(dataUrl);
    }
    DataUrl.createDataUrl = function (mimeType, encodedData) {
        return DataUrl.PROTO_TOKEN + mimeType + DataUrl.ENCODING_TOKEN + encodedData;
    };
    DataUrl.getMimeType = function (dataUrl) {
        var startIndex = dataUrl.indexOf(':');
        var endIndex = dataUrl.indexOf(';');
        if (startIndex > -1 && endIndex > startIndex) {
            return dataUrl.substring(startIndex + 1, endIndex);
        }
    };
    DataUrl.getEncodedData = function (dataUrl) {
        var startIndex = dataUrl.indexOf(',');
        if (startIndex > -1) {
            return dataUrl.substring(startIndex + 1);
        }
    };
    Object.defineProperty(DataUrl.prototype, "mimeType", {
        get: function get() {
            return this._mimeType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataUrl.prototype, "data", {
        get: function get() {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    DataUrl.PROTO_TOKEN = 'data:';
    DataUrl.ENCODING_TOKEN = ';base64,';
    return DataUrl;
}();
exports.DataUrl = DataUrl;
/**
 * *****************************************************
 */
var TimeValue = function () {
    function TimeValue(hours, minutes, seconds, millis) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.millis = millis;
    }
    TimeValue.fromString = function (timeString) {
        /* expecting hh:mm:ss.lll */
        var _a = timeString.split(':'),
            _b = _a[0],
            hours = _b === void 0 ? '0' : _b,
            _c = _a[1],
            minutes = _c === void 0 ? '0' : _c,
            _d = _a[2],
            secondsPart = _d === void 0 ? '0.0' : _d;
        var _e = secondsPart.split('.'),
            _f = _e[0],
            seconds = _f === void 0 ? '0' : _f,
            _g = _e[1],
            millis = _g === void 0 ? '0' : _g;
        return new TimeValue(Number(hours), Number(minutes), Number(seconds), Number(millis));
    };
    TimeValue.fromDateValue = function (dateValue) {
        return new TimeValue(dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds(), dateValue.getMilliseconds());
    };
    TimeValue.prototype.toString = function () {
        return this.pad(this.hours.toString()) + ":" + this.pad(this.minutes.toString()) + ":" + this.pad(this.seconds.toString()) + "." + this.pad(this.millis.toString(), "000");
    };
    TimeValue.prototype.toDateValue = function () {
        var d = new Date();
        d.setHours(this.hours, this.minutes, this.seconds, this.millis);
        return d;
    };
    TimeValue.prototype.pad = function (s, pad) {
        if (pad === void 0) {
            pad = "00";
        }
        return (pad + s).substring(s.length);
    };
    return TimeValue;
}();
exports.TimeValue = TimeValue;
/**
 * *****************************************************
 */
var DateValue = function () {
    function DateValue(dateObj) {
        this.dateObj = dateObj;
    }
    return DateValue;
}();
exports.DateValue = DateValue;
/**
 * *****************************************************
 */
var DateTimeValue = function () {
    function DateTimeValue(dateObj) {
        this.dateObj = dateObj;
    }
    return DateTimeValue;
}();
exports.DateTimeValue = DateTimeValue;
/**
 * *****************************************************
 */
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
var Log = function () {
    function Log() {}
    Log.logLevel = function (level) {
        if (level >= LogLevel.DEBUG) {
            Log.debug = function (message, method, clz) {
                Log.log(function (o) {
                    console.info(o);
                }, 'DEBUG: ' + message, method, clz);
            };
        } else {
            Log.debug = function (message, method, clz) {};
        }
        if (level >= LogLevel.INFO) {
            Log.info = function (message, method, clz) {
                Log.log(function (o) {
                    console.info(o);
                }, 'INFO: ' + message, method, clz);
            };
        } else {
            Log.info = function (message, method, clz) {};
        }
        if (level >= LogLevel.WARN) {
            Log.error = function (message, clz, method) {
                Log.log(function (o) {
                    console.error(o);
                }, 'ERROR: ' + message, method, clz);
            };
        } else {
            Log.error = function (message, clz, method) {};
        }
        if (level >= LogLevel.ERROR) {
            Log.warn = function (message, clz, method) {
                Log.log(function (o) {
                    console.info(o);
                }, 'WARN: ' + message, method, clz);
            };
        } else {
            Log.warn = function (message, clz, method) {};
        }
    };
    Log.log = function (logger, message, method, clz) {
        var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
        if (clz || method) {
            logger(clz + "::" + method + " : " + m);
        } else {
            logger(m);
        }
    };
    Log.formatRecString = function (o) {
        return ObjUtil.formatRecAttr(o);
    };
    //set default log level here
    Log.init = Log.logLevel(LogLevel.INFO);
    return Log;
}();
exports.Log = Log;
/**
 * *****************************************************
 */
var ObjUtil = function () {
    function ObjUtil() {}
    ObjUtil.addAllProps = function (sourceObj, targetObj) {
        if (null == sourceObj || "object" != (typeof sourceObj === "undefined" ? "undefined" : _typeof(sourceObj))) return targetObj;
        if (null == targetObj || "object" != (typeof targetObj === "undefined" ? "undefined" : _typeof(targetObj))) return targetObj;
        for (var attr in sourceObj) {
            targetObj[attr] = sourceObj[attr];
        }
        return targetObj;
    };
    ObjUtil.cloneOwnProps = function (sourceObj) {
        if (null == sourceObj || "object" != (typeof sourceObj === "undefined" ? "undefined" : _typeof(sourceObj))) return sourceObj;
        var copy = sourceObj.constructor();
        for (var attr in sourceObj) {
            if (sourceObj.hasOwnProperty(attr)) {
                copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
            }
        }
        return copy;
    };
    ObjUtil.copyNonNullFieldsOnly = function (obj, newObj, filterFn) {
        for (var prop in obj) {
            if (!filterFn || filterFn(prop)) {
                var type = _typeof(obj[prop]);
                if (type !== 'function') {
                    var val = obj[prop];
                    if (val) {
                        newObj[prop] = val;
                    }
                }
            }
        }
        return newObj;
    };
    ObjUtil.formatRecAttr = function (o) {
        //@TODO - add a filter here to build a cache and detect (and skip) circular references
        return JSON.stringify(o);
    };
    ObjUtil.newInstance = function (type) {
        return new type();
    };
    return ObjUtil;
}();
exports.ObjUtil = ObjUtil;
/**
 * *****************************************************
 */
var StringUtil = function () {
    function StringUtil() {}
    StringUtil.splitSimpleKeyValuePair = function (pairString) {
        var index = pairString.indexOf(':');
        var code = '';
        var desc = '';
        if (index > -1) {
            code = pairString.substr(0, index);
            desc = pairString.length > index ? pairString.substr(index + 1) : '';
        } else {
            code = pairString;
        }
        return [code, desc];
    };
    StringUtil.hashCode = function (s) {
        var hash = 0,
            i,
            chr,
            len;
        if (s.length === 0) return hash;
        for (i = 0, len = s.length; i < len; i++) {
            chr = s.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    StringUtil.endsWith = function (subjectString, searchString, position) {
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
    return StringUtil;
}();
exports.StringUtil = StringUtil;
/**
 * *****************************************************
 */

},{}],7:[function(require,module,exports){
"use strict";

var fp_1 = require("./fp");
var util_1 = require("./util");
var fp_2 = require("./fp");
var fp_3 = require("./fp");
var ClientFactory = function () {
    function ClientFactory() {}
    ClientFactory.getClient = function () {
        return new XMLHttpClient();
    };
    return ClientFactory;
}();
exports.ClientFactory = ClientFactory;
var XMLHttpClient = function () {
    function XMLHttpClient() {}
    XMLHttpClient.prototype.jsonGet = function (targetUrl, timeoutMillis) {
        var t = this.sendRequest(targetUrl, null, 'GET', timeoutMillis);
        return t.map(function (s) {
            try {
                return JSON.parse(s);
            } catch (error) {
                throw Error("XMLHttpClient::jsonCall: Failed to parse response: " + s);
            }
        });
    };
    XMLHttpClient.prototype.stringGet = function (targetUrl, timeoutMillis) {
        var f;
        return this.sendRequest(targetUrl, null, 'GET', timeoutMillis);
    };
    XMLHttpClient.prototype.jsonPost = function (targetUrl, jsonObj, timeoutMillis) {
        var body = jsonObj && JSON.stringify(jsonObj);
        var t = this.sendRequest(targetUrl, body, 'POST', timeoutMillis);
        return t.map(function (s) {
            try {
                return JSON.parse(s);
            } catch (error) {
                throw Error("XMLHttpClient::jsonCall: Failed to parse response: " + s);
            }
        });
    };
    /*
     this method is intended to support both react and react-native.
     http://doochik.com/2015/11/27/FormData-in-React-Native.html
     https://github.com/facebook/react-native/blob/56fef9b6225ffc1ba87f784660eebe842866c57d/Libraries/Network/FormData.js#L34:
     */
    XMLHttpClient.prototype.postMultipart = function (targetUrl, formData) {
        var promise = new fp_2.Promise("XMLHttpClient::postMultipart" + targetUrl);
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status !== 200 && xmlHttpRequest.status !== 304) {
                    util_1.Log.error('XMLHttpClient::postObject call failed with ' + xmlHttpRequest.status + ":" + xmlHttpRequest.statusText + ".  targetURL: " + targetUrl);
                    promise.failure('XMLHttpClient::jsonCall: call failed with ' + xmlHttpRequest.status + ":" + xmlHttpRequest.statusText + ".  targetURL: " + targetUrl);
                } else {
                    util_1.Log.debug("XMLHttpClient::postObject: Got successful response: " + xmlHttpRequest.responseText);
                    promise.success(null);
                }
            }
        };
        util_1.Log.debug("XmlHttpClient:postMultipart: " + targetUrl);
        util_1.Log.debug("XmlHttpClient:postMultipart: " + formData);
        xmlHttpRequest.open('POST', targetUrl, true);
        xmlHttpRequest.send(formData);
        return promise.future;
    };
    XMLHttpClient.prototype.sendRequest = function (targetUrl, body, method, timeoutMillis) {
        if (timeoutMillis === void 0) {
            timeoutMillis = 30000;
        }
        //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
        var promise = new fp_2.Promise("XMLHttpClient::" + targetUrl + ":" + body);
        if (method !== 'GET' && method !== 'POST') {
            promise.failure(method + " method not supported.");
            return promise.future;
        }
        var successCallback = function successCallback(request) {
            util_1.Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
            promise.success(request.responseText);
        };
        var errorCallback = function errorCallback(request) {
            util_1.Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
            promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
        };
        var timeoutCallback = function timeoutCallback() {
            if (promise.isComplete()) {
                util_1.Log.error('XMLHttpClient::jsonCall: Timeout received but Promise was already complete.' + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
            } else {
                util_1.Log.error('XMLHttpClient::jsonCall: Timeout received.' + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
                promise.failure('XMLHttpClient::jsonCall: Call timed out');
            }
        };
        var wRequestTimer = null;
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState === 4) {
                if (wRequestTimer) {
                    clearTimeout(wRequestTimer);
                }
                if (xmlHttpRequest.status !== 200 && xmlHttpRequest.status !== 304) {
                    errorCallback(xmlHttpRequest);
                } else {
                    successCallback(xmlHttpRequest);
                }
            }
        };
        util_1.Log.debug("XmlHttpClient: Calling: " + targetUrl);
        util_1.Log.debug("XmlHttpClient: body: " + body);
        xmlHttpRequest.open(method, targetUrl, true);
        xmlHttpRequest.setRequestHeader("Accept", "gzip");
        if (timeoutMillis) {
            //check for timeout support on the xmlHttpRequest itself
            if (typeof xmlHttpRequest.ontimeout !== "undefined") {
                xmlHttpRequest.timeout = timeoutMillis;
                xmlHttpRequest.ontimeout = timeoutCallback;
            } else {
                wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
            }
        }
        if (method === 'POST') {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttpRequest.send(body);
        } else {
            xmlHttpRequest.send();
        }
        return promise.future;
    };
    return XMLHttpClient;
}();
exports.XMLHttpClient = XMLHttpClient;
var Call = function () {
    function Call(service, method, params, systemContext, sessionContext) {
        this._client = ClientFactory.getClient();
        this._performed = false;
        this._cancelled = false;
        this._systemContext = systemContext;
        this._sessionContext = sessionContext;
        this._service = service;
        this._method = method;
        this._params = params;
        this._callId = Call.nextCallId();
        this._responseHeaders = null;
        this.timeoutMillis = 30000;
    }
    Call.nextCallId = function () {
        return ++Call._lastCallId;
    };
    Call.createCall = function (service, method, params, sessionContext) {
        return new Call(service, method, params, sessionContext.systemContext, sessionContext);
    };
    Call.createCallWithoutSession = function (service, method, params, systemContext) {
        return new Call(service, method, params, systemContext, null);
    };
    Object.defineProperty(Call, "lastSuccessfulActivityTime", {
        get: function get() {
            return Call._lastSuccessfulActivityTime;
        },
        enumerable: true,
        configurable: true
    });
    Call.prototype.cancel = function () {
        util_1.Log.error("Needs implementation", "Call", "cancel");
    };
    Call.prototype.perform = function () {
        if (this._performed) {
            return fp_1.Future.createFailedFuture("Call::perform", "Call:perform(): Call is already performed");
        }
        this._performed = true;
        if (!this._systemContext) {
            return fp_1.Future.createFailedFuture("Call::perform", "Call:perform(): SystemContext cannot be null");
        }
        var jsonObj = {
            id: this._callId,
            method: this._method,
            params: this._params
        };
        var pathPrefix = "";
        if (this._systemContext && this._systemContext.urlString) {
            pathPrefix = this._systemContext.urlString;
            if (pathPrefix.charAt(pathPrefix.length - 1) !== '/') {
                pathPrefix += '/';
            }
        }
        var servicePath = pathPrefix + (this._service || "");
        return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis).map(function (result) {
            Call._lastSuccessfulActivityTime = new Date();
            return result;
        });
    };
    Call._lastCallId = 0;
    Call._lastSuccessfulActivityTime = new Date();
    return Call;
}();
exports.Call = Call;
var Get = function () {
    function Get(url) {
        this._client = ClientFactory.getClient();
        this._url = url;
        this._performed = false;
        this._promise = new fp_2.Promise("catavolt.ws.Get");
        this.timeoutMillis = 30000;
    }
    Get.fromUrl = function (url) {
        return new Get(url);
    };
    Get.prototype.cancel = function () {
        util_1.Log.error("Needs implementation", "Get", "cancel");
    };
    Get.prototype.perform = function () {
        if (this._performed) {
            return this.complete(new fp_3.Failure("Get:perform(): Get is already performed")).future;
        }
        this._performed = true;
        return this._client.jsonGet(this._url, this.timeoutMillis);
    };
    Get.prototype.complete = function (t) {
        if (!this._promise.isComplete()) {
            this._promise.complete(t);
        }
        return this._promise;
    };
    return Get;
}();
exports.Get = Get;

},{"./fp":4,"./util":6}],8:[function(require,module,exports){
///<reference path="jasmine.d.ts"/>
"use strict";

var catavolt_1 = require('../src/catavolt');
var catavolt_2 = require('../src/catavolt');
var catavolt_3 = require('../src/catavolt');
var catavolt_4 = require('../src/catavolt');
var catavolt_5 = require('../src/catavolt');
var catavolt_6 = require('../src/catavolt');
var catavolt_7 = require('../src/catavolt');
var catavolt_8 = require('../src/catavolt');
var catavolt_9 = require('../src/catavolt');
var catavolt_10 = require('../src/catavolt');
var catavolt_11 = require('../src/catavolt');
var catavolt_12 = require('../src/catavolt');
var SERVICE_PATH = "www.catavolt.net";
var tenantId = "***REMOVED***z";
var userId = "sales";
var password = "***REMOVED***";
var clientType = "LIMITED_ACCESS";
describe("Api Usage", function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });
    it("Should run API Examples", function (done) {
        loginWithAppContext();
    });
});
function loginWithAppContext() {
    return catavolt_4.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(function (appWinDef) {
        catavolt_2.Log.info('Login Succeeded');
        catavolt_2.Log.info('AppWinDef: ' + catavolt_2.Log.formatRecString(appWinDef));
        catavolt_2.Log.info('SessionContext: ' + catavolt_2.Log.formatRecString(catavolt_4.AppContext.singleton.sessionContextTry.success));
        catavolt_2.Log.info('TenantSettings: ' + catavolt_2.Log.formatRecString(catavolt_4.AppContext.singleton.tenantSettingsTry.success));
        return setupWorkbench().bind(function (result) {
            catavolt_2.Log.info('Competed all workbenches.');
            return null;
        });
    });
}
function setupWorkbench() {
    var workbenches = catavolt_4.AppContext.singleton.appWinDefTry.success.workbenches;
    var launchWorkbenchesFuture = catavolt_3.Future.createSuccessfulFuture('startSetupWorkbench', null);
    workbenches.forEach(function (workbench) {
        catavolt_2.Log.info("Examining Workbench: " + workbench.name);
        //test the first action
        /*launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
         var launchAction = workbench.workbenchLaunchActions[0];
         Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
         return performLaunchAction(launchAction).map((launchActionResult)=>{
         Log.info('<<<<< Completed Launch Action ' + launchAction.name);
         return launchActionResult;
         });
         });*/
        workbench.workbenchLaunchActions.forEach(function (launchAction) {
            launchWorkbenchesFuture = launchWorkbenchesFuture.bind(function (lastResult) {
                catavolt_2.Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map(function (launchActionResult) {
                    catavolt_2.Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
        });
    });
    return launchWorkbenchesFuture.map(function (lastLaunchActionResult) {
        catavolt_2.Log.info("");
        catavolt_2.Log.info("Completed all launch Actions");
        catavolt_2.Log.info("");
    });
}
function performLaunchAction(launchAction) {
    return catavolt_4.AppContext.singleton.performLaunchAction(launchAction).bind(function (navRequest) {
        catavolt_2.Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
        return handleNavRequest(navRequest);
    });
}
function getLaunchActionByName(name, workbenches) {
    return null;
}
function handleNavRequest(navRequest) {
    if (navRequest instanceof catavolt_5.FormContext) {
        return handleFormContext(navRequest);
    } else {
        catavolt_2.Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
        return catavolt_3.Future.createSuccessfulFuture('handleNavRequest', navRequest);
    }
}
function handleFormContext(formContext) {
    displayMenus(formContext);
    var handleContextsFuture = catavolt_3.Future.createSuccessfulFuture('startHandleContexts', null);
    formContext.childrenContexts.forEach(function (context) {
        catavolt_2.Log.info('');
        catavolt_2.Log.info('Got a ' + context.constructor['name'] + ' for display');
        catavolt_2.Log.info('');
        if (context instanceof catavolt_6.ListContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleListContext(context);
            });
        } else if (context instanceof catavolt_8.DetailsContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleDetailsContext(context);
            });
        } else {
            catavolt_2.Log.info('');
            catavolt_2.Log.info('Not yet handling display for ' + context.constructor['name']);
            catavolt_2.Log.info('');
            handleContextsFuture = handleContextsFuture.map(function (lastContextResult) {
                return context;
            });
        }
    });
    return handleContextsFuture;
}
function displayMenus(paneContext) {
    catavolt_2.Log.info('----------Menus>>>-------------------------------');
    catavolt_2.Log.info(catavolt_1.ObjUtil.formatRecAttr(paneContext.menuDefs));
    catavolt_2.Log.info('----------<<<Menus-------------------------------');
    return catavolt_3.Future.createSuccessfulFuture('displayMenus', paneContext);
}
function handleListContext(listContext) {
    catavolt_2.Log.info('Handling a ListContext... ');
    listContext.setScroller(10, null, [catavolt_7.QueryMarkerOption.None]);
    var listFuture = listContext.refresh().bind(function (entityRec) {
        catavolt_2.Log.info('Finished refresh');
        displayMenus(listContext);
        var columnHeadings = listContext.listDef.activeColumnDefs.map(function (columnDef) {
            return columnDef.heading;
        });
        catavolt_2.Log.info(columnHeadings.join('|'));
        listContext.scroller.buffer.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        var scrollResultsFuture = scrollThroughAllResults(listContext).bind(function (scrollResult) {
            return scrollBackwardThroughAllResults(listContext);
        });
        return scrollResultsFuture.bind(function (result) {
            return handleDefaultActionForListItem(0, listContext);
        });
    });
    listFuture.onFailure(function (failure) {
        catavolt_2.Log.error("ListContext failed to render with " + failure);
    });
    return listFuture;
}
function scrollThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreForward) {
        catavolt_2.Log.info('The list has more items to display.  Scrolling forward....');
        return getNextPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollThroughAllResults(listContext);
        });
    } else {
        catavolt_2.Log.info('The list has no more items to display.');
        return catavolt_3.Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
    }
}
function scrollBackwardThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreBackward) {
        catavolt_2.Log.info('The list has previous items to display.  Scrolling backward....');
        return getPreviousPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollBackwardThroughAllResults(listContext);
        });
    } else {
        catavolt_2.Log.info('The list has no more previous items to display.');
        return catavolt_3.Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
    }
}
function getNextPageOfResults(listContext) {
    return listContext.scroller.pageForward().map(function (entityRecs) {
        catavolt_2.Log.info('Displaying next page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function getPreviousPageOfResults(listContext) {
    return listContext.scroller.pageBackward().map(function (entityRecs) {
        catavolt_2.Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function displayListItem(entityRec, listContext) {
    var rowValues = listContext.rowValues(entityRec);
    catavolt_2.Log.info(rowValues.join('|'));
}
function handleDefaultActionForListItem(index, listContext) {
    if (!listContext.listDef.defaultActionId) {
        return catavolt_3.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    }
    var defaultActionMenuDef = new catavolt_10.MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
    var entityRecs = listContext.scroller.buffer;
    if (entityRecs.length === 0) return catavolt_3.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    if (entityRecs.length > index) {
        var entityRec = entityRecs[index];
        catavolt_2.Log.info('--------------------------------------------------------------');
        catavolt_2.Log.info('Invoking default action on list item ' + entityRec.objectId);
        catavolt_2.Log.info('--------------------------------------------------------------');
        var targets = [entityRec.objectId];
        return listContext.performMenuAction(defaultActionMenuDef, targets).bind(function (navRequest) {
            return handleNavRequest(navRequest);
        });
    } else {
        return catavolt_3.Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
    }
}
function handleDetailsContext(detailsContext) {
    catavolt_2.Log.info('Handling Details Context...');
    return detailsContext.read().bind(function (entityRec) {
        return layoutDetailsPane(detailsContext).map(function (renderedDetailRows) {
            renderedDetailRows.forEach(function (row) {
                catavolt_2.Log.info('Detail Row: ' + row);
            });
            return renderedDetailRows;
        });
    });
}
function layoutDetailsPane(detailsContext) {
    var allDefsComplete = catavolt_3.Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
    var renderedDetailRows = [];
    detailsContext.detailsDef.rows.forEach(function (cellDefRow) {
        if (isValidDetailsDefRow(cellDefRow)) {
            if (isSectionTitleDef(cellDefRow)) {
                allDefsComplete = allDefsComplete.map(function (lastRowResult) {
                    var titleRow = createTitleRow(cellDefRow);
                    renderedDetailRows.push(titleRow);
                    return titleRow;
                });
            } else {
                allDefsComplete = allDefsComplete.bind(function (lastRowResult) {
                    return createEditorRow(cellDefRow, detailsContext).map(function (editorRow) {
                        renderedDetailRows.push(editorRow);
                        return editorRow;
                    });
                });
            }
        } else {
            catavolt_2.Log.info('Detail row is invalid ' + catavolt_1.ObjUtil.formatRecAttr(cellDefRow));
        }
    });
    return allDefsComplete.map(function (lastRowResult) {
        return renderedDetailRows;
    });
}
function isValidDetailsDefRow(row) {
    return row.length === 2 && row[0].values.length === 1 && row[1].values.length === 1 && (row[0].values[0] instanceof catavolt_9.LabelCellValueDef || row[1].values[0] instanceof catavolt_11.ForcedLineCellValueDef) && (row[1].values[0] instanceof catavolt_12.AttributeCellValueDef || row[1].values[0] instanceof catavolt_9.LabelCellValueDef || row[1].values[0] instanceof catavolt_11.ForcedLineCellValueDef);
}
function isSectionTitleDef(row) {
    return row[0].values[0] instanceof catavolt_9.LabelCellValueDef && row[1].values[0] instanceof catavolt_9.LabelCellValueDef;
}
function createTitleRow(row) {
    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
}
function createEditorRow(row, detailsContext) {
    var labelDef = row[0].values[0];
    var label;
    if (labelDef instanceof catavolt_9.LabelCellValueDef) {
        label = '<Label>' + labelDef.value + '</Label>';
    } else {
        label = '<Label>N/A</Label>';
    }
    var valueDef = row[1].values[0];
    if (valueDef instanceof catavolt_12.AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
        return createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
            return label + editorCellString;
        });
    } else if (valueDef instanceof catavolt_12.AttributeCellValueDef) {
        var value = "";
        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
        if (prop && detailsContext.isBinary(valueDef)) {
            value = "<Binary name='" + valueDef.propertyName + "'/>";
        } else if (prop) {
            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
        }
        return catavolt_3.Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
    } else if (valueDef instanceof catavolt_9.LabelCellValueDef) {
        return catavolt_3.Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
    } else {
        catavolt_3.Future.createSuccessfulFuture('createEditorRow', label + " : ");
    }
}
function createEditorControl(attributeDef, detailsContext) {
    if (attributeDef.isComboBoxEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
            return '<ComboBox>' + values.join(", ") + '</ComboBox>';
        });
    } else if (attributeDef.isDropDownEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
            return '<DropDown>' + values.join(", ") + '</DropDown>';
        });
    } else {
        var entityRec = detailsContext.buffer;
        var prop = entityRec.propAtName(attributeDef.propertyName);
        if (prop && detailsContext.isBinary(attributeDef)) {
            return catavolt_3.Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
        } else {
            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
            return catavolt_3.Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
        }
    }
}


},{"../src/catavolt":2}]},{},[8]);