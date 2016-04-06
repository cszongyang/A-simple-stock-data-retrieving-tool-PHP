$(function(){
    'use strict'

    if(typeof(Storage) !== "undefined") {
            //variables
            localStorage.setItem("currentStock","");
            localStorage.setItem("duration",3650);

            favoriteList = [];
    } 
    var globalState = {
         autorefreshLock : "true"
    };

    $('#myform').submit(false);
    $('[data-toggle="tooltip"]').tooltip();  
    $('#autoRefresh-toggle').bootstrapToggle();
    $('#autoRefresh-toggle').change(function() {
        toggleState = (toggleState == true) ? false: true;
    })

    setInterval(refreshTransition, 5000);
    //console.log(globalState.autorefreshLock);
    //addToFavorite();
    addToFavorite();

    autocompleteHandler();

    // $(".nav-tabs a").click(function(){
    //     $(this).tab('show');
    //    console.log("zheli");
    // });

    $(".nav-pills a").click(function(){
        $(this).tab('show');
    });

    $('#rightShiftBtn').prop('disabled', true);
});

//resize the stockchart
$( window ).resize(function() {

  // chart = $("#chartContainer").highcharts();
  // chart.setSize($("#ChartComp").width());

  // if (screen.width <= 700) {
  //     console.log(screen.width);
  // }
});
      

      //variables
      var imageWidth = 0;
      var imageHeight = 0;
      var chartWidth = 0;
      var toggleState = false;
      // stock list displayed on favarite list, It should be stringified into json string first to be stored in localStorage. 
      var favoriteList;


    //getQuote button clicked. populate table and chart and news
    function getQuote(symbol){

        if(symbol == ''){
            return;
        }

        $("#myCarousel").carousel(1);

        imageWidth = $('#imageContainer').width();
      
        localStorage.setItem("symbol",symbol);
        
        stockQuote(localStorage.symbol);

        requestChartData(localStorage.symbol);

        getNews(localStorage.symbol);

        setStarBtnStyle(symbol);
        //set style of favorite button
       // favoriteToggle();

        $('#rightShiftBtn').prop('disabled', false);

    }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//****************************************************************************************************************//
