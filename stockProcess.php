<?php

//Initialize variables
$symbol == null;
$symbolDetail == null;

//helper functions


if(isset($_GET['symbol'])){

 
    $xml=simplexml_load_file('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/xml?input='.$_GET['symbol']);
    $json = json_encode($xml);
    $array = json_decode($json,TRUE);
    $res = array();

     foreach ($array['LookupResult'] as $item) {
     	 $res[] = $item;
     }
    
    echo json_encode($res);

}
else if(isset($_GET['symbolDetail'])){
    $json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$_GET['symbolDetail']);
    $jarray = json_decode($json,true);

    //var_dump(json_encode($json));

     
	if($jarray['Status'] == "SUCCESS"){
	   echo $json;
     }
    else{
       echo "There is no stock information available";
    }
}
else if(isset($_GET['parameters'])){

	//var_dump(params);

	echo file_get_contents('http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters='.$_GET['parameters']);

    //echo json_encode($_GET['parameters']);

    //echo file_get_contents('http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"StartDate":"2013-07-15T00:00:00-00","EndOffsetDays":100,"NumberOfDays":100,"DataPeriod":"Day","DataInterval":0,"LabelPeriod":"Day","LabelInterval":1,"ExtraPoints":0,"Elements":[{"Symbol":"AAPL","ElementType":"price","Params":["ohlc"]}],"RealTime":false}');

}
else if(isset($_GET['news'])){


	
//	$ip = '145.45.45.76';
    $json = file_get_contents('https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q='.$_GET['news'].'&userip='.$_SERVER['SERVER_ADDR']);
     //$json = file_get_contents('https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q='.$_GET['news']);
    
    $jarray = json_decode($json,true);
    $res= array();

    foreach($jarray['responseData']['results'] as $result){
        $res[] = array(
        	"title" => $result['title'],
        	"url" => urldecode($result['url']),
        	"content" => $result['content'],
        	"publisher" => $result['publisher'],
        	"publishedDate" => $result['publishedDate'],
        );
    }

    echo json_encode($res);
}
else if(isset($_GET['_symbols'])){
	//var_dump(symbols);
	$res = [];
	foreach ($_GET['_symbols'] as $item) {
		
		$json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$item);
		sleep(0.5);
		$res[] = json_decode($json);

	}

 //   $json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$_GET['symbolDetail']);
//var_dump(json_encode($res));
	echo json_encode($res);

}


?>