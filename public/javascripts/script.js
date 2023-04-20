document.addEventListener("DOMContentLoaded", function () {

  let contadorHojas = document.querySelector(".contadorHojas");
  let contador = parseInt(sessionStorage.getItem("contadorHojas")) || 0;
  contadorHojas.innerHTML = contador;

  let contenedor = document.querySelector(".impresoras-container");
 
  let listaHojas = [{ A2: [] }, { A3: [] }, { A4: [] }];

  if (sessionStorage.getItem("listaHojas")) {
    listaHojas = JSON.parse(sessionStorage.getItem("listaHojas"));
  } else {
    sessionStorage.setItem("hojas", JSON.stringify(hojas));
  }

  let enviar = document.getElementById("enviar");
  enviar.addEventListener("click", () => añadirHojas());

  getImpresoras();

  function getImpresoras() {
    contenedor.innerHTML = "";
    fetch("/impresoras")
      .then((response) => response.json())
      .then((data) => {
        const impresoras = data;

        for (let impresora of impresoras) {
          let divRow = document.createElement("div");
          divRow.classList.add("row");
          contenedor.appendChild(divRow);

          let divCol = document.createElement("div");
          divCol.classList.add("col-sm-4");
          divRow.appendChild(divCol);

          let enlace = document.createElement("div");
          enlace.addEventListener("click", () => imprimir(impresora.id));
          divCol.appendChild(enlace);

          let img = document.createElement("img");
          img.src = `images/${impresora.id}.jpg`;
          img.alt = impresora.id;
          enlace.appendChild(img);

          let contenedorToner = document.createElement("div");
          contenedorToner.classList.add("row");

          let divToner = document.createElement("div");
          divToner.classList.add("toner");
          contenedorToner.appendChild(divToner);

          divCol.appendChild(contenedorToner);

          let divNegro = document.createElement("div");
          divNegro.classList.add("tinta");
          divNegro.style.backgroundColor = `black`;
          divNegro.textContent = `${impresora.negro}%`;
          divToner.appendChild(divNegro);

          let divAmarillo = document.createElement("div");
          divAmarillo.classList.add("tinta");
          divAmarillo.style.backgroundColor = `yellow`;
          divAmarillo.textContent = `${impresora.amarillo}%`;
          divToner.appendChild(divAmarillo);

          let divCyan = document.createElement("div");
          divCyan.classList.add("tinta");
          divCyan.style.backgroundColor = `cyan`;
          divCyan.textContent = `${impresora.cyan}%`;
          divToner.appendChild(divCyan);

          let divMagenta = document.createElement("div");
          divMagenta.classList.add("tinta");
          divMagenta.style.backgroundColor = `magenta`;
          divMagenta.textContent = `${impresora.magenta}%`;
          divToner.appendChild(divMagenta);

          let contenedorLista = document.createElement("div");
          contenedorLista.classList.add("row");

          let lista = document.createElement("ul");
          lista.classList.add("list-group");
          lista.id = `listaHojas_${impresora.id}`;
     
          let listaHojas = JSON.parse(sessionStorage.getItem("listaHojas"));

          listaHojas.forEach((hojas, i) => {
            const papel = Object.keys(hojas)[0];
            if (papel === impresora.id) {
              hojas[papel].forEach(hoja => {
                let li = document.createElement("li");
                li.classList.add("list-group-item");
                li.innerHTML = hoja;
                lista.appendChild(li);
              });
            }
                    
          });
          contenedorLista.appendChild(lista);

          divCol.appendChild(contenedorLista);
        }
      })
      .catch((error) => console.error(error));
  }

  function añadirHojas() {
    contador++;
    contadorHojas.innerHTML = contador;
    sessionStorage.setItem("contadorHojas", contador);

    let n_impresora = document.getElementById("n_impresora").value;
    let texto = document.getElementById("texto").value;
    // Obtengo la lista de hojas de la sesión y convertirla a un objeto
    let listaHojas = JSON.parse(sessionStorage.getItem("listaHojas"));
    // Encontrar la impresora del id que le paso
    let impresora = listaHojas.find((i) => Object.keys(i)[0] === n_impresora);
    impresora[n_impresora].push(texto);
    sessionStorage.setItem("listaHojas", JSON.stringify(listaHojas));
  
    anadirHojasAImpresora(listaHojas, n_impresora);

  }  

  function anadirHojasAImpresora(listaHojas, n_impresora) {
    let lista = document.getElementById("listaHojas_" + n_impresora);
    lista.innerHTML = "";
    // Añadir la lista de hojas a la lista HTML
    listaHojas.forEach((hojas, i) => {
      const papel = Object.keys(hojas)[0];
      if (papel === n_impresora) {
        hojas[papel].forEach(hoja => {
          let li = document.createElement("li");
          li.classList.add("list-group-item");
          li.innerHTML = hoja;
          lista.appendChild(li);
        });
      }      
    });
  }
  

  function imprimir(id) {
    fetch(`/impresoras/${id}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        
        let listaHojas = JSON.parse(sessionStorage.getItem("listaHojas"));
        let impresora = listaHojas.find((i) => Object.keys(i)[0] === id);
        impresora[id].shift();
        sessionStorage.setItem("listaHojas", JSON.stringify(listaHojas));
  
        getImpresoras();
      })
      .catch((error) => console.error(error));
  }
  
});
