class RadioStation
{
    constructor(playlist)
    {
        this.playlist      = playlist;
        this.totalDuration = 0;
        this.loadedTracks  = 0;
        this.currentTrack  = 0;
        this.ready         = false;
        this.prepare()
    }
    prepare()
    {
        this.totalDuration = 0;
        this.loadedTracks  = 0;
        this.currentTrack  = 0;
        this.ready         = false;
        this.playlist.forEach((audio, index) => {
            audio.addEventListener('loadedmetadata', () => {
                this.totalDuration += audio.duration;
                this.loadedTracks++;
                if (this.loadedTracks === this.playlist.length) this.ready = true;
            });
        });
    }
    play()
    {
        const currentTime = Date.now() / 1000;
        const startPosition = currentTime % this.totalDuration;
        this.startAt(startPosition);
    }
    stop()
    {
        for(let i in this.playlist)
        {
            this.playlist[i].pause();
            this.playlist[i].removeEventListener("ended", () => { 
                this.playNextTrack();
            });
        }
    }
    startAt(startPosition)
    {
        let trackTime = 0;
        for (let i = 0; i < this.playlist.length; i++)
        {
            const audio = this.playlist[i];
            if (trackTime + audio.duration > startPosition)
            {
                this.currentTrack = i;
                audio.currentTime = startPosition - trackTime;
                audio.play();
                this.setupTrackEndHandling();
                break;
            }
            trackTime += audio.duration;
        }
    }
    setupTrackEndHandling()
    {
        this.playlist[this.currentTrack].addEventListener('ended', () => { 
            this.playNextTrack();
        });
    }
    playNextTrack()
    {
        // По завершению снова определяем следующий трек чтобы небыло багов в звучании
        this.play()
    };
}
