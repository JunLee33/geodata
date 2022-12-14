let project_id = "";
let sensorgrouplist = [];
let sensordetail_id = "";
let sensor_id = "";
let datarogger_id = "";
let sensor_namex = "";
let sensor_namey = "";
let sensorgroup_type = "";
let sensor_idx = "";
let sensor_idy = "";
let sensordata = [];
let click_pagenum = "";

let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let topname=""

let graphdata_x = []
let graphdata_y = []

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";
let sensor_display_name = "";
let tabledata = []
let sensor_initial_date ="";

let sensor_fx_check = "";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

let user_gr = "";

let datatable;
$(function(){
    $('#spinner_wrap').css('display','flex');

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')
    // datarogger_id = urlParams.get('datarogger_id')
    // sensordetail_id = urlParams.get('sensordetail_id')
    // sensor_namex = urlParams.get('sensor_namex')
    // sensor_namey = urlParams.get('sensor_namey')
    sensor_idx = urlParams.get('c2Vx')
    sensor_idy = urlParams.get('c2Vy')
    sensorgroup_type = urlParams.get('Hlw')


    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    next_time_start = date_time_start;
    next_time_end = date_time_end;

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)


    console.log(date_time_end, date_time_start, time,intervalday )


    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_idx,
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
            if(level1_max){level1_min = "-"+sensordata[0].sensor_gl1_max}else{level1_min = null}
          
            level2_max = sensordata[0].sensor_gl2_max     
            if(level2_max){level2_min = "-"+sensordata[0].sensor_gl2_max}else{level2_min = null}

            level3_max = sensordata[0].sensor_gl3_max
            if(level3_max){level3_min = "-"+sensordata[0].sensor_gl3_max}else{level3_min = null}
     

            console.log(level1_max,level1_min, level2_max, level2_min, level3_max, level3_min)
            initial_data = sensordata[0].sensor_initial_data
            sensor_display_name = sensordata[0].sensor_display_name

            sensor_initial_date = sensordata[0].sensor_initial_date+":00"

            $('#initial_datetime').val(sensordata[0].sensor_initial_date)
            
    

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

         
            $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)

            
           $('#projectName').text(sensordata[0].project_name)
           $('#placeName').text(sensordata[0].place_name)

           topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
           $('#topname').text(sensordata[0].sensor_display_name)

           let gauge_factor_x = sensordata[0].sensor_gauge_factor


           $.ajax({
                url:"sensordetail/select?&sensor_id="+sensor_idy,
                type:"get",
                contentType: false,
                processData : false,
                error:function(err){
                    console.log(err);
                },
                success:function(json) {

                    let gauge_factor_y = json.data[0].sensor_gauge_factor
                    // $('#gaugefactorvalue').text("Gauge Factor: x "+gauge_factor_x+" / y "+gauge_factor_y)
                }
            })

            get_initial_date = sensordata[0].sensor_initial_date;
            
            $('#date_time_start').datetimepicker({minDate:(get_initial_date)});

            let startday = moment($('#date_time_start').val(), 'YYYY-MM-DDTHH:mm:ssZ');
            let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ');

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:(get_initial_date)});
            }
         }
    })

  



    searchdata()

    $('#Upload').click(function(e){
        console.log("Upload click!!")
        if(intervalday.length > 0 || time.length > 0 || $('#intervalday').val() > 0 || $('#time').val() > 0){
            alert("RESET ????????? ?????? ????????? ??????????????????.")
            return;
        }

        e.preventDefault();
        let myInput = document.getElementById("my-input");
            myInput.click();
            

    })
    
    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    })

})

function uploadFile(input){

    var file = input.files[0];


    let form_data = new FormData()
    form_data.append("file",file )
    form_data.append("datarogger_id",datarogger_id )
    form_data.append("sensor_idx",sensor_idx )
    form_data.append("sensor_idy",sensor_idy )
      
    
    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };
 
    let uploadconfirm = confirm("????????? upload??? ?????? ???????????????. upload ???????????????????")

    if(uploadconfirm){
        alert("UPLOAD??? ?????????????????????. ????????? ???????????? ???????????????.")
        $.ajax({
            url : "/data/upload",
            type : "put",
            data : form_data,
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
               console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
               alert("????????? ?????? upload ????????????.")
               let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
               window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
            //    window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
            },
            success:function(data) {
                alert(data.resultString)
               console.log("excel upload.")
               let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
               window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
            //    window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
           
           }
        });
    }

   
}



