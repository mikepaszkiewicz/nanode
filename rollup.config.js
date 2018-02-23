import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json';

export default [
	{
		input: 'src/index.ts',
		output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
			{
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      }
    ],
    external: ['crypto', 'bignumber.js', 'axios'],
		plugins: [
      commonjs(),
      typescript(),
    ]
	}
];