import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import { IDataObject } from '@civ-clone/core-data-object/DataObject';
import Yield from '@civ-clone/core-yield/Yield';
export interface IPart extends IDataObject {
  city(): City;
  yields(): Yield[];
}
export declare class Part extends Buildable implements IPart {
  #private;
  constructor(city: City, ruleRegistry?: RuleRegistry);
  static build(city: City, ruleRegistry?: RuleRegistry): Part;
  city(): City;
  yields(): Yield[];
}
export default Part;
