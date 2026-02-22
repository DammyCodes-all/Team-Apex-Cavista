export function normalizeRiskScore(score: number | undefined) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

export function normalizeWellnessScore(riskScore: number | undefined) {
  return 100 - normalizeRiskScore(riskScore);
}

function extractActionText(action: unknown): string | null {
  if (typeof action === "string") {
    const trimmed = action.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (action && typeof action === "object") {
    const obj = action as Record<string, unknown>;
    const candidates = [
      obj.title,
      obj.action,
      obj.label,
      obj.text,
      obj.description,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }
  }

  return null;
}

export function flattenRecommendedActions(input: unknown[] | undefined): string[] {
  if (!Array.isArray(input)) return [];

  const flattened: unknown[] = [];
  input.forEach((item) => {
    if (Array.isArray(item)) {
      item.forEach((nested) => flattened.push(nested));
    } else {
      flattened.push(item);
    }
  });

  const actions = flattened
    .map((item) => extractActionText(item))
    .filter((item): item is string => Boolean(item));

  return Array.from(new Set(actions));
}
