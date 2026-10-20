const moneyLabel = document.querySelector('#money');
const levelDropdown = document.querySelector('#levels')
const btnContinue = document.querySelector('#level-continue');

LEVELS.forEach((levelData, levelId) => {
	const option = document.createElement('option');
	option.value = levelId;
	option.innerText = (levelId + 1) + '. ' + levelData.title;

	levelDropdown.appendChild(option);
});

levelDropdown.value = "5";

const callbacks = [];
function FireClickEvent(unitName) {
	callbacks.forEach(callback => {
		callback(unitName);
	})
}

let slots = [];

export function onSlotClicked(callback) {
	callbacks.push(callback);
}

export function generateSlots(loadout) {
	slots = [];

	const container = document.querySelector('#inventory');

	for (const unitName in UNIT_STATS) {
		const baseStats = UNIT_STATS[unitName];
		if ( baseStats.class === ENUM.class.building ) continue;

		const element = document.createElement('div');
		element.value = unitName;

		const isOwned = !!loadout.get(baseStats.name);
		if ( !isOwned ) {
			element.classList.add('locked');
		}

		element.innerHTML = `
			<img src="${baseStats.icon}">
			<span>${baseStats.price}$</span>
			<div class="expensive overlay"></div>
			<div class="cooldown overlay" style="animation-duration: ${baseStats.cooldown}s" ></div>
			<img src="media/border.png" class="border ${isOwned ? '' : 'hidden'}">
			<img src="media/border-locked.png" class="border ${isOwned ? 'hidden' : ''}">

			<div class="tooltip">${baseStats.name}</div>
		`;

		element.addEventListener('click', () => {
			FireClickEvent(baseStats);
		});

		slots.push({
			element: element,
			stats: baseStats,
			isOwned: isOwned,
		});
	}

	slots.sort((a, b) => {
		if ( a.isOwned !== b.isOwned ) return a.isOwned ? -1 : 1;
		return a.stats.price - b.stats.price;
	});

	let ownedDebounce = true;

	container.innerHTML = '';
	slots.forEach(slot => {
		if ( ownedDebounce && !slot.isOwned ) {
			slot.element.setAttribute('style', 'margin-left: 1rem');
			ownedDebounce = false;
		}
		container.appendChild(slot.element);
	});
}

export function slotApplyCooldown(unitName) {
	const targetSlot = slots.find(slot => slot.stats.name === unitName);
	if ( !targetSlot ) return;

	const element = targetSlot.element.querySelector('.cooldown');
	element.getAnimations().forEach(a => { a.cancel(); a.play(); });
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
		if ( !slot.isOwned ) return;

		const element = slot.element;
		element.classList.toggle('expensive', slot.stats.price > value);
	});
}

export function onDifficulty(callback) {
	const dropdown = document.querySelector('#difficulty');
	const fire = () => callback(
		parseInt(dropdown.value)
	);

	dropdown.addEventListener('change', fire);
	fire();
}

export function onLevel(callback) {
	const fire = () => callback(
		parseInt(levelDropdown.value)
	);

	btnContinue.addEventListener('click', () => {
		levelDropdown.value++;
		fire();
	});

	levelDropdown.addEventListener('change', fire);
	fire();
}

export function showWinScreen(isVisible) {
	const winscreen = document.querySelector('#winscreen');
	winscreen.classList.toggle('hidden', !isVisible);
}

export function onUserInteracted(callback) {
	for (const type of ['pointerdown', 'keydown']) {
		window.addEventListener(type, callback, { once: true });
	}
}