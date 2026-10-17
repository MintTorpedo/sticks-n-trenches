class CImageAsset {
	constructor(path) {
		const img = new Image();
		img.src = path;

		this.width = null;
		this.height = null;

		this.callbacks = [];
		this.image = img;
		this.isLoaded = false;

		img.onload = () => {
			this._readyImage();
		}

		if (img.complete && img.naturalWidth > 0) {
			this._readyImage();
		}
	}

	get() {
		return this.image;
	}

	getDimension() {
		return [this.image.naturalWidth, this.image.naturalHeight]
	}

	_readyImage() {
		if (this.isLoaded) return;
		this.isLoaded = true;

		const [width, height] = this.getDimension();
		this.width = width;
		this.height = height;

		this.callbacks.forEach(callback => {
			callback();
		});
	}

	onLoaded(callback) {
		if (this.isLoaded) {
			callback();
			return 
		}

		this.callbacks.push(callback);
	}
}