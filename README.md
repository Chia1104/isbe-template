<p align="center">
  <a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
</p>

# Isbe

Isbe 用於快速建立專案模版，減少前期建置專案所花費時間，建構工具設定、library 選用、風格和檔案配置統一。並加入 pre-commit ，commit 前檢查 eslint、prettier 符合規範才能成功 commit push。

### 檔案結構

- assets - 樣式和圖片
- components - 共用元件
- contexts - 跨層元件資料管理
- hooks - 重復使用的羅輯
- locales - 多國語系
- router - 路由
- services - RTK query、API
- store - 全域資料
- themes - 風格設定
- utils - 工具

### 如何使用

```sh
npm run start
```

https://localhost:3000

# 權限及功能控制

## 權限控制

### 路由權限控制

需在路由設定頁面所需權限

### `routes.json`

```ts
{
  "title": "title.todo.list",
  "icon": "info",
  "path": "list",
  "acl": ["channel.read"], // 權限設定
  "element": "pages/todo/List",
  "order": 1,
  "children": []
}
```

### 元件權限控制

使用 `Permission` 元件包裹需設定權限之元件

```tsx
import Permission from "@/components/ACL/Permission";

function App() {
  const acl = ["channel.read"];
  return (
    <Permission acl={acl}>
      <Component /> // 需權限控制顯示的元件
    </Permission>
  );
}
```

## 功能控制

使用 `FeatureToggle` 元件包裹需設定功能開關之元件

```tsx
import Permission from "@/components/ACL/FeatureToggle";

function App() {
  return (
    <FeatureToggle id={"pages/todo/Create"}>
      <Component /> // 需功能開關顯示的元件
    </FeatureToggle>
  );
}
```

並且在`project.config.json`中的`featureAcl`設定

```json
{
  "featureAcl": {
    "filed": "input",
    "description": "功能存取控制列表",
    "value": {
      // 前端判定用唯一值
      "pages/todo/Create": [
        "todoCreate" // 後端回傳的featureToggle key
      ]
    }
  }
}
```
