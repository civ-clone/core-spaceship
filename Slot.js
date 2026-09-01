"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class Slot extends DataObject_1.DataObject {
    constructor(x, y, height, width, accepts) {
        super();
        this._accepts = [];
        this._part = null;
        this.addKey('height', 'part', 'width', 'x', 'y');
        this._height = height;
        this._width = width;
        this._x = x;
        this._y = y;
        this._accepts.push(...accepts);
    }
    accepts(part) {
        return this._accepts.some((PartType) => part instanceof PartType);
    }
    empty() {
        return this._part === null;
    }
    fill(part) {
        if (!this.accepts(part)) {
            return;
        }
        this._part = part;
    }
    height() {
        return this._height;
    }
    part() {
        return this._part;
    }
    width() {
        return this._width;
    }
    x() {
        return this._x;
    }
    y() {
        return this._y;
    }
}
exports.Slot = Slot;
exports.default = Slot;
//# sourceMappingURL=Slot.js.map