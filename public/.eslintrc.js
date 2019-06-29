// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6
  },
  env: {
    browser: true,
    jasmine: true,
    jquery: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  //extends: 'standard',
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 0,
    'spaced-comment': ['error', 'always', 
      { 'exceptions': [
        'removeIf(production)', 
        'endRemoveIf(production)', 
        '!steal-remove-start', 
        '!steal-remove-end'
      ] }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-undef': 'error'
  },
  'globals': {
      'System': true,
      'testit': true,
      'testOnly': true,
      'Stache': true,
      'steal': true,
      'rmain_container': true,
      'FuseBox': true,
      'process': true,
      '__karma__': true,
      'define': true,
      'spyOnEvent': true,
      'Promise': true,
      'require': true,
      'module': true
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                           // default to latest and warns if missing
                           // It will default to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"}
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"}
    ]
  }
}
