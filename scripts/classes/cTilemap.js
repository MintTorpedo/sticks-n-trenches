class CTilemap {
	constructor() {
		this.segmentGroups = Object.create(null);
		this.segments = [];
		this.layout = [];
		this.isLoaded = false;
		this.fixedWidth = null;

		this.loadedAssets = 0;
		this._event = new CEvent();
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}

	_assetLoaded() {
		this.loadedAssets++;
		this.isLoaded = this.loadedAssets === this.segments.length;

		if ( this.isLoaded ) {
			this._event.emit('loaded');
		}

		//console.log('loaded!', this.isLoaded)
	}

	setFixedWidth(width) {
		this.fixedWidth = width;
	}

	register(id, givenAssets) {
		const assets = [];
		let totalWeight = 0;

		this.isLoaded = false;

		givenAssets.forEach(asset => {
			const image = new CImageAsset(asset.image);
			const assetInfo = {
				'imageAsset': image,
				'width': this.fixedWidth,
				'weight': asset.weight ?? 1,
				// 'index': this.segments.length,
			}

			totalWeight += assetInfo.weight;

			assets.push(assetInfo);
			this.segments.push(assetInfo);

			image.onLoaded(() => {
				assetInfo.width = assetInfo.width ?? image.width;
				this._assetLoaded();
			});
		});

		this.segmentGroups[id] = {
			'totalWeight': totalWeight,
			'variants': assets
		};
	}

	_getRandomSegment(variants, totalWeight) {
		const targetWeight = Math.random() * totalWeight;

		let weight = 0;
		for (let i = 0; i < variants.length; i++) {
			const segment = variants[i];
			
			weight += segment.weight;
			if ( targetWeight >= weight ) continue;

			return segment;
		}
	}

	setAt(id, x) {
		const group = this.segmentGroups[id];
		if ( !group ) return console.log('Failed to find group');

		const segment = this._getRandomSegment(group.variants, group.totalWeight);
		this.layout[x] = segment;
	}

	generateToPixels(minWidth) {
		if ( !this.isLoaded ) {
			this._event.on('loaded', () => this.generateToPixels(minWidth));
			return;
		}

		let totalWeight = 0;
		this.segments.forEach(segment => totalWeight += segment.weight);

		let x = 0;
		let screenX = 0;
		while (screenX < minWidth) {
			const segment = this._getRandomSegment(this.segments, totalWeight);
			this.layout[x] = segment; // segment.index

			x++;
			screenX += segment.width;
		}
	}

	draw(ctx, startX = 0) {
		if ( !this.isLoaded ) return;

		let screenX = startX;
		for (let x = 0; x < this.layout.length; x++) {
			const segment = this.layout[x];

			const imageAsset = segment.imageAsset;
			if ( Camera.boxIsWithinView(screenX, screenX + imageAsset.width) ) {
				ctx.drawImage(imageAsset.image, screenX, -imageAsset.height);
			}

			screenX += segment.width;
		}
	}
}