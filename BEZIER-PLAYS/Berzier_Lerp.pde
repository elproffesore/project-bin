ArrayList<Point> points = new ArrayList<Point>();
void setup(){
  size(600,600);
  background(255);
  for(int i = 0; i< 5; i++){
    points.add(new Point((int)random(0,width),(int)random(0,height)));
  }
  noFill();
}
void draw(){
  beginShape();
  for(int i = 0; i< points.size();i++){
    curveVertex(points.get(i).x,points.get(i).y);
  }
  endShape();
  for(int i = 0 ; i < points.size();i++){
    points.get(i).update();
  }
}
class Point{
int beginx;
int beginy;
int destx;
int desty;
int x;
int y;
float f;
  public Point(int x1,int y1){
    beginx = x1;
    beginy = y1;
    x = x1;
    y = y1;
    destx = (int)random(0,width);
    desty = (int)random(0,height);
    f = 0;
  }
  public void update(){
    float lerper= abs(sin(f));
    x = (int)lerp(beginx,destx,lerper);
    y = (int)lerp(beginy,desty,lerper);

    f += 0.006;
  }
}
