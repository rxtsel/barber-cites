let pagina = 1;
const cita = {
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarApp();
});

function iniciarApp() {
  showServices();

  // funcion que resalta tab
  mostrarSeccion();

  // funcion que muestra u oculta una seccion
  cambiarSeccion();

  // paginador siguiente
  pgNext();

  // paginador anterior
  pgPrev();

  // comprueba la pg actual para mostrar u ocultar el paginador
  btnPg();
  
  // muestra mensaje de cita o mensaje de error
  mostrarResumen();

  // guarda el nombre de la cita en el objeto
  nombreCita();

  // almacena las fechas en el objeto
  fechaCita();

  // desabilitar dias pasados
  inactiveDatePrev();

  // almacena la hora de la cita en el objeto
  horaCita();
};

function mostrarSeccion(){
  //  eliminar showSeccion de la seccion anterior
  const seccionAnterior = document.querySelector('.show-seccion');
  if (seccionAnterior) {
      seccionAnterior.classList.remove('show-seccion');
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add('show-seccion');

  //  eliminar clase actual del tab anterior
  const tabAnterior = document.querySelector('.tabs .actual');
  if (tabAnterior) {
    tabAnterior.classList.remove('actual');
  }

  // resalta tab actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add('actual');

}

function cambiarSeccion(){
 const enlaces = document.querySelectorAll('.tabs button');
 enlaces.forEach(enlace => {
  enlace.addEventListener('click', e => {
   e.preventDefault();
   pagina = parseInt(e.target.dataset.paso);

  // llama funcion que muestra seccion
  mostrarSeccion();

  // llamar botones paginador
  btnPg();
  }); 
 });
};

async function showServices() {
  try {
    const result = await fetch('./servicios.json');
    const typeResult = await result.json();
    const { servicios } = typeResult;

    // generar html
    servicios.forEach(servicio => {
      const { id, nombre, precio, title } = servicio;

      // DOM Scripting
      const nombreServicio = document.createElement('H3');
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add('nombreServicio');

      const precioServicio = document.createElement('P');
      precioServicio.textContent = `$ ${precio}.000`
      precioServicio.classList.add('precioServicio');

      const contenedorServicio = document.createElement('DIV');
      contenedorServicio.classList.add('contenedorServicio');
      contenedorServicio.dataset.idServicio = id;

      const titleAtr = document.createAttribute('title');
      titleAtr.value = `${title}`;
      precioServicio.setAttributeNode(titleAtr);

      // Seleccion de servicio
      contenedorServicio.onclick = seleccionarServicio;
      contenedorServicio.appendChild(nombreServicio);
      contenedorServicio.appendChild(precioServicio);

      document.querySelector('#servicios').appendChild(contenedorServicio);

    });

  } catch (error) {
    console.log('error al descargar servicios');
  }
}

// FUNCION SELECCIONAR SERVICIO
function seleccionarServicio(e) {

  let elemento;
  // si da click en un p o un h3 entonces forzamos a que de click al div con el dataid
  if (e.target.tagName === 'P' || e.target.tagName === 'H3') {
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }

  if (elemento.classList.contains('seleccionado')) {
    elemento.classList.remove('seleccionado');

    const id = parseInt(elemento.dataset.idServicio);
    deleteService(id);
  } else {
    elemento.classList.add('seleccionado');

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent
    }
    addService(servicioObj);
  };
}

function pgPrev() {
  const prev = document.querySelector('#prev');
  prev.addEventListener('click', () => {
    pagina--;
    btnPg();
  });
};

function pgNext(){
  const next = document.querySelector('#next');
  next.addEventListener('click', () => {
    pagina++;
    btnPg();
  });
};

function btnPg(){
  const next = document.querySelector('#next');
  const prev = document.querySelector('#prev');

  if(pagina == 1){
    prev.classList.add('hidden');
  }else if(pagina == 3){
    next.classList.add('hidden');
    prev.classList.remove('hidden');
    mostrarResumen();
  } else {
    prev.classList.remove('hidden');
    next.classList.remove('hidden');
  }

  mostrarSeccion(); // cambia seccion que se muestra
};

