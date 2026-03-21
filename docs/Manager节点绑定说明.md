# Manager 节点绑定说明

此文档介绍各 Manager 脚本在 Cocos Creator 中的节点挂载和属性配置要求。

---

## 概览

| Manager | 节点绑定要求 | 说明 |
|---------|-------------|------|
| GameManager | 不需要 | 纯逻辑脚本，无需绑定节点 |
| UIManager | 必须 | 绑定所有 UI 层节点 |
| DataManager | 不需要 | 纯数据脚本，无需绑定节点 |
| ResourceManager | 不需要 | 纯资源管理脚本，无需绑定节点 |
| SceneViewManager | 不需要 | 自动创建场景节点 |嵩
| DialogManager | 不需要 | 纯逻辑脚本，无需绑定节点 |
| InventoryManager | 不需要 | 纯逻辑脚本，无需绑定节点 |
| InteractableManager | 不需要 | 纯逻辑脚本，无需绑定节点 |

---

## UIManager

**挂载位置**：UI 根节点（如 `Canvas/UI`）

**必须绑定的节点**（@property）：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| fullscreenLayer | Node | 全屏层（视频、开场动画、结局等全屏内容） |
| gameLayer | Node | 游戏层（场景、交互 UI） |
| mainMenu | Node | 主菜单面板 |
| pauseMenu | Node | 暂停菜单面板 |
| gameOverScreen | Node | 游戏结束画面 |
| inventoryPanel | Node | 背包面板 |
| menuPanel | Node | 游戏内菜单面板 |
| dialogPanel | Node | 对话框面板 |
| videoPlayer | Node | 视频播放器节点 |
| introCutscene | Node | 开场对话动画节点 |
| sceneContainer | Node | 场景容器节点（可选，不绑定则使用 SceneViewManager 自身节点） |

**节点层级建议**：
```
Canvas
├── UIManager (挂载脚本)
├── fullscreenLayer
│   ├── videoPlayer
│   ├── introCutscene
│   └── mainMenu
├── gameLayer
│   ├── sceneContainer  ← SceneViewManager 在此创建场景节点
│   ├── inventoryPanel
│   ├── menuPanel
│   └── dialogPanel
└── pauseMenu / gameOverScreen
```

---

## SceneViewManager

**挂载位置**：任意节点（通常与 UIManager 同级或作为其子节点）

**节点绑定**：无（自动创建）

**自动创建的节点**：
- `_currentSceneNode`：当前场景节点，由 `initializeSceneNodes()` 在 `start()` 时创建

**行为说明**：
- 如果 `sceneContainer`（UIManager 提供）存在，场景节点创建在其下方
- 如果 `sceneContainer` 不存在，创建在 SceneViewManager 所在节点下方

---

## GameManager

**挂载位置**：任意持久节点（建议与 UIManager 同级）

**节点绑定**：无

**特殊说明**：
- 通过 `director.addPersistRootNode()` 保持持久
- 负责监听游戏流程事件（INTRO_COMPLETE、START_NEW_GAME 等）

---

## DataManager

**挂载位置**：任意节点

**节点绑定**：无

**特殊说明**：
- 通过 `director.addPersistRootNode()` 保持持久
- 负责游戏数据持久化（localStorage）

---

## ResourceManager

**挂载位置**：任意节点

**节点绑定**：无

**特殊说明**：
- 通过 `director.addPersistRootNode()` 保持持久
- 负责资源加载和缓存

---

## DialogManager / InventoryManager / InteractableManager

**挂载位置**：任意节点

**节点绑定**：无

**特殊说明**：
- 都是通过 `director.addPersistRootNode()` 保持持久
- 纯逻辑管理器，不直接操作节点

---

## 快速配置清单

在 Cocos Creator 中配置项目时，按以下顺序操作：

1. **创建持久节点结构**：
   ```
   Canvas
   ├── Managers
   │   ├── GameManager
   │   ├── DataManager
   │   ├── UIManager
   │   ├── ResourceManager
   │   ├── SceneViewManager
   │   ├── DialogManager
   │   ├── InventoryManager
   │   └── InteractableManager
   └── UI
       ├── fullscreenLayer
       ├── gameLayer
       └── ...
   ```

2. **配置 UIManager**：在 UIManager 节点的属性检查器中，绑定所有 UI 节点

3. **其他 Manager**：直接挂载脚本，无需配置任何属性

4. **sceneContainer**（可选）：
   - 如果场景节点需要放在特定位置，创建 `sceneContainer` 节点并绑定到 UIManager
   - 如果不绑定，SceneViewManager 使用自身节点作为场景容器

---

## 常见问题

**Q：为什么 SceneViewManager 不需要绑定节点？**
A：场景节点是动态创建的（通过 `instantiate(prefab)`），不需要预配置的节点引用。代码在 `start()` 时自动创建 `_currentSceneNode`。

**Q：UIManager 的 fullscreenLayer 和 gameLayer 层级关系？**
A：`fullscreenLayer` 在上（Z 轴或层级更高），用于全屏内容；`gameLayer` 在下，用于游戏内 UI。切换时通过 `active` 属性控制显隐。

**Q：sceneContainer 不存在会报错吗？**
A：不会。代码使用 `UIManager.instance?.sceneContainer ?? this.node`，如果 UIManager 未初始化或未配置 sceneContainer，会 fallback 到 SceneViewManager 所在节点。
