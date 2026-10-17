'use strict';

class CCanvas {
	constructor(manager, elementQuery, noResize) {
		const canvas = document.querySelector(elementQuery);

		this._manager = manager;
		this._event = new CEvent();
		//this._callbacks = [];

		this.canvas = canvas;
		this.graphics = canvas.getContext('2d');
		this.noResize = !!noResize;

		this.width = 0;
		this.height = 0;
		//this.disableAntiAliasing();
	}

	get() {
		return this.canvas;
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}

	resize(x, y) {
		this.canvas.width = x;
		this.canvas.height = y;

		this.width = x;
		this.height = y;

		this._event.emit('resize');
	}

	background(color) {
		this.graphics.save();
		this.graphics.fillStyle = color;
		this.graphics.fillRect(0, 0, this.width, this.height);
		this.graphics.restore();
	}

	clear() {
		this.graphics.restore();
		this.graphics.clearRect(0, 0, this.width, this.height);
		this.graphics.save();
		this.graphics.setTransform(1, 0, 0, 1, 0, 0);
	}

	disableAntiAliasing() {
		this.graphics.webkitImageSmoothingEnabled = false;
		this.graphics.mozImageSmoothingEnabled = false;
		this.graphics.imageSmoothingEnabled = false;
	}

	getBounding() {
		return this.canvas.getBoundingClientRect();
	}
}

const CanvasWrapper = document.querySelector('#canvas-wrapper');
class CCanvasManager {
	constructor() {
		this.children = [];
		this.width = 0;
		this.height = 0;
		this.dimension = 0;

		let resizeTimeout;

		window.addEventListener("resize", () => {
			clearTimeout(resizeTimeout);

			resizeTimeout = setTimeout(() => {
				this.refreshDimension();
			}, 200);
		});
	}
	
	create(name, noResize) {
		const canvas = new CCanvas(this, name, noResize);
		this.children.push(canvas);

		this.refreshDimension();

		return canvas;
	}

	refreshDimension() {
		const length = this.children.length;
		if ( length === 0 ) return;

		const width = CanvasWrapper.offsetWidth;
		const height = CanvasWrapper.offsetHeight;

		this.width = width;
		this.height = height;

		for (let i = 0; i < this.children.length; i++) {
			const canvas = this.children[i];

			if (i == 0) {
				this.dimension = canvas.getBounding();
			}

			if (canvas.noResize) continue;

			canvas.resize(width, height);
		}
	}
}

const CanvasManager = new CCanvasManager();
CanvasManager.refreshDimension();
