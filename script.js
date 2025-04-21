IDS=[   "2569d4fa-eade-4a03-b769-db9be79b7694", //enero
        "7b62c87c-bef9-4784-8c79-6a421b780762", //febrero
        "6d671370-a92e-4d54-adcf-659e5c632f26", //marzo
        "0890898f-bfca-4bbd-be53-0e073ad2bf51", //abril
        '54606da2-734c-4864-88df-423bbbd2eab9', //mayo
        "a1416e34-8ce8-4e5c-aaf1-7d8876896427", //Junio
        "843f906c-e67e-4b04-9063-055c7bba8a72", //Julio
        'c38a42a5-f52b-42cd-97ae-f85ab9fec4a0', //Agosto
        "b1acb29c-1083-4db5-a8e1-a8ae8bbf2b1c", //Septiempre
        "43a8f21d-34d7-4765-a6de-0015b88c6ae5", //octubre
        "f4839b66-3580-4daf-95f6-c2e80ddf8f8f", //Noviembre
        "564dc549-dd01-42db-b1b0-bafe135f4c35"  //Diciembre
    ]

//Direccion api, tiene un limite de 100 y en la respuesta tiene pre calculado el query de los restantes
url='https://datos.gob.cl/api/3/action/datastore_search?resource_id=' 

//Falto agregar alguna manera de cargas los siguientes 100 registros cuando la api indique que haya mas

const dataTableOptions = {
    scrollX: true,
    scrollCollapse: true,
    scrollY: 'calc(100vh - 40vh)',
    fixedHeader: true,
    lengthMenu: [5, 10, 15, 20, 100],
    columnDefs: [
        { className: "text-center", targets: "_all" },
        { orderable: false, targets: [1, 2, 15] },
        { searchable: false, targets: [1,2] },
        { width: "250px", targets: [4, 6, 8, 10, 12, 14, 17, 18] }
    ],
    pageLength: 10,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún Registro Encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Informacion no encontrada",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

let dataTable;
let dataTableIsInitialized = false;

const initDataTable = async () => {
    if (dataTableIsInitialized)
        dataTable.destroy()
        dataTableIsInitialized=false

    dataTable = $("#datatable_inversiones").DataTable(dataTableOptions);
    dataTableIsInitialized=true;
}


function SolicitarDatos(key){
    fetch(url+IDS[key])
    .then (response => {
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status} - ${response.statusText}`);
        }
        return response.json()
    })
    .then(data => { 
        if (!data.result || !data.result.fields || !data.result.records) {
            throw new Error('Estructura de datos incorrecta en la respuesta');
        }
        
        
        console.log(data)        
        
        const tabla = document.getElementById("tabla")
        console.log(tabla)
        tabla.innerHTML=`<table class="table table-bordered table-hover table-fixed" id="datatable_inversiones">
                    <thead class="table-light">
                    </thead>
                    <tbody>
                    </tbody>
                </table>`
        InsertarColumnas(data.result.fields)
        insertarFilas(data.result.records)
        initDataTable()
    })
    .catch(error =>{
        console.error(error);
        const tabla = document.getElementById("tabla");
        tabla.innerHTML=`
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar datos</h4>
                <p>${error.message || 'No se pudieron cargar los datos solicitados'}</p>
            </div>
        `;
    })
}

function InsertarColumnas(columnas){
    // const current_columnas = document.querySelectorAll('thead th')
    const thead=document.querySelector('thead');
    const tr = document.createElement('tr')
    columnas.forEach(columna =>{
        const th = document.createElement('th')
        th.textContent = columna.id
        tr.appendChild(th)
    });
    thead.appendChild(tr)

}

function insertarFilas(filas){
    const tbody = document.querySelector("tbody");
    filas.forEach(fila => {
        const tr = document.createElement('tr');

        
        Object.values(fila).forEach(valorColumna => {
            const td = document.createElement('td');
            td.textContent = valorColumna;
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr); // Inserta aquí la fila
    });
}

function selectMonth(index) {
    // Update active class
    const links = document.querySelectorAll('.resource-sidebar .list-group-item');
    links.forEach(link => link.classList.remove('active'));
    links[index].classList.add('active');
    
    // Update header title
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.querySelector('.sticky-header h2').textContent = `Inversiones ${months[index]} 2024 (en pesos)`;
    
    // Request data for selected month
    SolicitarDatos(index);
}


