IDS=[   "2569d4fa-eade-4a03-b769-db9be79b7694", //enero
        "7b62c87c-bef9-4784-8c79-6a421b780762", //febrero
        "6d671370-a92e-4d54-adcf-659e5c632f26", //marzo
        "0890898f-bfca-4bbd-be53-0e073ad2bf51", //abril
        '54606da2-734c-4864-88df-423bbbd2eab9', //mayo
        "a1416e34-8ce8-4e5c-aaf1-7d8876896427", //Junio
        "843f906c-e67e-4b04-9063-055c7bba8a72", //Julio
        'c38a42a5-f52b-42cd-97ae-f85ab9fec4a0', //Agosto
        "43a8f21d-34d7-4765-a6de-0015b88c6ae5", //octubre
        "f4839b66-3580-4daf-95f6-c2e80ddf8f8f", //Noviembre
        "564dc549-dd01-42db-b1b0-bafe135f4c35"  //Diciembre
    ]

//Direccion api, tiene un limite de 100 y en la respuesta tiene pre calculado el query de los restantes
url='https://datos.gob.cl/api/3/action/datastore_search?resource_id=' 


function SolicitarDatos(key){
    fetch(url+key)
    .then (response => response.json())
    .then(data => { 
        columnas=data.result.fields //columas de todas las filas
        filas=data.result.records
        console.log(columnas)
        console.log(filas)
        CheckColumnas(columnas)
        insertarFilas(filas)
        
    });
}

function CheckColumnas(columnas){
    const current_columnas = document.querySelectorAll('thead th')
    const nombre_columnas = Array.from(current_columnas).map(col => col.textContent);
    const tbody=document.querySelector('tbody');
    const thead=document.querySelector('thead');
    for (let i of columnas){
        console.log(i)
        if (!nombre_columnas.includes(i.id))            
            tbody.innerHTML=''
            thead.innerHTML=''
            const tr = document.createElement('tr')
                thead.appendChild(tr)
            columnas.forEach(columna =>{
                const th = document.createElement('th')
                th.textContent=columna.id
                tr.appendChild(th)
            return false
            })
    }
    return true
}

function insertarFilas(filas){
    filas.forEach(fila => {
        const tr = document.createElement('tr');
        document.querySelector('tbody').appendChild(tr)
        Object.values(fila).forEach(valorColumna =>{
            const td= document.createElement('td')
            td.textContent= valorColumna
            tr.appendChild(td)
        })
    });
}


function DatosEnero(){
    SolicitarDatos(IDS[0])
}

