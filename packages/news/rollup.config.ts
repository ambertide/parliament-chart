import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

const options = {
  input: "src/main.ts",
  output: {
    file: "build/main.cjs",
    format: "cjs" as const
  },
  plugins: [typescript(), json()]
};
const config = defineConfig(options);

export default config;
