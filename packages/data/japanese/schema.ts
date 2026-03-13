import { z } from "zod";

const languageSchema = z.literal("ja");

/** Japanese root/stem: id, consonants (stem as character array), optional meaning and patternId. */
export const rootSchema = z.object({
  id: z.string(),
  consonants: z.array(z.string()).min(1),
  meaning: z.string().optional(),
  language: languageSchema,
  patternId: z.string().optional(),
});

export const patternSchema = z.object({
  id: z.string(),
  template: z.string(),
  meaning: z.string().optional(),
  language: languageSchema,
});

export const rootsArraySchema = z.array(rootSchema);
export const patternsArraySchema = z.array(patternSchema);

export type RootRecord = z.infer<typeof rootSchema>;
export type PatternRecord = z.infer<typeof patternSchema>;
