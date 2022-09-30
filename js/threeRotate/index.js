import { Vector3 } from 'three';

export default class FloatingControls {
    constructor(target, opt) {
        let options = opt != undefined ? opt : {};
        this.target = target;
        this.windowInnerWidth = null;
        this.windowInnerHeight = null;
        this.reverse = typeof options.reverse == 'boolean' ? options.reverse : false;
        this.reverseSign = this.reverse ? -1 : 1;
        this.amp = options.amp > 1 ? options.amp : 1;
        this.lerpFactor = options.lerpFactor != undefined ? options.lerpFactor : .1;
        this.getScreenSize();
        window.addEventListener('resize', this.getScreenSize.bind(this));

        this.mousePosition = { x: 0, y: 0 };
        this.isMobile = this.isMobileDevice();
        if (this.isMobile) {
            window.addEventListener('touchmove', this.updateMousePosition.bind(this));
            console.log("this is mobile");
        }
        else {
            window.addEventListener('mousemove', this.updateMousePosition.bind(this));
            console.log("this is not mobile");
        }
    }

    getScreenSize() {
        this.windowInnerWidth = window.innerWidth;
        this.windowInnerHeight = window.innerHeight;
    }

    normalizeMousePosition(ev) {
        let normalizedX, normalizedY;

        // Desktop
        if (ev.clientX != undefined) {
            normalizedX = -2 * (.5 - ev.clientX / this.windowInnerWidth);
            normalizedY = 2 * (.5 - ev.clientY / this.windowInnerHeight);
        }
        // Mobile 
        else {
            normalizedX = -2 * (.5 - ev.touches[0].clientX / this.windowInnerWidth);
            normalizedY = 2 * (.5 - ev.touches[0].clientY / this.windowInnerHeight);
        }

        return {
            x: normalizedX,
            y: normalizedY
        }
    }

    updateMousePosition(ev) {
        this.mousePosition = this.normalizeMousePosition(ev);
    }

    update() {
        let newX = lerp(this.target.rotation.y, this.mousePosition.x * this.amp * this.reverseSign, this.lerpFactor);
        let newY = lerp(this.target.rotation.x, -1 * this.mousePosition.y * this.amp * this.reverseSign, this.lerpFactor);

        this.target.rotation.y = newX;
        this.target.rotation.x = newY;
    }

    isMobileDevice() {
        const mobileDevices = ["Android", "webOS", "iPhone", "iPhone", "iPod", "BlackBerry", "Windows Phone"];
        let isMobileDevice = false;
        for (let i = 0; i < mobileDevices.length; i++) {
            if (navigator.userAgent.match(mobileDevices[i])) {
                isMobileDevice = true;
            }
        }

        return isMobileDevice;
    }
};

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}