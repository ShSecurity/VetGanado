document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formularioOvinos'); // Cambio de ID
    formulario.addEventListener('submit', agregarOvino); // Cambio de función

    mostrarOvinos(); // Cambio de función
});

function agregarOvino(event) { // Cambio de función y variables
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
            alert('Ovino agregado correctamente'); // Cambio de mensaje
            mostrarOvinos(); // Cambio de función
            event.target.reset();
        } else {
            alert('Error al agregar el ovino'); // Cambio de mensaje
        }
    });
}

function mostrarOvinos() { // Cambio de función y variables
    const tablaOvinos = document.getElementById('tablaOvinos'); // Cambio de ID
    tablaOvinos.innerHTML = '';

    fetch('acciones.php?accion=mostrarOvinos') // Cambio de acción
    .then(response => response.json())
    .then(data => {
        const ovinos = data.ovinos; // Cambio de variable
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
        ovinos.forEach(ovino => { // Cambio de variable
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ovino.id}</td>
                <td>${ovino.nombre}</td>
                <td>${ovino.color}</td>
                <td>${ovino.sexo}</td>
                <td>${ovino.fecha_nacimiento}</td>
                <td>${ovino.nombre_madre}</td>
                <td>${ovino.nombre_padre}</td>
                <td>${ovino.nota}</td>
                <td>
                    <button class="btn btn-sm btn-primary editar" data-id="${ovino.id}">Editar</button>
                    <button class="btn btn-sm btn-danger eliminar" data-id="${ovino.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tablaOvinos.appendChild(table);

        const botonesEditar = document.querySelectorAll('.editar');
        botonesEditar.forEach(boton => {
            boton.addEventListener('click', editarOvino); // Cambio de función
        });

        const botonesEliminar = document.querySelectorAll('.eliminar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', eliminarOvino); // Cambio de función
        });
    });
}

function editarOvino(event) { // Cambio de función y variables
    const ovinoId = event.target.dataset.id;
    // Aquí puedes implementar la lógica para editar el ovino con el ID 'ovinoId'
    // Por ejemplo, podrías abrir un modal con los campos para editar y luego enviar los cambios a través de una nueva solicitud fetch.
}

function eliminarOvino(event) { // Cambio de función y variables
    const ovinoId = event.target.dataset.id;
    fetch(`acciones.php?accion=eliminarOvino&id=${ovinoId}`) // Cambio de acción
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Ovino eliminado correctamente'); // Cambio de mensaje
            mostrarOvinos(); // Cambio de función
        } else {
            alert('Error al eliminar el ovino'); // Cambio de mensaje
        }
    });
}
