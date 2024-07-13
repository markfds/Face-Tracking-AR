import {loadGLTF} from "../../Documentation/applications/libs/loader.js";
const THREE =  window.MINDAR.FACE.THREE;
const capture = (mindarthree) =>{
    const {video,renderer,scene,camera } = mindarthree;
    const renderCanvas = renderer.domElement;
    const canvas  = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = renderCanvas.width;
    canvas.height = renderCanvas.height;
    const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
    const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
    const sw = video.videoWidth - sx * 2;
    const sh = video.videoHeight - sy * 2;
    context.drawImage(video,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
    renderer.preserveDrawingBuffer = true;
    renderer.render(scene,camera);
    context.drawImage(renderCanvas,0,0,canvas.width,canvas.height);
    renderer.preserveDrawingBuffer = false;

    const link= document.createElement("a");
    link.download = "photo.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
document.addEventListener("DOMContentLoaded",() => {
    const start = async() => {
        const mindarthree = new window.MINDAR.FACE.MindARThree({
            container:document.body,
        });
        const {renderer,scene,camera} = mindarthree;
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
        light2.position.set(-0.5, 1, 1);
        scene.add(light);
        scene.add(light2);
        const occluder = await loadGLTF('../../Documentation/applications/assets/models/sparkar-occluder/headOccluder.glb');
        occluder.scene.scale.set(0.065, 0.065, 0.065);
        occluder.scene.position.set(0, -0.3, 0.15);
        occluder.scene.traverse((o) => {
          if (o.isMesh) {
        const occluderMaterial = new THREE.MeshPhongMaterial({colorWrite: false});
        o.material = occluderMaterial;
          }
        });
        occluder.scene.renderOrder = 0;
        const occluderAnchor = mindarthree.addAnchor(168);
        occluderAnchor.group.add(occluder.scene);

        const anchor = mindarthree.addAnchor(168);
        const hatanchor = mindarthree.addAnchor(10);

         const glass = await loadGLTF("../../Documentation/applications/assets/models/glasses1/scene.gltf");
          const glass2 = await loadGLTF("../../Documentation/applications/assets/models/glasses2/scene.gltf");
           const hat = await loadGLTF("../../Documentation/applications/assets/models/hat1/scene.gltf");
           const hat2 = await loadGLTF("../../Documentation/applications/assets/models/hat2/scene.gltf");
        
        let filter1 = document.getElementById("a1");
        filter1.addEventListener("click",async(e)=>{
            if (anchor.group.children.includes(glass2.scene)) {
                console.log("glass2 remove");
                anchor.group.remove(glass2.scene);
            } 
        glass.scene.renderOrder=1;
        glass.scene.scale.set(0.01, 0.01, 0.01);
        anchor.group.add(glass.scene);
        })
        let filter2 = document.getElementById("a2");
        filter2.addEventListener("click",async(e)=>{
            if (anchor.group.children.includes(glass.scene)) {
                console.log("glass1 remove");
                anchor.group.remove(glass.scene);
            } 
            glass2.scene.rotation.set(0, -Math.PI/2, 0);
                glass2.scene.position.set(0, -0.3, 0);
                glass2.scene.scale.set(0.6, 0.6, 0.6);
                glass2.scene.renderOrder=1;
                anchor.group.add(glass2.scene);
        });
        let filter3 = document.getElementById("a3");
        filter3.addEventListener("click",async(e)=>{ 
          
            if (hatanchor.group.children.includes(hat2.scene)) {
                console.log("hat2 remove");
                hatanchor.group.remove(hat2.scene);
            } 
        
            hat.scene.position.set(0, 1, -0.5);
            hat.scene.scale.set(0.35, 0.35, 0.35);
        hat.scene.renderOrder=1;
        hatanchor.group.add(hat.scene);
        });
        let filter4 = document.getElementById("a4");
        filter4.addEventListener("click",async(e)=>{ 
         if (hatanchor.group.children.includes(hat.scene)) {
                console.log("hat1 remove");
                hatanchor.group.remove(hat.scene);
            } 
            
        
            hat2.scene.position.set(0, -0.2, -0.5);
            hat2.scene.scale.set(0.008, 0.008, 0.008);
        hat2.scene.renderOrder=1;
        hatanchor.group.add(hat2.scene);
        console.log("hat 2 rendered");
        });

        const previewImage = document.querySelector("#preview-image");
        const previewClose = document.querySelector("#preview-close");
        const preview = document.querySelector("#preview");
        const previewShare = document.querySelector("#preview-share");
    
        document.querySelector("#capture").addEventListener("click", () => {
          const data = capture(mindarthree);
          preview.style.visibility = "visible";
          previewImage.src = data;
        });
    
        previewClose.addEventListener("click", () => {
          preview.style.visibility = "hidden";
        });
    
        previewShare.addEventListener("click", () => {
          const canvas = document.createElement('canvas');
          canvas.width = previewImage.width;
          canvas.height = previewImage.height;
          const context = canvas.getContext('2d');
          context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
    
          canvas.toBlob((blob) => {
        const file = new File([blob], "photo.png", {type: "image/png"});
        const files = [file];
        if (navigator.canShare && navigator.canShare({files})) {
          navigator.share({
            files: files,
            title: 'AR Photo',
          })
        } else {
          const link = document.createElement('a');
          link.download = 'photo.png';
          link.href = previewImage.src;
          link.click();
        }
          });
        });
        await mindarthree.start();
        renderer.setAnimationLoop(()=>{
            renderer.render(scene,camera);
        });
    }
    start();
}) 