import type { IdentityDeleter } from '../auth/identityDeleter.js';
import type { Database } from '../db/databaseTypes.js';
import { createAiUsageRepository } from '../modules/aiUsage/aiUsageRepository.js';
import { createAiUsageService, type AiUsageService } from '../modules/aiUsage/aiUsageService.js';
import { createBagEvaluationRepository } from '../modules/bagEvaluations/bagEvaluationRepository.js';
import {
  createBagEvaluationService,
  type BagEvaluationService,
} from '../modules/bagEvaluations/bagEvaluationService.js';
import { createBrewLogRepository } from '../modules/brewLogs/brewLogRepository.js';
import { createBrewLogService, type BrewLogService } from '../modules/brewLogs/brewLogService.js';
import { createBrewMethodRepository } from '../modules/brewMethods/brewMethodRepository.js';
import {
  createBrewMethodService,
  type BrewMethodService,
} from '../modules/brewMethods/brewMethodService.js';
import { createCoffeeBagRepository } from '../modules/coffeeBags/coffeeBagRepository.js';
import {
  createCoffeeBagService,
  type CoffeeBagService,
} from '../modules/coffeeBags/coffeeBagService.js';
import { createEquipmentRepository } from '../modules/equipment/equipmentRepository.js';
import {
  createEquipmentService,
  type EquipmentService,
} from '../modules/equipment/equipmentService.js';
import { createEquipmentSetRepository } from '../modules/equipmentSets/equipmentSetRepository.js';
import {
  createEquipmentSetService,
  type EquipmentSetService,
} from '../modules/equipmentSets/equipmentSetService.js';
import { createGrinderRepository } from '../modules/grinders/grinderRepository.js';
import { createGrinderService, type GrinderService } from '../modules/grinders/grinderService.js';
import { createRecipeChatRepository } from '../modules/recipeChat/recipeChatRepository.js';
import {
  createRecipeChatService,
  type RecipeChatService,
} from '../modules/recipeChat/recipeChatService.js';
import { createRecipeRepository } from '../modules/recipes/recipeRepository.js';
import { createRecipeService, type RecipeService } from '../modules/recipes/recipeService.js';
import { createTasteProfileEventRepository } from '../modules/tasteProfiles/tasteProfileEventRepository.js';
import { createTasteProfileRepository } from '../modules/tasteProfiles/tasteProfileRepository.js';
import {
  createTasteProfileService,
  type TasteProfileService,
} from '../modules/tasteProfiles/tasteProfileService.js';
import { createUserRepository } from '../modules/users/userRepository.js';
import { createUserService, type UserService } from '../modules/users/userService.js';

/** Everything the HTTP layer delegates to. */
export interface AppServices {
  readonly userService: UserService;
  readonly tasteProfileService: TasteProfileService;
  readonly brewMethodService: BrewMethodService;
  readonly grinderService: GrinderService;
  readonly equipmentService: EquipmentService;
  readonly equipmentSetService: EquipmentSetService;
  readonly coffeeBagService: CoffeeBagService;
  readonly bagEvaluationService: BagEvaluationService;
  readonly recipeService: RecipeService;
  readonly recipeChatService: RecipeChatService;
  readonly brewLogService: BrewLogService;
  readonly aiUsageService: AiUsageService;
}

/**
 * Builds the repository and service graph over one database handle.
 *
 * Repositories are handed to the services that need them rather than reached
 * for globally, which is what lets a test swap the database branch and the
 * identity provider without the modules knowing.
 */
export const createServices = (db: Database, identityDeleter: IdentityDeleter): AppServices => {
  const equipmentRepository = createEquipmentRepository(db);
  const equipmentSetRepository = createEquipmentSetRepository(db);
  const coffeeBagRepository = createCoffeeBagRepository(db);
  const recipeRepository = createRecipeRepository(db);
  const brewLogRepository = createBrewLogRepository(db);

  const userService = createUserService(createUserRepository(db), identityDeleter);
  const brewMethodService = createBrewMethodService(createBrewMethodRepository(db));
  const tasteProfileService = createTasteProfileService(
    createTasteProfileRepository(db),
    createTasteProfileEventRepository(db),
  );

  const recipeService = createRecipeService({
    repository: recipeRepository,
    brewMethodService,
    coffeeBagRepository,
    equipmentRepository,
    brewLogRepository,
  });

  return {
    userService,
    tasteProfileService,
    brewMethodService,
    recipeService,
    grinderService: createGrinderService(createGrinderRepository(db)),
    equipmentService: createEquipmentService(equipmentRepository, equipmentSetRepository),
    equipmentSetService: createEquipmentSetService(equipmentSetRepository, equipmentRepository),
    coffeeBagService: createCoffeeBagService(coffeeBagRepository),
    bagEvaluationService: createBagEvaluationService(
      createBagEvaluationRepository(db),
      coffeeBagRepository,
      tasteProfileService,
    ),
    recipeChatService: createRecipeChatService(createRecipeChatRepository(db), recipeService),
    brewLogService: createBrewLogService({
      repository: brewLogRepository,
      recipeService,
      equipmentSetRepository,
      userService,
    }),
    aiUsageService: createAiUsageService(createAiUsageRepository(db)),
  };
};
