// DOM elements
const form = document.querySelector("#search-form")
const input = document.querySelector("#search-term")
const msg = document.querySelector(".form-msg")
const list = document.querySelector(".cities")

// Get your OpenWeather API key: https://home.openweathermap.org/users/sign_up
const apiKey = "4d8fb5b93d4af21d66a2948710284366"

form.addEventListener('submit', e => {
	e.preventDefault()

	msg.textContent = ''
	msg.classList.remove('visible')

	let inputVal = input.value

	const listItemsArray = Array.from(list.querySelectorAll('.cities li'))

	if (listItemsArray.length > 0) {
		const filteredArray = listItemsArray.filter(el => {
			let content = ''
			let cityName = el.querySelector('.city__name').textContent.toLowerCase()
			let cityCountry = el.querySelector('.city__country').textContent.toLowerCase()

			// Check for the <city,country> format
			if (inputVal.includes(',')) {
				// If the country code is invalid (ex. athens,grrrr), keep only the city name
				if (inputVal.split(',')[1].length > 2) {
					inputVal = inputVal.split(',')[0]

					content = cityName
				} else {
					// Country code is valid so keep both city and country
					content = `${cityName},${cityCountry}`
				}
			} else {
				// Only the <city> format is used
				content = cityName
			}

			return content == inputVal.toLowerCase()
		})

		// If filteredArray is not blank, we have matches so we show a message and exit
		if (filteredArray.length > 0) {
			msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city__name").textContent} ...otherwise be more specific by providing the country code as well`;

			msg.classList.add('visible')

			form.reset()
			input.focus()

			return
		}
	}

	// AJAX
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`

	fetch(url)
		.then(response => response.json())
		.then(data => {
			// If we get a 404 code, throw an error
			if (data.cod == '404') {
				throw new Error(`${data.cod}, ${data.message}`)
			}

			const {main, name, sys, weather} = data

			const icon = `img/weather/${weather[0]['icon']}.svg`

			const li = document.createElement('li')

			const markup = `
				<figure>
					<img src="${icon}" alt="${weather[0]['description']}">
				</figure>

				<div>
					<h2>${Math.round(main.temp)}<sup>°C</sup></h2>
					<p class="city__conditions">${weather[0]['description'].toUpperCase()}</p>
					<h3><span class="city__name">${name}</span><span class="city__country">${sys.country}</span></h3>
				</div>
			`

			li.innerHTML = markup

			list.appendChild(li)
		})
		.catch(() => {
			msg.textContent = 'Please search for a valid city!'
			msg.classList.add('visible')
		})

	msg.textContent = ''

	form.reset()
	input.focus()
})
