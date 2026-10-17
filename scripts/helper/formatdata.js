function FillMissingProperties(origin, replacement) {
	for (const propName in replacement) {
		if ( origin[propName] !== undefined ) continue;

		origin[propName] = replacement[propName];
	}
}