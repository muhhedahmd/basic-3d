import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug




const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcap = textureLoader.load('/textures/matcaps/5.png')
const matcap2 = textureLoader.load('/textures/matcaps/8.png')
//font
const fontLoader = new FontLoader()
// axis helper 
const axisHelper = new THREE.AxesHelper(5)
// grid helper
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(
    axisHelper,
    gridHelper
)
fontLoader.load('/fonts/helvetiker_regular.typeface.json' , (font)=>{
const textGeomtery = new TextGeometry('hello' , {
    font ,
    size: 1,
    height: 0.2, // depth
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness :0.03,
    bevelSize : 0.001,
    bevelOffset : 0.0,
    bevelSegments : 10 ,
})
// gui.add(
//     textGeomtery ,
//     'size',
//     0.1 ,
//     1 ,
//     0.01
    
// )

textGeomtery.computeBoundingBox()
textGeomtery.translate(
    // .02 bevelsize
    // 0.03 bevelThickness
    -(textGeomtery.boundingBox.max.x  - 0.02 )/ 2 ,
    -(textGeomtery.boundingBox.max.y - 0.02) / 2 ,
    -(textGeomtery.boundingBox.max.z - 0.03)/ 2 ,
)

textGeomtery.center()

const text = new THREE.Mesh(textGeomtery , new THREE.MeshMatcapMaterial({
    // wireframe:true,
    matcap :matcap2,
    // color: 0xff0000
}))

// text.position.x =-oneRondem
scene.add(text)

})

/**
 * Object
 */
console.time("donet")
// fix performance
const donet = new THREE.TorusGeometry(0.3 , .2 ,20 , 45)
const donetMatrial = new THREE.MeshMatcapMaterial({
    matcap : matcap,
    // color: 0xff0000
    })
    for (let i = 0; i < 100; i++) {
    const donutmesh = new THREE.Mesh(donet , donetMatrial)
    // const donet = new THREE.TorusGeometry(0.3 , .2 ,20 , 45)
    // const donutmesh = new THREE.Mesh(donet , new THREE.MeshMatcapMaterial({
    //     matcap : matcap,
    //     // color: 0xff0000
    //     }))

        donutmesh.position.x = (Math.random() *  10)- 5
        donutmesh.position.y = (Math.random() * 10) - 5
        donutmesh.position.z = (Math.random() * 5 )- 2
        donutmesh.rotation.x = Math.random() * Math.PI
        donutmesh.rotation.y = Math.random() * Math.PI
        const oneRondem = Math.random()
        if (oneRondem > 0.5) {
            donutmesh.scale.x = oneRondem
            donutmesh.scale.y = oneRondem
            donutmesh.scale.z = oneRondem
            }
        scene.add(
            donutmesh
        )
    
}
console.timeEnd("donet")

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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