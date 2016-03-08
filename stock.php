<html>
 <head>
 <title>PHP stock</title>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 <style type="text/css">

table{
	border-collapse: collapse;
	width: 100%;
	table-layout: fixed;
	border-color: rgb(215,215,215);
}

.bottom{
	padding-top: 20px;
	text-align: center;
    margin: auto;
}
.top{
    margin: auto;
    text-align: center;
}
.color{
	background-color: rgb(243,243,243);
}
 </style>
 <script type="text/javascript">
     function clearAll(){
        
     	var bottom=document.getElementsByClassName('bottom');
     	if(bottom.length!=0){
     		bottom[0].parentNode.removeChild(bottom[0]);
     	}
     	
     	var textarea=document.getElementsByName('symbol');
     	if(textarea.length!=0){
     		textarea[0].value="";
     	}
        
     }

 </script>
 </head>
 <body>
 <div>

 <table class="top">
 <tr>
 <td>
 </td>
<td> 
    <div class="color">
    <table border="1">
	 <h1>stock search</h1>
	 <form action="stock.php">
	    Company Name or Symbol: 
	    <?php if(isset($_GET['symbol'])) : ?>
	         <input type="text" name="symbol" value="<?php echo $_GET['symbol'] ?>" required>
	    <?php elseif(isset($_GET['symbolDetail'])) : ?>
	         <input type="text" name="symbol" value="<?php echo $_GET['input'] ?>" required>
	    <?php else : ?>
	 	     <input type="text" name="symbol" required>
	 	 <?php endif; ?>
	    <br>
	 	<input type="submit" value="search">
	 	<input type="button" value="clear" onclick="clearAll();">
	 </form>
	 <br>
	 <a href="http://www.markit.com/product/markit-on-demand">Powered by Markit on Demand</a>
    </table>
    </div>
  </td>
 <td>
 </td>    
</tr> 
 </div>


<table style="margin-top: 20px;" class="bottom">
 <tr>
 <td>
 </td>
<td>
 <?php if(isset($_GET['symbol'])) : ?>

 	 <?php  
	     $name=$_GET['symbol'];

	     $xml=simplexml_load_file('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/xml?input='.$name);
     ?>  
     
     <div class="color">
     <table border="1">


       
         <?php
           

           if($xml->count()==0){
                echo "No Record has been found";
           }
           else{
           	    echo "<tr style='font-weight:bold'><td>Name</td><td>Symbol</td><td>Exchange</td><td>Details</td></tr>";
           	   	foreach ($xml->LookupResult as $item) {
			     	echo "<tr>";
			     	echo "<td>".$item->Name."</td>"."<td>".$item->Symbol."</td>"."<td>".$item->Exchange."</td>"."<td><a href=stock.php?input=".$name."&symbolDetail=".$item->Symbol.">moreinfo</a></td>";
			     	echo "</tr>";
	            }	
           }
	     
	      ?>
	    
     </table>
     </div>
     



<?php elseif(isset($_GET['symbolDetail'])) : ?>

	 <?php  
	     $json = file_get_contents('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$_GET['symbolDetail']);
         $jarray = json_decode($json,true);

     ?> 
     
      <div class="color">
       <table style="text-align:center;" border="1">
       
         <?php

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

         $lastprice=$jarray['LastPrice'];

	     foreach ($jarray as $name => $value) {
	     	
	     	echo "<tr>";

	     	if($name=="Status"||$name=="MSDate"){
                continue;
	     	}

	     	else if($name=="Change"||$name=="ChangePercent"||$name=="ChangeYTD"||$name=="ChangePercentYTD"){
	     		$value = number_format($value, 2, '.', '');
	     		if($name=="ChangePercentYTD"||$name=="ChangePercent"){
	     			$value=$value."%";
	     		}

	     		if($name=="ChangeYTD"){
	     				$value=$lastprice-$value;
	     			}
	     		
	     		if($value>=0){
	     			
	     			echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$value."<img width='12px' height='12px' src='Green_Arrow_Up.png'/></td>";
	     		}
	     		else{
	     			if($name=="ChangeYTD"){
	     				$value="(".$value.")";
	     			}

	     			echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$value."<img width='12px' height='12px' src='Red_Arrow_Down.png'/></td>";
	     		}
	     		
	     	}
	     	else if($name=="Timestamp"){

                $pieces = explode(" ", $value);

                if(count($pieces)>5){

	                date_default_timezone_set('America/Los_Angeles');

	                //"Timestamp":"Wed Oct 23 13:39:19 UTC-06:00 2013"
	                $time=$pieces[5]."-".sprintf("%02d", $monthArray[$pieces[1]])."-".sprintf("%02d", $pieces[2])." ".$pieces[3];
	                $date=new DateTime($time);

	                //expected: 2016-02-09 09:11 AM
	                $datetime = $date->format("Y-m-d H:i A");

	                echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$datetime."</td>";

                }

	     	}
	     	else if($name=="MarketCap"){
	     		if($value>10000000){
	     
	     			$value = number_format($value/1000000000, 2, '.', '');
                    echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$value." B</td>";
	     		}
	     		else{
	     			$value = number_format($value/1000000, 2, '.', '');
	     			echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$value." M</td>";
	     		}
	     	
	     	}
	     	else if($name=="Volume"){
	     		$v=number_format($value , $decimals = 0 , $dec_point = "." , $thousands_sep = "," );

	     		echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$v."</td>";
	     	}
	     	else{
	     		echo "<td style='font-weight:bold' align='left'>".$name."</td>"."<td>".$value."</td>";
	     	}

	     	echo "</tr>";
	     }	
	     
	      ?>
	    
     </table>
     </div>


 <?php else : ?>
 <?php endif; ?>
 
 </td>
 <td>
 </td>    
</tr> 
</table>

 </body>
 </html>