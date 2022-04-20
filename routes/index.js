var express = require('express');
var router = express.Router();

var jugadores;
var tablero;
var turno;
var ganador;

const marcas = ['x', 'o'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/empezar', function (request, response) {
  turno = 0;
  ganador = null;
  jugadores = request.body.jugadores;
  tablero = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ];

  response.setHeader('Content-Type', 'application/json');  
  response.send({turno: jugadores[turno], tablero: tablero});
});

router.put('/movimiento', function (request, response) {
  const columna = request.body.columna;
  const fila = request.body.fila;
  const jugadorActual = request.body.jugador;
  let ganador = null;

    // verifica si el jugador es el que tiene el turno
  if(jugadorActual != jugadores[turno]){
      //no corresponde el turno al jugador, responde con error 409 (conflict)
    response.setHeader('Content-Type', 'application/json');
    response.status(409).send({turno: jugadores[turno], tablero: tablero, error: 'El turno es de '+ jugadores[turno]});
    return;
  }

    //verifica que la casilla no este ocupada
  if(tablero[fila][columna] != ' '){
      //la casilla ya esta ocupada, responde con error 409 (conflict)
    response.setHeader('Content-Type', 'application/json');
    response.status(409).send({tablero: tablero, error: 'La casilla ya está ocupada'});
    return;
  }
  
    //actualiza el tablero con la jugada del jugador turno actual
  tablero[fila][columna] = marcas[turno];
  
    // verifica si hay un ganador
  let resultado = verFila(fila);
  if(resultado != null){
  ganador = verFila(fila);
  }else{
    resultado = verColumna(columna);
    if(resultado != null){
      ganador = verColumna(columna);
    }else{
      resultado = verDiagonal();
      if(resultado != null){
        ganador = verDiagonal();
      }else{
        resultado = verTableroCompleto();
        if(resultado != null){
          ganador = 'Empate';
        }
      }
    }
  }

   //actualiza el turno
  turno = (turno + 1) % 2;

   // envía la respuesta
  response.setHeader('Content-Type', 'application/json');  
  response.send({turno: jugadores[turno], tablero: tablero, ganador: ganador});
});

function verFila(fila){

  const filaX = tablero[fila].join('');
  const marcaX = marcas[turno];
  const filaGanadora = marcaX + marcaX + marcaX;
  if(filaX == filaGanadora){
    //console.log('ganador: ' + jugadores[turno]);
    return jugadores[turno];
  }
    //console.log('no ganador');
    return null;
}

function verColumna(columna){
  const marcaX = marcas[turno];
  const ColumnaGanadora = marcaX + marcaX + marcaX;
  let columnaX = '';
  tablero.forEach(element => columnaX = columnaX + (element[columna]));
  //console.log(columnaX);
  if(columnaX == ColumnaGanadora){
    //console.log('ganador: ' + jugadores[turno]);
    return jugadores[turno];
  }
    //console.log('no ganador');
  return null;
}

function verDiagonal(){
  const marcaX = marcas[turno];
  const DiagonalGanadora = marcaX + marcaX + marcaX;
  let diag0 = '';
  let diag1 = '';

  for(let i=0,j=0;i<3;i++,j++){
    diag0=diag0+tablero[i][j];
  }

  for(let i=0,j=2;i<3;i++,j--){
    diag1=diag1+tablero[i][j];
  }


  if(diag0 == DiagonalGanadora || diag1 == DiagonalGanadora){
    return jugadores[turno];
  }
  return null;
}

function verTableroCompleto(){
  tablero.forEach(element => {
    if(element.includes(' ')){
      return null;
    }
  });
  return 'Completo';
}


  module.exports = router;
