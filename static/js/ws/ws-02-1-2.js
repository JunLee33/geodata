let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensorgroup_type = "";

let sensordata = [];
let graphdata = [];

let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_name_list = []
let sensor_display_name_list = []
let sensorgroup_interval = "";

let date_time_start = "";
let date_time_end = "";
let intervalday = "";
let time = "";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

let group_interval ;


$(function(){
    $('#spinner_wrap').css('display','flex');
    
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensorgroup_id = urlParams.get('aWQ')
    // place_id = urlParams.get('place_id')
    // datarogger_id = urlParams.get('datarogger_id')
    sensorgroup_type = urlParams.get('Hlw')

    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')
    next_time_start = date_time_start;
    next_time_end = date_time_end;

    
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)
    if(date_time_start){
        $("#date_time_start").val(date_time_start)
        let fitst_time = $('#date_time_start').val().split(' ')[1];
        $("#date_time_end").val(date_time_end)
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    }else{
        let today = moment()
        let year = today.year(); // 년도
        let month = today.month() + 1;  // 월
        let date = today.date();  // 날짜
       
        let hours = today.hours(); // 시
        let minutes = today.minutes();  // 분
        console.log(minutes, String(minutes).length)
        if(String(month).length <2){month = "0"+month}
        if(String(minutes).length <2){minutes = "0"+minutes}
        if(String(date).length <2){date = "0"+date}
    
    
        let endday = year+"."+month+"."+date+" "+hours+":"+minutes
        $("#date_time_end").val(endday)
    
        var Agodate = today.subtract(7,'days');
        console.log(Agodate)
        let Agodateyear = Agodate.year(); // 년도
        let Agodatemonth = Agodate.month() + 1;  // 월
        let Agodatedate = Agodate.date();  // 날짜
       
        let Agodatehours = Agodate.hours(); // 시
        let Agodateminutes = Agodate.minutes();  // 분
        if(String(Agodatemonth).length <2){Agodatemonth = "0"+Agodatemonth}
        if(String(Agodateminutes).length <2){Agodateminutes = "0"+Agodateminutes}
        if(String(Agodatedate).length <2){Agodatedate = "0"+Agodatedate}
    
        let startday = Agodateyear+"."+Agodatemonth+"."+Agodatedate+" "+Agodatehours+":"+Agodateminutes
        next_time_start = startday;
        next_time_end = endday;
        console.log(startday)
        $("#date_time_start").val(startday)
        $('#date_time_end').datetimepicker({minDate:startday});
    }
    
    

    $.ajax({
        url:"sensorgroup/mapping?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id,
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

             sensor_name_list = []
             sensor_display_name_list = []
             for(let i=0; i<sensordata.length; i++){
                sensor_name_list.push(sensordata[i].sensor_name)
                sensor_display_name_list.push(sensordata[i].sensor_display_name)
             }
            level1_max = sensordata[0].sensorgroup_gl1_max
            level1_min = sensordata[0].sensorgroup_gl1_min
            level2_max = sensordata[0].sensorgroup_gl2_max
            level2_min = sensordata[0].sensorgroup_gl2_min
            level3_max = sensordata[0].sensorgroup_gl3_max
            level3_min = sensordata[0].sensorgroup_gl3_min
            sensorgroup_interval = sensordata[0].sensorgroup_interval
            get_initial_date = sensordata[0].sensorgroup_initial_date;

            $('#initial_datetime').val(sensordata[0].sensorgroup_initial_date)
            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#initialsensorname').text(sensordata[0].sensorgroup_name)

            if(sensordata[0].sensor_fx_check=='1'){
                $('#fomulaname').text(sensordata[0].sensor_fx1_name)
            }else if(sensordata[0].sensor_fx_check=='2'){
                $('#fomulaname').text(sensordata[0].sensor_fx2_name)
            }else if(sensordata[0].sensor_fx_check=='3'){
                $('#fomulaname').text(sensordata[0].sensor_fx3_name)
            }else if(sensordata[0].sensor_fx_check=='4'){
                $('#fomulaname').text(sensordata[0].sensor_fx4_name)
            }else if(sensordata[0].sensor_fx_check=='5'){
                $('#fomulaname').text(sensordata[0].sensor_fx5_name)
            }
            

            $('#sensorgroupinitail').text("Initial Date: "+get_initial_date)
            $('#date_time_start').datetimepicker({minDate:(get_initial_date)});

            let startday = moment($('#date_time_start').val(), 'YYYY-MM-DDTHH:mm:ssZ')
            let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ')

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:(get_initial_date)});
            }
         }
    })

    searchdata()



        // $('#canclebtn', '#closebtn  ').click(function(){
        //     window.location.href = "ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type
        // })


    $('#initialsavebtn').click(function(){
        let saveconfirm = confirm("전체 initial date 값이 수정됩니다. 수정하시겠습니까?")
        if(saveconfirm){
            $('#spinner_wrap').css('display','flex');
            $('#apply_btn').attr('disabled', true);

            setTimeout(() => {
                let sensorgroup_initial_date = $('#initial_datetime').val()
        
                console.log(sensorgroup_initial_date)
        
                let form_data = new FormData()
                form_data.append("sensorgroup_id", sensorgroup_id)
                form_data.append("sensorgroup_initial_date", sensorgroup_initial_date)
                $.ajax({
                    url : "/sensorgroup/mapping",
                    type : "POST",
                    data : form_data,
                    contentType : false,
                    processData : false,
                    error:function(err){
                        console.log(err)
                        alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                    },
                    success:function(data) {
                        // alert(data.resultString)
                        alert(data.resultString)
                        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                        window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
                        // window.location.href =  "/ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
                
                    }
                });

                $('#spinner_wrap').css('display','none');
                $('#apply_btn').attr('disabled', false);

            }, 500);

        }

    })



    $('#date_time_start').change(function () {
        let datetime = moment($('#date_time_start').val(), 'YYYY-MM-DDTHH:mm:ssZ')
        let picker_time = $('#date_time_start').val().split(' ')[1];
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    })

})


