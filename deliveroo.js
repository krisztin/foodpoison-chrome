// RESULT IMAGE CONTAINER variables
// convoluted way of adding a new div on Deliveroo because flex, that's why
const ratingDiv = document.createElement('div')
ratingDiv.classList.add('fsa__rating')
const childDiv = document.querySelector('.restaurant__metadata')
const container = childDiv.parentNode
container.insertBefore(ratingDiv, childDiv)

// API variable ========================================================================================
const apiURL = 'https://api.ratings.food.gov.uk/establishments'

// RESTAURANT NAME variables ============================================================================
// Deliveroo adds additional info (i.e. a location name such as Whitechapel) to chain restaurants
// the FSA API cannot handle these
const deliverooRestaurantName = document.querySelector('.restaurant__name').innerText
  // regex to search for either - or (
const restaurantChopLocation = deliverooRestaurantName.search(/(-|\()/g)
  //-1 to remove space
const restaurantName = deliverooRestaurantName.slice(0, restaurantChopLocation - 1)

// RESTAURANT POSTCODE variables =========================================================================
// FSA's API takes either a street address OR a postcode in proper format which Deliveroo does not provide
// see the whole rant in the readme.md
const deliverooAddress = document.querySelector('.address').innerText
const postcodeChopLocation = deliverooAddress.lastIndexOf(',')
  // +2 to remove space
const deliverooPostcode = deliverooAddress.slice(postcodeChopLocation+2)
  // credit to Borodin on Stackoverflow for this regex
let fragments = deliverooPostcode.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/)
fragments.shift()
const postcode = fragments.join(' ')


// CALL TO FSA API
fetch(
  `${apiURL}?name=${restaurantName}&address=${postcode}&pageSize=1`,
  {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-api-version': 2
    }
  })
  .then(response => response.json())
  .then(result => {
    let rating = ""
    if(result.establishments.length == 0) {
      rating = "no result";
      } else {
    rating = result.establishments[0].RatingValue
      }
    getImage(rating)
  })
  .catch(error => {
    console.log(error)
  })

// GETTING THE IMAGE CORRESPONDING WITH RATING
function getImage(rating) {
  let imgFile = ""
  const cloudURLen = 'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569247309/fsa-gb/fhrs_'
  const cloudURLsc = 'https://res.cloudinary.com/du2vvjrb5/image/upload/v1569264600/fsa-gb/fhis_'
  const [
    imgFileEN0,
    imgFileEN1,
    imgFileEN2,
    imgFileEN3,
    imgFileEN4,
    imgFileEN5,
    imgFilePass,
    imgFileImp,
    imgFileAwaitPub,
    imgFileAwaitInsp,
    imgFileExempt
  ] = [
    cloudURLen + '0_en-gb_ikdvg0.jpg',
    cloudURLen + '1_en-gb_sixnb5.jpg',
    cloudURLen + '2_en-gb_x7tzxo.jpg',
    cloudURLen + '3_en-gb_k4r8cm.jpg',
    cloudURLen + '4_en-gb_qyjebk.jpg',
    cloudURLen + '5_en-gb_dut0hk.jpg',
    cloudURLsc + 'fhis_pass_d82nu0.jpg',
    cloudURLsc + 'fhis_improvement_required_gpotup.jpg',
    cloudURLsc + 'awaiting_publication_f90cf0.jpg',
    cloudURLsc + 'awaiting_inspection_meltsi.jpg',
    cloudURLsc + 'exempt_b5qzkj.jpg'
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
    case 'Pass':
      imgFile = imgFilePass
      displayImg()
      break
    case 'Improvement Required':
      imgFile = imgFileImp
      displayImg()
      break
    case 'Awaiting Publication':
      imgFile = imgFileAwaitPub
      displayImg()
      break
    case 'Awaiting Inspection':
      imgFile = imgFileAwaitInsp
      displayImg()
      break
    case 'Exempt':
      imgFile = imgFileExempt
      displayImg()
      break
    default:
      output.innerHTML += `<p>Rating not found</p>`
  }

  function displayImg(){
    output.innerHTML += `<img src="${imgFile}" alt="FSA rating is ${rating}" width="150px" height="auto">`
  }
}
