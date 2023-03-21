let formulario = document.querySelector('#eliminarCountry')
let nombre = document.querySelector('#nombre')
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
 let nombrePais = nombre.value;
    fetch("/eliminar/"+nombrePais , {
        method: "delete"
    })
    .then(response => response.json())
    .then(data => {
        if(data.code != 200){
            alert("Algo ha pasado!: " + data.error)
        }else{
            alert(data.message)
        }
    }).catch(error => {
        alert("Algo ha fallado al realizar la consulta")
    })
})