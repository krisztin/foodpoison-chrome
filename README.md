# Am I getting food poisoning?

A Chrome Extension checking the Food Standards Agency's ratings on Deliveroo so you know what to expect :nauseated_face:

**Method**

1, get restaurant data (name and address) from the deliveroo menu page

2, send request with name and address to FSA's API

3, get the rating and display it somewhere on the deliveroo menu page

## Dev Diary :book:

### Day 0 - Why am I doing this?

Ordering an icecream at 11pm: great
Not paying your drivers a living wage: not so great
Giving people food poisoning: evil

Being a UX developer I think users deserve to know if they are taking the food poisoning lottery. There should be an easy and quick way to check for this. Before you walk into a restaurant you can make this decision easily by looking at the mandatory FSA rating sign in the window. So why can't you get the same convenience whilst you are lying on your couch in your pajamas feeling too disgusting or lazy to pop ou for some takeaway?

I've had enough of Deliveroo's reluctance of displaying the Food Standards Agency's ratings on their website so I've decided to make a Chrome Extension.

Only problem: I've never in my life made an Extension before. But hey, I know coding...sort of.

This should be easy:

**1,** get restaurant data (name and address) from the deliveroo menu page

**2,** send request with name and address to FSA's API

**3,** get the rating and display it somewhere on the deliveroo menu page

### Day 1 - Maybe I can do this?

So, I've gone through a [nice little tutorial](https://developer.chrome.com/extensions/getstarted) on the Chrome Dev site and I may not be too stupid to do this.

I've put together the basics, have a script running and the extension activates when you go on Deliveroo's website.

![My extension listed on the chrome extensions screen](https://res.cloudinary.com/du2vvjrb5/image/upload/v1569250159/blog/extension1_ddlu5k.png)

### Day 2 - The importance of properly formatting your data

Managed to make a GET request to FSA's API and actually get an answer. Yay! Just had to add a header to my fetch() which I've never done before being reliant on AJAX/JQuery in the past.

```
fetch(`${apiURL}?name=${restaurantName}&address=${restaurantAddress}&pageSize=1`, {
 method: "GET",
 mode: "cors",
 headers: {
   "x-api-version": 2,
 }
})
```

#### :poop: Today's Challenge:

- Deliveroo has the full address displayed in one `<small>` tag.
- The FSA API takes either a street name, city or **properly formatted** postcode as an address.

Naturally, I'd go for using the postcode as that's pretty unique. _However_, Deliveroo provides it without spaces. Go with as much of the address as possible then? Can't do that because FSA's API doesn't take combined data.

Let me demonstrate the cause of my headache with a _Burger King_ "restaurant" with the address Deliveroo provides: _90 Whitechapel High St, London, London, E17RA._

```
let restaurantAddress = "90 Whitechapel High St, London, London, E17RA"
// FAIL! FSA API will send me an empty array

let restaurantAddress = "E17RA"
// FAIL! Another empty array. FSA expects the proper formatting which is E1 7RA

let restaurantAddress = "90 Whitechapel High St, London"
// FAIL! Yep, still empty

let restaurantAddress = "90 Whitechapel High St"
// SUCCESS!

```

**Options**

1, Get the proper postcodes from - possibly - the Ordnance Survey and use those to format the ones I get from Deliveroo. I've Googled around, read a few Stackoverflow threads and concluded that I don't want to start hating myself so...

2, Cross my fingers and hope that providing the street address combined with the restaurant name will result in the FSA API returning data for the right restaurant in the proper city.

Going with #2, unsurprisingly. Will probably add some sort of confirmation/information bit next to the rating to let the user know which restaurant's rating the API coughed up. Maybe add a line of _Showing rating for xy restaurant in xyx 12x postcode_ (because funnily enough in the response the postcode is separated from the address lines...)

### Day 3 - The first taste of success :tada: :tada: :tada:

At first there was a number 4...

![A lonely number 4 displayed on Burger King's Deliveroo page](https://res.cloudinary.com/du2vvjrb5/image/upload/v1569250161/blog/4444_ft1iv7.png)

*(Note how I've expertly managed to overwrite the restaurant description in my haste of using .innerhtml= instead of +=. Ooops.)*

After a little fiddling with cloud storage and some agonising over whether to use a bunch of if statements vs a switch statement I've finally arrived to this:

![Food Standards Agency's rating image displayed on Burger King's Deliveroo page](https://res.cloudinary.com/du2vvjrb5/image/upload/v1569250206/blog/success_j78y07.png)


Quick rundown on what I've managed to accomplish today:
- Created a content script (script that runs when you are on a /menu page on Deliveroo)
- Uploaded the FSA rating pics from 0-5 to Cloudinary and added a function to display them in the *restaurant description* section.

What's left?
- Need to display something when the restaurant is not yet in FSA's database (order at your own peril )
- Add more info next to the rating, a link maybe but most importantly address data from FSA's API to make sure there was no mix-up (i.e. *showing rating for KFC in E1 7QX*)
- Right now the extension only spits out an image if there is a 0-5 rating available. FSA has more ratings such as *pass* that needs to be added
- Also, would be nice to add Welsh language support later on