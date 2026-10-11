class CCamera {
	constructor() {
		this.x = 21;
		this.maxX = 0;

		this.direction = 0;
		this.canvas = null;
	}

	setCanvas(canvasInstance) {
		this.canvas = canvasInstance;

		const canvas = canvasInstance.get();
		canvas.addEventListener('mousemove', event => {
			const rect = canvas.getBoundingClientRect();

			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			this._mouseMoved(mouseX, mouseY);
		});

		canvasInstance.on('resize', () => {
			this.canvasWidth = this.canvas.width;
		});

		this.maxX = this.canvas.width - 20;
		this.canvasWidth = this.canvas.width;
	}

	_mouseMoved(mouseX, mouseY) {
		if ( mouseY > 100 ) {
			this.direction = 0;
			return
		};
		
		if ( mouseX > this.canvasWidth / 2 ) {
			this.direction = 1;
		} else {
			this.direction = -1;
		}
	}

	update(dt) {
		if (this.direction === 0) return;

		const newX = this.x + this.direction * CONFIG.cameraSpeed * dt;
		if (newX > GameMap.width - this.canvasWidth) return;
		if (newX < 20) return;

		this.x = newX;
		this.maxX = newX + this.canvasWidth;
		GameMap.draw();
	}

	isOutsideView(x) {
		return x > this.maxX || x < this.x;
	}

	boxIsOutsideView(v1, v2) {
		return v1 > this.maxX || v2 < this.x;
	}

	boxIsWithinView(v1, v2) {
		return v1 <= this.maxX || v2 >= this.x;
	}

	translate(ctx) {
		ctx.translate(-this.x, 0);
	}
}

const Camera = new CCamera();