function searchdata(){
    $('#spinner_wrap').css('display','flex');
    $('#apply_btn').attr('disabled', true);

    setTimeout(() => {
        intervalday = $('#intervalday').val()
        time = $('#time').val()
        date_time_start = $('#date_time_start').val()
        date_time_end = $('#date_time_end').val()

        let startday = moment(date_time_start, 'YYYY-MM-DDTHH:mm:ssZ');
        let lastday = moment(date_time_end, 'YYYY-MM-DDTHH:mm:ssZ');
        let today = moment();
        let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ');

        if(lastday > today){
            alert("?????? ???????????? ????????? ??? ????????????.")
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);
            return;
        } else if(startday > lastday){
            alert("?????? ????????? ????????? ???????????? ????????????.")
            $('#spinner_wrap').css('display','none');
            $('#apply_btn').attr('disabled', false);
            return;
        }else if(startday < initaildate){
            date_time_start = get_initial_date;
            $('#date_time_start').val(get_initial_date);
        }


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

        graphdata_x = []
        graphdata_y = []
        console.log($("#date_time_start").val())

        $.ajax({
            url : "current/user",
            type : "POST",
            async : false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
            console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
            },
            success:function(data) {
                // console.log(data.data)
                let currentdata =JSON.parse(data.data)
                user_gr = currentdata.user_grade
                console.log(user_gr)

            }
        })


        if(user_gr == '0101' && time.length == 0 && intervalday.length == 0 ){
                //x data
                $.ajax({
                    url : "/editdata/table?sensor_id="+sensor_idx+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end,
                    type : "GET",
                    async : false,
                    data : {
                        "sensor_id": sensor_idx,
                        "datarogger_id": datarogger_id,
                        "date_time_start": date_time_start,
                        "date_time_end": date_time_end,
                        "intervalday": intervalday,
                        "time": time,
                        "sensor_name": sensor_namex

                    },
                    error:function(err){
                        console.log(err)
                        alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                    },
                    success:function(data) {
                    //    console.log(data.data)
                        graphdata_x = data.data

                        //y data
                        $.ajax({
                            url : "/editdata/table?sensor_id="+sensor_idy+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end,
                            type : "GET",
                            async : false,
                            data : {
                                "sensor_id": sensor_idy,
                                "datarogger_id": datarogger_id,
                                "date_time_start": date_time_start,
                                "date_time_end": date_time_end,
                                "intervalday": intervalday,
                                "time": time,
                                "sensor_name": sensor_namey

                            },
                            error:function(err){
                                console.log(err)
                                alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                                $('#spinner_wrap').css('display','none');
                                $('#apply_btn').attr('disabled', false);
                            },
                            success:function(data) {
                                console.log(data.data)
                                graphdata_y = data.data


                                next_time_start = date_time_start;
                                next_time_end = date_time_end;
                                

                                    if(graphdata_y.length ==0){
                                        alert("????????? ????????? ???????????? ???????????? ????????????. ????????? ?????? ????????? ?????????.")
                                        $('#spinner_wrap').css('display','none');
                                        $('#apply_btn').attr('disabled', false);
                                        }else{
                                            selecttable()
                                    }
                            
                            }
                        });
                    
                }
                });
        }else{
                //x data
                $.ajax({
                    url : "/editdata/table",
                    type : "POST",
                    async : false,
                    data : {
                        "sensor_id": sensor_idx,
                        "datarogger_id": datarogger_id,
                        "date_time_start": date_time_start,
                        "date_time_end": date_time_end,
                        "intervalday": intervalday,
                        "time": time,
                        "sensor_name": sensor_namex

                    },
                    error:function(err){
                        console.log(err)
                        alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                    },
                    success:function(data) {
                    //    console.log(data.data)
                        graphdata_x = data.data

                        //y data
                        $.ajax({
                            url : "/editdata/table",
                            type : "POST",
                            async : false,
                            data : {
                                "sensor_id": sensor_idy,
                                "datarogger_id": datarogger_id,
                                "date_time_start": date_time_start,
                                "date_time_end": date_time_end,
                                "intervalday": intervalday,
                                "time": time,
                                "sensor_name": sensor_namey

                            },
                            error:function(err){
                                console.log(err)
                                alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                                $('#spinner_wrap').css('display','none');
                                $('#apply_btn').attr('disabled', false);
                            },
                            success:function(data) {
                                console.log(data.data)
                                graphdata_y = data.data
                                next_time_start = date_time_start;
                                next_time_end = date_time_end;
                                

                                    if(graphdata_y.length ==0){
                                        alert("????????? ????????? ???????????? ???????????? ????????????. ????????? ?????? ????????? ?????????.")
                                        $('#spinner_wrap').css('display','none');
                                        $('#apply_btn').attr('disabled', false);
                                        }else{
                                            selecttable()
                                    }
                            
                        }
                        });
                    
                }
                });
        }
    }, 500);           
    
}

