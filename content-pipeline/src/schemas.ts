// Re-export shared schemas from the app
// This keeps validation logic in one place
//
// The main app has no "type": "module" in its package.json, so Node treats
// lib/schemas.ts as CJS when resolved from this ESM package. CJS modules
// only expose a default export to static ESM imports, so we import the
// default namespace and destructure + re-export the named bindings.
import _schemas from "../../lib/schemas.js";

export const {
  TOPICS,
  CARD_TYPES,
  DIFFICULTIES,
  SOURCES,
  QuickFactContent,
  SummaryContent,
  MiniThreadContent,
  KeyInsightContent,
  DidYouKnowContent,
  CardContentByType,
  CardSchema,
  validateCardContent,
} = _schemas;
