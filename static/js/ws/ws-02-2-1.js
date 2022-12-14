let sensor_id = "";
let datarogger_id = "";
let sensor_name = "";
let sensordata = [];
let graphdata = [];
let project_id = "";
let sensorgroup_type = "";

let chart;
let wchart;
let labels = [];

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let initial_data = "";

let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let topname=""

let sensor_fx_check =""
let curStart = 0;
let sensor_display_name="";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

let datalabels = [];

$(function(){
    $('#spinner_wrap').css('display','flex');
    
    // document.querySelector('html').addEventListener('wheel', preventScroll, {passive: false});
    // function preventScroll(e){
    //     e.preventDefault();
    //     e.stopPropagation();

    //     return false;
    // }
    // document.addEventListener('keydown', preventKeyBoardScroll, false);
    // document.querySelector('html').addEventListener('click', disable);
    // document.querySelector('html').addEventListener('touchmove', disable, {passive: false});
    // function disable(){
    //     document.querySelector('html').addEventListener('touchmove', preventKeyBoardScroll);
    // }
    // function preventKeyBoardScroll(e) {
    //     var keys = [32, 33, 34, 35, 37, 38, 39, 40];
    //     if (keys.includes(e.keyCode)) {
    //         e.preventDefault();
    //         return false;
    //     }
    // }


    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;
    
    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')
    // datarogger_id = urlParams.get('datarogger_id')
    // sensor_name = urlParams.get('sensor_name')
    sensorgroup_type = urlParams.get('Hlw')

    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    next_time_start = date_time_start;
    next_time_end = date_time_end;
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')
    // history.replaceState({}, null, location.pathname);

    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)

    console.log(date_time_end, date_time_start, time,intervalday )

    if(date_time_start){
        $("#date_time_start").val(date_time_start)
        $("#date_time_end").val(date_time_end)
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    }else{
        let today = moment()
        let year = today.year(); // ??????
        let month = today.month() + 1;  // ???
        let date = today.date();  // ??????
    
        let hours = today.hours(); // ???
        let minutes = today.minutes();  // ???
        console.log(minutes, String(minutes).length)
        if(String(month).length <2){month = "0"+month}
        if(String(minutes).length <2){minutes = "0"+minutes}
        if(String(date).length <2){date = "0"+date}


        let endday = year+"."+month+"."+date+" "+hours+":00"
        $("#date_time_end").val(endday)

        var Agodate = today.subtract(7,'days');
        let Agodateyear = Agodate.year(); // ??????
        let Agodatemonth = Agodate.month() + 1;  // ???
        let Agodatedate = Agodate.date();  // ??????
    
        let Agodatehours = Agodate.hours(); // ???
        let Agodateminutes = Agodate.minutes();  // ???
        if(String(Agodatemonth).length <2){Agodatemonth = "0"+Agodatemonth}
        if(String(Agodateminutes).length <2){Agodateminutes = "0"+Agodateminutes}
        if(String(Agodatedate).length <2){Agodatedate = "0"+Agodatedate}

        let startday = Agodateyear+"."+Agodatemonth+"."+Agodatedate+" "+Agodatehours+":00"

        next_time_start = startday;
        next_time_end = endday;
        $("#date_time_start").val(startday)
        $('#date_time_end').datetimepicker({minDate:startday});

    }

    
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
             console.log(sensordata)

             $('#topsensername').text(sensordata[0].sensor_name)
            level1_max = sensordata[0].sensor_gl1_max
            level1_min = sensordata[0].sensor_gl1_min
            level2_max = sensordata[0].sensor_gl2_max
            level2_min = sensordata[0].sensor_gl2_min
            level3_max = sensordata[0].sensor_gl3_max
            level3_min = sensordata[0].sensor_gl3_min

            initial_data = sensordata[0].sensor_initial_data
            sensor_display_name = sensordata[0].sensor_display_name
      

            $('#gl1max').text(sensordata[0].sensor_gl1_max)
            $('#gl1min').text(sensordata[0].sensor_gl1_min)
            $('#gl2max').text(sensordata[0].sensor_gl2_max)
            $('#gl2min').text(sensordata[0].sensor_gl2_min)
            $('#gl3max').text(sensordata[0].sensor_gl3_max) 
            $('#gl3min').text(sensordata[0].sensor_gl3_min)

            sensor_fx_check = sensordata[0].sensor_fx_check

            if(sensor_fx_check == 1){
                $('#sensorfxname').text(sensordata[0].sensor_fx1_name)
            }else if(sensor_fx_check == 2){
                $('#sensorfxname').text(sensordata[0].sensor_fx2_name)
            }else if(sensor_fx_check == 3){
                $('#sensorfxname').text(sensordata[0].sensor_fx3_name)
            }else if(sensor_fx_check == 4){
                $('#sensorfxname').text(sensordata[0].sensor_fx4_name)
            }else if(sensor_fx_check == 5){
                $('#sensorfxname').text(sensordata[0].sensor_fx5_name)
            }

            get_initial_date = sensordata[0].sensor_initial_date;
           
            // $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
            if(sensordata[0].sensor_gauge_factor){
                // $('#gaugefactorandvalue').text("Gauge Factor: 0")
                // $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
            }
            $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)
            $('#initial_datetime').val(sensordata[0].sensor_initial_date)

            
           $('#projectName').text(sensordata[0].project_name)
           $('#placeName').text(sensordata[0].place_name)

           topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
           $('#topname').text(sensordata[0].sensor_display_name)
           $('#initialsensorname').text(sensordata[0].sensor_display_name)
           $('#fomulasensorname').text(sensordata[0].sensor_display_name)

           $('#date_time_start').datetimepicker({minDate:(get_initial_date)});

            let startday = moment($('#date_time_start').val(), 'YYYY-MM-DDTHH:mm:ssZ')
            let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ')

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:(get_initial_date)});
            }
         }
    })

    searchdata()


    // $("#initialX, #initialcancle, #guidelineX, #guidelinecancle").click(function(){
    //     console.log("1")
    //     window.location.href = "ws-02-2-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&intervalday="+intervalday+"&time="+time+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
   
       
        
      
    // })

    $('#initialsave').click(function(){
        
        let confirm_txt = "?????? initial date ?????? ???????????????. ?????????????????????????"
        if(sensorgroup_type == '0206'){
            confirm_txt = "?????? initial date ?????? ???????????????. ?????????????????????????"
        }
        let saveconfirm = confirm(confirm_txt)
        if(saveconfirm){
            $('#spinner_wrap').css('display','flex');
            $('#apply_btn').attr('disabled', true);

            setTimeout(() => {
                let initial_datetime = $('#initial_datetime').val()
                console.log(initial_datetime)

                let form_data = new FormData($('#initialmodal')[0])

                form_data.append("sensor_id", sensor_id)
                form_data.append("sensor_name", sensor_name)
                form_data.append("datarogger_id", datarogger_id)
                form_data.append("sensorgroup_type", sensorgroup_type)

                for (var pair of form_data.entries()){
                    console.log(pair[0] + ":" + pair[1])
                };

                $.ajax({
                    url : "/sensordetail/initial",
                    type : "POST",
                    data : form_data,
                    contentType : false,
                    processData : false,
                    async : false,
                    error:function(err){
                        console.log(err)
                        alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                    },
                    success:function(data) {
                        alert(data.resultString)
                        // alert("initial Date??? ?????? ???????????????.")
                            let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                        window.location.href = "/ws-02-2-1?"+encodeURIComponent(uri)
                        // window.location.href = "ws-02-2-1?sensor_id="+sensor_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&intervalday="+intervalday+"&time="+time+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end
                        console.log(data.resultString)
                    }
                });

                $('#spinner_wrap').css('display','none');
                $('#apply_btn').attr('disabled', false);

            }, 500);
        }
    })



    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    })
});




