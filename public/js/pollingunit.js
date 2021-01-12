document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/lgas")
    .then((response) => response.json())
    .then((data) => loadLGAs(data["data"]));

  loadTable([]);
});

const loadLGAs = (lgas) => {
  for (const property in lgas) {
    let option = document.createElement("option");
    option.text = lgas[property].lga_name;
    option.value = lgas[property].lga_id;

    let select = document.getElementById("lga");
    select.appendChild(option);
    // $("#lga").append(`<option value=${lgas[property].lga_id}>${lgas[property].lga_name}</option>`);
    // console.log(lgas[property].lga_name);
  }
};

jQuery(function ($) {
  $("#lga").on("change", function () {
    $("#pollingUnit").find("option").remove().end();

    var lgaId = this.value;
    fetch("http://localhost:3000/lgas-pollunit", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        lgaId: lgaId,
      }),
    })
      .then((response) => response.json())
      .then((data) => loadPollingUnits(data["data"]));
  });
  return;
});

const loadPollingUnits = (units) => {
  for (const property in units) {
    let option = document.createElement("option");
    option.text = units[property].polling_unit_name;
    option.value = units[property].uniqueid;

    let select = document.getElementById("pollingUnit");
    select.appendChild(option);
  }
};

const fetchBtn = document.querySelector("#fetch");

fetchBtn.onclick = function () {
  const pollingUnitInput = document.querySelector("#pollingUnit");
  const uniqueId = pollingUnitInput.value;

  jQuery(function ($) {
    $("#table tbody").html("");
  });
  // lgaInput.value = "";

  fetch("http://localhost:3000/poll-results", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      uniqueId: uniqueId,
    }),
  })
    .then((response) => response.json())
    .then((data) => insertTableRows(data["data"]));
};

const loadTable = (data) => {
  const table = document.querySelector("table tbody");

  if (data.length === 0) {
    jQuery(function ($) {
      $("#table tbody").append(
        "<tr><td class='no-data' colspan='2'>No Data</td></tr>"
      );
      return;
    });

    // table.innerHTML = `<tr><td class='no-data' colspan='2'>No Data</td></tr>`;
  }

  let tableHTML = "";

  data.forEach(function ({ party_abbreviation, party_score }) {
    tableHTML += "<tr>";
    tableHTML += `<td>${party_abbreviation}</td>`;
    tableHTML += `<td>${party_score}</td>`;
    tableHTML += "</tr>";
  });

  table.innerHTML = tableHTML;
};

const insertTableRows = (data) => {
  //   console.log(data);

  const table = document.querySelector("table tbody");

  const isTableData = table.querySelector(".no-data");

  // let tableHTML = "<tr>";

  if (data) {
    for (const key in data) {
      jQuery(function ($) {
        // $("#table tbody").html("");
        $("#table tbody").append(
          `<tr><td>${data[key].party_abbreviation}</td><td>${data[key].party_score}</td></tr>`
        );
      });
    }

    let totalVotes = sum(data);
    jQuery(function ($) {
      $("#totalVotes").html(totalVotes);
      return;
    });
  } else {
    jQuery(function ($) {
      $("#table tbody").append(
        "<tr><td class='no-data' colspan='2'>No Data</td></tr>"
      );
      return;
    });
  }
};

const sum = (obj) => {
  var sum = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      // console.log(obj[prop].party_score);
      sum += parseFloat(obj[prop].party_score);
    }
  }
  return sum;
};
