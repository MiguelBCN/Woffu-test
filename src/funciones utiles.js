function loadData(url, header) {
  let datos = fetch(url, header)
    .then(result => result.json())
    .catch(error => console.error("Miguel el error es el siguiente: ", error));
  return datos;
}

function filterOptions(miembros) {
  let opciones = [];
  for (let miembro of miembros) {
    opciones.push(miembro.state);
  }
  let unique = [...new Set(opciones)];
  return unique;
}

function sortTable(miembros, reverse, concept) {
  let miembrosOrdenados = miembros;
  //Aqui compruebo si hay que ordenar de alguna forma alfabetica
  if (typeof miembros[0][concept] === typeof "string") {
    reverse
      ? miembrosOrdenados.sort(function(b, a) {
          var textA = a[concept].toUpperCase();
          var textB = b[concept].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        })
      : miembrosOrdenados.sort(function(a, b) {
          var textA = a[concept].toUpperCase();
          var textB = b[concept].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
  }
  //Aqui compruebo si hay que ordenar de alguna forma numerica
  if (typeof miembros[0][concept] === typeof 10) {
    reverse
      ? miembrosOrdenados.sort(function(a, b) {
          return a[concept] - b[concept];
        })
      : miembrosOrdenados.sort(function(b, a) {
          return a[concept] - b[concept];
        });
  }
  return miembrosOrdenados;
}

function aplicarFiltros(miembros) {
  if (
    document.querySelectorAll("input[name=party]:checked").length !== 0 ||
    document.getElementsByName("state")[0].value !== "all" ||
    document.getElementById("searchBox").value
  ) {
    // Compruebo si el fitrar por estados esta activo
    if (document.getElementsByName("state")[0].value !== "all") {
      miembros = filtrarEstate(miembros);
    }
    // Compruebo si el fitrar por party esta activo
    if (document.querySelectorAll("input[name=party]:checked").length !== 0) {
      miembros = filtrarParty(miembros);
    }
    // Compruebo si el fitrar por palabra/nombre esta activo
    if (document.getElementById("searchBox").value) {
      miembros = filtrarText(
        miembros,
        document.getElementById("searchBox").value
      );
    }
    //En el caso de que al filtrar los resultados nos den resultados le damos al usuario una respuesta
    if (miembros.length <= 0) {
      miembros.push({
        first_name: "Aqui no hay",
        party: "nada",
        state: "por",
        seniority: "ver 🧐",
        votes_with_party_pct: "busca otra vez 😊"
      });
    }
    return miembros;
  } else {
    return miembros;
  }
}

function filtrarEstate(miembros) {
  let miembrosFiltrados = miembros.filter(
    x => x.state === document.getElementsByName("state")[0].value
  );
  return miembrosFiltrados;
}

function filtrarParty(miembros) {
  let miembrosFiltrados = miembros.filter(x => {
    return (
      (x.party === document.getElementsByName("party")[0].value &&
        document.getElementsByName("party")[0].checked) ||
      (x.party === document.getElementsByName("party")[1].value &&
        document.getElementsByName("party")[1].checked) ||
      (x.party === document.getElementsByName("party")[2].value &&
        document.getElementsByName("party")[2].checked)
    );
  });
  /*Esta es la alternativa a usar filter
    for (let i = 0; i < miembros.length; i++) {
      if (miembros[i].party === document.getElementsByName('party')[0].value && document.getElementsByName('party')[0].checked) {
        miembrosFiltrados.push(miembros[i]);
      }
      if (miembros[i].party === document.getElementsByName('party')[1].value && document.getElementsByName('party')[1].checked) {
        miembrosFiltrados.push(miembros[i]);
      }
      if (miembros[i].party === document.getElementsByName('party')[2].value && document.getElementsByName('party')[2].checked) {
        miembrosFiltrados.push(miembros[i]);
      }
    }*/
  return miembrosFiltrados;
}

function filtrarText(miembros, palabra) {
  let miembrosFiltrados = [];
  palabra ? (palabra = palabra.toUpperCase()) : (palabra = 1);
  for (let miembro of miembros) {
    if (miembro.full_name.toUpperCase().indexOf(palabra) > -1) {
      miembrosFiltrados.push(miembro);
    }
  }
  return miembrosFiltrados;
}

function promedio(members) {
  let media = 0;
  for (var i = 0; i < members.length; i++) {
    media += members[i].votes_with_party_pct;
  }
  media === 0 || media == NaN ? (media = 0) : (media = media / members.length);
  return Math.floor(media);
}

let filtro = (party, members) => {
  let partyS = members.filter(objeto => objeto.party === party);
  let filtro = {};
  switch (party) {
    case "D":
      filtro.nameParty = "Democrat";
      filtro.party = "D";
      filtro.votesPtc = promedio(partyS) + "%";
      break;
    case "R":
      filtro.nameParty = "Republican";
      filtro.party = "R";
      filtro.votesPtc = promedio(partyS) + "%";
      break;
    case "I":
      filtro.nameParty = "Independent";
      filtro.party = "I";
      filtro.votesPtc = promedio(partyS) + "%";
      break;
    default:
  }
  return filtro;
};
//Esta funcion debe devolverme un array de objetos con solo los que necesito
function ordenarMiembrosStatics(miembros) {
  //Con el array juego y lo uso para filtrar los 3 partidos
  let partyD = filtro("D", miembros);
  let partyI = filtro("I", miembros);
  let partyR = filtro("R", miembros);
  //Pongo los datos en la variable del Vue
  app.statics.push(partyD, partyR, partyI);
  //Retorno el mismo array sin cambiarlo
  return miembros;
}

function ordenarMiembrosTop(miembros, concepto) {
  let leastLoyalMembers = [];
  let mostLoyalMembers = [];
  let miembrosOrdenados = miembros.sort(function(a, b) {
    return a[concepto] - b[concepto];
  });

  for (var i = 0; i < Math.floor(miembros.length * 0.1); i++) {
    leastLoyalMembers.push(miembrosOrdenados[i]);
    mostLoyalMembers.push(
      miembrosOrdenados[`${miembrosOrdenados.length - 1 - i}`]
    );
  }
  console.table(leastLoyalMembers);
  console.table(mostLoyalMembers);
  app2.members = leastLoyalMembers;
  app3.members = mostLoyalMembers;
  return miembros;
}
