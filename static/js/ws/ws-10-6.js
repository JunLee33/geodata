let project_id = "";
let sensorlist = [];
let click_pagenum = "";
let datarogger_id = "";

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)


   
    $('#projectsetup').attr('href',"ws-10?"+encodeURIComponent("cHJ="+ project_id) )
    $('#topproject').attr("href","ws-10?"+encodeURIComponent("cHJ="+ project_id))
   
    $.ajax({
        url:"datalogger/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            let datalogger = json.data
            // let company_info = JSON.parse(json.data)
            // console.log(datalogger) 

            for(let i=0; i<datalogger.length; i++){
                $('#dataloggerlist').append("<option value='"+datalogger[i].datarogger_id+"'>"+datalogger[i].datarogger_name+"</option>")
                datalogger[i].datarogger_name
            }


            datarogger_id = datalogger[0].datarogger_id


            searchsensor(datarogger_id)
                
        }
    })


    $('#dataloggerlist').change(function(){
        console.log($("#dataloggerlist option:selected").val())

        datarogger_id = $("#dataloggerlist option:selected").val()

        
        // $.ajax({
        //     url:"sensordetail/list?datarogger_id="+datarogger_id,
        //     type:"post",
        //     contentType: false,
        //     processData : false,
        //     error:function(err){
        //         console.log(err);
        //      },
        //      success:function(json) {
        //         console.log("succes")
    
        //         let sensorlist = json.data
        //         // let company_info = JSON.parse(json.data)
        //         console.log(sensorlist) 


        //     }
        // })

        searchsensor(datarogger_id)


        
    })
    $('#sensor_st_over_ex').on('change',function(){
        var is_checked = document.getElementById('sensor_st_over_ex').checked;

        if(is_checked){
            $('#sensor_max').attr('readonly',false)
            $('#sensor_min').attr('readonly',false)
        }else{
            $('#sensor_max').val('')
            $('#sensor_min').val('')
            $('#sensor_max').attr('readonly',true)
            $('#sensor_min').attr('readonly',true)
        }
    })

    $('#sensor_default_wt').on('change',function(){
        var is_checked = document.getElementById('sensor_default_wt').checked;

        if(is_checked){
            $('#sensor_deviation').attr('readonly',false)
            $('#sensor_weight').attr('readonly',false)
        }else{
            $('#sensor_deviation').val('')
            $('#sensor_weight').val('')
            $('#sensor_deviation').attr('readonly',true)
            $('#sensor_weight').attr('readonly',true)
        }
    })

})


