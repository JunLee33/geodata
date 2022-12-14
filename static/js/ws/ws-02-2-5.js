let sensor_id = "";
let datarogger_id = "";
let sensor_name = "";
let sensordata = [];
let graphdata = [];
let project_id = "";
let sensor_detail_id = "";
let sensorgroup_type = "";

// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_gauge_factor = "";

let get_initial_date = "";

$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')
    // datarogger_id = urlParams.get('datarogger_id')
    // sensor_name = urlParams.get('sensor_name')
    sensorgroup_type = urlParams.get('Hlw')

    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)

    console.log(date_time_end, date_time_start, time,intervalday )



    $('#topsensername').text(sensor_name)

    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_id,
        type:"get",
        contentType: false,
        processData : false,
        async : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
             console.log(json.data)

             sensordata = json.data
             sensor_detail_id = sensordata[0].sensor_detail_id
             
             sensor_gauge_factor = sensordata[0].sensor_gauge_factor
             $('#guideFactor').prepend(sensor_gauge_factor)
             $('#sensorLocation').text(sensordata[0].place_lat + ", "+sensordata[0].place_lng)
             $('#projectName').text(sensordata[0].project_name)
             $('#initialDate').text(sensordata[0].sensor_initial_date)
            //  $('#guideFactor').html(sensor_gauge_factor+"<a href='#guage-factor' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle id='gaugefactormodal'></a>")
             
            // level1_max = sensordata[0].sensor_gl1_max
            // level1_min = sensordata[0].sensor_gl1_min
            // level2_max = sensordata[0].sensor_gl2_max
            // level2_min = sensordata[0].sensor_gl2_min
            // level3_max = sensordata[0].sensor_gl3_max
            // level3_min = sensordata[0].sensor_gl3_min

            // $('#chart').attr("href", "ws-02-2-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#data').attr("href", "ws-02-2-3?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#fomula').attr("href", "ws-02-2-4?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#info').attr("href", "ws-02-2-5?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            
    

            $('#gl1max').text(sensordata[0].sensor_gl1_max)
            $('#gl1min').text(sensordata[0].sensor_gl1_min)
            $('#gl2max').text(sensordata[0].sensor_gl2_max)
            $('#gl2min').text(sensordata[0].sensor_gl2_min)
            $('#gl3max').text(sensordata[0].sensor_gl3_max) 
            $('#gl3min').text(sensordata[0].sensor_gl3_min)

            
           $('#sensorName').text(sensordata[0].sensor_display_name)
           $('#gaugefactormodalname').text(sensordata[0].sensor_display_name)
           $('#snesorSN').text(sensordata[0].sensor_sn)
           if(sensordata[0].sensor_initial){$('#sensorLocation').text(sensordata[0].sensor_initial)}
           $('#placeName').text(sensordata[0].place_name)

           $('#topname').text(sensordata[0].sensor_display_name)

           get_initial_date = sensordata[0].sensor_initial_date;
            
            $('#date_time_start').datetimepicker({minDate:(get_initial_date)});

            let startday = moment($('#date_time_start').val(), 'YYYY-MM-DDTHH:mm:ssZ');
            let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ');

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:(get_initial_date)});
            }
        //    $('#guideFactor').text(sensordata[0].place_name)
         }
    })


    //guide btn
    $('#savebtn').click(function(){

        let sensor_gauge_factor = $('#gaudefactorint').val()

        console.log(sensor_gauge_factor, sensor_detail_id)

        if(sensor_gauge_factor.length == 0){alert("?????? ????????? ?????????"); $('#gaudefactorint').focus(); return;}
        
        console.log(sensor_gauge_factor)
        let searchvalue = '.'; 
    
        let pos = 0;
        let cnt_dot = 0;
        while (true) {
            let foundPos = sensor_gauge_factor.indexOf(searchvalue, pos);
            if (foundPos == -1){
                break;
            }else if(foundPos == 0 || foundPos == sensor_gauge_factor.length - 1){
                alert("?????? ??????????????????.");
                return;
            } 
            pos = foundPos + 1; 
            cnt_dot++;
        }
    
        if(cnt_dot > 1){
            alert("?????? ??????????????????.");
            return;
        }


        $.ajax({
            url:"sensordetail/guidline?sensor_gauge_factor="+sensor_gauge_factor+"&sensor_detail_id="+sensor_detail_id,
            type:"get",
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                 alert("Gauge Factor??? ?????????????????????.")
                 console.log(json.resultString)

                 window.location.reload()
    
               
             }
        })
    })

    $('#gaugefactormodal').click(function(){
        console.log("????????? ???")
        
        if(sensor_gauge_factor){$('#gaudefactorint').val(sensor_gauge_factor)}
    })


    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    })


});








function chartlocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-1?"+encodeURIComponent(uri)
   
}
function datalocation(){  
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-3?" + encodeURIComponent(uri)
   
}
function fomulalocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4?"+encodeURIComponent(uri)
}
function infolocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-5?"+encodeURIComponent(uri)
}