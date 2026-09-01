import type { IdentityDeleter } from '../auth/identityDeleter.js';
import type { Database } from '../db/databaseTypes.js';
import { createCoffeeBagParseRepository } from '../modules/ai/coffeeBagParse/coffeeBagParseRepository.js';
import {
  createCoffeeBagParseService,
  type CoffeeBagParseService,
} from '../modules/ai/coffeeBagParse/coffeeBagParseService.js';
import { createBrewContextResolver } from '../modules/ai/brewContext/brewContextResolver.js';
import {
  createCoffeeEvaluationService,
  type CoffeeEvaluationService,
} from '../modules/ai/coffeeEvaluation/coffeeEvaluationService.js';
import {
  createCoffeeTasteEstimateService,
  type CoffeeTasteEstimateService,
} from '../modules/ai/coffeeTasteEstimate/coffeeTasteEstimateService.js';
import { createCoffeeTasteReadingRepository } from '../modules/ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';
import {
  createRecipeCoachService,
  type RecipeCoachService,
} from '../modules/ai/recipeCoach/recipeCoachService.js';
import {
  createRecipeGenerationService,
  type RecipeGenerationService,
} from '../modules/ai/recipeEngine/recipeGenerationService.js';
import {
  createEspressoDialInService,
  type EspressoDialInService,
} from '../modules/ai/espressoDialIn/espressoDialInService.js';
import {
  createRecipeConversionService,
  type RecipeConversionService,
} from '../modules/ai/recipeImport/recipeConversionService.js';
import {
  createProfileTuningService,
  type ProfileTuningService,
} from '../modules/ai/profileTuning/profileTuningService.js';
import {
  createRecipeParseService,
  type RecipeParseService,
} from '../modules/ai/recipeImport/recipeParseService.js';
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
import { createHistoryRepository } from '../modules/history/historyRepository.js';
import { createHistoryService, type HistoryService } from '../modules/history/historyService.js';
import { createInsightsRepository } from '../modules/insights/insightsRepository.js';
import {
  createInsightsService,
  type InsightsService,
} from '../modules/insights/insightsService.js';
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
import { createAnalyticsRepository } from '../modules/analytics/analyticsRepository.js';
import {
  createAnalyticsService,
  type AnalyticsService,
} from '../modules/analytics/analyticsService.js';
import { createAccountExportRepository } from '../modules/users/accountExportRepository.js';
import {
  createAccountExportService,
  type AccountExportService,
} from '../modules/users/accountExportService.js';
import { createUserRepository } from '../modules/users/userRepository.js';
import { createUserService, type UserService } from '../modules/users/userService.js';

import type { AiDependencies } from './aiDependencies.js';

/** Everything the HTTP layer delegates to. */
export interface AppServices {
  readonly userService: UserService;
  readonly accountExportService: AccountExportService;
  readonly analyticsService: AnalyticsService;
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
  readonly historyService: HistoryService;
  readonly insightsService: InsightsService;
  readonly aiUsageService: AiUsageService;
  /** Null wherever no model provider is configured; the AI routes then 503. */
  readonly coffeeBagParseService: CoffeeBagParseService | null;
  readonly coffeeEvaluationService: CoffeeEvaluationService | null;
  readonly coffeeTasteEstimateService: CoffeeTasteEstimateService | null;
  readonly recipeGenerationService: RecipeGenerationService | null;
  readonly recipeCoachService: RecipeCoachService | null;
  readonly recipeParseService: RecipeParseService | null;
  readonly recipeConversionService: RecipeConversionService | null;
  readonly espressoDialInService: EspressoDialInService | null;
  readonly profileTuningService: ProfileTuningService | null;
}

export interface ServiceDependencies {
  readonly db: Database;
  readonly identityDeleter: IdentityDeleter;
  readonly ai: AiDependencies | null;
}

/**
 * Builds the repository and service graph over one database handle.
 *
 * Repositories are handed to the services that need them rather than reached
 * for globally, which is what lets a test swap the database branch and the
 * identity provider without the modules knowing.
 */
