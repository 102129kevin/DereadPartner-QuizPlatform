import {
    Object3D,
    PlaneGeometry,
    Scene,
    TextureLoader,
    VideoTexture,
    Mesh,
    MeshStandardMaterial,
    Vector3,
    MathUtils
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Utils } from "../utils/Utils";
import { ARnftFilter } from "../filters/ARnftFilter";
import SceneRendererTJS from "../SceneRendererTJS";
import { chdir } from "process";

/**
 * Interface to define the ARVideo object used in addVideo.
 * @param play play a video.
 */
interface ARvideo {
    play: () => void;
}

/**
 * Interface to define an Entity.
 * @param name the name of the Entity
 */
interface Entity {
    name: string;
}

interface RotateVector {
    x: number;
    y: number;
    z: number;
}

/**
 * Interface to define the PlaneGeometry used in the addImage and addVideo functions.
 * @param w  width of the PlaneGeometry.
 * @param h height of the PlaneGeometry.
 * @param ws width number of segments of the PlaneGeometry.
 * @param hs height number of segments of the PlaneGeometry.
 */
interface IPlaneConfig {
    w: number;
    h: number;
    ws: number;
    hs: number;
}

/**
 * This class is responsable to attach Threejs object to the rendering root and pass matrix data to it.
 */
export default class NFTaddTJS {
    private entities: Entity[] = [];
    private names: Array<string>;
    private scene: Scene;
    private target: EventTarget;
    private uuid: string;
    private _filter: ARnftFilter;
    private _oef: boolean;
    //private htmlEl: Array<HTMLElement>;

    /**
     * The NFTaddTJS constuctor, you need to pass the uuid from the ARnft instance.
     * @param uuid the uuid.
     */
    constructor(uuid: string) {
        this.scene = SceneRendererTJS.getGlobalScene();
        this.target = window || global;
        this.uuid = uuid;
        this.names = [];
        this._filter = new ARnftFilter();
        this._oef = false;
    }

