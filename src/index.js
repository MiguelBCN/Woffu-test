// let url = "https://woffu-dev.azurewebsites.net/api/v1/users";
// let username = "VnklkBJ3BepTAADWQlq4%2f3ktKFWUSlWxsnpG4DlUVVGKomlxlrVUaQ%3d%3d";
// let header = {
//   method: "GET",
//   headers: {
//     Authorization:
//       "Basic Vm5rbGtCSjNCZXBUQUFEV1FscTQlMmYza3RLRldVU2xXeHNucEc0RGxVVlZHS29tbHhsclZVYVElM2QlM2Q6"
//   }
// };

var app = new Vue({
  el: "#tabla-woffu",
  data: {
    datos: datos[0],
    fechaInicio: "",
    fechaFin: ""
  },
  computed: {
    //El siguiente atributo devolvera lo que cogemos de la data pero con los filtros y algunos cambios
    empleados: function() {
      let empleados = JSON.parse(JSON.stringify(this.datos));
      for (let x of empleados) {
        //Mejoro el formato de presentacion de la fecha
        x.EmployeeStartDate = x.EmployeeStartDate.substring(0, 10);
        //Añado un atributo extra para las iniciales
        x.Iniciales = x.FirstName.substring(0, 1) + x.LastName.substring(0, 1);
        //Esto arreglara si algun url es null
        if (!x.ImageURL) {
          x.ImageURL = "";
        }
        console.log(`Dias libres${x.AvailableDays} de ${x.UsedDays}`);
      }
      return empleados;
    }
  },
  methods: {
    filtrarPorFecha: function(fecha) {},
    paginacion: function(numEMpleados) {}
  }
});

//Error log
//Error for the avatar
function brokenLinkAvatar(img) {
  img.style.display = "none";
  if (img.src === "") {
    img.style.display = "none";
  }
  img.nextElementSibling.style.display = "block";
}
