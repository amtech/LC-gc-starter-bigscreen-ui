## 📚简介
<p align="center">
  <img alt="logo" width="50" src="./doc/logo.png">
</p>

🔥基于SpringBoot、MyBatisPlus、ElementUI、G2Plot、Echarts等技术栈的大屏设计器，具备大屏目录管理、大屏设计、大屏预览能力，支持MySQL、Oracle、PostgreSQL、JSON等数据集接入，对于复杂数据处理还可以使用Groovy脚本数据集，使用简单，完全免费，代码开源。

<p align="center">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/gcpaas/gc-starter-bigscreen-ui?style=social">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/gcpaas/gc-starter-bigscreen-ui?style=social">
  <img alt="GitHub license" src="https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg">
    <img alt="npm" src="https://img.shields.io/npm/v/gc-starter-bigscreen-ui">
  <img alt="Company" src="https://img.shields.io/badge/Author-科大国创云网科技有限公司-blue.svg">
    <img alt="QQ" src="https://img.shields.io/badge/QQ-322302395-blue.svg">
</p>

-------------------------------------------------------------------------------

## 📝 文档

[📘中文文档](https://www.yuque.com/chuinixiongkou/bigscreen/index)


# 大屏组件使用
## 一、安装

``` bash
npm install gc-starter-bigscreen-ui
```

## 二、组件使用

### 1. 注册配置
#### 1.1 在 `main.js` 注册基础配置
在您的框架中，大屏接口的baseURL（需要启动大屏后端服务）可能有所不同，所以需要注册一些基础配置，如下：

```javascript
// 组件依赖于 element-ui，所以需要引入element-ui, 并导入其样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'mini' })

// 全局引入css
import { registerConfig } from 'gc-starter-bigscreen-ui'
import 'gc-starter-bigscreen-ui/lib/bigScreen.css'

// 第二个参数router是路由实例，添加后内部将会为您注册路由，快速访问，不写则不注册
registerConfig({
  routers: {
    // 大屏设计路由
    designUrl: '/bigscreen/design',
    // 预览路由
    previewUrl: '/bigscreen/preview',
    // 页面管理路由（带头部跳转路由）
    pageManagementUrl: '/',
    // 页面列表路由
    pageListUrl: '/big-screen-list',
    // 模版列表
    templateListUrl: '/big-screen-template',
    // 数据源管理
    dataSourceUrl: '/big-screen-dataSource',
    // 数据集管理
    dataSetUrl: '/big-screen-dataSet'
  },
  httpConfigs: {
    baseURL: window.CONFIG?.baseUrl
  },
  customTheme: {
    '--bs-background-1': '#151a26', // 黑色
    '--bs-background-2': '#232832', // 灰色
    '--bs-background-3': '#212326',
    '--bs-background-design-inner': '#1d1e20',
    '--bs-el-background': '#151A26',
    '--bs-el-background-2': '#35393F',
    '--bs-el-background-3': '#303640', // 表头背景色
    '--bs-el-title': '#87888E', // 白色字体
    '--bs-el-text': '#ffffff', // 激活白色字体
    '--bs-el-hover': '#007aff',
    '--bs-el-border-color': 'transparent'
  },
  customPlots: []
}, router)

```

- Q: 如何使用系统内已经存在的配置，比如baseURL 在window.baseURL上已经绑定，根据环境不同这个baseURL不同而不一样，怎么写。
- A:  可这样写

````js
registerConfig({
  // 自定义http配置
  httpConfigs: {
    baseURL: window.baseURL // 必填 
  }
  // ...  
}, router)
````

- Q: 如何使用在 .env.prod   、 .env.dev中的变量？
- A: 比如，在 .env.prod   、 .env.dev中定义了 VUE_APP_BASE_URL （必须以VUE_APP_开头），在js中这么取即可

```js
registerConfig({
  httpConfigs: {
    baseURL: process.env.VUE_APP_BASE_URL
  }
  // ...  
}, router)
```



#### 1.2 引入大屏运行器所需要的vuex模块

```js
// 其他代码省略
// 此处引入页面运行器vuex模块
import { $bigScreen } from 'gc-starter-bigscreen-ui'
const store = new Vuex.Store({
  modules: {
    // 此处导出大屏所需vuex模块
    bigScreen: $bigScreen.bigScreenStore
  }
})
export default store

```

### 2. 快速访问（不用建页面，直接访问）

启动项目后，可分别访问

（此处假设前端基础路径为 localhost:8080）
下面的路由地址和在main.js 中 registerConfig 注入的配置一致

```js
localhost:8080/management
localhost:8080/big-screen/design?code=xxx
localhost:8080/big-screen/preview?code=xxx
localhost:8080/data-source-manage
```

⚠️ 请注意，快速注入的路由，如果您的系统对路由有权限要求，要想正常访问，请先务必加入白名单。

### 3. 自定义页面路由

首先关闭自动注册路由, 第二个参数不传入router对象即可

```javascript
registerConfig({
 // 路由
  routers: {
    // 大屏设计路由 必填
    designUrl: 'big-screen/design',
    // 预览路由    必填
    previewUrl: '/big-screen/preview'
  },
  // 自定义http配置
  httpConfigs: {
    baseURL: 'http://127.0.0.1:8081/bigScreenServer' // 必填 
  }
})

```
#### 3.1 大屏管理页页面
> 在组件中引入设计器组件
```vue
<template>
  <BigScreenManagement />
</template>
<script>
import { BigScreenManagement } from 'gc-starter-bigscreen-ui'
export default {
  components: {
    BigScreenManagement
  }
}
</script>
```

#### 3.2 设计态页面

> 在组件中引入设计器组件
引用该组件的路由必须包含code参数，code参数为页面的唯一标识

```vue
<template>
  <!-- code为大屏设计时的编码，你可以携带到本页面路由中获取 -->
  <BigScreenDesign ref="BigScreenDesign" :header-show="headerShow" :code="code" />
</template>
<script>
import { BigScreenDesign } from "gc-starter-bigscreen-ui";
export default {
  components: {
    BigScreenDesign,
  },
  data() {
    return {
      // 是否展示头部，可隐藏后自己写头部
      headerShow: true,
      // 当头部隐藏后，用户自己设置的头部高度不定，我们可自定义此时下方的设计器高度
      height: '100vh'
    };
  },
  computed: {
    code() {
      return this.$route.query.code;
    },
  },
  methods: {
    // 下面是其方法
    // 保存并预览
    saveAndPreview() {
      this.$refs.BigScreenDesign.saveAndPreview();
    },
    // 保存
    save() {
      this.$refs.BigScreenDesign.save();
    },
    // 清空
    empty() {
      this.$refs.BigScreenDesign.empty();
    },
  },
};
</script>
```

#### 3.3 运行态页面

> 在组件中引入运行态组件
> 引用该组件的路由必须包含code参数，code参数为页面的唯一标识

```vue
<template>
  <!-- code为大屏运行时的编码，你可以携带到本页面路由中获取 -->
  <BigScreenRun :code="code"/>
</template>
<script>
  import { BigScreenRun }  from 'gc-starter-bigscreen-ui'
  export default {
    components: {
      BigScreenRun
    },
    computed: {
      code() {
        return this.$route.query.code
      }
    }
  }
</script>
```





#### 3.4 数据源管理页面

```vue
<template>
  <DataSourceManagement />
</template>
<script>
  import { DataSourceManagement }  from 'gc-starter-bigscreen-ui'
  export default {
    components: {
      DataSourceManagement
    }
  }
</script>
```



#### 3.5 数据集管理页面

```vue
<template>
  <DataSetManagement />
</template>
<script>
  import { DataSetManagement }  from 'gc-starter-bigscreen-ui'
  export default {
    components: {
      DataSetManagement
    }
  }
</script>
```

#### 3.6 创建路由

为 步骤3 中的页面创建路由，即可使用，路由和registerConfig注册的路径保持一致