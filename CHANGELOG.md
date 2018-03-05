# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="4.1.3"></a>
## [4.1.3](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v4.1.2...v4.1.3) (2018-03-05)



<a name="4.1.2"></a>
## [4.1.2](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v4.1.1...v4.1.2) (2018-03-05)



<a name="4.1.1"></a>
## [4.1.1](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v4.1.0...v4.1.1) (2018-03-02)


### Bug Fixes

* import RecordUtil twice fixed ([bc43695](https://github.com/catavolt-oss/cv-dialog-sdk/commit/bc43695))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v4.0.0...v4.1.0) (2018-03-01)


### Bug Fixes

* fix small TS bug ([79eb5ca](https://github.com/catavolt-oss/cv-dialog-sdk/commit/79eb5ca))


### Features

* implement read/write binary ([87cd62e](https://github.com/catavolt-oss/cv-dialog-sdk/commit/87cd62e))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v3.2.3...v4.0.0) (2018-02-23)


### Code Refactoring

* **modules:** moved all to single class modules (where possible) ([e8e6fae](https://github.com/catavolt-oss/cv-dialog-sdk/commit/e8e6fae))


### BREAKING CHANGES

* **modules:** PropFormatter is no longer a static class.  It should be imported as
propertyFormatter from the Catavolt module



<a name="3.2.3"></a>
## [3.2.3](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v3.2.2...v3.2.3) (2018-02-21)


### Bug Fixes

* **dialogservice:** removed url constant for dialog api target ([7de57d7](https://github.com/catavolt-oss/cv-dialog-sdk/commit/7de57d7))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/catavolt-oss/cv-dialog-sdk/compare/v3.1.4...v3.2.0) (2018-02-15)


### Features

* **storage api:** Added the Storage interface ([9605eeb](https://github.com/catavolt-oss/cv-dialog-sdk/commit/9605eeb))


<a name="3.1.0"></a>
# [3.1.0](https://git.catavolt.com/javascript/sdk/compare/v3.0.1...v3.1.0) (2018-02-14)


### Features

* **QueryDialog:** Allow specification of numRows when paging or refreshing list ([8157db2](https://git.catavolt.com/javascript/sdk/commits/8157db2))


<a name="3.0.0"></a>
# [3.0.0](https://git.catavolt.com/javascript/sdk/compare/2.0.0...3.0.0) (2018-01-29)


### Code Refactoring

* change Catavolt class name to CatavoltApi ([ad21d34](https://git.catavolt.com/javascript/sdk/commits/ad21d34))


### BREAKING CHANGES

* Catavolt should be imported and used directly instead of accessing
Catavolt.singleton
