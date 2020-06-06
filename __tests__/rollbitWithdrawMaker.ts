import { RollbitWithdrawMakerTask } from "../src/workers/WithdrawMaker/RollbitWithdrawMakerTask";
import { EnumBot } from "../src/helpers/enum";
import logger from '../__mocks__/logger';

const botParam = { id: EnumBot.RollbitCsGo, name: "Rollbit", worker: true, period: 1, cookie: "TEST" }
const itemToBuy = { price: 3.23, ref: "4e512ec9-d264-4929-b499-587b28d8622a", markup: 0, items: [{name: "SSG 08 | Bloodshot (Field-Tested)", image: "", classid: 3608084161, instanceid: 188530139, weapon: "SSG 08", skin: "Bloodshot", rarity: "Classified", exterior: "Field-Tested", price: 3.23, markup: 0 }]};

test('Success withdraw', async () => {
  const withdrawMaker = new RollbitWithdrawMakerTask(botParam, [itemToBuy], logger);
  await withdrawMaker.work();
  expect(withdrawMaker.withdrawResult.successWithdrawCount).toEqual(1);
});