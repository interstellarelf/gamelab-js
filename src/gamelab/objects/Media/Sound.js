
/**
 * Creates a Sound instance. Implements HTML5-Audio object
 * --DevTODO : complete docs for the Sound class
 *
 * @param   {string} src the source-path of the targeted sound-file
 * @returns {Sound} instance of Gamelab.Sound
 * */

class Sound {

    constructor(src, data) {

        if (typeof(src) == 'object') {

            this.sound = document.createElement('audio');

            this.sound.volume = src.sound.volume;

            this.sound.src = src.src;

            this.src = src.src;
        }

        else if (typeof(src) == 'string') {

            this.sound = document.createElement('audio');

            this.sound.volume = 1;

            this.sound.src = src;

            this.src = src;

        }

        if(typeof(data)=='object') {
            for (var x in data) {
                if (x !== 'sound') {
                    this[x] = data[x];

                }
            }
        }

        this.onLoad = this.onLoad || function () {
            };

        if (typeof(this.onLoad) == 'function') {

            this.onLoad(this.sound);

        }

    }

    Multiply(number){

      var srcList = [];
      for(var x = 0; x < number; x++)
      {
        srcList.push(this.src || this.sound.src);
      }

      return new Gamelab.SoundList(srcList).Volume(this.sound.volume);
    }

    Loop(loop)
    {
        this.sound.loop = loop || true;

        return this;

    }

    loop(loop) //same as Loop()
    {
        this.sound.loop = loop || true;

        return this;

    }


    Volume(val)
    {
        this.sound.volume = val;

        return this;

    }


    volume(val) //same as Volume()
    {

        this.sound.volume = val;

        return this;

    }

    Play() {

        if(Gamelab.config && Gamelab.config.soundOff)
        {
          return;
        }

        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();

        }

        return this;

    }

    play() { //same as Play()
      if(Gamelab.config && Gamelab.config.soundOff)
      {
        return;
      }
        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();
        }
        return this;
    }

}


class SoundList{

    constructor(list)
    {
        this.cix = 1;

        this.sounds = [];

        if(list instanceof Array)
        {
            for(var x in list)
            {
                if(list[x].src)
                {
                    this.sounds.push(new Sound(list[x].src, list[x]));

                }
                else if(typeof(list[x]) == 'string')
                {
                    this.sounds.push(new Sound(list[x]));

                }
            }
        }
    }

    add(src, name)
    {
        if(typeof(src) == 'object' && src.src)
        {
            this.sounds.push(new Sound(src.src, src));

        }
        else if(typeof(src) == 'string')
        {
            var data = {};

            if(name)
            {
                data.name = name;
            }

            this.sounds.push(new Sound(list[x], data));

        }

    }

    Volume(v)
    {
        for(var x = 0; x < this.sounds.length;x++)
        {
            this.sounds[x].volume(v);

        }

        return this;
    }

    volume(v)
    {
        for(var x = 0; x < this.sounds.length;x++)
        {
            this.sounds[x].volume(v);

        }

        return this;
    }


    PlayNext()
    {
      if(Gamelab.config && Gamelab.config.soundOff)
      {
        return;
      }

        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;

    }

    Play()
    {

      if(Gamelab.config && Gamelab.config.soundOff)
      {
        return;
      }

        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;


    }

    playNext() //same as PlayNext()
    {
      if(Gamelab.config && Gamelab.config.soundOff)
      {
        return;
      }
        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;

    }

    play() //same as Play()
    {
      if(Gamelab.config && Gamelab.config.soundOff)
      {
        return;
      }

        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;


    }

}

Gamelab.Sound = Sound;

Gamelab.SoundList = SoundList;




class Audio {

  constructor(){


  }

}

Gamelab.Audio = Audio;
