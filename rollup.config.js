import { terser } from "rollup-plugin-terser";

export default [
    {
        input: "src/index.js",
        output: [
            {file: 'dist/crs-router.esm.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    },
    {
        input: "src/crs-static-provider.js",
        output: [
            {file: 'dist/crs-static-provider.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    },
    {
        input: "src/crs-url-provider.js",
        output: [
            {file: 'dist/crs-url-provider.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    }
];