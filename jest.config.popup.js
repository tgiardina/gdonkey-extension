module.exports = {
  testMatch: [
    "<rootDir>/src/popup/**/*.test.js",
    "<rootDir>/tests/popup/**/*.test.js",    
  ],  
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
};
