let btnSiguiente = document.getElementById("btnSiguiente");
let option = document.getElementById("option");
btnSiguiente.addEventListener("click", (e) => {
    e.preventDefault()
    let ultimoOffset = parseInt(btnSiguiente.dataset.offset) || 0;
    ultimoOffset += parseInt(option.value);
    // console.log(typeof (ultimoOffset))
    if (ultimoOffset == NaN) { ultimoOffset = 0 };
    location.href = `http://localhost:3000/?limit=${option.value}&offset=${ultimoOffset}`
})