function guideline(){
    console.log(sensordata)

    $('#sensorname').text(sensordata[0].sensorgroup_name)

    $('#sensor_gl1_max').val(sensordata[0].sensorgroup_gl1_max)
    $('#sensor_gl1_min').val(sensordata[0].sensorgroup_gl1_min)
    $('#sensor_gl2_max').val(sensordata[0].sensorgroup_gl2_max)
    $('#sensor_gl2_min').val(sensordata[0].sensorgroup_gl2_min)
    $('#sensor_gl3_max').val(sensordata[0].sensorgroup_gl3_max)
    $('#sensor_gl3_min').val(sensordata[0].sensorgroup_gl3_min)
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

    // if(sensor_gl1_max.length == 0){alert("Level 1 Max를 입력해주세요."); $('#sensor_gl1_max').focus(); return; }
    // else if(sensor_gl1_min.length == 0){alert("Level 1 Min를 입력해주세요."); $('#sensor_gl1_min').focus(); return; }
    // else if(sensor_gl2_max.length == 0){alert("Level 2 Max를 입력해주세요."); $('#sensor_gl2_max').focus(); return; }
    // else if(sensor_gl2_min.length == 0){alert("Level 2 Min를 입력해주세요."); $('#sensor_gl2_min').focus(); return; }
    // else if(sensor_gl3_max.length == 0){alert("Level 3 Max를 입력해주세요."); $('#sensor_gl3_max').focus(); return; }
    // else if(sensor_gl3_min.length == 0){alert("Level 3 Min를 입력해주세요."); $('#sensor_gl3_min').focus(); return; }

    let form_data = new FormData($('#guideLineminmax')[0])

    form_data.append("sensorgroup_id", sensorgroup_id)

    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };

    $.ajax({
        url : "/sensorgroup/guidline",
        type : "POST",
        data : form_data,
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log(data.resultString)
            alert("Guide line이 등록 되었습니다.")
            let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
            // window.location.href =  "/ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
       
       }
    });
   
}



