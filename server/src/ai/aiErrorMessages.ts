/**
 * Failures inside the AI layer, for the log and the `cause` chain.
 *
 * Never sent to a client: the sentences a user reads live in
 * `errors/errorMessages.ts` like every other client-facing message.
 */
export const AI_ERROR_MESSAGES = {
  providerRefused: 'The model declined to answer this request.',
  imageUnreachable: 'The uploaded photograph could not be downloaded.',
  imageTooLarge: 'The uploaded photograph is larger than the accepted maximum.',
  imageTypeUnsupported: 'The uploaded file is not an image format the model accepts.',
  answerMalformed: 'The model answered with something that is not the agreed shape.',
  labelReaderRefused: 'The optical reader would not annotate the photographed label.',
  labelReaderMalformed: 'The optical reader answered in a shape this application does not know.',
} as const;
