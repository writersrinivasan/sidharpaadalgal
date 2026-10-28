export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (recommended)" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B" },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B (fast)" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (fastest)" },
] as const;

export const DEFAULT_MODEL: string = GROQ_MODELS[0].id;
