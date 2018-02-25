[![Build Status](https://travis-ci.org/Err0r500/json-contract-tests-generator.svg?branch=master)](https://travis-ci.org/Err0r500/json-contract-tests-generator)
[![codecov](https://codecov.io/gh/Err0r500/json-contract-tests-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/Err0r500/json-contract-tests-generator)
[![BCH compliance](https://bettercodehub.com/edge/badge/Err0r500/json-contract-tests-generator?branch=master)](https://bettercodehub.com/)


Usage : 
```
node main.js -i={{path-to-json-schema}}
```

will output the dataset testing edge cases, like :

```
{
  "valid": [
    {
      "id": -9007199254740991,
      "name": "string"
    },
    {
      "id": 9007199254740991,
      "name": "string"
    }
  ],
  "invalid": []
}
```