function guideline(){
    console.log(sensordata)

    $('#sensorname').text(sensordata[0].sensor_display_name)

    $('#sensor_gl1_max').val(sensordata[0].sensor_gl1_max)
    $('#sensor_gl1_min').val(sensordata[0].sensor_gl1_min)
    $('#sensor_gl2_max').val(sensordata[0].sensor_gl2_max)
    $('#sensor_gl2_min').val(sensordata[0].sensor_gl2_min)
    $('#sensor_gl3_max').val(sensordata[0].sensor_gl3_max)
    $('#sensor_gl3_min').val(sensordata[0].sensor_gl3_min)
}

function guidelinesave(){
    console.log(sensordata)

    let sensor_gl1_max = $('#sensor_gl1_max').val()
    let sensor_gl1_min = $('#sensor_gl1_min').val()
    let sensor_gl2_max = $('#sensor_gl2_max').val()
    let sensor_gl2_min = $('#sensor_gl2_min').val()
    let sensor_gl3_max = $('#sensor_gl3_max').val()
    let sensor_gl3_min = $('#sensor_gl3_min').val()

    console.log(sensor_gl1_max )

    // if(sensor_gl1_max.length == 0){alert("Level 1 Max??? ??????????????????."); $('#sensor_gl1_max').focus(); return; }
    // else if(sensor_gl1_min.length == 0){alert("Level 1 Min??? ??????????????????."); $('#sensor_gl1_min').focus(); return; }
    // else if(sensor_gl2_max.length == 0){alert("Level 2 Max??? ??????????????????."); $('#sensor_gl2_max').focus(); return; }
    // else if(sensor_gl2_min.length == 0){alert("Level 2 Min??? ??????????????????."); $('#sensor_gl2_min').focus(); return; }
    // else if(sensor_gl3_max.length == 0){alert("Level 3 Max??? ??????????????????."); $('#sensor_gl3_max').focus(); return; }
    // else if(sensor_gl3_min.length == 0){alert("Level 3 Min??? ??????????????????."); $('#sensor_gl3_min').focus(); return; }

    let form_data = new FormData($('#guideLineminmax')[0])

    form_data.append("sensor_id", sensor_id)

    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };

    $.ajax({
        url : "/sensordetail/guidline",
        type : "POST",
        data : form_data,
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
           console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            console.log(data.resultString)
            alert("Guide line??? ?????? ???????????????.")
            let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href = "/ws-02-2-1?"+encodeURIComponent(uri)
            // window.location.href = "ws-02-2-1?sensor_id="+sensor_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&intervalday="+intervalday+"&time="+time+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end
            console.log(data.resultString)
       
       }
    });
   
}


