import BigNumber from 'bignumber.js'

type NanoUnit = 'raw' | 'NANO' | 'XRB' | 'mrai' | 'krai' | 'rai'

const Converter = {
  unit(input: string | number, input_unit: NanoUnit, output_unit: NanoUnit) {
    let value = new BigNumber(input.toString())

    // Step 1: to RAW
    switch (input_unit) {
      case 'raw':
        value = value
        break
      case 'NANO':
      case 'XRB':
      case 'mrai':
        value = value.shiftedBy(30)
        break
      case 'krai':
        value = value.shiftedBy(27)
        break
      case 'rai':
        value = value.shiftedBy(24)
        break
      default:
        throw new Error(`Unkown input unit ${input_unit}`)
    }

    // Step 2: to output
    switch (output_unit) {
      case 'raw':
        return value.toFixed(0)
      case 'NANO':
      case 'XRB':
      case 'mrai':
        return value.shiftedBy(-30).toFixed(15, 1)
      case 'krai':
        return value.shiftedBy(-27).toFixed(12, 1)
      case 'rai':
        return value.shiftedBy(-24).toFixed(9, 1)
      default:
        throw new Error(`Unknown output unit ${output_unit}`)
    }
  },
  minus(base: string, minus: string) {
    new BigNumber(base).minus(new BigNumber(minus)).toFixed(0)
  },
  plus(base: string, plus: string) {
    new BigNumber(base).plus(new BigNumber(plus)).toFixed(0)
  }
}

export default Converter
