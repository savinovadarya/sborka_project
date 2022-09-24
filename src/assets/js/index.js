import { gsap } from 'gsap';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

global.gsap = gsap;

gsap.defaults({
	overwrite: 'auto',
});

class ProjectApp {
	constructor() {
		// this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}

// counter interaction
const counter = document.querySelector('.btn__counter');

function changeCounter() {
	const purchaseValues = document.querySelectorAll('.quantity__count');
	const counterArray = [];
	purchaseValues.forEach(item => counterArray.push(parseInt(item.textContent, 10)));
	const counterSum = counterArray.reduce((acc, item) => acc + item);
	counter.textContent = counterSum;
}

// total price change
const tax = document.querySelector('.tax-value');
const shipping = document.querySelector('.shipping-value');

function calculateTotal() {
	const itemPrices = document.querySelectorAll('.quantity__price');
	const subtotal = document.querySelector('.subtotal-value');
	const total = document.querySelector('.total__value');
	const subtotalArray = [];
	itemPrices.forEach(item => {
		subtotalArray.push(parseInt(item.textContent.slice(2), 10));
	});
	const subtotalSum = subtotalArray.reduce((acc, item) => acc + item);
	subtotal.textContent = '$\u00a0' + subtotalSum.toLocaleString('ru');

	const result = +subtotalSum + +tax.textContent.slice(2) + +shipping.textContent.slice(2);
	total.textContent = '$\u00a0' + result.toLocaleString('ru');
}

// purchase quantity change
const minusBtns = document.querySelectorAll('.quantity__minus');
const plusBtns = document.querySelectorAll('.quantity__plus');
const defaultPrice = 525; // workaround instead of DB call

const changeQuantityValue = e => {
	if (e.target.nextElementSibling.textContent > 0) {
		if (e.target.classList.value === 'quantity__minus') {
			e.target.nextElementSibling.textContent--;
			changeCounter();
			e.target.nextElementSibling.nextElementSibling.nextElementSibling.textContent =
				'$\u00a0' + defaultPrice * +e.target.nextElementSibling.textContent;
			calculateTotal();
		}
	}
	if (e.target.classList.value === 'quantity__plus') {
		e.target.previousElementSibling.textContent++;
		changeCounter();
		e.target.nextElementSibling.textContent =
			'$\u00a0' + defaultPrice * +e.target.previousElementSibling.textContent;
		calculateTotal();
	}
};

minusBtns.forEach(item => {
	item.addEventListener('click', e => {
		changeQuantityValue(e);
	});
});

plusBtns.forEach(item => {
	item.addEventListener('click', e => {
		changeQuantityValue(e);
	});
});

// item removal
const removeBtns = document.querySelectorAll('.data__close');

removeBtns.forEach(item => {
	item.addEventListener('click', e => {
		e.target.parentElement.parentElement.remove();
		changeCounter();
		calculateTotal();
	});
});

// checkbox condition
const termsInput = document.getElementById('terms');
const submitBtn = document.querySelector('.btn__check');

termsInput.addEventListener('change', e => {
	e.preventDefault;
	submitBtn.disabled = termsInput.checked ? 'true' : 'false';
	submitBtn.style.backgroundColor = termsInput.checked ? '#3366FF' : '#CFCFCF';
	submitBtn.style.cursor = termsInput.checked ? 'pointer' : 'not-allowed';
});
