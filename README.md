# @priestine/data

[![pipeline](https://gitlab.com/priestine/data/badges/master/pipeline.svg)](https://gitlab.com/priestine/data) [![codecov](https://codecov.io/gl/priestine/data/branch/master/graph/badge.svg)](https://codecov.io/gl/priestine/data) [![licence: MIT](https://img.shields.io/npm/l/@priestine/data.svg)](https://gitlab.com/priestine/data) [![docs: typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://priestine.gitlab.io/data) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics) [![npm](https://img.shields.io/npm/dt/@priestine/data.svg)](https://www.npmjs.com/package/@priestine/data) [![npm](https://img.shields.io/npm/v/@priestine/data.svg)](https://www.npmjs.com/package/@priestine/data)


Functional data types, most common algebraic structures as interfaces (FL and SL compliant) and frequently used monads.

## Installation

```bash
npm i --save @priestine/data
```

or

```bash
yarn add @priestine/data
```

## Contents

* Algebraic structures as interfaces
  * **Setoid**
  * **Ord** extends **Setoid**
  * **Semigroupoid**
  * **Semigroup**
  * **Monoid** extends **Semigroup**
  * **Filterable**
  * **Functor**
  * **Apply** extends **Functor**
  * **Applicative** extends **Apply**
  * **Chain** extends **Apply**
  * **Monad** extends **Applicative** and **Chain**
  * **Bifunctor** extends **Functor**
* Common monads
  * **IO** <_Applicative_ & _Monad_>
  * **Task** <_Monoid_ & _Monad_ & _Bifunctor_)
  * **Either** (Left <_Setoid_ & _Semigroup_ & _Monad_> || Right <_Setoid_ & _Semigroup_ & _Monad_>)
  * ~~**Maybe** (Nothing || Just)~~
