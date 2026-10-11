class CStroke {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		this.color = '#ff0';
		this.thickness = 3;
		this.duration = 0.15;

		this.elapsed = 0;
		this.hasEnded = false;
	}

	setStyle(effect) {
		this.duration = effect.duration ?? this.duration;
		this.thickness = effect.thickness ?? this.thickness;
		this.color = effect.color ?? this.color;
	}

	update(dt) {
		if ( this.hasEnded ) return;

		this.elapsed += dt;
		if ( this.elapsed >= this.duration ) {
			this.hasEnded = true;
		}
	}

	draw(ctx) {
		if ( this.hasEnded ) return;

		const alpha = 1 - (this.elapsed / this.duration);

		ctx.save();
		//ctx.globalAlpha = alpha * alpha;
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.thickness * alpha * alpha;

		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();

		ctx.restore();
	}
}

class CStrokeManager {
	constructor() {
		this.strokes = [];
	}

	create(x1, y1, x2, y2, effect) {
		const stroke = new CStroke(x1, y1, x2, y2);
		if ( effect ) {
			stroke.setStyle(effect);
		}

		this.strokes.push(stroke);

		return stroke;
	}

	update(dt) {
		const strokes = this.strokes;

		for (let i = strokes.length - 1; i >= 0; i--) {
			const stroke = strokes[i];
			stroke.update(dt);

			if ( stroke.hasEnded ) {
				strokes.splice(i, 1);
			}
		}
	}

	draw(ctx) {
		const strokes = this.strokes;

		ctx.save();

		for (let i = 0; i < strokes.length; i++) {
			strokes[i].draw(ctx);
		}

		ctx.restore();
	}
}

const StrokeManager = new CStrokeManager();