[![Build Status](https://travis-ci.org/Err0r500/json-contract-tests-generator.svg?branch=master)](https://travis-ci.org/Err0r500/json-contract-tests-generator)
[![codecov](https://codecov.io/gh/Err0r500/json-contract-tests-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/Err0r500/json-contract-tests-generator)
[![BCH compliance](https://bettercodehub.com/edge/badge/Err0r500/json-contract-tests-generator?branch=master)](https://bettercodehub.com/)


Usage : 
```
node . -i={{path-to-json-schema}}
```

will output the dataset testing edge cases, like :

### JSON Schema :
```
{
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "title",
    "description": "verySimple json schema",
    "type": "object",
    "properties": {
        "id": {
            "description": "The unique identifier for a product",
            "type": "integer",
            "minimum": 12,
            "multipleOf": 5
        }
    }
}
```

### Produces the Test set :
```
{
  "valid": [
    {
      "id": 15
    },
    {
      "id": 9007199254740990
    }
  ],
  "invalid": [
    {
      "id": 10
    },
    {
      "id": 16
    }
  ]
}

```