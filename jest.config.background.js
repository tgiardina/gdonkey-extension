module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/src/background/**/*.test.ts",
    "<rootDir>/tests/background/**/*.test.ts",    
  ],
  setupFilesAfterEnv: [
    'dotenv/config',
    'jest-extended',        
    '<rootDir>/tests/background/setup.ts'
  ],  
  coveragePathIgnorePatterns: [
    'Error.ts',
  ],  
};