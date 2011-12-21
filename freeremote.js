function freeremote(options) {
  this._defaults = {
    box: 'hd1', 
    code: ''
  };
  this._options = $.extend(this._defaults, options);
};

freeremote.prototype._getUrl = function(action) {
  var urlAction = action || 'remote_control';
  return 'http://'
       + this._options.box
       + '.freebox.fr/pub/'
       + urlAction
       + '?code='
       + this._options.code;
};

freeremote.prototype.setCode = function(newCode) {
  this._options.code = newCode;
}

freeremote.prototype.setBox = function(newBox) {
  this._options.box = newBox;
}

freeremote.prototype.click = function(key) {
  var url = this._getUrl() + '&key=' + key;
  $.ajax({url: url, async: false});
};

freeremote.prototype.push = function(key) {
  var url = this._getUrl() + '&key=' + key + '&long=true';
  $.ajax({url: url, async: false});
};

freeremote.prototype.setChannel = function(channel) {
  var key = channel;
  var keys = new Array();
  while (key >= 10) {
    keys.push(key % 10);
    key = Math.floor(key / 10);
  }
  keys.push(key);
  keys.reverse();
  
  for (var i = 0;  i < keys.length - 1; ++i) {
    this.push(keys[i]);
  }
  
  this.click(keys[keys.length - 1]);
}

freeremote.prototype.getChannels = function() {
  var url = this._getUrl('channels');
  var channels;
  $.ajax({
    url: url,
    dataType: 'json',
    async: false,
    success: function(data) { 
      channels = data;
  }});
  return channels;
};

freeremote.prototype.getAvailableChannels = function() {
  var channels = this.getChannels();
  var availableChannels = new Array();
  for (var i = 0; i < channels.length; ++i) {
    if (channels[i].available) {
      availableChannels.push(channels[i]);
    }
  }
  return channels;
};