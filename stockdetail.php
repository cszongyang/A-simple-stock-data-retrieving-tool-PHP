

<div class="list"> 
 
   <div id="detail" class="row"> 

		 <div id="detailUpper" class="row">
		     
	      <div class="row">
	      	<div class="col-md-4">
	      	  <button class="btn btn-default btn-lg pull-left" data-target="#myCarousel" data-slide-to="0" href="#"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>
	      	</div>


	      	<div style="text-align:center;" class="col-md-4">
	      		<label style="vertical-align: middle;">Stock Details</label>
	      	</div>
	      	<div class="col-md-4"></div>
	      </div>
		</div>
				
				<div class="row">
				  <ul class="nav nav-pills">
				    <li class="active"><a href="#current"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>&nbsp;<span class="hiddenText">Current&nbsp;</span>Stock</a></li>
				    <li><a href="#historical"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span>&nbsp;<span class="hiddenText">Historical&nbsp;</span>Charts</a></li>
				    <li><a href="#news"><span class="glyphicon glyphicon-link" aria-hidden="true"></span>&nbsp;News<span class="hiddenText">&nbsp;Feeds</span></a></li>
				  </ul>
				</div>

	              <div id="tab" class="tab-content">

	                <div id="current" class="tab-pane fade in active">
	                        <div>  <!-- Current stock -->

			                   <div class="row">

			                      <div class="col-md-4">Stock details</div>
                                  <div class="col-md-8">
                                    <div id="stardiv">
					                      <a href="#">
					                      	<button id="STARbtn" type="button" style="margin-left:10px;" class="btn pull-right btn-default" onclick="favoriteToggle();"><span class="glyphicon"></span></button>
					                      </a>
					                  </div>
					                  <div id="fbdiv">
					                      <a href="#">
					                      	<button id="FBbtn" type="button" class="btn pull-right btn-social-icon btn-facebook" onclick="FBshare();"><span class="fa fa-facebook"></button>
					                      </a>
					                  </div>
                                    </div>
                                </div> 




                                <div class="row">

			                     <div  class="col-md-6">
                                    
                                      <div id="tableContainner"> <!-- quote table -->
			                           <table id="quoteTable" class="table table-striped table-bordered" style="font-size:85%;">
			                           </table>
                                      </div>
			                     </div>

                                 <div  class="col-md-6">
                                    <div class="row">
				                      <div id="imageContainer" class="col-md-12 nopadding"> <!-- yahoo image -->
				                      </div>
				                    </div>
			                     </div>
			                   </div>
			                </div> <!-- end of current stock -->
	                </div>

                    <div id="historical" class="tab-pane fade">
                  
		               <div id="ChartComp"> <!-- Historical Charts -->
		                 <div id="chartContainer" style="width:100%;"></div>
		               </div> 
                    </div> 

                    <div id="news" class="tab-pane fade"> 
             
		               <div> <!-- News Feeds-->
		                  <div id="newsContainer" style="width:100%; margin-top:20px;"></div>

		               </div> 
		            </div> 

                  </div> <!-- end of tab content -->


            
            
    </div> 
    
</div>
