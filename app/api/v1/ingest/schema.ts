import { z } from "zod";
import { isValidMetadata } from "@/services/metadata";

const MetadataSchema = z.record(z.string(), z.unknown()).refine(isValidMetadata, {
  message:
    "Metadata keys can't be more than 40 characters or include '[' or ']'. Metadata values must be serializable and can't be more than 500 characters. The total number of keys can't be more than 50.",
});

export const IngestUpdateRequestData = z
  .object({
    clientId: z.string(),
    clientUrl: z.string().url().optional(),
    name: z.string(),
    entity: z.string(),
    content: z.union([
      z.string(),
      z.object({
        text: z.string(),
        imageUrls: z.array(z.string().url()).optional(),
        externalUrls: z.array(z.string().url()).optional(),
      }),
    ]),
    metadata: MetadataSchema.optional(),
    user: z
      .object({
        clientId: z.string(),
        clientUrl: z.string().url().optional(),
        stripeAccountId: z.string().optional(),
        email: z.string().optional(),
        name: z.string().optional(),
        username: z.string().optional(),
        protected: z.boolean().optional(),
        metadata: MetadataSchema.optional(),
      })
      .optional(),
  })
  .strict();

export type IngestUpdateRequestData = z.infer<typeof IngestUpdateRequestData>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const ingestUpdateAdapter = (data: unknown) => {
  if (!isRecord(data)) {
    return data;
  }
  const { text, fileUrls, ...rest } = data;
  return { content: { text, imageUrls: fileUrls }, ...rest };
};

export const IngestDeleteRequestData = z
  .object({
    clientId: z.string(),
  })
  .strict();

export type IngestDeleteRequestData = z.infer<typeof IngestDeleteRequestData>;
