const container = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais   = document.querySelector('#pais').value;

    if(ciudad == '' || pais == ''){
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');

        return;
    }
    // Consultar API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje){
    const alerta = document.querySelector('.alert');
    if(!alerta){
        // Creación de la alerta
        const alerta = document.createElement('div');
        alerta.classList.add('.alert');

        alerta.innerHTML = `
            <br>
            <strong class="alert">¡Error!</strong>
            <br><br>
            <span class="alert">${mensaje}</span>
        `;

        container.appendChild(alerta);

        // Se elimina la alerta luego de 5 segundos
        setTimeout(()=>{
            alerta.remove();
        },5000);
    }
}

function consultarAPI(ciudad, pais){

    const appId = '1921f36b96addc10c3df242e6103e381';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML(); //Limpiar HTML Previo
            if(datos.cod == "404"){
                mostrarError('Ciudad no encontrada');
                return;
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos);
            console.log(datos.weather[0].description);
        });
}

function mostrarClima(datos){
    const { main: { temp, temp_max, temp_min, description } } = datos;

    const centigrados = kelvinCentigrados(temp);
    const max = kelvinCentigrados(temp_max);
    const min = kelvinCentigrados(temp_min);
    var desc = datos.weather[0].main;
    var main = datos.weather[0].description;

    // const weather = document.createElement('p');
    // weather.style.fontSize = '28px';
    // weather.style.fontWeight = 'bold';
    // weather.style.borderStyle = 'none';
    // weather.innerHTML = `${desc}`;
    // weather.classList.add('weather');
    var content = document.querySelector('.content');
    var weather_info = document.querySelector('.weather-info');
    weather_info.textContent = main;
    console.log(datos.weather[0].main);

    if(desc == 'Clouds'){
        content.style.backgroundImage = 'url("../img/few-clouds.jpg")';
    } else if(desc == 'Drizzle'){
        content.backgroundImage = 'url("../img/rain.jpg")';
    } else if(desc == 'Rain' || desc == 'Rainy'){
        content.style.backgroundImage = 'url("../img/drizzle.jpg")';
    } else if(desc == 'Wind' || desc == 'Windy'){
        content.style.backgroundImage = 'url("../img/wind.jpg")';
    } else if(desc = 'Hot'){
        content.style.backgroundImage = 'url("../img/hot.jpg")';
    } else if(desc == 'Sunny' || desc == 'Sun'){
        content.style.backgroundImage = 'url("../img/sunny.jpg")';
    } else if(desc == 'Cold'){
        content.style.backgroundImage = 'url("../img/cold.jpg")';
    } else if(desc == 'Storm' || desc == 'Stormy'){
        content.style.backgroundImage = 'url("../img/storm.jpg")';
    }

    const actual = document.createElement('p');
    actual.style.fontSize = '28px';
    actual.style.fontWeight = 'bold';
    actual.style.borderStyle = 'none';
    actual.innerHTML = `${centigrados} &#8451`;

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451`;
    tempMaxima.style.borderStyle = 'none';
    tempMaxima.style.color = '#767676';

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451`;
    tempMinima.style.borderStyle = 'none';
    tempMinima.style.color = '#767676';

    const resultadoDiv = document.createElement('div');
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    // resultadoDiv.appendChild(weather);

    resultado.appendChild(resultadoDiv);
}

const kelvinCentigrados = grados => parseInt(grados - 273.35);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}