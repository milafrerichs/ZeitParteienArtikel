<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript" src="js/zon_api.js"></script>
	
	<script type="text/javascript" src="js/highchart/highcharts.js"></script>
	<script type="text/javascript" src="js/script.js"></script>  
	<title>Artikel der ZEIT pro Partei</title>
</head>   
  <body>
	  <a href="https://twitter.com/share" class="twitter-share-button" data-lang="de" data-hashtags="zeitapi">Twittern</a>
	  <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
	  <a href="https://twitter.com/mila_frerichs" class="twitter-follow-button" data-show-count="false" data-lang="de">@mila_frerichs folgen</a><br/><br/>
	  <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
	  <iframe src="http://ghbtns.com/github-btn.html?user=milafrerichs&repo=ZeitParteienArtikel&type=watch&count=true"
	    allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe><br/><br/>
	  <?php
	  date_default_timezone_set('Europe/Berlin');
	  
	  $month_array =  array("01"=>"Januar","02"=>"Februar","03"=>"März","04"=>"April","05"=>"Mai","06"=>"Juni","07"=>"Juli","08"=>"August","09"=>"September","10"=>"Oktober","11"=>"November","12"=>"Dezember");
	  
	  if (isset($_POST['month'])) {
		$month_selected = $_POST['month'];
	  }else {
		  $month_selected = date('m');
	  }
	  if (isset($_POST['year'])) {
		$year_selected = $_POST['year'];
	  }else {
		  $year_selected = date('Y');
	  }	
	  ?>
	  <br/><br/>
	  
	  <form action="" method="post">
		<select id="month" name="month">
			<?php foreach($month_array as $month=>$month_string){ ?>
				<option value="<?php echo $month;?>"<?php echo ($month_selected == $month)?' selected="selected"':'';?>><?php echo $month_string;?></option>
			<?php } ?>
		</select>
	  	<select id="year" name="year">
			<?php for($year=(int)date("Y");$year>1945;$year--) {?>
			<option value="<?php echo $year;?>" <?php echo ($year_selected == $year)?' selected="selected"':'';?>><?php echo $year;?></option>
		<?php }?>
		</select>
		<input type="submit" value="Ändern" />
		</form>
	  <div id="container"></div>
	  
	  
	  <div id="articles">
		  <h1>Artikel:</h1>
			<ul>
			</ul>
	  </div>
	  
	  <script type="text/javascript">

	    var _gaq = _gaq || [];
	    _gaq.push(['_setAccount', 'UA-36571229-1']);
	    _gaq.push(['_trackPageview']);

	    (function() {
	      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	    })();

	  </script>
	  
	  
	  
	  <footer>
		  <p>Aktuell verwende ich das content Modul der API, nicht das keywords Modul, da dies noch nicht so funktioniert, wie es meiner Meinung nach besser wäre. Aber das ZEIT Team arbeitet dran. Deswegen kann es sein, dass die Artikel nicht immer stimmen. Aber die Partei wird in irgendeiner Art immer erwähnt und sei es als Herr/Frau ... (SPD/CDU/etc.) </p>
		  <p>Entwickelt von <a href="http://milafrerichs.de">Mila Frerichs</a> mit Hilfe der <a href="htpp://developer.zeit.de">ZEIT</a> API.</p>
	  </footer>
  </body>
  </html>
