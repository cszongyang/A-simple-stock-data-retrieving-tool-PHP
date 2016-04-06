
 <div class="list"> 



     <div class="row innerContainer" style="padding-left: 0px; padding-right: 0px;">
       <div id="div1" class="col-md-12">
        <div id="inter" class="col-md-12">
         <form class="form-inline">


       
             <div class="row" style="display:flex; align-items:center;">
                  <div class="col-md-4">
                    <div style="float:left;">
                        Favorite list
                    </div>     
                  </div>
                  <div class="col-md-4"></div>
                  <div class="col-md-4">
                  <div id="favoriteBtnGroup" style="float:right; display:flex; align-items:center;">


                    <div id="refreshDiv" style="">
                        automatic refresh:
                    </div>      
                    <div style="float:right; display:flex; align-items:center;">
                      <div style="float:left; margin-right:5px;" data-toggle="tooltip" data-placement="bottom" title="Turn on automatic refresh every 5 seconds">
                       <input id="autoRefresh-toggle" type="checkbox" class="toggle" >
                      </div>
                      <button type="button" class="btn btn-default btn-lg" onclick="refresh();" style="margin-right:5px;" data-toggle="tooltip" data-placement="bottom" title="refresh stock price and change amount"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>
                      <button id="rightShiftBtn" class="btn btn-default btn-lg" data-target="#myCarousel" data-slide-to="1" href="#" data-toggle="tooltip" data-placement="bottom" title="Go to stock detail section"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>
                    </div>
                  </div>
              </div>
             </div>

           </form>
           </div>
        </div>


     
          <div class="col-md-12">
           <table id="favoriteListTable" class="table table-striped" style="font-size:85%">
           </table>
         </div>

      </div> 
 
    </div> 