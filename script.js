// Variables pour la gestion des couleurs et du pixel sélectionné
var selectedColor = "#FF4500";

// Fonction pour sélectionner une couleur
function selectColor(color) {
    selectedColor = color;
    document.getElementById("selectedColor").style.backgroundColor = color;
}

// Fonction pour ajouter un pixel à l'emplacement spécifié
function addPixel(x, y, color) {
    var pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.style.backgroundColor = color;
    pixel.style.left = x + "px";
    pixel.style.top = y + "px";
    document.getElementById("canvas").appendChild(pixel);

    // Enregistrement du pixel dans la base de données (côté serveur non inclus)
    // Vous pouvez implémenter la sauvegarde du pixel en utilisant une requête AJAX vers votre serveur PHP
}

// Variables pour la gestion de la grille
var gridSize = 10;
var canvas = document.getElementById("canvas");

// Variables pour le minuteur
var isTimerActive = false;
var timerDuration = 5 * 60 * 1000; // 5 minutes en millisecondes
var timerInterval;

// Fonction pour démarrer le minuteur
function startTimer() {
    if (!isTimerActive) {
        isTimerActive = true;
        var startTime = Date.now();
        timerInterval = setInterval(function () {
            var elapsedTime = Date.now() - startTime;
            var remainingTime = timerDuration - elapsedTime;
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                isTimerActive = false;
                updateTimerDisplay("");
                isPlacingSelection = true; // Réinitialiser la possibilité de placer un nouveau pixel après le minuteur
            } else {
                var minutes = Math.floor(remainingTime / (1000 * 60));
                var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                updateTimerDisplay(+ minutes + " minutes " + seconds + " secondes");
            }
        }, 1000);
    }
}

// Fonction pour arrêter le minuteur
function stopTimer() {
    clearInterval(timerInterval);
    isTimerActive = false;
    updateTimerDisplay("");
}

// Fonction pour mettre à jour l'affichage du minuteur
function updateTimerDisplay(message) {
    var timerElement = document.getElementById("timer");
    timerElement.innerText = message;
}

// Fonction pour vérifier si le minuteur est actif avant de placer un pixel
function placeSelectedColorPixel() {
    if (isPlacingSelection && isTimerActive) {
        return;
    }

    // Récupérer les coordonnées de la zone de sélection
    const x = parseInt(selectionArea.style.left);
    const y = parseInt(selectionArea.style.top);

    // Placer le pixel de la couleur sélectionnée dans la zone de sélection
    addPixel(x, y, selectedColor);

    // Masquer la zone de sélection
    selectionArea.style.display = "none";

    // Réinitialiser le flag pour empêcher le maintien du clic
    isPlacingSelection = false;

    // Démarrer le minuteur uniquement si un pixel n'a pas été placé
    if (!isTimerActive) {
        startTimer();
    }
}

// Variables pour la gestion de la zone de sélection
var isPlacingSelection = false;
var selectionArea = document.getElementById("selectionArea");

// Ajouter un événement clic pour la toile (canvas)
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Afficher la zone de sélection à l'emplacement cliqué
    selectionArea.style.display = "block";
    selectionArea.style.left = Math.floor(x / gridSize) * gridSize + "px";
    selectionArea.style.top = Math.floor(y / gridSize) * gridSize + "px";

    // Régler la taille de l'image de la zone de sélection pour correspondre à la taille d'un pixel
    selectionArea.style.width = gridSize + "px";
    selectionArea.style.height = gridSize + "px";

    // Empêcher le maintien du clic
    isPlacingSelection = true;
});
