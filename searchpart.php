<div id="upper">

<div class="row">
      <div class="col-md-4"></div>
      <div class="col-md-4" style="text-align:center;">Stock Market Search</div>
      <div class="col-md-4"></div>
</div>

<div class="row">
<form id="myform" action="#">
   <div id="searchBox" class="col-md-12">
      <div style="text-align: right; padding-right:0px; padding-top:4px;" class="col-md-3">Enter the stock name or symbol:<font color="red">*</font>&nbsp</div>
      <div class="col-md-6"> 
        <input type="text" id="symbolsearch" class="form-control" placeholder="Enter company name or symbol" required>
        <span class="help-inline hide label label-info"></span>
       </div>
      <div class="col-md-3">
         
        <button type="submit" class="btn btn-xl btn-primary" onclick="getQuote(document.getElementById('symbolsearch').value);">
        <span class="glyphicon glyphicon-search"></span>&nbsp;Get Quote</button>
        <button type="button" class="btn btn-xl btn-primary" onclick="clearInput();">
        <span class="glyphicon glyphicon-refresh"></span>&nbsp;Clear&nbsp;&nbsp;&nbsp;</button>
      </div>
   </div>
</form>
</div>
<div class="row">
    <div class="col-md-12">
      <div class="col-md-3"></div>
      <div class="col-md-6"><label id="checkValidLabel"></label></div>
      <div class="col-md-3"><div class="" style="padding:0; float:left;">Powered by:&nbsp;</div><div class="" style="padding:0;"><a href="http://dev.markitondemand.com/MODApis/"><img style="width:130px; height:25px;" src="./public/mod-logo.png"></a></div></div>
    </div>
</div>
</div> <!-- end of upper row -->