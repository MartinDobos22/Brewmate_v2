import { z } from 'zod';

/**
 * As much of Google's annotation response as this application reads.
 *
 * Validated rather than trusted, for the same reason a model's answer is: this
 * arrives over the network from something nobody here controls, and a shape
 * that changed underneath us should be a reading that could not be had - which
 * sends the photograph to the model unaccompanied - rather than an exception
 * halfway through a scan somebody is standing in a shop doing.
 *
 * Everything below the top level is optional because Google genuinely omits
 * it: a photograph of a wall comes back with no text annotation at all, which
 * is not an error and is in fact the answer to the question being asked.
 */
const vertexConfidenceSchema = z.object({ confidence: z.number().optional() });

const paragraphSchema = z.object({
  words: z.array(vertexConfidenceSchema).optional(),
});

const blockSchema = z.object({
  paragraphs: z.array(paragraphSchema).optional(),
});

const pageSchema = z.object({
  blocks: z.array(blockSchema).optional(),
});

const colorSchema = z.object({
  color: z
    .object({
      red: z.number().optional(),
      green: z.number().optional(),
      blue: z.number().optional(),
    })
    .optional(),
  pixelFraction: z.number().optional(),
});

export const visionAnnotateResponseSchema = z.object({
  responses: z
    .array(
      z.object({
        fullTextAnnotation: z
          .object({ text: z.string(), pages: z.array(pageSchema).optional() })
          .optional(),
        imagePropertiesAnnotation: z
          .object({
            dominantColors: z.object({ colors: z.array(colorSchema).optional() }).optional(),
          })
          .optional(),
        error: z.object({ message: z.string().optional() }).optional(),
      }),
    )
    .min(1),
});

export type VisionAnnotateResponse = z.infer<typeof visionAnnotateResponseSchema>;
export type VisionAnnotation = VisionAnnotateResponse['responses'][number];
