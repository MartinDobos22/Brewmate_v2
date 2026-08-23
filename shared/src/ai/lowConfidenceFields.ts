import { PARSED_CONFIDENCE_LOW_THRESHOLD } from './aiFieldLimits.js';
import type { ParsedField } from './parsedFieldSchema.js';
import {
  PARSED_BAG_FIELD_NAMES,
  type ParsedBagFieldName,
  type ParsedBagFields,
} from './parsedBagFieldsSchema.js';

/**
 * A field that was read, but not well enough to be trusted without a glance.
 *
 * A field with no value at all is not low confidence - it is simply absent,
 * and the form shows that as an empty box. Marking it would tell somebody to
 * check something that is not there.
 */
export const isLowConfidenceField = (field: ParsedField<unknown>): boolean =>
  field.value !== null && field.confidence < PARSED_CONFIDENCE_LOW_THRESHOLD;

/** Everything the form should ask the user to look at twice. */
export const lowConfidenceFieldNames = (fields: ParsedBagFields): readonly ParsedBagFieldName[] =>
  PARSED_BAG_FIELD_NAMES.filter((name: ParsedBagFieldName): boolean =>
    isLowConfidenceField(fields[name]),
  );
