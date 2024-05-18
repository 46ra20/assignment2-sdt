const mainContainer = document.getElementById('main-container');
const cartContainer = document.getElementById('cart-container');
let countTeam = document.getElementById('count-team-member')
let count = 0
let track = false

const handleSearch = () => {
    const value = document.getElementById("search-box").value;
    document.getElementById('main-container').innerHTML = ''

    // fetch data
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${value}`)
        .then(res => res.json())
        .then(data => {
            pushPlayer(data)
        })

    document.getElementById("search-box").value = ''
}

// fetch default data
const defaultData = () => {
    fetch('https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=v')
        .then(res => res.json())
        .then(data => {
            pushPlayer(data)
        }
        )
}
defaultData()

// push plyer data
const pushPlayer = (players) => {
    for (const p of players.player) {
        const div = document.createElement('div')
        div.className = 'col'
        const card = `
        <div class="card">
            <img src="${p.strThumb == null ? 'not found' : p.strThumb}" class="card-img-top bg-light" alt="Image Not found for this player"> 
            <div class="card-body">
                <h5 class="card-title">${p.strPlayer == null ? 'Not Found' : p.strPlayer}</h5>
                <p class='mb-1'>Nationality: ${p.strNationality == null ? 'Not Found' : p.strNationality}</p>
                <p class='mb-1'>Team: ${p.strTeam == null ? 'Not Found' : p.strTeam}</p>
                <p class='mb-1'>Position: ${p.strPosition ? p.strPosition : 'Not Found'}</p>
                <p class='mb-1'>Sport: ${p.strSport ? p.strSport : 'Not Found'}</p>
                
                <p class="card-text">${p.strDescriptionEN == null ? 'Not Found' : p.strDescriptionEN.slice(0, 75)}</p >
                <p class='mb-1'>
                    <a target='_blank' href="${p.strFacebook}"><i class="fa-brands fa-facebook"></i></a>
                    <a target='_blank' href='${p.strInstagram}'><i class="fa-brands fa-instagram"></i></a>
                </p>
                <div class='d-flex justify-content-between'>
                    <button class="btn btn-primary" id="${p.idPlayer}"onclick="handleAddToCart('${p.strPlayer}','${p.strThumb}','${p.strSport}','${p.idPlayer}')"  >Add To Cart</button>
                    <button class="btn btn-primary" onclick="loadDetails('${p.idPlayer}')"  data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>

                </div>
            </div >
        </div > `
        div.innerHTML = card
        mainContainer.appendChild(div)
    }
}


const handleAddToCart = (name, img, sport, id) => {
    // console.log(img)
    if (count < 11) {
        const div = document.createElement('div')
        div.className = 'd-flex mx-2 my-1 p-2 border rounded bg-light align-items-center'
        const card = `
        <img src="${img}" class='cart-image' alt="Image Not Found"/>
        <div class='p-1 ms-3 border-start ps-4'>
            <p>Name: ${name}</p>
            <p>Sport: ${sport}</p>
            <div>
                <button class='btn btn-danger' onclick=handleRemove(this,'${id}')>Remove</button>
                <button class="btn btn-primary" onclick="loadDetails('${id}')"  data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
            </div>

        </div>
    `
        div.innerHTML = card
        cartContainer.appendChild(div)
        const button = document.getElementById(`${id}`)
        button.innerText = 'Added'
        button.className = 'btn btn-danger'
        button.setAttribute("disabled", true)
        count++;

        handleCount()
    }
    else {
        alert("Sorry, You can't select more than 11")
    }
}

const loadDetails = (id) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            handleDetails(data.players[0])
        })
}

const handleDetails = (data) => {
    console.log(data)
    const div = `
    <div class="card mb-3 d-flex align-items-center bg-light">
  <img src="${data.strThumb ? data.strThumb : 'Not Found'}" class="modal-img bg-danger p-2 m-3" alt="image not found">
  <div class="card-body border-top">
    <h5 class="card-title">Name: ${data.strPlayer ? data.strPlayer : 'Not Found'}</h5>
    <p class="card-text">Team National: ${data.idTeamNational ? data.idTeamNational : 'Not found'}</p>
    <p class="card-text">Nationality: ${data.strNationality ? data.strNationality : 'Not found'}</p>
    <p class="card-text">Team 1: ${data.strTeam ? data.strTeam : 'Not found'}</p>
    <p class="card-text">Team 2: ${data.strTeam2 ? data.strTeam2 : 'Not found'}</p>
    <p class="card-text">Sport: ${data.strSport ? data.strSport : 'Not found'}</p>
    <p class="card-text">Gender: ${data.strGender ? data.strGender : 'Not found'}</p>
    <p class="card-text">Date Born: ${data.dateBorn ? data.dateBorn : 'Not found'}</p>
    <p class="card-text">Status: ${data.strStatus ? data.strStatus : 'Not found'}</p>
    <p class="card-text">Description: ${data.strDescriptionEN ? data.strDescriptionEN : 'Not Found'}</p>
    <p class='mb-1'>
        <a target='_blank' href="${data.strFacebook}"><i class="fa-brands fa-facebook"></i></a>
        <a target='_blank' href='${data.strInstagram}'><i class="fa-brands fa-instagram"></i></a>
    </p>
  </div >
</div >
    `
    document.getElementById('modal-body').innerHTML = div
}




const handleCount = () => {
    countTeam.className = "text-center fw-semibold border-bottom pb-2"
    countTeam.innerText = `Total Member: ${count} `
}


const handleRemove = (e, id) => {
    console.log(e.parentNode.parentNode.parentNode)
    e.parentNode.parentNode.parentNode.className = 'd-none'

    const button = document.getElementById(`${id}`)
    button.innerText = 'Add To Cart'
    button.className = ''
    button.className = 'btn btn-primary'
    button.removeAttribute("disabled")
    count--;
    handleCount()
}
