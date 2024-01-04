import ddf.minim.analysis.*;
import ddf.minim.*;
Minim       minim;
AudioPlayer ap;
FFT         fft;
int samples = 300;
float divider = TWO_PI/samples;
int i =0;
void setup(){
size(1000,1000);
minim = new Minim(this);
ap = minim.loadFile("/Users/proff/Desktop/me right now/southstar - Miss You.mp3",1024);
fft = new FFT(ap.bufferSize(),ap.sampleRate());
ap.play();
frameRate(60);
background(255);
}
void draw(){
  fft.forward(ap.mix);
  for(int s = 0; s < fft.specSize()/2; s++ ){   
    float x = width/2 + ((fft.specSize()/2-s)) * cos(divider * i);
    float y = height/2 + ((fft.specSize()/2-s)) * sin(divider * i);
    println(x,y);
    stroke(0,0,0,fft.getBand(s)*30);
    strokeWeight(fft.getBand(s));
    point(x,y);
  }
  i++;
}
