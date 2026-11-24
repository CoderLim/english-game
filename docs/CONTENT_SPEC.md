# 内容系统与教材映射

## 教材版本

- 人教 PEP（2024 新版）三年级上册
- 教材目录：https://www.pep.com.cn/zslth/yyptypzj/xypep/3s/
- 教材理念：https://www.pep.com.cn/xw/zt/hd/12/xjcjs/xx/202409/t20240920_1995564.html
- Unit 1: **Making friends**。核心模块：Part A Let's talk、Let's learn、Letters and sounds；Part B Let's talk、Let's learn、Start to read；Part C 综合活动。

注意：游戏使用**原创对话、原创剧情、原创练习**，并非复制教材插图、音频或课文。知识点标记为 core（对应教学目标）或 extension（原创拓展）。正式商业上线前仍需教学编辑逐项核对。

## 学习引擎

`TextbookUnit` → `KnowledgePoint` → `Challenge` → `Attempt` → `ReviewEntry`。

- 知识点和任务是多对多关系。当前 MVP 每道题只记录一个主要测量维度，避免一次答对同时把听、说、读都算作掌握。
- `skill` 细分 listening、recognition、reading、speaking，不能将选择题当作真实口语评分。
- `mode` 包括 choice、robot-tap、self-recall。self-recall 是孩子自己说完后自评，不使用 ASR。
- 间隔：1、3、7、14、30 天初始梯度；一次独立正确最多每天升一级。
- 非独立正确及错误安排 15 分钟后的补练，不触发独立掌握升级。
- 调度只选择教师编写的复习变体，避免重复同一道题。如果某知识点缺少变体，不会进入自动复习队列；发布后需要内容覆盖校验。

## 全册世界规划

1. Making friends — 友谊森林（目前仅两个关卡可玩）
2. Different families — 家庭小镇
3. Amazing animals — 动物岛
4. Plants around us — 魔法花园
5. The colourful world — 彩虹城
6. Useful numbers — 数字王国
7. Revision / Being a good guest — 好客城堡

未来内容均显示为尚未开放，不得虚构已支持单元。

## Unit 1 课程蓝图

| 关卡 | 板块 | 学习目标 | 状态 |
| --- | --- | --- | --- |
| 1. 森林里的新朋友 | Part A Let's talk | 问候、自我介绍、见面问候 | 已实现 |
| 2. 机器人需要帮助 | Part A Let's learn | ear / eye / mouth / hand / arm | 已实现 |
| 3. 字母石门 | Part A Letters and sounds | Aa、Bb、Cc、Dd | 规划 |
| 4. 玩具分享日 | Part B Let's talk | 感谢、分享 | 规划 |
| 5. 谁是好朋友 | Part B Let's learn / Start to read | smile / listen / help / share、阅读 | 规划 |
| 6. 友谊庆典 | Part C / 综合 | 跨知识点综合应用 | 规划 |

## 内容发布校验

- 正式教材核心知识点全部应有至少一种任务及一种复习变体；第一版 **未达到整个 Unit 1 全覆盖**。
- 内容 ID 稳定、唯一；不能重复占用。
- 每题必须绑定有效知识点，正确答案必须存在于选项或有效交互目标。
- 多种语音与设备条件下人工试听；生产环境建议提供审核过的离线音频替代浏览器 TTS。
- 含未成年人数据的产品应以最小化采集为原则。当前版本无账号、无服务器、无摄像头和语音上传，仅浏览器 localStorage 保存表现。
