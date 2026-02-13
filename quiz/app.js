const form = document.querySelector(".form-quizz");
let tableauResultats = [];
const reponses = ['c', 'a', 'b', 'a', 'c'];
const resultatTitre = document.getElementById("titreResultat");
const resultatNote = document.getElementById("noteResultat");
const resultatAide = document.getElementById("aideResultat");
const toutesLesQuestions = document.querySelectorAll(".question-block");
let verifTableau = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  tableauResultats = [];
  for (let i = 1; i <= 5; i++) {
    const reponseUtilisateur = document.querySelector(`input[name='q${i}']:checked`);
    if (reponseUtilisateur) {
      tableauResultats.push(reponseUtilisateur.value);
    } else {
      tableauResultats.push(undefined);
    }
  }
  verifFunc(tableauResultats);
});

function verifFunc(tabResultats) {
  verifTableau = [];
  for (let a = 0; a < 5; a++) {
    if (tabResultats[a] !== undefined) {
      verifTableau.push(tabResultats[a] === reponses[a]);
    } else {
      verifTableau.push(false);
    }
  }

  afficherResultats(verifTableau);
  couleursFonction(verifTableau);
}

function afficherResultats(tabCheck) {
  let nbDeFautes = tabCheck.filter(el => el === false).length;
  let note = `${5 - nbDeFautes}/5`;

  switch (nbDeFautes) {
    case 0:
      resultatTitre.innerText = "Bravo, c'est un sans fautes !";
      resultatAide.innerText = "";
      resultatNote.innerText = note;
      break;
    case 1:
      resultatTitre.innerText = "";
      resultatAide.innerText = "";
      resultatNote.innerText = note;
      break;
    case 2:
      // cas déjà traité dans la fonction
      break;
    case 3:
      resultatTitre.innerText = "Encore un effort";
      resultatAide.innerText = "";
      resultatNote.innerText = note;
      break;
    case 4:
      resultatTitre.innerText = "Il reste quelques erreurs";
      resultatAide.innerText = 'Retentez une autre réponse dans les cases rouges puis validez !';
      resultatNote.innerText = note;
      break;
    case 5:
      resultatTitre.innerText = "Vous y êtes presque !";
      resultatAide.innerText = 'Retentez une autre réponse dans les cases rouges puis validez !';
      resultatNote.innerText = note;
      break;
    default:
      resultatTitre.innerText = "Peut mieux faire !";
      resultatAide.innerText = 'Retentez une autre réponse dans les cases rouges puis validez !';
      resultatNote.innerText = note;
  }
}

function couleursFonction(tabValBool) {
  for (let j = 0; j < tabValBool.length; j++) {
    if (tabValBool[j] === true) {
      toutesLesQuestions[j].style.backgroundColor = "lightgreen";
    } else {
      toutesLesQuestions[j].style.backgroundColor = "#ffb8b8";
      toutesLesQuestions[j].classList.add("echec");
      setTimeout(() => {
        toutesLesQuestions[j].classList.remove("echec");
      }, 500);
    }
  }
}

toutesLesQuestions.forEach(item => {
  item.addEventListener('click', () => {
    item.style.backgroundColor = "white";
  });
});
