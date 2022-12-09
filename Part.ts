import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import { IDataObject } from '@civ-clone/core-data-object/DataObject';
import PartYield from './Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';

export interface IPart extends IDataObject {
  city(): City;
  yields(): Yield[];
}

export class Part extends Buildable implements IPart {
  #city: City;
  #ruleRegistry: RuleRegistry;

  constructor(city: City, ruleRegistry: RuleRegistry = ruleRegistryInstance) {
    super();

    this.#city = city;
    this.#ruleRegistry = ruleRegistry;

    this.addKey('city', 'yields');
  }

  public static build(
    city: City,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ): Part {
    return new this(city, ruleRegistry);
  }

  city(): City {
    return this.#city;
  }

  yields(): Yield[] {
    return this.#ruleRegistry.process(PartYield, this).flat();
  }
}

export default Part;
