/**
 * Medidas de rendimiento del agente aspiradora.
 * 
 * En este script se incluye la funcionalidad correspondiente al cálculo 
 * de las medidas de rendimiento definidas para el agente aspiradora.
 * 
 * @author Rodrigo Minaberrigaray
 */

/*  Define cada cuánto tiempo en ms se revisa la suciedad de las habitaciones
    (podría variar según la precisión deseada) */
const DIRT_SENSOR_INTERVAL = 100;

/*  Define el tiempo en minutos que durarán las mediciones */
const MEASURE_TIME = 1;

$("#start-measuring").click(function() {
    
    $("#start-measuring").attr("disabled", true);

    let energyUsed = 0;
    let sensorIterations = 0;
    let dirtDetected = 0;

    // Cada STEP_TIME_MS (definida en c_cleaningRobot.js) cambia la acción, entonces calculo la energia gastada
    energyInterval = setInterval(function(){
        // Asumo que gasta una unidad de energía en moverse y 3 unidades para aspirar una habitación
        switch(world.lastAction) {
            case 'SUCK':
                energyUsed += 3;
                break;
            case 'LEFT':
                energyUsed += 1;
                break;
            case 'RIGHT':
                energyUsed += 1;
                break;
        }
    }, STEP_TIME_MS);
   
    // Cada DIRT_SENSOR_INTERVAL revisa si hay alguna habitación sucia
    dirtInterval = setInterval(function(){
        sensorIterations++;

        for (let index = 0; index < world.floors.length; index++) {
            if(world.floors[index].dirty) {
                dirtDetected++;
            }
        }

    }, DIRT_SENSOR_INTERVAL);
   
    // Luego de un minuto, frena los intervalos y muestra los resultados
    setTimeout(function() {
        clearInterval(energyInterval);
        clearInterval(dirtInterval);

        /*  El nivel de suciedad se calcula dividiendo la cantidad de suciedad detectada 
            por la cantidad de iteraciones y la cantidad de habitaciones. */
        let dirtLevel = dirtDetected / (sensorIterations * world.floors.length);
        
        // Se calcula el porcenjate con una precisión de 2 decimales.
        dirtLevel = parseFloat(dirtLevel * 100).toFixed(2).replace(".", ",");

        $("#dirt-measure").html(dirtLevel);
        $("#energy-measure").html(energyUsed);

        $("#remaining-time").hide(500);
        $("#measures-results").show(500);
        $("#start-measuring").attr("disabled", false);
    }, 60000 * MEASURE_TIME);

    // Inicia el timer y lo muestra
    countdown(MEASURE_TIME);
    $("#measures-results").hide();
    $("#remaining-time").show();
});

$("#dirt-generator").click(function() {

    $("#dirt-generator").attr("disabled", true);

    /*  Cada 5 segundos genera un booleano aleatorio para cada habitación.
        Si el booleano es true (20% de probabilidad aproximadamente), ensucia la habitación correspondiente */
    generateDirtInterval = setInterval(function(){
        let randomDirtA = Math.random() >= 0.8;
        let randomDirtB = Math.random() >= 0.8;

        if (randomDirtA) {
            world.markFloorDirty(0);
            $( "svg rect:nth-child(2)" ).attr('class', 'dirty floor');
        }
        if (randomDirtB) {
            world.markFloorDirty(1);
            $( "svg rect:nth-child(3)" ).attr('class', 'dirty floor');
        }
        
    }, 5000);
    
});

/**
 * source: https://gist.github.com/adhithyan15/4350689
 */
function countdown(minutes) {
    var seconds = 60;
    var mins = minutes
    function tick() {
        var timer = document.getElementById("timer");
        var current_minutes = mins-1
        seconds--;
        timer.innerHTML = current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        if( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            if(mins > 1){
                countdown(mins-1);           
            }
        }
    }
    tick();
}