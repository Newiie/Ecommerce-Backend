module.exports = {
    preset: 'ts-jest',  // Use 'ts-jest' preset for handling TypeScript
    testEnvironment: 'node',  // Set the test environment to 'node'
    moduleFileExtensions: ['ts', 'js'],  // Look for both .ts and .js files
    testMatch: ['**/tests/**/*.test.(ts|js)'],  // Match test files in the tests directory
    transform: {
      '^.+\\.tsx?$': 'ts-jest',  // Use ts-jest for transforming .ts and .tsx files
    },
    // Exclude 'dist' directory from testing
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],  // Ignore the dist and node_modules directories
  };
  