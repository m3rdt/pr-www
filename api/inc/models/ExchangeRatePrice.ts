import { DataTypes, Model } from 'sequelize'
import { ExchangeRate, sequelize } from '../sequelize'

export class ExchangeRatePrice extends Model {
  public id!: number
  public date!: Date
  public value!: string

  public exchangeRateId!: number
}

export function initExchangeRatePrice() {
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
      tableName: 'exchangerates_prices',
      timestamps: false,
    }
  )

  ExchangeRatePrice.belongsTo(ExchangeRate, {
    foreignKey: 'exchangerate_id',
    onDelete: 'cascade',
  })
  ExchangeRate.hasMany(ExchangeRatePrice, {
    as: 'prices',
    foreignKey: 'exchangerate_id',
    onDelete: 'cascade',
  })
}
