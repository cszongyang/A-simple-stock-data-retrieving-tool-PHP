# Stock_searching_application

The implementation of this application on AWS is here: http://stocksearching.us-west-2.elasticbeanstalk.com/

A single page stock data search applicatioin, including the following functions -
* Auto-complete -- allows a user to enter a keyword (company symbol or company name) to retrieve information (quote information, news and stock chart) from Markit on Demand by making an AJAX call on every keystroke that is entered.

* Stock data displaying --  On the server side the php scripts extract the stock details of the company symbol, perform an API request to Markit on Demand, and returns the data in JSON data.

*  Current Day Stock Chart -- An image of the current daily chart of the stock of the company retrieved via Yahoo charts API.

*  Historical Charts --  implemented using HighCharts’ Highstock (www.highcharts.com/stock/demo). The result chart have the following zoom levels: 1 week, 1 month, 3 months, 6 months, 1 year, YTD and All.

*  News Feed --  Using the Google News Feed API to fetch related news to current queried company.

*  Favorite stock list -- Using html5 local storage.

###Screen shots
![Alt text](/Screen_shots/1.png?raw=true "1")

![Alt text](/Screen_shots/2.png?raw=true "2")

![Alt text](/Screen_shots/3.png?raw=true "3")

![Alt text](/Screen_shots/4.png?raw=true "4")
