/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor() {
    this.elementSelector = '';
    this.idSelector = '';
    this.classSelector = '';
    this.attrSelector = '';
    this.pseudoClassSelector = '';
    this.pseudoElementSelector = '';

    this.combination = '';
    this.order = [];

    this.errorMessage = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.errorMessage2 = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  element(name) {
    if (this.elementSelector) throw new Error(this.errorMessage);
    this.order.push(1);
    if (!this.checkOrder()) throw new Error(this.errorMessage2);

    this.elementSelector = name;
    return this;
  }

  id(name) {
    if (this.idSelector) throw new Error(this.errorMessage);
    this.order.push(2);
    if (!this.checkOrder()) throw new Error(this.errorMessage2);

    this.idSelector = `#${name}`;
    return this;
  }

  class(name) {
    this.order.push(3);
    if (!this.checkOrder()) throw new Error(this.errorMessage2);

    this.classSelector += `.${name}`;
    return this;
  }

  attr(name) {
    this.order.push(4);
    if (!this.checkOrder()) throw new Error(this.errorMessage2);

    this.attrSelector += `[${name}]`;
    return this;
  }

  pseudoClass(name) {
    this.order.push(5);
    if (!this.checkOrder()) throw new Error(this.errorMessage2);

    this.pseudoClassSelector += `:${name}`;
    return this;
  }

  pseudoElement(name) {
    if (this.pseudoElementSelector) throw new Error(this.errorMessage);
    this.order.push(6);
    if (!this.checkOrder()) throw new Error(this.errorMessage2);

    this.pseudoElementSelector = `::${name}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combination = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    let isCombined = '';
    if (this.combination) {
      isCombined = this.combination;
      this.combination = '';
    }
    return isCombined || `${this.elementSelector}${this.idSelector}${this.classSelector}${this.attrSelector}${this.pseudoClassSelector}${this.pseudoElementSelector}`;
  }

  checkOrder() {
    const rightOrder = this.order.concat().sort().join('');
    return this.order.join('') === rightOrder;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector().element(value);
  },

  id(value) {
    return new Selector().id(value);
  },

  class(value) {
    return new Selector().class(value);
  },

  attr(value) {
    return new Selector().attr(value);
  },

  pseudoClass(value) {
    return new Selector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Selector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Selector().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
