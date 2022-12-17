"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Slot_accepts, _Slot_height, _Slot_part, _Slot_width, _Slot_x, _Slot_y;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class Slot extends DataObject_1.DataObject {
    constructor(x, y, height, width, accepts) {
        super();
        _Slot_accepts.set(this, []);
        _Slot_height.set(this, void 0);
        _Slot_part.set(this, null);
        _Slot_width.set(this, void 0);
        _Slot_x.set(this, void 0);
        _Slot_y.set(this, void 0);
        this.addKey('height', 'part', 'width', 'x', 'y');
        __classPrivateFieldSet(this, _Slot_height, height, "f");
        __classPrivateFieldSet(this, _Slot_width, width, "f");
        __classPrivateFieldSet(this, _Slot_x, x, "f");
        __classPrivateFieldSet(this, _Slot_y, y, "f");
        __classPrivateFieldGet(this, _Slot_accepts, "f").push(...accepts);
    }
    accepts(part) {
        return __classPrivateFieldGet(this, _Slot_accepts, "f").some((PartType) => part instanceof PartType);
    }
    empty() {
        return __classPrivateFieldGet(this, _Slot_part, "f") === null;
    }
    fill(part) {
        if (!this.accepts(part)) {
            return;
        }
        __classPrivateFieldSet(this, _Slot_part, part, "f");
    }
    height() {
        return __classPrivateFieldGet(this, _Slot_height, "f");
    }
    part() {
        return __classPrivateFieldGet(this, _Slot_part, "f");
    }
    width() {
        return __classPrivateFieldGet(this, _Slot_width, "f");
    }
    x() {
        return __classPrivateFieldGet(this, _Slot_x, "f");
    }
    y() {
        return __classPrivateFieldGet(this, _Slot_y, "f");
    }
}
exports.Slot = Slot;
_Slot_accepts = new WeakMap(), _Slot_height = new WeakMap(), _Slot_part = new WeakMap(), _Slot_width = new WeakMap(), _Slot_x = new WeakMap(), _Slot_y = new WeakMap();
exports.default = Slot;
//# sourceMappingURL=Slot.js.map