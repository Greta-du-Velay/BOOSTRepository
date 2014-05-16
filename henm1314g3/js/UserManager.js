function User(object){
	if(object.hasOwnProperty("uri"))
		this.uri = object.uri;
	else
		this.uri = "";

	if(object.hasOwnProperty("name"))
		this.name = object.name;
	else
		this.name = "";

	if(object.hasOwnProperty("email"))
		this.email = object.email;
	else
		this.email = "";
}

function retrieveAllUsers(space, callback){
	//First get the URIs of all the user which are in the space
	space.getSubResources({
		relation : "http://xmlns.com/foaf/0.1/member",
		type : "http://purl.org/role/terms/Person",
		followReference : true,
		onAll : function(resources){
			var userUris = [];

			for(var i = 0; i < resources.length; i++){
				userUris.push(resources[i].info.subject["http://www.w3.org/2002/07/owl#sameAs"][0].value);
			}
			//Get all the users in the space based on their URI
			var users = [];

			var getUser = function(item, done){
				var userResource = new openapp.oo.Resource(item);
				userResource.getInfo(function(info){
					var email = info["http://xmlns.com/foaf/0.1/mbox"];
					if(!email)
						email = "";
					//Remove 'mailto:' prefix from the email
					email = email.substring(7);
					var user = new User({
						uri : item,
						name : info["http://purl.org/dc/terms/title"],
						email : email
					});
					users.push(user);
					done();
				});
			}

			async.forEach(userUris, getUser, function(error){
				callback(users);
			});
		}
	});
}