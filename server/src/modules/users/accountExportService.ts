import { ACCOUNT_EXPORT_FORMAT_VERSION, type AccountExport } from '@brewmate/shared';

import { toStoredAnalyticsEvent } from '../analytics/analyticsMapper.js';
import { toAiUsageLog } from '../aiUsage/aiUsageMapper.js';
import { toBagEvaluation } from '../bagEvaluations/bagEvaluationMapper.js';
import { toBrewLog } from '../brewLogs/brewLogMapper.js';
import { toCoffeeBag } from '../coffeeBags/coffeeBagMapper.js';
import { toEquipment } from '../equipment/equipmentMapper.js';
import { toEquipmentSet } from '../equipmentSets/equipmentSetMapper.js';
import { toRecipeChatMessage } from '../recipeChat/recipeChatMessageMapper.js';
import { toRecipe } from '../recipes/recipeMapper.js';
import { toTasteProfileEvent } from '../tasteProfiles/tasteProfileMapper.js';
import type { TasteProfileService } from '../tasteProfiles/tasteProfileService.js';

import type { AccountExportRepository } from './accountExportRepository.js';
import { toStoredTasteSuggestion } from './toStoredTasteSuggestion.js';
import type { UserService } from './userService.js';

export interface AccountExportDependencies {
  readonly repository: AccountExportRepository;
  readonly userService: UserService;
  readonly tasteProfileService: TasteProfileService;
}

export interface AccountExportService {
  export(userId: string): Promise<AccountExport>;
}

/**
 * Everything this account has stored, in one document.
 *
 * Article 20 asks for personal data in a structured, commonly used,
 * machine-readable form, so this is the same JSON the API already speaks -
 * every section is the contract's own schema, produced by the same mapper the
 * ordinary endpoint uses. Somebody who exports and then deletes has a file
 * that could be read back in, and nobody had to write a second description of
 * a coffee bag for it.
 *
 * The two rules worth stating. It is every user-owned table, including the
 * ones nobody thinks of as theirs - the model usage recorded against them and
 * the analytics their phone sent are rows with their id on them, so they are
 * personal data, so they are here. And it is exactly the tables that `DELETE
 * /me` erases: export and deletion answer the same question about what this
 * account *is*, and if the two lists ever disagreed one of them would be lying.
 */
export const createAccountExportService = ({
  repository,
  userService,
  tasteProfileService,
}: AccountExportDependencies): AccountExportService => ({
  export: async (userId): Promise<AccountExport> => {
    const [account, profile, rows] = await Promise.all([
      userService.getById(userId),
      tasteProfileService.get(userId),
      repository.readAll(userId),
    ]);

    return {
      formatVersion: ACCOUNT_EXPORT_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      account,
      tasteProfile: profile,
      tasteProfileEvents: rows.tasteProfileEvents.map(toTasteProfileEvent),
      equipment: rows.equipment.map(toEquipment),
      equipmentSets: rows.equipmentSets.map(toEquipmentSet),
      coffeeBags: rows.coffeeBags.map(toCoffeeBag),
      bagEvaluations: rows.bagEvaluations.map(toBagEvaluation),
      recipes: rows.recipes.map(toRecipe),
      recipeMessages: rows.recipeMessages.map(toRecipeChatMessage),
      brewLogs: rows.brewLogs.map(toBrewLog),
      tasteSuggestions: rows.tasteSuggestions.map(toStoredTasteSuggestion),
      aiUsage: rows.aiUsage.map(toAiUsageLog),
      analyticsEvents: rows.analyticsEvents.map(toStoredAnalyticsEvent),
    };
  },
});
