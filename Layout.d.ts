import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Part from './Part';
import Slot from './Slot';
export interface ILayout extends IDataObject {
  get(x: number, y: number): Slot | null;
  getAdjacent(slot: Slot): Slot[];
  getFreeSlot(part: Part): Slot | null;
  height(): number;
  slots(): Slot[];
  width(): number;
}
export declare class Layout extends DataObject implements ILayout {
  #private;
  constructor(
    height: number,
    width: number,
    slots: Slot[],
    ruleRegistry?: RuleRegistry
  );
  get(x: number, y: number): Slot | null;
  getAdjacent(slot: Slot): Slot[];
  getFreeSlot(part: Part): Slot | null;
  height(): number;
  slots(): Slot[];
  width(): number;
}
export default Layout;
