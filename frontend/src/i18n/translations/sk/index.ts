import { SK_AI_COSTS } from './aiCosts';
import { SK_AUTH } from './auth';
import { SK_BREWING } from './brewing';
import { SK_CUPBOARD_AND_BREW } from './cupboardAndBrew';
import { SK_BREW_MODE } from './brewMode';
import { SK_CALIBRATION } from './calibration';
import { SK_COMMON } from './common';
import { SK_DESIGN_SYSTEM } from './designSystem';
import { SK_DIAL_IN } from './dialIn';
import { SK_EQUIPMENT_SETUP } from './equipmentSetup';
import { SK_ERRORS } from './errors';
import { SK_GRINDERS } from './grinders';
import { SK_HISTORY } from './history';
import { SK_HOME } from './home';
import { SK_HOME_TILES } from './homeTiles';
import { SK_INVENTORY } from './inventory';
import { SK_NAVIGATION } from './navigation';
import { SK_ONBOARDING } from './onboarding';
import { SK_PRE_BREW } from './preBrew';
import { SK_PROFILE_SECTIONS } from './profileSections';
import { SK_RECIPE_CHAT } from './recipeChat';
import { SK_RECIPE_IMPORT } from './recipeImport';
import { SK_SCANNER } from './scanner';
import { SK_SCREENS } from './screens';
import { SK_TASTE_AXIS_BANDS } from './tasteAxisBands';
import { SK_TASTE_PROFILE } from './tasteProfile';
import { SK_TASTE_QUESTIONS_BEGINNER } from './tasteQuestionsBeginner';
import { SK_TASTE_QUESTIONS_DIRECT } from './tasteQuestionsDirect';
import { SK_TASTE_QUESTIONS_EXPERT } from './tasteQuestionsExpert';
import { SK_TASTE_QUESTIONS_INDIRECT } from './tasteQuestionsIndirect';
import { SK_TASTE_QUESTIONS_LEVELS } from './tasteQuestionsLevels';
import { SK_WATER_AND_SETS } from './waterAndSets';

/**
 * Slovak copy. This object is the source of truth for the key list: every
 * other locale is typed against it, so a missing translation is a type error.
 */
export const SK_TRANSLATIONS = {
  ...SK_COMMON,
  ...SK_AUTH,
  ...SK_NAVIGATION,
  ...SK_SCREENS,
  ...SK_GRINDERS,
  ...SK_ONBOARDING,
  ...SK_TASTE_QUESTIONS_LEVELS,
  ...SK_TASTE_QUESTIONS_DIRECT,
  ...SK_TASTE_QUESTIONS_INDIRECT,
  ...SK_TASTE_QUESTIONS_BEGINNER,
  ...SK_TASTE_QUESTIONS_EXPERT,
  ...SK_EQUIPMENT_SETUP,
  ...SK_WATER_AND_SETS,
  ...SK_CALIBRATION,
  ...SK_BREWING,
  ...SK_PRE_BREW,
  ...SK_CUPBOARD_AND_BREW,
  ...SK_BREW_MODE,
  ...SK_RECIPE_CHAT,
  ...SK_RECIPE_IMPORT,
  ...SK_DIAL_IN,
  ...SK_SCANNER,
  ...SK_HOME,
  ...SK_HOME_TILES,
  ...SK_INVENTORY,
  ...SK_TASTE_PROFILE,
  ...SK_TASTE_AXIS_BANDS,
  ...SK_PROFILE_SECTIONS,
  ...SK_HISTORY,
  ...SK_AI_COSTS,
  ...SK_ERRORS,
  ...SK_DESIGN_SYSTEM,
} as const;
