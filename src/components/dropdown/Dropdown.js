import Component from '../base'
import { required } from '../../validators'
import { regexp } from '../../validators'
import * as d3 from 'd3'

const set_values = (selection) => selection
  .property('value', d => d.value)
  .text(d => d.text)

const enter = (selection) => selection
  .enter()
  .append('option')
  .attr('class', 'ds--select-option')
  .call(set_values)

const exit = (selection) => selection
  .exit()
  .remove()

const update = (selection) => selection
  .call(set_values)

const update_pattern = (selection) =>
  [enter, exit, update].map(f => f(selection))

/**
 * Creates a dropdown
 * @module components/dropdown
 * @param args Component arguments
 * @param args.variable Variable name
 * @param args.default Default value
 * @returns {function}
 *
 * @example <caption>YAML format</caption>
 * dropdown name=JohnDoe:
 *   - {"value": "JohnDoe", "text": "John Doe"}
 *   - {"value": "JoeSmith", "text": "Joe Smith"}
 *
 * @example
 * bar dropdown:
 *   ...
 *
 * @example <caption>JSON format</caption>
 * {
 *   "component": "dropdown",
 *   "args": {"variable": "name", "default": "JohnDoe"},
 *   "data": [
 *     {"value": "JohnDoe", "text": "John Doe"},
 *     {"value": "JoeSmith", "text": "Joe Smith"}
 *   ]
 * }
 *
 * @example <caption>JavaScript format</caption>
 * import DropdownComponent from 'components/dropdown'
 *
 * DropdownComponent(
 * {"variable": "name", "default": "JohnDoe"})(d3.selection())(...)
 *
 *
 */
const DropdownComponent = Component({
  'validators': [
    required('variable'),
    regexp('variable', /^[A-Za-z]([_A-Za-z0-9-]*[_A-Za-z0-9])?$/),
    required('default')],
  'init': (args, selection) => {
    args.state_handler.init_variable(args.variable, args.default)
    return selection
      .append('select').attr('class', 'ds--select')
  },
  'render': (args, selection, data, item) => {
    const value = args.state_handler.get_state()[args.variable]
    if (value === args.default && args.default === '~first') {
      args.state_handler.set_variable(args.variable, data[0].value)
    }
    if (value === args.default && args.default === '~last') {
      args.state_handler.set_variable(args.variable, data.slice(-1)[0].value)
    }

    item
      .selectAll('option').data(data).call(update_pattern)
    item
      .property('value', value)
    item
      .on('change', function() {
        args.state_handler.set_variable(args.variable, d3.select(this)
          .property('value'))
      })
  }
})

export default DropdownComponent
