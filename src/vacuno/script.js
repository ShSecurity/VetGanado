document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formularioVacas');
    formulario.addEventListener('submit', agregarVaca);
  
    mostrarVacas();
  });
  
  function agregarVaca(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const color = document.getElementById('color').value;
    const sexo = document.getElementById('sexo').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const nombreMadre = document.getElementById('nombreMadre').value;
    const nombrePadre = document.getElementById('nombrePadre').value;
    const nota = document.getElementById('nota').value;
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('color', color);
    formData.append('sexo', sexo);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('nombreMadre', nombreMadre);
    formData.append('nombrePadre', nombrePadre);
    formData.append('nota', nota);
  
    fetch('acciones.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Vaca agregada correctamente');
        mostrarVacas();
        event.target.reset(); // Limpia el formulario
      } else {
        alert('Error al agregar la vaca');
      }
    });
  }
  
  function mostrarVacas() {
    const tablaVacas = document.getElementById('tablaVacas');
    tablaVacas.innerHTML = '';
  
    fetch('acciones.php?accion=mostrar')
      .then(response => response.json())
      .then(data => {
        const vacas = data.vacas;
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'mt-4');
  
        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Color</th>
            <th>Sexo</th>
            <th>Fecha de Nacimiento</th>
            <th>Madre</th>
            <th>Padre</th>
            <th>Nota</th>
            <th>Acciones</th>
          </tr>
        `;
  
        const tbody = document.createElement('tbody');
        vacas.forEach(vaca => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${vaca.id}</td>
            <td>${vaca.nombre}</td>
            <td>${vaca.color}</td>
            <td>${vaca.sexo}</td>
            <td>${vaca.fecha_nacimiento}</td>
            <td>${vaca.nombre_madre}</td>
            <td>${vaca.nombre_padre}</td>
            <td>${vaca.nota}</td>
            <td>
              <button class="btn btn-sm btn-primary editar" data-id="${vaca.id}">Editar</button>
              <button class="btn btn-sm btn-danger eliminar" data-id="${vaca.id}">Eliminar</button>
            </td>
          `;
          tbody.appendChild(row);
        });
  
        table.appendChild(thead);
        table.appendChild(tbody);
        tablaVacas.appendChild(table);
  
        const botonesEditar = document.querySelectorAll('.editar');
        botonesEditar.forEach(boton => {
          boton.addEventListener('click', editarVaca);
        });
  
        const botonesEliminar = document.querySelectorAll('.eliminar');
        botonesEliminar.forEach(boton => {
          boton.addEventListener('click', eliminarVaca);
        });
      });
  }
  
  function editarVaca(event) {
    const vacaId = event.target.dataset.id;
    // Aquí puedes implementar la lógica para editar la vaca con el ID 'vacaId'
    // Por ejemplo, podrías abrir un modal con los campos para editar y luego enviar los cambios a través de una nueva solicitud fetch.
  }
  
  function eliminarVaca(event) {
    const vacaId = event.target.dataset.id;
    fetch(`acciones.php?accion=eliminar&id=${vacaId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Vaca eliminada correctamente');
          mostrarVacas();
        } else {
          alert('Error al eliminar la vaca');
        }
      });
  }
  