import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js", "**/*.test.js"],
    languageOptions: { sourceType: "commonjs" }
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      "max-len": ["warn", { "code": 90 }]
    }
  }
];