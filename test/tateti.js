const chai = require("chai");
const chaiHttp = require("chai-http");
const res = require("express/lib/response");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

// - Cuando se inicia un juego nuevo le toca al primer jugador y el tablero esta vacio.
// - Cuando el primer jugador hace su movimiento le toca al otro jugador y la casilla 
// elegida por el primer jugardor esta ocupada.
// - Cuando el segundo jugador hace su movimiento le toca de nuevo al primer jugador y 
// las dos casillas elegidar por el primer y segundo jugador estan ocupadas con 
// marcas diferentes
// - Cuando un jugador marca tres casillas de la misma fila entonces gana
// - Cuando un jugador marca tres casillas de la misma columna entonces gana
// - Cuando un jugador marca tres casillas de las diagonales entonces gana
// - Si un jugador mueve cuando no es su turno entonces se devuelve un error y el tablero
// no cambia.
// - Cuando no quedan casillas vacias y no hay un ganador entonces hay un empate.
// - Cuando un jugador hace un movimiento a una casilla que ya esta ocupada entonces devuelve un error y el tablero no cambia

describe("Juego de TaTeTi", () => {    
    let juego = {
        jugadores: ['Juan', 'Pedro']
    }
    let movimientos = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 0 },
        { jugador: 'Juan', columna: 0, fila: 1 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
        { jugador: 'Juan', columna: 0, fila: 2 },
   ]
    let movimientos2 = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 0, fila: 1 },
        { jugador: 'Juan', columna: 1, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
        { jugador: 'Juan', columna: 2, fila: 0 },
    ]
    let movimientos3 = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 0 },
        { jugador: 'Juan', columna: 0, fila: 2 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
        { jugador: 'Juan', columna: 2, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 2 },
    ]

    let movimientos4 = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 0 },
        { jugador: 'Juan', columna: 1, fila: 1 },
        { jugador: 'Pedro', columna: 2, fila: 0 },
        { jugador: 'Juan', columna: 2, fila: 2 },
    ]

    let movimientos5 = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
    ]
    let movimientos6 = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 0, fila: 1 },
        { jugador: 'Juan', columna: 0, fila: 2 },
        { jugador: 'Pedro', columna: 1, fila: 1 },
        { jugador: 'Juan', columna: 1, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 2 },
        { jugador: 'Juan', columna: 2, fila: 1 },
        { jugador: 'Pedro', columna: 2, fila: 0 },
        { jugador: 'Juan', columna: 2, fila: 2 },
    ]
    let movimientos7 = [
        { jugador: 'Juan', columna: 0, fila: 0 },
        { jugador: 'Pedro', columna: 1, fila: 0 },
        { jugador: 'Juan', columna: 1, fila: 0 },
    ]


    describe("Se empieza un juego nuevo", () => {
        it("Todos los casilleros estan vacios y le toca mover al primer jugador", (done) => {
            chai.request(server)
            .put("/empezar")
            .send(juego)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.to.be.json;
                res.body.should.be.a('object');
                // Le toca mover al primer jugador
                res.body.should.have.property('turno').eql('Juan');
                // Todos los casilleros estan vacios
                res.body.should.have.property('tablero').eql([
                    [' ', ' ', ' '],
                    [' ', ' ', ' '],
                    [' ', ' ', ' '],
                ]);
                done();
            })
        });
    });
    describe("El primer jugador hace su primer movimiento", () => {
        it("El casillero queda ocupado y le toca al otro jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[0])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Pedro');
                    res.body.should.have.property('tablero').eql([
                        ['x', ' ', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                })
        });
    });
    describe("El segundo jugador hace su primer movimiento", () => {
        it("El casillero queda ocupado y le toca al otro jugador", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos[0]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos[1])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Juan');
                    res.body.should.have.property('tablero').eql([
                        ['x', 'o', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                });
        });
    });

    describe("Cuando un jugador marca tres casillas de la misma fila", () => {
        it("entonces gana", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos2[0]).end();
            chai.request(server).put("/movimiento").send(movimientos2[1]).end();
            chai.request(server).put("/movimiento").send(movimientos2[2]).end();
            chai.request(server).put("/movimiento").send(movimientos2[3]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos2[4])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('ganador').eql('Juan');
                    done()
                });
        });
    });

    describe("Cuando un jugador marca tres casillas de la misma columna", () => {
        it("entonces gana", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos3[0]).end();
            chai.request(server).put("/movimiento").send(movimientos3[1]).end();
            chai.request(server).put("/movimiento").send(movimientos3[2]).end();
            chai.request(server).put("/movimiento").send(movimientos3[3]).end();
            chai.request(server).put("/movimiento").send(movimientos3[4]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos3[5])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('ganador').eql('Pedro');
                    done()
                });
        });
    });

    describe("Cuando un jugador marca tres casillas de la misma diagonal", () => {
        it("entonces gana", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos4[0]).end();
            chai.request(server).put("/movimiento").send(movimientos4[1]).end();
            chai.request(server).put("/movimiento").send(movimientos4[2]).end();
            chai.request(server).put("/movimiento").send(movimientos4[3]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos4[4])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('ganador').eql('Juan');
                    done()
                });
        });
    });

    describe("Si un jugador mueve cuando no es su turno", () => {
        it("entonces se devuelve un error y el tablero no cambia", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos5[0]).end();
            chai.request(server).put("/movimiento").send(movimientos5[1]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos5[2])
                .end((err, res) => {
                    res.should.have.status(409);    //Conflict: No es el turno del jugador que realiza el movimiento
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('turno').eql('Juan'); //El turno es de Juan
                    res.body.should.have.property('error').eql('El turno es de Juan'); //mensaje de error
                    res.body.should.have.property('tablero').eql([  //El tablero no se modifico
                        ['x', 'o', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                });
        });
    });

    describe("Cuando no quedan casillas vacias y no hay un ganador", () => {
        it("entonces hay un empate", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos6[0]).end();
            chai.request(server).put("/movimiento").send(movimientos6[1]).end();
            chai.request(server).put("/movimiento").send(movimientos6[2]).end();
            chai.request(server).put("/movimiento").send(movimientos6[3]).end();
            chai.request(server).put("/movimiento").send(movimientos6[4]).end();
            chai.request(server).put("/movimiento").send(movimientos6[5]).end();
            chai.request(server).put("/movimiento").send(movimientos6[6]).end();
            chai.request(server).put("/movimiento").send(movimientos6[7]).end();
            chai.request(server)
                .put("/movimiento")
                .send(movimientos6[8])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('ganador').eql('Empate');
                    done()
                });
        });
    });

    describe("Cuando un jugador hace un movimiento a una casilla que ya esta ocupada", () => {
        it("entonces devuelve un error y el tablero no cambia", (done) => {
            chai.request(server).put("/empezar").send(juego).end();
            chai.request(server).put("/movimiento").send(movimientos7[0]).end();   
            chai.request(server).put("/movimiento").send(movimientos7[1]).end();   
            chai.request(server)
                .put("/movimiento")
                .send(movimientos7[2])
                .end((err, res) => {
                    res.should.have.status(409);    //Conflict: La casilla ya esta ocupada
                    res.should.to.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('La casilla ya está ocupada'); //mensaje de error
                    res.body.should.have.property('tablero').eql([  //El tablero no se modifico
                        ['x', 'o', ' '],
                        [' ', ' ', ' '],
                        [' ', ' ', ' '],
                    ]);
                    done()
                });
        });
    });

});
