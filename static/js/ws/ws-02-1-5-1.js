let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensordata = [];
let tabledata = [];
let sensorgroup_type = "";

let click_pagenum = "";

// let chart;
let datatable;
let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_name_list = []
let sensor_display_name_list = []

let date_time_start = "";
let date_time_end = "";
let intervalday = "";
let time = "";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

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

    console.log(date_time_end, date_time_start, time,intervalday )

    $("#date_time_start").val(date_time_start)
    $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    $("#date_time_end").val(date_time_end)
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)
    
    
   
    $('#tablelen').change(function(){
        click_pagenum = 0
        pagenation()
    })



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
            get_initial_date = sensordata[0].sensorgroup_initial_date;

  
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            $('#topname').text(sensordata[0].sensorgroup_name)

            $('#date_time_start').datetimepicker({minDate:(get_initial_date)});

            let startday = moment($('#date_time_start').val(), 'YYYY-MM-DDTHH:mm:ssZ')
            let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ')

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:(get_initial_date)});
            }
         }
    })

    searchdata()

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});
    })
});



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

        let startday = moment(date_time_start, 'YYYY-MM-DDTHH:mm:ssZ')
        let lastday = moment(date_time_end, 'YYYY-MM-DDTHH:mm:ssZ')
        
        let today = moment()
        let initaildate = moment(get_initial_date, 'YYYY-MM-DDTHH:mm:ssZ')

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


        $.ajax({
            url : "/editdata/all",
            type : "POST",
            data : {
                "datarogger_id": datarogger_id,
                "date_time_start": date_time_start,
                "date_time_end": date_time_end,
                "intervalday": intervalday,
                "time": time,
                "datarogger_id": datarogger_id,
                "sensorgroup_id": sensorgroup_id

            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
                alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                $('#spinner_wrap').css('display','none');
                $('#apply_btn').attr('disabled', false);
            },
            success:function(data) {
                console.log(data.resultString)
            //    console.log("Success")

                tabledata = []
                tabledata = data.data
                console.log(tabledata)

                click_pagenum = 0

                next_time_start = date_time_start;
                next_time_end = date_time_end;


                if(tabledata[0].length ==0){
                    alert("????????? ????????? ???????????? ???????????? ????????????. ????????? ?????? ????????? ?????????.")
                    $('#spinner_wrap').css('display','none');
                    $('#apply_btn').attr('disabled', false);
                }else{
                    selecttable()
                }
        
            }
        });
    }, 500);           

}

