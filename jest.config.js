module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.spec.js'],
    collectCoverageFrom: [
        'lib/**/*.js',
        '!**/node_modules/**',
    ],
    coverageReporters: ['lcov', 'text', 'text-lcov'],
    forceExit: true,
    detectOpenHandles: true,
};