    /**
     * The add function will add a mesh to the Renderer root. You need to associate a name of the Entity.
     * @param mesh The mesh to add
     * @param name the name of the Entity associated.
     * @param objVisibility set true or false if the mesh wll stay visible or not after tracking.
     */
    public add(mesh: Object3D, name: string, objVisibility: boolean) {
        this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
            var msg = ev.detail;
            mesh.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
            mesh.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
        });
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        root.add(mesh);
        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = true;
            mesh.visible = true;
            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });
        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            mesh.visible = objVisibility;
        });
        this.names.push(name);
        this.entities.push({ name });
    }

    /**
     * The addModel function will add a model to the Renderer root. You need to associate a name of the Entity.
     * @param url url of the model.
     * @param name the name of the Entity associated.
     * @param scale scale of the model.
     * @param objVisibility set true or false if the mesh wll stay visible or not after tracking.
     */
    public addModel(url: string, name: string, scale: number, objVisibility: boolean) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        let model: any;
        /* Load Model */
        const threeGLTFLoader = new GLTFLoader();
        threeGLTFLoader.load(url, (gltf) => {
            model = gltf.scene;
            model.scale.set(scale, scale, scale);
            model.rotation.x = Math.PI / 2;
            this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
                var msg = ev.detail;
                model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
                model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
            });
            root.add(model);
        });
        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = true;
            model.visible = true;
            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });
        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            model.visible = objVisibility;
        });
        this.names.push(name);
    }

    public addInteract(url: string, name: string, scale: number, objVisibility: boolean, rotationVector: RotateVector, htmlEl: NodeListOf<Element>) {
        const root = new Object3D();
        console.log(htmlEl.length);
        root.name = "root-" + name;
        this.scene.add(root);

        let model: any;
        /* Load Model */

        async function gltfTest() {
            // return new Promise((resolve, reject) => {
            const threeGLTFLoader = new GLTFLoader();
            await threeGLTFLoader.load(url, (gltf) => {
                model = gltf.scene;
                model.scale.set(scale, scale, scale);
                model.rotation.x = MathUtils.degToRad(rotationVector.x);
                model.rotation.y = MathUtils.degToRad(rotationVector.y);
                model.rotation.z = MathUtils.degToRad(rotationVector.z);

                root.add(model);
                // resolve("gltfdonessssss");
                return "gltfdonessssss";
            });
            // })
        }

        gltfTest().then((res) => {
            console.log(res);

            this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
                var msg = ev.detail;
                model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
                model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
                console.log("insideTS : x=" + model.position.x + " y=" + model.position.y + " z=" + model.position.z);
            });
            this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
                root.visible = true;
                model.visible = true;
                htmlEl.forEach(function (item) {
                    item.classList.remove("nftLost");
                    item.classList.add("nftFound");
                });

                if (this._oef === true) {
                    let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                    filter = this._filter.update(ev.detail.matrixGL_RH);
                    root.position.setX(filter[0].x);
                    root.position.setY(filter[0].y);
                    root.position.setZ(filter[0].z);
                    root.rotation.setFromVector3(filter[1]);
                    root.scale.setX(filter[2].x);
                    root.scale.setY(filter[2].y);
                    root.scale.setZ(filter[2].z);
                } else {
                    root.matrixAutoUpdate = false;
                    const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                    Utils.setMatrix(root.matrix, matrix);
                }
            });
            this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
                root.visible = objVisibility;
                model.visible = objVisibility;
                htmlEl.forEach(function (item) {
                    item.classList.remove("nftFound");
                    item.classList.add("nftLost");
                });
            });
            this.names.push(name);

            console.log("dead AR...");
            // console.log(model);
            return model;
        })

    }

    public addInteract2(model: Object3D, name: string, scale: number, objVisibility: boolean) {
        const root = new Object3D();

        root.name = "root-" + name;
        this.scene.add(root);
        model.scale.set(scale, scale, scale);
        model.rotation.x = Math.PI / 2;

        this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
            var msg = ev.detail;
            model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
            model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
            console.log("insideTS : x=" + model.position.x + " y=" + model.position.y + " z=" + model.position.z);
        });
        root.add(model);

        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = true;
            model.visible = true;
            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });

        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            model.visible = objVisibility;
        });
        this.names.push(name);

        return model;
    }

    public addFBX(url: string, name: string, callback: (object: any) => {}, objVisibility: boolean) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        let model: any;
        /* Load Model */
        const fbxLoader = new FBXLoader();

        function fbxMaker() {
            return new Promise((resolve, reject) => {
                fbxLoader.load(url, (obj) => {
                    // console.log("something in the ts files");
                    // console.log(obj.children[0]);

                    model = obj;
                    // model = obj.children[0];
                    callback(model);
                    root.add(model);
                    resolve("fbxMaker done!");
                });
            });
        }

        fbxMaker().then((done) => {
            console.log(done);

            this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
                var msg = ev.detail;
                model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
                model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
                //model.position.z = 20;
            });

            this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
                root.visible = true;
                model.visible = true;
                if (this._oef === true) {
                    let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                    filter = this._filter.update(ev.detail.matrixGL_RH);
                    root.position.setX(filter[0].x);
                    root.position.setY(filter[0].y);
                    root.position.setZ(filter[0].z);
                    root.rotation.setFromVector3(filter[1]);
                    root.scale.setX(filter[2].x);
                    root.scale.setY(filter[2].y);
                    root.scale.setZ(filter[2].z);
                } else {
                    root.matrixAutoUpdate = false;
                    const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                    Utils.setMatrix(root.matrix, matrix);
                }
            });
            this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
                root.visible = objVisibility;
                model.visible = objVisibility;
            });
            this.names.push(name);
        })
    }

    /**
     * The addModelWithCallback function will add a model to the Renderer root. You need to associate a name of the Entity.
     * You can modify the model rotation, scale and other properties with the callback.
     * @param url url of the model.
     * @param name the name of the Entity associated.
     * @param callback modify the model in the callback.
     * @param objVisibility set true or false if the mesh wll stay visible or not after tracking.
     */
    public addModelWithCallback(url: string, name: string, callback: (gltf: any) => {}, objVisibility: boolean) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        let model: any;
        /* Load Model */
        const threeGLTFLoader = new GLTFLoader();

        threeGLTFLoader.load(url, (gltf) => {
            model = gltf.scene;

            console.log("load's model visible:", model.visible);

            this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
                var msg = ev.detail;
                model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
                model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
            });
            callback(gltf);
            root.add(model);

            console.log(model);
        });
        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = true;
            model.visible = true;
            console.log("getMatrixGL_RH's model visible:", model.visible);
            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });
        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            model.visible = objVisibility;
            console.log("nftTrackingLost's model visible:", model.visible);
        });
        this.names.push(name);
    }

    public addModelWithCallback2(url: string, name: string, callback: (gltf: any) => {}, objVisibility: boolean) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        let model: any;
        /* Load Model */
        const threeGLTFLoader = new GLTFLoader();

        function modelMaker() {
            return new Promise((resolve, reject) => {
                threeGLTFLoader.load(url, (gltf) => {
                    model = gltf.scene;
                    //console.log("load's model visible:", model.visible);
                    callback(gltf);
                    root.add(model);
                    //console.log(model);
                    resolve("modelMaker done!");
                });
            });
        }

        modelMaker().then((done) => {
            console.log(done);

            this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
                var msg = ev.detail;
                model.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
                model.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
            });

            this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
                root.visible = true;
                model.visible = true;
                //console.log("getMatrixGL_RH's model visible:", model.visible);
                if (this._oef === true) {
                    let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                    filter = this._filter.update(ev.detail.matrixGL_RH);
                    root.position.setX(filter[0].x);
                    root.position.setY(filter[0].y);
                    root.position.setZ(filter[0].z);
                    root.rotation.setFromVector3(filter[1]);
                    root.scale.setX(filter[2].x);
                    root.scale.setY(filter[2].y);
                    root.scale.setZ(filter[2].z);
                } else {
                    root.matrixAutoUpdate = false;
                    const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                    Utils.setMatrix(root.matrix, matrix);
                }
            });
            this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
                root.visible = objVisibility;
                model.visible = objVisibility;
                //console.log("nftTrackingLost's model visible:", model.visible);
            });
            this.names.push(name);
        })
    }

    /**
     * The addImage function will add an image to the Renderer root. You need to associate a name of the Entity.
     * @param imageUrl url of the image.
     * @param name the name of the Entity associated.
     * @param color color of the background plane.
     * @param scale scale of the plane.
     * @param configs see IPlaneConfig.
     * @param objVisibility set true or false if the mesh wll stay visible or not after tracking.
     */
    public addImage(
        imageUrl: string,
        name: string,
        color: string,
        scale: number,
        configs: IPlaneConfig,
        objVisibility: boolean
    ) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        const planeGeom = new PlaneGeometry(configs.w, configs.h, configs.ws, configs.hs);
        const texture = new TextureLoader().load(imageUrl);
        const material = new MeshStandardMaterial({ color: color, map: texture });
        const plane = new Mesh(planeGeom, material);
        plane.scale.set(scale, scale, scale);
        this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
            var msg = ev.detail;
            plane.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
            plane.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
        });
        root.add(plane);
        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = true;
            plane.visible = true;
            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });
        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            plane.visible = objVisibility;
        });
        this.names.push(name);
    }

    /**
     * The addVideo function will add a video to the Renderer root. You need to associate a name of the Entity.
     * @param id the id of the html video element.
     * @param name the name of the Entity associated.
     * @param scale scale of the plane.
     * @param configs see IPlaneConfig.
     * @param objVisibility set true or false if the mesh wll stay visible or not after tracking.
     */
    public addVideo(id: string, name: string, scale: number, configs: IPlaneConfig, objVisibility: boolean) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        const ARVideo: HTMLVideoElement = document.getElementById(id) as HTMLVideoElement;
        const texture = new VideoTexture(ARVideo as HTMLVideoElement);
        const mat = new MeshStandardMaterial({ color: 0xbbbbff, map: texture });
        const planeGeom = new PlaneGeometry(configs.w, configs.h, configs.ws, configs.hs);
        const plane = new Mesh(planeGeom, mat);
        plane.scale.set(scale, scale, scale);
        this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
            var msg = ev.detail;
            plane.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
            plane.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
        });
        root.add(plane);
        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            ARVideo.play();
            root.visible = true;
            plane.visible = true;
            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });
        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            plane.visible = objVisibility;
            ARVideo.pause();
        });
        this.names.push(name);
    }

    public addVideo2(id: string, name: string, scale: number, configs: IPlaneConfig, objVisibility: boolean, htmlEl: NodeListOf<Element>) {
        const root = new Object3D();
        root.name = "root-" + name;
        this.scene.add(root);
        const ARVideo: HTMLVideoElement = document.getElementById(id) as HTMLVideoElement;
        const texture = new VideoTexture(ARVideo as HTMLVideoElement);
        const mat = new MeshStandardMaterial({ color: 0xbbbbff, map: texture });
        const planeGeom = new PlaneGeometry(configs.w, configs.h, configs.ws, configs.hs);
        const plane = new Mesh(planeGeom, mat);
        plane.scale.set(scale, scale, scale);
        this.target.addEventListener("getNFTData-" + this.uuid + "-" + name, (ev: any) => {
            var msg = ev.detail;
            plane.position.y = ((msg.height / msg.dpi) * 2.54 * 10) / 2.0;
            plane.position.x = ((msg.width / msg.dpi) * 2.54 * 10) / 2.0;
        });
        root.add(plane);
        this.target.addEventListener("getMatrixGL_RH-" + this.uuid + "-" + name, (ev: any) => {
            ARVideo.play();
            root.visible = true;
            plane.visible = true;

            htmlEl.forEach(function (item) {
                item.classList.remove("nftLost");
                item.classList.add("nftFound");
            });

            if (this._oef === true) {
                let filter = [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
                filter = this._filter.update(ev.detail.matrixGL_RH);
                root.position.setX(filter[0].x);
                root.position.setY(filter[0].y);
                root.position.setZ(filter[0].z);
                root.rotation.setFromVector3(filter[1]);
                root.scale.setX(filter[2].x);
                root.scale.setY(filter[2].y);
                root.scale.setZ(filter[2].z);
            } else {
                root.matrixAutoUpdate = false;
                const matrix = Utils.interpolate(ev.detail.matrixGL_RH);
                Utils.setMatrix(root.matrix, matrix);
            }
        });
        this.target.addEventListener("nftTrackingLost-" + this.uuid + "-" + name, (ev: any) => {
            root.visible = objVisibility;
            plane.visible = objVisibility;
            ARVideo.pause();

            htmlEl.forEach(function (item) {
                item.classList.remove("nftFound");
                item.classList.add("nftLost");
            });
        });
        this.names.push(name);
    }

    /**
     * You can get the names of the entities used in your project.
     * @returns the names of the entities
     */
    public getNames() {
        return this.names;
    }

    /**
     * Enable or not the OneEuroFilter routine.
     */
    public set oef(enable: boolean) {
        this._oef = enable;
    }

    /**
     * Check if OneEuroFilter is enabled or not.
     * @returns (boolean) true or false
     */
    public get oef() {
        return this._oef;
    }
}
