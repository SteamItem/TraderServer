import { RollbitInventoryFilterer } from '../src/workers/InventoryFilterer/RollbitInventoryFilterer'
import { EnumSite, EnumSteamApp } from '../src/helpers/enum';

const wishlistItem = {site_id: EnumSite.Rollbit, appid: EnumSteamApp.Dota, name: "SSG 08 | Bloodshot (Field-Tested)"};
const inventoryItem = { price: 3.23, ref: "4e512ec9-d264-4929-b499-587b28d8622a", markup: 0, items: [{name: "SSG 08 | Bloodshot (Field-Tested)", image: "", classid: 3608084161, instanceid: 188530139, weapon: "SSG 08", skin: "Bloodshot", rarity: "Classified", exterior: "Field-Tested", price: 3.23, markup: 0 }]};

test('Has balance with no item', () => {
  const filterer = new RollbitInventoryFilterer(100, [], [], null);
  filterer.filter();
  expect(filterer.itemsToBuy).toHaveLength(0);
});

test('Has not balance with item', () => {
  const filterer = new RollbitInventoryFilterer(0, [inventoryItem], [wishlistItem], null);
  filterer.filter();
  expect(filterer.itemsToBuy).toHaveLength(0);
});

test('Has balance with item', () => {
  const filterer = new RollbitInventoryFilterer(4, [inventoryItem], [wishlistItem], null);
  filterer.filter();
  expect(filterer.itemsToBuy).toHaveLength(1);
});