//****************************************************************************************************************//
//   //realtime indication   *************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


        function autocompleteHandler(){
         $("#symbolsearch").focus().autocomplete({
                          open: function(e) {
                             valid = false;
                           },
                          source: function(request, response){
                                var sym = document.getElementById('symbolsearch').value;
                                $.ajax({
                                    url: './stockProcess.php?',
                                    dataType: 'json',

                                    data: {
                                        symbol: sym
                                    },
                                    success: function(res){
                                 
                                        response( $.map(res, function(item) {

                                            return {
                                                label: item.Symbol + "-" +item.Name + " (" +item.Exchange+ ")",
                                                value: item.Symbol
                                            }
                                        }));
                                    },
                                });                            

                          },//source
                          select: function( event, ui ) { 
                             valid = true;
                             //return true;
                          },
                          close: function(e){
                               if (!valid){
                                   console.log("invalid");
                                   document.getElementById('checkValidLabel').innerHTML = "<font color='red'>Select a valid entry</font>";
                               } else{
                                   document.getElementById('checkValidLabel').innerHTML = "";
                               }
                               
                           },
                       });

    }
   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //listpage   ************************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

     function loadFavoritelist(){
        favoriteList = JSON.parse(localStorage.favoriteList);
        var symbols = [];
    
        for(var i = 0; i < favoriteList.length; i++){
            if(JSON.parse(favoriteList[i]) != null){
                symbols.push(JSON.parse(favoriteList[i]).Symbol);
            }
        }
   
        $.ajax({
            url : './stockProcess.php?',
            data : { _symbols : symbols }, 
             //dataType : 'json',
            success: function(res){

                var data = JSON.parse(res);

                 console.log(data[0]);
                
          
                var favoriteList = JSON.parse(localStorage.favoriteList);
                console.log(data[0].Name);
                for(var i = 0; i < data.length; i++){
                    for(var j = 0;j < favoriteList.length; j++){

                        
                        if(data[i].Symbol === JSON.parse(favoriteList[j]).Symbol){

                            var imgSrc =  (data[i]['Change (Change Percent)'].substring(0,1) == "+")?'./public/up.png':'./public/down.png';
                            document.getElementById("favoriteListTable").rows[i+2].cells[2].innerHTML = data[i]['Last Price'];
                            document.getElementById("favoriteListTable").rows[i+2].cells[3].innerHTML = data[i]['Change (Change Percent)'].substring(1) + '&nbsp;<img width="30px" height="30px" src="'+ imgSrc +'"/>';
                            // console.log(data[i].Symbol);
                            var quotes = JSON.parse(favoriteList[j]);
                            quotes.LastPrice = data[i].LastPrice;
                            quotes.Change = data[i].Change;
                            quotes.ChangePercent = data[i].ChangePercent;
                            favoriteList[j] = JSON.stringify(quotes);
                         
                        }
                    }
                }
                 
                localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 
              //  reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 
            },
            error: function(response,txtStatus){
              console.log("wrong");
                console.log(response,txtStatus)
            }           
        });
     }

     function deleteFavoriteItem(value){
         var favoriteList = JSON.parse(localStorage.favoriteList);
         console.log(favoriteList);
         for (var i = 0 ; i < favoriteList.length ;i++) {
             if (JSON.parse(favoriteList[i]) != null) {
                if(JSON.parse(favoriteList[i]).Symbol === value){
                   //delete favoriteList[i];
                   favoriteList.splice(i,1);
               }
             }
         }
         $("#stardiv span").removeClass("glyphicon-star yellow-star");
         $("#stardiv span").toggleClass("glyphicon-star white-star",true);

         localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 

        //pass the array to the create table function, each element of the array is a json object.
        reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 
     }



     function refresh(){

        console.log("sssssssssss");
        if(localStorage.favoriteList.length == 2){
            return;
        }
        favoriteList = JSON.parse(localStorage.favoriteList);
        var symbols = [];
    
        for(var i = 0; i < favoriteList.length; i++){
            if(JSON.parse(favoriteList[i]) != null){
                symbols.push(JSON.parse(favoriteList[i]).Symbol);
            }
        }
   
        $.ajax({
            url : './stockProcess.php?',
            data : { _symbols : symbols }, 
             //dataType : 'json',
            success: function(res){
              console.log("success");
               console.log(res);

                if (res == null) {return;}

                var data = JSON.parse(res);
                
          
                var favoriteList = JSON.parse(localStorage.favoriteList);
                console.log(data[0].Name);
                for(var i = 0; i < data.length; i++){
                    for(var j = 0;j < favoriteList.length; j++){

                        
                        if(data[i].Symbol === JSON.parse(favoriteList[j]).Symbol){

                            var imgSrc =  (data[i]['Change (Change Percent)'].substring(0,1) == "+")?'./public/up.png':'./public/down.png';
                            document.getElementById("favoriteListTable").rows[i+2].cells[2].innerHTML = data[i]['Last Price'];
                            document.getElementById("favoriteListTable").rows[i+2].cells[3].innerHTML = data[i]['Change (Change Percent)'].substring(1) + '&nbsp;<img width="30px" height="30px" src="'+ imgSrc +'"/>';
                            // console.log(data[i].Symbol);
                            var quotes = JSON.parse(favoriteList[j]);

                            console.log(quotes);
                            quotes['Last Price'] = data[i]['Last Price'];
                            quotes['Change (Change Percent)'] = data[i]['Change (Change Percent)'];
                        
                            favoriteList[j] = JSON.stringify(quotes);
                         
                        }
                    }
                }
                 
                localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 
                reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 
            },
            error: function(response,txtStatus){
                console.log(response,txtStatus)
            }           
        });
     }


     //control autorefresh
     function refreshTransition() {
        if(toggleState == true) {
            refresh();
        }
     }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //Current   *************************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    //table
    function createTable(data){


        document.getElementById('quoteTable').innerHTML = "";
     
        var tHTML = '';
        $.each(data,function(key,value){
             if(key == 'Change (Change Percent)' || key == 'Change YTD (Change Percent YTD)'){
                
                if(value.substring(0,1) == "+"){
                    tHTML += '<tr><td style="font-weight:bold">' + key + '</td><td><font color="green">' + value.substring(1) + '</font><img width="25px" height="25px" src="./public/up.png"/></td></tr>';
                }
                else{
                    tHTML += '<tr><td style="font-weight:bold">' + key + '</td><td><font color="red">' + value.substring(1) + '</font><img width="25px" height="25px" src="./public/down.png"/></td></tr>';
                }
             }
             else if(key != 'Picture'){
                 tHTML += '<tr><td style="font-weight:bold">' + key + '</td><td>' + value + '</td></tr>';
             }
        });
        $('#quoteTable').append(tHTML);       
    }


    function stockQuote(symbol){
          $.ajax({
              url: './stockProcess.php?',
              data :{
                symbolDetail: localStorage.symbol
              },
              success: function(res){
 
                localStorage.setItem("currentStock",res);

                var data = JSON.parse(res);

                createTable(data);
                createImage(symbol);

              },
               error: function(response,txtStatus){
                console.log(response,txtStatus)
              }
          });
    }

    //image from yahoo
    function createImage(symbol){

        imageWidth = $("#imageContainer").width();
        imageHeight = imageWidth*0.75;
        document.getElementById('imageContainer').innerHTML = "";
        var imageHTML = "<img src='http://chart.finance.yahoo.com/t?s="+symbol+"&lang=en-US&width="+imageWidth+"&height="+imageHeight+"' />"

        $('#imageContainer').append(imageHTML); 
    }



    function addToFavorite(){

        //$("#stardiv button").css("color", "yellow");
        
        //add
        if(localStorage.favoriteList == undefined){
            favoriteList = [];
        }
        else{
            favoriteList = JSON.parse(localStorage.favoriteList);
        }
        //for initialization
        if(localStorage.currentStock !== ""){
            favoriteList.push(localStorage.currentStock);
        }
        
        localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 



        //pass the array to the create table function, each element of the array is a json object.
        reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 

    }

    
    function reloadFavoritelist(data){

        document.getElementById('favoriteListTable').innerHTML = "";
        var tHTML = "<tr><th>Symbol</th><th>Company name</th><th>Stock price</th><th class='col_1'>Change(Change Percent)</th><th class='col_1'>Market Cap</th><th class='col_1'></th><tr>";
        
        for(var i = 0; i < data.length; i++){

          if(JSON.parse(data[i])['Change (Change Percent)'].substring(0,1) == "+"){
            imgSrc = './public/up.png';
            tHTML += '<tr><td><a id="'+JSON.parse(data[i]).Symbol+'" onclick="getQuote(this.id);" href="javascript:void(0);"><font color="#78ACC7">' + JSON.parse(data[i]).Symbol + '</font></a></td><td>' + JSON.parse(data[i]).Name + '</td><td>' + JSON.parse(data[i])['Last Price'] + '</td><td class="col_1"><font color="green">' + JSON.parse(data[i])['Change (Change Percent)'].substring(1) + '&nbsp;</font><img width="30px" height="30px" src="'+ imgSrc +'"/></td><td class="col_1">' + JSON.parse(data[i])['Market Cap'] + '</td><td class="col_1"><button value="'+ JSON.parse(data[i]).Symbol +'" onclick="deleteFavoriteItem(this.value)" class="btn btn-default"><span class="glyphicon glyphicon-trash" ></span></button></td></tr>';

          }
          else{
            imgSrc = './public/down.png';
            tHTML += '<tr><td><a id="'+JSON.parse(data[i]).Symbol+'" onclick="getQuote(this.id);" href="javascript:void(0);"><font color="#78ACC7">' + JSON.parse(data[i]).Symbol + '</font></a></td><td>' + JSON.parse(data[i]).Name + '</td><td>' + JSON.parse(data[i])['Last Price'] + '</td><td class="col_1"><font color="red">' + JSON.parse(data[i])['Change (Change Percent)'].substring(1) + '&nbsp;</font><img width="30px" height="30px" src="'+ imgSrc +'"/></td><td class="col_1">' + JSON.parse(data[i])['Market Cap'] + '</td><td class="col_1"><button value="'+ JSON.parse(data[i]).Symbol +'" onclick="deleteFavoriteItem(this.value)" class="btn btn-default"><span class="glyphicon glyphicon-trash" ></span></button></td></tr>';

          }
        
        }

        $('#favoriteListTable').append(tHTML); 

    }




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//****************************************************************************************************************//
//****************************************************************************************************************//
//   //Chart API *************************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    function requestChartData(sym){


        var params = {
           parameters: JSON.stringify( getInputParams() )
        }

        $.ajax({
            beforeSend:function(){
             //   $("#chartDemoContainer").text("Loading chart...");
            },
            data: params,
            url: "./stockProcess.php",
            dataType: "json",
            context: this,
            success: function(json){
                //Catch errors
                if (!json || json.Message){
                    console.error("Error: ", json.Message);
                    return;
                }
                renderChart(json);
            },
            error: function(response,txtStatus){
                console.log(response,txtStatus)
            }
        });

    }


        //
    var getInputParams = function(){
        return {  
            Normalized: false,
            NumberOfDays: localStorage.duration,
            DataPeriod: "Day",
            Elements: [
                {
                    Symbol: localStorage.symbol,
                    Type: "price",
                    Params: ["ohlc"] //ohlc, c = close only
                }
            ]
 
        }
    };

    //
    var fixDate = function(dateIn) {
        var dat = new Date(dateIn);
        return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
    };


    //
    var getOHLC = function(json) {
        var dates = json.Dates || [];
        var elements = json.Elements || [];
        var chartSeries = [];

        if (elements[0]){

            for (var i = 0, datLen = dates.length; i < datLen; i++) {
                var dat = fixDate( dates[i] );
                var pointData = [
                    dat,
                    elements[0].DataSeries['open'].values[i],
                    elements[0].DataSeries['high'].values[i],
                    elements[0].DataSeries['low'].values[i],
                    elements[0].DataSeries['close'].values[i]
                ];
                chartSeries.push( pointData );
            };
        }
        return chartSeries;
    };


    //
    var getVolume = function(json) {
        var dates = json.Dates || [];
        var elements = json.Elements || [];
        var chartSeries = [];

        if (elements[1]){

            for (var i = 0, datLen = dates.length; i < datLen; i++) {
                var dat = fixDate( dates[i] );
                var pointData = [
                    dat,
                    elements[1].DataSeries['volume'].values[i]
                ];
                chartSeries.push( pointData );
            };
        }
        return chartSeries;
    };




    function renderChart(data) {
        var chartwidth = $("#tab").width();
       
        // split the data set into ohlc and volume
        var ohlc = getOHLC(data),
            volume = getVolume(data);



        // set the allowed units for data grouping
        var groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]];

        // create the chart
        $('#chartContainer').highcharts('StockChart', {

            chart:{
                type: 'area',
                width: chartwidth,
                margin:0
            },
            
            rangeSelector: {
                selected: 1,
                inputEnabled : false
            },

            title: {
                text: localStorage.symbol + ' Stock Value'
            },

            yAxis: [{
                title: {
                    text: 'OHLC'
                },
                height: 200,
                lineWidth: 2
            }, {
                title: {
                    text: 'Volume'
                },
                top: 300,
                height: 100,
                offset: 0,
                lineWidth: 2
            }],
                series: [{
                    name: 'Stock price',
                    data: ohlc,
                    fillColor : {
                            linearGradient : {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops : [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                      } //end of fillColor

                }],
         
            credits: {
                enabled:false
            }
        });
    };



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //news      *************************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


    function getNews(symbol){


        document.getElementById('newsContainer').innerHTML = "";
        $.ajax({
              url: './stockProcess.php?',
              // dataType: 'json',
              data :{
                news: symbol
              },
              success: function(res){

                var data = JSON.parse(res);
                var newsBlocks = "";

                console.log(newsBlocks);
                $.each(data,function(key,value){
                     
                     newsBlocks += '<div class="newsBlock"><p><a href="'+ value.url +'">' + value.title + '</a></p><p>' + value.content + '</p><p><b>publisher: ' + value.publisher + '</b></p><p><b>Date: ' + value.publishedDate + '</b></p></div>';
                    
                });
                $('#newsContainer').append(newsBlocks); 

              },
               error: function(response,txtStatus){
                console.log("news error");
                console.log(response,txtStatus)
              }
          });

    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //Facebook sharing      *************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


function FBshare(){
  console.log("Facebook sharing");

    FB.login(function(response){
          
          FB.ui({
            method: 'feed',
            link: 'http://dev.markitondemand.com/',
            picture: 'http://chart.finance.yahoo.com/t?s='+JSON.parse(localStorage.currentStock).Symbol+'&lang=en-US&width="600"&height="400"',
             caption: 'LAST TRADE PRICE: '+JSON.parse(localStorage.currentStock)['Last Price']+' , CHANGE:'+JSON.parse(localStorage.currentStock)['Change (Change Percent)'].substring(0,1)+'',
             name: 'Current Stock Price of '+ JSON.parse(localStorage.currentStock).Name +' is '+JSON.parse(localStorage.currentStock)['Last Price']+'', 
             description: 'Stock information of '+ JSON.parse(localStorage.currentStock).Name +' .' 

          }, function(response){
                console.log(response.error_code);
                if(response.error_code){
                    window.alert('Not Posted');
                }else{
                    window.alert('Posted Successfully');
                }
          });

    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //clear input field      ************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


function clearInput(){
       document.getElementById('checkValidLabel').innerHTML = "";
       $("#symbolsearch").val('');
       $('#rightShiftBtn').prop('disabled', true);
       $("#myCarousel").carousel(0);
   }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //favorite toggle     ***************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

//check if current stock is present in favorite list
function checkIfPresent(value){

    var index = -1;

    var favoriteList = JSON.parse(localStorage.favoriteList);
         console.log(favoriteList);
         for (var i = 0 ; i < favoriteList.length ;i++) {
             if (JSON.parse(favoriteList[i]) != null) {
                if(JSON.parse(favoriteList[i]).Symbol === value){
                   //delete favoriteList[i];
                   favoriteList.splice(i,1);
                   index = i;
               }
             }
         }

         return index;

         localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 

        //pass the array to the create table function, each element of the array is a json object.
        reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 
}

function setStarBtnStyle(sym){
    var index = -1;
    
    
    var favoriteList = JSON.parse(localStorage.favoriteList);
         
    for (var i = 0 ; i < favoriteList.length ;i++) {
         if (JSON.parse(favoriteList[i]) != null) {
            if(JSON.parse(favoriteList[i]).Symbol === sym){
               //delete favoriteList[i];
               favoriteList.splice(i,1);
               index++;
           }
         }
     }
    if(index !== -1){
        $("#stardiv span").removeClass("glyphicon-star white-star");
        $("#stardiv span").toggleClass("glyphicon-star yellow-star",true);
    }else{
        $("#stardiv span").removeClass("glyphicon-star yellow-star");
        $("#stardiv span").toggleClass("glyphicon-star white-star",true);
    }
}

//click favorite buttion
function favoriteToggle(){

    var sym = JSON.parse(localStorage.currentStock).Symbol;
    var index = -1;

    var favoriteList = JSON.parse(localStorage.favoriteList);
         
        for (var i = 0 ; i < favoriteList.length ;i++) {
             if (JSON.parse(favoriteList[i]) != null) {
                if(JSON.parse(favoriteList[i]).Symbol === sym){
                   //delete favoriteList[i];
                   favoriteList.splice(i,1);
                   index++;
               }
             }
         }
         
        if(index !== -1){
            $("#stardiv span").removeClass("glyphicon-star yellow-star");
            $("#stardiv span").toggleClass("glyphicon-star white-star",true);
            deleteFavoriteItem(sym);
        }else{
            $("#stardiv span").removeClass("glyphicon-star white-star");
            $("#stardiv span").toggleClass("glyphicon-star yellow-star",true);
            addToFavorite();
        }

        // localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 

        // //pass the array to the create table function, each element of the array is a json object.
        // reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 


}


