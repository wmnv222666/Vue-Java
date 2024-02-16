(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-iview", ["exports", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.XEUtils);
    global.VXETablePluginIView = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginIView = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function isEmptyValue(cellValue) {
    return cellValue === null || cellValue === undefined || cellValue === '';
  }

  function getFormatDate(value, props, defaultFormat) {
    return _xeUtils["default"].toDateString(value, props.format || defaultFormat);
  }

  function getFormatDates(values, props, separator, defaultFormat) {
    return _xeUtils["default"].map(values, function (date) {
      return getFormatDate(date, props, defaultFormat);
    }).join(separator);
  }

  function equalDaterange(cellValue, data, props, defaultFormat) {
    cellValue = getFormatDate(cellValue, props, defaultFormat);
    return cellValue >= getFormatDate(data[0], props, defaultFormat) && cellValue <= getFormatDate(data[1], props, defaultFormat);
  }

  function matchCascaderData(index, list, values, labels) {
    var val = values[index];

    if (list && values.length > index) {
      _xeUtils["default"].each(list, function (item) {
        if (item.value === val) {
          labels.push(item.label);
          matchCascaderData(++index, item.children, values, labels);
        }
      });
    }
  }

  function getProps(_ref, _ref2, defaultProps) {
    var $table = _ref.$table;
    var props = _ref2.props;
    return _xeUtils["default"].assign($table.vSize ? {
      size: $table.vSize
    } : {}, defaultProps, props);
  }

  function getCellEvents(renderOpts, params) {
    var events = renderOpts.events;
    var $table = params.$table;
    var type = 'on-change';

    var on = _defineProperty({}, type, function (evnt) {
      $table.updateStatus(params);

      if (events && events[type]) {
        events[type](params, evnt);
      }
    });

    if (events) {
      return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          cb.apply(null, [params].concat.apply(params, args));
        };
      }), on);
    }

    return on;
  }

  function getSelectCellValue(renderOpts, params) {
    var options = renderOpts.options,
        optionGroups = renderOpts.optionGroups,
        _renderOpts$props = renderOpts.props,
        props = _renderOpts$props === void 0 ? {} : _renderOpts$props,
        _renderOpts$optionPro = renderOpts.optionProps,
        optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro,
        _renderOpts$optionGro = renderOpts.optionGroupProps,
        optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
    var $table = params.$table,
        row = params.row,
        column = params.column;
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    var groupOptions = optionGroupProps.options || 'options';

    var cellValue = _xeUtils["default"].get(row, column.property);

    var colid = column.id;
    var rest;
    var cellData;

    if (props.filterable) {
      var fullAllDataRowMap = $table.fullAllDataRowMap;
      var cacheCell = fullAllDataRowMap.has(row);

      if (cacheCell) {
        rest = fullAllDataRowMap.get(row);
        cellData = rest.cellData;

        if (!cellData) {
          cellData = fullAllDataRowMap.get(row).cellData = {};
        }
      }

      if (rest && cellData[colid] && cellData[colid].value === cellValue) {
        return cellData[colid].label;
      }
    }

    if (!isEmptyValue(cellValue)) {
      return _xeUtils["default"].map(props.multiple ? cellValue : [cellValue], optionGroups ? function (value) {
        var selectItem;

        for (var index = 0; index < optionGroups.length; index++) {
          selectItem = _xeUtils["default"].find(optionGroups[index][groupOptions], function (item) {
            return item[valueProp] === value;
          });

          if (selectItem) {
            break;
          }
        }

        var cellLabel = selectItem ? selectItem[labelProp] : value;

        if (cellData && options && options.length) {
          cellData[colid] = {
            value: cellValue,
            label: cellLabel
          };
        }

        return cellLabel;
      } : function (value) {
        var selectItem = _xeUtils["default"].find(options, function (item) {
          return item[valueProp] === value;
        });

        var cellLabel = selectItem ? selectItem[labelProp] : value;

        if (cellData && options && options.length) {
          cellData[colid] = {
            value: cellValue,
            label: cellLabel
          };
        }

        return cellLabel;
      }).join(', ');
    }

    return null;
  }

  function getCascaderCellValue(renderOpts, params) {
    var _renderOpts$props2 = renderOpts.props,
        props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;
    var row = params.row,
        column = params.column;

    var cellValue = _xeUtils["default"].get(row, column.property);

    var values = cellValue || [];
    var labels = [];
    matchCascaderData(0, props.data, values, labels);
    return labels.join(" ".concat(props.separator || '/', " "));
  }

  function getDatePickerCellValue(renderOpts, params) {
    var _renderOpts$props3 = renderOpts.props,
        props = _renderOpts$props3 === void 0 ? {} : _renderOpts$props3;
    var row = params.row,
        column = params.column;
    var separator = props.separator;

    var cellValue = _xeUtils["default"].get(row, column.property);

    switch (props.type) {
      case 'week':
        cellValue = getFormatDate(cellValue, props, 'yyyywWW');
        break;

      case 'month':
        cellValue = getFormatDate(cellValue, props, 'yyyy-MM');
        break;

      case 'year':
        cellValue = getFormatDate(cellValue, props, 'yyyy');
        break;

      case 'dates':
        cellValue = getFormatDates(cellValue, props, ', ', 'yyyy-MM-dd');
        break;

      case 'daterange':
        cellValue = getFormatDates(cellValue, props, " ".concat(separator || '-', " "), 'yyyy-MM-dd');
        break;

      case 'datetimerange':
        cellValue = getFormatDates(cellValue, props, " ".concat(separator || '-', " "), 'yyyy-MM-dd HH:ss:mm');
        break;

      default:
        cellValue = getFormatDate(cellValue, props, 'yyyy-MM-dd');
        break;
    }

    return cellValue;
  }

  function createEditRender(defaultProps) {
    return function (h, renderOpts, params) {
      var row = params.row,
          column = params.column;
      var attrs = renderOpts.attrs;
      var props = getProps(params, renderOpts, defaultProps);
      return [h(renderOpts.name, {
        props: props,
        attrs: attrs,
        model: {
          value: _xeUtils["default"].get(row, column.property),
          callback: function callback(value) {
            _xeUtils["default"].set(row, column.property, value);
          }
        },
        on: getCellEvents(renderOpts, params)
      })];
    };
  }

  function defaultButtonEditRender(h, renderOpts, params) {
    var attrs = renderOpts.attrs;
    var props = getProps(params, renderOpts);
    return [h('Button', {
      attrs: attrs,
      props: props,
      on: getCellEvents(renderOpts, params)
    }, cellText(h, renderOpts.content))];
  }

  function defaultButtonsEditRender(h, renderOpts, params) {
    return renderOpts.children.map(function (childRenderOpts) {
      return defaultButtonEditRender(h, childRenderOpts, params)[0];
    });
  }

  function getFilterEvents(on, renderOpts, params) {
    var events = renderOpts.events;

    if (events) {
      return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          cb.apply(null, [params].concat(args));
        };
      }), on);
    }

    return on;
  }

  function createFilterRender(defaultProps) {
    return function (h, renderOpts, params) {
      var column = params.column;
      var name = renderOpts.name,
          attrs = renderOpts.attrs,
          events = renderOpts.events;
      var type = 'on-change';
      var props = getProps(params, renderOpts);
      return column.filters.map(function (item) {
        return h(name, {
          props: props,
          attrs: attrs,
          model: {
            value: item.data,
            callback: function callback(optionValue) {
              item.data = optionValue;
            }
          },
          on: getFilterEvents(_defineProperty({}, type, function (evnt) {
            handleConfirmFilter(params, column, !!item.data, item);

            if (events && events[type]) {
              events[type](params, evnt);
            }
          }), renderOpts, params)
        });
      });
    };
  }

  function handleConfirmFilter(params, column, checked, item) {
    var $panel = params.$panel || params.context;
    $panel[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
  }

  function defaultFilterMethod(_ref3) {
    var option = _ref3.option,
        row = _ref3.row,
        column = _ref3.column;
    var data = option.data;

    var cellValue = _xeUtils["default"].get(row, column.property);
    /* eslint-disable eqeqeq */


    return cellValue === data;
  }

  function renderOptions(h, options, optionProps) {
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    var disabledProp = optionProps.disabled || 'disabled';
    return _xeUtils["default"].map(options, function (item, index) {
      return h('Option', {
        props: {
          value: item[valueProp],
          label: item[labelProp],
          disabled: item[disabledProp]
        },
        key: index
      });
    });
  }

  function cellText(h, cellValue) {
    return ['' + (isEmptyValue(cellValue) ? '' : cellValue)];
  }

  function createFormItemRender(defaultProps) {
    return function (h, renderOpts, params) {
      var data = params.data,
          property = params.property;
      var name = renderOpts.name;
      var attrs = renderOpts.attrs;
      var props = getFormItemProps(params, renderOpts, defaultProps);
      return [h(name, {
        attrs: attrs,
        props: props,
        model: {
          value: _xeUtils["default"].get(data, property),
          callback: function callback(value) {
            _xeUtils["default"].set(data, property, value);
          }
        },
        on: getFormEvents(renderOpts, params)
      })];
    };
  }

  function defaultButtonItemRender(h, renderOpts, params) {
    var attrs = renderOpts.attrs;
    var props = getFormItemProps(params, renderOpts);
    return [h('Button', {
      attrs: attrs,
      props: props,
      on: getFormEvents(renderOpts, params)
    }, cellText(h, renderOpts.content || props.content))];
  }

  function defaultButtonsItemRender(h, renderOpts, params) {
    return renderOpts.children.map(function (childRenderOpts) {
      return defaultButtonItemRender(h, childRenderOpts, params)[0];
    });
  }

  function getFormItemProps(_ref4, _ref5, defaultProps) {
    var $form = _ref4.$form;
    var props = _ref5.props;
    return _xeUtils["default"].assign($form.vSize ? {
      size: $form.vSize
    } : {}, defaultProps, props);
  }

  function getFormEvents(renderOpts, params) {
    var events = renderOpts.events;
    var $form = params.$form;
    var type = 'on-change';

    var on = _defineProperty({}, type, function (evnt) {
      $form.updateStatus(params);

      if (events && events[type]) {
        events[type](params, evnt);
      }
    });

    if (events) {
      return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          cb.apply(null, [params].concat.apply(params, args));
        };
      }), on);
    }

    return on;
  }

  function createExportMethod(valueMethod, isEdit) {
    var renderProperty = isEdit ? 'editRender' : 'cellRender';
    return function (params) {
      return valueMethod(params.column[renderProperty], params);
    };
  }

  function createFormItemRadioAndCheckboxRender() {
    return function (h, renderOpts, params) {
      var name = renderOpts.name,
          options = renderOpts.options,
          _renderOpts$optionPro2 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2;
      var data = params.data,
          property = params.property;
      var attrs = renderOpts.attrs;
      var props = getFormItemProps(params, renderOpts);
      var labelProp = optionProps.label || 'label';
      var valueProp = optionProps.value || 'value';
      var disabledProp = optionProps.disabled || 'disabled';
      return [h("".concat(name, "Group"), {
        props: props,
        attrs: attrs,
        model: {
          value: _xeUtils["default"].get(data, property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(data, property, cellValue);
          }
        },
        on: getFormEvents(renderOpts, params)
      }, options.map(function (option) {
        return h(name, {
          props: {
            label: option[valueProp],
            disabled: option[disabledProp]
          }
        }, option[labelProp]);
      }))];
    };
  }
  /**
   * 渲染函数
   */


  var renderMap = {
    Input: {
      autofocus: 'input.ivu-input',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    AutoComplete: {
      autofocus: 'input.ivu-input',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    InputNumber: {
      autofocus: 'input.ivu-input-number-input',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    Select: {
      renderEdit: function renderEdit(h, renderOpts, params) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _renderOpts$optionPro3 = renderOpts.optionProps,
            optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
            _renderOpts$optionGro2 = renderOpts.optionGroupProps,
            optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
        var row = params.row,
            column = params.column;
        var attrs = renderOpts.attrs;
        var props = getProps(params, renderOpts, {
          transfer: true
        });

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return [h('Select', {
            props: props,
            attrs: attrs,
            model: {
              value: _xeUtils["default"].get(row, column.property),
              callback: function callback(cellValue) {
                _xeUtils["default"].set(row, column.property, cellValue);
              }
            },
            on: getCellEvents(renderOpts, params)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
            return h('OptionGroup', {
              props: {
                label: group[groupLabel]
              },
              key: gIndex
            }, renderOptions(h, group[groupOptions], optionProps));
          }))];
        }

        return [h('Select', {
          props: props,
          attrs: attrs,
          model: {
            value: _xeUtils["default"].get(row, column.property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(row, column.property, cellValue);
            }
          },
          on: getCellEvents(renderOpts, params)
        }, renderOptions(h, options, optionProps))];
      },
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getSelectCellValue(renderOpts, params));
      },
      renderFilter: function renderFilter(h, renderOpts, params) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _renderOpts$optionPro4 = renderOpts.optionProps,
            optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
            _renderOpts$optionGro3 = renderOpts.optionGroupProps,
            optionGroupProps = _renderOpts$optionGro3 === void 0 ? {} : _renderOpts$optionGro3;
        var column = params.column;
        var attrs = renderOpts.attrs,
            events = renderOpts.events;
        var props = getProps(params, renderOpts, {
          transfer: true
        });
        var type = 'on-change';

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return column.filters.map(function (item) {
            return h('Select', {
              props: props,
              attrs: attrs,
              model: {
                value: item.data,
                callback: function callback(optionValue) {
                  item.data = optionValue;
                }
              },
              on: getFilterEvents(_defineProperty({}, type, function (value) {
                handleConfirmFilter(params, column, value && value.length > 0, item);

                if (events && events[type]) {
                  events[type](params, value);
                }
              }), renderOpts, params)
            }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
              return h('OptionGroup', {
                props: {
                  label: group[groupLabel]
                },
                key: gIndex
              }, renderOptions(h, group[groupOptions], optionProps));
            }));
          });
        }

        return column.filters.map(function (item) {
          return h('Select', {
            props: props,
            attrs: attrs,
            model: {
              value: item.data,
              callback: function callback(optionValue) {
                item.data = optionValue;
              }
            },
            on: getFilterEvents(_defineProperty({}, type, function (value) {
              handleConfirmFilter(params, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](params, value);
              }
            }), renderOpts, params)
          }, renderOptions(h, options, optionProps));
        });
      },
      filterMethod: function filterMethod(_ref6) {
        var option = _ref6.option,
            row = _ref6.row,
            column = _ref6.column;
        var data = option.data;
        var property = column.property,
            renderOpts = column.filterRender;
        var _renderOpts$props4 = renderOpts.props,
            props = _renderOpts$props4 === void 0 ? {} : _renderOpts$props4;

        var cellValue = _xeUtils["default"].get(row, property);

        if (props.multiple) {
          if (_xeUtils["default"].isArray(cellValue)) {
            return _xeUtils["default"].includeArrays(cellValue, data);
          }

          return data.indexOf(cellValue) > -1;
        }
        /* eslint-disable eqeqeq */


        return cellValue == data;
      },
      renderItem: function renderItem(h, renderOpts, params) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _renderOpts$optionPro5 = renderOpts.optionProps,
            optionProps = _renderOpts$optionPro5 === void 0 ? {} : _renderOpts$optionPro5,
            _renderOpts$optionGro4 = renderOpts.optionGroupProps,
            optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
        var data = params.data,
            property = params.property;
        var attrs = renderOpts.attrs;
        var props = getFormItemProps(params, renderOpts);

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return [h('Select', {
            props: props,
            attrs: attrs,
            model: {
              value: _xeUtils["default"].get(data, property),
              callback: function callback(cellValue) {
                _xeUtils["default"].set(data, property, cellValue);
              }
            },
            on: getFormEvents(renderOpts, params)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
            return h('OptionGroup', {
              props: {
                label: group[groupLabel]
              },
              key: gIndex
            }, renderOptions(h, group[groupOptions], optionProps));
          }))];
        }

        return [h('Select', {
          props: props,
          attrs: attrs,
          model: {
            value: _xeUtils["default"].get(data, property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(data, property, cellValue);
            }
          },
          on: getFormEvents(renderOpts, params)
        }, renderOptions(h, options, optionProps))];
      },
      cellExportMethod: createExportMethod(getSelectCellValue),
      editCellExportMethod: createExportMethod(getSelectCellValue, true)
    },
    Cascader: {
      renderEdit: createEditRender({
        transfer: true
      }),
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getCascaderCellValue(renderOpts, params));
      },
      renderItem: createFormItemRender(),
      cellExportMethod: createExportMethod(getCascaderCellValue),
      editCellExportMethod: createExportMethod(getCascaderCellValue, true)
    },
    DatePicker: {
      renderEdit: createEditRender({
        transfer: true
      }),
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getDatePickerCellValue(renderOpts, params));
      },
      renderFilter: function renderFilter(h, renderOpts, params) {
        var column = params.column;
        var attrs = renderOpts.attrs,
            events = renderOpts.events;
        var props = getProps(params, renderOpts, {
          transfer: true
        });
        var type = 'on-change';
        return column.filters.map(function (item) {
          return h(renderOpts.name, {
            props: props,
            attrs: attrs,
            model: {
              value: item.data,
              callback: function callback(optionValue) {
                item.data = optionValue;
              }
            },
            on: getFilterEvents(_defineProperty({}, type, function (value) {
              handleConfirmFilter(params, column, !!value, item);

              if (events && events[type]) {
                events[type](params, value);
              }
            }), renderOpts, params)
          });
        });
      },
      filterMethod: function filterMethod(_ref7) {
        var option = _ref7.option,
            row = _ref7.row,
            column = _ref7.column;
        var data = option.data;
        var renderOpts = column.filterRender;
        var _renderOpts$props5 = renderOpts.props,
            props = _renderOpts$props5 === void 0 ? {} : _renderOpts$props5;

        var cellValue = _xeUtils["default"].get(row, column.property);

        if (data) {
          switch (props.type) {
            case 'daterange':
              return equalDaterange(cellValue, data, props, 'yyyy-MM-dd');

            case 'datetimerange':
              return equalDaterange(cellValue, data, props, 'yyyy-MM-dd HH:ss:mm');

            default:
              return cellValue === data;
          }
        }

        return false;
      },
      renderItem: createFormItemRender(),
      cellExportMethod: createExportMethod(getDatePickerCellValue),
      editCellExportMethod: createExportMethod(getDatePickerCellValue, true)
    },
    TimePicker: {
      renderEdit: createEditRender({
        transfer: true
      }),
      renderItem: createFormItemRender()
    },
    Rate: {
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    iSwitch: {
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    Radio: {
      renderItem: createFormItemRadioAndCheckboxRender()
    },
    Checkbox: {
      renderItem: createFormItemRadioAndCheckboxRender()
    },
    Button: {
      renderEdit: defaultButtonEditRender,
      renderDefault: defaultButtonEditRender,
      renderItem: defaultButtonItemRender
    },
    Buttons: {
      renderEdit: defaultButtonsEditRender,
      renderDefault: defaultButtonsEditRender,
      renderItem: defaultButtonsItemRender
    },
    ElInputNumber: {
      autofocus: 'input.el-input__inner',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
  };
  /**
   * 事件兼容性处理
   */

  function handleClearEvent(params, evnt, context) {
    var $table = params.$table;
    var getEventTargetNode = $table ? $table.getEventTargetNode : context.getEventTargetNode;
    var bodyElem = document.body;

    if ( // 下拉框、日期
    getEventTargetNode(evnt, bodyElem, 'ivu-select-dropdown').flag) {
      return false;
    }
  }
  /**
   * 基于 vxe-table 表格的适配插件，用于兼容 iview 组件库
   */


  var VXETablePluginIView = {
    install: function install(xtable) {
      var interceptor = xtable.interceptor,
          renderer = xtable.renderer;
      renderer.mixin(renderMap);
      interceptor.add('event.clearFilter', handleClearEvent);
      interceptor.add('event.clearActived', handleClearEvent);
    }
  };
  _exports.VXETablePluginIView = VXETablePluginIView;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginIView);
  }

  var _default = VXETablePluginIView;
  _exports["default"] = _default;
});
