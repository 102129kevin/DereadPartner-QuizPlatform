/* global AFRAME, THREE */
AFRAME.registerComponent("alpha-video", {
  init: function () {
    this.materialLoaded = this.materialLoaded.bind(this);
    console.log("init");
    // wait until the material is ready
    this.el.addEventListener("loaded", this.materialLoaded);
  },
  materialLoaded: function () {
    // grab the material
    let material = this.el.getObject3D("mesh").material;
    console.log(material.map.format);

    // swap the format
    material.map.format = THREE.RGBAFormat;
    material.map.needsUpdate = true;
    console.log(material.map);
  },
  remove: function () {
    this.el.removeEventListener("loaded", this.materialLoaded);
  },
});
// clickable
AFRAME.registerComponent("play-on-click", {
  init: function () {
    document.body.addEventListener("click", (e) => {
      const src = this.el.getAttribute("src");
      document.querySelector(src).play();
    });
  },
});

AFRAME.registerComponent("videohandler", {
  init: function () {
    let marker = this.el;

    let vid1 = document.querySelector("#vid-1");
    let vid2 = document.querySelector("#vid-2");
    marker.addEventListener(
      "markerFound",
      function () {
        vid1.play();
        vid2.play();
      }.bind(this)
    );

    marker.addEventListener(
      "markerLost",
      function () {
        vid1.pause();
        vid1.currentTime = 0;

        vid2.pause();
        vid2.currentTime = 0;
      }.bind(this)
    );
  },
});
