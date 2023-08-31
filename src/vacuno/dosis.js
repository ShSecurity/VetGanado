document.addEventListener('DOMContentLoaded', function () {
    const listaVacas = document.getElementById('listaVacas');
    const formularioDosis = document.getElementById('formularioDosis');
    const selectVacaNombre = document.getElementById('vacaNombre');

    fetch('dosis.php?accion=mostrarVacas')
      .then(response => response.json())
      .then(data => {
        const vacas = data.vacas;
        vacas.forEach(vaca => {
          const option = document.createElement('option');
          option.value = vaca.id;
          option.textContent = vaca.nombre;
          selectVacaNombre.appendChild(option);
        });

        formularioDosis.addEventListener('submit', agregarDosis);
        mostrarVacas();
      });
});

function agregarDosis(event) {
    event.preventDefault();

    const idVaca = document.getElementById('vacaNombre').value;
    const fechaDosis = document.getElementById('fechaDosis').value;
    const actividad = document.getElementById('actividad').value;
    const producto = document.getElementById('producto').value;
    const dosis = document.getElementById('dosis').value;
    const diasProximaDosis = document.getElementById('diasProximaDosis').value;
    const observaciones = document.getElementById('observaciones').value;

    const formData = new FormData();
    formData.append('idVaca', idVaca);
    formData.append('fechaDosis', fechaDosis);
    formData.append('actividad', actividad);
    formData.append('producto', producto);
    formData.append('dosis', dosis);
    formData.append('diasProximaDosis', diasProximaDosis);
    formData.append('observaciones', observaciones);

    fetch('dosis.php?accion=agregarDosis', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Dosis agregada correctamente');
        mostrarVacas();
        event.target.reset(); // Limpia el formulario
      } else {
        alert('Error al agregar la dosis');
      }
    });
}

function mostrarVacas() {
    const listaVacas = document.getElementById('listaVacas');
    listaVacas.innerHTML = '';

    fetch('dosis.php?accion=mostrarVacas')
      .then(response => response.json())
      .then(data => {
        const vacas = data.vacas;
        vacas.forEach(vaca => {
          const vacaItem = document.createElement('li');
          vacaItem.className = 'list-group-item';
          vacaItem.innerHTML = `
            <h5>${vaca.nombre}</h5>
            <p>Color: ${vaca.color}</p>
            <p>Fecha de Nacimiento: ${vaca.fecha_nacimiento}</p>
            <button class="btn btn-primary btn-sm ver-dosis" data-id="${vaca.id}">Ver Dosis</button>
          `;
          listaVacas.appendChild(vacaItem);

          const btnVerDosis = vacaItem.querySelector('.ver-dosis');
          const dosisTabla = document.createElement('div');
          dosisTabla.className = 'table-responsive';
          dosisTabla.style.display = 'none';
          vacaItem.appendChild(dosisTabla);

          btnVerDosis.addEventListener('click', () => mostrarDosis(vaca.id, dosisTabla));
        });
      });
}


function mostrarDosis(idVaca, dosisTabla) {
    if (dosisTabla.innerHTML.trim() === '') {
        fetch(`dosis.php?accion=mostrarDosis&id=${idVaca}`)
          .then(response => response.json())
          .then(data => {
            const dosis = data.dosis;
            if (dosis.length > 0) {
              dosisTabla.style.display = 'block';
              dosisTabla.innerHTML = `
                <table class="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Actividad</th>
                      <th>Producto</th>
                      <th>Dosis</th>
                      <th>Próxima Dosis</th>
                      <th>Observaciones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dosis.map(d => `
                      <tr>
                        <td>${d.Fecha}</td>
                        <td>${d.actividad}</td>
                        <td>${d.producto}</td>
                        <td>${d.dosis}</td>
                        <td>${calcularProximaDosis(d.Fecha, d.dias)}</td>
                        <td>${d.observaciones}</td>
                        <td><button class="btn btn-danger btn-sm eliminar-dosis" data-id="${d.id}">Eliminar</button></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `;

              const btnEliminarDosis = dosisTabla.querySelectorAll('.eliminar-dosis');
              btnEliminarDosis.forEach(btn => {
                btn.addEventListener('click', () => eliminarDosis(btn.dataset.id, dosisTabla));
              });
            } else {
              dosisTabla.innerHTML = '<p>No hay dosis registradas para esta vaca.</p>';
            }
          });
    } else {
        dosisTabla.style.display = dosisTabla.style.display === 'none' ? 'block' : 'none';
    }
}

function calcularProximaDosis(fechaUltimaDosis, diasProximaDosis) {
    const fechaUltimaDosisObj = new Date(fechaUltimaDosis);
    const fechaProximaDosisObj = new Date(fechaUltimaDosisObj);
    fechaProximaDosisObj.setDate(fechaUltimaDosisObj.getDate() + parseInt(diasProximaDosis));
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return fechaProximaDosisObj.toLocaleDateString('en-US', options);
}


function eliminarDosis(idDosis, dosisTabla) {
    fetch(`dosis.php?accion=eliminarDosis&id=${idDosis}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Dosis eliminada correctamente');
          const vacaItem = dosisTabla.parentElement;
          const idVaca = vacaItem.querySelector('.ver-dosis').dataset.id;
          mostrarDosis(idVaca, dosisTabla);
        } else {
          alert('Error al eliminar la dosis');
        }
      });
}