function searchdata(){
    $('#spinner_wrap').css('display','flex');
    $('#apply_btn').attr('disabled', true);

    setTimeout(() => {
        intervalday = $('#intervalday').val()
        console.log("intervalday",intervalday)
        time = $('#time').val()
        date_time_start = $('#date_time_start').val()
        date_time_end = $('#date_time_end').val()

        let startday = moment(date_time_start, 'YYYY-MM-DDTHH:mm:ssZ')
        let lastday = moment(date_time_end, 'YYYY-MM-DDTHH:mm:ssZ')
        
        let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ')
        let today = moment()


        if(lastday > today){
            alert("?????????????????? ????????? ??? ????????????.")
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);
            return;
        } else if(startday > lastday){
            alert("?????? ????????? ????????? ???????????? ????????????.")
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);
            return;
        } else if(startday < initaildate){
            date_time_start = get_initial_date;
            $('#date_time_start').val(get_initial_date);
        }


        console.log(intervalday, time, date_time_start, date_time_end, datarogger_id, sensor_name)

        if(date_time_start.length == 0 && date_time_end.length != 0){
            alert("?????? ????????? ????????? ?????????")
            $('#date_time_start').focus()
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);
            return;
        }else if(date_time_start.length != 0 && date_time_end.length == 0){
            alert("????????? ????????? ????????? ?????????")
            $('#date_time_end').focus()
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);
            return;
        }
        // else if(intervalday.length == 0){
        //     alert("????????? ????????? ?????????")
        //     $('#intervalday').focus()
        //     return;
        // }else if(intervalday.length == 0){
        //     alert("????????? ????????? ?????????")
        //     $('#intervalday').focus()
        //     return;
        // }


        $.ajax({
            url : "/editdata/table",
            type : "POST",
            data : {
                "sensor_id": sensor_id,
                "datarogger_id": datarogger_id,
                "date_time_start": date_time_start,
                "date_time_end": date_time_end,
                "intervalday": intervalday,
                "time": time,
                // "sensor_name": sensor_name

            },
            async: false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
                alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                $('#spinner_wrap').css('display','none');
                $('#apply_btn').attr('disabled', false);
            },
            success:function(data) {
                // alert(data.resultString)
                console.log("Success")

                graphdata = []
                graphdata = data.data
                console.log(graphdata)


                next_time_start = date_time_start;
                next_time_end = date_time_end;

                

                if(graphdata.length ==0){
                    alert("????????? ????????? ???????????? ???????????? ????????????. ????????? ?????? ????????? ?????????.")
                    $('#spinner_wrap').css('display','none');
                    $('#apply_btn').attr('disabled', false);
                }else{
                    selectgraph()
                }
            
        
            }
        });
    }, 500);
}  



