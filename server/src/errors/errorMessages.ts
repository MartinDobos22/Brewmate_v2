/** Client-facing error messages. Never inline a message at a throw site. */
export const ERROR_MESSAGES = {
  badRequest: 'The request could not be processed.',
  validationFailed: 'The request payload failed validation.',
  missingAuthorizationHeader: 'Authorization header is missing.',
  malformedAuthorizationHeader: 'Authorization header must use the Bearer scheme.',
  invalidIdToken: 'The Firebase ID token is invalid or has expired.',
  userNotFound: 'The authenticated user no longer exists.',
  routeNotFound: 'The requested route does not exist.',
  internalError: 'An unexpected error occurred.',
  databaseUnavailable: 'The database is not reachable.',
  responseContractViolation: 'The server produced a response that violates its own contract.',

  equipmentNotFound: 'No such equipment belongs to this account.',
  equipmentSetNotFound: 'No such equipment set belongs to this account.',
  unknownEquipmentInSet: 'An equipment set may only contain equipment this account owns.',
  coffeeBagNotFound: 'No such coffee bag belongs to this account.',
  remainingExceedsWeight: 'The remaining amount cannot be larger than the weight of the bag.',
  bagEvaluationNotFound: 'No such bag evaluation belongs to this account.',
  brewMethodNotFound: 'No such brewing method exists.',
  brewMethodInactive: 'That brewing method has been retired.',
  grinderNotFound: 'No such grinder is available to this account.',
  grinderRangeInvalid: 'A grinder cannot have a minimum setting above its maximum.',
  grinderAlreadyCatalogued: 'That grinder is already in the catalogue.',
  recipeNotFound: 'No such recipe belongs to this account.',
  recipeHasBrewLogs: 'A recipe that has already been brewed cannot be deleted.',
  parentRecipeNotFound: 'The recipe this one was adjusted from no longer exists.',
  brewLogNotFound: 'No such brew log belongs to this account.',
  brewLogBagMismatch: 'A brew log must reference the same bag as the recipe it belongs to.',

  aiUnavailable:
    'Reading coffee bags is not available right now. The label can still be typed in by hand.',
  bagPhotoUnreadable:
    'That photograph could not be read. Try another picture of the label, or type it in by hand.',
  bagLabelUnreadable:
    'Nothing could be read off that photograph. The label can still be typed in by hand.',
  coffeeVerdictUnavailable: 'The verdict could not be written right now. Try again in a moment.',
} as const;
