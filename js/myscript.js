//https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0
// Descrizione:
// Creiamo un calendario dinamico con le festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
// Milestone 1
// Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.
// Milestone 2
// Diamo la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività.
// Attenzione!
// Ogni volta che cambio mese dovrò:
// Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
// Controllare quanti giorni ha il mese scelto formando così una lista
// Chiedere all’API quali sono le festività per il mese scelto
// Evidenziare le festività nella lista

$(document).ready(function(){

    //leggo attributo per cambio mese:
    var dataPartenza = moment($('h1.nome-mese').attr('data-formato'));

    // //creo oggetto moment con data di partenza: 2018-01-01
    var data = moment('2018-01-01');

    // richiamo funzioni:
    insertDays(data);
    insertHolidays(data);

    $('button#successivo').click(function(){
        next(dataPartenza);
    });

    $('button#precedente').click(function(){
        prev(dataPartenza);
    });
});



//****FUNZIONI****//:

function addZero(n){
    if (n < 10) {
        return '0' + n
    }
    return n;
}

// creo funzione per ins. giorni e festività e definisco var per i gg, mesi e anno + uso daysInMonth per ottenere il n. dei gg con ciclo for:

function insertDays(data) {

    $('ul.giorni-mese').empty();

    var giorni = data.daysInMonth();
    var mese = data.format('MMMM');
    var anno = data.format('YYYY');
    $('h1.nome-mese').html(mese + ' ' + anno);

    for (var i = 1; i <= giorni; i++) {
        var source = $("#template-giorni").html();
        var template = Handlebars.compile(source);

        var context = {
            day: addZero(i),
            month: mese,
            year: anno,
            dataCompleta: anno + '-' + data.format('MM') + '-' + addZero(i)
        };
        var html = template(context);

        $('.giorni-mese').append(html);
    }
}

function insertHolidays(data){
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            year: data.year(),
            month: data.month()
        },
        success: function(risposta){
            var vacanze = risposta.response
            // console.log(risposta.response);
            for (var i = 0; i < vacanze.length; i++) {
                // var vacanze = risposta.response;
                var vacanza = vacanze[i];
                // console.log(vacanza);
                var lista = $('li[data-data-completa="' + vacanza.date +'"]');
                // console.log(lista);
                lista.append(' - ' + vacanza.name);
                lista.addClass('holiday');
                console.log(lista);
            }
        },
        error: function(){
            alert('errore');
        }
    })
}

function next(data){

    if (data.month() == 11) {
        alert('Non puoi proseguire');
    } else {
        data.add(1,'months');
        insertDays(data);
        insertHolidays(data);
    }
}

function prev(data){

    if (data.month() == 0) {
        alert('Non puoi proseguire');
    } else {
        data.subtract(1,'months');
        insertDays(data);
        insertHolidays(data);
    }
}
