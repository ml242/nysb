		"use strict"

		var request = require("request"),
		cheerio = require("cheerio"),
		mysql = require('mysql'),
		fs = require('fs');

		var connection = mysql.createPool({
			host: 'localhost',
			user: 'root',
			port: 3306,
			password: '',
			database: 'nyskiblog',
			multipleStatements: true
		});

		for(let page = 271; page >= 0; page--){

			let url = 'http://nyskiblog.com/page/' + page  + '/';
			request(url, function (error, response, body) {
				connection.getConnection(function (err, response) {
					if (!err) {
						console.log("Database is connected ... \n\n");
					} else {
						console.log("Error connecting database ... \n\n" + err);
					}
				});
				if (!error) {
					console.log("working on: " + url)
					var $ = cheerio.load(body, {
						normalizeWhitespace: true
					});

					let scrapePost = function(post){
						var string = ""
						var url= $(post).find('.entry-title a').attr('href');
						var title= $(post).find('.entry-title a').html();
						var author = $(post).find('.entry-author').text();
						var date = $(post).find('.postDateStyle').text();
						var tags = $(post).find('.cat-links a').each(function(i, tag){
							string += $(tag).text()	+ ", "
						});
						return {url: url, title: title, author: author, date: date, tags: string}			 
					}

					$('.post.type-post').each(function(i, post){
						var scrapedPost = scrapePost(post);
						fs.writeFile( './posts/' + scrapedPost.title + '.txt', JSON.stringify(scrapedPost), function(err){
							if (err) console.log(err)
								console.log('writing file')
						})
					})
				// connection.query.insert(posts)

				if (page === 0 ){
					process.exit(0);
				}

			} else {
				console.log("We’ve encountered an error: " + error);
			}

		});	

	}


