function Config(object){
	if(object.hasOwnProperty("uri"))
		this.uri = object.uri;
	else
		this.uri = "";
	if(object.hasOwnProperty("useYouTube"))
		this.useYouTube = object.useYouTube;
	else
		this.useYouTube = true;
	if(object.hasOwnProperty("useSlideShare"))
		this.useSlideShare = object.useSlideShare;
	else
		this.useSlideShare = true;
	if(object.hasOwnProperty("useScribd"))
		this.useScribd = object.useScribd;
	else
		this.useScribd = true;
}

Config.prototype.create = function(callback){
	var space = new openapp.oo.Resource(openapp.param.space());
	var thisConfig = this;
	space.create({
		relation: openapp.ns.role + "data",
		type: "my:ns:config",
		representation: thisConfig, //The representation refers to the object
		callback: function(configResource){
			//Now we have an URI for our config and we need to update the resource
			thisConfig.uri = configResource.getURI();
			configResource.setRepresentation(thisConfig, "application/json", function(){
				callback();
			});
		}
	});
}

Config.prototype.update = function(callback){
	var configResource = new openapp.oo.Resource(this.uri);
	configResource.setRepresentation(this, "application/json", function(){
		callback();
	});
}

function updateConfig(config, callback){
	configResource = new openapp.oo.Resource(config.uri);
	configResource.setRepresentation(config, "application/json", callback);
}


function retrieveConfig(space, callback){
	space.getSubResources({
		relation: openapp.ns.role + "data",
		type: "my:ns:config",
		onAll: function(config) {	

					if (config.length == 0) {
						config = new Config({}); 
						config.create(function(){
							callback(config);
						});
						
					} else {
						
					config[0].getRepresentation("rdfjson", function(configObject){
						callback(configObject);
					});
				}
			}
	});

}