import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js and TypeScript rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Define custom ESLint rules
  {
    rules: {
      "no-console": "warn", // Warn for console logs
      "no-unused-vars": "warn", // Warn for unused variables
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` type in TypeScript
    },
  },

  // Ignore specific files and directories
  {
    ignores: [
      "node_modules/", // Ignore dependencies
      ".next/", // Ignore Next.js build files
      "app/[...slug]/page.tsx", // Ignore this file specifically
    ],
  },
];

export default eslintConfig;
