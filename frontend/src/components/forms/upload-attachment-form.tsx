import { ChangeEvent, useState } from "react";

import { Button } from "../ui/button";

type UploadAttachmentFormProps = {
  isLoading: boolean;
  onSubmit: (file: File) => Promise<void> | void;
};

export function UploadAttachmentForm({ isLoading, onSubmit }: UploadAttachmentFormProps) {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  async function handleSubmit() {
    if (!file) {
      return;
    }

    await onSubmit(file);
    setFile(null);
  }

  return (
    <div className="space-y-3">
      <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
        <span className="font-medium">Novo anexo</span>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <Button type="button" onClick={handleSubmit} disabled={!file || isLoading}>
        {isLoading ? "Enviando..." : "Enviar anexo"}
      </Button>
    </div>
  );
}

