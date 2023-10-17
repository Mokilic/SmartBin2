function fetchExistingConfigurations() {
    // AJAX request to retrieve the configurations
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var configurations = JSON.parse(this.responseText);
        populateDeviceTable(configurations);
      }
    };
    xhttp.open("GET", "/get_configurations", true);  // Replace with the actual endpoint to retrieve configurations
    xhttp.send();
  }

  // Function to populate the device table with existing configurations
  function populateDeviceTable(configurations) {
    var table = document.getElementById("deviceTable");
    for (var i = 0; i < configurations.length; i++) {
      var deviceID = configurations[i].deviceID;
      var address = configurations[i].address;

      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = deviceID;
      cell2.innerHTML = address;
      cell3.innerHTML = '<button class="editDevice" onclick="editDevice(this)">Edit</button>';
      cell4.innerHTML = '<button class="deleteDevice" onclick="deleteDevice(this)">Delete</button>';
    }
  }
    // Function to add a new device configuration
    function addDevice(event) {
      event.preventDefault(); // Prevent form submission

      var deviceID = document.getElementById("deviceID").value;
      var address = document.getElementById("address").value;

      // Validate input
      if (deviceID === "" || address === "") {
        alert("Please enter both Device ID and Address.");
        return;
      }

      // AJAX request to add the device configuration to the database
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText);
          if (response.success) {
            // Clear the form
            document.getElementById("deviceForm").reset();
            // Add the new device to the table
            addDeviceToTable(deviceID, address);
          } else {
            alert("Failed to add device configuration.");
          }
        }
      };
      xhttp.open("POST", "/add_device", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send("deviceID=" + encodeURIComponent(deviceID) + "&address=" + encodeURIComponent(address));
    }

    // Function to add a new device to the table
    function addDeviceToTable(deviceID, address) {
      var table = document.getElementById("deviceTable");
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = deviceID;
      cell2.innerHTML = address;
      cell3.innerHTML = '<button onclick="editDevice(this)">Edit</button>';
      cell4.innerHTML = '<button onclick="deleteDevice(this)">Delete</button>';
      // createVisualizer(deviceID);
    }
    

    // Function to edit a device configuration
    function editDevice(button) {
      var row = button.parentNode.parentNode;
      var deviceID = row.cells[0].innerHTML;
      var address = row.cells[1].innerHTML;
    
      // Prompt user to edit the device configuration
      var newDeviceID = prompt("Enter the new Device ID:", deviceID);
      var newAddress = prompt("Enter the new Address:", address);
    
      // Update the device configuration in the table and the database
      if (newDeviceID && newAddress) {
        row.cells[0].innerHTML = newDeviceID;
        row.cells[1].innerHTML = newAddress;
    
        // AJAX request to update the device configuration in the database
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.success) {
              alert("Device configuration updated successfully.");
            } else {
              alert("Failed to update device configuration.");
            }
          }
        };
        xhttp.open("POST", "/edit_device", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("deviceID=" + encodeURIComponent(deviceID) + "&newDeviceID=" + encodeURIComponent(newDeviceID) + "&address=" + encodeURIComponent(newAddress));
      }
    }
    
    
    // Function to delete a device configuration
function deleteDevice(button) {
  var row = button.parentNode.parentNode;
  var deviceID = row.cells[0].innerHTML;

  // Confirm deletion
  if (confirm("Are you sure you want to delete the device configuration for Device ID: " + deviceID + "?")) {
    row.remove();
    // AJAX request to delete the device configuration from the database
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        if (response.success) {
          alert("Device configuration deleted successfully.");
        } else {
          alert("Failed to delete device configuration.");
        }
      }
    };
    xhttp.open("POST", "/delete_device", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("deviceID=" + encodeURIComponent(deviceID));
  }
}
  
    function showConfigurationList() {
  // Redirect the user to the Configuration List page
    window.location.href = "/";
    }

    function showDashboard() {
      // Redirect to the dashboard page
      window.location.href = "/dashboard";
    }

    
    
    window.onload = function() {
    fetchExistingConfigurations();
  };