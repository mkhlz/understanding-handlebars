/**
 * Handlebars helper functions.
 */
const hbHelper = function (hbs, moment) {
  const esc = hbs.handlebars.escapeExpression;
  function safe (value) {
    return new hbs.handlebars.SafeString(value);
  }

  function ifeq (a, b, options) {
    if (a === b) return options.fn(this);
    return options.inverse(this);
  }

  function ifnotnull (a, options) {
    if (!!a) return options.fn(this);
    return options.inverse(this);
  }

  function ifneq (a, b, options) {
    // console.log('a', a);
    // console.log('b', b);
    if (a !== b) return options.fn(this);
    return options.inverse(this);
  }

  function ifgr (a, b, options) {
    if (a > b) return options.fn(this);
    return options.inverse(this);
  }

  function iflt (a, b, options) {
    if (a < b) return options.fn(this);
    return options.inverse(this);
  }

  function part (name, options) {
    const regParts = hbs.handlebars.partials;
    const partialValue = ((name in regParts) && regParts[name] ? regParts[name] : null);
    if (partialValue) {
      let merger = hbs.handlebars.compile(partialValue);
      return merger(this);
    }
    return safe(options.fn(this));
  }

  function isChecked (expr, value, comparison, options) {
    if (!expr) return '';
    const result = (expr.toString().toLowerCase() === value);
    if (result === comparison) return 'checked';
    return '';
  }

  function formatDate (datevalue, options) {
    if (moment) return moment(datevalue).format('MM/DD/YYYY');
    return safe(datevalue);
  }

  function formatDatetime (datevalue, format, options) {
    if (moment) return moment(datevalue).format('MM/DD/YYYY h:mm a');
    return safe(datevalue);
  }

  function echo () {
    let name = esc(this.name);
    let id = esc(this.id);
    return safe('<span>The id ' + id + ' is ' + name + '</span>');
  }

  function debug (optionalValue) {
    // console.log('Debug HBS current context');
    // console.log(this);
    // if (optionalValue) { console.log('Debug HBS value', optionalValue); }
  }

  // Select input dropdown, set value based on VM data
  function option (value, label, selectedValue) {
    const selectedProperty = (value === selectedValue) ? 'selected' : '';
    return new hbs.handlebars.SafeString('<option value="' + value + '"' + selectedProperty + '>' + label + '</option>');
  }

  function json (value) {
    return JSON.stringify(value);
  }

  return {
    ifeq: ifeq,
    ifnotnull: ifnotnull,
    ifneq: ifneq,
    ifgr: ifgr,
    iflt: iflt,
    part: part,
    fmtDate: formatDate,
    fmtDatetime: formatDatetime,
    debug: debug,
    isChecked: isChecked,
    try: echo,
    option: option,
    json: json
  };
};

module.exports = hbHelper;
