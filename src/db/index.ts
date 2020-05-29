import { Sequelize, Model, DataTypes, Association, Op, WhereOptions, Includeable } from 'sequelize';
import config = require('../config');
import { IPricEmpireItem } from '../models/pricEmpireItem';
import { IPricEmpireItemPrice } from '../models/pricEmpireItemDetail';
import { IRollbitHistory } from '../models/rollbitHistory';
import { IPricEmpireSearchRequest } from '../interfaces/pricEmpire';

const sequelize = new Sequelize(config.RDB_URL, {dialect: "postgres"});

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
  public readonly prices!: PricEmpireItemPrice[];
  public readonly rollbits!: RollbitHistory[];

  public static associations: {
    prices: Association<PricEmpireItem, PricEmpireItemPrice>;
    rollbits: Association<PricEmpireItem, RollbitHistory>;
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

PricEmpireItem.hasMany(RollbitHistory, {
  sourceKey: 'market_hash_name',
  foreignKey: 'name',
  as: 'rollbits'
});

function sync() {
  return sequelize.sync();
}

function updatePricEmpireItems(items: IPricEmpireItem[]) {
  return PricEmpireItem.bulkCreate(items, {updateOnDuplicate: ['image','last_price']});
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

function profitSearch(pricEmpireSearchRequest: IPricEmpireSearchRequest) {
  let whereStatement: WhereOptions = {};
  if (pricEmpireSearchRequest.name) {
    whereStatement.market_hash_name = { [Op.like]: `%${pricEmpireSearchRequest.name}%` }
  }
  if (pricEmpireSearchRequest.app_id) {
    whereStatement.app_id = { [Op.eq]: pricEmpireSearchRequest.app_id }
  }
  if (pricEmpireSearchRequest.skin) {
    whereStatement.skin = { [Op.like]: `%${pricEmpireSearchRequest.skin}%` }
  }
  if (pricEmpireSearchRequest.family) {
    whereStatement.family = { [Op.like]: `%${pricEmpireSearchRequest.family}%` }
  }
  if (pricEmpireSearchRequest.exterior) {
    whereStatement.exterior = { [Op.like]: `%${pricEmpireSearchRequest.exterior}%` }
  }
  if (pricEmpireSearchRequest.ignore_zero_price) {
    whereStatement.last_price = { [Op.gt]: 0 }
  }
  if (pricEmpireSearchRequest.last_price_from && pricEmpireSearchRequest.last_price_to) {
    whereStatement.last_price = {
      [Op.gte]: pricEmpireSearchRequest.last_price_from,
      [Op.lte]: pricEmpireSearchRequest.last_price_to
    };
  } else if (pricEmpireSearchRequest.last_price_from) {
    whereStatement.last_price = { [Op.gte]: pricEmpireSearchRequest.last_price_from }
  } else if (pricEmpireSearchRequest.last_price_to) {
    whereStatement.last_price = { [Op.lte]: pricEmpireSearchRequest.last_price_to }
  }

  let empireWhereOptions: WhereOptions = { source: "csgoempire" };
  let rollbitWhereOptions: WhereOptions = {}
  if (pricEmpireSearchRequest.last_days) {
    let date_from = new Date();
    date_from.setDate(date_from.getDate() - pricEmpireSearchRequest.last_days);
    empireWhereOptions.created_at = { [Op.gte]: date_from };
    rollbitWhereOptions.createdAt = { [Op.gte]: date_from };
  }
  let empireIncludeable: Includeable = { model: PricEmpireItemPrice, required: false, as: "prices", where: empireWhereOptions };
  let rollbitIncludeable: Includeable = { model: RollbitHistory, required: false, as: "rollbits", where: rollbitWhereOptions };

  return PricEmpireItem.findAll({
    include: [
      empireIncludeable,
      rollbitIncludeable,
    ],
    where: whereStatement
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