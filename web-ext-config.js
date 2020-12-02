module.exports = {
  build: {
    overwriteDest: true,
  },
  run: {
    startUrl: [
      `about:debugging#/runtime/this-firefox`,
      'about:devtools-toolbox?type=extension&id=info%40gdonkey.com',
      'about:performance',
    ]
  },
  artifactsDir: "dist",  
  sourceDir: 'dist',  
};
