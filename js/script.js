var series = {};
var articles_per_party = {"spd":false,"cdu":false,"fdp":false,"b90":false,"linke":false,"piraten":false};	
var dateStringsArray = [];

function addLeadingZeros(dateStr) {
	return (('0' + (dateStr)).slice(-2));
}

function formatDate(date) {
	return date.getFullYear()+"-"+addLeadingZeros((date.getMonth()+1))+"-"+addLeadingZeros(date.getDate());
}
function formatDateTime(date) {
	var dateStr = formatDate(date);
	return dateStr+"T"+addLeadingZeros(date.getHours())+":"+addLeadingZeros(date.getMinutes())+":"+addLeadingZeros(date.getSeconds())+"Z";
}
function setDateAtEndOfDay(year,month,day) {
	var midnightDate = new Date();
	midnightDate.setFullYear(year,month,day);
	midnightDate.setHours(23);
	midnightDate.setMinutes(59);
	midnightDate.setSeconds(59);
	return midnightDate;
}
function setDateAtStartOfDay(year,month,day) {
	var midnightDate = new Date();
	midnightDate.setFullYear(year,month,day);
	midnightDate.setHours(0);
	midnightDate.setMinutes(0);
	midnightDate.setSeconds(0);
	return midnightDate;
}


function saveCounts(party,articles_count_obj,pos) {
   for( var dateObj in articles_count_obj) {
	   if(dateObj in series) {
			series[dateObj][pos].count = articles_count_obj[dateObj].count;
			series[dateObj][pos].content = articles_count_obj[dateObj].content;
   		}else {
			series[dateObj] = [{count:0,content:[]},{count:0,content:[]},{count:0,content:[]},{count:0,content:[]},{count:0,content:[]},{count:0,content:[]}];
			series[dateObj][pos].count = articles_count_obj[dateObj].count;
			series[dateObj][pos].content = articles_count_obj[dateObj].content;
			dateStringsArray.push(dateObj);
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
		case 'B90': pos = 3;party_suchstring = '"Die Grünen",Grüne';
 	   		break;
		case 'LINKE': pos = 4;party_suchstring = '"Die Linke"';
			break;
		case 'PIRATEN': pos = 5;party_suchstring = '"Die Piraten"';
			break;
		
    }
	var month = $('#month :selected').val();
	var year = $('#year :selected').val();
	var startDate = setDateAtStartOfDay(year,month-1,1);
	var endDate = setDateAtEndOfDay(year,month,0);
	var formattedStartDate = formatDateTime(startDate);
	var formattedEndDate = formatDateTime(endDate);
	var api = $("body").zon_api({
	  query:party_suchstring,
	  api_key:"485867bfa02e66f4229556c89a1029e38f02a4843d618072756f",
	  endpoint:"content",
	  params:{	fields:"release_date,supertitle,title,href,snippet",
	  			fq:"release_date:["+formattedStartDate+" TO "+formattedEndDate+"]"
			},
	  limit: 10000
	});
      	
	api.retrieve(0,function (data){
	   var counts = new Array();
	   var resultsFound = data.get_result().found;
	   for(i=0;i<resultsFound;i++) {
		   date = new Date(data.get_result().matches[i].release_date);
		   var supertitle = data.get_result().matches[i].supertitle;
		   var snippet = data.get_result().matches[i].snippet;
		   var title = data.get_result().matches[i].title;
		   var url = data.get_result().matches[i].href;
		   var normalized_date = formatDate(date);
		   var date_key = Date.parse(normalized_date);
		   if(date_key in counts) {
			counts[date_key].count += 1;
			counts[date_key].content.supertitles.push(supertitle);
			counts[date_key].content.titles.push(title);
			counts[date_key].content.urls.push(url);
			counts[date_key].content.snippets.push(snippet);
		   }else {
		   	counts[date_key] = {count : 1, content : {supertitles:[supertitle],titles:[title],urls:[url],snippets:[snippet]}};
		   }
	   }
	   
	   
	   
	   saveCounts(party,counts,pos);
	   
	   
	 });
}

function plotData() {
	var change_articles = true;
	spd_dates = new Array();
	cdu_dates = new Array();
	fdp_dates = new Array();
	b90_dates = new Array();
	linke_dates = new Array();
	piraten_dates = new Array();
	categories = new Array();
	spd_supertitles = new Array();
	dateStringsArray.sort();
	
	lastEntry = dateStringsArray.length-1;
	for(var i=lastEntry;i>=0;i--) {
		dataObj = dateStringsArray[i];
		var date = new Date(parseInt(dataObj));
		categories.push(date.getDate()+"."+(date.getMonth()+1));
		spd_dates.push({y:series[dataObj][0].count,dataLabels:series[dataObj][0].content});
		cdu_dates.push({y:series[dataObj][1].count,dataLabels:series[dataObj][1].content});
		fdp_dates.push({y:series[dataObj][2].count,dataLabels:series[dataObj][2].content});
		b90_dates.push({y:series[dataObj][3].count,dataLabels:series[dataObj][3].content});
		linke_dates.push({y:series[dataObj][4].count,dataLabels:series[dataObj][4].content});
		piraten_dates.push({y:series[dataObj][5].count,dataLabels:series[dataObj][5].content});
		
	}
	
	dataSeries = [{name:'SPD',data:spd_dates,allowPointSelect: true},{name:'CDU',data:cdu_dates},{name:'FDP',data:fdp_dates},{name:'B90/Die Grünen',data:b90_dates},{name:'Die Linke',data:linke_dates},{name:'Die Piraten',data:piraten_dates}];
	chart = new Highcharts.Chart({
	    chart: {
	        renderTo: 'container',
	        type: 'spline'
	    },
		colors: [
			'#e20019',
			'#000',
			'#FFFF00',
			'#85b070',
			'#DF0404'
			],
	    title: {
	        text: 'Artikel in der ZEIT pro Partei im Monat'
	    },
	    subtitle: {
	        text: 'Source: ZEIT API'
	    },
	    xAxis: {
	        categories: categories,
	        title: {
	            text: null
	        },
			labels: {
				rotation: -45
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
		tooltip: {
            formatter: function() {
                var point = this.point;
				var format = '<b>'+ point.series.name +'</b><br/>Artikel: '+point.y;
				if(typeof(point.dataLabels.supertitles) != 'undefined') {
					format += '<br/>'+point.dataLabels.supertitles.join(", ");
				}
				if(typeof(point.dataLabels.titles) != 'undefined' && change_articles) {
					var titleLenght = point.dataLabels.titles.length;
					$('#articles ul').html('');
					for(var k=0;k<titleLenght;k++) {
						$('#articles ul').append('<li><a href="'+point.dataLabels.urls[k]+'">'+point.dataLabels.titles[k]+'</a><br/><p>'+point.dataLabels.snippets[k]+'</p></li>');
					}
				}
                return format;
            }
        },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'top',
	        x: -100,
	        y: 100,
	        floating: true,
	        borderWidth: 0,
	        backgroundColor: '#FFFFFF',
	        shadow: true
	    },
		plotOptions: {
		                spline: {
		                    lineWidth: 1,
		                    states: {
		                        hover: {
		                            lineWidth: 4
		                        }
		                    },
		                    marker: {
		                        enabled: false,
		                        states: {
		                            hover: {
		                                enabled: true,
		                                symbol: 'circle',
		                                radius: 6,
		                                lineWidth: 1
		                            }
		                        }
		                    },
						},
						series: {
					                cursor: 'pointer',
					                point: {
					                    events: {
					                        click: function() {
												if(change_articles) {
													change_articles = false;
												}else {
													change_articles = true;
												}
					                        }
					                    }
					                }
					            }
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