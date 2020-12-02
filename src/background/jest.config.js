module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    'dotenv/config',
    'jest-extended',        
    '<rootDir>/tests/setup.ts'
  ],  
  coveragePathIgnorePatterns: [
    'Error.ts',
  ],  
};