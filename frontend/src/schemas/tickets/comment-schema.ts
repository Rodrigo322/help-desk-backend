import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "Informe o comentário.")
});

export type CommentFormData = z.infer<typeof commentSchema>;

