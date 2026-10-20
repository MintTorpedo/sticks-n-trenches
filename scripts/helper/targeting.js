function targetRandom(baseEntity, entities) {
	return entities[
		Math.floor(entities.length * Math.random())
	];
}

function targetNearest(baseEntity, entities) {
	let nearestDist = Infinity;
	let nearestEntity;

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		const dist = baseEntity.distanceFromFast(entity);
		if (dist > nearestDist) continue;

		nearestDist = dist;
		nearestEntity = entity;
	}

	return nearestEntity;
}

function targetFarthest(baseEntity, entities) {
	let farthestDist = -Infinity;
	let farthestEntity;

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		const dist = baseEntity.distanceFromFast(entity);
		if (dist < farthestDist) continue;

		farthestDist = dist;
		farthestEntity = entity;
	}

	return farthestEntity;
}

function targetFarthestTrench(_, entities) {
	let farthestDist = -Infinity;
	let farthestEntity;

	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		const dist = entity.getDistanceFromTrench() / entity.mobility;
		if (dist < farthestDist) continue;

		farthestDist = dist;
		farthestEntity = entity;
	}

	return farthestEntity;
}