function selecttable(){

    let sensor_Date = []

    for(let i=0; i<graphdata_x.length; i++){
        sensor_Date.push(graphdata_x[i].sensor_data_date)
    }
    
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

                for(let i=0; i<sensor_Date.length; i++){
                    t1h_data.push("")
                    rn1_data.push("")
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == sensor_Date[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h + " ???"
                            rn1_data[i] = weatherdata[j].weather_rn1 + " mm"
    
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
    
                for(let i=0; i<sensor_Date.length; i++){
                    t1h_data.push("")
                    rn1_data.push("")
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == sensor_Date[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h + " ???"
                        rn1_data[i] = weatherdata[j].weather_rn1 + " mm"
    
                        }
                    }
                }
    
           }
        });
    }

  

    if(datatable){datatable.destroy()}
    console.log("graphdata_x, ", graphdata_x)
    console.log("graphdata_y",graphdata_y)
    tabledata = []
        
    labels =[]

    check_fx_data = [];

    for(let i = 0; i<graphdata_x.length; i++){
        labels.push(graphdata_x[i].sensor_data_date)
        tabledata.push({sensor_data_date:null,x: null, y: null, sensor_fx1_data_x: null, sensor_fx1_data_y: null,sensor_fx2_data_x: null,sensor_fx2_data_y: null,
            sensor_fx3_data_x: null,sensor_fx3_data_y: null,sensor_fx4_data_x: null,sensor_fx4_data_y: null,sensor_fx5_data_x: null,sensor_fx5_data_y: null, use_yn: null})

        
       
        check_fx_data.push({sensor_fx_data_x: null, sensor_fx_data_y: null})
        
        
    }

    for(let i=0; i<labels.length; i++){
        for(let j=0; j<graphdata_x.length; j++){
            tabledata[i].sensor_data_date = labels[i]
        

            if(labels[i] == graphdata_x[j].sensor_data_date){
                tabledata[i].x = graphdata_x[j].sensor_data
                tabledata[i].use_yn = graphdata_x[j].use_yn

                if(graphdata_x[j].sensor_fx1_data){
                    tabledata[i].sensor_fx1_data_x = graphdata_x[j].sensor_fx1_data
                }
                if(graphdata_x[j].sensor_fx2_data){
                    tabledata[i].sensor_fx2_data_x = graphdata_x[j].sensor_fx2_data
                }
                if(graphdata_x[j].sensor_fx3_data){
                    tabledata[i].sensor_fx3_data_x = graphdata_x[j].sensor_fx3_data
                }
                if(graphdata_x[j].sensor_fx4_data){
                    tabledata[i].sensor_fx4_data_x = graphdata_x[j].sensor_fx4_data
                }
                if(graphdata_x[j].sensor_fx5_data){
                    tabledata[i].sensor_fx5_data_x = graphdata_x[j].sensor_fx5_data
                }


                if(sensor_fx_check == '1'){
                    check_fx_data[i].sensor_fx_data_x = graphdata_x[j].sensor_fx1_data
                }else if(sensor_fx_check == '2'){
                    check_fx_data[i].sensor_fx_data_x = graphdata_x[j].sensor_fx2_data
                }else if(sensor_fx_check == '3'){
                    check_fx_data[i].sensor_fx_data_x = graphdata_x[j].sensor_fx3_data
                }else if(sensor_fx_check == '4'){
                    check_fx_data[i].sensor_fx_data_x = graphdata_x[j].sensor_fx4_data
                }else if(sensor_fx_check == '5'){
                    check_fx_data[i].sensor_fx_data_x = graphdata_x[j].sensor_fx5_data
                }
            }

            
        }

        for(let j=0; j<graphdata_y.length; j++){
            if(labels[i] == graphdata_y[j].sensor_data_date){
                tabledata[i].y = graphdata_y[j].sensor_data
                // console.log(j, graphdata_y[j].sensor_data_date, graphdata_y[j].sensor_fx1_data, typeof(graphdata_y[j].sensor_fx1_data))

                if( graphdata_y[j].sensor_fx1_data == 0 ){
                    console.log(graphdata_y[j].sensor_fx1_data)
                    graphdata_y[j].sensor_fx1_data = '0'
                }
                if(graphdata_y[j].sensor_fx1_data){
                    tabledata[i].sensor_fx1_data_y = graphdata_y[j].sensor_fx1_data
                }
                if(graphdata_y[j].sensor_fx2_data){
                    tabledata[i].sensor_fx2_data_y = graphdata_y[j].sensor_fx2_data
                }
                if(graphdata_y[j].sensor_fx3_data){
                    tabledata[i].sensor_fx3_data_y = graphdata_y[j].sensor_fx3_data
                }
                if(graphdata_y[j].sensor_fx4_data){
                    tabledata[i].sensor_fx4_data_y = graphdata_y[j].sensor_fx4_data
                }
                if(graphdata_y[j].sensor_fx5_data){
                    tabledata[i].sensor_fx5_data_y = graphdata_y[j].sensor_fx5_data
                }

                if(sensor_fx_check == '1'){
                    check_fx_data[i].sensor_fx_data_y = graphdata_y[j].sensor_fx1_data
                }else if(sensor_fx_check == '2'){
                    check_fx_data[i].sensor_fx_data_y = graphdata_y[j].sensor_fx2_data
                }else if(sensor_fx_check == '3'){
                    check_fx_data[i].sensor_fx_data_y = graphdata_y[j].sensor_fx3_data
                }else if(sensor_fx_check == '4'){
                    check_fx_data[i].sensor_fx_data_y = graphdata_y[j].sensor_fx4_data
                }else if(sensor_fx_check == '5'){
                    check_fx_data[i].sensor_fx_data_y = graphdata_y[j].sensor_fx5_data
                }
            }
        }
     
    }
    // console.log(usergr)
    console.log("tabledatat",tabledata)
    console.log("check_fx_data",check_fx_data)

    $('#tabletr').empty()
    $('#tabletr').append("<th>????????????</th>")
    // if(column00){
    //     $('#tabletr').append("<th>????????????</th>")
    // }else{
    //     $('#tabletr').append("<th>????????????</th>")
    // }
    
    $('#tabletr').append("<th><a>?????????</a></th>")
    if(graphdata_x[0].sensor_fx1_data && graphdata_y[0].sensor_fx1_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx1_name+"</th>")
    }
    if(graphdata_x[0].sensor_fx2_data && graphdata_y[0].sensor_fx2_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx2_name+"</th>")
    }
    if(graphdata_x[0].sensor_fx3_data && graphdata_y[0].sensor_fx3_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx3_name+"</th>")
    }
    if(graphdata_x[0].sensor_fx4_data && graphdata_y[0].sensor_fx4_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx4_name+"</th>")
    }
    if(graphdata_x[0].sensor_fx5_data && graphdata_y[0].sensor_fx5_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx5_name+"</th>")
    }

    $('#tabletr').append("<th>??????</th>")
    $('#tabletr').append("<th>?????????</th>")

    $('#datatbletbody').empty()

    for(let i=0; i<tabledata.length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+tabledata[i].sensor_data_date.substr(0,16)+"</td>"
        tdtag += "<td>"
        tdtag +=   " <div class='uk-flex uk-flex-middle uk-text-center'>"
        // tdtag +=        " <div class='dis-inbl'>x: "+tabledata[i].x+"<br>y: "+tabledata[i].y+"</div>"
        // tdtag +=        " <div class='dis-inbl'>x: "+tabledata[i].x+"<br>y: "+tabledata[i].y+"</div>"
        if(tabledata[i].use_yn == 'N'){
            tdtag +=        " <div class='dis-inbl'><span class='sc-y'>x: "+tabledata[i].x+"</span>"
        }else if(tabledata[i].sensor_data_date == sensor_initial_date){
            tdtag +=        " <div class='dis-inbl'><span class='uk-text-blue'>x: "+tabledata[i].x
        }else if((level3_min &&  parseFloat(check_fx_data[i].sensor_fx_data_x)<parseFloat(level3_min) )||(level3_max && parseFloat(check_fx_data[i].sensor_fx_data_x) > parseFloat(level3_max))){
            tdtag +=        " <div class='dis-inbl'><span class='uk-text-red'>x: "+tabledata[i].x+"</span>"

        }else if((level2_min && parseFloat(check_fx_data[i].sensor_fx_data_x)<parseFloat(level2_min))||(level2_max && parseFloat(check_fx_data[i].sensor_fx_data_x) > parseFloat(level2_max))){
            tdtag +=        " <div class='dis-inbl'><span class='uk-text-orange'>x: "+tabledata[i].x+"</span>"

        }else if((level1_min &&  parseFloat(check_fx_data[i].sensor_fx_data_x)<parseFloat(level1_min) )||(level1_max && parseFloat(check_fx_data[i].sensor_fx_data_x) > parseFloat(level1_max))){
            tdtag +=        " <div class='dis-inbl'><span class='uk-text-yellow'>x: "+tabledata[i].x+"</span>"

        }else{
            tdtag +=        " <div class='dis-inbl'>x: "+tabledata[i].x
        }

        if(tabledata[i].use_yn == 'N'){
            tdtag +=        "<br><span class='sc-y'>y: "+tabledata[i].y+"</span></div>"
        }else if(tabledata[i].sensor_data_date == sensor_initial_date){
            tdtag +=        "<br><span class='uk-text-blue'>y: "+tabledata[i].y+"</span></div>"
        }else if((level3_min &&  parseFloat(check_fx_data[i].sensor_fx_data_y)<parseFloat(level3_min) )||(level3_max && parseFloat(check_fx_data[i].sensor_fx_data_y) > parseFloat(level3_max))){
            tdtag +=        "<br><span class='uk-text-red'>y: "+tabledata[i].y+"</span></div>"

        }else if((level2_min && parseFloat(check_fx_data[i].sensor_fx_data_y)<parseFloat(level2_min))||(level2_max && parseFloat(check_fx_data[i].sensor_fx_data_y) > parseFloat(level2_max))){
            tdtag +=        "<br><span class='uk-text-orange'>y: "+tabledata[i].y+"</span></div>"

        }else if((level1_min &&  parseFloat(check_fx_data[i].sensor_fx_data_y)<parseFloat(level1_min) )||(level1_max && parseFloat(check_fx_data[i].sensor_fx_data_y) > parseFloat(level1_max))){
            tdtag +=        "<br><span class='uk-text-yellow'>y: "+tabledata[i].y+"</span></div>"

        }else{
            tdtag +=        "<br>y: "+tabledata[i].y+"</div>"
        }







        if(usergr == '0101' && intervalday.length == 0){
            tdtag +=        "<div class='dis-inbl'><a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].x+"\",\""+tabledata[i].y+"\")'></a></div>"
            if(tabledata[i].use_yn == 'Y'){
                tdtag +=        "<div class='dis-inbl'><a class='uk-icon-link uk-margin-small-left' uk-icon='trash' onclick='trashmodal(\""+tabledata[i].sensor_data_date+"\")'></a></div>"
            }
            
        }else if(usergr == '0102' && intervalday.length == 0){
            tdtag +=        "<div class='dis-inbl'><a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].x+"\",\""+tabledata[i].y+"\")'></a></div>"
        }
        else if(usergr == '0103' && intervalday.length == 0){
            tdtag +=        "<div class='dis-inbl'><a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].x+"\",\""+tabledata[i].y+"\")'></a></div>"
        }
        
        tdtag +=    "</div>"
        tdtag += "</td>"

        if(graphdata_x[i].sensor_fx1_data && graphdata_y[i].sensor_fx1_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx1_data_x+"<br>y: "+tabledata[i].sensor_fx1_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx2_data && graphdata_y[i].sensor_fx2_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx2_data_x+"<br>y: "+tabledata[i].sensor_fx2_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx3_data && graphdata_y[i].sensor_fx3_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx3_data_x+"<br>y: "+tabledata[i].sensor_fx3_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx4_data && graphdata_y[i].sensor_fx4_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx4_data_x+"<br>y: "+tabledata[i].sensor_fx4_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx5_data && graphdata_y[i].sensor_fx5_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx5_data_x+"<br>y: "+tabledata[i].sensor_fx5_data_y+"</td>"
        }
        tdtag += " <td>"+t1h_data[i]+"</td>"
        tdtag += " <td>"+rn1_data[i]+"</td>"
        tdtag +=" </tr>"
        $('#datatbletbody').append(tdtag)
        // $('#row_'+i).hide()

    }

    // click_pagenum = 0
    // pagenation()

    datatable = $("#data-list").DataTable({
        "order": [[ 0, "desc" ]],
        "displayLength": 50, 
        "info": false,
        "language": {
            "search": "",
            "show": "",
            "sLengthMenu": "<span style='position: absolute; top: 8px; left: 0; display:none;'>??????</span> _MENU_ <span style='position: absolute; top: 5px;'></span>",
            "emptyTable": "???????????? ????????????.",
            "infoEmpty": "???????????? ????????????.",
            "zeroRecords": "?????? ????????? ????????????."
        },
        "bDestroy": true
    });

    $('#spinner_wrap').css('display','none');
    $('#apply_btn').attr('disabled', false);
}




