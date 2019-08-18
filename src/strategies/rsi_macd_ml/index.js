"use strict"

const logger = require("../../logger")
const Abstract_Strategy = require("../absctract_strategy")

class Strategy extends Abstract_Strategy {
  constructor(config = {}) {
    super()

    this.rsi_buy = config.rsi_buy || 30
    this.rsi_sell = config.rsi_sell || 70

    // General Strategy config
    this.predict_on = 0
    this.learn = 1
    // General Strategy config

    // TA Indicators
    this.add_TA({ label: "RSI", update_interval: 300, ta_name: "RSI", params: 15, params2: "" })
    this.add_TA({ label: "MACD", update_interval: 60, ta_name: "MACD", params: { short: 12, long: 26, signal: 9 }, params2: "" })
    this.add_TA({ label: "CCI", update_interval: 60, ta_name: "CCI", params: { constant: 0.015, history: 14 }, params2: "" })
  }

  async update(candledata) {
    try {
      // Update buffers and incidators
      this.update_candle(candledata)

      if (this.TAready()) {
        let candle = candledata[60]

        if (this.BUFFER.RSI[this.step] < this.rsi_buy) {
          this.BUY(candle.close)
        }

        // Sell
        if (this.BUFFER.RSI[this.step] > this.rsi_sell) {
          this.SELL(candle.close)
        }
      }
    } catch (e) {
      logger.error("Strategy error ", e)
    }
  }
}

module.exports = Strategy
