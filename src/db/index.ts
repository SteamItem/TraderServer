import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import R = require('ramda');
import config = require('../config');
import { IPricEmpireSearchRequest, IPricEmpireItem, IPricEmpireItemPrice } from '../interfaces/pricEmpire';
import { IRollbitHistory } from '../interfaces/rollbit';
import Agent = require('agentkeepalive');
import { IInventoryOperationTiming } from '../interfaces/withdraw';
import { IEmpireTradeLockPrice } from '../interfaces/csgoEmpire';

const sequelize = new Sequelize(config.RDB_URL, {dialect: "postgres"});

class ProfitSearchView extends Model {
  public id!: number;
  public name!: string;
  public app_id!: number;
  public last_price!: number;
  public csgoempire_avg_price!: number;
  public csgoempire_count!: number;
  public rollbit_avg_price!: number;
  public rollbit_count!: number;
  public last_profit!: number;
  public history_profit!: number;
}

class PricEmpireItem extends Model {
  public id!: number;
  public market_hash_name!: string;
  public image!: string;
  public app_id!: number;
  public last_price!: number;
  public skin!: string;
  public family!: string;
  public exterior!: string;
  public created_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    prices: Association<PricEmpireItem, PricEmpireItemPrice>;
  };
}

PricEmpireItem.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true
  },
  market_hash_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  app_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  last_price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  skin: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  family: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  exterior: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "pricempire_items"
});

class PricEmpireItemPrice extends Model {
  public id!: number;
  public item_id!: number;
  public price!: number;
  public source!: string;
  public created_at!: Date;
}

PricEmpireItemPrice.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true
  },
  item_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "pricempire_itemprices"
})

PricEmpireItem.hasMany(PricEmpireItemPrice, {
  sourceKey: 'id',
  foreignKey: 'item_id',
  as: 'prices'
});
PricEmpireItemPrice.belongsTo(PricEmpireItem, {targetKey: 'id'});

class RollbitHistory extends Model {
  public ref!: string;
  public price!: number;
  public markup!: number;
  public name!: string;
  public weapon!: string;
  public skin!: string;
  public rarity!: string;
  public exterior!: string;
  public baseprice!: number;
  public listed_at!: Date | null;
  public gone_at!: Date | null;
}

RollbitHistory.init({
  ref: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  markup: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  weapon: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  skin: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  rarity: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  exterior: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  baseprice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  listed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gone_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: "rollbithistories"
})

class RollbitFav extends Model {
  public name!: string;
}

RollbitFav.init({
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
}, {
  sequelize,
  tableName: "rollbitfavs"
})

class AgentStatus extends Model {
  public source: string;
  public createSocketCount: number;
  public createSocketErrorCount: number;
  public closeSocketCount: number;
  public errorSocketCount: number;
  public timeoutSocketCount: number;
  public requestCount: number;
  public freeSockets: string;
  public sockets: string;
  public requests: string;
}

AgentStatus.init({
  source: DataTypes.STRING(200),
  createSocketCount: DataTypes.INTEGER,
  createSocketErrorCount: DataTypes.INTEGER,
  closeSocketCount: DataTypes.INTEGER,
  errorSocketCount: DataTypes.INTEGER,
  timeoutSocketCount: DataTypes.INTEGER,
  requestCount: DataTypes.INTEGER,
  freeSockets: DataTypes.STRING(1000),
  sockets: DataTypes.STRING(1000),
  requests: DataTypes.STRING(1000),
}, {
  sequelize,
  tableName: "agentstatuses"
})

class InventoryOperationTiming extends Model {
  public source: string;
  public name: string;
  public price: number;
  public filterTime: number;
  public withdrawTime: number;
  public successWithdrawCount: number;
  public failWithdrawCount: number;
}

InventoryOperationTiming.init({
  source: DataTypes.STRING(200),
  name: DataTypes.STRING(200),
  price: DataTypes.DECIMAL(18, 2),
  filterTime: DataTypes.INTEGER,
  withdrawTime: DataTypes.INTEGER,
  successWithdrawCount: DataTypes.INTEGER,
  failWithdrawCount: DataTypes.INTEGER
}, {
  sequelize,
  tableName: "InventoryOperationTimings"
})

