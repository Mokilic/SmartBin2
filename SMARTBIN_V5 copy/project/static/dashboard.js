// primær funktion der kører når siden loader
// opdaterer visualizer med data fra databasen og indstiller farverne 
function updateVisualizer(bin_id, percentageData) {
  var visualizer = document.getElementById("visualizer-" + bin_id);
  var percentage = visualizer.querySelector(".trash-percentage");
  percentage.textContent = percentageData + "%";
  
  var containerLiquid = visualizer.querySelector(".container__liquid");
  var percentage = visualizer.querySelector(".trash-percentage");

  if (percentageData <= 30) {
    containerLiquid.style.background = 'var(--gradient-color-green)';
    percentage.style.color = 'var(--color-green)';
  } else if (percentageData <= 60) {
    containerLiquid.style.background = 'var(--gradient-color-yellow)';
    percentage.style.color = 'var(--color-yellow)';
  } else if (percentageData <= 90) {
    containerLiquid.style.background = 'var(--gradient-color-orange)';
    percentage.style.color = 'var(--color-orange)';

  } else {
    containerLiquid.style.background = 'var(--gradient-color-red)';
    percentage.style.color = 'var(--color-red)';

  }
}

// global variabel der sætter edit-knappen til at være usynlig
var formButtonsVisible = false;

// funktion der gemmer/viser edit-knappenerne 
function toggleFormButtons() {
  formButtonsVisible = !formButtonsVisible; 


  var formButtons = document.getElementsByClassName("form-button");

  // for loop der inkrementerer igennem styles.display
  for (var i = 0; i < formButtons.length; i++) {
    if (formButtonsVisible) {
      formButtons[i].style.display = "block"; // viser form buttons
    } else {
      formButtons[i].style.display = "none"; // gemmer form buttons
    }
  }
}

// variabel til nummering af visualizers
var binCount = 0;


// Funktion der laver visualizer
function createVisualizer(bin_id, percentageData) {
  binCount++;
  // Laver visualizer baseret ud fra vores CSS style - HTML container som skal indeholde alle elementer
  var visualizerContainer = document.getElementById("visualizerContainer");

  // Checker om der er en allerede eksisterer en visualizer med same id
  var existingVisualizer = document.getElementById("visualizer-" + bin_id);
  if (existingVisualizer) {
    // gemmer rækkefølgen af containers og opdaterer værdierne
    saveContainerOrder();
    updateVisualizer(bin_id, percentageData);
    return;
  }

  // opretter de enkelte elementer til visualizerContainer
  var visualizer = document.createElement("div");
  visualizer.id = "visualizer-" + bin_id;
  visualizer.classList.add("container__wrapper");

  var binCountText = document.createElement("span");
  binCountText.classList.add("bin-count");
  binCountText.textContent = binCount;

  var iconContainer = document.createElement("div");
  iconContainer.classList.add("container__icon");

  var levelContainer = document.createElement("div");
  levelContainer.classList.add("container__level");

  var liquid = document.createElement("div");
  liquid.classList.add("container__liquid");

  var containerHeight = 180; // højden af "visualizer væske" defineret i pixels
  var liquidHeight = Math.round((containerHeight * percentageData) / 100); // omregning
  liquid.style.height = liquidHeight + "px"; // sætter den korrekte højde


  // appender elementerne til visualizerContainer
  levelContainer.appendChild(liquid);
  iconContainer.appendChild(levelContainer);
  visualizer.appendChild(binCountText);

  visualizer.appendChild(iconContainer);

  var percentageText = document.createElement("div");
  percentageText.classList.add("trash-percentage");
  percentageText.textContent = percentageData + "%";

  visualizer.appendChild(percentageText);

  var formButton = document.createElement("button");
  formButton.classList.add("form-button");
  formButton.textContent = "...";
  formButton.addEventListener("click", function() {
    openForm(bin_id);
  });

  visualizer.appendChild(formButton);

  visualizerContainer.appendChild(visualizer);
}


// funktion til at åbne modal overlay/form
function openForm(bin_id) {
  var modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");


  modalOverlay.addEventListener("click", function(event) {
    if (event.target === modalOverlay) {
      closeModal(modalOverlay);
    }
  });

  var formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  var form = document.createElement("form");
  form.classList.add("bin-form");

  var binIdElement = document.createElement("span");
  binIdElement.classList.add("bin-id");
  binIdElement.textContent = bin_id;

  var closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.textContent = "";
  closeButton.addEventListener("click", function() {
    closeModal(modalOverlay);
  });

  var deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function() {
    deleteBin(bin_id);
    closeModal(modalOverlay);
  });

  form.appendChild(binIdElement);
  form.appendChild(closeButton);
  form.appendChild(deleteButton);

  formContainer.appendChild(form);
  modalOverlay.appendChild(formContainer);
  document.body.appendChild(modalOverlay);
}


