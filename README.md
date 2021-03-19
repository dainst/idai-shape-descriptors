# idai-shape-descriptors
JS implementation of image processing and shape descriptor functionalities used in iDAI.shapes. Currently the following descriptors are available:
1. Normalized Fourier Descriptors 

## Code documentation 
You can find the code documentation [here](https://dainst.github.io/idai-shape-descriptors/)

## Getting started
Clone this repository and run
```
npm install
npm run build
```
Please use [TensorFlow.JS](https://js.tensorflow.org/api/latest/) for the implementation of mathamical code.
## Testing
Please write sufficiently many tests for your code. Tests are located in [test](./tests) directory. 
Run tests with
```
npm test
```

## Github Actions
The code is tested on each push using [Github Actions](https://github.com/features/actions). The config can be found in [.github/workflows](.github/workflows/steps.yml)

## Create Docs
Docs are generated with [typedoc](https://typedoc.org/). You can update the docs with the following command.
```
npm run doc
```
