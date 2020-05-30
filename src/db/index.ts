import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import R = require('ramda');
import config = require('../config');
import { IPricEmpireItem } from '../models/pricEmpireItem';
import { IPricEmpireItemPrice } from '../models/pricEmpireItemDetail';
import { IRollbitHistory } from '../models/rollbitHistory';
import { IPricEmpireSearchRequest } from '../interfaces/pricEmpire';

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

function sync() {
  return sequelize.sync();
}

async function updatePricEmpireItems(items: IPricEmpireItem[]) {
  let splittedArray = R.splitEvery(1000, items);
  splittedArray.forEach(async arr => {
    await PricEmpireItem.bulkCreate(arr, {updateOnDuplicate: ['image','last_price']});
  });
}

function updatePricEmpireItemPrices(items: IPricEmpireItemPrice[]) {
  return PricEmpireItemPrice.bulkCreate(items, {updateOnDuplicate: ['item_id','price','source','created_at']});
}

function updateRollbitHistoryListed(item: IRollbitHistory) {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','listed_at']})
}

function updateRollbitHistoryGone(item: IRollbitHistory) {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','gone_at']})
}

// TODO: parameter mapping $1 $2 ...
function profitSearch(pricEmpireSearchRequest: IPricEmpireSearchRequest) {
  let price_lateral = `
  	SELECT AVG(pr.price * 1.12 / 100) as avg_price,
		COUNT(1) as cnt
		FROM pricempire_itemprices pr
		WHERE pi.id = pr.item_id AND pr.source = 'csgoempire'
  `;
  let rollbit_lateral = `
    SELECT AVG(rh.baseprice) as avg_price,
    COUNT(1) as cnt
    FROM rollbithistories rh
    WHERE pi.name = rh.name
  `;
  if (pricEmpireSearchRequest.last_days) {
    price_lateral += ` AND pr.created_at >= CURRENT_DATE - INTERVAL '${pricEmpireSearchRequest.last_days} day'`;
    rollbit_lateral += ` AND rh."createdAt" >= CURRENT_DATE - INTERVAL '${pricEmpireSearchRequest.last_days} day'`;
  }

  let inner_query = `
  SELECT
    pi.id,
    pi.name,
    pi.app_id,
    pi.converted_last_price as last_price,
    pr.avg_price as csgoempire_avg_price,
    pr.cnt as csgoempire_count,
    rh.avg_price as rollbit_avg_price,
    rh.cnt as rollbit_count,
    100 * (pi.converted_last_price - rh.avg_price) / rh.avg_price as last_profit,
    100 * (pr.avg_price - rh.avg_price) / rh.avg_price as history_profit
  FROM
    (
      SELECT
        id,
        market_hash_name as name,
        app_id,
        last_price * 1.12 / 100 as converted_last_price
      FROM pricempire_items pi
    ) as pi
    LEFT JOIN LATERAL ( ${price_lateral} ) as pr ON true
    LEFT JOIN LATERAL ( ${rollbit_lateral} ) as rh ON TRUE
  WHERE 1 = 1`;
  if (pricEmpireSearchRequest.name) {
    inner_query += ` AND pi.name like '%${pricEmpireSearchRequest.name}%'`;
  }
  if (pricEmpireSearchRequest.app_id) {
    inner_query += ` AND pi.app_id = ${pricEmpireSearchRequest.app_id}`;
  }
  if (pricEmpireSearchRequest.skin) {
    inner_query += ` AND pi.skin like '%${pricEmpireSearchRequest.skin}%'`;
  }
  if (pricEmpireSearchRequest.family) {
    inner_query += ` AND pi.family like '%${pricEmpireSearchRequest.family}%'`;
  }
  if (pricEmpireSearchRequest.family) {
    inner_query += ` AND pi.exterior like '%${pricEmpireSearchRequest.exterior}%'`;
  }
  if (pricEmpireSearchRequest.ignore_zero_price) {
    inner_query += ` AND pi.converted_last_price > 0`;
  }
  if (pricEmpireSearchRequest.last_price_from) {
    inner_query += ` AND pi.converted_last_price >= ${pricEmpireSearchRequest.last_price_from}`;
  }
  if (pricEmpireSearchRequest.last_price_to) {
    inner_query += ` AND pi.converted_last_price <= ${pricEmpireSearchRequest.last_price_to}`;
  }

  let profit_query = `SELECT * FROM (${inner_query}) iq WHERE 1 = 1`;

  if (pricEmpireSearchRequest.last_profit_from) {
    profit_query += ` AND iq.last_profit >= ${pricEmpireSearchRequest.last_profit_from}`;
  }

  if (pricEmpireSearchRequest.last_profit_to) {
    profit_query += ` AND iq.last_profit <= ${pricEmpireSearchRequest.last_profit_to}`;
  }

  if (pricEmpireSearchRequest.history_profit_from) {
    profit_query += ` AND iq.history_profit >= ${pricEmpireSearchRequest.history_profit_from}`;
  }

  if (pricEmpireSearchRequest.history_profit_to) {
    profit_query += ` AND iq.history_profit <= ${pricEmpireSearchRequest.history_profit_to}`;
  }

  return sequelize.query(profit_query, {
    mapToModel: true,
    model: ProfitSearchView
  });
}

export = {
  sync,
  updatePricEmpireItems,
  updatePricEmpireItemPrices,
  updateRollbitHistoryListed,
  updateRollbitHistoryGone,
  profitSearch
}