// funktion til at lukke modal overlay/form
function closeModal(modalOverlay) {
  if (modalOverlay) {
    modalOverlay.remove();
  }
}

// funktioner der sorterer og gemmer rækkefølgen af containers
function sortContainerIcons() {
  var visualizerContainer = document.getElementById("visualizerContainer");
  var icons = Array.from(visualizerContainer.getElementsByClassName("container__wrapper"));

  icons.sort(function(a, b) {
    var binIdA = parseInt(a.getAttribute("data-bin-id").replace("Bin", ""));
    var binIdB = parseInt(b.getAttribute("data-bin-id").replace("Bin", ""));
    return binIdA - binIdB;
  });

  icons.forEach(function(icon) {
    visualizerContainer.appendChild(icon);
  });
}

function saveContainerOrder() {
  var visualizerContainer = document.getElementById("visualizerContainer");
  var icons = visualizerContainer.getElementsByClassName("container__wrapper");
  var order = [];

  for (var i = 0; i < icons.length; i++) {
    var binId = icons[i].getAttribute("data-bin-id");
    order.push(binId);
  }

  localStorage.setItem("containerOrder", JSON.stringify(order));
}

function restoreContainerOrder() {
  var visualizerContainer = document.getElementById("visualizerContainer");
  var order = localStorage.getItem("containerOrder");

  if (order) {
    order = JSON.parse(order);

    for (var i = 0; i < order.length; i++) {
      var binId = order[i];
      var icon = document.querySelector("[data-bin-id='" + binId + "']");
      visualizerContainer.appendChild(icon);
    }
  }
}



function deleteBin(bin_id) {
  var visualizer = document.getElementById("visualizer-" + bin_id);
  if (visualizer) {
    visualizer.remove();
  }

  var form = document.querySelector(".bin-form");
  if (form) {
    form.remove();
  }

  // Remove the visualizer data from local storage
  localStorage.removeItem("visualizerData-" + bin_id);
}



function createTrashBinVisualizer() {
  var bin_id = prompt("Enter the bin ID:");
  if (!bin_id) {
    return; // Exit if the user cancels the prompt
  }

  // AJAX request to retrieve the percentage data for the bin
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var percentageData = JSON.parse(this.responseText);

      // Call the createVisualizer function with the retrieved data
      createVisualizer(bin_id, percentageData);

      // Store the visualizer data in local storage
      var visualizerData = {
        bin_id: bin_id,
        percentageData: percentageData
      };
      localStorage.setItem("visualizerData-" + bin_id, JSON.stringify(visualizerData));
    }
  };
  xhttp.open("GET", "/get_percentage_data?bin=" + encodeURIComponent(bin_id), true);
  xhttp.send();
}

function removeVisualizer(bin_id) {
  var visualizer = document.getElementById("visualizer-" + bin_id);
  if (visualizer) {
    visualizer.remove();
    localStorage.removeItem("visualizerData-" + bin_id);
  }
}



window.onload = function() {
  // Retrieve the visualizer data from local storage
  var visualizerDataList = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.startsWith("visualizerData-")) {
      var visualizerData = JSON.parse(localStorage.getItem(key));
      visualizerDataList.push(visualizerData);
    }
  }

  // Sort the visualizer data by bin ID
  visualizerDataList.sort(function(a, b) {
    var binIdA = parseInt(a.bin_id.replace("Bin", ""));
    var binIdB = parseInt(b.bin_id.replace("Bin", ""));
    return binIdA - binIdB;
  });

  // Create the visualizers in the desired order
  visualizerDataList.forEach(function(visualizerData) {
    createVisualizer(visualizerData.bin_id, visualizerData.percentageData);
    fetchLatestPercentageData(visualizerData.bin_id);
  });

  // Restore the container order
  restoreContainerOrder();
};

function fetchLatestPercentageData(bin_id) {
  // AJAX request to retrieve the latest percentage data for the bin
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var percentageData = JSON.parse(this.responseText);
      updateVisualizer(bin_id, percentageData);

      // Update the visualizer data in local storage
      var visualizerData = {
        bin_id: bin_id,
        percentageData: percentageData
      };
      localStorage.setItem("visualizerData-" + bin_id, JSON.stringify(visualizerData));
    }
  };
  xhttp.open("GET", "/get_latest_percentage_data?bin=" + encodeURIComponent(bin_id), true);
  xhttp.send();
}