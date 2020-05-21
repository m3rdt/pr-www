import { Sequelize, Model, DataTypes, Options } from 'sequelize'
import Debug from 'debug'
import dbConfig from '../sequelize-config.json'
const log = Debug('pr-www:sequelize')

export const sequelize = new Sequelize({
  ...dbConfig.development,
  logging: log,
} as Options)

export class Security extends Model {
  public id!: number
  public uuid!: string | null
  public name!: string | null
  public isin!: string | null
  public wkn!: string | null
  public symbolXfra!: string | null
  public symbolXnas!: string | null
  public symbolXnys!: string | null
  public securityType!: 'share' | 'fund' | 'bond' | 'index' | null

  public readonly markets?: Array<Market>
  public readonly events?: Array<Event>
}

Security.init(
  {
    uuid: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    isin: {
      type: DataTypes.STRING(12),
    },
    wkn: {
      type: DataTypes.STRING(6),
    },
    symbolXfra: {
      type: DataTypes.STRING(10),
    },
    symbolXnas: {
      type: DataTypes.STRING(10),
    },
    symbolXnys: {
      type: DataTypes.STRING(10),
    },
    securityType: {
      type: DataTypes.ENUM('share', 'fund', 'bond', 'index'),
    },
  },
  {
    sequelize,
    modelName: 'security',
    timestamps: false,
  }
)

export class Market extends Model {
  public id!: number
  public marketCode!: string
  public currencyCode!: string | null
  public firstPriceDate!: Date | null
  public lastPriceDate!: Date | null
  public symbol!: string | null
  public updatePrices!: boolean

  public securityId!: number
  public readonly prices?: Array<Price>
}

Market.init(
  {
    marketCode: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    firstPriceDate: DataTypes.DATEONLY,
    lastPriceDate: DataTypes.DATEONLY,
    symbol: DataTypes.STRING(10),
    updatePrices: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'market',
    timestamps: false,
  }
)

// Implicitely add securityId
Market.belongsTo(Security, { onDelete: 'cascade' })
Security.hasMany(Market, { onDelete: 'cascade' })

export class Price extends Model {
  public id!: number
  public date!: Date
  public close!: number

  public marketId!: number
}

Price.init(
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    close: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'price',
    timestamps: false,
  }
)

Price.belongsTo(Market, { onDelete: 'cascade' })
Market.hasMany(Price, { onDelete: 'cascade' })

export class ClientUpdate extends Model {
  public id!: number
  public timestamp!: Date
  public version!: string
  public country!: string | null
  public useragent!: string | null
}

export class Event extends Model {
  public id!: number
  public date!: Date
  public type!: string

  public amount!: number | null
  public currencyCode!: string | null
  public ratio!: string | null

  public securityId!: number
}

Event.init(
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    ratio: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'event',
    timestamps: false,
  }
)

// Implicitely add securityId
Event.belongsTo(Security, { onDelete: 'cascade' })
Security.hasMany(Event, { onDelete: 'cascade' })

ClientUpdate.init(
  {
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING(20),
      validate: { len: [0, 20] },
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(2),
    },
    useragent: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    modelName: 'clientUpdate',
    timestamps: false,
  }
)

export class ExchangeRate extends Model {
  public id!: number
  public baseCurrencyCode!: string
  public quoteCurrencyCode!: string

  public readonly prices?: Array<ExchangeRatePrice>
}

ExchangeRate.init(
  {
    baseCurrencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    quoteCurrencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'exchangeRate',
    timestamps: false,
  }
)

export class ExchangeRatePrice extends Model {
  public id!: number
  public date!: Date
  public value!: number

  public exchangeRateId!: number
}

ExchangeRatePrice.init(
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(12, 6),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'exchangeRatePrice',
    timestamps: false,
  }
)

ExchangeRatePrice.belongsTo(ExchangeRate, {
  foreignKey: 'exchangeRateId',
  onDelete: 'cascade',
})
ExchangeRate.hasMany(ExchangeRatePrice, {
  as: 'prices',
  foreignKey: 'exchangeRateId',
  onDelete: 'cascade',
})
