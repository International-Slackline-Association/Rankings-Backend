
module.exports = {
    verbose: true,
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    moduleDirectories: ["node_modules", "src"],
    setupTestFrameworkScriptFile: "./test/test-setup.ts",
    // rootDir: "src",
    testRegex: ".spec.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
};
