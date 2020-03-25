function AudioEngine (game, volume, muted) {
	var tracks = {};
	var interval = {};
	var self = this;

	var master = {
	  track: null,
	  volume: volume, //this should never change
	  muted: muted
	};

	this.volumeButton = {
	  speaker: document.createElement("button"),
	  slider: document.createElement("input"),
	}

	var positionVolumeButtons = function() {
	  var canvasRect = game.context.canvas.getBoundingClientRect();
	  var top = canvasRect.top+5;
	  var left = (canvasRect.left+5);

	  self.volumeButton.speaker.style.top = top+"px";
	  self.volumeButton.speaker.style.left = left+"px";
	  self.volumeButton.slider.style.top = (top+5)+"px";
	  self.volumeButton.slider.style.left = (left+25)+"px";
	};

	var toggleVolumeButtons = function() {
	  self.volumeButton.speaker.setAttribute("class", (master.muted ? "fas fa-volume-off" : (master.volume < 0.75 ? "fas fa-volume-down" : "fas fa-volume-up")));
	  self.volumeButton.slider.value = (master.muted ? 0 : master.volume*100);
	};

	this.isPaused = function(track = master.track) {
	  var _track = tracks[track];
	  if (_track) {
	    return _track.paused;
	  }
	  return null;
	};

	this.isMuted = function(track = master.track) {
	  var _track = tracks[track];
	  if (_track) {
	    return _track.muted;
	  }
	  return null;
	};

	this.isPlaying = function(track = master.track) {
	  var _track = tracks[track];
	  if (_track) {
	    return !(this.isPaused(track) || this.isMuted(track));
	  }
	};

	this.play = function(track, loop = false, disrupt = false) {
	  var _track = tracks[track];
	  if (_track) {
	    _track.loop = loop;
	    if (master.muted !== _track.muted) {
	      _track.muted = master.muted;
	    }
	    if (disrupt) {
	      this.stop(track);
	    }
	    _track.play();
	  }
	};

	this.volume = function(track, value) {
	  var _track = tracks[track];
	  if (_track) {
	    _track.volume = value;
	    if (value === 0 && !_track.muted) {
	      this.mute(track);
	    } else if (value > 0 && _track.muted) {
	      this.mute(track, false);
	    }
	  }
	};

	this.mute = function(track, boolean = true) {
	  var _track = tracks[track];
	  if (_track) {
	    _track.muted = boolean;
	    if (track === master.track) {
	      master.muted = boolean;
	    }
	  }
	};

	this.pause = function(track) {
	  var _track = tracks[track];
	  if (_track) {
	    _track.pause();
	  }
	};

	this.stop = function(track) {
	  var _track = tracks[track];
	  if (_track) {
	    _track.pause();
	    _track.currentTime = 0;
	  }
	};

	this.fade = function(track, fade = "in", start, duration, stopAfterFade, callback) {
	  var _track = tracks[track];
	  if (_track) {
	    if (fade === "in" && master.muted) {
	      master.muted = false;
	    }
	    if (!_track.paused) {
	      this.pause(track);
	    }
	    if (interval[track] > 0) {
	      window.clearInterval(interval[track]);
	    }
	    var fade = fade || "in";
	    var maxVolume = master.volume;
	    var delta = (fade === "in" ? 0.01 : (fade === "out" ? -0.01 : null));
	    var numOfChanges = maxVolume / Math.abs(delta);
	    var _start = (start === "current" ? _track.currentTime : start || 0);
	    var _duration = duration || _track.duration - _start;
	    var _end = _start + _duration;
	    var _stopAfterFade = stopAfterFade || false;
	    var fadeMath = (fade === "in" ? "min" : (fade === "out" ? "max" : null));
	    var endVolume = (fade === "in" ? maxVolume : (fade === "out" ? 0 : null));
	    self.volume(track, (fade === "in" ? 0 : (fade === "out" ? maxVolume : null)));
	    _track.currentTime = _start;
	    self.play("main", true);

	    interval[track] = window.setInterval(
	      function() {
	        self.volume(track, Math[fadeMath](_track.volume + delta, endVolume)); //assure we don't go past 0 or 1

	        if(_track.volume === endVolume) {
	          window.clearInterval(interval[track]);
	          interval[track] = -1;
	          if (endVolume === 0) {
	            self.mute(track);
	            if (track == master.track) {
	              master.muted = true;
	            }
	          }
	          if (_stopAfterFade && _track.currentTime !== _track.duration) {
	            self.stop(track);
	          }
	        }
	        /*DEBUG*/ //console.log(`CurrentTime: ${_track.currentTime}\r\nVolume: ${_track.volume}`)

	        //Lastly, call any functions we need after our fade
	        toggleVolumeButtons();
	        if (callback) {
	          callback();
	        }
	      },
	      1000*(_duration/numOfChanges)
	    );
	  }
	};

	this.loadAssets = function(assets) {
	  tracks = assets;
	  for (var i in tracks) {
	    var _track = tracks[i];
	    _track.volume = master.volume;
	    _track.muted = master.muted;
	  }
	  if ("main" in tracks) {
	    master.track = "main";
	  }
	};

	this.getTracks = function() {
	  return tracks;
	}

	this.getMaster = function() {
	  return master;
	}

	this.setTracks = function(property, value) {
	  for(i in tracks) {
	    var _track = tracks[i];
	    _track[property] = value;
	  }
	}

	this.init = function() {
	  this.volumeButton.speaker.id = "volume-button";
	  this.volumeButton.speaker.style.color = "white";
	  this.volumeButton.speaker.style.backgroundColor = "transparent";
	  this.volumeButton.speaker.style.border = "none";
	  this.volumeButton.speaker.style.textDecoration = "none";
	  this.volumeButton.speaker.style.position = "absolute";

	  this.volumeButton.slider.id = "volume-slider";
	  this.volumeButton.slider.type = "range";
	  this.volumeButton.slider.min = 0;
	  this.volumeButton.slider.max = 100;
	  this.volumeButton.slider.style.borderRadius = "10px";
	  this.volumeButton.slider.style.height = "5px";
	  this.volumeButton.slider.style.backgroundColor = "rgb(225,225,225)";
	  this.volumeButton.slider.style.outline = "none";
	  this.volumeButton.slider.style.position = "absolute";

	  this.volumeButton.slider.style.zIndex = "1"; //assure it displays overtop of canvas
	  this.volumeButton.speaker.style.zIndex = "1"; //assure it displays overtop of canvas

	  toggleVolumeButtons();
	  positionVolumeButtons();
	  document.body.appendChild(this.volumeButton.speaker);
	  document.body.appendChild(this.volumeButton.slider);
	  this.volumeButton.speaker.addEventListener("click",
	    function(event) {
	      //Play
	      if (!self.isPlaying()) {
	        self.fade("main", "in", "current", 0.1);
	      }
	      //Mute
	      else {
	        self.fade("main", "out", "current", 0.1);
	      }
	    }
	  );
	  this.volumeButton.slider.addEventListener("input",
	    function(event) {
				var input = event.srcElement.value;
	      master.volume = 1.00*input/100;
	      self.volume("main", master.volume); //handles muting too
	      self.setTracks("volume", master.volume)
	      if (!self.isPlaying()) {
	        self.fade("main", "in", "current", 0.1, null);
	      }
	      else {
	        toggleVolumeButtons();
	      }
	    }
	  );
	};

	this.resize = function() {
	  positionVolumeButtons();
	}

	//If we instantiated our audio engine unmuted...start playing?
	if (this.isMuted() === false) {
	  this.play("main", true);
	}
}

AudioEngine.prototype.constructor = AudioEngine;
