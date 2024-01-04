int arraySize = 5;
int globalSpeed = 5;
float chanceIntersectingNewLine = 0.3;
float chanceIterationNewLine = 0.9;
ArrayList<Line> lineArray  = new ArrayList<Line>();
void setup(){
  //size(1280,720);
  size(1280 ,720);
  for(int i = 0; i < arraySize; i++){ 
    float startX = random(0,width), endX = random(0,width);
    float startY = random(0,height),endY = random(0,height);
    lineArray.add(new Line(startX,endX,startY,endY));
  }
}
void draw(){
  background(255);
  stroke(0);
  for(int i = 0; i < lineArray.size(); i++){
    Line line = lineArray.get(i);
    line.update();  
    intersecting(line);
  }
}
class Line{
  public PVector start;
  public PVector end;
  public PVector dir;
  public boolean stop = false;
  private float speed;
  private float pos = 1;
  
  public Line(float x, float y,float endX,float endY){
    start = new PVector(x,y);
    dir = PVector.sub(new PVector(endX,endY),start).normalize();
    end = PVector.add(start,dir.setMag(pos));
    speed = globalSpeed;
  }
  public void update(){    
       if(!this.stop){
           end = PVector.add(start,dir.setMag(pos));
           pos += speed;
           if(random(0,1)>chanceIterationNewLine){
             newLine(this);
           }
       }
       line(start.x,start.y,end.x,end.y);
       
    }
 }
 
 public void newLine(Line parentLine){
       //create a new vector pointing -90/90 degree from a point on the line (newStart)
      float a;
      if(random(0,1)>=0.5){ 
        a=-PI/2;
      }else{
        a=PI/2;
      }
      if(PVector.sub(parentLine.end,parentLine.start).mag() > 15){
        PVector startVector = PVector.lerp(parentLine.start,parentLine.end,random(0.1,0.9));
        PVector middleVector  = startVector.copy().sub(parentLine.start).rotate(a);
        PVector endVector = startVector.copy().add(middleVector);
        //if the vector is too short then do not add another line
        endVector.sub(startVector);
        PVector direction = PVector.add(startVector,endVector);
        lineArray.add(new Line(startVector.x,startVector.y,direction.x,direction.y));
      }
 }
 public void intersecting(Line firstLine){
    int t = 0;
    if(firstLine.start.x > width || firstLine.start.x < 0 || firstLine.start.y > height || firstLine.end.y < 0){
      firstLine.stop = true;
      return;
    }
    while(!firstLine.stop && t < lineArray.size()){
      Line secondLine = lineArray.get(t);
      //create Vector from start and end of both lines 
      PVector a = firstLine.start;
      PVector b = firstLine.end;
      PVector c = secondLine.start;
      PVector d = secondLine.end;
      //use formula of intersection from https://gamedev.stackexchange.com/questions/26004/how-to-detect-2d-line-on-line-collision
      float denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
      float numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
      float numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));
      float r = numerator1 / denominator;
      float s = numerator2 / denominator;
      boolean intersect = (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
      //if r is bigger than s then l1 is the hitting line otherwise its the other line
     if(intersect && r>s){
        firstLine.stop = true;
        if(random(0,1)>chanceIntersectingNewLine){
             newLine(firstLine);
        }
        return;
     }
     t++;
   }
 }
