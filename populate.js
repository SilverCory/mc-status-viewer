var last_data = null;

var chances = {};

function populate() {
    $.getJSON('status?' + Math.floor(Math.random() * 30000), function(data) {
        var x = "";

        for (var chancer in chances) {
			strings = chancer.split("_-_-_");
			console.log( "Strings:" );		
			console.log( strings );		
			if( strings.length == 2 && strings[0] !== undefined && strings[1] !== undefined ) {
				if( data.dead[strings[0]] !== undefined && $.inArray( strings[1], data.dead[strings[0]] ) > -1 ) {
					
					if( chances[ chancer ] == 5 ) {
						var notification = new Notification('A server on is down!', {
							//icon: 'http://path.to.com/image.png',
							body: "Hey! " + strings[1] + " is down on the " + strings[0] + " machine!",
						});
					}
					if( (chances[ chancer ] % 100) == 0 ) {
						var notification = new Notification('It\'s been a while!!', {
							//icon: 'http://path.to.com/image.png',
							body: "Hey! " + strings[1] + " is down on the " + strings[0] + " machine!",
						});
					}
					
					chances[ chancer ] = chances[ chancer ] + 1;
					console.log( "Chances add one for " + chancer + ".\nTotal: " + chances[ chancer ] );
				} else {
					console.log( "Not B." );	
					delete chances[ chancer ]
				}
			} else {
				console.log( "Not A" );	
				delete chances[ chancer ];
			}
        }

        if (last_data != null) {
            for (var category in last_data.alive) {
                for (var entry in last_data.alive[category]) {
                    if (data['dead'][category] !== undefined && $.inArray(entry, data['dead'][category]) > -1) {
                        console.log("dead: " + category + " - " + entry);
                        if( chances[ category + "_-_-_" + entry ] == undefined )
							chances[ category + "_-_-_" + entry ] = 1;
                    }
                }
            }

        }
        last_data = data;

        for (var category in data.alive) {
            x += "<div class=\"row align-row\">";

            x += "<h4>" + category + "</h4>";
            for (var entry in data.alive[category]) {
                x += "<span class=\"btn btn-success btn-override\">" +
                    entry + "<em>" + data['alive'][category][entry] + "</em></span>";
            }
            x += "</div>"
        }

        $('#alive-data').html(x);

        var x = "";

        for (var category in data.dead) {
            x += "<div class=\"row align-row\">";

            x += "<h4>" + category + "</h4>";
            for (var entry in data.dead[category]) {
                x += "<span class=\"btn btn-danger btn-override\">" +
                    data.dead[category][entry] + "</span>";
            }
            x += "</div>"
        }

        $('#dead-data').html(x);
    });
}

$(document).ready(function() {
    if (Notification.permission !== "granted")
        Notification.requestPermission();

    window.setInterval(populate, 5000);
    populate();
});