function searchdata(){
    $('#spinner_wrap').css('display','flex');
    $('#apply_btn').attr('disabled', true);
    
    setTimeout(() => {

        intervalday = $('#intervalday').val()
        time = $('#time').val()
        date_time_start = $('#date_time_start').val()
        date_time_end = $('#date_time_end').val()

        console.log(intervalday, time, date_time_start, date_time_end, datarogger_id)

        if(date_time_start.length == 0 && date_time_end.length != 0){
            alert("시작 날짜를 입력해 주세요")
            $('#date_time_start').focus()
            
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);

            return;
        }else if(date_time_start.length != 0 && date_time_end.length == 0){
            alert("마지막 날짜를 입력해 주세요")
            $('#date_time_end').focus()

            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);

            return;
        }

        let startday = moment(date_time_start, 'YYYY-MM-DDTHH:mm:ssZ')
        let lastday = moment(date_time_end, 'YYYY-MM-DDTHH:mm:ssZ')
        let today = moment()
        let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ')

        if(lastday > today){
            alert("미래 데이터는 표출할 수 없습니다.")

            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);

            return;
        } else if(startday > lastday){
            alert("시작 날짜가 마지막 날짜보다 늦습니다.")

            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);

            return;
        } else if(startday < initaildate){
            date_time_start = get_initial_date;
            $('#date_time_start').val(get_initial_date);
        }

        console.log(sensorgroup_type)

        $.ajax({
            url : "/editdata/all/line",
            type : "POST",
            data : {
                "datarogger_id": datarogger_id,
                "date_time_start": date_time_start,
                "date_time_end": date_time_end,
                "intervalday": intervalday,
                "time": time,
                "sensorgroup_type": sensorgroup_type,
                "sensorgroup_id": sensorgroup_id

            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
                alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                $('#spinner_wrap').css('display','none');
                $('#apply_btn').attr('disabled', false);
            },
            success:function(data) {
                console.log(data.resultString)
                group_interval = data.groupinterval
    
                graphdata = data.table_fx_data
                console.log(graphdata)

                next_time_start = date_time_start;
                next_time_end = date_time_end;

                if(graphdata.length !=0){
                    selectgraph()
                }else{
                    alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
                    $('#spinner_wrap').css('display','none');
                    $('#apply_btn').attr('disabled', false);
                }
            }
        });
    }, 500);    
}

