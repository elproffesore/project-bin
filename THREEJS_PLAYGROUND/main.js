import {init,animate,statistics} from './modules/base.js'
import {cube} from './modules/cube.js'
import {lines,svgToLine} from './modules/lines.js'
import {animatePoints, points} from './modules/points.js'
//create and save scene camera and rederer
const [scene,camera,renderer] = init();
const stats =  statistics();
//initialize cube
//cube(scene)
//lines(scene,100,100)
//const ps = points(scene,100,100000)
svgToLine("M346.071,100.969L288.792,83.016C231.512,65.063,116.952,29.158,3.873,-10.926C-109.206,-51.009,-220.804,-95.271,-276.603,-117.401L-332.402,-139.532",scene)
svgToLine("M-320.898,-164.271L-266.68,-138.739C-212.463,-113.207,-104.029,-62.142,7.133,-17.936C118.294,26.271,232.183,63.62,289.127,82.295L346.071,100.969",scene)
svgToLine("M284.264,221.707L247.156,180.895C210.048,140.084,135.831,58.461,99.757,-37.501C63.683,-133.463,65.751,-243.763,66.785,-298.913L67.819,-354.063",scene)
//animatePoints(renderer,camera,scene,stats,ps,0)
//animate scene 

animate(renderer,camera,scene,stats);

