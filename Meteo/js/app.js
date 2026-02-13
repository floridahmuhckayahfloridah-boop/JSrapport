const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi',
    'Vendredi', 'Samedi', 'Dimanche'];

let adj = new Date();
let options = {weekday: 'long'};
let jourActuel = adj.toLocaleDateString('fr-FR', options);

jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);

let tabJourEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));

const CLEFAPI = '1de4cbccd0df2bf6f9dfa5821ac4c4da';
const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-nom-prevision");
const tempPourH = document.querySelectorAll(".heure-prevision-valeur");

const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempJoursDiv = document.querySelectorAll(".jour-prevision-temp");
const imIcon = document.querySelector(".logo-meteo");

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long, lat);
    }, () => {
        alert("Vous avez réfusé la géolocalisation veuillez l'activer")
    })
}

function AppelAPI(long, lat) {
    // Météo actuelle
    const urlActuelle = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=${CLEFAPI}`;

    // Prévisions 5 jours
    const urlPrevisions = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=${CLEFAPI}`;

    Promise.all([
        fetch(urlActuelle).then(r => r.json()),
        fetch(urlPrevisions).then(r => r.json())
    ])
    .then(([actuelle, previsions]) => {
        // ✅ CORRECTION: Pas besoin de .json() ici, déjà fait au-dessus
        console.log("Météo actuelle:", actuelle);
        console.log("Prévisions:", previsions);

        // ✅ Affichage météo actuelle (structure différente)
        temps.innerText = actuelle.weather[0].description;
        temperature.innerText = `${Math.trunc(actuelle.main.temp)}°`;
        localisation.innerText = actuelle.name; // ✅ C'est .name, pas .timezone

        let heureActuelle = new Date().getHours();

        // ✅ Affichage des heures (inchangé)
        for(let i = 0; i < heure.length; i++) {
            let heureIncr = heureActuelle + i*3;
            if(heureIncr > 24) {
                heure[i].innerText = `${heureIncr - 24} h`;
            }
            else if(heureIncr === 24) {
                heure[i].innerText = "00 h"
            }
            else {
                heure[i].innerText = `${heureIncr} h`
            }
        }

        // ✅ Températures horaires depuis previsions.list
        for (let j = 0; j < tempPourH.length && j < previsions.list.length; j++) {
            tempPourH[j].innerText = `${Math.trunc(previsions.list[j].main.temp)}°`;
        }

        // ✅ Affichage des jours (inchangé)
        for (let k = 0; k < tabJourEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJourEnOrdre[k].slice(0,3);
        }

        // ✅ Températures par jour (calculer la moyenne depuis previsions)
        // L'API forecast donne des prévisions toutes les 3h, il faut regrouper par jour
        let joursTemp = {};
        previsions.list.forEach(item => {
            let dateJour = new Date(item.dt * 1000).toLocaleDateString('fr-FR');
            if (!joursTemp[dateJour]) {
                joursTemp[dateJour] = [];
            }
            joursTemp[dateJour].push(item.main.temp);
        });

        let tempsMoyennesJours = Object.values(joursTemp).map(temperatures => {
            return Math.trunc(temperatures.reduce((a, b) => a + b) / temperatures.length);
        });

        for (let m = 0; m < 7 && m < tempsMoyennesJours.length; m++) {
            tempJoursDiv[m].innerText = `${tempsMoyennesJours[m]}°`;
        }

        // ✅ Icône depuis actuelle.weather[0].icon
        if(heureActuelle >= 6 && heureActuelle < 21) {
            imIcon.src = `res/jour/${actuelle.weather[0].icon}.svg`;
        }
        else {
            imIcon.src = `res/nuit/${actuelle.weather[0].icon}.svg`;
        }

        overlayer.classList.add("disparition");
    })
    .catch((error) => {
        console.error("Erreur API:", error);
        alert("Erreur lors de la récupération des données météo");
    });
}