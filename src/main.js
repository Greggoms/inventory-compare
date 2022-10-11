const data = require("./apiResponse");

const itemList = data.Item;
const itemShopList = itemList.map((shops) => shops.ItemShops.ItemShop);

const fromShopData = itemShopList
  .flat()
  .filter((shop) => shop.shopID == 12)
  .sort((a, b) => (parseInt(a.qoh) < parseInt(b.qoh) ? 1 : -1));
const fromShopInStock = fromShopData.filter((item) => parseInt(item.qoh) > 0);

// https://bobbyhadz.com/blog/javascript-get-difference-between-two-arrays-of-objects
function getMatches(array1, array2) {
  return array1.filter((object1) => {
    return array2.some((object2) => {
      return object1.itemID === object2.itemID;
    });
  });
}

const matches = getMatches(itemList, fromShopInStock);

const toShopData = matches
  .map((shops) => shops.ItemShops.ItemShop)
  .flat()
  .filter((shop) => shop.shopID == 1);

console.log(toShopData, toShopData.length);