class EmpireTradeLockLastPrice extends Model {
  public market_name: string;
  public market_value: number;
}

EmpireTradeLockLastPrice.init({
  market_name: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  market_value: DataTypes.DECIMAL(18, 2),
}, {
  sequelize,
  tableName: "EmpireTradeLockLastPrices"
})

function sync(): Promise<Sequelize> {
  return sequelize.sync();
}

async function updatePricEmpireItems(items: IPricEmpireItem[]) {
  const splittedArray = R.splitEvery(1000, items);
  splittedArray.forEach(async arr => {
    await PricEmpireItem.bulkCreate(arr, {updateOnDuplicate: ['image','last_price']});
  });
}

function updatePricEmpireItemPrices(items: IPricEmpireItemPrice[]): Promise<PricEmpireItemPrice[]> {
  return PricEmpireItemPrice.bulkCreate(items, {updateOnDuplicate: ['item_id','price','source','created_at']});
}

function updateRollbitHistoryListed(item: IRollbitHistory): Promise<boolean> {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','listed_at']})
}

function updateRollbitHistoryGone(item: IRollbitHistory): Promise<boolean> {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','gone_at']})
}

// TODO: parameter mapping $1 $2 ...
function profitSearch(pricEmpireSearchRequest: IPricEmpireSearchRequest) {
  let price_group = `
  	SELECT
      pr.item_id,
      AVG(pr.price * 1.12 / 100) as avg_price,
		  COUNT(1) as cnt
		FROM pricempire_itemprices pr
		WHERE pr.source = 'csgoempire'
  `;
  let rollbit_group = `
    SELECT
      rh.name,
      AVG(rh.baseprice) as avg_price,
      COUNT(1) as cnt
    FROM rollbithistories rh
    WHERE 1 = 1
  `;
  if (pricEmpireSearchRequest.last_days) {
    price_group += ` AND pr.created_at >= CURRENT_DATE - INTERVAL '${pricEmpireSearchRequest.last_days} day'`;
    rollbit_group += ` AND rh."createdAt" >= CURRENT_DATE - INTERVAL '${pricEmpireSearchRequest.last_days} day'`;
  }
  price_group += ` GROUP BY pr.item_id`;
  rollbit_group += ` GROUP BY rh.name`;

  let inner_query = `
  SELECT
    pi.id,
    pi.name,
    pi.app_id,
    ROUND(pi.converted_last_price::numeric,2) as last_price,
    ROUND(pr.avg_price::numeric,2) as csgoempire_avg_price,
    pr.cnt as csgoempire_count,
    ROUND(rh.avg_price::numeric,2) as rollbit_avg_price,
    rh.cnt as rollbit_count,
    ROUND((100 * (pi.converted_last_price - rh.avg_price) / rh.avg_price)::numeric,2) as last_profit,
    ROUND((100 * (pr.avg_price - rh.avg_price) / rh.avg_price)::numeric,2) as history_profit
  FROM
    (
      SELECT
        id,
        market_hash_name as name,
        skin,
        family,
        exterior,
        app_id,
        last_price * 1.12 / 100 as converted_last_price
      FROM pricempire_items pi
    ) as pi
    LEFT JOIN ( ${price_group} ) as pr ON pi.id = pr.item_id
    LEFT JOIN ( ${rollbit_group} ) as rh ON pi.name = rh.name
  WHERE 1 = 1`;
  if (pricEmpireSearchRequest.name) {
    inner_query += ` AND pi.name ILIKE '%${pricEmpireSearchRequest.name}%'`;
  }
  if (pricEmpireSearchRequest.app_id > 0) {
    inner_query += ` AND pi.app_id = ${pricEmpireSearchRequest.app_id}`;
  }
  if (pricEmpireSearchRequest.skin) {
    inner_query += ` AND pi.skin ILIKE '%${pricEmpireSearchRequest.skin}%'`;
  }
  if (pricEmpireSearchRequest.family) {
    inner_query += ` AND pi.family ILIKE '%${pricEmpireSearchRequest.family}%'`;
  }
  if (pricEmpireSearchRequest.exterior) {
    inner_query += ` AND pi.exterior ILIKE '%${pricEmpireSearchRequest.exterior}%'`;
  }
  if (pricEmpireSearchRequest.ignore_zero_price) {
    inner_query += ` AND pi.converted_last_price > 0`;
  }
  if (pricEmpireSearchRequest.last_price_from > 0) {
    inner_query += ` AND pi.converted_last_price >= ${pricEmpireSearchRequest.last_price_from}`;
  }
  if (pricEmpireSearchRequest.last_price_to > 0) {
    inner_query += ` AND pi.converted_last_price <= ${pricEmpireSearchRequest.last_price_to}`;
  }

  let profit_query = `SELECT * FROM (${inner_query}) iq WHERE 1 = 1`;

  if (pricEmpireSearchRequest.last_profit_from > 0) {
    profit_query += ` AND iq.last_profit >= ${pricEmpireSearchRequest.last_profit_from}`;
  }

  if (pricEmpireSearchRequest.last_profit_to > 0) {
    profit_query += ` AND iq.last_profit <= ${pricEmpireSearchRequest.last_profit_to}`;
  }

  if (pricEmpireSearchRequest.history_profit_from > 0) {
    profit_query += ` AND iq.history_profit >= ${pricEmpireSearchRequest.history_profit_from}`;
  }

  if (pricEmpireSearchRequest.history_profit_to > 0) {
    profit_query += ` AND iq.history_profit <= ${pricEmpireSearchRequest.history_profit_to}`;
  }

  return sequelize.query(profit_query, {
    mapToModel: true,
    model: ProfitSearchView
  });
}

