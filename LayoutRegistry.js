"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.LayoutRegistry = void 0;
const ConstructorRegistry_1 = require("@civ-clone/core-registry/ConstructorRegistry");
const Layout_1 = require("./Layout");
class LayoutRegistry extends ConstructorRegistry_1.default {
    constructor() {
        super(Layout_1.default);
    }
}
exports.LayoutRegistry = LayoutRegistry;
exports.instance = new LayoutRegistry();
exports.default = LayoutRegistry;
//# sourceMappingURL=LayoutRegistry.js.map