const stars = document.querySelectorAll('.rating span')
const trash = document.querySelectorAll('.fa-trash')

stars.forEach(star => {
    star.addEventListener('click', function () {
        const show = this.parentElement.parentElement.dataset.show
        const rating = this.dataset.rating
        fetch('show/rating', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ show, rating })
        })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            console.log(data)
            updateStars(this.parentElement, rating) // this.parentElement is <div class="rating">
            saveRating(show, rating)
        })
    })
})

function updateStars(showRating, selectedRating) {
    const stars = showRating.querySelectorAll('.rating span') // All 5 stars of one specific show 
    stars.forEach(star => {
        star.style.color = (star.dataset.rating <= selectedRating ? 'orange' : 'black')
    })
}

function saveRating(show, rating) {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {} // Retrieve existing ratings object from storage. If no ratings stored yet, ratings object is created w. empty value
    ratings[show] = rating // Update (or add if it doesn't exist) rating for specific show
    localStorage.setItem('ratings', JSON.stringify(ratings)) // Convert ratings object to JSON string and save
}

function getRating(show) {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {}
    return ratings[show]
}

// Set initial stars based on stored rating
stars.forEach(star => {
    const show = star.parentElement.parentElement.dataset.show
    const storedRating = getRating(show)
    if (storedRating !== null) {
        updateStars(star.parentElement, storedRating)
    }
})

trash.forEach(trash => {
    trash.addEventListener('click', function () {
        const show = this.parentNode.parentNode.childNodes[1].innerText
        fetch('show', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ show })
        })
        .then(function (response) {
            window.location.reload()
        })
    })
})