export const createServices = ({ db, identityDeleter, ai }: ServiceDependencies): AppServices => {
  const equipmentRepository = createEquipmentRepository(db);
  const equipmentSetRepository = createEquipmentSetRepository(db);
  const coffeeBagRepository = createCoffeeBagRepository(db);
  const recipeRepository = createRecipeRepository(db);
  const brewLogRepository = createBrewLogRepository(db);

  const bagEvaluationRepository = createBagEvaluationRepository(db);
  const grinderRepository = createGrinderRepository(db);
  const aiUsageService = createAiUsageService(createAiUsageRepository(db));

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

  const bagEvaluationService = createBagEvaluationService(
    bagEvaluationRepository,
    coffeeBagRepository,
    tasteProfileService,
  );

  const recipeChatService = createRecipeChatService(createRecipeChatRepository(db), recipeService);

  /**
   * One reader of the kitchen, shared by both features that write about a
   * brew. Two copies of "which brewer, which kettle, which grinder" would be
   * two answers to the same question, and the recipe and the advice about it
   * would eventually disagree about what is on the counter.
   */
  const brewContextResolver = createBrewContextResolver({
    coffeeBagRepository,
    equipmentRepository,
    equipmentSetRepository,
    grinderRepository,
    tasteProfileService,
  });

  /**
   * Hoisted rather than built inline, because the dial-in writes through it.
   * A shot is an ordinary brew log and has to be priced by the same rules as
   * one - a second path into that table would be a second answer to how much
   * a cup teaches the profile.
   */
  const brewLogService = createBrewLogService({
    repository: brewLogRepository,
    recipeService,
    equipmentSetRepository,
    userService,
  });

  /**
   * The one auxiliary model call in the product, and the only reason the
   * insights need a provider at all. Built here rather than inside the
   * insights service so that a deployment without a key produces `null` in
   * exactly the same way every other AI service does.
   */
  const profileTuningService =
    ai === null
      ? null
      : createProfileTuningService({ completionClient: ai.completionClient, aiUsageService });

  return {
    profileTuningService,
    analyticsService: createAnalyticsService(createAnalyticsRepository(db)),
    accountExportService: createAccountExportService({
      repository: createAccountExportRepository(db),
      userService,
      tasteProfileService,
    }),
    historyService: createHistoryService({
      repository: createHistoryRepository(db),
      brewMethodService,
      coffeeBagRepository,
    }),
    insightsService: createInsightsService({
      repository: createInsightsRepository(db),
      tasteProfileService,
      aiUsageService,
      profileTuningService,
    }),
    userService,
    tasteProfileService,
    aiUsageService,
    bagEvaluationService,
    brewMethodService,
    recipeService,
    recipeChatService,
    grinderService: createGrinderService(grinderRepository),
    equipmentService: createEquipmentService(equipmentRepository, equipmentSetRepository),
    equipmentSetService: createEquipmentSetService(equipmentSetRepository, equipmentRepository),
    coffeeBagService: createCoffeeBagService(coffeeBagRepository),
    brewLogService,
    coffeeBagParseService:
      ai === null
        ? null
        : createCoffeeBagParseService({
            repository: createCoffeeBagParseRepository(db),
            imageFetcher: ai.imageFetcher,
            labelTextReader: ai.labelTextReader,
            completionClient: ai.completionClient,
            aiUsageService,
          }),
    coffeeEvaluationService:
      ai === null
        ? null
        : createCoffeeEvaluationService({
            completionClient: ai.completionClient,
            repository: bagEvaluationRepository,
            bagEvaluationService,
            tasteProfileService,
            tasteReadingRepository: createCoffeeTasteReadingRepository(db),
            aiUsageService,
          }),
    coffeeTasteEstimateService:
      ai === null
        ? null
        : createCoffeeTasteEstimateService({
            completionClient: ai.completionClient,
            repository: createCoffeeTasteReadingRepository(db),
            aiUsageService,
          }),
    recipeGenerationService:
      ai === null
        ? null
        : createRecipeGenerationService({
            completionClient: ai.completionClient,
            brewMethodService,
            brewContextResolver,
            recipeRepository,
            brewLogRepository,
            recipeService,
            aiUsageService,
          }),
    recipeParseService:
      ai === null
        ? null
        : createRecipeParseService({
            completionClient: ai.completionClient,
            imageFetcher: ai.imageFetcher,
            grinderRepository,
            aiUsageService,
          }),
    recipeConversionService:
      ai === null
        ? null
        : createRecipeConversionService({
            completionClient: ai.completionClient,
            brewMethodService,
            brewContextResolver,
            grinderRepository,
            recipeService,
            aiUsageService,
          }),
    recipeCoachService:
      ai === null
        ? null
        : createRecipeCoachService({
            completionClient: ai.completionClient,
            recipeService,
            recipeRepository,
            recipeChatService,
            brewLogRepository,
            brewMethodService,
            brewContextResolver,
            tasteProfileService,
            aiUsageService,
          }),
    espressoDialInService:
      ai === null
        ? null
        : createEspressoDialInService({
            completionClient: ai.completionClient,
            recipeService,
            recipeRepository,
            recipeChatService,
            brewLogService,
            brewLogRepository,
            brewMethodService,
            brewContextResolver,
            tasteProfileService,
            aiUsageService,
          }),
  };
};
