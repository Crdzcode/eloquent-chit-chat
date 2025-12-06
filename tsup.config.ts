import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,               // gera .d.ts
  sourcemap: true,
  clean: true,             // limpa dist a cada build
  external: ['react', 'react-dom'], // não bundle react
  minify: false,
  target: 'es2019'
});