function exceldown(){
    if(date_time_start.length == 0 && date_time_end.length != 0){
        alert("?????? ????????? ????????? ?????????")
        $('#date_time_start').focus()
        return;
    }else if(date_time_start.length != 0 && date_time_end.length == 0){
        alert("????????? ????????? ????????? ?????????")
        $('#date_time_end').focus()
        return;
    }else if(intervalday.length != 0 && time.length == 0){
        alert("????????? ????????? ?????????")
        $('#intervalday').focus()
        return;

    }

    let url = "/excel/down/scatter?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time

    $.ajax({
        url : url,
        type : "get",

        error:function(err){
            console.log(err)
           console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
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



let column00 = false
let column01 = true
let column02 = true
let column03 = true
let column04 = true
let column05 = true
let column06 = true
function orderling(num) {
    console.log("!!", num)
    console.log(graphdata_x)
    console.log(graphdata_y)

    if(column00){
        $('#order_0').attr('uk-icon', 'icon: chevron-down')
        graphdata_x = graphdata_x.sort((a,b) => {
            return moment(b.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ') - moment(a.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ')
    
            })
        graphdata_y = graphdata_y.sort((a,b) => {
            return moment(b.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ') - moment(a.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ')
    
            })
            selecttable()
            column00 = false
    }else{
        $('#order_0').attr('uk-icon', 'icon: chevron-up')
        graphdata_x = graphdata_x.sort((a,b) => {
            return moment(a.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ') - moment(b.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ')
    
        })
        graphdata_y = graphdata_y.sort((a,b) => {
            return moment(a.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ') - moment(b.sensor_data_date, 'YYYY-MM-DDTHH:mm:ssZ')
    
        })
        selecttable()
        column00 = true
    }


}

// next_time_start, next_time_end
function chartlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-6?"+encodeURIComponent(uri)
}

function trendlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-7?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-7?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function fomulalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4-1?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-4-1?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function infolocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-9?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-9?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function pdfdown(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.open("/report_scatter?"+encodeURIComponent(uri)) 
    // window.location.href =  "/ws-02-2-9?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}




function exceldownrecod(){
    if(intervalday.length > 0 || time.length > 0 || $('#intervalday').val() > 0 || $('#time').val() > 0){
        alert("RESET ????????? ?????? ????????? ??????????????????.")
        return;
    }
    
    let url = "/excel/down/scatter?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time

    $.ajax({
        url : "/excel/down/scatter",
        type : "post",
        data : {
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "sensor_idx": sensor_idx,
            "sensor_idy": sensor_idy,
        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}




function exceldownorigin(){
    if(intervalday.length > 0 || time.length > 0 || $('#intervalday').val() > 0 || $('#time').val() > 0){
        alert("RESET ????????? ?????? ????????? ??????????????????.")
        return;
    }
    let url = "/excel/down/scatter?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time

    $.ajax({
        url : "/excel/down/scatter/origin",
        type : "post",
        data : {
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "sensor_idx": sensor_idx,
            "sensor_idy": sensor_idy,
            

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}

function dataeditmodal(sensordate, sensordatax, sensordatay){
    console.log("??????????????????")
    $('#selectdate').text(sensordate)
    $('#sensordata_x').val(sensordatax)
    $('#sensordata_y').val(sensordatay)
 
}



function savebtn(){
    console.log(intervalday)
    let editdatavalue_x = $('#sensordata_x').val()
    let editdatavalue_y = $('#sensordata_y').val()
    let selectdate = $('#selectdate').text()
   

    if(intervalday.length !=0){
        alert("??????????????? ???????????? ????????? ??? ????????????.")
        return;
    }

    if(editdatavalue_x.length == 0 || editdatavalue_y.length == 0 ){
        alert("???????????? ??????????????????.")
        return;
    }

    console.log(editdatavalue_x, editdatavalue_y)
    let searchvalue = '.'; 
    let search_minus = '-'; 

    let pos_x = 0;
    let pos_minus_x = 1;
    let cnt_dot_x = 0;
    while (true) {
        let foundPos_x = editdatavalue_x.indexOf(searchvalue, pos_x);
        if (foundPos_x == -1){
            break;
        }else if(foundPos_x == 0 || foundPos_x == editdatavalue_x.length - 1){
            alert("X ???????????? ??????????????????.");
            return;
        } 
        pos_x = foundPos_x + 1; 
        cnt_dot_x++;
    }

    if(cnt_dot_x > 1){
        alert("X ???????????? ??????????????????.");
        return;
    }

    while (true) {
        let found_minus_x = editdatavalue_x.indexOf(search_minus, pos_minus_x);   // 1?????? ??????????????? ?????????, ??????
        if (found_minus_x == -1){
            break;
        }else {
            alert("X ???????????? ??????????????????.");
            return;
        } 
    }


    let pos_y = 0;
    let pos_minus_y = 1;
    let cnt_dot_y = 0;
    while (true) {
        let foundPos_y = editdatavalue_y.indexOf(searchvalue, pos_y);
        if (foundPos_y == -1){
            break;
        }else if(foundPos_y == 0 || foundPos_y == editdatavalue_y.length - 1){
            alert("Y ???????????? ??????????????????.");
            return;
        } 
        pos_y = foundPos_y + 1; 
        cnt_dot_y++;
    }

    if(cnt_dot_y > 1){
        alert("Y ???????????? ??????????????????.");
        return;
    }

    while (true) {
        let found_minus_y = editdatavalue_y.indexOf(search_minus, pos_minus_y);   // 1?????? ??????????????? ?????????, ??????
        if (found_minus_y == -1){
            break;
        }else {
            alert("Y ???????????? ??????????????????.");
            return;
        } 
    }

    $.ajax({
        url : "/editdata",
        type : "put",
        data : {
            "sensor_id_x": sensor_idx,
            "sensor_id_y": sensor_idy,
            "sensor_data_x": editdatavalue_x,
            "sensor_data_y": editdatavalue_y,
            "sensor_data_date": selectdate,

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            alert(data.resultString)
          
            // searchdata()
           console.log("Success")
           let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
           window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
            // window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time

         
       }
    });
}




function trashmodal(sensor_data_date){
    console.log("??????", sensor_data_date)
    let confirmdata = confirm("?????? ????????? ???????????? ?????? ?????????????????????????")

    $.ajax({
        url : "/editdata/delete",
        type : "post",
        async: false,
        data:{
            "sensor_id":sensor_idx,
            "sensor_data_date": sensor_data_date,
           
            
        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
        console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
          alert(data.resultString)
          let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
          window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
        //   window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time

    }
    });
}