function searchsensor(dataLogger_id){
    console.log("!")
    $.ajax({
        url:"/sensordetail/list?datarogger_id="+dataLogger_id,
        type:"POST",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            // console.log("succes")

            sensorlist = json.data
            console.log(sensorlist)
            // let company_info = JSON.parse(json.data)
            $('#tbl_tbody').empty()
            for(let i=0; i<sensorlist.length; i++){
                let count = 0;
                let tdtag = "<tr id='row_"+i+"'>"
                tdtag +=           "<td>"+sensorlist[i].sensor_index+"</td>"
                tdtag +=   "<td>"+sensorlist[i].sensor_display_name+"<a href='/ws-10-6-1?"+encodeURIComponent("c2V="+sensorlist[i].sensor_id+"&cHJ="+project_id+"&aWd="+sensorlist[i].sensor_detail_id+"&dtr="+datarogger_id)+"' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' ></a></td>"
                

                if(sensorlist[i].sensorgroup_type == '0201'){
                    tdtag +=           "<td class='uk-text-center'>?????????</td>"
                } else if(sensorlist[i].sensorgroup_type == '0202'){
                    tdtag +=           "<td class='uk-text-center'>?????????</td>"
                } else if(sensorlist[i].sensorgroup_type == '0203'){
                    tdtag +=           "<td class='uk-text-center'>?????????</td>"
                } else if(sensorlist[i].sensorgroup_type == '0204'){
                    tdtag +=           "<td class='uk-text-center'>?????????</td>"
                } else if(sensorlist[i].sensorgroup_type == '0205'){
                    tdtag +=           "<td class='uk-text-center'>?????????</td>"
                } else if(sensorlist[i].sensorgroup_type == '0206'){
                    tdtag +=           "<td class='uk-text-center'>?????????</td>"
                } else {
                    tdtag +=           "<td class='uk-text-center'></td>"
                }


                if(sensorlist[i].sensor_type == 'single'){
                    tdtag +=           "<td class='uk-text-center'><span class='sc-s'>"+sensorlist[i].sensor_type+"</span></td>"
                } else if(sensorlist[i].sensor_type == 'x'){
                    tdtag +=           "<td class='uk-text-center'><span class='sc-x'>"+sensorlist[i].sensor_type+"-Axis</span></td>"
                } else if(sensorlist[i].sensor_type == 'y'){
                    tdtag +=           "<td class='uk-text-center'><span class='sc-y'>"+sensorlist[i].sensor_type+"-Axis</span></td>"
                } else {
                    tdtag +=           "<td class='uk-text-center'></td>"
                }


                
                if(sensorlist[i].place_name){
                    tdtag +=           "<td>"+sensorlist[i].place_name+"</td>"
                }else{tdtag +=           "<td></td>"}
                
                if(sensorlist[i].sensorgroup_name){
                    tdtag +=           "<td>"+sensorlist[i].sensorgroup_name+"</td>"
                }else{tdtag +=           "<td></td>"}
              
                // if(sensorlist[i].sensor_fx1 && sensorlist[i].sensor_fx2 && sensorlist[i].sensor_fx3 && sensorlist[i].sensor_fx4 && sensorlist[i].sensor_fx5){
                if(sensorlist[i].sensor_fx1){
                    tdtag +=      "<td class='uk-text-center'><span class='icon-guideline-b'></span></td>"
                    count +=1
                }else{
                    tdtag +=      "<td class='uk-text-center'><span class='icon-guideline-d'></span></td>"
                }


                // if(sensorlist[i].sensor_gl1_max && sensorlist[i].sensor_gl1_min && sensorlist[i].sensor_gl2_max && sensorlist[i].sensor_gl2_min && sensorlist[i].sensor_gl3_max && sensorlist[i].sensor_gl3_min &&
                //     sensorlist[i].sensor_gl1_max.length>0 && sensorlist[i].sensor_gl1_min.length>0 && sensorlist[i].sensor_gl2_max.length>0 && sensorlist[i].sensor_gl2_min.length>0 && sensorlist[i].sensor_gl3_max.length>0 && sensorlist[i].sensor_gl3_min.length>0){
                if(sensorlist[i].sensor_gl1_max){
                    tdtag +=      "<td class='uk-text-center'><span class='icon-guideline-b'></span></td>"
                    count +=1
                }else{
                    tdtag +=      "<td class='uk-text-center'><span class='icon-guideline-d'></span></td>"
                }
             
                if((sensorlist[i].sensor_max && sensorlist[i].sensor_max.length>0 )||(sensorlist[i].sensor_min && sensorlist[i].sensor_min.length>0) ||
                    (sensorlist[i].sensor_weight && sensorlist[i].sensor_weight.length>0) || (sensorlist[i].sensor_deviation  && sensorlist[i].sensor_deviation.length>0) ){
                    tdtag +=      "<td class='uk-text-center'><span class='icon-guideline-b'></span></td>"
                    count +=1
                }else{
                    tdtag +=      "<td class='uk-text-center'><span class='icon-guideline-d'></span></td>"
                }
                
                if(sensorlist[i].sensor_noti && sensorlist[i].sensor_noti == 'Y'){
                    tdtag +=          "<td class='uk-text-center'><span class='icon-guideline-b'></span></td>"
                }else{
                    tdtag +=          "<td class='uk-text-center'><span class='icon-guideline-d'></span></td>"
                }
                
                if(count == 3){
                    tdtag +=         "<td class='uk-text-center uk-text-blue'>??????</td>"
                }else if(count == 0){
                    tdtag +=         "<td class='uk-text-center'>??????</td>"
                }else{
                    tdtag +=         "<td class='uk-text-center'>?????????</td>"
                }
 
                tdtag +=        "</tr>"

                $('#tbl_tbody').append(tdtag)
                // $('#row_'+i).hide()
            }

            // pagenation()

            // $("#data-list").DataTable({
            //     "order": [[ 0, "desc" ]],
            //     "displayLength": 50, 
            //     "info": false,
            //     "language": {
            //         "search": "",
            //         "show": "",
            //         "sLengthMenu": "<span style='position: absolute; top: 8px; left: 0; display:none;'>??????</span> _MENU_ <span style='position: absolute; top: 5px;'></span>",
            //         "emptyTable": "???????????? ????????????.",
            //         "infoEmpty": "???????????? ????????????.",
            //         "zeroRecords": "?????? ????????? ????????????."
            //     },
            //     "bDestroy": true
            // });
                
        }
    })

}




