# Aqua Blog

Astro 静态个人博客，保留原有蓝白构成主义首页、纸张开场和梦核入口。正式网址配置为 `https://aqua14.icu`。域名配置不代表已经部署或完成 DNS 绑定。

## 本地使用

需要 Node.js 22.12 或更新版本，推荐 Node.js 24 LTS。

```powershell
npm ci
npm run dev
```

打开终端显示的本地地址。修改文件后浏览器自动更新。
也可以直接双击项目根目录的 `启动博客.cmd`，保持打开的终端窗口运行，再在浏览器中访问终端显示的地址。

```powershell
npm run check
npm run build
npm run preview
```

发布文件生成在 `dist/`。`preview` 仅用于本地检查构建结果。

## 更新资料与内容

- `src/data/site.ts`：昵称、简介、近期状态、社交链接、首页入口、收藏清单。
- `src/content/projects/*.md`：项目与技术笔记；`kind: project` 是项目，`kind: note` 是技术笔记。
- `src/content/journal/*.md`：日记；`entryType: fragment` 显示在时间轴，`entryType: essay` 显示在长日记列表。
- `public/images/`：可选照片；在入口卡片配置中增加 `image: '/images/文件名.jpg'`。
- 原始 `gemini-code-*` 导出文件保留作参考，网站只读取 `src/` 和 `public/`；以后编辑这些目录里的正式文件。

Markdown 文件名是文章网址的一部分，发布后尽量不改。文件支持子目录。`draft: true` 会从首页、栏目、详情页和站点地图中排除该内容。新文章在重新构建后发布，首页归档按日期自动排序。

项目示例：

```yaml
---
title: "文章标题"
summary: "一句话介绍"
kind: "note"
status: "active"
stack: ["TypeScript"]
pubDate: 2026-11-24
draft: true
---
```

日记示例：

```yaml
---
title: "日记标题"
entryType: "essay"
pubDate: 2026-11-24
draft: true
---
```

在结束的 `---` 后写 Markdown 正文。项目的 `highlights`、`repoUrl`、`demoUrl` 以及日记的 `weather`、`bgm`、`mood` 均为可选项。

目前 WaterCut 简介和亮点仍保留用户提供的待补充文字；小红书链接仍指向平台首页，可在资料文件中改成个人主页。收藏艺术类暂时为空，筛选后显示空状态。

## 发布与域名

使用 GitHub 保存源码、Cloudflare Pages 构建和托管网站。无需 GitHub Pages 部署流程，也无需为此静态站安装 Cloudflare SSR 适配器。

### 1. 上传 GitHub

在 GitHub 创建一个空仓库，例如 `aqua-blog`；已有空仓库可以继续使用原名。不要在创建时添加 README、.gitignore 或许可证。仓库可公开或私有，连接 Cloudflare 时授权访问该仓库。

在项目目录的 PowerShell 中逐条运行（下面的远程地址对应新建的 `aqua-blog` 仓库）：

```powershell
git add .
git commit -m "Initial Aqua blog for Cloudflare Pages"
git remote add origin https://github.com/Xavier14-aqua/aqua-blog.git
git push -u origin main
```

本地 Git 已初始化，无需再次 git init。如果已经配置 origin，运行 `git remote -v` 检查其地址；若正确就跳过添加。如果已有提交，正常提交本次更改后 push 即可。

### 2. 创建 Cloudflare Pages 项目

Cloudflare 控制台 → Workers & Pages → Create application → Pages → Import an existing Git repository / Connect to Git，连接 GitHub 并选择博客仓库。

| 设置 | 值 |
| --- | --- |
| 项目名称 | `aqua-blog` 或其他可用名称 |
| 生产分支 | `main` |
| 框架预设 | `Astro` |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| 根目录 | 留空，使用仓库根目录 |
| 环境变量 NODE_VERSION | `24` |
| 环境变量 SITE_URL | `https://aqua14.icu` |
| 环境变量 ASTRO_TELEMETRY_DISABLED | `1` |

点击 Save and Deploy。部署成功后，先打开平台实际分配的 `*.pages.dev` 地址检查首页与文章。后续推送 main 会自动重新部署。

### 3. 接入根域名 aqua14.icu

根域名绑定 Pages 要求 DNS 由同一 Cloudflare 账号管理。域名仍在阿里云注册，无需转移注册商。

1. 在 Cloudflare 添加域名 `aqua14.icu` 为站点/zone，选择适用的 DNS 方案；普通个人博客可选择 Free。
2. 检查导入的 DNS 记录，保留仍在使用的邮箱等记录。
3. 记录 Cloudflare 为此域名实际分配的两条 nameserver 地址。
4. 在阿里云域名控制台的 DNS 修改页面，把现有 DNS 服务器改成这两条 Cloudflare 地址。不是在解析记录里手动新增两条 NS。
5. 等待 Cloudflare 的域名状态变成 Active。
6. 进入 Pages 项目 → Custom domains → Set up a domain，输入 `aqua14.icu`，按提示确认。Cloudflare 会引导创建对应的 CNAME 记录。
7. 等待自定义域名和证书生效，访问 `https://aqua14.icu` 并检查文章直达地址。

不要填写 GitHub Pages 的四条 A 记录。DNS 由 Cloudflare 接管后，后续解析在 Cloudflare 控制台管理。若需要 `www.aqua14.icu`，也应先在 Pages 自定义域名中添加，再按平台提示设置解析，并按需重定向到根域名。

如果只使用 `blog.aqua14.icu` 这样的子域名，可以保留阿里云 DNS，在 Pages 中先绑定子域名，再在阿里云添加平台要求的 CNAME。当前默认正式网址配置为根域名，如改用子域名，应同步更新 `SITE_URL`。

工程默认主域名为 `https://aqua14.icu`，可通过构建环境变量 `SITE_URL` 覆盖。该配置用于 canonical、站点地图和 robots.txt。Cloudflare Pages 负责提供 HTTPS。

官方参考：[Astro 部署](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)、[Pages Git 集成](https://developers.cloudflare.com/pages/get-started/git-integration/)、[自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)。