function selectgraph(){

    if(chart){chart.destroy()}

    let colors = [
        '#1e87f0', '#5856d6', '#ff9500', '#ffcc00', '#ff3b30', '#5ac8fa', '#007aff', '#4cd964', '#aeff00', '#00ffe1',
        '#00ff62', '#0066ff', '#00ffd5', '#b2ff00', '#ffe100', '#00ff91', '#ff8000', '#1900ff', '#ff1500', '#00ffd0',
        '#73ff00', '#ff8800', '#e6ff00', '#0055ff', '#fffb00', '#2f00ff', '#00ff73', '#006eff', '#ffcc00', '#22ff00',
        '#ff2600', '#00aeff', '#b2ff00', '#8cff00', '#ffbb00', '#d9ff00', '#00aeff', '#ffa600', '#ff4d00', '#ccff00', 
        '#fbff00', '#ffe100', '#c3ff00', '#00ff88', '#00e5ff', '#ff4000', '#00ccff', '#00ddff', '#00ff19', '#0088ff',
        ];
    
    let color = [];
    for (k = 0; k < 100; k++) {
        const r = Math.floor (Math.random () * 255);
        const g = Math.floor (Math.random () * 255);
        const b = Math.floor (Math.random () * 255);
        color.push('rgba('+r+', '+g+','+b+', 1)')
    }

    labels = [];
    datalabels = [];
    let data = []
    let selectdata;
    console.log("graphdata", graphdata)
    if(sensor_fx_check == 1){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx1_data)
            datalabels.push(graphdata[i].sensor_data_date)
        }
      
    }else if(sensor_fx_check == 2){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx2_data)
            datalabels.push(graphdata[i].sensor_data_date)
        }
       
    }else if(sensor_fx_check == 3){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx3_data)
            datalabels.push(graphdata[i].sensor_data_date)
        }
      
    }else if(sensor_fx_check == 4){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx4_data)
            datalabels.push(graphdata[i].sensor_data_date)
        }
 
    }else if(sensor_fx_check == 5){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx5_data)
            datalabels.push(graphdata[i].sensor_data_date)
        }
       
    }
    

    let datasets = [
    {
        label: sensor_display_name,
        data: data,
        borderColor: colors[0],
        pointBackgroundColor: colors[0],
        pointHoverRadius: 6,
        borderWidth: 2,
        },
    ];

    max_lv1_display = false
    min_lv1_display = false
    max_lv2_display = false
    min_lv2_display = false
    max_lv3_display = false
    min_lv3_display = false

   
    if(level1_max && level1_max.length != 0 ){max_lv1_display = true}
    if(level1_min && level1_min.length != 0){min_lv1_display = true}
    if(level2_max && level2_max.length != 0){max_lv2_display = true}
    if(level2_min && level2_min.length != 0){min_lv2_display = true}
    if(level3_max && level3_max.length != 0){max_lv3_display = true}
    if(level3_min && level3_min.length != 0){min_lv3_display = true}


    chart = new Chart('sensors', {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            interaction: {
                intersect: false,
                mode: 'index',
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: '#222',
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        align: "center",
                    }
                },
                y: {
                    grid: {
                        color: '#222',
                    }
                }
            },
            plugins: {
                zoom: {
                    limits: {
                        x: {min: 'original', max: 'original', minRange: 1},
                        // y: {min: 'original', max: 'original', minRange: 1}
                    },
                    pan: {
                        enabled: true,
                        mode: 'y',
                        threshold: 2,
                    },
                    zoom: {
                        // speed: 0.1, 
                        // sensitivity: 0.5,
                        // threshold: 2,
                        // wheel: {
                        //     enabled: true
                        // },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y',
                    },
                },
                tooltip: {
                    padding: 10,
                    cornerRadius: 0,
                    bodySpacing: 4,
                    titleSpacing: 10,
                    //multiKeyBackground: '#00000000',
                    displayColors: false,
                },
                legend: {
                    position: 'bottom',
                    align: 'start',
                    padding: 20,
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                    }
                },
                annotation: {
                    annotations: {
                        line1: { // Guideline Lv.1 Max
                            type: 'line',
                            yMin: level1_max,
                            yMax: level1_max,
                            borderColor: '#FFD60A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.1 Max',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv1_display
                        },
                        line2: { // Guideline Lv.1 Min
                            type: 'line',
                            yMin: level1_min,
                            yMax: level1_min,
                            borderColor: '#FFD60A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.1 Min',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : min_lv1_display
                        },
                        line3: { // Guideline Lv.2 Max
                            type: 'line',
                            yMin: level2_max,
                            yMax: level2_max,
                            borderColor: '#FF9F0A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.2 Max',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv2_display
                        },
                        line4: { // Guideline Lv.2 Min
                            type: 'line',
                            yMin: level2_min,
                            yMax: level2_min,
                            borderColor: '#FF9F0A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.2 Min',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : min_lv2_display
                        },
                        line5: { // Guideline Lv.3 Max
                            type: 'line',
                            yMin: level3_max,
                            yMax: level3_max,
                            borderColor: '#FF453A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.3 Max',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv3_display
                        },
                        line6: { // Guideline Lv.3 Min
                            type: 'line',
                            yMin: level3_min,
                            yMax: level3_min,
                            borderColor: '#FF453A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.3 Min',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : min_lv3_display
                        },
                        line7: { // Initial
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: '#1e87f0',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                // content: 'Initial',
                                color: '#1e87f0',
                                font: {
                                    style: 'normal',
                                }
                            }
                        }
                    }
                }

            }
        }
    })
    weathergraph()
   
}

