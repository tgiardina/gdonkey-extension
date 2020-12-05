module.exports = {
  build: {
    overwriteDest: true,
  },
  run: {
    startUrl: [
      `about:debugging#/runtime/this-firefox`,
      'about:devtools-toolbox?type=extension&id=info%40gdonkey.com',
      'about:performance',
      'https://addons.mozilla.org/en-US/firefox/addon/auto-reload-tab/',
      'https://addons.mozilla.org/en-US/firefox/addon/redirector/',
    ]
  },
  artifactsDir: "dist",  
  sourceDir: 'dist',  
};
