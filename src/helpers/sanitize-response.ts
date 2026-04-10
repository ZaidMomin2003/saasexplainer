export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Strip markdown code fences from a string.
 * Handles ```tsx, ```ts, ```jsx, ```js and plain ``` fences.
 */
export function stripMarkdownFences(code: string): string {
  let result = code;
  result = result.replace(/^```(?:tsx?|jsx?)?\n?/, "");
  result = result.replace(/\n?```\s*$/, "");
  return result.trim();
}

/**
 * Lightweight validation to check if GPT response contains JSX content.
 * This is a fallback check after the LLM pre-validation.
 */
export function validateGptResponse(response: string): ValidationResult {
  const trimmed = response.trim();

  // Check for JSX-like content (at least one opening tag)
  // Matches: <ComponentName, <div, <span, etc.
  const hasJsx = /<[A-Z][a-zA-Z]*|<[a-z]+[^>]*>/.test(trimmed);
  if (!hasJsx) {
    return {
      isValid: false,
      error:
        "The response was not a valid motion graphics component. Please try a different prompt.",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Extract only the component code, removing any trailing text/commentary.
 * Uses a context-aware brace scanner that ignores braces in strings and comments.
 */
export function extractComponentCode(code: string): string {
  // Find the component declaration start
  // Pattern: export const [Name] = () => {
  const exportMatch = code.match(
    /export\s+const\s+\w+(?::\s*[^{=]+)?\s*=\s*(?:\([^{]*\)|[^{=]+)\s*=>\s*\{/,
  );

  if (!exportMatch || exportMatch.index === undefined) {
    return code; // Fallback: return as-is
  }

  const declarationStart = exportMatch.index;
  const bodyStart = declarationStart + exportMatch[0].length;

  let braceCount = 1;
  let i = bodyStart;
  
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;

  while (i < code.length && braceCount > 0) {
    const char = code[i];
    const nextChar = code[i + 1];
    const prevChar = code[i - 1];

    // Handle Comments
    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (inSingleLineComment) {
        if (char === "\n") inSingleLineComment = false;
      } else if (inMultiLineComment) {
        if (char === "*" && nextChar === "/") {
          inMultiLineComment = false;
          i++; // Skip the /
        }
      } else {
        if (char === "/" && nextChar === "/") {
          inSingleLineComment = true;
          i++;
        } else if (char === "/" && nextChar === "*") {
          inMultiLineComment = true;
          i++;
        }
      }
    }

    // Handle Strings (if not in a comment)
    if (!inSingleLineComment && !inMultiLineComment) {
      if (char === "'" && prevChar !== "\\") {
        if (!inDoubleQuote && !inBacktick) inSingleQuote = !inSingleQuote;
      } else if (char === '"' && prevChar !== "\\") {
        if (!inSingleQuote && !inBacktick) inDoubleQuote = !inDoubleQuote;
      } else if (char === "`" && prevChar !== "\\") {
        if (!inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
      }
    }

    // Capture Braces (if not in string or comment)
    if (!inSingleQuote && !inDoubleQuote && !inBacktick && !inSingleLineComment && !inMultiLineComment) {
      if (char === "{") braceCount++;
      else if (char === "}") braceCount--;
    }

    if (braceCount === 0) break;
    i++;
  }

  // If we found a balanced component, slice it and append semicolon if needed
  if (braceCount === 0) {
    let result = code.slice(0, i + 1);
    const trimmedResult = result.trimEnd();
    if (!trimmedResult.endsWith(";") && !trimmedResult.endsWith("}")) {
      result = trimmedResult + ";";
    }
    return result.trim();
  }

  return code;
}
