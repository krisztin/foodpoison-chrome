const output = document.querySelector('.restaurant__description')
const apiURL = 'https://api.ratings.food.gov.uk/establishments'
let rating = 0

// RESTAURANT NAME variables
// Deliveroo adds a location name (i.e. Whitechapel) to chain restaurants which the FSA API cannot handle
const deliverooRestaurantName = document.querySelector('.restaurant__name')
  .innerText
const restaurantChopLocation = deliverooRestaurantName.indexOf('-')
//-1 to remove space
const restaurantName = deliverooRestaurantName.slice(0, restaurantChopLocation - 1
)

// RESTAURANT ADDRESS variables
// FSA's API takes either a street address OR a postcode in proper format which Deliveroo does not provide
// see the whole rant in the readme.md
const deliverooAddress = document.querySelector('.address').innerText
const addressChopLocation = deliverooAddress.indexOf(',')
const restaurantAddress = deliverooAddress.slice(0, addressChopLocation)

// CALL TO FSA API
fetch(
  `${apiURL}?name=${restaurantName}&address=${restaurantAddress}&pageSize=1`,
  {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-api-version': 2
    }
  }
)
  .then(response => response.json())
  .then(result => {
    rating = result.establishments[0].RatingValue
    getImage(rating)
  })
  .catch(error => {
    console.log(error)
  })

// GETTING THE IMAGE CORRESPONDING WITH RATING
function getImage(rating) {
  let imgFile = ""
  const [
    imgFileEN0,
    imgFileEN1,
    imgFileEN2,
    imgFileEN3,
    imgFileEN4,
    imgFileEN5
  ] = [
    'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_0_en-gb_ikdvg0.jpg',
    'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_1_en-gb_sixnb5.jpg',
    'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_2_en-gb_x7tzxo.jpg',
    'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_3_en-gb_k4r8cm.jpg',
    'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_4_en-gb_qyjebk.jpg',
    'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_5_en-gb_dut0hk.jpg'
  ]

  // Pair up image file with rating - en-GB ratings
  switch (rating) {
    case '0':
      imgFile = imgFileEN0
      displayImg()
      break
    case '1':
      imgFile = imgFileEN1
      displayImg()
      break
    case '2':
      imgFile = imgFileEN2
      displayImg()
      break
    case '3':
      imgFile = imgFileEN3
      displayImg()
      break
    case '4':
      imgFile = imgFileEN4
      displayImg()
      break
    case '5':
      imgFile = imgFileEN5
      displayImg()
      break
    default:
      output.innerHTML += `<p>Rating not found</p>`
  }

  function displayImg(){
    output.innerHTML += `<img src="${imgFile}" alt="FSA rating is ${rating}" width="150px" height="auto">`
  }
}
