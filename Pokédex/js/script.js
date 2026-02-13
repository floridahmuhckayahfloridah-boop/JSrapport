const searchInput = document.querySelector(".recherche-poke input");
const listePoke = document.querySelector(".liste-poke");
const formSearch = document.querySelector("form");
const chargement = document.querySelector(".loader");

let allPokemon = [];
let tableauFin = [];
let promises = [];

const limite = 75;
const PokeNombreDebut = 21;
let index = PokeNombreDebut;
let counter = 0;

const types = {
    bug: '#a8b820',
    dark: '#705848',
    dragon: '#7038f8',
    electric: '#f8d030',
    fairy: '#ee99ac',
    fighting: '#c03028',
    fire: '#f08030',
    flying: '#a890f0',
    ghost: '#705898',
    grass: '#78c850',
    ground: '#e0c068',
    ice: '#98d8d8',
    normal: '#a8a878',
    poison: '#a040a0',
    psychic: '#f85888',
    rock: '#b8a038',
    steel: '#b8b8d0',
    water: '#6890f0'
};

/* ===============================
   FETCH DE LA LISTE DE BASE
================================ */
function fetchPokemonBase() {

    promises = [];
    chargement.style.display = "flex";

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}`)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pokemon => {
                promises.push(fetchPokemonComplet(pokemon));
            });
        })
        .then(() => Promise.all(promises))
        .then(() => {

            allPokemon.sort((a, b) => a.id - b.id);

            tableauFin = allPokemon.slice(0, PokeNombreDebut);
            createCard(tableauFin);

            chargement.style.display = "none";
        })
        .catch(err => console.error(err));
}

/* ===============================
   FETCH D'UN POKEMON COMPLET
================================ */
function fetchPokemonComplet(pokemon) {

    let objPokemonFull = {};

    return fetch(pokemon.url)
        .then(response => response.json())
        .then(pokeData => {

            counter++;

            objPokemonFull.id = pokeData.id;
            objPokemonFull.pic = pokeData.sprites.front_default;
            objPokemonFull.type = pokeData.types[0].type.name;

            return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
        })
        .then(response => response.json())
        .then(speciesData => {

            const frName = speciesData.names.find(
                n => n.language.name === "fr"
            );

            objPokemonFull.name = frName ? frName.name : pokemon.name;

            allPokemon.push(objPokemonFull);
        });
}

/* ===============================
   CRÉATION DES CARTES
================================ */
function createCard(arr) {

    arr.forEach(pokemon => {

        const carte = document.createElement("li");
        carte.classList.add("hoverableCarte");

        carte.style.background = types[pokemon.type] || "#ddd";

        const img = document.createElement("img");
        img.src = pokemon.pic;

        const nom = document.createElement("h5");
        nom.innerText = pokemon.name;

        const id = document.createElement("p");
        id.innerText = `ID# ${pokemon.id}`;

        carte.append(img, nom, id);
        listePoke.appendChild(carte);
    });
}

/* ===============================
   SCROLL INFINI
================================ */
window.addEventListener("scroll", () => {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }
});

function addPoke(nb) {

    if (index >= allPokemon.length) return;

    const arrToAdd = allPokemon.slice(index, index + nb);
    createCard(arrToAdd);
    index += nb;
}

/* ===============================
   BARRE DE RECHERCHE
================================ */
searchInput.addEventListener("input", e => {

    if (e.target.value !== "") {
        e.target.parentNode.classList.add("active-input");
    } else {
        e.target.parentNode.classList.remove("active-input");
    }
});

formSearch.addEventListener("submit", e => {
    e.preventDefault();
    recherche();
});

function recherche() {

    if (index < allPokemon.length) {
        addPoke(allPokemon.length - index);
    }

    const filter = searchInput.value.toUpperCase();
    const allLi = document.querySelectorAll(".liste-poke li");
    const allTitles = document.querySelectorAll(".liste-poke li h5");

    for (let i = 0; i < allLi.length; i++) {

        const txt = allTitles[i].innerText.toUpperCase();

        if (txt.indexOf(filter) > -1) {
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }
    }
}

/* ===============================
   LANCEMENT
================================ */
window.addEventListener("load", () => {
    fetchPokemonBase();
});
