import { sanitizeCodeImports } from "./src/helpers/sanitize-imports";

const testCases = [
  {
    name: "Scenario A: Missing entire import",
    input: `export const MyComp = () => {
  return <div src={staticFile("logo.png")} />;
};`,
    expectedContains: ["import { staticFile } from 'remotion';", "staticFile(\"logo.png\")"]
  },
  {
    name: "Scenario B: Partial named import",
    input: `import { AbsoluteFill } from 'remotion';
export const MyComp = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>Hello</AbsoluteFill>;
};`,
    expectedContains: ["import { AbsoluteFill, useCurrentFrame } from 'remotion'"]
  },
  {
    name: "Scenario C: No remotion usage",
    input: `export const Simple = () => <div>Pure HTML</div>;`,
    expectedContains: ["export const Simple"]
  }
];

console.log("--- Antigravity Safety Net Test Runner ---\n");

testCases.forEach(tc => {
  const result = sanitizeCodeImports(tc.input);
  const success = tc.expectedContains.every(term => result.includes(term));
  
  console.log(`TEST: ${tc.name}`);
  if (success) {
    console.log("✅ PASSED");
  } else {
    console.log("❌ FAILED");
    console.log("Result was:", result);
  }
  console.log("");
});
