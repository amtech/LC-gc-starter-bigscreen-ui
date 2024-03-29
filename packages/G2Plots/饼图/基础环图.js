
// 分类
const category = 'Pie'
// 标题
const title = '基础环图'
// 类别， new Line()
const chartType = 'Pie'
// 用于标识，唯一，和文件夹名称一致
const name = 'JiChuHuanTu'

// 右侧配置项
const setting = [
  {
    label: '维度',
    // 设置组件类型， select / input / colorPicker
    type: 'select',
    // 字段
    field: 'colorField',
    // 对应options中的字段
    optionField: 'colorField',
    // 是否多选
    multiple: false,
    value: '',
    // tab页。 data: 数据， custom: 自定义
    tabName: 'data'
  },
  {
    label: '指标',
    // 设置组件类型
    type: 'select',
    // 字段
    field: 'angleField',
    // 对应options中的字段
    optionField: 'angleField',
    // 是否多选
    multiple: false,
    value: '',
    tabName: 'data'
  },
  {
    label: '图例位置',
    // 设置组件类型
    type: 'select',
    // 字段
    field: 'legend_position',
    // 对应options中的字段
    optionField: 'legend.position',
    // 是否多选
    multiple: false,
    value: 'right',
    tabName: 'custom',
    options: [
      { label: '顶部', value: 'top' },
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
      { label: '底部', value: 'bottom' }
    ]
  },
  {
    label: '标签位置',
    // 设置组件类型
    type: 'radio',
    // 字段
    field: 'label_type',
    // 对应options中的字段
    optionField: 'label.type',
    value: 'inner',
    tabName: 'custom',
    options: [
      { label: '外部', value: 'outer' },
      { label: '内部', value: 'inner' },
      { label: '蜘蛛布局', value: 'spider' }
    ]
  },
  {
    label: '标签连线颜色',
    // 设置组件类型
    type: 'colorPicker',
    // 字段
    field: 'label_labelLine_style_stroke',
    // 对应options中的字段
    optionField: 'label.labelLine.style.stroke',
    value: '#5B8FF9',
    tabName: 'custom'
  },
  {
    label: '标签连线透明度',
    // 设置组件类型
    type: 'inputNumber',
    // 字段
    field: 'label_labelLine_style_opacity',
    // 对应options中的字段
    optionField: 'label.labelLine.style.opacity',
    value: '0.6',
    tabName: 'custom'
  },
  {
    label: '颜色配置',
    // 设置组件类型
    type: 'colorSelect',
    // 字段
    field: 'color',
    // 对应options中的字段
    optionField: 'color',
    value: ['#5B8FF9', '#61DDAA', '#5D7092', '#F6BD16', '#6F5EF9', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3'],
    tabName: 'custom'
  },
  {
    label: '统计标题',
    // 设置组件类型
    type: 'input',
    // 字段
    field: 'statistic_title_content',
    // 对应options中的字段
    optionField: 'statistic.title.content',
    value: '总计',
    tabName: 'custom'
  },
  {
    label: '统计正文',
    // 设置组件类型
    type: 'input',
    // 字段
    field: 'statistic_content_content',
    // 对应options中的字段
    optionField: 'statistic.content.content',
    value: '100',
    tabName: 'custom'
  },
  {
    label: '统计标题颜色',
    // 设置组件类型
    type: 'colorPicker',
    // 字段
    field: 'statistic_title_style_color',
    // 对应options中的字段
    optionField: 'statistic.title.style.color',
    value: '#d0d0d0',
    tabName: 'custom'
  },
  {
    label: '统计标题大小',
    // 设置组件类型
    type: 'inputNumber',
    // 字段
    field: 'statistic_title_style_fontSize',
    // 对应options中的字段
    optionField: 'statistic.title.style.fontSize',
    value: '30',
    tabName: 'custom'
  },
  {
    label: '统计正文颜色',
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
    label: '统计正文大小',
    // 设置组件类型
    type: 'inputNumber',
    // 字段
    field: 'statistic_content_style_fontSize',
    // 对应options中的字段
    optionField: 'statistic.content.style.fontSize',
    value: '30',
    tabName: 'custom'
  },
  {
    label: '外环半径',
    // 设置组件类型
    type: 'slider',
    // 字段
    field: 'radius',
    // 对应options中的字段
    optionField: 'radius',
    value: 1,
    tabName: 'custom'
  },
  {
    label: '内环半径',
    // 设置组件类型
    type: 'slider',
    // 字段
    field: 'innerRadius',
    // 对应options中的字段
    optionField: 'innerRadius',
    value: 0.6,
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

// 模拟数据
const data = [
  { type: '分类一', value: 27 },
  { type: '分类二', value: 25 },
  { type: '分类三', value: 18 },
  { type: '分类四', value: 15 },
  { type: '分类五', value: 10 },
  { type: '其他', value: 5 }
]

// 数据处理脚本
const dataHandler = ''

// 图表配置 new Pie('domName', option)
const option = {
  appendPadding: [20, 20, 20, 20], // 设置图标的边距
  data,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  legend: {
    // 图例
    position: 'right'
  },
  color: ['#5B8FF9', '#61DDAA', '#5D7092', '#F6BD16', '#6F5EF9', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3'],
  label: {
    type: 'inner',
    labelLine: {
      style: {
        stroke: '#5B8FF9',
        opacity: 0.6
      }
    },
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14
    }
  },
  statistic: {
    title: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: '#d0d0d0',
        fontSize: 20
      },
      content: '总计'
    },
    content: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: '#d0d0d0',
        fontSize: 30
      },
      content: '100'
    }
  },
  // 添加 中心统计文本 交互
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }]
  // interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }]
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
