
// 分类
const category = 'Gauge'
// 标题
const title = '仪表盘'
// 类别， new Gauge()
const chartType = 'Gauge'
// 用于标识，唯一，和文件夹名称一致
const name = 'YiBiaoPan'

// 右侧配置项
const setting = [
  {
    label: '指标',
    // 设置组件类型
    type: 'select',
    // 字段
    field: 'percent',
    // 对应options中的字段
    optionField: 'percent',
    // 是否多选
    multiple: false,
    value: '',
    tabName: 'data'
  },
  {
    label: '表盘类型',
    // 设置组件类型
    type: 'select',
    // 字段
    field: 'type',
    // 对应options中的字段
    optionField: 'type',
    // 是否多选
    multiple: false,
    value: '',
    tabName: 'custom',
    options: [
      {
        label: '默认',
        value: ''
      },
      {
        label: '米轨',
        value: 'meter'
      }
    ]
  },
  {
    label: '表盘颜色',
    // 设置组件类型
    type: 'colorPicker',
    // 字段
    field: 'range_color',
    // 对应options中的字段
    optionField: 'range.color',
    value: '#30BF78',
    tabName: 'custom'
  },
  {
    label: '标签字体颜色',
    // 设置组件类型
    type: 'colorPicker',
    // 字段
    field: 'statistic_content_style_color',
    // 对应options中的字段
    optionField: 'statistic.content.style.color',
    value: '#d0d0d0',
    tabName: 'custom'
  },
  {
    label: '标签字体大小',
    // 设置组件类型
    type: 'inputNumber',
    // 字段
    field: 'statistic_content_style_fontSize',
    // 对应options中的字段
    optionField: 'statistic.content.style.fontSize',
    value: '48',
    tabName: 'custom'
  },
  {
    label: '图表边距',
    type: 'padding', // 设置组件类型
    field: 'appendPadding', // 字段
    optionField: 'appendPadding', // 对应options中的字段
    value: [20, 20, 20, 20],
    tabName: 'custom'
  }
]

// 数据处理脚本
const dataHandler = 'option.percent = data[0][setting.filter(settingItem=>settingItem.field === \'percent\')[0].value]'

// 图表配置 new Gauge('domName', option)
const option = {
  percent: 0.75,
  appendPadding: [20, 20, 20, 20], // 设置图标的边距
  range: {
    color: '#30BF78'
  },
  indicator: {
    pointer: {
      style: {
        stroke: '#D0D0D0'
      }
    },
    pin: {
      style: {
        stroke: '#D0D0D0'
      }
    }
  },
  axis: {
    label: {
      formatter (v) {
        return Number(v) * 100
      }
    },
    subTickLine: {
      count: 3
    }
  },
  statistic: {
    content: {
      formatter: ({ percent }) => `Rate: ${(percent * 100).toFixed(0)}%`,
      style: {
        color: '#d0d0d0',
        fontSize: 48
      }
    }
  }
}
export default {
  category,
  title,
  chartType,
  name,
  option,
  setting,
  dataHandler
}
