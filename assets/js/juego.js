//jshint esversion : 6

/**
 * 2C = Two of Clubs
 * 2D = Tow of Diaminds
 * 2H = Two of Hearts
 * 2S = Two of Spades
 */

const miModulo = (() => {
    'use strict';

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    //let puntosJugador     = 0,
    //    puntosComputadora = 0;
    let puntosJugadores = [];

    //Referencias del HTML
    const btnNuevo             = document.querySelector('#btnNuevo'),
          btnPedir             = document.querySelector('#btnPedir'),
          btnDetener           = document.querySelector('#btnDetener');
    const puntos               = document.querySelectorAll('small'),
          coronas              = document.querySelectorAll('span'),
          divCartasJugadores   = document.querySelectorAll('.divCartas');


    //Esta funcion inicializa el juego
    const inicializarJuego = ( numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++){
                puntosJugadores.push(0);
        }
        puntos.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
        coronas.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    //
    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; ++i) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let es of especiales) {
                deck.push(es + tipo);
            }
        }
        return _.shuffle(deck);
    }

    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
                (valor === 'A') ? 11 : 10
                : valor * 1;
    }

    // Turno: 0 = primer jugador y el ultimo sea la computadora
    const acumularPuntos = (carta, turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntos[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanardor = ()=>{

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                coronas[0].innerText = '👑';
                coronas[1].innerText = '👑';
                //alert('Empate!');
            } else if (puntosMinimos > 21) {
                coronas[1].innerText = '👑';
                //alert('Computadora gana');
            } else if (puntosComputadora > 21) {
                coronas[0].innerText = '👑';
                //alert('Jugador gana');
            } else {
                coronas[1].innerText = '👑';
                //alert('Computadora gana :x');
            }
        }, 50);
    }

    //Turno computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

            if (puntosMinimos > 21) {
                break;
            }

        } while ((puntosJugadores[puntosJugadores.length - 1] < puntosMinimos) && (puntosMinimos <= 21));
        determinarGanardor();
        
    }

    //Eventos 
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Lo siento mucho, perdiste');
            turnoComputadora(puntosJugador);
            btnPedir.disabled = true;
            btnDetener.disabled = true;
        } else if (puntosJugador === 21) {
            console.warn('21, genial!');
            turnoComputadora(puntosJugador);
            btnPedir.disabled = true;
            btnDetener.disabled = true;
        }

    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);

    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego : inicializarJuego
    };

})();


