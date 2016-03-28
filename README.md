# Stock_searching_application


A single page stock data search applicatioin, including the following functions -
* Auto-complete -- allows a user to enter a keyword (company symbol or company name) to retrieve information (quote information, news and stock chart) from Markit on Demand by making an AJAX call on every keystroke that is entered.

*Stock data displaying --  On the server side the php scripts extract the stock details of the company symbol, perform an API request to Markit on Demand, and returns the data in JSON data.

*  Current Day Stock Chart -- An image of the current daily chart of the stock of the company retrieved via Yahoo charts API.

*  Historical Charts --  implemented using HighCharts’ Highstock (www.highcharts.com/stock/demo). The result chart have the following zoom levels: 1 week, 1 month, 3 months, 6 months, 1 year, YTD and All.

*  News Feed --  Using the Google News Feed API to fetch related news to current queried company.

*  Favorite stock list -- Using html5 local storage.
