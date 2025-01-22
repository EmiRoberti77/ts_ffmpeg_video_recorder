import { z } from "zod";

export const recParamsSchema = z.object({
  url: z.string().describe("url to access the video stream"),
  outPut: z.string().describe("path to store output of recording"),
  durationInSec: z.number().describe("video block size for each recording"),
  audioOn: z.boolean().default(false).describe("boolean flag for audio"),
});

export type RecParams = z.infer<typeof recParamsSchema>;