function mostrarResumen() {
  // destructuring
  const { nombre, fecha, hora, servicios } = cita;

  // seleccionar div de resumen
  const contentResume = document.querySelector('.resumen');

  // limpia html
  while(contentResume.firstChild){
    contentResume.removeChild(contentResume.firstChild);
  }

  // validacion
  if (Object.values(cita).includes('')) {
    const noServicios = document.createElement('P');
    noServicios.textContent = 'Faltan datos de servicios, fecha, hora o nombre';
    noServicios.classList.add('invalid-cite');
    // agregar al resumen
    contentResume.appendChild(noServicios);
    return;
  }

  // mostrar resumen

  const resumenCita = document.createElement('H3');
  resumenCita.classList.add('resumen-cita');
  resumenCita.textContent = 'Resumen de cita';

  const nombreCita = document.createElement('P');
  nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`

  const servicioCita = document.createElement('DIV');
  servicioCita.classList.add('resumen-servicios');

  const headingServicios = document.createElement('H3');
  headingServicios.classList.add('heading-servicios');
  headingServicios.textContent = 'Tus servicios';

  let cantidad = 0;

  // iterar por los servicios del arreglo
  servicios.forEach( servicio => {
    const {nombre, precio} = servicio;

    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');

    const nombreServicio = document.createElement('P');
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = precio;

    const totalServicio = precio.split('$') 
    // console.log( parseInt(totalServicio[1].trim()) );
    cantidad += parseInt(totalServicio[1].trim());

    // agregar nombre y precio a contenedor servicio
    contenedorServicio.appendChild(nombreServicio);
    contenedorServicio.appendChild(precioServicio);
    servicioCita.appendChild(contenedorServicio);

  });
  
  contentResume.appendChild(resumenCita);
  contentResume.appendChild(nombreCita);
  contentResume.appendChild(fechaCita);
  contentResume.appendChild(horaCita);
  contentResume.appendChild(headingServicios);
  contentResume.appendChild(servicioCita);

  const totalPagar = document.createElement('P');
  totalPagar.classList.add('total-pagar');
  totalPagar.innerHTML = `Total a pagar: <span>$${cantidad}.000</span>`;

  contentResume.appendChild(totalPagar);
};

function addService(servicioObj) {
  const { servicios } = cita;
  cita.servicios = [...servicios, servicioObj];
};

function deleteService(id) {
  const { servicios } = cita;
  cita.servicios = servicios.filter(servicio => servicio.id !== id);
};

function nombreCita() {
  const nombreInput = document.querySelector('#nombre');
  nombreInput.addEventListener('input', e => {
    const nombretexto = e.target.value.trim();
    if (nombretexto == '' || nombretexto.length <= 2) {
      alerta('Nombre no valido', 'error');
    } else {
      const alerta = document.querySelector('.alerta');
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombretexto;
    }
  });
};

function alerta(mensaje, tipo) {
  const alertaPrevia = document.querySelector('.alerta');
  if (alertaPrevia) {
    return;
  }

  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  if (tipo == 'error') {
    alerta.classList.add('error');
  }

  const form = document.querySelector('.form');

  form.appendChild(alerta);

  // remover alerta a ls 3s
  setTimeout(() => {
    alerta.remove();
  }, 3000);
};

function fechaCita() {
  const fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', e => {
    const dia = new Date(e.target.value).getUTCDay();
    if ([0].includes(dia)) {
      alerta('Los domingos sólo trabajamos hasta medio día', 'error')
      cita.fecha = fechaInput.value;
    } else if ([6].includes(dia)) {
      alerta('Los sabados atendemos hasta las 7pm', 'error');
      cita.fecha = fechaInput.value;
    } else {
      cita.fecha = fechaInput.value;
    }
  })
};

function inactiveDatePrev() {
  const inputFecha = document.querySelector('#fecha');

  const fechaActual = new Date();
  const year = fechaActual.getFullYear();
  const day = fechaActual.getDate() + 1;
  const month = fechaActual.getMonth() + 1;

  // formato deseado AAAA-MM-DD
  if (month < 10) {
    var newMonth = '0' + month;
  } else {
    return month;
  }
  const fechaDesabilitar = `${year}-${newMonth}-${day}`;
  // fecha a desabilitar
  inputFecha.min = fechaDesabilitar;
};

function horaCita(){
  const horaInput = document.querySelector('#hora');
  horaInput.addEventListener('input', e => {
    const horaCita = e.target.value;
    const hora = horaCita.split(':')
    if(hora[0] < 8 || hora[0] > 22){
      alerta(`Sólo atendemos de 8AM a 10PM`, 'error')
      setTimeout(() => {
        horaInput.value = ''
      }, 3000);
    }else {
      cita.hora = horaCita;
    }
  });
};