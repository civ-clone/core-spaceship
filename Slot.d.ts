import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import Part from './Part';
export interface ISlot extends IDataObject {
  accepts(part: Part): boolean;
  empty(): boolean;
  fill(part: Part): void;
  height(): number;
  part(): Part | null;
  width(): number;
  x(): number;
  y(): number;
}
export declare class Slot extends DataObject implements ISlot {
  private _accepts;
  private _height;
  private _part;
  private _width;
  private _x;
  private _y;
  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    accepts: (typeof Part)[]
  );
  accepts(part: Part): boolean;
  empty(): boolean;
  fill(part: Part): void;
  height(): number;
  part(): Part | null;
  width(): number;
  x(): number;
  y(): number;
}
export default Slot;
