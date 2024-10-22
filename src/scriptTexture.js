import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as gui from "dat.gui" 

// loader manager 
const loaderManager = new THREE.LoadingManager()

// loaderManager.onStart = ()=>{
//     console.log("start")
// }
// loaderManager.onLoad = ()=>{
//     console.log("onLoad")
// }

// loaderManager.onProgress = (x, t)=>{
//     console.log("onProgress" )
// }
// loaderManager.onError = ()=>{
//     console.log("onError ")
// }
// loaderManager.onStart = ()=>{
//     console.log("onStart ")
// }

const textureLoader = new THREE.TextureLoader(loaderManager)
const displacementMap = textureLoader.load('/textures/Chainmail004_2K_Displacement.jpg' )
const colorTexture = textureLoader.load('/textures/Chainmail004_2K_Color.jpg' )
const MineCraftTexture = textureLoader.load('/textures/minecraft.png' )
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg' )
const normalTexture = textureLoader.load('/textures/door/normal.jpg' ) 
// const heightTexture = textureLoader.load('/textures/door/height.jpg' )
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg' ) 
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg' ) 
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg' )


 // repeat
//  colorTexture.center.x = 0.5  
//  colorTexture.center.y = 0.5
//  colorTexture.repeat.x  = 4
//   colorTexture.wrapS = THREE.MirroredRepeatWrapping
//  colorTexture.repeat.y = 3
//  colorTexture.wrapT = THREE.MirroredRepeatWrapping
 
//  colorTexture.rotation = Math.PI / 4
 
colorTexture.generateMipmaps = false
colorTexture.magFilter= THREE.NearestFilter


MineCraftTexture.magFilter = THREE.NearestFilter
MineCraftTexture.generateMipmaps = false

// MineCraftTexture.minFilter = THREE.NearestFilter

// colorTexture.minFilter = THREE.LinearFilter
 

//  colorTexture.minFilter = THREE.NearestFilter
//  colorTexture.minFilter = THREE.NearestMipMapLinearFilter
//  colorTexture.minFilter = THREE.NearestMipMapNearestFilter
//  colorTexture.minFilter = THREE.LinearMipmapNearestFilter

 /**
 * Base
*/
// images  
// const img = new Image()
// img.src = "http://192.168.1.2:8080"
// const texture = new THREE.Texture(img)
// img.addEventListener ("load" , (e)=>{
//     texture.needsUpdate = true
//     console.log(texture)

// })



//

// Canvas


const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

// plate 
const plate = new THREE.PlaneGeometry(
    30 ,
    30 , 
    50 , 
    50
)
const geometry = new THREE.SphereGeometry(1, 200, 200)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(
    geometry.attributes.uv
)
// const material = new THREE.MeshBasicMaterial({ map : colorTexture  ,
//     alphaMap: "" ,
    
// })

const material = new THREE.MeshBasicMaterial({
    //  map : colorTexture  ,
     displacementMap : displacementMap, 
    // fog : true ,
    // lightMap : normalTexture,
    // alphaMap:alphaTexture

})
// const materialPlane = new THREE.MeshBasicMaterial({ map : normalTexture })
const materialPlane = new THREE.MeshNormalMaterial({ map : normalTexture })

const mesh = new THREE.Mesh(geometry, material)
const meshPlane = new THREE.Mesh(plate, materialPlane)

mesh.position.z  = 1
scene.add(mesh)
scene.add(meshPlane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const uvs = plate.attributes.uv.array;

for (let i = 0; i < uvs.length; i += 2) {
    uvs[i] *= 2; // Scale UVs in the X direction
    uvs[i + 1] *= 2; // Scale UVs in the Y direction
}

plate.attributes.uv.needsUpdate = true; // Notify Three.js to update the UVs

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = -0.72
camera.position.z = 20
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
// debug 

const dat = new  gui.GUI()
dat.add(
    camera.position ,
    "x" ,

).min(-100).max(100).step(.01)

dat.add(
    camera.position ,
    "y" ,

).min(-100).max(100).step(.01)

dat.add(
    camera.position ,
    "z" ,

).min(-100).max(100).step(.01)


