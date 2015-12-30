/**
 * Created by rburson on 4/27/15.
 */
var EntityRec_1 = require("./EntityRec");
var EntityBuffer = (function () {
    function EntityBuffer(_before, _after) {
        this._before = _before;
        this._after = _after;
        if (!_before)
            throw new Error('_before is null in EntityBuffer');
        if (!_after)
            this._after = _before;
    }
    EntityBuffer.createEntityBuffer = function (objectId, before, after) {
        return new EntityBuffer(EntityRec_1.EntityRecUtil.newEntityRec(objectId, before), EntityRec_1.EntityRecUtil.newEntityRec(objectId, after));
    };
    Object.defineProperty(EntityBuffer.prototype, "after", {
        get: function () {
            return this._after;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "annos", {
        get: function () { return this._after.annos; },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.annosAtName = function (propName) {
        return this._after.annosAtName(propName);
    };
    EntityBuffer.prototype.afterEffects = function (afterAnother) {
        if (afterAnother) {
            return this._after.afterEffects(afterAnother);
        }
        else {
            return this._before.afterEffects(this._after);
        }
    };
    Object.defineProperty(EntityBuffer.prototype, "backgroundColor", {
        get: function () {
            return this._after.backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.backgroundColorFor = function (propName) {
        return this._after.backgroundColorFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "before", {
        get: function () {
            return this._before;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "foregroundColor", {
        get: function () {
            return this._after.foregroundColor;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.foregroundColorFor = function (propName) {
        return this._after.foregroundColorFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "imageName", {
        get: function () {
            return this._after.imageName;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.imageNameFor = function (propName) {
        return this._after.imageNameFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "imagePlacement", {
        get: function () {
            return this._after.imagePlacement;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.imagePlacementFor = function (propName) {
        return this._after.imagePlacement;
    };
    Object.defineProperty(EntityBuffer.prototype, "isBoldText", {
        get: function () {
            return this._after.isBoldText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isBoldTextFor = function (propName) {
        return this._after.isBoldTextFor(propName);
    };
    EntityBuffer.prototype.isChanged = function (name) {
        var before = this._before.propAtName(name);
        var after = this._after.propAtName(name);
        return (before && after) ? !before.equals(after) : !(!before && !after);
    };
    Object.defineProperty(EntityBuffer.prototype, "isItalicText", {
        get: function () {
            return this._after.isItalicText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isItalicTextFor = function (propName) {
        return this._after.isItalicTextFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementCenter", {
        get: function () {
            return this._after.isPlacementCenter;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementCenterFor = function (propName) {
        return this._after.isPlacementCenterFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementLeft", {
        get: function () {
            return this._after.isPlacementLeft;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementLeftFor = function (propName) {
        return this._after.isPlacementLeftFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementRight", {
        get: function () {
            return this._after.isPlacementRight;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementRightFor = function (propName) {
        return this._after.isPlacementRightFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementStretchUnder", {
        get: function () {
            return this._after.isPlacementStretchUnder;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementStretchUnderFor = function (propName) {
        return this._after.isPlacementStretchUnderFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementUnder", {
        get: function () {
            return this._after.isPlacementUnder;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementUnderFor = function (propName) {
        return this._after.isPlacementUnderFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isUnderline", {
        get: function () {
            return this._after.isUnderline;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isUnderlineFor = function (propName) {
        return this._after.isUnderlineFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "objectId", {
        get: function () { return this._after.objectId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "overrideText", {
        get: function () {
            return this._after.overrideText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.overrideTextFor = function (propName) {
        return this._after.overrideTextFor(propName);
    };
    EntityBuffer.prototype.propAtIndex = function (index) {
        return this.props[index];
    };
    EntityBuffer.prototype.propAtName = function (propName) {
        return this._after.propAtName(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "propCount", {
        get: function () {
            return this._after.propCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "propNames", {
        get: function () {
            return this._after.propNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "props", {
        get: function () { return this._after.props; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "propValues", {
        get: function () {
            return this._after.propValues;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.setValue = function (name, value) {
        this.props.some(function (prop) {
            if (prop.name === name) {
                prop.value = value;
                return true;
            }
            return false;
        });
    };
    Object.defineProperty(EntityBuffer.prototype, "tipText", {
        get: function () {
            return this._after.tipText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.tipTextFor = function (propName) {
        return this._after.tipTextFor(propName);
    };
    EntityBuffer.prototype.toEntityRec = function () {
        return EntityRec_1.EntityRecUtil.newEntityRec(this.objectId, this.props);
    };
    EntityBuffer.prototype.toWSEditorRecord = function () {
        return this.afterEffects().toWSEditorRecord();
    };
    EntityBuffer.prototype.toWS = function () {
        return this.afterEffects().toWS();
    };
    EntityBuffer.prototype.valueAtName = function (propName) {
        return this._after.valueAtName(propName);
    };
    return EntityBuffer;
})();
exports.EntityBuffer = EntityBuffer;
