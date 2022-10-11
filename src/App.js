import { useState, useEffect } from "react";
import apiResponse from "./apiResponse";
import ReactTableV8 from "./components/TanstackTable";
import "./App.css";

function App() {
  const [itemData, setItemData] = useState([]);
  const [fromShopData, setFromShopData] = useState([]);
  const [toShopData, setToShopData] = useState([]);

  useEffect(() => {
    async function getApiResponse() {
      const res = await apiResponse;
      const itemList = res.Item;

      // shopID 12 is VHD Warehouse
      const fromShopData = itemList
        .map((shops) => shops.ItemShops.ItemShop)
        .flat()
        .filter((shop) => parseInt(shop.shopID) === 12)
        .sort((a, b) => (parseInt(a.systemID) < parseInt(b.systemID) ? 1 : -1));
      const fromShopInStock = fromShopData.filter(
        (item) => parseInt(item.qoh) > 0
      );

      // https://bobbyhadz.com/blog/javascript-get-difference-between-two-arrays-of-objects
      function getMatches(array1, array2) {
        return array1.filter((object1) => {
          return array2.some((object2) => {
            return object1.itemID === object2.itemID;
          });
        });
      }

      const matches = getMatches(itemList, fromShopInStock);

      // Test around with this shopID
      const toShopData = matches
        .map((shops) => shops.ItemShops.ItemShop)
        .flat()
        .filter((shop) => parseInt(shop.shopID) === 2)
        .sort((a, b) => (parseInt(a.systemID) < parseInt(b.systemID) ? 1 : -1));

      setItemData(matches);
      setFromShopData(fromShopData);
      setToShopData(toShopData);
    }
    getApiResponse();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ReactTableV8
          itemData={itemData}
          toShopData={toShopData}
          fromShopData={fromShopData}
        />
      </header>
    </div>
  );
}

export default App;
