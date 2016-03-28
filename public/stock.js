$(function(){
    'use strict'

    if(typeof(Storage) !== "undefined") {
            //variables
            localStorage.setItem("currentStock","");
            localStorage.setItem("duration",3650);

            favoriteList = [];
    } else {
        // Sorry! No Web Storage support..
    }
    var globalState = {
         autorefreshLock : "true"
    };

    
    $('#autoRefresh-toggle').bootstrapToggle();
    $('#autoRefresh-toggle').change(function() {
        toggleState = (toggleState == true) ? false: true;
    })

    setInterval(refreshTransition, 5000);
    //console.log(globalState.autorefreshLock);
    init();
    autocompleteHandler();

});

//resize the stockchart
$( window ).resize(function() {
  console.log($("#list").width());
  chart = $("#chartContainer").highcharts();

  chart.setSize($("#chartContainer").width(), $("#chartContainer").width()*0.4);
});
      

      //variables
      var imageWidth = 0;
      var imageHeight = 0;
      var chartWidth = 0;
      var toggleState = true;
      // stock list displayed on favarite list, It should be stringified into json string first to be stored in localStorage. 
      var favoriteList;

      //init control
      function init(){
          imageWidth = $("#imageContainer").width();
          imageHeight = imageWidth*0.75;
          chartWidth = $("#chartContainer").width();
          //load the Favorite lis;
          addToFavorite();

          document.getElementById("detail").style.display = "none";
          document.getElementById("list").style.display = "block";
      }

      function displayList() {
          document.getElementById("detail").style.display = "none";
          document.getElementById("list").style.display = "block";
      }
       

      function displayDetail() {
          document.getElementById("detail").style.display = "block";
          document.getElementById("list").style.display = "none";
          document.getElementById("current").style.display = "block";
          document.getElementById("news").style.display = "none";
          document.getElementById("historical").style.display = "none";
      }

      function displayHistoy() {
          document.getElementById("detail").style.display = "block";
          document.getElementById("list").style.display = "none";
          document.getElementById("current").style.display = "none";
          document.getElementById("news").style.display = "none";
          document.getElementById("historical").style.display = "block";

      }

      function displayNews() {
          document.getElementById("detail").style.display = "block";
          document.getElementById("list").style.display = "none";
          document.getElementById("current").style.display = "none";
          document.getElementById("news").style.display = "block";
          document.getElementById("historical").style.display = "none";
      } 



    //getQuote button clicked. populate table and chart and news
    function getQuote(symbol){
        console.log(symbol);
        displayDetail();
        localStorage.setItem("symbol",symbol);
        
        stockQuote(localStorage.symbol);
        requestChartData(localStorage.symbol);
        getNews(localStorage.symbol);

    }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//****************************************************************************************************************//
//****************************************************************************************************************//
//   //realtime indication   *************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


        function autocompleteHandler(){
         $("#symbolsearch").focus().autocomplete({
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
                                return true;
                          }
                       });

    }
   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************//
//   //listpage   ************************************************************************************************//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

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

         localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 

        //pass the array to the create table function, each element of the array is a json object.
        reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 

       //  console.log(favoriteList);
     }

     function refresh(){
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
            // dataType : 'json',
            success: function(res){
                var favoriteList = JSON.parse(localStorage.favoriteList);
                for(var i = 0; i < res.length; i++){
                    for(var j = 0;j < favoriteList.length; j++){
                        
                            if(res[i].Symbol === JSON.parse(favoriteList[j]).Symbol){
                            var quotes = JSON.parse(favoriteList[j]);
                            quotes.LastPrice = res[i].LastPrice;
                            quotes.Change = res[i].Change;
                            quotes.ChangePercent = res[i].ChangePercent;
                            favoriteList[j] = JSON.stringify(quotes);
                         
                        }
                    }
                }
                 
                localStorage.setItem("favoriteList",JSON.stringify(favoriteList)); 
                reloadFavoritelist(JSON.parse(localStorage.favoriteList)); 
            },
            error: function(response,txtStatus){
                console.log("cuowu");
                console.log(response,txtStatus)
            }           
        });
     }


     //control autorefresh
     function refreshTransition() {

        if(toggleState == true) {
            refresh();

        }else{
            console.log("Autorefresh off");
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
             tHTML += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
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
                console.log(data.Name);

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
          document.getElementById('imageContainer').innerHTML = "";

         var imageHTML = "<img src='http://chart.finance.yahoo.com/t?s="+symbol+"&lang=en-US&width="+imageWidth+"&height="+imageHeight+"' />"

        $('#imageContainer').append(imageHTML); 
    }



    function addToFavorite(){
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
        var tHTML = "<tr><th>Symbol</th><th>Company name</th><th>Stock price</th><th>Change(Change Percent)</th><th>Market Cap</th><th></th><tr>";
        
        for(var i = 0; i < data.length; i++){

            tHTML += '<tr><td><a id="'+JSON.parse(data[i]).Symbol+'" onclick="getQuote(this.id);" href="javascript:void(0);"><font color="#78ACC7">' + JSON.parse(data[i]).Symbol + '</font></a></td><td>' + JSON.parse(data[i]).Name + '</td><td>' + JSON.parse(data[i]).LastPrice + '</td><td>' + JSON.parse(data[i]).ChangePercent + '</td><td>' + JSON.parse(data[i]).MarketCap + '</td><td><button value="'+ JSON.parse(data[i]).Symbol +'" onclick="deleteFavoriteItem(this.value)" class="btn btn-default"><span class="glyphicon glyphicon-trash" ></span></button></td></tr>';

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
            //,LabelPeriod: 'Week',
            //LabelInterval: 1
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
                width: chartWidth,
                margin:0
            },
            
            rangeSelector: {
                selected: 1
                
            },

            title: {
                text: localStorage.symbol + ' Historical Price'
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
              dataType: 'json',
              data :{
                news: symbol
              },
              success: function(res){
                console.log(res);
                var data = JSON.parse(res);
                var newsBlocks = "";
                $.each(data,function(key,value){
                     newsBlocks += '<div class="newsBlock"><p><a href="'+ value.url +'">' + value.title + '</a></p><p>' + value.content + '</p><p><b>publisher: ' + value.publisher + '</b></p><p><b>Date: ' + value.publishedDate + '</b></p></div>';
                });
                $('#newsContainer').append(newsBlocks); 

              },
               error: function(response,txtStatus){
                console.log(response,txtStatus)
              }
          });

    }
















