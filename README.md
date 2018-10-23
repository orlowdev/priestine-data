# @priestine/data

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
  * IO
  * Task
  * Either (Left || Right)
  * Maybe (Nothing || Just)