function selecttable(){

    let sensor_Date = []

    for(let i=0; i<tabledata[0].length; i++){
        sensor_Date.push(tabledata[0][i].sensor_data_date)
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

    // url = "/weather/data?project_id="+project_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
    // $.ajax({
    //     url : url,
    //     type : "get",
    //     async: false,
    //     // contentType : false,
    //     // processData : false,
    //     error:function(err){
    //         console.log(err)
    //        console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
    //     },
    //     success:function(data) {
    //         console.log(data.resultString)
       
    //         weatherdata = data.data
    //         console.log(weatherdata)

    //         for(let i=0; i<sensor_Date.length; i++){
    //             t1h_data.push("")
    //             rn1_data.push("")
         
    //             for(let j=0; j<weatherdata.length; j++){
    //                 if(weatherdata[j].weather_date == sensor_Date[i]){
    //                     t1h_data[i] = weatherdata[j].weather_t1h + " ???"
    //                     rn1_data[i] = weatherdata[j].weather_rn1 + " mm"

    //                 }
    //             }
    //         }


    //    }
    // });

    console.log(tabledata)
    if(datatable){datatable.destroy()}
    let t_sensorname = []; //sensorname list
    let t_sensordate = [];

    let rowindex = 0
    $('#tabletbody').empty()
    $('#tabletbody').append("<tr class='uk-text-success' id='table_top_Displacement'></tr>")
    $('#table_top_name').empty()
    $('#table_top_name').append("<th>????????????</th>")
    for(let i = 0; i<sensor_display_name_list.length; i++){
        $('#table_top_name').append("<th>"+sensor_display_name_list[i]+"</th>")
       
        if(i == sensordata.length-1){
            $('#table_top_name').append("<th>??????</th>")
            $('#table_top_name').append("<th>?????????</th>")
        }
    }



    $('#table_top_Displacement').empty()
    $('#table_top_Displacement').append("<td>????????????</td>")
    // for(let i = 0; i<sensordata.length; i++){
    //     console.log(sensordata[i].sensor_initial_data)
       
    //     let displacement = 0
    //     let current_sensor_fx_data = "";
    //     for(let j = 0; j<tabledata[0].length; j++){
    //         let displ = Math.abs(parseFloat(tabledata[i][j].sensor_data) - parseFloat(sensordata[i].sensor_initial_data))
    //         if(displ > displacement){
    //             displacement = displ
    //             current_sensor_fx_data = tabledata[i][j].sensor_fx_check_data
    //         }
    //     }
        
    //     $('#table_top_Displacement').append("<td>"+current_sensor_fx_data+"</td>")
       

    //     if(i == sensordata.length-1){
    //         $('#table_top_Displacement').append("<td></td>")
    //         $('#table_top_Displacement').append("<td></td>")
    //     }
     
    // }



    const max = new Array(tabledata.length);

    for(let i = 0; i<tabledata[0].length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+tabledata[0][i].sensor_data_date.substr(0,16)+"</td>"

        for(let j = 0; j<tabledata.length; j++){

            if(i == 0){
                max[j] = parseFloat(tabledata[j][i].sensor_fx_check_data)
                $('#table_top_Displacement').append("<td id='max_"+j+"'>"+max[j]+"</td>")
            } else if(Math.abs(parseFloat(max[j])) < Math.abs(parseFloat(tabledata[j][i].sensor_fx_check_data))){
                max[j] = tabledata[j][i].sensor_fx_check_data
                $('#max_'+j).text(max[j])
            }

            if(tabledata[j][i].sensor_fx_check_data){
                // console.log(tabledata[j][i].sensor_fx_check_data)
                if((level3_min && parseFloat(level3_min) > parseFloat(tabledata[j][i].sensor_fx_check_data)) || (level3_max && parseFloat(level3_max) < parseFloat(tabledata[j][i].sensor_fx_check_data)) ){
                    tdtag += "<td class='uk-text-red'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                }else if((level2_min && parseFloat(level2_min) > parseFloat(tabledata[j][i].sensor_fx_check_data)) || (level2_max && parseFloat(level2_max) < parseFloat(tabledata[j][i].sensor_fx_check_data))){
                    tdtag += "<td class='uk-text-orange'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                }else if((level1_min && parseFloat(level1_min) > parseFloat(tabledata[j][i].sensor_fx_check_data)) || (level1_max && parseFloat(level1_max) < parseFloat(tabledata[j][i].sensor_fx_check_data))){
                    tdtag += "<td class='uk-text-yellow'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                }else{
                    tdtag += "<td>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                }
             
                
                // if(level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                //     ((parseFloat(level1_min) > parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level2_min) < parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level1_max) < parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level2_max) > parseFloat(tabledata[j][i].sensor_fx1_data)))){
                  
                        
                //     tdtag += "<td class='uk-text-yellow'>"+tabledata[j][i].sensor_data+"</td>"
        
                // }else if(level2_min.length !=0 && level2_max.length !=0 && level3_min.length !=0 && level3_max.length !=0 &&
                //     ((parseFloat(level2_min) >parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level3_min) < parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level2_max) < parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level3_max) > parseFloat(tabledata[j][i].sensor_fx1_data)))){
                //         tdtag += "<td class='uk-text-orange'>"+tabledata[j][i].sensor_data+"</td>"
                
                // }else if(level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level3_max) < parseFloat(tabledata[j][i].sensor_fx1_data)))){
                //     tdtag += "<td class='uk-text-red'>"+tabledata[j][i].sensor_data+"</td>"
                 

                   
                // }else{
                //     tdtag += "<td >"+tabledata[j][i].sensor_data+"</td>"
                // }
                
            }else{
                // console.log(tabledata[j][i].sensor_fx_check_data)
                // console.log("?")
                tdtag += "<td></td>"
            }
        }
        tdtag += "<td>"+t1h_data[i]+"</td>"
        tdtag += "<td>"+rn1_data[i]+"</td>"

        tdtag +="</tr>"
        $('#tabletbody').append(tdtag)
        // $('#row_'+i).hide()
    }

    $('#table_top_Displacement').append("<td></td>")
    $('#table_top_Displacement').append("<td></td>")

    datatable = $("#data-list").DataTable({
        "fixedHeader": true,
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


function pagenation(){

    let tablelen = $('#tablelen').val()
    // console.log(tablelen)
  
    let datalen = tabledata[0].length
    // let datalen = $('#tabletbody tr').length
    console.log("datalen", datalen)

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)


    $('#pagenation').empty()
    $('#pagenation').append("<li><a onclick='pagemove(0)'><span uk-pagination-previous></span></a></li>")
    for(let i =0; i<pagelen; i++){
        // $('#pagenation').append("<li><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        $('#pagenation').append("<li id='page_"+i+"'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        // if(i == click_pagenum){
        //     $('#pagenation').append("<li id='page_"+i+"' class='uk-active'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        // }else{
        //     $('#pagenation').append("<li id='page_"+i+"'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        // }
        if(i == pagelen-1){
            $('#pagenation').append("<li><a onclick='pagemove("+i+")'><span uk-pagination-next></span></a></li>")
        }
        $('#page_'+i).hide()
        
    }
 

    if(click_pagenum == 0){
        pagemove(0)
    }

}


function pagemove(pagenum){
    console.log("pagemove")
    click_pagenum = pagenum

    let tablelen = $('#tablelen').val()
  
    console.log(tablelen)

    let datalen = tabledata[0].length

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)

    console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)
    console.log(last)
    for(let i =0; i <tabledata[0].length; i++){
        if(tablelen*pagenum <= i && i < last ){
            // console.log("row", i)
            $('#row_'+i).show()
        }else{
            $('#row_'+i).hide()
        }
    }

    for(let i = 0; i <pagelen; i++){
        if(click_pagenum < 5){
            if(0 <= i && i <10){
                // console.log("1",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }else if(click_pagenum > pagelen-6){
            
            if(pagelen-11 < i && i <= pagelen-1){
                // console.log("2",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }else{
            if(click_pagenum-5 < i && i <= click_pagenum+5){
                // console.log("3",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }

        if(i == click_pagenum){
            $('#page_'+i).addClass('uk-active')
        }else{
            $('#page_'+i).removeClass('uk-active')
        }

    }

    // pagenation()

}


function exceldown(){
    let intervalday = $('#intervalday').val()
    let time = $('#time').val()
    let date_time_start = $('#date_time_start').val()
    let date_time_end = $('#date_time_end').val()

    console.log(intervalday, time, date_time_start, date_time_end, datarogger_id)

    if(date_time_start.length == 0 && date_time_end.length != 0){
        alert("?????? ????????? ????????? ?????????")
        $('#date_time_start').focus()
        return;
    }else if(date_time_start.length != 0 && date_time_end.length == 0){
        alert("????????? ????????? ????????? ?????????")
        $('#date_time_end').focus()
        return;
    }
    // "datarogger_id": datarogger_id,
    // "date_time_start": date_time_start,
    // "date_time_end": date_time_end,
    // "intervalday": intervalday,
    // "time": time,
    // "datarogger_id": datarogger_id,
    // "sensorgroup_id": sensorgroup_id

    let url = "/excel/down/all?sensorgroup_id="+sensorgroup_id+"&datarogger_id="+datarogger_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time+"&sensorgroup_type="+sensorgroup_type

    $.ajax({
        url : url,
        type : "get",
        // data : {
        //     "sensor_id": sensor_id,
        //     "datarogger_id": datarogger_id,
        //     "date_time_start": date_time_start,
        //     "date_time_end": date_time_end,
        //     "intervalday": intervalday,
        //     "time": time,
        //     "sensor_name": sensor_name

        // },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}

// next_time_start, next_time_end
function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-8?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-8?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-5-1?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-5-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6-2?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-6-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function pdfdown(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.open("/report_independent_all?"+encodeURIComponent(uri))
}