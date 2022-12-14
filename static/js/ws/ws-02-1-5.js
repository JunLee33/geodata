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

let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let sensorgroup_interval = "";

let table_fx_data =[];

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
    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:($('#date_time_start').val())});


 
   
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
        } else if(startday < initaildate){
            date_time_start = get_initial_date;
            $('#date_time_start').val(get_initial_date);
        }


        $.ajax({
            url : "/editdata/all/line",
            type : "POST",
            data : {
                "datarogger_id": datarogger_id,
                "date_time_start": date_time_start,
                "date_time_end": date_time_end,
                "intervalday": intervalday,
                "time": time,
                "datarogger_id": datarogger_id,
                "sensorgroup_id": sensorgroup_id,
                "sensorgroup_type": sensorgroup_type

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
                group_interval = data.groupinterval

                tabledata = []
                tabledata = data.data
                console.log(tabledata)
            

                table_fx_data = data.table_fx_data
                console.log(table_fx_data)
                next_time_start = date_time_start;
                next_time_end = date_time_end;

                click_pagenum = 0
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

                for(let i=0; i<table_fx_data.length; i++){
                    table_fx_data[i]['t1h'] = null
                    table_fx_data[i]['rn1'] = null
             
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == table_fx_data[i].sensor_data_date){
                            table_fx_data[i]['t1h'] = weatherdata[j].weather_t1h + " ???"
                            table_fx_data[i]['rn1'] = weatherdata[j].weather_rn1 + " mm"
    
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
              
           
                weatherdata = data.data
                console.log(weatherdata)
    
                for(let i=0; i<table_fx_data.length; i++){
                    table_fx_data[i]['t1h'] = null
                    table_fx_data[i]['rn1'] = null
             
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == table_fx_data[i].sensor_data_date){
                            table_fx_data[i]['t1h'] = weatherdata[j].weather_t1h + " ???"
                            table_fx_data[i]['rn1'] = weatherdata[j].weather_rn1 + " mm"
    
                        }
                    }
                }
    
    
           }
        });
    }

    


    if(datatable){datatable.destroy()}

    let t_sensorname = []; //sensorname list
    let t_sensordate = [];


    let sensoralldata = [];

    let sensorM = []
    if(sensorgroup_type == '0202'){
        sensorM.push('0m')
    }
    // for(let i=0; i< tabledata.length; i++){
    for(let i= (tabledata.length-1); i >= 0; i--){
        sensorgroup_interval = group_interval[i]
        let sensorinterval = sensorgroup_interval
        sensorM.push(sensorinterval)
    }
    console.log(sensorM)


    let rowindex = 0
    $('#tabletbody').empty()
    // $('#tabletbody').append("<tr class='uk-text-blue' id='table_top_initial'></tr>")
    $('#tabletbody').append("<tr class='uk-text-success' id='table_top_Displacement'></tr>")
    $('#table_top_name').empty()
    $('#table_top_name').append("<th>????????????</th>")
    for(let i = 0; i<sensorM.length; i++){
        $('#table_top_name').append("<th>"+sensorM[i]+"</th>")

        if(i == sensorM.length-1){
            $('#table_top_name').append("<th>??????</th>")
            $('#table_top_name').append("<th>?????????</th>")
        
        }
       
    }




    $('#table_top_Displacement').empty()
    $('#table_top_Displacement').append("<td>????????????</td>")
    // if(sensorgroup_type == '0202'){
    //     $('#table_top_Displacement').append("<td>-</td> ")
    // }
    // for(let i = 0; i<sensordata.length; i++){
       
       
    //     if(sensordata[i].sensor_initial_data){
    //         let displacement = 0;
    //         let current_sensor_data = "";
    //         for(let j = 0; j<tabledata[0].length; j++){
    //             if(tabledata[i][j].sensor_data){
    //                 let displ = Math.abs(parseFloat(tabledata[i][j].sensor_data) - parseFloat(sensordata[i].sensor_initial_data))
    //                 if(j == 0){
    //                     displacement = displ
    //                     current_sensor_data = tabledata[i][j].sensor_fx_data
    //                 }
    //                 if (displacement < displ){
    //                     displacement = displ
    //                     current_sensor_data = tabledata[i][j].sensor_fx_data
    //                 } 
    //             }
                
    //         }

    //         if(displacement.length !=0){
    //             $('#table_top_Displacement').append("<td>"+current_sensor_data+"</td>")
    //         }
    //     }

        // if(i == sensordata.length-1){
        //     $('#table_top_Displacement').append("<td></td>")
        //     $('#table_top_Displacement').append("<td></td>")
        // }
    //     // $('#table_top_Displacement').append("<td>"+Math.max.apply(null,displacement)+"</td>")
    // }



    // console.log(sensorM.length)
    const max = new Array(sensorM.length);
    
    for(let i=0; i<table_fx_data.length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+table_fx_data[i].sensor_data_date.substr(0,16)+"</td>"
        for(let j=0; j<sensorM.length; j++){

            if(i == 0){
                max[j] = parseFloat(table_fx_data[i][sensorM[j]])
                $('#table_top_Displacement').append("<td id='max_"+j+"'>"+max[j]+"</td>")
            } else if(Math.abs(parseFloat(max[j])) < Math.abs(parseFloat(table_fx_data[i][sensorM[j]]))){
                max[j] = table_fx_data[i][sensorM[j]]
                $('#max_'+j).text(max[j])
            }

            if(get_initial_date == table_fx_data[i].sensor_data_date.substr(0,16)){
                tdtag += "<td class='uk-text-blue'>"+table_fx_data[i][sensorM[j]]+"</td>"
            }else if((level3_min && parseFloat(level3_min)>table_fx_data[i][sensorM[j]]) || (level3_max && parseFloat(level3_max)<table_fx_data[i][sensorM[j]])){
                tdtag += "<td class='uk-text-red'>"+table_fx_data[i][sensorM[j]]+"</td>"
            }else if((level2_min && parseFloat(level2_min)>table_fx_data[i][sensorM[j]]) || (level2_max && parseFloat(level2_max)<table_fx_data[i][sensorM[j]])){
                tdtag += "<td class='uk-text-orange'>"+table_fx_data[i][sensorM[j]]+"</td>"
            }else if((level1_min && parseFloat(level1_min)>table_fx_data[i][sensorM[j]]) || (level1_max && parseFloat(level1_max)<table_fx_data[i][sensorM[j]])){
                tdtag += "<td class='uk-text-yellow'>"+table_fx_data[i][sensorM[j]]+"</td>"
            }else{
                tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
            }
         

        }
        
        let t1h_value = ""
        let rn1_value = ""
        if(table_fx_data[i].t1h){
            t1h_value = table_fx_data[i].t1h
            rn1_value = table_fx_data[i].rn1
        }
        tdtag += "<td>"+t1h_value+"</td>"
        tdtag += "<td>"+rn1_value+"</td>"
        // tdtag += "<td></td>"
        // tdtag += "<td></td>"
        tdtag +="</tr>"
        $('#tabletbody').append(tdtag)
    }

    // if(sensorgroup_type == '0202'){
    //     $('#table_top_Displacement').append("<td>0</td> ")
    // }
    $('#table_top_Displacement').append("<td></td>")
    $('#table_top_Displacement').append("<td></td>")
    


    datatable = $("#data-list").DataTable({
        // "scrollY": '500px',
        // "scrollX": true,
        // "scrollCollapse": true,
        // "fixedColumns":   true,
        // "fixedHeader": true,
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

    click_pagenum = 0
    // pagenation()


    $('#spinner_wrap').css('display','none');
    $('#apply_btn').attr('disabled', false);
}




function pagenation(){

    let tablelen = $('#tablelen').val()
    // console.log(tablelen)
  
    let datalen = tabledata[0].length
    // let datalen = $('#tabletbody tr').length
 
    let pagelen = Math.ceil(datalen/tablelen)


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

    click_pagenum = pagenum

    let tablelen = $('#tablelen').val()
  
 

    let datalen = tabledata[0].length

    let pagelen = Math.ceil(datalen/tablelen)


    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)

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
  
    

    // "datarogger_id": datarogger_id,
    // "date_time_start": date_time_start,
    // "date_time_end": date_time_end,
    // "intervalday": intervalday,
    // "time": time,
    // "datarogger_id": datarogger_id,
    // "sensorgroup_id": sensorgroup_id

    let url = "/excel/down/all?sensorgroup_id="+sensorgroup_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time+"&sensorgroup_type="+sensorgroup_type

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
function chartlocation(){
    if(sensorgroup_type == '0201'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-1?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }else if(sensorgroup_type == '0202'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }
   
}

function trendlocation(){
    if(sensorgroup_type == '0201'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-3?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-3?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }else if(sensorgroup_type == '0202'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-4?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-4?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }


}

function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-9?" +encodeURIComponent(uri)
   
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-5?" +encodeURIComponent(uri)
 
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6?" +encodeURIComponent(uri)
    
}

function pdfdown(params) {
    //                          project_id=6&sensorgroup_id=13&sensorgroup_type=0203&date_time_start=2022.04.21%2014:08&date_time_end=2022.04.28%2014:08&intervalday=&time=
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.open("/report_other_all?"+encodeURIComponent(uri))
}
