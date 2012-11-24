var series = {};
var articles_per_party = {"spd":false,"cdu":false,"fdp":false,"b90":false,"linke":false,"piraten":false};	

function saveCounts(party,articles_count_obj,pos) {
   for( var dateObj in articles_count_obj) {
	   if(dateObj in series) {
			series[dateObj][pos] = articles_count_obj[dateObj].count;
   		}else {
			series[dateObj] = [0,0,0,0,0,0];
			series[dateObj][pos] = articles_count_obj[dateObj].count;
   		}
   }
   articles_per_party[party.toLowerCase()] = true;
	if(articles_per_party["spd"] && articles_per_party["cdu"] && articles_per_party["fdp"] && articles_per_party["b90"] && articles_per_party["linke"] && articles_per_party["piraten"]) {
		plotData();
	}
}

function getArticlesFromZeitForParty(party) {
    var pos = -1;
    switch(party) {
		case 'SPD': pos = 0;party_suchstring = party;
 	   		break;
		case 'CDU': pos = 1;party_suchstring = party;
 	   		break;
		case 'FDP': pos = 2;party_suchstring = party;
 	   		break;
		case 'B90': pos = 3;party_suchstring = 'Die Grünen';
 	   		break;
		case 'LINKE': pos = 4;party_suchstring = 'Die Linke';
			break;
		case 'PIRATEN': pos = 5;party_suchstring = 'Die Piraten';
			break;
		
    }
   	var api = $("body").zon_api({
	  query:party_suchstring,
	  api_key:"#####",
	  endpoint:"content",
	  params:{fields:"release_date"},
	  limit: 100
	});
      	
	api.retrieve(0,function (data){
	   var counts = new Array();
	   for(i=0;i<100;i++) {
		   date = new Date(data.get_result().matches[i].release_date);
		   var normalized_date = date.getFullYear()+"-"+(('0' + (date.getMonth()+1)).slice(-2))+"-"+(('0'+ date.getDate()).slice(-2));
		   var date_key = Date.parse(normalized_date);
		   if(date_key in counts) {
			counts[date_key].count += 1;
		   }else {
		   	counts[date_key] = {count : 1};
		   }
	   }
	   
	   
	   
	   saveCounts(party,counts,pos);
	   
	   
	 });
}

function plotData() {
	spd_dates = new Array();
	cdu_dates = new Array();
	fdp_dates = new Array();
	b90_dates = new Array();
	linke_dates = new Array();
	piraten_dates = new Array();
	categories = new Array();
	var currentTime = new Date()
	for(var dataObj in series) {
		var date = new Date(parseInt(dataObj));
		if(date.getMonth() == currentTime.getMonth()) {
			categories.push(date.getDate()+"."+(date.getMonth()+1));
			spd_dates.push(series[dataObj][0]);
			cdu_dates.push(series[dataObj][1]);
			fdp_dates.push(series[dataObj][2]);
			b90_dates.push(series[dataObj][3]);
			linke_dates.push(series[dataObj][4]);
			piraten_dates.push(series[dataObj][5]);
		}
	}
	dataSeries = [{name:'SPD',data:spd_dates},{name:'CDU',data:cdu_dates},{name:'FDP',data:fdp_dates},{name:'B90/Die Grünen',data:b90_dates},{name:'Die Linke',data:linke_dates},{name:'Die Piraten',data:piraten_dates}];
	chart = new Highcharts.Chart({
	    chart: {
	        renderTo: 'container',
	        type: 'column'
	    },
	    title: {
	        text: 'Artikel in der ZEIT pro Partei und Tag der letzten 100 Artikel des aktuellen Monats'
	    },
	    subtitle: {
	        text: 'Source: ZEIT API'
	    },
	    xAxis: {
	        categories: categories,
	        title: {
	            text: null
	        }
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: '# Artikel',
	            align: 'high'
	        },
	        labels: {
	            overflow: 'justify'
	        }
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'top',
	        x: -100,
	        y: 100,
	        floating: true,
	        borderWidth: 1,
	        backgroundColor: '#FFFFFF',
	        shadow: true
	    },
	    credits: {
	        enabled: false
	    },
	    series: dataSeries
	});
}


$(document).ready(function(){ 
      	
  	getArticlesFromZeitForParty("SPD");
	getArticlesFromZeitForParty("CDU");
	getArticlesFromZeitForParty("FDP");
	getArticlesFromZeitForParty("B90");
	getArticlesFromZeitForParty("LINKE");
	getArticlesFromZeitForParty("PIRATEN");
	
});