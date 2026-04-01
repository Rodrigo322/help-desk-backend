type FrontendEnvironment = {
  VITE_API_URL: string | null;
};

function normalizeEnvironmentValue(value: string | undefined): string | null {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : null;
}

export const frontendEnvironment: FrontendEnvironment = {
  VITE_API_URL: normalizeEnvironmentValue(import.meta.env.VITE_API_URL)
};

export function getFrontendEnvironmentErrors(): string[] {
  const errors: string[] = [];

  if (!frontendEnvironment.VITE_API_URL) {
    errors.push("VITE_API_URL is required. Configure it in the frontend environment variables.");
  }

  return errors;
}
