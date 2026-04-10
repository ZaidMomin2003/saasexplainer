/**
 * Antigravity Safety Net: Ensures that necessary Remotion imports are present in the generated code.
 * Acts as a defensive layer against AI 'ReferenceErrors' by automatically injecting missing named imports.
 */
export function sanitizeCodeImports(code: string): string {
  if (!code) return code;
  
  let sanitized = code;
  const remotionImports: string[] = [];

  // Check for the existence of the 'remotion' import block
  const remotionImportRegex = /import\s*\{([^}]*)\}\s*from\s*['"]remotion['"]/g;
  const match = remotionImportRegex.exec(sanitized);
  const existingImports = match ? match[1].split(',').map(s => s.trim()) : [];
  const hasRemotionImport = /from ['"]remotion['"]/.test(sanitized);

  // List of required functions and their usage patterns in code
  const requiredMappings = [
    { name: "staticFile", pattern: /staticFile\s*\(/ },
    { name: "AbsoluteFill", pattern: /AbsoluteFill/ },
    { name: "spring", pattern: /spring\s*\(/ },
    { name: "interpolate", pattern: /interpolate\s*\(/ },
    { name: "useCurrentFrame", pattern: /useCurrentFrame\s*\(/ },
    { name: "useVideoConfig", pattern: /useVideoConfig\s*\(/ },
    { name: "Sequence", pattern: /Sequence/ },
    { name: "Audio", pattern: /<Audio/ },
    { name: "Img", pattern: /<Img/ },
    { name: "Video", pattern: /<Video/ },
    { name: "Audio", pattern: /<Audio/ },
    { name: "Easing", pattern: /Easing/ },
    { name: "random", pattern: /random/ },
    { name: "continueRender", pattern: /continueRender/ },
    { name: "delayRender", pattern: /delayRender/ },
  ];

  // Identify which functions are used but not imported
  for (const item of requiredMappings) {
    const isUsed = item.pattern.test(sanitized);
    const isImported = existingImports.includes(item.name);
    
    if (isUsed && !isImported) {
      remotionImports.push(item.name);
    }
  }

  if (remotionImports.length === 0) return sanitized;

  if (!hasRemotionImport) {
    // 1. If no remotion import exists at all, prepend it
    const importStatement = `import { ${remotionImports.join(", ")} } from 'remotion';\n`;
    sanitized = importStatement + sanitized;
  } else {
    // 2. If 'remotion' is imported but some components are missing from the named import block
    // We replace the existing import block with an expanded one
    sanitized = sanitized.replace(remotionImportRegex, (match, p1) => {
      const allImports = Array.from(new Set([...existingImports, ...remotionImports])).filter(Boolean);
      return `import { ${allImports.join(", ")} } from 'remotion'`;
    });
  }

  // DE-STACKING SAFETY: If the AI "stacked" new code over old (common in follow-up edits),
  // we detect multiple export defaults and keep ONLY the last valid production block.
  // We identify this by checking for the last 'import' statement.
  if (sanitized.split("export default").length > 2) {
    console.log(`[Sanitizer] Detected stacked code. Finding the last production block...`);
    const lastImportIndex = sanitized.lastIndexOf("import");
    if (lastImportIndex !== -1) {
      // Keep everything from the LAST import block onward (this captures the most recent scene)
      sanitized = sanitized.substring(lastImportIndex);
    }
  }

  return sanitized;
}
