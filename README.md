# Handling Lightspeed API Responses

A sample response can be found in the ./src/apiResponse.js file.

The goal is to take the response (typically a list of inventory items)
and manipulate it in a few ways.

I'll need to:

- Use the ItemShops load_relation in order to get current inventory levels.
- I will need to parse out the ItemShop details for each shop that was selected
  for comparison.
  - This is because each item's ItemShop is an array containing all 23+ location
    data. That's too much data, but I'm forced to collect it.
- I'll use @tanstack/react-table to display the data.
  - The `<ReactTableV8 itemData={} fromShopData={} toShopData={} />` will have
    3 props (for now\*) that hold the original itemList returned from the API
    - `itemData` is the original, untouched API response.
    - `fromShopData` is a list of ItemShops for each main Item.
    - `toShopData` shares the same idea as `fromShopData`.
  - \*can be changed to be a single prop with some optimization.
    - Will require the use of an `Object.()` method, possibly
      `Object.assign()` or `Object.create()` in combination with
      some ID matching by use of `arr.filter()` or `arr.find()`.

## Flow of Importance

### fromShopData

The `fromShopData` variable is the more important thing to figure
out. It uses a concoction of array methods on the apiResponse that
eventually returns the ItemShop data based on shopID. It also makes
sure that only Items with qoh > 0 are returned.

### Find the matches

The next step is to remove the items (by itemID) from the original
apiResponse that are not present in the `fromShopData` list. This is
stored in a varibale called `matches`.

### toShopData

The setup of `toShopData` is nearly identical to `fromShopData`'s setup.
The difference is `toShopData` is created from referencing the `matches`
variable, which is the result of finding the `fromShopData` first.

---

It's important to base the `toShopData` from the result of `fromShopData`'s
`matches` to avoid listing more data than necessary.