function pagenation(){

    let tablelen = 10
    // console.log(tablelen)
  
    let datalen = sensorlist.length
    // console.log("datalen", datalen)

    let pagelen = Math.ceil(datalen/tablelen)

    // console.log(datalen, datalen/tablelen, pagelen)


    $('#pagenation').empty()
    $('#pagenation').append("<li><a onclick='pagemove(0)'><span uk-pagination-previous></span></a></li>")
    for(let i =0; i<pagelen; i++){
        
        $('#pagenation').append("<li id='page_"+i+"'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
       
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

    let tablelen = 10
  
    console.log(tablelen)

    let datalen = sensorlist.length

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)

    console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)

    for(let i =0; i <sensorlist.length; i++){
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




function datasave(){
    console.log("datasace")
    tablelength = $('#sensortable >tbody tr').length  //table ??????
    console.log(tablelength)


    // let td = $('#sensortable >tbody tr:eq(0)>td:eq(1)')
    // console.log(td.html())
    // console.log(td.eq(0).text())
    // console.log($('#sensortable >tbody tr:eq(2)'))
    // console.log($('#sensortable >tbody tr:eq(3)'))


    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let sensorname = $("#sensorname_" + i).val()
        let sensorsn = $("#sensorsn_" + i).val()
        let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let sensorid = $("#sensorid_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let sensor_index = i+1
        tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname,  "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index })
    }

    // console.log(tabledata)

    JSON.stringify(tabledata)


    ////????????? ?????????
    $.ajax({
        url:"sensor/list",
        type:"post",
        data: JSON.stringify(tabledata),
        contentType: "application/json",
        // processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

          
                
        }
    })






}

function sensormodal(){
    console.log("sensormodal open")
    $('#btn_apply').unbind('click');
    $('#place').unbind('change');
    
    $('#place').empty();
    $('#fomula01, #fomula02, #fomula03, #fomula04, #fomula05').empty();
    $('#sensorgroup').empty()
    $('#dataroggerSensorList').empty()

    $('#place').append('<option selected="">??????</option>');
    $('#fomula01, #fomula02, #fomula03, #fomula04, #fomula05').append('<option selected="" value="">??????</option>');
    $('#sensorgroup').append('<option selected="">??????</option>');
    $('#dataroggerSensorList').empty()

    

    $.ajax({
        url:"place/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        async : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            placelist = json.data
            // let company_info = JSON.parse(json.data)
            console.log(placelist) 
            for(let i = 0; i <placelist.length; i++){
           
                $('#place').append("<option value='"+placelist[i].place_id+"'>"+placelist[i].place_name+"</option>")
            }
        
         }
    })


    //?????? ?????? ????????? 
    $.ajax({
        url:"sensorgroup/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        async : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
            console.log(json.data)

            sensorgrouplist = json.data
            console.log(sensorgrouplist)
         }
    })

    $.ajax({
        url : '/fomula/list/project?project_id='+project_id,
        type : "get",
        contentType : false,
        processData : false,
        async : false,
        error:function(){
           alert("????????? ???????????? ????????????.");
        },
        success:function(data) {

            console.log(data.data)

            fomulalist = data.data

            for(let i=0; i<fomulalist.length; i++){
                $('#fomula01, #fomula02, #fomula03, #fomula04, #fomula05').append("<option value='"+fomulalist[i].function_id+"' function_fomula='"+fomulalist[i].function_formula+"'>"+fomulalist[i].function_name+"</option>")
            }


            
       }
    });

    //???????????? ???????????? ?????? ????????? ?????? ??????
    $('#place').change(function(){
      

        let current_place = $("#place option:selected").val();

        $('#sensorgroup').empty()

        $('#sensorgroup').append("<option selected=''>??????</option>")
        
        console.log(current_place)
        for(let i = 0; i < sensorgrouplist.length ; i++){
            console.log("1")
            if(sensorgrouplist[i].place_id == current_place){
                console.log("1")
                $('#sensorgroup').append("<option value='"+sensorgrouplist[i].sensorgroup_id+"'>"+sensorgrouplist[i].sensorgroup_name+"</option>")
            }
        }

    })

    let dataroggerlist = []

    $.ajax({
        url:"/sensor/setting/all?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        async : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
            console.log(json.data)

            let datalist = json.data
            console.log(datalist)
            dataroggerlist = []
            let sensorlist = []
            let currentdataroggerid = "";
            $('#dataroggerSensorList').empty()
            for(let i=0; i<datalist.length; i++){
                currentdataroggerid = datalist[i].datarogger_id
                console.log(currentdataroggerid)
                if(dataroggerlist.indexOf(datalist[i].datarogger_id) == -1){
                    dataroggerlist.push(datalist[i].datarogger_id)
                    

                    let divtag = "<div class='li-none'>"
                    divtag += "<ul class='uk-list li-none'>"
                    divtag +=     "<li>"
                    divtag +=         "<label class='sensor_group'><input class='uk-checkbox' type='checkbox' name='checkbox_dr' id='checkbox_"+datalist[i].datarogger_id+"' value='"+datalist[i].datarogger_id+"'><span class='mg-l-10'>"+datalist[i].datarogger_name+"</span></label>"
                    divtag +=        "<ul id='dataroggerId_"+datalist[i].datarogger_id+"'>"
                    divtag +=            "<li><label><input class='uk-checkbox' type='checkbox' datarogger='"+datalist[i].datarogger_id+"' name='sensor' sensor='"+datalist[i].sensor_id+"'><span class='mg-l-10'>"+datalist[i].sensor_display_name+"</span></label></li>"

                    divtag +=        " </ul> </li></ul></div>"
                    $('#dataroggerSensorList').append(divtag)

                }else{
                    $('#dataroggerId_'+currentdataroggerid).append("<li><label><input class='uk-checkbox' type='checkbox' datarogger='"+datalist[i].datarogger_id+"' sensor='"+datalist[i].sensor_id+"' name='sensor'><span class='mg-l-10' id='sensorId_"+datalist[i].sensor_id+"' val='sensorId_"+datalist[i].sensor_id+"'>"+datalist[i].sensor_display_name+"</span></label></li>")

                }
            }



         }

    })

     // ??????????????? ????????? ?????? ????????? ?????? // ??????????????? (name=checkbox_dr) & (value=<datalogger_id>)
    $(".sensor_group input[name='checkbox_dr']").on('click',function () {
        // DATALOGGER ID
        console.log($(this).attr('value'));

        // datalogger_id??? ul?????? ????????? ??????
        var ul_id = 'dataroggerId_'+$(this).attr('value');

        // ul?????? ?????? ?????? ?????? ?????? ?????? / ??????
        if($(this).is(':checked')){
            console.log("HELLO CHECKED!!");
            $("#"+ul_id+" li label input:checkbox").prop('checked',true);

        } else {
            console.log("BYE UNCHECKED!!");
            $("#"+ul_id+" li label input:checkbox").prop('checked',false);
        }
    })


    // ??????????????? ?????? ????????? (name=sensor) // click ???????????? ?????? ????????? 
    $("input:checkbox").on('click',function () {
        console.log($('input:checkbox[name="sensor"]:checked').length);
        $('#selected_sensor').text($('input:checkbox[name="sensor"]:checked').length);

        console.log($(this).attr("datarogger"));
        var chk_logger_id = $(this).attr("datarogger")
        var ul_id ='';

        // ?????????????????? ?????? ?????? ?????????... ??????????????? ???????????? ????????????.
        if(!$(this).is(':checked')){
            console.log("INININININ")
            $("#checkbox_"+chk_logger_id).prop('checked',false);
        }
    })


    $("#btn_apply").on('click', function(){
        $('#btn_apply').attr('disabled',true);

        var checked_sensors = [];
        console.log("HELLO~");

        console.log($('input:checkbox[name="sensor"]:checked'))


        // checked input list
        let sensor_id_list = ""
        $('input:checkbox[name="sensor"]:checked').each(function() {

            console.log("HELLO~HELLO");
    
            console.log($(this).attr('sensor'))
            checked_sensors.push($(this).attr('sensor'));
            sensor_id_list += $(this).attr('sensor') +","
       });
       console.log(sensor_id_list)
       console.log(checked_sensors)

       let sensorgroup_id = $('#sensorgroup option:selected').val();
    
        console.log(sensorgroup_id)
       
        let sensor_max = $('#sensor_max').val()
        let sensor_min = $('#sensor_min').val()
        let sensor_weight = $('#sensor_weight').val()
        let sensor_deviation = $('#sensor_deviation').val()

        let fomula01 = $('#fomula01 option:selected').attr('function_fomula')
        let fomula02 = $('#fomula02 option:selected').attr('function_fomula')
        let fomula03 = $('#fomula03 option:selected').attr('function_fomula')
        let fomula04 = $('#fomula04 option:selected').attr('function_fomula')
        let fomula05 = $('#fomula05 option:selected').attr('function_fomula')

        let fomula01_name = $('#fomula01 option:selected').text()
        let fomula02_name = $('#fomula02 option:selected').text()
        let fomula03_name = $('#fomula03 option:selected').text()
        let fomula04_name = $('#fomula04 option:selected').text()
        let fomula05_name = $('#fomula05 option:selected').text()

        let sensor_fx_id1 = $('#fomula01 option:selected').val()
        let sensor_fx_id2 = $('#fomula02 option:selected').val()
        let sensor_fx_id3 = $('#fomula03 option:selected').val()
        let sensor_fx_id4 = $('#fomula04 option:selected').val()
        let sensor_fx_id5 = $('#fomula05 option:selected').val()
        console.log("fomula01_name", fomula01_name)

        console.log(fomula01)

        if(fomula01.length == 0){
            alert("????????? ????????? ?????????.")
            $('#btn_apply').attr('disabled',false);
            return;
        }
        
        let form_data = new FormData($('#formdata')[0])

        form_data.append("sensor_max", sensor_max)
        form_data.append("sensor_min", sensor_min)
        form_data.append("sensor_weight", sensor_weight)
        form_data.append("sensor_deviation", sensor_deviation)

        form_data.append("datarogger_id", datarogger_id)

        form_data.append("sensor_fx1", fomula01)
        form_data.append("sensor_fx2", fomula02)
        form_data.append("sensor_fx3", fomula03)
        form_data.append("sensor_fx4", fomula04)
        form_data.append("sensor_fx5", fomula05)
        
        form_data.append("sensor_fx1_name", fomula01_name)
        form_data.append("sensor_fx2_name", fomula02_name)
        form_data.append("sensor_fx3_name", fomula03_name)
        form_data.append("sensor_fx4_name", fomula04_name)
        form_data.append("sensor_fx5_name", fomula05_name)
        form_data.append("sensor_id_list", sensor_id_list)

        form_data.append("sensor_fx1_id", sensor_fx_id1)
        form_data.append("sensor_fx2_id", sensor_fx_id2)
        form_data.append("sensor_fx3_id", sensor_fx_id3)
        form_data.append("sensor_fx4_id", sensor_fx_id4)
        form_data.append("sensor_fx5_id", sensor_fx_id5)

        if(sensorgroup_id == 'select'){form_data.append("sensorgroup_id", '')}else{form_data.append("sensorgroup_id", sensorgroup_id)}


        let sensor_st_over_ex = document.getElementById('sensor_st_over_ex').checked;
        if(sensor_st_over_ex){form_data.append("sensor_st_over_ex", 'Y')}else{form_data.append("sensor_st_over_ex", 'N')}
        
        let sensor_st_over_wt = false
        if(sensor_st_over_wt){form_data.append("sensor_st_over_wt", 'Y')}else{form_data.append("sensor_st_over_wt", 'N')}
        
        let sensor_dev_over_ex = false
        if(sensor_dev_over_ex){form_data.append("sensor_dev_over_ex", 'Y')}else{form_data.append("sensor_dev_over_ex", 'N')}
        
        let sensor_dev_over_wt = false
        if(sensor_dev_over_wt){form_data.append("sensor_dev_over_wt", 'Y')}else{form_data.append("sensor_dev_over_wt", 'N')}
        
        let sensor_null_ex = document.getElementById('sensor_null_ex').checked;
        if(sensor_null_ex){form_data.append("sensor_null_ex", 'Y')}else{form_data.append("sensor_null_ex", 'N')}
        
        let sensor_default_wt = document.getElementById('sensor_default_wt').checked;
        if(sensor_default_wt){form_data.append("sensor_default_wt", 'Y')}else{form_data.append("sensor_default_wt", 'N')}
        
        let sensor_noti = $('#sensor_noti').val()
        console.log(sensor_noti)
        if(sensor_noti == 'None'){form_data.append("sensor_noti", '')}else{form_data.append("sensor_noti", sensor_noti)}

        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };



        $.ajax({
            url : "/sensordetail/select/all",
            type : "POST",
            data : form_data,
            contentType : false,
            processData : false,
            async : false,
            error:function(err){
                console.log(err)
                alert("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
                $('#btn_apply').attr('disabled',false);
            },
            success:function(data) {
                alert("?????? ???????????????.")
                console.log("succes")
                $('#btn_apply').attr('disabled',false);
                window.location.href = "ws-10-6?"+encodeURIComponent("cHJ="+ project_id)
            //    history.go(-1)
        
        }
        });

    })
}




function exceldown(){
    console.log("excel!!!!")

    let url = "/sensorlist/excel/down?datarogger_id="+datarogger_id

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
           console.log("?????? ????????? ????????????. ?????? ????????? ?????? ????????? ?????????.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
        //    console.log(data)
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