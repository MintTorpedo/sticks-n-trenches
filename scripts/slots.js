const moneyLabel = document.querySelector('#money');

const callbacks = [];
function FireClickEvent(unitName) {
	callbacks.forEach(callback => {
		callback(unitName);
	})
}
const slots = [];
const container = document.querySelector('#inventory');
for (const unitName in UnitStats) {
	const baseStats = UnitStats[unitName];

	const element = document.createElement('div');
	element.value = unitName;

	element.innerHTML = `
		<img src="${baseStats.icon}">
		<span>${baseStats.price}$</span>
	`;

	element.addEventListener('click', () => {
		FireClickEvent(baseStats);
	});

	slots.push({
		element: element,
		stats: baseStats,
	});
}

slots.sort((a, b) => a.stats.price - b.stats.price);
slots.forEach(slot => {
	container.appendChild(slot.element);
})

export function onSlotClicked(callback) {
	callbacks.push(callback);
}

export function onDirectionClicked(callback) {
	document.querySelectorAll('.btn-direction').forEach(btn => {
		btn.addEventListener('click', () => {
			const direction = parseInt( btn.getAttribute('value') );
			callback(direction);
		});
	});
}

export function updateMoneyLabel(value) {
	moneyLabel.innerText = value + '$';

	slots.forEach(slot => {
		const element = slot.element;
		element.classList.toggle('expensive', slot.stats.price > value);
	});
}

export function onDifficulty(callback) {
	const dropdown = document.querySelector('#difficulty');
	dropdown.addEventListener('change', () => {
		callback( dropdown.value );
	});

	callback( dropdown.value );
}