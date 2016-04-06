<?php

//Initialize variables
$symbol == null;
$symbolDetail == null;

//helper functions


function TimeFormat($value){

     $monthArray['Jan']="1";
     $monthArray['Feb']="2";
     $monthArray['Mar']="3";
     $monthArray['Apr']="4";
     $monthArray['May']="5";
     $monthArray['Jun']="6";
     $monthArray['Jul']="7";
     $monthArray['Aug']="8";
     $monthArray['Sep']="9";
     $monthArray['Oct']="10";
     $monthArray['Nov']="11";
     $monthArray['Dec']="12";

     $pieces = explode(" ", $value);

     if(count($pieces)>5){

        date_default_timezone_set('America/Los_Angeles');

        //"Timestamp":"Wed Oct 23 13:39:19 UTC-06:00 2013"
        $time=$pieces[5]."-".sprintf("%02d", $monthArray[$pieces[1]])."-".sprintf("%02d", $pieces[2])." ".$pieces[3];
        $date=new DateTime($time);
        $datetime = $date->format("d M Y, H:i:s A");
        return $datetime;
    }
}

function MarketcapFormat($value){
    if($value>10000000){
         
        $value = number_format($value/1000000000, 2, '.', '');
        return $value.' Billion';
    }
    else{
        $value = number_format($value/1000000, 2, '.', '');
        return $value.' Million';
    }
}

function arrayFilter($arr){

   $array['Name'] = $arr['Name'];
   $array['Symbol'] = $arr['Symbol'];
   $array['Last Price'] = '$ '.$arr['LastPrice'];
   $array['Change (Change Percent)'] = $arr['Change']>0? '+':'-';
   $array['Change (Change Percent)'] = $array['Change (Change Percent)'].number_format($arr['Change'], 2, '.', '').'('. number_format($arr['ChangePercent'], 2, '.', '').'%)';
   $array['Date and Time'] = TimeFormat($arr['Timestamp']);

   $array['Market Cap'] = MarketcapFormat($arr['MarketCap']);
   $array['Volume'] = number_format($arr['Volume'] , $decimals = 0 , $dec_point = "." , $thousands_sep = "," );
   $array['Change YTD (Change Percent YTD)'] = $arr['ChangeYTD']>0? '+':'-';
   $array['Change YTD (Change Percent YTD)'] = $array['Change YTD (Change Percent YTD)'].number_format($arr['ChangeYTD'], 2, '.', '') .'('. number_format($arr['ChangePercentYTD'], 2, '.', '').'%)';
   $array['High Price'] = $arr['High'];
   $array['Low Price'] = $arr['Low'];
   $array['Opening Price'] = $arr['Open'];
   $array['Picture'] = $arr['Change']>0? './public/Green_Arrow_Up.png':'./public/Red_Arrow_Down.png';
   return $array;
}




if(isset($_GET['symbol'])){

 
    $xml=simplexml_load_file('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/xml?input='.$_GET['symbol']);
    $json = json_encode($xml);
    $array = json_decode($json,true);
    $res = array();
    
    if($array['LookupResult']['Symbol'] == null){
        foreach ($array['LookupResult'] as $item) {
           $res[] = $item;
         }
    }
    else{
         foreach ($array as $item) {
           $res[] = $item;
         }     
    }

    echo json_encode($res);

}
else if(isset($_GET['symbolDetail'])){
    $json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$_GET['symbolDetail']);
    $jarray = json_decode($json,true);

    

    $res = arrayFilter($jarray);

	if($jarray['Status'] == "SUCCESS"){
	   echo json_encode($res);
     }
    else{
       echo "There is no stock information available";
    }
}
else if(isset($_GET['parameters'])){

	echo file_get_contents('http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters='.$_GET['parameters']);

}
else if(isset($_GET['news'])){



    $accountKey = 'pOGxe/6zfMEkJgCHmq7tV8358oDMKhb/PerZiTmXeqg';

    $ServiceRootURL =  'https://api.datamarket.azure.com/Bing/Search/v1';
    
    $request = $ServiceRootURL . '/News?Query=%27'.$_GET['news'].'%27&$format=json';
    
    $context = stream_context_create(array(
        'http' => array(
            'request_fulluri' => true,
            'header'  => "Authorization: Basic " . base64_encode($accountKey . ":" . $accountKey)
        )
    ));

    $response = file_get_contents($request, 0, $context);
    
    $jsonobj = json_decode($response,true);

    
    $res= array();

    foreach($jsonobj['d']['results'] as $result){
        $res[] = array(
         "title" => $result['Title'],
         "url" => urldecode($result['Url']),
         "content" => $result['Description'],
         "publisher" => $result['Source'],
         "publishedDate" => $result['Date'],
        );
    }

    echo json_encode($res);

}
else if(isset($_GET['_symbols'])){
	//var_dump(symbols);
	$res = [];
	foreach ($_GET['_symbols'] as $item) {
		
		$json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$item);

    $jarray = json_decode($json,true);

    $res[] = arrayFilter($jarray);

	}

 //   $json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$_GET['symbolDetail']);
//var_dump(json_encode($res));
	echo json_encode($res);

}


?>