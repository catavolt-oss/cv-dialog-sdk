/**
 * Created by rburson on 4/13/15.
 */
var Prop_1 = require("./Prop");
var DataAnno_1 = require("./DataAnno");
var EntityRecImpl = (function () {
    function EntityRecImpl(objectId, props, annos) {
        if (props === void 0) { props = []; }
        if (annos === void 0) { annos = []; }
        this.objectId = objectId;
        this.props = props;
        this.annos = annos;
    }
    EntityRecImpl.prototype.annosAtName = function (propName) {
        var p = this.propAtName(propName);
        return p ? p.annos : [];
    };
    EntityRecImpl.prototype.afterEffects = function (after) {
        var _this = this;
        var effects = [];
        after.props.forEach(function (afterProp) {
            var beforeProp = _this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new EntityRecImpl(after.objectId, effects);
    };
    Object.defineProperty(EntityRecImpl.prototype, "backgroundColor", {
        get: function () {
            return DataAnno_1.DataAnno.backgroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.backgroundColorFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    };
    Object.defineProperty(EntityRecImpl.prototype, "foregroundColor", {
        get: function () {
            return DataAnno_1.DataAnno.foregroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.foregroundColorFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    };
    Object.defineProperty(EntityRecImpl.prototype, "imageName", {
        get: function () {
            return DataAnno_1.DataAnno.imageName(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.imageNameFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    };
    Object.defineProperty(EntityRecImpl.prototype, "imagePlacement", {
        get: function () {
            return DataAnno_1.DataAnno.imagePlacement(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.imagePlacementFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isBoldText", {
        get: function () {
            return DataAnno_1.DataAnno.isBoldText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isBoldTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isItalicText", {
        get: function () {
            return DataAnno_1.DataAnno.isItalicText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isItalicTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementCenter", {
        get: function () {
            return DataAnno_1.DataAnno.isPlacementCenter(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementCenterFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementLeft", {
        get: function () {
            return DataAnno_1.DataAnno.isPlacementLeft(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementLeftFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementRight", {
        get: function () {
            return DataAnno_1.DataAnno.isPlacementRight(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementRightFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementStretchUnder", {
        get: function () {
            return DataAnno_1.DataAnno.isPlacementStretchUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementStretchUnderFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementUnder", {
        get: function () {
            return DataAnno_1.DataAnno.isPlacementUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementUnderFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isUnderline", {
        get: function () {
            return DataAnno_1.DataAnno.isUnderlineText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isUnderlineFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;
    };
    Object.defineProperty(EntityRecImpl.prototype, "overrideText", {
        get: function () {
            return DataAnno_1.DataAnno.overrideText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.overrideTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;
    };
    EntityRecImpl.prototype.propAtIndex = function (index) {
        return this.props[index];
    };
    EntityRecImpl.prototype.propAtName = function (propName) {
        var prop = null;
        this.props.some(function (p) {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    };
    Object.defineProperty(EntityRecImpl.prototype, "propCount", {
        get: function () {
            return this.props.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "propNames", {
        get: function () {
            return this.props.map(function (p) {
                return p.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "propValues", {
        get: function () {
            return this.props.map(function (p) {
                return p.value;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "tipText", {
        get: function () {
            return DataAnno_1.DataAnno.tipText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.tipTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;
    };
    EntityRecImpl.prototype.toEntityRec = function () {
        return this;
    };
    EntityRecImpl.prototype.toWSEditorRecord = function () {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['names'] = Prop_1.Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop_1.Prop.toWSListOfProperties(this.propValues);
        return result;
    };
    EntityRecImpl.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['props'] = Prop_1.Prop.toListOfWSProp(this.props);
        if (this.annos)
            result['annos'] = DataAnno_1.DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    };
    EntityRecImpl.prototype.valueAtName = function (propName) {
        var value = null;
        this.props.some(function (p) {
            if (p.name === propName) {
                value = p.value;
                return true;
            }
            return false;
        });
        return value;
    };
    return EntityRecImpl;
})();
exports.EntityRecImpl = EntityRecImpl;
