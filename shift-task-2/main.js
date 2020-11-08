let mainTable = document.querySelector('div.table')
let apiURL = "https://swapi.dev/api/planets/"


function getRandInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}


function beautifyData(tags, data, about = '') {
    let result = ''
    if (about) result += `<b><p>${about}</p></b>`

    tags.forEach((tag) => {
            try {
                result += `<p>${tag}: ${data[tag]} </p>`
            } catch {

            } finally {
                //result += `"${tag}": None \n`
            }
        }
    )

    return result
}

function beautifyPlanetData(data) {
    let tags = [
        "rotation_period",
        "orbital_period",
        "diameter",
        "climate",
        "gravity",
        "terrain",
        "surface_water",
        "population"
    ]
    return beautifyData(tags, data, "About planet:")
}

function beautifyPersonData(data) {
    let tags = [
        "name",
        "height",
        "mass",
        "hair_color",
        "skin_color",
        "eye_color",
        "birth_year",
        "gender"
    ]
    return beautifyData(tags, data, "About resident: ")
}


function createNewDiv(divClassName, divTextContent = '', divId = NaN) {
    let newDiv = document.createElement("div")
    let container = document.createElement('div')
    container.innerHTML = divTextContent

    if (divId || divId === 0) newDiv.id = divId

    newDiv.className = divClassName


    newDiv
        .appendChild(
            container
        )

    return newDiv
}


function appendChildren(addTo, children) {
    children
        .forEach(child => addTo.appendChild(child))
}


function getPlanetsInfo(planet) {
    return beautifyPlanetData(planet)
}


function addPersonToPlanet(newPlanetDiv, urls) {

    if (urls.length !== 0) {

        let url = urls[getRandInt(0, (urls.length - 1))]

        fetch(url)
            .then((resp) => resp.json()) // Transform the data into json
            .then((data) => {

                try {
                    newPlanetDiv.querySelectorAll('div[class=planet-person]')[0].remove()
                } catch (e) {
                    // console.log(e)
                } finally {
                    const divToAdd = createNewDiv("planet-person", beautifyPersonData(data))
                    newPlanetDiv.appendChild(divToAdd)
                }


            })

    } else {
        try {
            newPlanetDiv.querySelectorAll('div[class=planet-person]')[0].remove()
        } catch (e) {
            // console.log(e)
        } finally {
            const divToAdd = createNewDiv("planet-person", 'This planet has no residents')
            newPlanetDiv.appendChild(divToAdd)
        }
    }

}

function createNewPlanet(planet) {
    let newPlanetDiv = createNewDiv("planet", '')
    let newNameDiv = createNewDiv("planet-name", planet.name)
    let newAboutDiv = createNewDiv("planet-about", getPlanetsInfo(planet))

    appendChildren(newPlanetDiv, [newNameDiv, newAboutDiv])

    newPlanetDiv.addEventListener('click', () => {
        addPersonToPlanet(newPlanetDiv, planet.residents)
    })

    mainTable.appendChild(newPlanetDiv)
}


function addPlanets() {
    fetch(apiURL)
        .then((resp) => resp.json()) // Transform the data into json
        .then((data) => {

            let planets = data.results

            planets
                .forEach((planet, key) => {
                    createNewPlanet(planet)
                })
        })
}

addPlanets()