function rollbitHistories(): Promise<RollbitHistory[]> {
  return RollbitHistory.findAll();
}

function rollbitFavs(): Promise<RollbitFav[]> {
  return RollbitFav.findAll();
}

function rollbitFavAdd(name: string): Promise<RollbitFav> {
  return RollbitFav.create({ name: name });
}

function rollbitFavRemove(name: string): Promise<number> {
  return RollbitFav.destroy({where: { name: name }})
}

function addAgentStatus(source: string, agentStatus: Agent.AgentStatus): Promise<AgentStatus> {
  return AgentStatus.create({
    source,
    createSocketCount: agentStatus.createSocketCount,
    createSocketErrorCount: agentStatus.createSocketErrorCount,
    closeSocketCount: agentStatus.closeSocketCount,
    errorSocketCount: agentStatus.errorSocketCount,
    timeoutSocketCount: agentStatus.timeoutSocketCount,
    requestCount: agentStatus.requestCount,
    freeSockets: JSON.stringify(agentStatus.freeSockets),
    sockets: JSON.stringify(agentStatus.sockets),
    requests: JSON.stringify(agentStatus.requests)
  });
}

function addInventoryOperationTiming(timing: IInventoryOperationTiming): Promise<InventoryOperationTiming> {
  return InventoryOperationTiming.create(timing);
}

function empireTradeLockLastPrices(): Promise<EmpireTradeLockLastPrice[]> {
  return EmpireTradeLockLastPrice.findAll();
}

function updateEmpireTradeLockLastPrices(items: IEmpireTradeLockPrice[]): Promise<EmpireTradeLockLastPrice[]> {
  return EmpireTradeLockLastPrice.bulkCreate(items, {updateOnDuplicate: ['market_name']});
}

export = {
  sync,
  updatePricEmpireItems,
  updatePricEmpireItemPrices,
  updateRollbitHistoryListed,
  updateRollbitHistoryGone,
  profitSearch,
  rollbitHistories,
  rollbitFavs,
  rollbitFavAdd,
  rollbitFavRemove,
  addAgentStatus,
  addInventoryOperationTiming,
  empireTradeLockLastPrices,
  updateEmpireTradeLockLastPrices
}