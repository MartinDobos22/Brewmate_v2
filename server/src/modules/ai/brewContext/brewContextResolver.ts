import {
  EQUIPMENT_TYPES,
  readBrewerParams,
  type BrewMethod,
  type CoffeeBag,
  type Equipment,
  type EquipmentSet,
  type Grinder,
  type TasteProfile,
} from '@brewmate/shared';

import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { notFoundError } from '../../../errors/notFoundError.js';
import { toCoffeeBag } from '../../coffeeBags/coffeeBagMapper.js';
import type { CoffeeBagRepository } from '../../coffeeBags/coffeeBagRepository.js';
import { toEquipment } from '../../equipment/equipmentMapper.js';
import type { EquipmentRepository } from '../../equipment/equipmentRepository.js';
import { toEquipmentSet } from '../../equipmentSets/equipmentSetMapper.js';
import type { EquipmentSetRepository } from '../../equipmentSets/equipmentSetRepository.js';
import { toGrinder } from '../../grinders/grinderMapper.js';
import type { GrinderRepository } from '../../grinders/grinderRepository.js';
import type { TasteProfileService } from '../../tasteProfiles/tasteProfileService.js';

const EVERYTHING_OWNED = 20000;
const FIRST_PAGE = 0;
const ACTIVE_ONLY = true;

export interface BrewContextDependencies {
  readonly coffeeBagRepository: CoffeeBagRepository;
  readonly equipmentRepository: EquipmentRepository;
  readonly equipmentSetRepository: EquipmentSetRepository;
  readonly grinderRepository: GrinderRepository;
  readonly tasteProfileService: TasteProfileService;
}

export interface BrewContextRequest {
  readonly userId: string;
  readonly method: BrewMethod;
  readonly bagId: string | null;
  readonly equipmentSetId: string | null;
  /**
   * The gear a recipe was written for, where one already exists.
   *
   * A conversation about a cup that has been drunk has to describe the brewer
   * it was made in, not whatever is in the cupboard tonight - somebody who
   * has since bought a scale did not have one when they made that cup.
   */
  readonly equipmentIds?: readonly string[];
}

/** Everything a model is told about the kitchen a brew happens in. */
export interface BrewContext {
  readonly bag: CoffeeBag | null;
  readonly set: EquipmentSet | null;
  readonly equipment: readonly Equipment[];
  /** The catalogue entry behind their grinder, where there is one. */
  readonly grinder: Grinder | null;
  readonly profile: TasteProfile;
}

export interface BrewContextResolver {
  resolve(request: BrewContextRequest): Promise<BrewContext>;
}

/**
 * Reads the kitchen off the caller's own rows.
 *
 * Both AI features that write about a brew need the same picture of it, and
 * neither is allowed to take that picture from the client: gear a client could
 * declare is gear anybody could declare, and the one thing that makes a recipe
 * worth following is that it was written for what is actually on the counter.
 *
 * The gear is narrowed to what the method can be brewed with, so a set that
 * names four drippers does not hand the model three it will not use. A brewer
 * that points at a different method is dropped for the same reason the brew
 * screen never offers it.
 */
export const createBrewContextResolver = ({
  coffeeBagRepository,
  equipmentRepository,
  equipmentSetRepository,
  grinderRepository,
  tasteProfileService,
}: BrewContextDependencies): BrewContextResolver => {
  const readBag = async (userId: string, bagId: string | null): Promise<CoffeeBag | null> => {
    if (bagId === null) {
      return null;
    }

    const row = await coffeeBagRepository.findById(bagId, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
    }

    return toCoffeeBag(row);
  };

  const readSet = async (
    userId: string,
    equipmentSetId: string | null,
  ): Promise<EquipmentSet | null> => {
    if (equipmentSetId === null) {
      return null;
    }

    const row = await equipmentSetRepository.findById(equipmentSetId, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.equipmentSetNotFound);
    }

    return toEquipmentSet(row);
  };

  /**
   * Whatever the set names, or everything still owned when there is no set.
   *
   * A kitchen is not a warehouse, so reading all of it is one cheap query -
   * and it is the honest fallback: somebody who has never made a set still
   * owns a kettle, and pretending otherwise would produce a recipe hedged
   * against gear that is sitting on the counter.
   */
  const readEquipment = async (
    userId: string,
    set: EquipmentSet | null,
    equipmentIds: readonly string[] | undefined,
  ): Promise<readonly Equipment[]> => {
    const named = equipmentIds ?? set?.equipmentIds;
    const rows =
      named === undefined
        ? await equipmentRepository.list({
            userId,
            limit: EVERYTHING_OWNED,
            offset: FIRST_PAGE,
            activeOnly: ACTIVE_ONLY,
          })
        : await equipmentRepository.findOwnedByIds(named, userId);

    return rows.map(toEquipment);
  };

  /** A brewer for a different method is not gear for this brew. */
  const forThisMethod = (item: Equipment, method: BrewMethod): boolean =>
    item.type !== EQUIPMENT_TYPES.brewer || readBrewerParams(item.params).methodId === method.id;

  const readGrinder = async (
    userId: string,
    equipment: readonly Equipment[],
  ): Promise<Grinder | null> => {
    const catalogId = equipment.find(
      (item: Equipment): boolean =>
        item.type === EQUIPMENT_TYPES.grinder && item.catalogGrinderId !== null,
    )?.catalogGrinderId;

    if (catalogId === undefined || catalogId === null) {
      return null;
    }

    const row = await grinderRepository.findVisible(catalogId, userId);

    return row === null ? null : toGrinder(row);
  };

  return {
    resolve: async ({
      userId,
      method,
      bagId,
      equipmentSetId,
      equipmentIds,
    }): Promise<BrewContext> => {
      const [bag, set, profile] = await Promise.all([
        readBag(userId, bagId),
        readSet(userId, equipmentSetId),
        tasteProfileService.get(userId),
      ]);
      const owned = await readEquipment(userId, set, equipmentIds);
      const equipment = owned.filter((item: Equipment): boolean => forThisMethod(item, method));

      return { bag, set, equipment, grinder: await readGrinder(userId, equipment), profile };
    },
  };
};
