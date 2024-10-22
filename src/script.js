import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as gui  from "dat.gui"
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// loaderManager 
const LoaderManger = new THREE.LoadingManager()
const CubeEnviromentLoader = new THREE.CubeTextureLoader(LoaderManger)


// textures Loader
const Loader  = new THREE.TextureLoader(LoaderManger)
const alpha  = Loader.load('/textures/door/alpha.jpg')
const ambientOcclusion  = Loader.load('/textures/door/ambientOcclusion.jpg')
const color  = Loader.load('/textures/door/color.jpg')
const height  = Loader.load('/textures/door/height.jpg')
const metalness  = Loader.load('/textures/door/metalness.jpg')
const normal  = Loader.load('/textures/door/normal.jpg')
const roughness  = Loader.load('/textures/door/roughness.jpg')
const gradients  = Loader.load('/textures/gradients/5.jpg')
const matcaps  = Loader.load('/textures/matcaps/3.png')



const enviromentMapTextureLoader = CubeEnviromentLoader.load([
'/textures/environmentMaps/0/px.jpg',    
'/textures/environmentMaps/0/nx.jpg',    
'/textures/environmentMaps/0/py.jpg',    
'/textures/environmentMaps/0/ny.jpg',    
'/textures/environmentMaps/0/pz.jpg',    
'/textures/environmentMaps/0/nz.jpg',    
])



gradients.magFilter = THREE.NearestFilter
gradients.generateMipmaps = false
// test all loader 
LoaderManger.onError=(url)=>{
    console.log('err ' , url)
}


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



// light 
const AmiontLight = new THREE.AmbientLight( 0xffffff , .5)
scene.add(AmiontLight)
const pointLight = new THREE.PointLight( "#fff" , .5)
pointLight.position.x = 2 
pointLight.position.y = 3 
pointLight.position.z = 4 

scene.add(AmiontLight)
scene.add(pointLight)





/**
 * Camera
 */
// Base camera




const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 3
scene.add(camera)



const group = new THREE.Group()
// const  spharemetrial = new THREE.MeshBasicMaterial()
// const  spharemetrial = new THREE.MeshMatcapMaterial()
// const  spharemetrial = new THREE.MeshLambertMaterial()
// const  spharemetrial = new THREE.MeshPhongMaterial()
// spharemetrial.shininess =100
// spharemetrial.specular = new THREE.Color(
//     0xf00000
// )
// toon like carton
// const  spharemetrial = new THREE.MeshToonMaterial()
// spharemetrial.gradientMap = gradients
// spharemetrial.matcap = matcaps
// spharemetrial.map = color

const envMatrial = new THREE.MeshStandardMaterial()
envMatrial.envMap = enviromentMapTextureLoader
envMatrial.envMap = enviromentMapTextureLoader;
envMatrial.metalness = 1; // Max metalness for reflections
envMatrial.roughness = 0; // Min roughness for clear reflections
const sphare  = new THREE.Mesh(
    new THREE.SphereGeometry(.5 ,32 ,32), 
    envMatrial
)


sphare.position.x = -1.2
const  ToresMatrialStandard= new THREE.MeshStandardMaterial()

ToresMatrialStandard.map = color
ToresMatrialStandard.aoMap = ambientOcclusion
ToresMatrialStandard.roughness = .6
ToresMatrialStandard.metalness= .6
ToresMatrialStandard.aoMapIntensity = 1.82
ToresMatrialStandard.displacementMap = height
ToresMatrialStandard.displacementScale = 0.05
ToresMatrialStandard.alphaMap = alpha
ToresMatrialStandard.transparent = true
ToresMatrialStandard.metalnessMap = metalness
ToresMatrialStandard.roughnessMap = roughness
ToresMatrialStandard.normalMap = normal
// const  planeMatrial = new THREE.MeshBasicMaterial()
// planeMatrial.alphaMap = alpha
// planeMatrial.map =color
// planeMatrial.transparent =true

// normal Mat
// const  planeMatrial = new THREE.MeshNormalMaterial()
// planeMatrial.side = THREE.DoubleSide

const Plane  = new THREE.Mesh(
    new THREE.PlaneGeometry( 1,1 ,100  ,100), 
    ToresMatrialStandard
)

// const  ToresMatrial = new THREE.MeshBasicMaterial()
// opacity + trasparent 
// ToresMatrial.opacity =.5
// ToresMatrial.transparent =true 

const  ToresMatrialNormal = new THREE.MeshStandardMaterial()
ToresMatrialNormal.envMap = enviromentMapTextureLoader
// ToresMatrialNormal.normalMap = normal
// ToresMatrialNormal.flatShading = true



const Tores  = new THREE.Mesh(
    new THREE.TorusGeometry( .3 , .2  ,100 ,100), 
    ToresMatrialNormal
)


Plane.geometry.setAttribute(
    'uv2' ,
    new THREE.BufferAttribute(
        Plane.geometry.attributes.uv.array , 2 
    )
)






Tores.position.x =1.2
Plane.position.x = 0 
group.add(
    sphare , 
    Plane,
    Tores
)

scene.add(group)
camera.lookAt(Plane)

camera.updateProjectionMatrix()
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

    // update rotation 
    sphare.rotation.y = .2 * elapsedTime
    // Plane.rotation.y = .3* elapsedTime
    // Tores.rotation.y = .4* elapsedTime
    
    
    
    // Update controls
    controls.update()



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// debug 


const dat = new gui.GUI()

dat.add(
    ToresMatrialStandard, 
    "metalness" 
).min(0)
.max(1)
.step(.01)
dat.add(
    ToresMatrialStandard, 
    "roughness" 
).min(0)
.max(1)
.step(.01)
dat.add(
    ToresMatrialStandard, 
    "aoMapIntensity" 
).min(0)
.max(10)
.step(.01)
dat.add(
    ToresMatrialStandard, 
    "displacementScale" 
).min(0)
.max(10)
.step(.01)
dat.add(
    ToresMatrialStandard.normalScale, 
    "x" 
).min(0)
.max(100)
.step(.01)
dat.add(
    ToresMatrialStandard.normalScale, 
    "y" 
).min(0)
.max(100)
.step(.01)

console.log(Tores)


// tube — Radius of the tube. Expects a Float. Default 0.4.

// @param radialSegments — Expects a Integer.Default is 12.

// @param tubularSegments — Expects a Integer. Default 48.

// @param arc — Central angle. Expects a Float. Default Math.PI * 2


