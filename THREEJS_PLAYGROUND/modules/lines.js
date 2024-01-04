import * as THREE from 'three';
export function lines(scene,radius,count){
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({vertexColors: true})
    const positions = [];
    const colors = [];
    const sizes = []
    for(let i = 0; i< count;i++){
        let x = Math.random() * radius - radius/2;
        let y = Math.random() * radius - radius/2;
        let z = Math.random() * radius - radius/2;
        positions.push(x,y,z);
        colors.push(Math.random(),Math.random(),Math.random());
        sizes.push(1000);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3))
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
    geometry.setAttribute('size',new THREE.Float32BufferAttribute(sizes,1))
    geometry.computeBoundingSphere();
    const line = new THREE.Line(geometry,material);
    scene.add(lines);
}
export function svgToLine(svgString,scene){
    let coordinate_pairs = []
    let regexCoord = /(.),?([^MLC]+),*/g
    let matches = svgString.match(regexCoord)
    for(let i = 0; i < matches.length;i++){
        let match = matches[i]
        let command = match.slice(0,1)
        let coordinates = match.match(/([^,MLC]+)/g)
        coordinate_pairs.push({command,coordinates})
    }
    console.log(coordinate_pairs)
    let cubicPoints = [...coordinate_pairs[1].coordinates,...coordinate_pairs.find(c => c.command == "C").coordinates]
    console.log(cubicPoints)
    const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(cubicPoints[0],cubicPoints[1]),
        new THREE.Vector3(cubicPoints[2],cubicPoints[3]),
        new THREE.Vector3(cubicPoints[4],cubicPoints[5]),
        new THREE.Vector3(cubicPoints[6],cubicPoints[7])
    );
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );
    scene.add(curveObject)
}