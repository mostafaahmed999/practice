export function extractAuthError(err: any): string {
  if (!err || !err.error) return "An error occurred";

  const errorBody = err.error;

  // String response
  if (typeof errorBody === 'string') return errorBody;

  // Identity array errors
  if (Array.isArray(errorBody)) {
    return errorBody.map((e: any) => e.description).join(" | ");
  }

  // Standard message object
  if (errorBody?.message) return errorBody.message;

  try {
    return JSON.stringify(errorBody);
  } catch {
    return "Unknown error";
  }
}