function resetZoomChart() {
    chart.resetZoom();
}
function chartZoom(value) {
    chart.zoom(value);
}


function weathergraph(){


    let weather_graph = []

    let t1h_data = [];
    let rn1_data = [];

    if(time.length == 0 && intervalday.length !=0){
        url = "/weather/data"
        $.ajax({
            url : url,
            type : "post",
            async: false,
            data:{
                "project_id":project_id,
                "date_time_start": date_time_start,
                "date_time_end":date_time_end,
                "intervalday":intervalday
                
            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
            console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
            },
            success:function(data) {
                console.log(data.resultString)
        
                weatherdata = data.data
                console.log(weatherdata)

                for(let i=0; i<datalabels.length; i++){
                    t1h_data.push(null)
                    rn1_data.push(null)
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == datalabels[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h
                            rn1_data[i] = weatherdata[j].weather_rn1

                        }
                    }
                }

        }
        });

    }else{
        url = "/weather/data?project_id="+project_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
        $.ajax({
            url : url,
            type : "get",
            async: false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
                console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
            },
            success:function(data) {
                console.log(data.resultString)
           
                weatherdata = data.data
                console.log(weatherdata)
    
                for(let i=0; i<datalabels.length; i++){
                    t1h_data.push(null)
                    rn1_data.push(null)
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == datalabels[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h
                            rn1_data[i] = weatherdata[j].weather_rn1
    
                        }
                    }
                }
    
           }
        });
    }




    if(wchart){wchart.destroy()}
        wchart = new Chart('weather', {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    type: 'line',
                    label: '?????? ( ??? )',
                    yAxisID: 'temp',
                    data: t1h_data,
                    borderColor: '#FF9F0A',
                    pointBackgroundColor: '#FF9F0A',
                    pointHoverRadius: 6,
                    borderWidth: 2,
                }, {
                    type: 'line',
                    label: '????????? ( mm )',
                    yAxisID: 'rain',
                    data: rn1_data,
                    borderColor: '#00AFFF',
                    pointBackgroundColor: '#00AFFF',
                    pointHoverRadius: 6,
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            color: '#222',
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                            align: "center",
                        }
                    },
                    temp: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: '#222',
                        },
                        ticks: {
                            color: 'rgba(255,159,10,.3)',
                        }
                    },
                    rain: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                        drawOnChartArea: false,
                        },
                        ticks: {
                            color: 'rgba(0,175,255,.3)',
                        },
                        beginAtZero : true
                }   
            },
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    padding: 10,
                    cornerRadius: 0,
                    bodySpacing: 4,
                    titleSpacing: 10,
                    multiKeyBackground: '#00000000',
                    displayColors: false,
                },
                legend: {
                    position: 'bottom',
                    align: 'start',
                    padding: 20,
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                    }
                }
            }
        }
    })

    $('#spinner_wrap').css('display','none');
    $('#apply_btn').attr('disabled', false);
}



