# Estilo de Imports

## 1. Orden Visual

Ordena los imports de **mayor a menor longitud de línea** (los más largos primero).

## 2. Imports Multilínea al Final

Los imports que ocupan múltiples líneas deben ir **siempre al final** del bloque de imports, después de todos los de una sola línea.

## 3. Desempate entre Imports Multilínea

Si hay varios imports multilínea, ordénalos por **cantidad de miembros importados de mayor a menor** (el que trae más cosas va primero dentro del grupo multilínea).

## Ejemplo

```typescript
// Imports de una línea — de mayor a menor longitud
import { SomeVeryLongNamedUtilityFunction } from '@company/utils/helpers'
import { AnotherUtilityHelper } from '@company/utils'
import { useState, useEffect } from 'react'
import axios from 'axios'

// Imports multilínea — de mayor a menor cantidad de miembros
import {
   ComponentA,
   ComponentB,
   ComponentC,
   ComponentD,
   ComponentE,
   ComponentF,
} from '@company/ui'
import {
   SubcomponentA,
   SubcomponentB,
   SubcomponentC,
   SubcomponentD,
   SubcomponentE,
} from './helpers'
```
