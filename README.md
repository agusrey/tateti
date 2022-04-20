# Ta-Te-Ti: Un ejemplo de TDD en Express con Mocha

Este repositorio contiene un ejemplo paso a paso para el desarrollo de un servidor de backend basado en NodeJS y Express que sirve un juego de TaTeTi.

## Preparación del Entorno

1. Instalar el generador de proyectos de express ([referencia](https://expressjs.com/es/starter/generator.html))

```
npm install express-generator -g
```

2. Generar el proyecto express

```
express --no-view  --git tateti
```

2. Instalar las herramientas de testing 

```
npm install --save-dev mocha chai nyc chai-http
```

3. Modificar el archivo `package.json` para agregar el comando de pruebas

```
  "scripts": {
    "start": "node ./bin/www",
    "test": "cucumber-js --publish-quiet",
    "coverage": "nyc --reporter=html cucumber-js --publish-quiet"
  },
```

## Ejecución de las pruebas

```
npm test
```
## Pruebas Implementadas

- Cuando se inicia un juego nuevo le toca al primer jugador y el tablero esta vacio.
- Cuando el primer jugador hace su movimiento le toca al otro jugador y la casilla elegida por el primer jugardor esta ocupada.
- Cuando el segundo jugador hace su movimiento le toca de nuevo al primer jugador y las dos casillas elegidar por el primer y segundo jugador estan ocupadas con marcas diferentes
- Cuando un jugador marca tres casillas de la misma fila entonces gana
- Cuando un jugador marca tres casillas de la misma columna entonces gana
- Cuando un jugador marca tres casillas de las diagonales entonces gana
- Si un jugador mueve cuando no es su turno entonces se devuelve un error y el tablero no cambia.
- Cuando no quedan casillas vacias y no hay un ganador entonces hay un empate.
- Cuando un jugador hace un movimiento a una casilla que ya esta ocupada entonces devuelve un error y el tablero no cambia
