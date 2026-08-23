import Anthropic from '@anthropic-ai/sdk';

import type { AiConfig } from '../config/aiConfig.js';

import type { AiCompletion, AiCompletionRequest } from './aiCompletion.js';
import { AI_MODEL_ID } from './constants/aiModels.js';
import { AI_ERROR_MESSAGES } from './aiErrorMessages.js';
import type { TextCompletionClient } from './textCompletionClient.js';

const TEXT_BLOCK_TYPE = 'text';
const USER_ROLE = 'user';
const IMAGE_BLOCK_TYPE = 'image';
const BASE64_SOURCE_TYPE = 'base64';
const REFUSAL_STOP_REASON = 'refusal';
const NO_TEXT = '';

const isTextBlock = (block: Anthropic.ContentBlock): block is Anthropic.TextBlock =>
  block.type === TEXT_BLOCK_TYPE;

/** Everything the model said, in the order it said it. */
const readText = (content: readonly Anthropic.ContentBlock[]): string =>
  content
    .filter(isTextBlock)
    .map((block: Anthropic.TextBlock): string => block.text)
    .join(NO_TEXT);

const toContent = ({ prompt, image }: AiCompletionRequest): Anthropic.ContentBlockParam[] =>
  image === undefined
    ? [{ type: TEXT_BLOCK_TYPE, text: prompt }]
    : [
        {
          type: IMAGE_BLOCK_TYPE,
          source: {
            type: BASE64_SOURCE_TYPE,
            media_type: image.mediaType,
            data: image.base64Data,
          },
        },
        { type: TEXT_BLOCK_TYPE, text: prompt },
      ];

/**
 * The real provider.
 *
 * The picture goes before the question deliberately: a model reads an image
 * far better when it has been handed the thing before being told what to look
 * for.
 *
 * A refusal comes back as a successful response with nothing usable in it, so
 * it is turned into a failure here rather than being handed upward as an empty
 * answer that would then fail schema validation for the wrong reason.
 */
export const createAnthropicTextCompletionClient = (config: AiConfig): TextCompletionClient => {
  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  return {
    complete: async (request: AiCompletionRequest): Promise<AiCompletion> => {
      const response = await client.messages.create({
        model: AI_MODEL_ID,
        max_tokens: request.maxTokens,
        system: request.system,
        output_config: { effort: request.effort },
        messages: [{ role: USER_ROLE, content: toContent(request) }],
      });

      if (response.stop_reason === REFUSAL_STOP_REASON) {
        throw new Error(AI_ERROR_MESSAGES.providerRefused);
      }

      return {
        text: readText(response.content),
        model: response.model,
        tokensIn: response.usage.input_tokens,
        tokensOut: response.usage.output_tokens,
      };
    },
  };
};