function selectgraph(){
    if(chart){chart.destroy()}

  
    const colors = [];
    const colors_array = [
        '#f1ff59', '#d0f147', '#afe436', '#8cd626', '#65c816', '#4cc438', '#30c04e', '#00bb60', '#00bd86', '#00bea6', 
        '#00bdbe', '#00bbcd', '#00accf', '#009ccf', '#008bcc', '#0079c4', '#006dc2', '#0060be', '#0853b9', 
        '#2048b9', '#353ab7', '#4827b3', '#5a00ac', '#6f00a1', '#7d0096', '#88008b', '#900082', '#a60075', '#b70068', 
        '#c4105a', '#d63942', '#db5f2a', '#ca6e10', '#b57b00', '#c38300', '#d08a00', '#de9200', '#ec9a00', '#f49b28', 
        '#fa9d3e', '#ff9f51', '#ff9f72', '#ffa490', '#ffacab', '#ffb6c1', '#f1b9cb', '#e1bcd0', '#d3bed0', '#c8c0cc', 
        '#c6b9c8', '#c6b1c3', '#c6a9bd', '#d695a4', '#db8578', '#ca8043', '#9f8500', '#878e00', '#879906', '#85a511', 
        '#81b11c', '#9cc42c', '#b8d83b', '#d4eb4a', 
    ]
        const color = [];
        for (k = 0; k < 100; k++) {
            const r = Math.floor (Math.random () * 255);
            const g = Math.floor (Math.random () * 255);
            const b = Math.floor (Math.random () * 255);
            color.push('rgba('+r+', '+g+','+b+', 1)')
        }
    
        let color_idx = 0;
        for(let i=0; i< graphdata.length ; i++){
            if(color_idx==colors_array.length){
                color_idx = 0;
            }
            colors.push(colors_array[color_idx]);
            color_idx++;
        }
        console.log(colors)

        
    let daylabel = []
    let data = []
    let graphindex = 0;
    let labels = [];
    let labels2 = ['0m'];
    console.log(labels)

    // for(let i=0; i< sensor_display_name_list.length; i++){
    for(let i=(sensor_display_name_list.length-1);  i >= 0; i--){
        let interval = group_interval[i]
        let intervallabel = interval
        labels2.push(intervallabel)
    }
    console.log("labels", labels2)
    // console.log("labels", sensor_display_name_list)

    for(let i=labels2.length-1; i>=0; i--){
        labels.push(labels2[i])
    }
    console.log(labels)
    // for(let i = 0; i<graphdata[0].length; i++){
    //     labels.push(graphdata[0][i].sensor_data_date)
    // }
    
    let datasets = [];
    
   
    for(let i=(graphdata.length-1); i >=  0; i--){
        // console.log(i)
        let currentdata = 0

        data = []
        // for(let j=(labels.length-1); j>0; j--){
        for(let j=0; j<labels.length; j++){
            data.push(graphdata[i][labels[j]])
        }
        // for(j= graphdata.length-1; j>=0; j--){
            
        //     // currentdata += parseFloat(graphdata[j][i].sensor_fx_data)

        //     data.push(currentdata)
        // }



        
        datasets.push({
            label: graphdata[i].sensor_data_date.substr(2,14),
            data: data,
            // data: graphdatalist,
            borderColor: colors[(graphdata.length-1)-i],
            pointBackgroundColor: colors[(graphdata.length-1)-i],
            pointHoverRadius: 6,
            borderWidth: 2,
            })
        
        
    }

    console.log(labels)

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
                indexAxis: 'y',
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: '#222',
                        }
                    },
                    y: {
                        reverse: true,
                        grid: {
                            color: '#222',
                        }
                    }
                },
                plugins: {
                    zoom: {
                        limits: {
                            x: {min: 'original', max: 'original'},
                            // y: {min: 'original', max: 'original', minRange: 1}
                        },
                        pan: {
                            enabled: true,
                            mode: 'x',
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
                            mode: 'x',
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
                                xMin: level1_max,
                                xMax: level1_max,
                                borderColor: '#FFD60A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
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
                                xMin: level1_min,
                                xMax: level1_min,
                                borderColor: '#FFD60A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
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
                                xMin: level2_max,
                                xMax: level2_max,
                                borderColor: '#FF9F0A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
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
                                xMin: level2_min,
                                xMax: level2_min,
                                borderColor: '#FF9F0A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#191919',
                                    content: 'Lv.2 Min',
                                    color: '#666',
                                    font: {
                                        style: 'normal',
                                    }
                                },
                                display : max_lv3_display
                            },
                            line5: { // Guideline Lv.3 Max
                                type: 'line',
                                xMin: level3_max,
                                xMax: level3_max,
                                borderColor: '#FF453A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
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
                                xMin: level3_min,
                                xMax: level3_min,
                                borderColor: '#FF453A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
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
                                xMin: 0,
                                xMax: 0,
                                borderColor: '#1e87f0',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
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

    $('#spinner_wrap').css('display','none');
    $('#apply_btn').attr('disabled', false);

}

function resetZoomChart() {
    chart.resetZoom();
}
function chartZoom(value) {
    chart.zoom(value);
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
        if(x.lastIndexOf("-")>0){ //중간에 -가 있다면 replace
            if(x.indexOf("-")==0){ //음수라면 replace 후 - 붙여준다.
                x = "-"+x.replace(/[-]/gi,'');
            }else{
                x = x.replace(/[-]/gi,'');
            }
        }
      //마침표 2개 허용 X
        if ( (x.match(/\./g) || []).length > 1 ){
                x =x.replace('.','');
        }
        $(this).val(x);
    }
}).on("keyup", function() {
    var x = $(this).val().replace(/[^-0-9\.]/g,"");
    if(x && x.length > 0) {
         if(x.lastIndexOf("-")>0){ //중간에 -가 있다면 replace
             if(x.indexOf("-")==0){ //음수라면 replace 후 - 붙여준다.
                 x = "-"+x.replace(/[-]/gi,'');
             }else{
                 x = x.replace(/[-]/gi,'');
             }
         }
    }		
     //마침표 2개 허용 X
     if ( (x.match(/\./g) || []).length > 1 ){
            x =x.replace('.','');
     }
    $(this).val(x);
});


// next_time_start, next_time_end
function chartlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function trendlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-4?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-4?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-9?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-9?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-5?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-5?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-6?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}