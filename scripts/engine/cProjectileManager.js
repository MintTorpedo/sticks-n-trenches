function lerp(v1, v2, a) {
	return v1 * (1 - a) + v2 * a;
}

function distance(x0, y0, x1, y1) {
	return Math.hypot(x0 - x1, y0 - y1);
}

//const shellAsset = new CImageAsset('media/projectiles/shell.png');

class CProjectile {
	constructor(x0, y0, x1, y1) {
		this.x = x0;
		this.y = y0;

		this.px = x0;
		this.py = y0;

		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;

		this.elapsed = 0;

		this.impact = null;
		this.asset = null;
		this.speed = 500;
		this.arcHeight = 0.15;

		this.duration = 0;
		this._event = new CEvent();
		this.hasEnded = false;

		this._setupArc();
		this._updateDuration();
	}

	setImage(path) {
		this.asset = new CImageAsset(path);
	}

	setImpact(impactData) {
		this.impact = impactData;
	}

	setArcHeight(ratio) {
		if ( !ratio ) return;
		this.arcHeight *= ratio;

		this._setupArc();
		this._updateDuration();
	}

	setSpeed(ratio) {
		if ( !ratio ) return;
		this.speed *= ratio;
		this._updateDuration();
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}

	_setupArc() {
		const dx = this.x1 - this.x0;
		const dy = this.y1 - this.y0;

		const dist = Math.hypot(dx, dy);
		const halfDist = dist / 2;

		let height = dist * this.arcHeight;

		this.radius = (halfDist * halfDist + height * height) / (2 * height);

		const mx = (this.x0 + this.x1) / 2;
		const my = (this.y0 + this.y1) / 2;

		let nx = -dy / dist;
		let ny = dx / dist;

		if (ny > 0) {
			nx = -nx;
			ny = -ny;
		}

		const centerDistance = this.radius - height;

		this.cx = mx - nx * centerDistance;
		this.cy = my - ny * centerDistance;

		this.startAngle = Math.atan2(
			this.y0 - this.cy, 
			this.x0 - this.cx
		);

		this.endAngle = Math.atan2(
			this.y1 - this.cy,
			this.x1 - this.cx
		);

		let delta = this.endAngle - this.startAngle;

		if (delta > Math.PI) {
			delta -= Math.PI * 2;

		} else if (delta < -Math.PI) {
			delta += Math.PI * 2;
		}

		this.angleDelta = delta;
	}

	_updateDuration() {
		const arcLength = Math.abs(this.radius * this.angleDelta);

		this.duration = arcLength / this.speed;
	}

	update(dt) {
		this.elapsed += dt;

		let alpha = this.elapsed / this.duration;
		if ( alpha >= 1 ) {
			alpha = 1;
			this.hasEnded = true;
			this._event.emit('completed');
		}

		const angle = this.startAngle + this.angleDelta * alpha;
		this.angle = angle;

		this.x = this.cx + Math.cos(angle) * this.radius;
		this.y = this.cy + Math.sin(angle) * this.radius;
	}

	draw(ctx) {
		if ( Camera.isOutsideView(this.x) ) return;

		const asset = this.asset;
		if ( !asset.isLoaded ) return;

		const spin = this.angleDelta >= 0 ? 1 : -1;
		const rotation = this.angle + spin * (Math.PI / 2);

		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(rotation);
		ctx.drawImage(
			asset.image,
			-asset.width / 2,
			-asset.height / 2
		);

		ctx.restore();
	}
}

class CProjectileManager {
	constructor(gameSession) {
		this._game = gameSession;
		this._vfx = gameSession.vfx;

		this.projectiles = [];
	}

	create(x0, y0, x1, y1) {
		const projectile = new CProjectile(x0, y0, x1, y1);
		this.projectiles.push(projectile);

		return projectile;
	}

	update(dt) {
		for (let i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].update(dt);
		}
	}

	draw(ctx) {
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			const projectile = this.projectiles[i]
			projectile.draw(ctx);

			if ( !projectile.hasEnded ) continue;

			this.projectiles.splice(i, 1);

			const impact = projectile.impact;
			this._vfx.create(projectile.x, projectile.y, impact.sprite);

			SoundPlayer.play(impact.sound, impact.volume);
		}
	}
}

//const ProjectileManager = new CProjectileManager();