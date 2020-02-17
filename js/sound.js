class Sound {
  constructor(audioUrl, isMuted) {
    //Set up the audio defaults
    var audio = new Audio(audioUrl);
    audio.muted = (isMuted ? true : false);
    audio.loop = true;
    
    //Automatically start the audio
    if (!isMuted) {
      audio.play();
    }
    
    return audio;
  } //end constructor
}