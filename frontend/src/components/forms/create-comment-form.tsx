import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { commentSchema, CommentFormData } from "../../schemas/tickets/comment-schema";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type CreateCommentFormProps = {
  isLoading: boolean;
  onSubmit: (data: CommentFormData) => Promise<void> | void;
};

export function CreateCommentForm({ isLoading, onSubmit }: CreateCommentFormProps) {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ""
    }
  });

  async function handleSubmit(data: CommentFormData) {
    await onSubmit(data);
    form.reset({ content: "" });
  }

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
      <Textarea
        label="Novo comentário"
        rows={4}
        error={form.formState.errors.content?.message}
        {...form.register("content")}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Comentar"}
      </Button>
    </form>
  );
}