function fumula(){
   
    if(sensor_fx_check == 1){
        $('#fomulaname').val(sensordata[0].sensor_fx1_name)
        $('#calc').val(sensordata[0].sensor_fx1)
    }else if(sensor_fx_check == 2){
        $('#fomulaname').val(sensordata[0].sensor_fx2_name)
        $('#calc').val(sensordata[0].sensor_fx2)
    }else if(sensor_fx_check == 3){
        $('#fomulaname').val(sensordata[0].sensor_fx3_name)
        $('#calc').val(sensordata[0].sensor_fx3)
    }else if(sensor_fx_check == 4){
        $('#fomulaname').val(sensordata[0].sensor_fx4_name)
        $('#calc').val(sensordata[0].sensor_fx4)
    }else if(sensor_fx_check == 5){
        $('#fomulaname').val(sensordata[0].sensor_fx5_name)
        $('#calc').val(sensordata[0].sensor_fx5)
    }
    $('#fumoula_sensor_name').text(topname)
    $('#fomulaselect').empty()
    $('#fomulaselect').append("<option>???????????? ????????????</option>")

    // $.ajax({
    //     url:"fumula/list/sensor?sensor_id="+sensor_id,
    //     type:"get",
    //     contentType: false,
    //     processData : false,
    //     error:function(err){
    //         console.log(err);
    //      },
    //      success:function(json) {
    //          console.log(json.data)
    //          let fomulalist = json.data
    //          let fomula01 = json.data[0].sensor_fx1
    //          let fomula02 = json.data[0].sensor_fx2
    //          let fomula03 = json.data[0].sensor_fx3
    //          let fomula04 = json.data[0].sensor_fx4
    //          let fomula05 = json.data[0].sensor_fx5

    //          if(fomula01.length !=0){$('#fomulaselect').append("<option>"+fomulalist[0].sensor_fx1_name+"</option>")}
    //          if(fomula02.length !=0){$('#fomulaselect').append("<option>"+fomulalist[0].sensor_fx2_name+"</option>")}
    //          if(fomula03.length !=0){$('#fomulaselect').append("<option>"+fomulalist[0].sensor_fx3_name+"</option>")}
    //          if(fomula04.length !=0){$('#fomulaselect').append("<option>"+fomulalist[0].sensor_fx4_name+"</option>")}
    //          if(fomula05.length !=0){$('#fomulaselect').append("<option>"+fomulalist[0].sensor_fx5_name+"</option>")}
               
    //         //  $('#fomulaselect').append("<option>"++"</option>")

    //      }
    //     })

    
}



$("input:text[doubleOnly]").on("focus", function() {
    var x = $(this).val();
    $(this).val(x);
}).on("focusout", function() {
    var x = $(this).val();
    if(x && x.length > 0) {
        if(!$.isNumeric(x)) {
            x = x.replace(/[^-0-9\.]/g,"");
            // x = x.replace(/[^-0-9\.]/g,"");
        } 
        if(x.lastIndexOf("-")>0){ //????????? -??? ????????? replace
            if(x.indexOf("-")==0){ //???????????? replace ??? - ????????????.
                x = "-"+x.replace(/[-]/gi,'');
            }else{
                x = x.replace(/[-]/gi,'');
            }
        }
      //????????? 2??? ?????? X
        if ( (x.match(/\./g) || []).length > 1 ){
                x =x.replace('.','');
        }
        $(this).val(x);
    }
}).on("keyup", function() {
    var x = $(this).val().replace(/[^-0-9\.]/g,"");
    if(x && x.length > 0) {
         if(x.lastIndexOf("-")>0){ //????????? -??? ????????? replace
             if(x.indexOf("-")==0){ //???????????? replace ??? - ????????????.
                 x = "-"+x.replace(/[-]/gi,'');
             }else{
                 x = x.replace(/[-]/gi,'');
             }
         }
    }		
     //????????? 2??? ?????? X
     if ( (x.match(/\./g) || []).length > 1 ){
            x =x.replace('.','');
     }
    $(this).val(x);
});




// next_time_start, next_time_end
function chartlocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-1?"+encodeURIComponent(uri)
    
}
function datalocation(){
  
    // console.log(window.btoa("sensor_id")) // c2V
    // console.log(window.btoa("project_id")) // cHJ
    // console.log(window.btoa("sensorgroup_type")) // Hlw
    // console.log(window.btoa("date_time_start")) // N0Y
    // console.log(window.btoa("date_time_end")) //X2V
    // console.log(window.btoa("intervalday")) // aW5
    // console.log(window.btoa("time")) //dGl
    // console.log(window.btoa("company_id")) //pZA
    // console.log(window.btoa("sensorgroup_id")) //aWQ
    // console.log(window.btoa("sensordetail_id")) //aWd
    // console.log(window.btoa("servicecenter_id")) //srD
    // console.log(window.btoa("notice_id")) //Acd
    // console.log(window.btoa("alarm_id")) //bTe

    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-2-3?"+encodeURIComponent(uri)
    
}
function fomulalocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4?"+encodeURIComponent(uri)
    
}
function infolocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-5?"+encodeURIComponent(uri)
    
}



