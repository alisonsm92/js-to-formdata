module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'lib/**/*.js',
        '!**/node_modules/**',
    ],
    coverageReporters: ['lcov', 'text', 'text-lcov'],
};
