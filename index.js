		"use strict"

		var request = require("request"),
		cheerio = require("cheerio"),
		mysql = require('mysql'),
		fs = require('fs');

		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			port: 3306,
			password: 'password',
			database: 'nyskiblog',
			multipleStatements: true
		});
		connection.connect()

		for(let page = 271; page >= 0; page--){

			let url = 'http://nyskiblog.com/page/' + page  + '/';

			request(url, function (error, response, body) {

				if (!error) {
					console.log("working on: " + url)
					var $ = cheerio.load(body, {
						normalizeWhitespace: false
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


						var query = connection.query("INSERT INTO nyskiblog.posts (url, date, author, tags, title) VALUES ( " + "'"+ url + "'" + "," + "'" + date + "'" + "," + "'" + author + "'" + "," + "'" + string + "'"+ "," + "'"+ title+ "'" +");", function(error, rows, fields) {

							if (error)
								console.log(error.message)

							if (rows)
								console.log(rows)

							if (fields){
								console.log(fields)
							}

						});





						return {url: url, title: title, author: author, date: date, tags: string}
					}

					$('.post.type-post').each(function(i, post){
						var scrapedPost = scrapePost(post);
						fs.writeFile( './posts/' + scrapedPost.title + '.txt', JSON.stringify(scrapedPost), function(err){

							if (err)
								console.log(err)

							// console.log('writing file')

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


