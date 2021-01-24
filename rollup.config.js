//import { terser } from "rollup-plugin-terser";
function terser() {}

export default [
    {
        input: "src/crs-router.js",
        output: [
            {file: 'dist/crs-router.js', format: 'es'}
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
    },
    {
        input: "src/crs-loader.js",
        output: [
            {file: 'dist/crs-loader.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    }
];