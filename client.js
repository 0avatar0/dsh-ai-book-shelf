window.__ModuleLoader__.load({
  id: '@local/dsh-epub-reader',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const API = 'api/epub-reader'
    const PROGRESS_KEY = 'dsh.epub-reader.progress.v1'
    const FONT_KEY = 'dsh.epub-reader.font.v1'
    const LIBRARY_MODE_KEY = 'dsh.epub-reader.library-mode.v1'
    const PAPER_FONT_KEY = 'dsh.epub-reader.paper-font.v1'
    const PAPER_UI_KEY = 'dsh.epub-reader.paper-ui.v1'
    const BOOK_ACCEPT = '.epub,.pdf,.txt,.text,.md,.markdown,.html,.htm,.xhtml,.fb2,.docx'
    const BOOK_EXTENSIONS = new Set(['.epub', '.pdf', '.txt', '.text', '.md', '.markdown', '.html', '.htm', '.xhtml', '.fb2', '.docx'])
    const CONVERSION_EXTENSIONS = new Set(['.mobi', '.azw3', '.azw'])
    const SOURCE_PREFS_KEY = 'dsh.epub-reader.sources.v1'
    const BUILTIN_SOURCES = [
      { id: 'gutenberg', name: 'Project Gutenberg', url: 'https://www.gutenberg.org/' },
      { id: 'gutenberg-zh', name: 'Project Gutenberg 中文', url: 'https://www.gutenberg.org/browse/languages/zh' },
      { id: 'wikisource', name: '中文维基文库', url: 'https://zh.wikisource.org/' },
      { id: 'wikibooks', name: '中文维基教科书', url: 'https://zh.wikibooks.org/' },
      { id: 'standardebooks', name: 'Standard Ebooks', url: 'https://standardebooks.org/' },
    ]
    const DEFAULT_SOURCE_PREFS = {
      gutenberg: true,
      'gutenberg-zh': true,
      wikisource: false,
      wikibooks: false,
      standardebooks: true,
      customs: [],
    }
    const MAX_CUSTOM_SOURCES = 8
    const PALETTE = [
      ['#1D4ED8', '#0E7490'],
      ['#7C3AED', '#BE185D'],
      ['#B45309', '#B91C1C'],
      ['#047857', '#0F766E'],
      ['#4338CA', '#1D4ED8'],
      ['#9F1239', '#7C2D12'],
      ['#0369A1', '#4338CA'],
      ['#4D7C0F', '#0F766E'],
    ]

    const ZH = {
      'panel.title': 'AI 书架',
      'panel.eyebrow': 'AI BOOK SHELF',
      'library.subtitle': '在 Harness 里读书。外部书籍会自动复制到书架，选中任意文字即可让 AI 结合上下文解释。',
      'library.open': '打开书籍',
      'library.refresh': '刷新书架',
      'library.hide': '隐藏书籍',
      'library.unhide': '取消隐藏',
      'library.delete': '删除书籍',
      'library.confirmDelete': '确认删除？',
      'library.showHidden': '显示隐藏',
      'library.hideHidden': '收起隐藏',
      'library.hiddenBadge': '已隐藏',
      'library.search': '搜索书名或路径',
      'library.emptyTitle': '书架还是空的',
      'library.emptyBody': '把 EPUB、PDF、TXT、Markdown、HTML、FB2 或 DOCX 放进书架目录，或直接从电脑打开。外部文件会在本地复制到书架目录。',
      'library.noMatch': '没有找到匹配的书',
      'library.noMatchBody': '换个关键词，或清空搜索。',
      'library.clearSearch': '清空搜索',
      'library.loading': '正在整理书架…',
      'library.failed': '书架加载失败',
      'library.retry': '重试',
      'library.importing': '正在解析书籍…',
      'library.importingHint': '章节、目录和图片正在本地整理，并保存到书架目录。',
      'library.copyCreated': '已保存副本到 {path}',
      'library.copyReused': '已使用书架中的副本：{path}',
      'library.shelfTab': '书架',
      'library.onlineTab': '在线搜书',
      'library.onlineTitle': '搜索公版书',
      'library.onlineBody': '从 Project Gutenberg 和 Standard Ebooks 搜索，下载后自动存入书架。',
      'library.onlinePlaceholder': '书名、作者或关键词',
      'library.searchAction': '搜索',
      'library.stopSearch': '停止搜索',
      'library.searching': '正在搜索公版书…',
      'library.searchingMore': '已显示部分书源，正在继续搜索其他书源…',
      'library.searchFailed': '搜索失败',
      'library.noResults': '没有找到公版书',
      'library.noResultsBody': '换个关键词试试，或改用作者名搜索。两个书源以英文公版书为主，中文书覆盖有限。',
      'library.sourceLanguageHint': '中文公版源：Project Gutenberg 中文、中文维基文库、中文维基教科书（自动尝试简体/繁体）；其他书源以英文为主。',
      'library.simplifiedReminder': '简体中文书源较少，建议手动输入书源网址，如仍无法查找，请手动下载书籍导入。',
      'library.supportedFormats': '支持格式：EPUB、PDF、TXT、Markdown、HTML、FB2、DOCX',
      'library.chooseSources': '选择书源',
      'library.sourcePickerTitle': '选择书源',
      'library.sourceBuiltin': '内置书源',
      'library.sourceCustom': '自定义 OPDS 书源',
      'library.sourceCustomUrl': 'OPDS 搜索地址（用 {query} 表示关键词）',
      'library.sourceCustomName': '显示名称（可选）',
      'library.sourceCustomHint': '可添加多个 OPDS 源；仅支持标记为开放获取（open-access）的 EPUB。格式为 网址/opds?q={query}。',
      'library.sourceCustomExample': '如书源网址为 https://example.org，需要填入 https://example.org/opds?q={query}。',
      'library.addCustomSource': '添加书源',
      'library.noCustomSources': '还没有自定义书源，点“添加书源”创建。',
      'library.removeSource': '删除这个书源',
      'library.customLimit': '最多添加 8 个自定义书源',
      'library.sourceApply': '应用',
      'library.sourceDone': '完成',
      'library.sourceInvalid': '请输入有效的 http(s) OPDS 地址',
      'library.noSource': '至少选择一个书源',
      'library.sourceLinks': '书源',
      'library.customSource': '自定义书源',
      'library.download': '下载并打开',
      'library.downloading': '下载中…',
      'library.downloadFailed': '下载失败',
      'library.publicDomain': '公版',
      'library.results': '找到 {count} 本',
      'library.sources': '来源',
      'library.searchHint': '仅索引公版书；下载文件会保存到书架目录。',
      'library.warning': '部分书源暂时不可用',
      'library.importFailed': '导入失败',
      'library.conversionRequired': 'MOBI / AZW3 需要先用 Calibre 等工具转换为 EPUB 或 PDF',
      'library.openFailed': '打开失败',
      'library.progress': '读到第 {chapter} 章',
      'library.unread': '未开始',
      'library.chapterCount': '{count} 章',
      'library.found': '共 {count} 本书',
      'library.source': '书架目录',
      'library.noRoot': '没有可用的书架目录，请把 EPUB 放进当前工作区。',
      'library.openLocal': '打开本地书籍',
      'library.dragHint': '也可以把书籍文件拖到这里',
      'papers.mode': '论文模式',
      'papers.close': '关闭',
      'dossiers.mode': '卷宗模式',
      'dossiers.title': '卷宗库',
      'dossiers.subtitle': '按文件夹整理卷宗，支持全选导入、全文搜索、AI 总结和文件夹 Skill。',
      'dossiers.import': '导入卷宗',
      'dossiers.importing': '正在导入卷宗…',
      'dossiers.importFailed': '卷宗导入失败',
      'dossiers.newFolder': '新建卷宗文件夹',
      'dossiers.all': '全部卷宗',
      'dossiers.root': '未分类',
      'dossiers.searchPlaceholder': '搜索当前文件夹内的卷宗',
      'dossiers.searchEmpty': '没有找到匹配的卷宗',
      'dossiers.searchEmptyHint': '试试更短的关键词，或切换到“全部卷宗”。',
      'dossiers.empty': '这个卷宗文件夹还是空的',
      'dossiers.emptyHint': '导入卷宗文件；可以按住 Ctrl / Cmd 或按 Ctrl+A 全选多个文件。文件名正好是 SKILL.md 的 Markdown 会作为该文件夹的 Skill。',
      'dossiers.skillHint': '提示：一次可全选多个文件；把 SKILL.md 和卷宗一起导入，AI 总结时会优先遵循该 Skill。',
      'dossiers.skills': '文件夹 Skill',
      'dossiers.expand': '展开 Skill',
      'dossiers.collapse': '收起 Skill',
      'dossiers.createSkill': '新建 Skill',
      'dossiers.noSkill': '还没有 Skill。新建文件夹会自动生成一个空 Skill。',
      'dossiers.skillEmptyHint': '空 Skill，点击填写',
      'dossiers.editSkill': '编辑 Skill',
      'dossiers.skillEditorHint': '在这里写下这个卷宗的总结要求，例如关注的时间线、风险、输出格式。保存后 AI 总结会按它执行。',
      'dossiers.skillPlaceholder': '# 卷宗总结 Skill\n\n请填写：\n- 需要重点关注的事实和时间线\n- 风险判断标准\n- 希望输出的格式',
      'dossiers.save': '保存',
      'dossiers.summary': 'AI 总结',
      'dossiers.summaryTitle': 'AI 卷宗总结',
      'dossiers.summarySearchTitle': 'AI 总结搜索结果',
      'dossiers.summarizing': '正在分析卷宗…',
      'dossiers.summaryPreparing': '正在准备总结…',
      'dossiers.followUpPlaceholder': '继续追问 AI 总结…',
      'dossiers.followUpSelectedPlaceholder': '追问选中的总结文字…',
      'dossiers.followUpHint': '可直接输入追问，或先用鼠标选中上方总结文字。',
      'dossiers.selectedSummary': '已选中总结',
      'dossiers.clearSelection': '清除选中',
      'dossiers.askSelected': '请解释我选中的这段总结。',
      'dossiers.followUpLabel': '追问',
      'dossiers.thinking': '正在思考…',
      'dossiers.send': '追问',
      'dossiers.searching': '搜索中…',
      'dossiers.stopSearch': '停止搜索',
      'dossiers.searchCount': '找到 {count} 个',
      'dossiers.clear': '清空卷宗',
      'dossiers.clearTitle': '清空「{name}」卷宗？',
      'dossiers.clearHint': '将把当前范围内的 {count} 个卷宗文件移到回收目录；文件夹和 Skill 会保留。',
      'dossiers.clearConfirm': '确认清空',
      'dossiers.open': '打开阅读',
      'dossiers.openHint': '点击打开阅读',
      'dossiers.openFailed': '卷宗打开失败',
      'dossiers.rename': '重命名卷宗',
      'dossiers.renameFolder': '重命名文件夹',
      'dossiers.delete': '删除卷宗',
      'dossiers.confirmDelete': '确认删除？',
      'dossiers.importHere': '导入卷宗到此文件夹',
      'dossiers.namePlaceholder': '输入名称',
      'dossiers.stop': '停止总结',
      'papers.title': '论文库',
      'papers.subtitle': '英文论文翻译、逐段校正与中英对照',
      'papers.storageHint': '论文副本自动保存在 .epub-reader/papers，与书籍目录分开。',
      'papers.back': '返回书架',
      'papers.import': '导入 PDF',
      'papers.importing': '正在解析论文…',
      'papers.importFailed': '论文导入失败',
      'papers.newFolder': '新建文件夹',
      'papers.importHere': '导入论文到此文件夹',
      'papers.confirm': '确定',
      'papers.cancel': '取消',
      'papers.all': '全部论文',
      'papers.empty': '还没有论文',
      'papers.emptyHint': '导入英文 PDF 论文开始；扫描版 PDF 需要先 OCR。',
      'papers.read': '阅读',
      'papers.compare': '中英对照',
      'papers.hideCompare': '隐藏中文翻译',
      'papers.rename': '重命名',
      'papers.delete': '删除论文',
      'papers.confirmDelete': '确认删除？',
      'papers.folderName': '文件夹名称',
      'papers.renameFolder': '重命名文件夹',
      'papers.renamePaper': '重命名论文',
      'papers.dropHere': '拖到这里',
      'papers.progress': '已翻译 {done} / {total} 段',
      'papers.compareTitle': '中英对照',
      'papers.wholeTranslate': '整篇翻译',
      'papers.retranslate': '重新翻译',
      'papers.stop': '停止翻译',
      'papers.translateOne': '翻译本段',
      'papers.save': '保存校正',
      'papers.saved': '已保存',
      'papers.corrected': '人工校正',
      'papers.aiExplain': 'AI 解释',
      'papers.resize': '拖动边缘调整高度',
      'papers.source': '英文原文',
      'papers.translation': '中文译文',
      'papers.translating': '正在翻译…',
      'papers.done': '翻译完成，已生成中文论文',
      'papers.openZh': '打开中文论文',
      'papers.loadFailed': '论文加载失败',
      'papers.retry': '重试',
      'papers.page': '第 {page} 页',
      'papers.unitEmpty': '这一段还没有译文',
      'papers.wholeConfirm': '重新翻译整篇会保留人工校正的段落。继续吗？',
      'papers.noModel': '还没有选择模型',
      'reader.back': '返回书架',
      'reader.toc': '目录',
      'reader.prev': '上一章',
      'reader.next': '下一章',
      'reader.fontSmaller': '减小字号',
      'reader.fontLarger': '放大字号',
      'reader.zoomHint': 'Ctrl / ⌘ + 鼠标滚轮调整字号',
      'reader.zoomHintShort': '+ 滚轮',
      'settings.title': '存储与目录',
      'settings.booksDir': '书籍目录',
      'settings.papersDir': '论文存放目录',
      'settings.dossiersDir': '卷宗存放目录',
      'settings.hint': '留空使用默认路径。修改后返回对应模式重新加载；现有文件不会自动移动。',
      'settings.choose': '选择路径',
      'settings.save': '保存',
      'settings.cancel': '取消',
      'reader.settings': '阅读设置',
      'reader.booksDir': '书籍目录',
      'reader.booksDirHint': '修改后书架会扫描并优先保存到这个目录；留空使用默认目录：{path}',
      'reader.settingsSaved': '书籍目录已保存，返回书架后生效',
      'reader.save': '保存',
      'reader.cancel': '取消',
      'reader.ai': 'AI 解释',
      'reader.find': '全书搜索',
      'reader.findPlaceholder': '搜索全书文字…',
      'reader.findSearching': '搜索中…',
      'reader.findCount': '{count} 处',
      'reader.findNoResults': '全书没有找到匹配文字',
      'reader.collapseAll': '收起全部',
      'reader.continueThread': '继续追问',
      'reader.deleteAnnotation': '删除提问',
      'reader.deleteFollowUp': '删除追问',
      'reader.confirmDelete': '确认删除？',
      'reader.expandAll': '展开全部',
      'reader.collapse': '收起',
      'reader.expand': '展开',
      'reader.selectHint': '选中文字即可解释',
      'reader.chapter': '第 {current} / {total} 章',
      'reader.loading': '正在打开章节…',
      'reader.loadFailed': '章节加载失败',
      'reader.retry': '重试',
      'reader.empty': '这一章没有可显示的正文。',
      'reader.explain': '解释',
      'reader.copy': '复制',
      'reader.copied': '已复制到剪贴板',
      'reader.quote': '选中内容',
      'reader.thinking': '正在结合上下文思考…',
      'reader.stop': '停止',
      'reader.retryExplain': '重新解释',
      'reader.close': '关闭',
      'reader.disclaimer': '内容由当前模型生成，请结合原文判断。',
      'reader.followUp': '继续追问…',
      'reader.askPlaceholder': '针对这段文字提问…',
      'reader.followUpLabel': '你的追问',
      'reader.answerLabel': 'AI 解释',
      'reader.waitForAnswer': '等待当前回答完成…',
      'reader.history': '注释记录',
      'reader.historyBack': '返回注释记录',
      'reader.backToThread': '返回当前问答',
      'reader.historyCount': '{count} 条记录',
      'reader.historyHint': '按最近更新排序',
      'reader.historyEmpty': '还没有注释',
      'reader.historyEmptyBody': '选中文字解释后会自动保存到这里，追问也会一起保留。',
      'reader.historyLoading': '正在读取注释…',
      'reader.historyLoadFailed': '注释读取失败',
      'reader.unknownChapter': '未知章节',
      'reader.followUps': '{count} 次追问',
      'reader.saveFailed': '注释保存失败',
      'reader.send': '发送',
      'reader.aiEmptyTitle': '选中一段文字',
      'reader.aiEmptyBody': '在正文中拖动选中任意词句，点击「解释」，或按 Ctrl+Shift+E。',
      'reader.chip.explain': '解释',
      'reader.chip.translate': '翻译',
      'reader.chip.example': '举例',
      'reader.chip.background': '背景',
      'reader.ask.translate': '请把这段文字翻译成简体中文，并解释其中的关键词。',
      'reader.ask.example': '请结合上下文，为这段文字补充一个简短、具体的例子。',
      'reader.ask.background': '请补充这段文字必要的背景知识，帮助我理解它为什么这样说。',
      'reader.ask.explain': '请结合上下文解释这段文字。',
      'reader.noModel': '还没有配置模型。请先在 DSH 设置里选择默认模型，或在插件配置中填写 explainProvider 和 explainModel。',
      'reader.noSelection': '先选中一段正文，再让 AI 解释。',
      'reader.copiedShort': '已复制',
      'reader.error': '解释失败',
      'reader.stopNotice': '已停止生成',
      'reader.bookInfo': '{author} · {count} 章',
      'reader.unknownAuthor': '未知作者',
      'reader.tocEmpty': '这本书没有目录',
      'reader.reading': '阅读中',
      'reader.aiStreaming': 'AI 正在解释',
      'reader.retryTitle': '再试一次',
    }

    const EN = {
      'panel.title': 'AI Book Shelf',
      'panel.eyebrow': 'AI BOOK SHELF',
      'library.subtitle': 'Read in Harness. External books are copied to the shelf; select any passage and the AI explains it in context.',
      'library.open': 'Open book',
      'library.refresh': 'Refresh shelf',
      'library.hide': 'Hide book',
      'library.unhide': 'Unhide',
      'library.delete': 'Delete book',
      'library.confirmDelete': 'Confirm delete?',
      'library.showHidden': 'Show hidden',
      'library.hideHidden': 'Hide hidden',
      'library.hiddenBadge': 'Hidden',
      'library.search': 'Search title or path',
      'library.emptyTitle': 'Your shelf is empty',
      'library.emptyBody': 'Put an EPUB, PDF, TXT, Markdown, HTML, FB2, or DOCX in the shelf folder, or open one from your computer. External files are copied into the shelf folder locally.',
      'library.noMatch': 'No matching books',
      'library.noMatchBody': 'Try another keyword, or clear the search.',
      'library.clearSearch': 'Clear search',
      'library.loading': 'Arranging the shelf…',
      'library.failed': 'Could not load the shelf',
      'library.retry': 'Retry',
      'library.importing': 'Parsing book…',
      'library.importingHint': 'Chapters, contents, and images are being prepared locally and saved to the shelf folder.',
      'library.copyCreated': 'Copy saved to {path}',
      'library.copyReused': 'Using the shelf copy: {path}',
      'library.shelfTab': 'Shelf',
      'library.onlineTab': 'Search books',
      'library.onlineTitle': 'Search public-domain books',
      'library.onlineBody': 'Search Project Gutenberg and Standard Ebooks. Downloads are saved to the shelf automatically.',
      'library.onlinePlaceholder': 'Title, author, or keyword',
      'library.searchAction': 'Search',
      'library.stopSearch': 'Stop searching',
      'library.searching': 'Searching public-domain books…',
      'library.searchingMore': 'Some sources have returned; still searching the rest…',
      'library.searchFailed': 'Search failed',
      'library.noResults': 'No public-domain books found',
      'library.noResultsBody': 'Try another keyword, or search by author. These catalogs are mostly English public-domain books.',
      'library.sourceLanguageHint': 'Chinese sources: Project Gutenberg Chinese, Chinese Wikisource, and Chinese Wikibooks, with simplified/traditional fallback. Other catalogs are mostly English.',
      'library.simplifiedReminder': 'Simplified Chinese sources are limited. Enter a source URL manually; if the book still cannot be found, download it yourself and import it.',
      'library.supportedFormats': 'Formats: EPUB, PDF, TXT, Markdown, HTML, FB2, DOCX',
      'library.chooseSources': 'Choose sources',
      'library.sourcePickerTitle': 'Choose sources',
      'library.sourceBuiltin': 'Built-in sources',
      'library.sourceCustom': 'Custom OPDS source',
      'library.sourceCustomUrl': 'OPDS search URL (use {query} for the keyword)',
      'library.sourceCustomName': 'Display name (optional)',
      'library.sourceCustomHint': 'Add multiple OPDS sources; only EPUB entries marked open-access are accepted. Format: base-url/opds?q={query}.',
      'library.sourceCustomExample': 'If the source site is https://example.org, enter https://example.org/opds?q={query}.',
      'library.addCustomSource': 'Add source',
      'library.noCustomSources': 'No custom sources yet. Click “Add source” to create one.',
      'library.removeSource': 'Remove this source',
      'library.customLimit': 'Up to 8 custom sources',
      'library.sourceApply': 'Apply',
      'library.sourceDone': 'Done',
      'library.sourceInvalid': 'Enter a valid http(s) OPDS URL',
      'library.noSource': 'Choose at least one source',
      'library.sourceLinks': 'Sources',
      'library.customSource': 'Custom source',
      'library.download': 'Download and open',
      'library.downloading': 'Downloading…',
      'library.downloadFailed': 'Download failed',
      'library.publicDomain': 'Public domain',
      'library.results': '{count} books found',
      'library.sources': 'Sources',
      'library.searchHint': 'Only public-domain books are indexed; downloads are saved to the shelf folder.',
      'library.warning': 'One source is temporarily unavailable',
      'library.importFailed': 'Import failed',
      'library.conversionRequired': 'MOBI / AZW3 must be converted to EPUB or PDF first (for example with Calibre)',
      'library.openFailed': 'Could not open the book',
      'library.progress': 'Reading chapter {chapter}',
      'library.unread': 'Not started',
      'library.chapterCount': '{count} chapters',
      'library.found': '{count} books',
      'library.source': 'Shelf folder',
      'library.noRoot': 'No shelf folder is available. Put an EPUB in the current workspace.',
      'library.openLocal': 'Open local book',
      'library.dragHint': 'You can also drop a book file here',
      'papers.mode': 'Papers',
      'papers.close': 'Close',
      'dossiers.mode': 'Dossiers',
      'dossiers.title': 'Dossier library',
      'dossiers.subtitle': 'Organize dossiers by folder, with multi-select import, full-text search, AI summaries and folder skills.',
      'dossiers.import': 'Import dossiers',
      'dossiers.importing': 'Importing dossiers…',
      'dossiers.importFailed': 'Dossier import failed',
      'dossiers.newFolder': 'New dossier folder',
      'dossiers.all': 'All dossiers',
      'dossiers.root': 'Unsorted',
      'dossiers.searchPlaceholder': 'Search this folder',
      'dossiers.searchEmpty': 'No matching dossiers',
      'dossiers.searchEmptyHint': 'Try a shorter keyword or switch to All dossiers.',
      'dossiers.empty': 'This dossier folder is empty',
      'dossiers.emptyHint': 'Import dossier files; hold Ctrl / Cmd or press Ctrl+A to select many. A Markdown file named SKILL.md becomes a folder skill.',
      'dossiers.skillHint': 'Tip: select many files at once; import SKILL.md with the dossiers and AI summaries will follow it.',
      'dossiers.skills': 'Folder skills',
      'dossiers.expand': 'Expand skills',
      'dossiers.collapse': 'Collapse skills',
      'dossiers.createSkill': 'New skill',
      'dossiers.noSkill': 'No skill yet. Creating a folder adds an empty skill automatically.',
      'dossiers.skillEmptyHint': 'Empty skill — click to fill in',
      'dossiers.editSkill': 'Edit skill',
      'dossiers.skillEditorHint': 'Write the summary instructions for this dossier: timeline, risks, output format. AI summaries will follow it.',
      'dossiers.skillPlaceholder': '# Dossier summary skill\n\nDescribe what to focus on:\n- key facts and timeline\n- risk criteria\n- preferred output format',
      'dossiers.save': 'Save',
      'dossiers.summary': 'AI summary',
      'dossiers.summaryTitle': 'AI dossier summary',
      'dossiers.summarySearchTitle': 'AI search summary',
      'dossiers.summarizing': 'Analyzing dossiers…',
      'dossiers.summaryPreparing': 'Preparing summary…',
      'dossiers.followUpPlaceholder': 'Ask a follow-up about the summary…',
      'dossiers.followUpSelectedPlaceholder': 'Ask about the selected summary text…',
      'dossiers.followUpHint': 'Type a follow-up, or select summary text with the mouse first.',
      'dossiers.followUpLocked': 'Follow-up will unlock when the summary finishes…',
      'dossiers.selectedSummary': 'Selected summary',
      'dossiers.clearSelection': 'Clear selection',
      'dossiers.askSelected': 'Explain the selected summary passage.',
      'dossiers.followUpLabel': 'Follow-up',
      'dossiers.thinking': 'Thinking…',
      'dossiers.send': 'Ask',
      'dossiers.searching': 'Searching…',
      'dossiers.stopSearch': 'Stop search',
      'dossiers.searchCount': '{count} found',
      'dossiers.clear': 'Clear dossiers',
      'dossiers.clearTitle': 'Clear "{name}"?',
      'dossiers.clearHint': 'Move {count} dossier files in the current scope to the trash; folders and skills are kept.',
      'dossiers.clearConfirm': 'Clear',
      'dossiers.open': 'Open',
      'dossiers.openHint': 'Click to open',
      'dossiers.openFailed': 'Could not open dossier',
      'dossiers.rename': 'Rename dossier',
      'dossiers.renameFolder': 'Rename folder',
      'dossiers.delete': 'Delete dossier',
      'dossiers.confirmDelete': 'Confirm delete?',
      'dossiers.importHere': 'Import dossiers into this folder',
      'dossiers.namePlaceholder': 'Name',
      'dossiers.stop': 'Stop summary',
      'papers.title': 'Paper library',
      'papers.subtitle': 'Translate English papers, correct paragraphs, compare side by side',
      'papers.storageHint': 'Paper copies are stored in .epub-reader/papers, separate from books.',
      'papers.back': 'Back to shelf',
      'papers.import': 'Import PDF',
      'papers.importing': 'Parsing paper…',
      'papers.importFailed': 'Paper import failed',
      'papers.newFolder': 'New folder',
      'papers.importHere': 'Import paper into this folder',
      'papers.confirm': 'OK',
      'papers.cancel': 'Cancel',
      'papers.all': 'All papers',
      'papers.empty': 'No papers yet',
      'papers.emptyHint': 'Import an English PDF to start; scanned PDFs need OCR first.',
      'papers.read': 'Read',
      'papers.compare': 'Compare',
      'papers.hideCompare': 'Hide translation',
      'papers.rename': 'Rename',
      'papers.delete': 'Delete paper',
      'papers.confirmDelete': 'Confirm delete?',
      'papers.folderName': 'Folder name',
      'papers.renameFolder': 'Rename folder',
      'papers.renamePaper': 'Rename paper',
      'papers.dropHere': 'Drop here',
      'papers.progress': '{done} / {total} paragraphs translated',
      'papers.compareTitle': 'Bilingual compare',
      'papers.wholeTranslate': 'Translate whole paper',
      'papers.retranslate': 'Retranslate',
      'papers.stop': 'Stop translation',
      'papers.translateOne': 'Translate paragraph',
      'papers.save': 'Save correction',
      'papers.saved': 'Saved',
      'papers.corrected': 'Edited',
      'papers.aiExplain': 'AI explain',
      'papers.resize': 'Drag the edge to resize',
      'papers.source': 'English source',
      'papers.translation': 'Chinese translation',
      'papers.translating': 'Translating…',
      'papers.done': 'Translation complete; Chinese paper created',
      'papers.openZh': 'Open Chinese paper',
      'papers.loadFailed': 'Paper failed to load',
      'papers.retry': 'Retry',
      'papers.page': 'Page {page}',
      'papers.unitEmpty': 'No translation yet',
      'papers.wholeConfirm': 'Retranslating the whole paper keeps manually edited paragraphs. Continue?',
      'papers.noModel': 'No model selected',
      'reader.back': 'Back to shelf',
      'reader.toc': 'Contents',
      'reader.prev': 'Previous chapter',
      'reader.next': 'Next chapter',
      'reader.fontSmaller': 'Smaller text',
      'reader.fontLarger': 'Larger text',
      'reader.zoomHint': 'Ctrl / ⌘ + mouse wheel to resize text',
      'reader.zoomHintShort': '+ wheel',
      'settings.title': 'Storage folders',
      'settings.booksDir': 'Books folder',
      'settings.papersDir': 'Papers folder',
      'settings.dossiersDir': 'Dossiers folder',
      'settings.hint': 'Leave empty for the default path. Reload the matching mode after saving; existing files are not moved.',
      'settings.choose': 'Choose',
      'settings.save': 'Save',
      'settings.cancel': 'Cancel',
      'reader.settings': 'Reader settings',
      'reader.booksDir': 'Books folder',
      'reader.booksDirHint': 'The shelf scans and saves books here. Leave empty for the default: {path}',
      'reader.settingsSaved': 'Books folder saved; return to the shelf to apply',
      'reader.save': 'Save',
      'reader.cancel': 'Cancel',
      'reader.ai': 'Explain',
      'reader.find': 'Find in book',
      'reader.findPlaceholder': 'Search the whole book…',
      'reader.findSearching': 'Searching…',
      'reader.findCount': '{count} matches',
      'reader.findNoResults': 'No matches in this book',
      'reader.collapseAll': 'Collapse all',
      'reader.continueThread': 'Continue thread',
      'reader.deleteAnnotation': 'Delete thread',
      'reader.deleteFollowUp': 'Delete follow-up',
      'reader.confirmDelete': 'Confirm delete?',
      'reader.expandAll': 'Expand all',
      'reader.collapse': 'Collapse',
      'reader.expand': 'Expand',
      'reader.selectHint': 'Select text to explain it',
      'reader.chapter': 'Chapter {current} of {total}',
      'reader.loading': 'Opening chapter…',
      'reader.loadFailed': 'Could not load this chapter',
      'reader.retry': 'Retry',
      'reader.empty': 'This chapter has no displayable text.',
      'reader.explain': 'Explain',
      'reader.copy': 'Copy',
      'reader.copied': 'Copied to clipboard',
      'reader.quote': 'Selection',
      'reader.thinking': 'Reading the context…',
      'reader.stop': 'Stop',
      'reader.retryExplain': 'Explain again',
      'reader.close': 'Close',
      'reader.disclaimer': 'Generated by the current model. Check it against the text.',
      'reader.followUp': 'Ask a follow-up…',
      'reader.askPlaceholder': 'Ask about this passage…',
      'reader.followUpLabel': 'You asked',
      'reader.answerLabel': 'AI',
      'reader.waitForAnswer': 'Wait for the current answer…',
      'reader.history': 'Annotations',
      'reader.historyBack': 'Back to annotations',
      'reader.backToThread': 'Back to current thread',
      'reader.historyCount': '{count} records',
      'reader.historyHint': 'Most recently updated first',
      'reader.historyEmpty': 'No annotations yet',
      'reader.historyEmptyBody': 'Explain a passage and it will be saved here, together with every follow-up.',
      'reader.historyLoading': 'Loading annotations…',
      'reader.historyLoadFailed': 'Could not load annotations',
      'reader.unknownChapter': 'Unknown chapter',
      'reader.followUps': '{count} follow-ups',
      'reader.saveFailed': 'Could not save the annotation',
      'reader.send': 'Send',
      'reader.aiEmptyTitle': 'Select a passage',
      'reader.aiEmptyBody': 'Drag to select text, then press “Explain”, or use Ctrl+Shift+E.',
      'reader.chip.explain': 'Explain',
      'reader.chip.translate': 'Translate',
      'reader.chip.example': 'Example',
      'reader.chip.background': 'Context',
      'reader.ask.translate': 'Translate this passage into English, then explain the key words.',
      'reader.ask.example': 'Give one short, concrete example that fits the passage and its context.',
      'reader.ask.background': 'Add the background knowledge needed to understand why this passage says that.',
      'reader.ask.explain': 'Explain this passage in context.',
      'reader.noModel': 'No model is configured. Choose a default model in DSH settings, or set explainProvider and explainModel in the plugin config.',
      'reader.noSelection': 'Select a passage first, then ask the AI to explain it.',
      'reader.copiedShort': 'Copied',
      'reader.error': 'Explanation failed',
      'reader.stopNotice': 'Generation stopped',
      'reader.bookInfo': '{author} · {count} chapters',
      'reader.unknownAuthor': 'Unknown author',
      'reader.tocEmpty': 'This book has no contents',
      'reader.reading': 'Reading',
      'reader.aiStreaming': 'Explaining',
      'reader.retryTitle': 'Try again',
    }

    const CSS = `
.epub-panel {
  --epub-line: var(--dsw-alias-border-l1);
  --epub-line-strong: var(--dsw-alias-border-l2);
  --epub-surface: var(--dsw-alias-bg-layer-1);
  --epub-surface-2: var(--dsw-alias-bg-layer-2);
  --epub-overlay: var(--dsw-alias-bg-overlay);
  --epub-text: var(--dsw-alias-label-primary);
  --epub-muted: var(--dsw-alias-label-secondary);
  --epub-accent: var(--dsw-alias-brand-primary);
  --epub-danger: var(--dsw-alias-state-error-primary);
  --epub-sans: "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, sans-serif;
  --epub-serif: "Iowan Old Style", "Palatino Linotype", "Songti SC", "Noto Serif CJK SC", Georgia, serif;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--dsw-alias-bg-base);
  color: var(--epub-text);
  font-family: var(--epub-sans);
  overflow: hidden;
}
.epub-panel *, .epub-panel *::before, .epub-panel *::after { box-sizing: border-box; }
.epub-panel button, .epub-panel input { font: inherit; color: inherit; }
.epub-panel button { cursor: pointer; }
.epub-panel button:focus-visible, .epub-panel input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--epub-accent) 70%, transparent);
  outline-offset: 2px;
}
.epub-panel ::-webkit-scrollbar { width: 10px; height: 10px; }
.epub-panel ::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--epub-muted) 22%, transparent);
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: padding-box;
}
.epub-panel ::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--epub-muted) 34%, transparent); background-clip: padding-box; }
.epub-panel ::-webkit-scrollbar-track { background: transparent; }

.epub-library { flex: 1; min-height: 0; overflow: auto; padding: 32px clamp(20px, 4vw, 48px) 60px; }
.epub-library-inner { width: min(100%, 1200px); margin: 0 auto; }
.epub-library-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.epub-brand { display: flex; align-items: center; gap: 15px; min-width: 0; }
.epub-brand-settings { display: grid; place-items: center; width: 34px; height: 34px; flex: none; margin-left: 8px; border: 1px solid var(--epub-line); border-radius: 8px; background: var(--epub-surface); color: var(--epub-muted); }
.epub-brand-settings:hover { color: var(--epub-text); border-color: var(--epub-line-strong); background: var(--epub-surface-2); }
.epub-brand-mark {
  width: 52px; height: 52px; flex: none; border-radius: 16px;
  display: grid; place-items: center;
  color: var(--epub-accent);
  background: color-mix(in srgb, var(--epub-accent) 11%, var(--epub-surface));
  border: 1px solid color-mix(in srgb, var(--epub-accent) 22%, var(--epub-line));
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 30%, transparent);
}
.epub-eyebrow { margin: 0 0 5px; font-size: 10px; line-height: 1; letter-spacing: .17em; text-transform: uppercase; color: var(--epub-muted); font-weight: 650; }
.epub-title { margin: 0; font-size: clamp(26px, 3vw, 32px); line-height: 1.1; letter-spacing: -.035em; font-weight: 680; }
.epub-subtitle { margin: 8px 0 0; max-width: 620px; color: var(--epub-muted); font-size: 13px; line-height: 1.65; }
.epub-formats { margin: 5px 0 0; color: var(--epub-muted); font-size: 10px; line-height: 1.5; letter-spacing: .01em; }
.epub-head-actions { display: flex; align-items: center; gap: 8px; padding-top: 5px; flex-wrap: wrap; }
.epub-btn, .epub-icon-btn, .epub-ghost-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  height: 34px; padding: 0 11px; border-radius: 9px;
  border: 1px solid var(--epub-line);
  background: var(--epub-surface);
  color: var(--epub-text);
  font-size: 12.5px; line-height: 1; white-space: nowrap;
  transition: background .14s ease, border-color .14s ease, transform .14s ease, color .14s ease;
}
.epub-btn:hover, .epub-icon-btn:hover, .epub-ghost-btn:hover {
  background: var(--epub-surface-2);
  border-color: var(--epub-line-strong);
}
.epub-btn:active, .epub-icon-btn:active, .epub-ghost-btn:active { transform: translateY(1px); }
.epub-btn-primary {
  background: color-mix(in srgb, var(--epub-accent) 14%, var(--epub-surface));
  border-color: color-mix(in srgb, var(--epub-accent) 36%, var(--epub-line));
  color: color-mix(in srgb, var(--epub-accent) 82%, var(--epub-text));
  font-weight: 600;
}
.epub-btn-primary:hover { background: color-mix(in srgb, var(--epub-accent) 21%, var(--epub-surface)); }
.epub-icon-btn { width: 34px; padding: 0; }
.epub-icon-btn.is-quiet { background: transparent; border-color: transparent; color: var(--epub-muted); }
.epub-icon-btn.is-quiet:hover { color: var(--epub-text); background: var(--epub-surface-2); border-color: var(--epub-line); }
.epub-btn[disabled], .epub-icon-btn[disabled] { opacity: .4; cursor: not-allowed; }
.epub-ghost-btn.is-active { color: var(--epub-text); background: var(--epub-surface-2); border-color: var(--epub-line-strong); }
.epub-search {
  display: flex; align-items: center; gap: 8px; height: 34px; width: min(260px, 40vw);
  padding: 0 11px; border-radius: 9px; border: 1px solid var(--epub-line);
  background: var(--epub-surface); color: var(--epub-muted);
}
.epub-search:focus-within { border-color: color-mix(in srgb, var(--epub-accent) 48%, var(--epub-line)); color: var(--epub-text); }
.epub-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: 12.5px; color: var(--epub-text); }
.epub-search input::placeholder { color: var(--epub-muted); opacity: .85; }
.epub-shelf-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 26px; color: var(--epub-muted); font-size: 11.5px; }
.epub-chip-static { display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 8px; border: 1px solid var(--epub-line); border-radius: 999px; background: var(--epub-surface); }
.epub-shelf-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 26px 20px; margin-top: 18px;
}
.epub-library-tabs { display: flex; align-items: center; gap: 8px; width: fit-content; margin-top: 24px; }
.epub-library-tabs .epub-mode-tabs { margin-top: 0; }
.epub-mode-paper { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 13px; border: 1px solid var(--epub-line); border-radius: 10px; background: var(--epub-surface); color: var(--epub-text); font-size: 11.5px; font-weight: 550; }
.epub-mode-paper:hover { background: var(--epub-surface-2); border-color: var(--epub-line-strong); }
.epub-mode-tabs { display: flex; align-items: center; gap: 3px; width: fit-content; margin-top: 24px; padding: 3px; border: 1px solid var(--epub-line); border-radius: 10px; background: var(--epub-surface); }
.epub-mode-tab { height: 28px; padding: 0 14px; border: 0; border-radius: 7px; background: transparent; color: var(--epub-muted); font-size: 11.5px; font-weight: 550; }
.epub-mode-tab:hover { color: var(--epub-text); }
.epub-mode-tab.is-active { color: var(--epub-text); background: var(--epub-surface-2); box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.epub-online-hero { margin-top: 22px; padding: clamp(20px, 3vw, 28px); border: 1px solid var(--epub-line); border-radius: 18px; background: linear-gradient(135deg, color-mix(in srgb, var(--epub-accent) 5%, var(--epub-surface)), var(--epub-surface)); }
.epub-online-head { display: flex; align-items: flex-start; gap: 13px; }
.epub-online-icon { width: 42px; height: 42px; flex: none; border-radius: 13px; display: grid; place-items: center; color: var(--epub-accent); background: color-mix(in srgb, var(--epub-accent) 10%, var(--epub-surface-2)); border: 1px solid color-mix(in srgb, var(--epub-accent) 20%, var(--epub-line)); }
.epub-online-head h2 { margin: 0 0 5px; font-size: 16px; letter-spacing: -.015em; }
.epub-online-head p { margin: 0; color: var(--epub-muted); font-size: 11.5px; line-height: 1.65; }
.epub-online-form { display: flex; gap: 8px; width: min(100%, 720px); margin-top: 18px; }
.epub-online-input { flex: 1; min-width: 0; height: 40px; padding: 0 13px; border: 1px solid var(--epub-line); border-radius: 9px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-size: 12.5px; }
.epub-online-input:focus { border-color: color-mix(in srgb, var(--epub-accent) 48%, var(--epub-line)); }
.epub-online-btn { height: 40px; padding: 0 16px; flex: none; }
.epub-source-reminder { display: flex; align-items: flex-start; gap: 6px; width: min(100%, 720px); margin-top: 12px; padding: 9px 11px; border: 1px solid color-mix(in srgb, var(--epub-accent) 28%, var(--epub-line)); border-left: 3px solid var(--epub-accent); border-radius: 8px; background: color-mix(in srgb, var(--epub-accent) 7%, var(--epub-surface)); color: var(--epub-text); font-size: 10.5px; line-height: 1.55; }
.epub-source-reminder strong { flex: none; color: var(--epub-accent); font-weight: 650; }
.epub-source-note { margin-top: 10px; color: var(--epub-muted); font-size: 10px; line-height: 1.55; }
.epub-source-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
.epub-source-bar-label { color: var(--epub-muted); font-size: 9.5px; }
.epub-source-link { color: var(--epub-muted); font-size: 10px; line-height: 1.4; text-decoration: underline; text-underline-offset: 2px; }
.epub-source-link:hover { color: var(--epub-text); }
.epub-source-link.is-custom { color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 75%, var(--epub-muted)); }
.epub-source-link.is-empty { color: var(--epub-danger); }
.epub-source-picker-btn { margin-left: auto; height: 24px; padding: 0 8px; border: 1px solid var(--epub-line); border-radius: 7px; background: var(--epub-surface); color: var(--epub-muted); font-size: 10px; }
.epub-source-picker-btn:hover { color: var(--epub-text); border-color: var(--epub-line-strong); }
.epub-source-picker { margin-top: 12px; padding: 13px; border: 1px solid var(--epub-line); border-radius: 12px; background: color-mix(in srgb, var(--epub-accent) 3%, var(--epub-surface)); }
.epub-source-picker-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 9px; }
.epub-source-picker-head strong { font-size: 11.5px; }
.epub-source-picker-section-label { margin: 4px 0 6px; color: var(--epub-muted); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
.epub-source-option { display: flex; align-items: flex-start; gap: 8px; padding: 7px 8px; border-radius: 8px; cursor: pointer; }
.epub-source-option:hover { background: var(--epub-surface-2); }
.epub-source-option input { margin: 2px 0 0; accent-color: var(--epub-accent); }
.epub-source-option-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.epub-source-option-name { color: var(--epub-text); font-size: 11px; line-height: 1.4; }
.epub-source-option-link { color: var(--epub-muted); font-size: 9px; line-height: 1.3; overflow-wrap: anywhere; }
.epub-source-custom { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--epub-line); display: flex; flex-direction: column; gap: 7px; }
.epub-source-custom-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.epub-source-add { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 8px; border: 1px solid var(--epub-line); border-radius: 7px; background: var(--epub-surface); color: var(--epub-muted); font-size: 9.5px; }
.epub-source-add:hover { color: var(--epub-text); border-color: var(--epub-line-strong); }
.epub-custom-row { display: flex; flex-direction: column; gap: 6px; padding: 8px; border: 1px solid var(--epub-line); border-radius: 8px; background: var(--epub-surface); }
.epub-custom-row-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.epub-source-option.is-compact { padding: 0; }
.epub-source-option.is-compact:hover { background: transparent; }
.epub-source-input { width: 100%; height: 30px; padding: 0 9px; border: 1px solid var(--epub-line); border-radius: 7px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-size: 10.5px; }
.epub-source-input:focus { border-color: color-mix(in srgb, var(--epub-accent) 42%, var(--epub-line)); }
.epub-source-hint { color: var(--epub-muted); font-size: 9px; line-height: 1.55; }
.epub-source-error { color: var(--epub-danger); font-size: 10px; line-height: 1.45; }
.epub-source-picker-foot { display: flex; justify-content: flex-end; margin-top: 10px; }
.epub-source-badge.is-custom { color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 84%, var(--epub-text)); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent); }
.epub-warning-banner { margin-top: 16px; padding: 9px 12px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 30%, var(--epub-line)); border-radius: 9px; background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, var(--epub-surface)); color: var(--epub-muted); font-size: 11px; line-height: 1.6; }
.epub-search-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 210px; margin-top: 18px; color: var(--epub-muted); text-align: center; }
.epub-search-state h3 { margin: 2px 0 0; color: var(--epub-text); font-size: 14px; }
.epub-search-state p { margin: 0; font-size: 11.5px; line-height: 1.6; max-width: 420px; }
.epub-search-more { display: flex; align-items: center; gap: 6px; margin-top: 10px; color: var(--epub-muted); font-size: 10px; }
.epub-search-more .epub-spinner { width: 14px; height: 14px; border-width: 1.5px; margin: 0; }
.epub-search-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; margin-top: 20px; }
.epub-result-card { display: flex; gap: 13px; min-width: 0; padding: 12px; border: 1px solid var(--epub-line); border-radius: 14px; background: var(--epub-surface); }
.epub-result-cover { position: relative; width: 78px; aspect-ratio: 2 / 3; flex: none; overflow: hidden; border-radius: 5px 8px 8px 5px; background: linear-gradient(145deg, var(--cover-a), var(--cover-b)); box-shadow: 0 5px 14px -8px rgba(0,0,0,.5); }
.epub-result-cover img { display: block; width: 100%; height: 100%; object-fit: cover; }
.epub-result-fallback { display: flex; align-items: flex-end; width: 100%; height: 100%; padding: 8px 7px; color: rgba(255,255,255,.92); font-size: 10.5px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
.epub-result-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.epub-result-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.epub-source-badge { display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 5px; font-size: 9px; font-weight: 650; letter-spacing: .04em; text-transform: uppercase; color: color-mix(in srgb, var(--epub-accent) 84%, var(--epub-text)); background: color-mix(in srgb, var(--epub-accent) 10%, transparent); }
.epub-source-badge.is-standardebooks { color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 84%, var(--epub-text)); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent); }
.epub-result-title { color: var(--epub-text); font-size: 13px; font-weight: 650; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.epub-result-author { color: var(--epub-muted); font-size: 10.5px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.epub-result-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 4px; }
.epub-result-lang { color: var(--epub-muted); font-size: 9.5px; }
.epub-result-btn { height: 26px; padding: 0 9px; border-radius: 7px; border: 1px solid color-mix(in srgb, var(--epub-accent) 30%, var(--epub-line)); background: color-mix(in srgb, var(--epub-accent) 10%, var(--epub-surface)); color: color-mix(in srgb, var(--epub-accent) 84%, var(--epub-text)); font-size: 10.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.epub-result-btn:hover:not([disabled]) { background: color-mix(in srgb, var(--epub-accent) 17%, var(--epub-surface)); }
.epub-result-btn[disabled] { opacity: .55; cursor: wait; }
.epub-result-btn .epub-spinner { width: 10px; height: 10px; border-width: 1.5px; margin: 0; }
.epub-online-btn .epub-spinner { width: 14px; height: 14px; border-width: 1.5px; margin: 0; }
.epub-book-card { display: flex; flex-direction: column; gap: 12px; min-width: 0; padding: 0; border: 0; background: transparent; text-align: left; border-radius: 12px; }
.epub-book-card:focus-visible { outline-offset: 5px; }
.epub-book-cover {
  position: relative; width: 100%; aspect-ratio: 2 / 3; overflow: hidden;
  border-radius: 6px 12px 12px 6px;
  background: linear-gradient(145deg, var(--cover-a), var(--cover-b));
  box-shadow: 0 1px 0 color-mix(in srgb, white 25%, transparent) inset, 0 10px 22px -12px rgba(0,0,0,.55);
  transition: transform .18s ease, box-shadow .18s ease;
}
.epub-book-card:hover .epub-book-cover { transform: translateY(-4px); box-shadow: 0 1px 0 rgba(255,255,255,.28) inset, 0 18px 30px -14px rgba(0,0,0,.6); }
.epub-book-card.is-hidden-book { opacity: .58; }
.epub-book-hidden-badge { position: absolute; top: 7px; right: 7px; z-index: 2; padding: 2px 5px; border-radius: 4px; background: rgba(0,0,0,.55); color: #fff; font-size: 8px; }
.epub-context-item.is-danger { color: var(--epub-danger); }
.epub-cover-spine { position: absolute; inset: 0 auto 0 0; width: 9px; background: rgba(255,255,255,.14); border-right: 1px solid rgba(255,255,255,.16); }
.epub-cover-glow { position: absolute; width: 120px; height: 120px; right: -34px; top: -34px; border-radius: 50%; background: rgba(255,255,255,.17); }
.epub-cover-title {
  position: absolute; inset: 22px 16px auto 20px; color: rgba(255,255,255,.96);
  font-size: 16px; line-height: 1.4; font-weight: 600; letter-spacing: -.01em;
  display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;
  text-shadow: 0 1px 14px rgba(0,0,0,.28); overflow-wrap: anywhere;
}
.epub-cover-foot { position: absolute; left: 20px; right: 16px; bottom: 15px; display: flex; align-items: center; justify-content: space-between; color: rgba(255,255,255,.72); font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase; }
.epub-book-meta { min-width: 0; }
.epub-book-title { font-size: 13.5px; line-height: 1.45; font-weight: 600; color: var(--epub-text); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.epub-book-sub { margin-top: 3px; color: var(--epub-muted); font-size: 11px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.epub-book-progress { margin-top: 7px; height: 3px; border-radius: 99px; background: color-mix(in srgb, var(--epub-muted) 18%, transparent); overflow: hidden; }
.epub-book-progress > span { display: block; height: 100%; border-radius: inherit; background: color-mix(in srgb, var(--epub-accent) 70%, var(--epub-text)); }
.epub-book-progress-label { margin-top: 5px; color: var(--epub-muted); font-size: 10px; }
.epub-empty {
  margin-top: 34px; padding: clamp(36px, 7vw, 68px) 24px; text-align: center;
  border: 1px dashed color-mix(in srgb, var(--epub-muted) 28%, var(--epub-line));
  border-radius: 20px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--epub-accent) 4%, transparent), transparent 65%);
}
.epub-empty-icon { width: 58px; height: 58px; margin: 0 auto 16px; border-radius: 18px; display: grid; place-items: center; color: var(--epub-accent); background: color-mix(in srgb, var(--epub-accent) 10%, var(--epub-surface)); border: 1px solid color-mix(in srgb, var(--epub-accent) 20%, var(--epub-line)); }
.epub-empty h2 { margin: 0 0 7px; font-size: 17px; letter-spacing: -.01em; }
.epub-empty p { max-width: 430px; margin: 0 auto 18px; color: var(--epub-muted); font-size: 12.5px; line-height: 1.7; }
.epub-empty small { display: block; margin-top: 12px; color: var(--epub-muted); font-size: 10.5px; }
.epub-error-banner { display: flex; align-items: flex-start; gap: 10px; margin-top: 20px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--epub-danger) 32%, var(--epub-line)); border-radius: 11px; background: color-mix(in srgb, var(--epub-danger) 7%, var(--epub-surface)); color: var(--epub-text); font-size: 12.5px; line-height: 1.55; }
.epub-error-banner strong { display: block; font-size: 12.5px; margin-bottom: 2px; }
.epub-error-banner .epub-error-text { color: var(--epub-muted); overflow-wrap: anywhere; }
.epub-skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 26px 20px; margin-top: 20px; }
.epub-skeleton-cover { aspect-ratio: 2 / 3; border-radius: 6px 12px 12px 6px; background: linear-gradient(100deg, var(--epub-surface) 20%, var(--epub-surface-2) 38%, var(--epub-surface) 56%); background-size: 220% 100%; animation: epub-shimmer 1.5s ease-in-out infinite; }
.epub-skeleton-line { height: 11px; border-radius: 99px; margin-top: 9px; background: linear-gradient(100deg, var(--epub-surface) 20%, var(--epub-surface-2) 38%, var(--epub-surface) 56%); background-size: 220% 100%; animation: epub-shimmer 1.5s ease-in-out infinite; }
.epub-skeleton-line.short { width: 62%; }

.epub-reader { flex: 1; min-height: 0; display: flex; flex-direction: column; position: relative; }
.epub-reader-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 62px; padding: 10px 16px; border-bottom: 1px solid var(--epub-line); background: var(--epub-surface); }
.epub-reader-head-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.epub-reader-book { min-width: 0; }
.epub-reader-book-title { font-size: 13.5px; line-height: 1.4; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.epub-reader-book-sub { margin-top: 2px; color: var(--epub-muted); font-size: 10.5px; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.epub-reader-head-right { display: flex; align-items: center; gap: 7px; flex: none; }
.epub-zoom-hint { display: inline-flex; align-items: center; gap: 2px; color: var(--epub-muted); font-size: 8.5px; white-space: nowrap; }
.epub-reader-settings { width: min(560px, 100%); padding: 16px; border: 1px solid var(--epub-line-strong); border-radius: 13px; background: var(--epub-surface); box-shadow: 0 22px 60px -18px rgba(0,0,0,.6); }
.epub-reader-settings header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.epub-reader-settings h3 { margin: 2px 0 0; font-size: 15px; }
.epub-reader-settings-row { margin-bottom: 9px; }
.epub-reader-settings-label { display: block; margin-bottom: 5px; color: var(--epub-muted); font-size: 9px; text-transform: uppercase; letter-spacing: .06em; }
.epub-reader-settings-path { display: flex; align-items: center; gap: 6px; }
.epub-reader-settings-path .epub-reader-settings-input { flex: 1; min-width: 0; }
.epub-reader-settings-input { width: 100%; height: 34px; padding: 0 9px; border: 1px solid var(--epub-line); border-radius: 7px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-size: 11px; }
.epub-reader-settings-input:focus { border-color: color-mix(in srgb, var(--epub-accent) 45%, var(--epub-line)); }
.epub-reader-settings-hint { margin: 7px 0 0; color: var(--epub-muted); font-size: 9px; line-height: 1.55; overflow-wrap: anywhere; }
.epub-reader-settings-error { margin: 8px 0 0; color: var(--epub-danger); font-size: 9.5px; line-height: 1.5; }
.epub-kbd { margin-left: 3px; padding: 1px 4px; border: 1px solid var(--epub-line); border-radius: 4px; color: var(--epub-muted); font-family: inherit; font-size: 8.5px; font-weight: 500; line-height: 1.4; }
.epub-find-panel { position: absolute; top: 68px; right: 18px; z-index: 45; display: flex; flex-direction: column; width: min(430px, calc(100% - 36px)); max-height: min(520px, calc(100% - 90px)); border: 1px solid var(--epub-line-strong); border-radius: 12px; background: var(--epub-surface); box-shadow: 0 18px 45px -18px rgba(0,0,0,.55); overflow: hidden; }
.epub-find-head { display: flex; align-items: center; gap: 8px; padding: 10px; border-bottom: 1px solid var(--epub-line); }
.epub-find-input-wrap { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; height: 31px; padding: 0 8px; border: 1px solid var(--epub-line); border-radius: 7px; background: var(--dsw-alias-bg-base); color: var(--epub-muted); }
.epub-find-input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--epub-text); font-size: 11px; }
.epub-find-count { flex: none; color: var(--epub-muted); font-size: 9.5px; white-space: nowrap; }
.epub-find-results { overflow: auto; padding: 5px; }
.epub-find-result { display: flex; flex-direction: column; gap: 3px; width: 100%; padding: 8px 9px; border: 0; border-radius: 7px; background: transparent; color: var(--epub-text); text-align: left; }
.epub-find-result:hover { background: var(--epub-surface-2); }
.epub-find-result-title { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 10.5px; font-weight: 600; }
.epub-find-result-index { color: var(--epub-accent); font-size: 9px; font-weight: 500; }
.epub-find-result-snippet { color: var(--epub-muted); font-size: 9.5px; line-height: 1.55; overflow-wrap: anywhere; }
.epub-find-empty { padding: 18px 12px; color: var(--epub-muted); font-size: 10.5px; text-align: center; line-height: 1.6; }
.epub-find-mark { border-radius: 2px; background: color-mix(in srgb, #f6c945 55%, transparent); color: inherit; }
.epub-find-mark.is-active { background: color-mix(in srgb, #f19b32 78%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, #f19b32 55%, transparent); }
.epub-font-group { display: flex; align-items: center; gap: 1px; height: 34px; padding: 0 3px; border: 1px solid var(--epub-line); border-radius: 9px; background: var(--epub-surface); }
.epub-font-group button { width: 27px; height: 27px; border: 0; border-radius: 7px; background: transparent; color: var(--epub-muted); font-size: 12px; font-weight: 600; }
.epub-font-group button:hover { background: var(--epub-surface-2); color: var(--epub-text); }
.epub-ai-trigger {
  display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px;
  border-radius: 9px; border: 1px solid color-mix(in srgb, var(--epub-accent) 30%, var(--epub-line));
  background: color-mix(in srgb, var(--epub-accent) 10%, var(--epub-surface));
  color: color-mix(in srgb, var(--epub-accent) 82%, var(--epub-text));
  font-size: 12.5px; font-weight: 600;
}
.epub-ai-trigger:hover { background: color-mix(in srgb, var(--epub-accent) 17%, var(--epub-surface)); }
.epub-reader-body { flex: 1; min-height: 0; display: grid; grid-template-columns: 232px minmax(0, 1fr) 0; position: relative; transition: grid-template-columns .2s ease; }
.epub-reader-body.ai-open { grid-template-columns: 232px minmax(0, 1fr) 372px; }
.epub-reader-body.toc-closed { grid-template-columns: 0 minmax(0, 1fr) 0; }
.epub-reader-body.toc-closed.ai-open { grid-template-columns: 0 minmax(0, 1fr) 372px; }
.epub-toc { min-width: 0; border-right: 1px solid var(--epub-line); background: var(--epub-surface); display: flex; flex-direction: column; overflow: hidden; opacity: 1; transition: opacity .16s ease, transform .2s ease; }
.epub-reader-body.toc-closed .epub-toc { opacity: 0; pointer-events: none; }
.epub-toc-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 15px 14px 10px; border-bottom: 1px solid var(--epub-line); }
.epub-toc-head h2 { margin: 0; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; color: var(--epub-muted); }
.epub-toc-list { flex: 1; min-height: 0; overflow: auto; padding: 8px 8px 18px; }
.epub-toc-item { display: flex; gap: 8px; width: 100%; padding: 9px 9px; border: 0; border-radius: 8px; background: transparent; text-align: left; color: var(--epub-muted); font-size: 11.5px; line-height: 1.55; }
.epub-toc-item:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-toc-item.active { color: var(--epub-text); background: color-mix(in srgb, var(--epub-accent) 10%, var(--epub-surface)); font-weight: 600; }
.epub-toc-index { width: 20px; flex: none; color: color-mix(in srgb, var(--epub-muted) 70%, transparent); font-variant-numeric: tabular-nums; text-align: right; }
.epub-toc-item.active .epub-toc-index { color: color-mix(in srgb, var(--epub-accent) 78%, var(--epub-text)); }
.epub-toc-title { min-width: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.epub-reader-main { min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-base); }
.epub-reading-scroll { flex: 1; min-height: 0; overflow: auto; scroll-behavior: smooth; }
.epub-reading-inner { width: min(100%, 760px); margin: 0 auto; padding: clamp(26px, 5vw, 54px) clamp(20px, 5vw, 58px) 130px; }
.epub-chapter-kicker { display: flex; align-items: center; gap: 8px; color: var(--epub-muted); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 12px; }
.epub-chapter-kicker::after { content: ""; height: 1px; flex: 1; background: var(--epub-line); }
.epub-chapter-title { margin: 0 0 24px; font-family: var(--epub-serif); font-size: clamp(24px, 3vw, 31px); line-height: 1.3; letter-spacing: -.025em; font-weight: 700; }
.epub-chapter {
  font-family: var(--epub-serif);
  font-size: var(--epub-font-size, 18px);
  line-height: 1.92;
  letter-spacing: .012em;
  color: var(--epub-text);
  overflow-wrap: break-word;
  text-rendering: optimizeLegibility;
}
.epub-chapter p { margin: 0 0 1.12em; text-align: justify; }
.epub-chapter h1, .epub-chapter h2, .epub-chapter h3, .epub-chapter h4, .epub-chapter h5, .epub-chapter h6 { font-family: var(--epub-serif); line-height: 1.42; letter-spacing: -.015em; margin: 1.9em 0 .62em; }
.epub-chapter h1 { font-size: 1.62em; }
.epub-chapter h2 { font-size: 1.38em; }
.epub-chapter h3 { font-size: 1.16em; }
.epub-chapter h4, .epub-chapter h5, .epub-chapter h6 { font-size: 1.02em; }
.epub-chapter h1:first-child, .epub-chapter h2:first-child, .epub-chapter h3:first-child { margin-top: 0; }
.epub-chapter strong, .epub-chapter b { font-weight: 700; }
.epub-chapter em, .epub-chapter i { font-style: italic; }
.epub-chapter blockquote { margin: 1.4em 0; padding: .2em 0 .2em 1.1em; border-left: 3px solid color-mix(in srgb, var(--epub-accent) 45%, var(--epub-line)); color: color-mix(in srgb, var(--epub-text) 82%, var(--epub-muted)); }
.epub-chapter ul, .epub-chapter ol { margin: 0 0 1.15em; padding-left: 1.5em; }
.epub-chapter li { margin: .3em 0; }
.epub-chapter hr { margin: 2em auto; width: 42%; border: 0; border-top: 1px solid var(--epub-line-strong); }
.epub-chapter img { display: block; max-width: 100%; max-height: 76vh; margin: 1.5em auto; border-radius: 8px; object-fit: contain; }
.epub-chapter figure { margin: 1.5em 0; }
.epub-chapter figcaption { margin-top: .55em; color: var(--epub-muted); font-size: .78em; text-align: center; font-family: var(--epub-sans); }
.epub-chapter table { width: 100%; margin: 1.4em 0; border-collapse: collapse; font-size: .85em; font-family: var(--epub-sans); }
.epub-chapter th, .epub-chapter td { padding: 7px 9px; border: 1px solid var(--epub-line); text-align: left; vertical-align: top; }
.epub-chapter th { background: var(--epub-surface-2); font-weight: 600; }
.epub-chapter pre { margin: 1.4em 0; padding: 13px 15px; overflow: auto; border: 1px solid var(--epub-line); border-radius: 9px; background: var(--epub-surface); font-size: .8em; line-height: 1.65; }
.epub-chapter code { font-family: "Cascadia Code", "SFMono-Regular", Consolas, monospace; font-size: .88em; }
.epub-chapter p code, .epub-chapter li code { padding: .1em .3em; border-radius: 4px; background: var(--epub-surface-2); }
.epub-chapter .epub-link { color: color-mix(in srgb, var(--epub-accent) 84%, var(--epub-text)); text-decoration: underline; text-decoration-thickness: .06em; text-underline-offset: .16em; cursor: pointer; }
.epub-chapter .epub-link:not([data-epub-href]) { color: inherit; text-decoration: none; cursor: text; }
.epub-chapter .epub-image-alt { display: inline-block; padding: 2px 6px; border: 1px solid var(--epub-line); border-radius: 5px; color: var(--epub-muted); font-family: var(--epub-sans); font-size: .76em; }
.epub-chapter [id] { scroll-margin-top: 24px; }
.epub-chapter-end { margin-top: 46px; text-align: center; color: var(--epub-muted); letter-spacing: .35em; font-size: 12px; opacity: .65; }
.epub-reader-foot { display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 8px 16px; border-top: 1px solid var(--epub-line); background: var(--epub-surface); }
.epub-foot-btn { display: inline-flex; align-items: center; gap: 5px; height: 30px; padding: 0 10px; border: 1px solid var(--epub-line); border-radius: 8px; background: transparent; color: var(--epub-muted); font-size: 11.5px; }
.epub-foot-btn:hover:not([disabled]) { color: var(--epub-text); background: var(--epub-surface-2); border-color: var(--epub-line-strong); }
.epub-foot-btn[disabled] { opacity: .35; cursor: not-allowed; }
.epub-foot-progress { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; }
.epub-foot-track { flex: 1; height: 3px; border-radius: 999px; background: color-mix(in srgb, var(--epub-muted) 18%, transparent); overflow: hidden; }
.epub-foot-fill { display: block; height: 100%; border-radius: inherit; background: color-mix(in srgb, var(--epub-accent) 70%, var(--epub-text)); transition: width .2s ease; }
.epub-foot-label { flex: none; color: var(--epub-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.epub-reading-state { flex: 1; display: grid; place-items: center; padding: 30px; text-align: center; color: var(--epub-muted); }
.epub-reading-state-inner { max-width: 340px; }
.epub-reading-state h2 { margin: 14px 0 6px; color: var(--epub-text); font-size: 16px; }
.epub-reading-state p { margin: 0 0 16px; font-size: 12.5px; line-height: 1.65; overflow-wrap: anywhere; }
.epub-spinner { width: 22px; height: 22px; margin: 0 auto; border: 2px solid color-mix(in srgb, var(--epub-muted) 26%, transparent); border-top-color: var(--epub-accent); border-radius: 50%; animation: epub-spin .75s linear infinite; }

.epub-ai { min-width: 0; border-left: 1px solid var(--epub-line); background: var(--epub-surface); display: flex; flex-direction: column; overflow: hidden; }
.epub-ai-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 13px 12px 11px 15px; border-bottom: 1px solid var(--epub-line); }
.epub-ai-head-title { display: flex; align-items: center; gap: 7px; color: var(--epub-text); font-size: 11px; letter-spacing: .13em; text-transform: uppercase; font-weight: 650; }
.epub-ai-head-title svg { color: var(--epub-accent); }
.epub-ai-scroll { flex: 1; min-height: 0; overflow: auto; padding: 15px; }
.epub-ai-quote { position: relative; margin: 0 0 15px; padding: 11px 12px 11px 13px; border-left: 3px solid color-mix(in srgb, var(--epub-accent) 55%, var(--epub-line)); border-radius: 0 9px 9px 0; background: color-mix(in srgb, var(--epub-accent) 6%, var(--epub-surface-2)); color: var(--epub-muted); font-family: var(--epub-serif); font-size: 12.5px; line-height: 1.7; max-height: 140px; overflow: auto; }
.epub-ai-quote-label { display: block; margin-bottom: 5px; font-family: var(--epub-sans); font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase; color: color-mix(in srgb, var(--epub-muted) 80%, transparent); }
.epub-ai-status { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; color: var(--epub-muted); font-size: 10.5px; }
.epub-ai-status .epub-spinner { width: 12px; height: 12px; border-width: 1.5px; margin: 0; }
.epub-ai-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 13.5px; line-height: 1.82; color: var(--epub-text); }
.epub-ai-question { margin: 16px 0 2px; padding: 9px 11px; border-radius: 10px; background: color-mix(in srgb, var(--epub-accent) 8%, var(--epub-surface-2)); font-size: 12.5px; line-height: 1.65; color: var(--epub-text); overflow-wrap: anywhere; }
.epub-ai-question-label { display: block; margin-bottom: 4px; color: var(--epub-muted); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; font-weight: 650; }
.epub-ai-answer { margin-top: 15px; }
.epub-ai-answer-label { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; color: var(--epub-muted); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; font-weight: 650; }
.epub-ai-answer-label svg { color: var(--epub-accent); }
.epub-ai-collapse-btn { margin-left: auto; border: 0; background: transparent; color: var(--epub-muted); font-size: 8.5px; text-transform: none; letter-spacing: 0; padding: 2px 4px; border-radius: 4px; }
.epub-ai-collapse-btn:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-ai-collapse-all { height: 24px; padding: 0 7px; border: 1px solid var(--epub-line); border-radius: 6px; background: transparent; color: var(--epub-muted); font-size: 8.5px; white-space: nowrap; }
.epub-ai-collapse-all:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-ai-text.is-collapsed { color: var(--epub-muted); font-size: 10px; line-height: 1.55; }
.epub-ai-history-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; color: var(--epub-muted); font-size: 9.5px; line-height: 1.4; }
.epub-ai-history-head span:last-child { text-align: right; opacity: .8; }
.epub-ai-history-item { position: relative; display: block; width: 100%; margin: 0 0 9px; padding: 10px 34px 10px 11px; border: 1px solid var(--epub-line); border-radius: 10px; background: var(--epub-surface); text-align: left; color: var(--epub-text); transition: background .14s ease, border-color .14s ease, transform .14s ease; }
.epub-ai-history-delete { position: absolute; top: 6px; right: 6px; display: grid; place-items: center; width: 27px; height: 27px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--epub-muted); }
.epub-ai-history-delete:hover { color: var(--epub-danger); background: color-mix(in srgb, var(--epub-danger) 9%, transparent); }
.epub-ai-history-delete.is-confirming { width: 27px; color: #fff; background: var(--epub-danger); }
.epub-ai-delete-btn { display: grid; place-items: center; width: 27px; height: 27px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--epub-muted); }
.epub-ai-delete-btn:hover { color: var(--epub-danger); background: color-mix(in srgb, var(--epub-danger) 8%, transparent); }
.epub-ai-delete-btn.is-confirming { color: #fff; background: var(--epub-danger); }
.epub-ai-history-item:hover { background: var(--epub-surface-2); border-color: var(--epub-line-strong); transform: translateY(-1px); }
.epub-ai-history-quote { font-family: var(--epub-serif); font-size: 12px; line-height: 1.58; color: var(--epub-text); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
.epub-ai-history-answer { margin-top: 5px; color: var(--epub-muted); font-size: 10.5px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
.epub-ai-history-meta { display: flex; align-items: center; gap: 7px; margin-top: 7px; color: var(--epub-muted); font-size: 9px; line-height: 1.4; }
.epub-ai-history-item.is-expanded .epub-ai-history-quote,
.epub-ai-history-item.is-expanded .epub-ai-history-answer { display: block; -webkit-line-clamp: unset; overflow: visible; }
.epub-ai-history-question { margin-top: 7px; padding: 6px 7px; border-radius: 6px; background: var(--epub-surface-2); color: var(--epub-text); font-size: 10px; line-height: 1.55; }
.epub-ai-history-question span { display: block; margin-bottom: 2px; color: var(--epub-muted); font-size: 8.5px; }
.epub-ai-history-item.is-expanded .epub-ai-history-answer { margin-top: 7px; color: var(--epub-text); font-size: 10.5px; }
.epub-ai-history-item.is-expanded .epub-btn { height: 27px; margin-top: 8px; padding: 0 8px; font-size: 10px; }
.epub-ai-history-actions { display: flex; align-items: center; gap: 5px; margin-top: 7px; }
.epub-ai-history-actions .epub-btn { margin-top: 0; }
.epub-ai-question-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.epub-ai-history-chapter { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.epub-ai-history-meta span:nth-child(2),
.epub-ai-history-meta span:nth-child(3) { flex: none; opacity: .8; }
.epub-ai-caret { display: inline-block; width: 2px; height: 1.05em; margin-left: 2px; vertical-align: -.15em; background: var(--epub-accent); animation: epub-blink 1s steps(1) infinite; }
.epub-ai-actions { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-top: 16px; padding-top: 13px; border-top: 1px solid var(--epub-line); }
.epub-ai-actions .epub-btn { height: 29px; padding: 0 9px; font-size: 11px; }
.epub-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.epub-chip { height: 27px; padding: 0 10px; border: 1px solid var(--epub-line); border-radius: 999px; background: transparent; color: var(--epub-muted); font-size: 11px; }
.epub-chip:hover { color: var(--epub-text); background: var(--epub-surface-2); border-color: var(--epub-line-strong); }
.epub-ai-empty { flex: 1; display: grid; place-items: center; padding: 30px 22px; text-align: center; color: var(--epub-muted); }
.epub-ai-empty-inner { max-width: 260px; }
.epub-ai-empty-icon { width: 44px; height: 44px; margin: 0 auto 13px; border-radius: 14px; display: grid; place-items: center; color: var(--epub-accent); background: color-mix(in srgb, var(--epub-accent) 9%, var(--epub-surface-2)); border: 1px solid color-mix(in srgb, var(--epub-accent) 18%, var(--epub-line)); }
.epub-ai-empty h3 { margin: 0 0 6px; color: var(--epub-text); font-size: 13px; }
.epub-ai-empty p { margin: 0; font-size: 11.5px; line-height: 1.65; }
.epub-ai-error { padding: 11px 12px; border: 1px solid color-mix(in srgb, var(--epub-danger) 30%, var(--epub-line)); border-radius: 9px; background: color-mix(in srgb, var(--epub-danger) 7%, var(--epub-surface)); font-size: 12px; line-height: 1.65; overflow-wrap: anywhere; }
.epub-ai-error strong { display: block; margin-bottom: 3px; color: var(--epub-text); }
.epub-ai-footer { flex: none; padding: 10px 13px 12px; border-top: 1px solid var(--epub-line); }
.epub-ai-disclaimer { margin: 8px 1px 0; color: var(--epub-muted); font-size: 9.5px; line-height: 1.5; opacity: .8; }
.epub-followup { display: flex; align-items: center; gap: 6px; }
.epub-followup input { flex: 1; min-width: 0; height: 32px; padding: 0 10px; border: 1px solid var(--epub-line); border-radius: 8px; outline: 0; background: var(--dsw-alias-bg-base); font-size: 11.5px; }
.epub-followup input:focus { border-color: color-mix(in srgb, var(--epub-accent) 48%, var(--epub-line)); }
.epub-followup button { width: 32px; height: 32px; flex: none; padding: 0; border-radius: 8px; border: 1px solid color-mix(in srgb, var(--epub-accent) 30%, var(--epub-line)); background: color-mix(in srgb, var(--epub-accent) 12%, var(--epub-surface)); color: var(--epub-accent); }
.epub-followup button:disabled { opacity: .35; cursor: not-allowed; }

.epub-select-popover { position: fixed; z-index: 80; width: min(540px, calc(100vw - 24px)); transform: translateX(-50%); display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding: 4px; border: 1px solid var(--epub-line-strong); border-radius: 10px; background: var(--epub-overlay); box-shadow: 0 14px 36px -10px rgba(0,0,0,.42), 0 2px 8px rgba(0,0,0,.14); animation: epub-pop .12s ease-out; }
.epub-select-quick { display: flex; align-items: center; gap: 4px; width: 100%; padding: 3px 2px 0; border-top: 1px solid var(--epub-line); }
.epub-select-quick-btn { height: 24px; padding: 0 8px; border: 1px solid var(--epub-line); border-radius: 6px; background: var(--epub-surface); color: var(--epub-muted); font-size: 9.5px; }
.epub-select-quick-btn:hover { color: var(--epub-text); background: var(--epub-surface-2); border-color: var(--epub-line-strong); }
.epub-select-popover::after { content: ""; position: absolute; left: 50%; bottom: -5px; width: 8px; height: 8px; transform: translateX(-50%) rotate(45deg); border-right: 1px solid var(--epub-line-strong); border-bottom: 1px solid var(--epub-line-strong); background: var(--epub-overlay); }
.epub-select-input { flex: 1; min-width: 0; height: 30px; padding: 0 9px; border: 1px solid transparent; border-radius: 7px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-size: 11.5px; }
.epub-select-input::placeholder { color: var(--epub-muted); opacity: .8; }
.epub-select-input:focus { border-color: color-mix(in srgb, var(--epub-accent) 42%, var(--epub-line)); }
.epub-explain-btn { display: inline-flex; align-items: center; gap: 5px; height: 30px; flex: none; padding: 0 10px; border: 0; border-radius: 7px; background: color-mix(in srgb, var(--epub-accent) 13%, transparent); color: color-mix(in srgb, var(--epub-accent) 84%, var(--epub-text)); font-size: 11.5px; font-weight: 600; }
.epub-explain-btn:hover { background: color-mix(in srgb, var(--epub-accent) 21%, transparent); }
.epub-pop-divider { width: 1px; height: 15px; background: var(--epub-line-strong); }
.epub-copy-btn { width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 7px; background: transparent; color: var(--epub-muted); }
.epub-copy-btn:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-toast { position: fixed; left: 50%; bottom: 24px; z-index: 90; transform: translateX(-50%); max-width: min(560px, calc(100vw - 32px)); padding: 9px 14px; border: 1px solid var(--epub-line-strong); border-radius: 9px; background: var(--epub-overlay); color: var(--epub-text); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; box-shadow: 0 12px 30px -10px rgba(0,0,0,.42); animation: epub-rise .16s ease-out; }
.epub-importing { position: absolute; inset: 0; z-index: 40; display: grid; place-items: center; background: color-mix(in srgb, var(--dsw-alias-bg-base) 72%, transparent); backdrop-filter: blur(3px); }
.epub-importing-card { display: flex; align-items: center; gap: 13px; padding: 17px 20px; border: 1px solid var(--epub-line-strong); border-radius: 13px; background: var(--epub-overlay); box-shadow: 0 18px 50px -18px rgba(0,0,0,.45); }
.epub-importing-card strong { display: block; font-size: 12.5px; }
.epub-importing-card span { display: block; margin-top: 2px; color: var(--epub-muted); font-size: 10.5px; }

@keyframes epub-shimmer { 0% { background-position: 120% 0; } 100% { background-position: -80% 0; } }
@keyframes epub-spin { to { transform: rotate(360deg); } }
@keyframes epub-blink { 50% { opacity: 0; } }
@keyframes epub-pop { from { opacity: 0; transform: translateX(-50%) translateY(3px) scale(.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
@keyframes epub-rise { from { opacity: 0; transform: translateX(-50%) translateY(5px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

.epub-papers { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.epub-papers-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 16px 20px; border-bottom: 1px solid var(--epub-line); background: var(--epub-surface); }
.epub-papers-head-left { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
.epub-papers-title { margin: 0; font-size: 17px; line-height: 1.35; }
.epub-papers-subtitle { margin: 4px 0 0; color: var(--epub-muted); font-size: 10.5px; line-height: 1.5; }
.epub-papers-storage { margin: 2px 0 0; color: var(--epub-muted); font-size: 8.5px; line-height: 1.4; opacity: .8; }
.epub-papers-head-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.epub-papers-body { flex: 1; min-height: 0; display: grid; grid-template-columns: 185px minmax(0, 1fr); }
.epub-paper-folders { overflow: auto; padding: 12px 10px; border-right: 1px solid var(--epub-line); background: var(--epub-surface); }
.epub-dossier-folder-group { margin: 0; }
.epub-dossier-expand { display: grid; place-items: center; width: 18px; height: 28px; flex: none; padding: 0; border: 0; background: transparent; color: var(--epub-muted); font-size: 11px; }
.epub-dossier-expand:hover { color: var(--epub-text); }
.epub-dossier-folder-skills { margin: 1px 0 5px 19px; padding: 3px 0 3px 7px; border-left: 1px solid var(--epub-line); }
.epub-paper-folder-top { display: flex; align-items: center; gap: 2px; }
.epub-paper-folder-top .epub-paper-folder { flex: 1; }
.epub-paper-folder-add { display: grid; place-items: center; width: 27px; height: 30px; flex: none; border: 0; border-radius: 7px; background: transparent; color: var(--epub-muted); }
.epub-paper-folder-add:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-paper-folder-wrap { display: flex; align-items: center; gap: 2px; border-radius: 8px; }
.epub-paper-folder-wrap.is-drop { background: color-mix(in srgb, var(--epub-accent) 12%, transparent); outline: 1px dashed var(--epub-accent); }
.epub-paper-folder { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 8px 9px; border: 0; border-radius: 8px; background: transparent; color: var(--epub-muted); font-size: 10.5px; text-align: left; }
.epub-paper-folder span { color: var(--epub-muted); font-size: 9px; }
.epub-paper-folder:hover { background: var(--epub-surface-2); color: var(--epub-text); }
.epub-paper-folder.is-active { background: color-mix(in srgb, var(--epub-accent) 10%, transparent); color: var(--epub-text); font-weight: 600; }
.epub-paper-folder-rename { width: 20px; height: 24px; border: 0; border-radius: 5px; background: transparent; color: var(--epub-muted); opacity: .55; }
.epub-paper-folder-rename:hover { opacity: 1; background: var(--epub-surface-2); }
.epub-paper-main { overflow: auto; padding: 16px 20px 50px; }
.epub-paper-main-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.epub-paper-main-head h2 { margin: 0; font-size: 13px; }
.epub-paper-main-head span { color: var(--epub-muted); font-size: 9.5px; }
.epub-paper-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(235px, 1fr)); gap: 12px; }
.epub-paper-card { display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--epub-line); border-radius: 11px; background: var(--epub-surface); }
.epub-paper-card:hover { border-color: var(--epub-line-strong); }
.epub-paper-card-top { display: flex; align-items: center; gap: 6px; }
.epub-paper-kind { color: var(--epub-muted); font-size: 9px; }
.epub-paper-card-title { margin: 0; font-size: 12px; line-height: 1.45; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.epub-paper-card-meta { margin: 0; color: var(--epub-muted); font-size: 9.5px; }
.epub-paper-card-actions { display: flex; gap: 5px; flex-wrap: wrap; margin-top: auto; padding-top: 4px; }
.epub-paper-card-actions .epub-btn { height: 28px; padding: 0 8px; font-size: 10px; }
.epub-paper-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; gap: 7px; color: var(--epub-muted); text-align: center; }
.epub-paper-empty h3 { margin: 0; color: var(--epub-text); font-size: 14px; }
.epub-paper-empty p { margin: 0; max-width: 380px; font-size: 10.5px; line-height: 1.6; }
.epub-context-menu { position: fixed; z-index: 90; min-width: 190px; padding: 4px; border: 1px solid var(--epub-line-strong); border-radius: 9px; background: var(--epub-surface); box-shadow: 0 14px 35px -14px rgba(0,0,0,.55); }
.epub-context-item { display: block; width: 100%; padding: 8px 10px; border: 0; border-radius: 6px; background: transparent; color: var(--epub-text); font-size: 10.5px; text-align: left; }
.epub-context-item:hover { background: var(--epub-surface-2); }
.epub-dialog-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: rgba(0,0,0,.35); }
.epub-dialog { width: min(380px, calc(100% - 32px)); padding: 16px; border: 1px solid var(--epub-line-strong); border-radius: 12px; background: var(--epub-surface); box-shadow: 0 20px 50px -18px rgba(0,0,0,.6); }
.epub-dialog h3 { margin: 0 0 10px; font-size: 13px; }
.epub-dialog-message { margin: 0 0 12px; color: var(--epub-muted); font-size: 10.5px; line-height: 1.6; }
.epub-dialog-input { width: 100%; height: 34px; padding: 0 9px; border: 1px solid var(--epub-line); border-radius: 7px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-size: 11px; }
.epub-dialog-input:focus { border-color: color-mix(in srgb, var(--epub-accent) 45%, var(--epub-line)); }
.epub-dialog-actions { display: flex; justify-content: flex-end; gap: 7px; margin-top: 12px; }
.epub-dossier-actions { display: flex; align-items: center; gap: 7px; margin-left: auto; }
.epub-dossier-summary-btn { height: 30px; padding: 0 8px; font-size: 10px; }
.epub-dossier-search { display: flex; align-items: center; gap: 5px; height: 30px; padding: 0 8px; border: 1px solid var(--epub-line); border-radius: 7px; background: var(--dsw-alias-bg-base); color: var(--epub-muted); }
.epub-dossier-search input { width: 190px; border: 0; outline: 0; background: transparent; color: var(--epub-text); font-size: 10px; }
.epub-dossier-hint { margin: 0 0 10px; color: var(--epub-muted); font-size: 9px; line-height: 1.5; }
.epub-dossier-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 9px; }
.epub-dossier-card { padding: 12px; border: 1px solid var(--epub-line); border-radius: 10px; background: var(--epub-surface); cursor: pointer; min-width: 0; }
.epub-dossier-card:hover { border-color: var(--epub-line-strong); background: var(--epub-surface-2); }
.epub-dossier-type { display: inline-block; margin-bottom: 6px; padding: 2px 5px; border-radius: 4px; background: color-mix(in srgb, var(--epub-accent) 10%, transparent); color: var(--epub-accent); font-size: 8px; font-weight: 700; letter-spacing: .04em; }
.epub-dossier-card h3 { margin: 0; font-size: 12px; line-height: 1.4; overflow-wrap: anywhere; }
.epub-dossier-card p { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 6px 0 9px; color: var(--epub-muted); font-size: 9.5px; line-height: 1.55; overflow-wrap: anywhere; }
.epub-dossier-meta { display: flex; justify-content: space-between; gap: 6px; color: var(--epub-muted); font-size: 8.5px; }
.epub-dossier-skills { margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--epub-line); }
.epub-dossier-skills-head { display: flex; align-items: center; justify-content: space-between; gap: 5px; margin-bottom: 5px; color: var(--epub-muted); font-size: 8.5px; text-transform: uppercase; letter-spacing: .06em; }
.epub-dossier-skill-add { display: grid; place-items: center; width: 20px; height: 20px; border: 0; border-radius: 4px; background: transparent; color: var(--epub-muted); font-size: 14px; line-height: 1; }
.epub-dossier-skill-add:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-dossier-skill-empty { margin: 3px 0 0; color: var(--epub-muted); font-size: 8.5px; line-height: 1.5; }
.epub-dossier-skill.is-empty { color: var(--epub-muted); font-style: italic; font-size: 8px; }
.epub-dossier-importing { display: flex; align-items: center; gap: 7px; margin: 0 0 9px; padding: 7px 9px; border: 1px solid var(--epub-line); border-radius: 7px; background: var(--epub-surface); color: var(--epub-muted); font-size: 9.5px; }
.epub-dossier-stop { color: var(--epub-danger); border: 1px solid color-mix(in srgb, var(--epub-danger) 26%, var(--epub-line)); }
.epub-dossier-stop:hover { background: color-mix(in srgb, var(--epub-danger) 8%, transparent); }
.epub-dossier-searching { display: inline-flex; align-items: center; gap: 5px; color: var(--epub-muted); font-size: 9px; white-space: nowrap; }
.epub-dossier-search-count { color: var(--epub-muted); font-size: 9px; white-space: nowrap; }
.epub-btn-danger { border-color: color-mix(in srgb, var(--epub-danger) 28%, var(--epub-line)); color: var(--epub-danger); background: transparent; }
.epub-btn-danger:hover { background: color-mix(in srgb, var(--epub-danger) 8%, transparent); }
.epub-skill-editor { display: flex; flex-direction: column; width: min(620px, 100%); max-height: min(82vh, 680px); border: 1px solid var(--epub-line-strong); border-radius: 13px; background: var(--epub-surface); box-shadow: 0 22px 60px -18px rgba(0,0,0,.6); }
.epub-skill-editor header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; padding: 14px 16px 0; }
.epub-skill-editor h3 { margin: 2px 0 0; font-size: 15px; }
.epub-skill-editor-hint { margin: 8px 16px 0; color: var(--epub-muted); font-size: 9.5px; line-height: 1.55; }
.epub-skill-editor-text { flex: 1; min-height: 260px; margin: 10px 16px 0; padding: 10px; border: 1px solid var(--epub-line); border-radius: 8px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-family: var(--epub-mono, ui-monospace, monospace); font-size: 11px; line-height: 1.65; resize: vertical; }
.epub-skill-editor-text:focus { border-color: color-mix(in srgb, var(--epub-accent) 45%, var(--epub-line)); }
.epub-skill-editor .epub-dialog-actions { padding: 0 16px 14px; }
.epub-dossier-skill { display: flex; align-items: center; gap: 4px; width: 100%; margin: 2px 0; padding: 4px 5px; border: 0; border-radius: 5px; background: transparent; color: var(--epub-text); font-size: 9px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.epub-dossier-skill:hover { background: var(--epub-surface-2); }
.epub-dossier-summary-backdrop { position: fixed; inset: 0; z-index: 95; display: grid; place-items: center; padding: 20px; background: rgba(0,0,0,.38); }
.epub-dossier-summary { display: flex; flex-direction: column; width: min(680px, 100%); max-height: min(78vh, 720px); border: 1px solid var(--epub-line-strong); border-radius: 14px; background: var(--epub-surface); box-shadow: 0 24px 70px -20px rgba(0,0,0,.65); overflow: hidden; }
.epub-dossier-summary header { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--epub-line); }
.epub-dossier-summary h3 { margin: 2px 0 0; font-size: 15px; }
.epub-dossier-summary-actions { display: flex; align-items: center; gap: 5px; }
.epub-dossier-summary-status { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; color: var(--epub-muted); font-family: var(--epub-sans, inherit); font-size: 9.5px; line-height: 1.5; }
.epub-dossier-summary-body { flex: 1; overflow: auto; padding: 16px; color: var(--epub-text); font-family: var(--epub-serif); font-size: 13px; line-height: 1.8; white-space: pre-wrap; }
.epub-dossier-turn { margin-top: 12px; padding: 8px 10px; border-radius: 8px; white-space: pre-wrap; font-family: var(--epub-sans, inherit); font-size: 11px; line-height: 1.65; }
.epub-dossier-turn.is-user { background: var(--epub-surface-2); color: var(--epub-text); }
.epub-dossier-turn.is-assistant { background: color-mix(in srgb, var(--epub-accent) 5%, var(--epub-surface)); color: var(--epub-text); }
.epub-dossier-turn-label { display: block; margin-bottom: 3px; color: var(--epub-muted); font-size: 8.5px; text-transform: uppercase; letter-spacing: .05em; }
.epub-dossier-followup { flex: none; padding: 9px 14px 12px; border-top: 1px solid var(--epub-line); background: var(--epub-surface); }
.epub-dossier-followup-row { display: flex; align-items: center; gap: 6px; }
.epub-dossier-followup-row input { flex: 1; min-width: 0; height: 32px; padding: 0 9px; border: 1px solid var(--epub-line); border-radius: 7px; outline: 0; background: var(--dsw-alias-bg-base); color: var(--epub-text); font-size: 10.5px; }
.epub-dossier-followup-row input:focus { border-color: color-mix(in srgb, var(--epub-accent) 45%, var(--epub-line)); }
.epub-dossier-followup-row .epub-btn { height: 32px; font-size: 10px; }
.epub-dossier-followup-locked { display: flex; align-items: center; gap: 7px; color: var(--epub-muted); font-size: 9.5px; }
.epub-dossier-followup-hint { margin: 5px 0 0; color: var(--epub-muted); font-size: 8.5px; line-height: 1.45; }
.epub-dossier-selection-chip { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; padding: 4px 6px; border-radius: 6px; background: color-mix(in srgb, var(--epub-accent) 8%, transparent); color: var(--epub-muted); font-size: 8.5px; line-height: 1.4; }
.epub-dossier-selection-chip span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.epub-dossier-selection-chip button { border: 0; background: transparent; color: var(--epub-muted); font-size: 13px; line-height: 1; }
.epub-dossier-summary-error { margin: 0; padding: 10px 16px 0; color: var(--epub-danger); font-size: 10px; }
.epub-paper-compare { flex: 1; min-height: 0; display: flex; flex-direction: column; position: relative; }
.epub-paper-body { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr); }
.epub-paper-body.ai-open { grid-template-columns: minmax(0, 1fr) 372px; }
.epub-paper-main-column { min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
.epub-paper-main-column .epub-compare-scroll { flex: 1; }
.epub-paper-body .epub-ai { min-height: 0; }
.epub-compare-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 13px 16px; border-bottom: 1px solid var(--epub-line); background: var(--epub-surface); }
.epub-compare-head-left { display: flex; gap: 10px; min-width: 0; align-items: flex-start; }
.epub-compare-title { margin: 0; font-size: 14px; line-height: 1.4; }
.epub-compare-sub { margin: 3px 0 0; color: var(--epub-muted); font-size: 9.5px; }
.epub-compare-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.epub-compare-actions .epub-btn { height: 30px; padding: 0 9px; font-size: 10px; }
.epub-compare-progress { display: flex; align-items: center; gap: 7px; padding: 7px 16px; border-bottom: 1px solid var(--epub-line); background: color-mix(in srgb, var(--epub-accent) 5%, var(--epub-surface)); color: var(--epub-muted); font-size: 9.5px; }
.epub-compare-notice { padding: 7px 16px; color: var(--epub-muted); font-size: 10px; border-bottom: 1px solid var(--epub-line); }
.epub-compare-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 8px 16px 0; }
.epub-compare-col-head { color: var(--epub-muted); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
.epub-compare-scroll { flex: 1; overflow: auto; padding: 0 16px 60px; }
.epub-compare-page { margin-top: 14px; }
.epub-compare-page-title { margin: 0 0 7px; color: var(--epub-muted); font-size: 9.5px; font-weight: 500; border-bottom: 1px solid var(--epub-line); padding-bottom: 5px; }
.epub-compare-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 9px 0; border-bottom: 1px solid color-mix(in srgb, var(--epub-line) 55%, transparent); }
.epub-compare-source { color: var(--epub-text); font-size: var(--paper-font-size, 10.5px); line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
.epub-compare-target { display: flex; flex-direction: column; gap: 5px; }
.epub-compare-textarea { min-height: 64px; resize: none; width: 100%; padding: 7px 8px; border: 1px solid var(--epub-line); border-radius: 7px; background: var(--dsw-alias-bg-base); color: var(--epub-text); font: inherit; font-size: var(--paper-font-size, 10.5px); line-height: 1.6; overflow: auto; }
.epub-compare-textarea:focus { outline: 0; border-color: color-mix(in srgb, var(--epub-accent) 42%, var(--epub-line)); }
.epub-compare-row-actions { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.epub-compare-row-actions .epub-btn { height: 26px; padding: 0 7px; font-size: 9.5px; }
.epub-paper-box { position: relative; display: flex; flex-direction: column; gap: 4px; }
.epub-paper-box-actions { display: flex; align-items: center; gap: 5px; }
.epub-paper-box-btn { height: 23px; padding: 0 6px; border: 1px solid var(--epub-line); border-radius: 6px; background: var(--epub-surface); color: var(--epub-muted); font-size: 9px; }
.epub-paper-box-btn:hover { color: var(--epub-text); background: var(--epub-surface-2); }
.epub-paper-resizer { display: flex; align-items: center; justify-content: center; height: 10px; margin-top: -3px; border-radius: 0 0 7px 7px; cursor: ns-resize; color: var(--epub-muted); background: color-mix(in srgb, var(--epub-accent) 5%, transparent); font-size: 9px; line-height: 1; touch-action: none; }
.epub-paper-resizer:hover { background: color-mix(in srgb, var(--epub-accent) 14%, transparent); color: var(--epub-accent); }
.epub-paper-box-collapsed { min-height: 30px; padding: 7px 8px; border: 1px dashed var(--epub-line); border-radius: 7px; color: var(--epub-muted); font-size: 9.5px; line-height: 1.5; overflow-wrap: anywhere; }
.epub-paper-ai { position: absolute; right: 16px; bottom: 16px; z-index: 60; display: flex; flex-direction: column; width: min(390px, calc(100% - 32px)); max-height: min(440px, 55%); border: 1px solid var(--epub-line-strong); border-radius: 12px; background: var(--epub-surface); box-shadow: 0 18px 48px -18px rgba(0,0,0,.55); overflow: hidden; }
.epub-paper-ai-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; border-bottom: 1px solid var(--epub-line); font-size: 10.5px; }
.epub-paper-ai-head-actions { display: flex; align-items: center; gap: 2px; }
.epub-paper-ai-body { overflow: auto; padding: 10px; display: flex; flex-direction: column; gap: 7px; }
.epub-paper-ai-quote { padding: 7px 8px; border-left: 2px solid color-mix(in srgb, var(--epub-accent) 55%, transparent); border-radius: 4px; background: var(--epub-surface-2); color: var(--epub-muted); font-size: 9.5px; line-height: 1.55; max-height: 80px; overflow: auto; }
.epub-paper-ai-status { display: flex; align-items: center; gap: 6px; color: var(--epub-muted); font-size: 9.5px; }
.epub-paper-ai-error { color: var(--epub-danger); font-size: 9.5px; line-height: 1.5; }
.epub-paper-ai-answer { color: var(--epub-text); font-size: 10.5px; line-height: 1.7; white-space: pre-wrap; }
.epub-paper-ai-collapsed { padding: 8px 10px; color: var(--epub-muted); font-size: 9.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 760px) {
  .epub-papers-body { grid-template-columns: 1fr; }
  .epub-paper-main-head { flex-wrap: wrap; }
  .epub-dossier-actions { width: 100%; margin-left: 0; }
  .epub-dossier-search { flex: 1; }
  .epub-dossier-search input { width: 100%; min-width: 0; }
  .epub-dossier-grid { grid-template-columns: 1fr; }
  .epub-dossier-summary { max-height: 88vh; }
  .epub-zoom-hint { display: none; }
  .epub-paper-folders { display: flex; gap: 4px; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--epub-line); }
  .epub-paper-folder-wrap { flex: none; }
  .epub-paper-folder-top { flex: none; }
  .epub-paper-folder { width: auto; white-space: nowrap; }
  .epub-paper-folder-rename { display: none; }
  .epub-paper-grid { grid-template-columns: 1fr; }
  .epub-compare-columns { display: none; }
  .epub-compare-row { grid-template-columns: 1fr; gap: 6px; }
  .epub-paper-body.ai-open { grid-template-columns: 1fr; position: relative; }
  .epub-paper-body .epub-ai { position: absolute; top: 0; right: 0; bottom: 0; z-index: 35; width: min(390px, 100%); box-shadow: -18px 0 40px -30px rgba(0,0,0,.5); }
}
@media (max-width: 1180px) {
  .epub-reader-body, .epub-reader-body.ai-open, .epub-reader-body.toc-closed, .epub-reader-body.toc-closed.ai-open { grid-template-columns: 0 minmax(0, 1fr) 0; }
  .epub-reader-body.ai-open { grid-template-columns: 0 minmax(0, 1fr) min(380px, 46vw); }
  .epub-toc { position: absolute; top: 0; bottom: 0; left: 0; width: 280px; z-index: 25; transform: translateX(-102%); box-shadow: 18px 0 40px -28px rgba(0,0,0,.4); }
  .epub-reader-body.toc-open .epub-toc { transform: translateX(0); opacity: 1; pointer-events: auto; }
  .epub-reader-body.toc-closed .epub-toc { opacity: 0; pointer-events: none; }
}
@media (max-width: 760px) {
  .epub-library { padding: 22px 16px 44px; }
  .epub-library-head { gap: 14px; }
  .epub-search { width: 100%; }
  .epub-head-actions { width: 100%; }
  .epub-head-actions .epub-search { order: 3; width: 100%; }
  .epub-shelf-grid { grid-template-columns: repeat(auto-fill, minmax(125px, 1fr)); gap: 22px 14px; }
  .epub-search-grid { grid-template-columns: 1fr; }
  .epub-online-form { flex-wrap: wrap; }
  .epub-online-btn { width: 100%; }
  .epub-reader-head { padding: 8px 10px; }
  .epub-reader-head-right .epub-font-group { display: none; }
  .epub-reader-head-right .epub-kbd { display: none; }
  .epub-find-panel { top: 58px; right: 10px; width: calc(100% - 20px); max-height: calc(100% - 72px); }
  .epub-reader-body.ai-open { grid-template-columns: 0 minmax(0, 1fr) 0; }
  .epub-ai { position: absolute; top: 0; right: 0; bottom: 0; z-index: 35; width: min(420px, 100%); box-shadow: -20px 0 48px -30px rgba(0,0,0,.5); }
  .epub-reading-inner { padding: 22px 18px 105px; }
  .epub-reader-foot { min-height: 48px; padding: 7px 10px; }
  .epub-foot-btn span { display: none; }
  .epub-foot-btn { width: 30px; padding: 0; justify-content: center; }
  .epub-title { font-size: 26px; }
  .epub-ai-trigger span { display: none; }
  .epub-ai-trigger { width: 34px; padding: 0; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .epub-panel *, .epub-panel *::before, .epub-panel *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
}
`

    function cn(...parts) {
      return parts.filter(Boolean).join(' ')
    }

    function format(template, values) {
      return String(template).replace(/\{(\w+)\}/g, (_, key) => {
        const value = values[key]
        return value === undefined || value === null ? '' : String(value)
      })
    }

    function formatBytes(bytes) {
      const size = Number(bytes) || 0
      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
      return `${(size / 1024 / 1024).toFixed(1)} MB`
    }

    function makeAnnotationId() {
      return `ann-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    }

    function formatAnnotationTime(value) {
      const time = Number(value)
      if (!Number.isFinite(time)) return ''
      try {
        return new Date(time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      } catch {
        return ''
      }
    }

    function readSourcePrefs() {
      try {
        const raw = window.localStorage.getItem(SOURCE_PREFS_KEY)
        const value = raw === null ? null : JSON.parse(raw)
        if (value === null || typeof value !== 'object') return DEFAULT_SOURCE_PREFS
        const rawCustoms = Array.isArray(value.customs)
          ? value.customs
          : (value.custom !== null && typeof value.custom === 'object' ? [value.custom] : [])
        return {
          gutenberg: value.gutenberg !== false,
          'gutenberg-zh': value['gutenberg-zh'] !== false,
          wikisource: value.wikisource === true,
          wikibooks: value.wikibooks === true,
          standardebooks: value.standardebooks !== false,
          customs: rawCustoms.slice(0, MAX_CUSTOM_SOURCES).map((custom, index) => ({
            id: typeof custom?.id === 'string' && custom.id !== '' ? custom.id : `custom-${index + 1}`,
            enabled: custom?.enabled === true,
            label: typeof custom?.label === 'string' ? custom.label.slice(0, 80) : '',
            url: typeof custom?.url === 'string' ? custom.url.slice(0, 2000) : '',
          })),
        }
      } catch {
        return DEFAULT_SOURCE_PREFS
      }
    }

    function writeSourcePrefs(value) {
      try {
        window.localStorage.setItem(SOURCE_PREFS_KEY, JSON.stringify(value))
      } catch {
        // Preferences are a convenience; a full storage must not break search.
      }
    }

    function isHttpAddress(value) {
      try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    }

    function readPaperUi() {
      try {
        const value = JSON.parse(window.localStorage.getItem(PAPER_UI_KEY) ?? '{}')
        return {
          heights: value !== null && typeof value.heights === 'object' ? value.heights : {},
          collapsed: value !== null && typeof value.collapsed === 'object' ? value.collapsed : {},
        }
      } catch {
        return { heights: {}, collapsed: {} }
      }
    }

    function writePaperUi(value) {
      try { window.localStorage.setItem(PAPER_UI_KEY, JSON.stringify(value)) } catch { /* ignore */ }
    }

    function paletteFor(id) {
      let hash = 0
      for (let index = 0; index < String(id).length; index += 1) {
        hash = (hash * 31 + String(id).charCodeAt(index)) >>> 0
      }
      return PALETTE[hash % PALETTE.length]
    }

    function readProgressMap() {
      try {
        const raw = window.localStorage.getItem(PROGRESS_KEY)
        const value = raw === null ? {} : JSON.parse(raw)
        return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}
      } catch {
        return {}
      }
    }

    function readProgress(id) {
      const entry = readProgressMap()[id]
      return entry !== null && typeof entry === 'object' ? entry : undefined
    }

    function writeProgress(id, value) {
      try {
        const map = readProgressMap()
        map[id] = value
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map))
      } catch {
        // A full or disabled localStorage must not break reading.
      }
    }

    function readFontSize() {
      try {
        const value = Number(window.localStorage.getItem(FONT_KEY))
        return Number.isFinite(value) ? Math.min(30, Math.max(12, value)) : 18
      } catch {
        return 18
      }
    }

    function writeFontSize(value) {
      try {
        window.localStorage.setItem(FONT_KEY, String(value))
      } catch {
        // Ignore storage failures.
      }
    }

    async function responseJson(response) {
      const text = await response.text()
      let data = null
      if (text.trim() !== '') {
        try {
          data = JSON.parse(text)
        } catch {
          data = null
        }
      }
      if (!response.ok) {
        const error = new Error(
          data !== null && typeof data.error === 'string'
            ? data.error
            : `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`,
        )
        error.code = data !== null && typeof data.code === 'string' ? data.code : 'HTTP_ERROR'
        error.status = response.status
        throw error
      }
      return data
    }

    async function apiGet(pathname, options = {}) {
      const response = await fetch(`${API}${pathname}`, {
        cache: 'no-store',
        headers: { accept: 'application/json' },
        signal: options.signal,
      })
      return await responseJson(response)
    }

    async function apiPost(pathname, body) {
      const response = await fetch(`${API}${pathname}`, {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      return await responseJson(response)
    }

    async function apiUpload(pathname, file, headers = {}) {
      const response = await fetch(`${API}${pathname}`, {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': file.type || 'application/octet-stream', ...headers },
        body: file,
      })
      return await responseJson(response)
    }

    async function apiStreamJson(pathname, body, options) {
      const response = await fetch(`${API}${pathname}`, {
        method: 'POST',
        headers: { accept: 'text/event-stream', 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: options.signal,
      })
      if (!response.ok) await responseJson(response)
      if (response.body === null) throw new Error('浏览器不支持流式响应')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let boundary = buffer.indexOf('\n\n')
        while (boundary !== -1) {
          const block = buffer.slice(0, boundary)
          buffer = buffer.slice(boundary + 2)
          const lines = block.split(/\r?\n/).filter((line) => line.startsWith('data:'))
          if (lines.length > 0) {
            let event = null
            try { event = JSON.parse(lines.map((line) => line.slice(5).trimStart()).join('\n')) } catch { event = null }
            if (event !== null) options.onEvent(event)
          }
          boundary = buffer.indexOf('\n\n')
        }
      }
    }

    async function apiStreamSearch(pathname, options) {
      const response = await fetch(`${API}${pathname}`, {
        cache: 'no-store',
        headers: { accept: 'text/event-stream' },
        signal: options.signal,
      })
      if (!response.ok) await responseJson(response)
      if (response.body === null) throw new Error('浏览器不支持流式搜索')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let boundary = buffer.indexOf('\n\n')
        while (boundary !== -1) {
          const block = buffer.slice(0, boundary)
          buffer = buffer.slice(boundary + 2)
          const dataLines = []
          for (const line of block.split(/\r?\n/)) {
            if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
          }
          if (dataLines.length > 0) {
            let event = null
            try {
              event = JSON.parse(dataLines.join('\n'))
            } catch {
              event = null
            }
            if (event !== null) options.onEvent(event)
          }
          boundary = buffer.indexOf('\n\n')
        }
      }
    }

    // Search lives outside the Library component so navigating to the reader
    // (or another Harness page) does not kill the stream or lose its results.
    const searchStore = {
      state: { status: 'idle', results: [], warnings: [], error: '', query: '', loadingMore: false },
      listeners: new Set(),
      controller: null,
      runId: 0,
      subscribe: (listener) => {
        searchStore.listeners.add(listener)
        return () => searchStore.listeners.delete(listener)
      },
      getSnapshot: () => searchStore.state,
      getState: () => searchStore.state,
      update: (next) => {
        searchStore.state = typeof next === 'function'
          ? next(searchStore.state)
          : { ...searchStore.state, ...next }
        for (const listener of searchStore.listeners) listener()
      },
      stop: (nextQuery) => {
        searchStore.runId += 1
        searchStore.controller?.abort()
        searchStore.controller = null
        searchStore.update((current) => ({
          status: 'idle',
          results: [],
          warnings: [],
          error: '',
          query: typeof nextQuery === 'string' ? nextQuery : current.query,
          loadingMore: false,
        }))
      },
      start: (pathname, query, t) => {
        searchStore.controller?.abort()
        const controller = new AbortController()
        searchStore.controller = controller
        const runId = searchStore.runId + 1
        searchStore.runId = runId
        const isCurrent = () => searchStore.controller === controller && searchStore.runId === runId
        let streamedResults = []
        let streamedWarnings = []
        let doneSeen = false
        searchStore.update({ status: 'loading', results: [], warnings: [], error: '', query, loadingMore: true })
        void apiStreamSearch(pathname, {
          signal: controller.signal,
          onEvent: (event) => {
            if (!isCurrent()) return
            if (event.type === 'source') {
              if (Array.isArray(event.results) && event.results.length > 0) {
                streamedResults = streamedResults.concat(event.results)
              }
              if (typeof event.warning === 'string' && event.warning !== '') {
                streamedWarnings = streamedWarnings.concat(event.warning)
              }
              if (streamedResults.length > 0) {
                searchStore.update({ status: 'ready', results: streamedResults, warnings: streamedWarnings, error: '', query, loadingMore: true })
              } else if (streamedWarnings.length > 0) {
                searchStore.update((current) => ({ ...current, warnings: streamedWarnings }))
              }
            } else if (event.type === 'done') {
              doneSeen = true
              if (Array.isArray(event.warnings)) streamedWarnings = event.warnings
              searchStore.update({ status: 'ready', results: streamedResults, warnings: streamedWarnings, error: '', query, loadingMore: false })
            } else if (event.type === 'error') {
              searchStore.update({
                status: streamedResults.length > 0 ? 'ready' : 'error',
                results: streamedResults,
                warnings: streamedWarnings,
                error: streamedResults.length > 0 ? '' : (typeof event.error === 'string' ? event.error : t('library.searchFailed')),
                query,
                loadingMore: false,
              })
            }
          },
        }).then(() => {
          if (!isCurrent()) return
          if (!doneSeen) {
            searchStore.update({
              status: streamedResults.length > 0 ? 'ready' : 'error',
              results: streamedResults,
              warnings: streamedWarnings,
              error: streamedResults.length > 0 ? '' : t('library.searchFailed'),
              query,
              loadingMore: false,
            })
          }
        }).catch((error) => {
          if (!isCurrent()) return
          if (error !== null && typeof error === 'object' && error.name === 'AbortError') {
            searchStore.stop()
            return
          }
          const message = error instanceof Error ? error.message : String(error)
          if (streamedResults.length > 0) {
            searchStore.update({ status: 'ready', results: streamedResults, warnings: streamedWarnings.concat(message), error: '', query, loadingMore: false })
          } else {
            searchStore.update({ status: 'error', results: [], warnings: streamedWarnings, error: message, query, loadingMore: false })
          }
        }).finally(() => {
          if (searchStore.controller === controller) searchStore.controller = null
        })
      },
    }

    async function consumeSse(response, onDelta) {
      if (response.body === null) throw new Error('浏览器不支持流式响应')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let terminal = false
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let boundary = buffer.indexOf('\n\n')
        while (boundary !== -1) {
          const block = buffer.slice(0, boundary)
          buffer = buffer.slice(boundary + 2)
          let event = 'message'
          const dataLines = []
          for (const line of block.split(/\r?\n/)) {
            if (line.startsWith('event:')) event = line.slice(6).trim()
            else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
          }
          if (dataLines.length > 0) {
            let parsed
            try {
              parsed = JSON.parse(dataLines.join('\n'))
            } catch {
              parsed = null
            }
            if (event === 'error') {
              const message = parsed !== null && typeof parsed.error === 'string' ? parsed.error : '模型请求失败'
              const error = new Error(message)
              error.code = 'MODEL_STREAM_ERROR'
              throw error
            }
            if (parsed !== null && parsed.type === 'delta' && typeof parsed.text === 'string') {
              onDelta(parsed.text)
            }
            if (parsed !== null && parsed.type === 'done') {
              terminal = true
            }
          }
          boundary = buffer.indexOf('\n\n')
        }
      }
      if (!terminal) {
        // A stream that closes cleanly still counts as done; the text is already on screen.
        return
      }
    }

    async function explainSelection(payload, signal, onDelta) {
      const response = await fetch(`${API}/explain`, {
        method: 'POST',
        headers: { accept: 'text/event-stream', 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal,
      })
      if (!response.ok) {
        await responseJson(response)
        return
      }
      await consumeSse(response, onDelta)
    }

    async function copyText(text) {
      if (navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text)
        return
      }
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', 'readonly')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.append(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }

    function escapeSelectorValue(value) {
      if (window.CSS !== undefined && typeof window.CSS.escape === 'function') return window.CSS.escape(value)
      return String(value).replace(/["\\]/g, '\\$&')
    }

    // Icons -----------------------------------------------------------------

    function iconBase(props, children) {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: props.size ?? 18,
          height: props.size ?? 18,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: props.strokeWidth ?? 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          focusable: 'false',
          ...props,
        },
        ...children,
      )
    }

    function IconBookOpen(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M3 5.6c2.8-.8 5.2-.3 9 2.1 3.8-2.4 6.2-2.9 9-2.1v13.2c-2.9-.7-5.3-.1-9 2.2-3.7-2.3-6.1-2.9-9-2.2V5.6Z' }),
        h('path', { key: 'b', d: 'M12 7.7v13.3' }),
      ])
    }

    function IconSparkles(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M12 3.5l1.4 4.1 4.1 1.4-4.1 1.4L12 14.5l-1.4-4.1L6.5 9l4.1-1.4L12 3.5Z' }),
        h('path', { key: 'b', d: 'M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z' }),
        h('path', { key: 'c', d: 'M5.5 15l.9 2.6 2.6.9-2.6.9L5.5 22l-.9-2.6L2 18.5l2.6-.9L5.5 15Z' }),
      ])
    }

    function IconChevronLeft(props) {
      return iconBase(props ?? {}, [h('path', { key: 'a', d: 'M15 5l-7 7 7 7' })])
    }

    function IconChevronRight(props) {
      return iconBase(props ?? {}, [h('path', { key: 'a', d: 'M9 5l7 7-7 7' })])
    }

    function IconArrowLeft(props) {
      return iconBase(props ?? {}, [h('path', { key: 'a', d: 'M19 12H5' }), h('path', { key: 'b', d: 'M11 18l-6-6 6-6' })])
    }

    function IconList(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M8 6h12M8 12h12M8 18h12' }),
        h('path', { key: 'b', d: 'M4 6h.01M4 12h.01M4 18h.01' }),
      ])
    }

    function IconRefresh(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M20 11a8 8 0 1 0-2.3 6.7' }),
        h('path', { key: 'b', d: 'M20 4v7h-7' }),
      ])
    }

    function IconUpload(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M12 16V4' }),
        h('path', { key: 'b', d: 'M7 9l5-5 5 5' }),
        h('path', { key: 'c', d: 'M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16' }),
      ])
    }

    function IconDownload(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M12 4v12' }),
        h('path', { key: 'b', d: 'M7 11l5 5 5-5' }),
        h('path', { key: 'c', d: 'M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16' }),
      ])
    }

    function IconSearch(props) {
      return iconBase(props ?? {}, [
        h('circle', { key: 'a', cx: 11, cy: 11, r: 6.5 }),
        h('path', { key: 'b', d: 'M16 16l4.5 4.5' }),
      ])
    }

    function IconMinus(props) {
      return iconBase(props ?? {}, [h('path', { key: 'a', d: 'M5 12h14' })])
    }

    function IconPlus(props) {
      return iconBase(props ?? {}, [h('path', { key: 'a', d: 'M12 5v14M5 12h14' })])
    }

    function IconSettings(props) {
      return iconBase(props ?? {}, [
        h('circle', { key: 'a', cx: 12, cy: 12, r: 3.2 }),
        h('path', { key: 'b', d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.74v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
      ])
    }

    function IconStopCircle(props) {
      return iconBase(props ?? {}, [
        h('circle', { key: 'a', cx: 12, cy: 12, r: 8.5 }),
        h('rect', { key: 'b', x: 9.2, y: 9.2, width: 5.6, height: 5.6, rx: 1, fill: 'currentColor', stroke: 'none' }),
      ])
    }

    function IconFolderPlus(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' }),
        h('path', { key: 'b', d: 'M12 10v5M9.5 12.5h5' }),
      ])
    }

    function IconX(props) {
      return iconBase(props ?? {}, [h('path', { key: 'a', d: 'M6 6l12 12M18 6L6 18' })])
    }

    function IconCopy(props) {
      return iconBase(props ?? {}, [
        h('rect', { key: 'a', x: 8, y: 8, width: 11, height: 11, rx: 2 }),
        h('path', { key: 'b', d: 'M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2' }),
      ])
    }

    function IconStop(props) {
      return iconBase(props ?? {}, [h('rect', { key: 'a', x: 6, y: 6, width: 12, height: 12, rx: 2, fill: 'currentColor', stroke: 'none' })])
    }

    function IconSend(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M21 3L10.5 13.5' }),
        h('path', { key: 'b', d: 'M21 3l-6.4 18-4.1-7.5L3 9.4 21 3Z' }),
      ])
    }

    function IconQuote(props) {
      return iconBase(props ?? {}, [
        h('path', { key: 'a', d: 'M9 7H5.5A2.5 2.5 0 0 0 3 9.5V13h5V9.5A2.5 2.5 0 0 0 5.5 7' }),
        h('path', { key: 'b', d: 'M18 7h-3.5A2.5 2.5 0 0 0 12 9.5V13h5V9.5A2.5 2.5 0 0 0 14.5 7' }),
        h('path', { key: 'c', d: 'M3 13v2.5A2.5 2.5 0 0 0 5.5 18H8M12 13v2.5A2.5 2.5 0 0 0 14.5 18H17' }),
      ])
    }

    function IconPanelBook(props) {
      const size = props?.size ?? 20
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.65,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', { d: 'M3 5.8c2.3-.7 4.4-.2 7.5 1.8 3.1-2 5.2-2.5 7.5-1.8v11.5c-2.4-.6-4.5 0-7.5 1.9-3-1.9-5.1-2.5-7.5-1.9V5.8Z', fill: props?.active ? 'currentColor' : 'none', fillOpacity: props?.active ? 0.12 : 0 }),
        h('path', { d: 'M10.5 7.6v11.6' }),
        h('path', { d: 'M17.4 3.5l.55 1.55 1.55.55-1.55.55-.55 1.55-.55-1.55-1.55-.55 1.55-.55.55-1.55Z', fill: 'currentColor', stroke: 'none' }),
      )
    }

    // Shared UI -------------------------------------------------------------

    function useLocaleTick(ctx) {
      const [, force] = React.useState(0)
      React.useEffect(() => {
        return ctx.locale.subscribe(() => force((value) => value + 1))
      }, [ctx])
    }

    function Spinner() {
      return h('span', { className: 'epub-spinner', 'aria-hidden': 'true' })
    }

    function ErrorBanner({ title, message, actionLabel, onAction }) {
      return h(
        'div',
        { className: 'epub-error-banner', role: 'alert' },
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('strong', null, title),
          h('div', { className: 'epub-error-text' }, message),
        ),
        actionLabel !== undefined && onAction !== undefined
          ? h('button', { type: 'button', className: 'epub-btn', onClick: onAction }, actionLabel)
          : null,
      )
    }

    function Toast({ message }) {
      if (message === '') return null
      return h('div', { className: 'epub-toast', role: 'status' }, message)
    }

    // Library ---------------------------------------------------------------

    function SkeletonShelf() {
      return h(
        'div',
        { className: 'epub-skeleton-grid', 'aria-hidden': 'true' },
        Array.from({ length: 8 }, (_, index) =>
          h('div', { key: index, className: 'epub-book-card' },
            h('div', { className: 'epub-skeleton-cover' }),
            h('div', { className: 'epub-skeleton-line' }),
            h('div', { className: 'epub-skeleton-line short' }),
          ),
        ),
      )
    }

    function BookCard({ book, t, onOpen, opening, progress, onContextMenu }) {
      const [coverA, coverB] = paletteFor(book.id)
      const chapterCount = progress !== undefined && Number.isFinite(progress.chapterCount) ? progress.chapterCount : 0
      const chapterIndex = progress !== undefined && Number.isFinite(progress.chapterIndex) ? progress.chapterIndex : 0
      const percent = chapterCount > 0 ? Math.min(100, Math.max(3, ((chapterIndex + 0.08) / chapterCount) * 100)) : 0
      return h(
        'button',
        {
          type: 'button',
          className: cn('epub-book-card', book.hidden === true && 'is-hidden-book'),
          onClick: () => onOpen(book),
          onContextMenu: (event) => { event.preventDefault(); onContextMenu(book, event) },
          'aria-label': `${book.name}${opening ? ' …' : ''}`,
          disabled: opening,
        },
        h(
          'div',
          { className: 'epub-book-cover', style: { '--cover-a': coverA, '--cover-b': coverB } },
          h('div', { className: 'epub-cover-spine' }),
          h('div', { className: 'epub-cover-glow' }),
          book.hidden === true ? h('div', { className: 'epub-book-hidden-badge' }, t('library.hiddenBadge')) : null,
          h('div', { className: 'epub-cover-title' }, book.name),
          h('div', { className: 'epub-cover-foot' },
            h('span', null, book.format || 'BOOK'),
            opening ? h(Spinner, null) : h(IconBookOpen, { size: 13 }),
          ),
        ),
        h('div', { className: 'epub-book-meta' },
          h('div', { className: 'epub-book-title', title: book.name }, book.name),
          h('div', { className: 'epub-book-sub', title: book.relativePath }, progress !== undefined ? format(t('library.progress'), { chapter: String(chapterIndex + 1) }) : t('library.unread')),
          percent > 0
            ? h('div', { className: 'epub-book-progress' }, h('span', { style: { width: `${percent}%` } }))
            : null,
          progress !== undefined && chapterCount > 0
            ? h('div', { className: 'epub-book-progress-label' }, `${Math.round(percent)}% · ${format(t('library.chapterCount'), { count: chapterCount })}`)
            : h('div', { className: 'epub-book-progress-label' }, formatBytes(book.size)),
        ),
      )
    }

    function SearchResultCard({ item, t, downloading, onDownload }) {
      const [coverFailed, setCoverFailed] = React.useState(false)
      const [coverA, coverB] = paletteFor(item.id)
      return h(
        'div',
        { className: 'epub-result-card' },
        h(
          'div',
          { className: 'epub-result-cover', style: { '--cover-a': coverA, '--cover-b': coverB } },
          item.cover !== '' && !coverFailed
            ? h('img', {
                src: item.cover,
                alt: '',
                loading: 'lazy',
                referrerPolicy: 'no-referrer',
                onError: () => setCoverFailed(true),
              })
            : h('div', { className: 'epub-result-fallback' }, item.title),
        ),
        h(
          'div',
          { className: 'epub-result-body' },
          h(
            'div',
            { className: 'epub-result-top' },
            h('span', { className: cn('epub-source-badge', item.source === 'standardebooks' && 'is-standardebooks', item.source === 'custom' && 'is-custom') }, item.sourceName),
          ),
          h('div', { className: 'epub-result-title', title: item.title }, item.title),
          h('div', { className: 'epub-result-author', title: item.author }, item.author !== '' ? item.author : t('reader.unknownAuthor')),
          h(
            'div',
            { className: 'epub-result-foot' },
            h('span', { className: 'epub-result-lang' }, item.language !== '' ? item.language : t('library.publicDomain')),
            h(
              'button',
              { type: 'button', className: 'epub-result-btn', disabled: downloading, onClick: () => onDownload(item), title: t('library.download') },
              downloading ? h(Spinner, null) : h(IconDownload, { size: 12 }),
              downloading ? t('library.downloading') : t('library.download'),
            ),
          ),
        ),
      )
    }

    function Library({ ctx, t, onOpenBook, opening, onLocalBook, onPapers, onDossiers }) {
      const [state, setState] = React.useState({ status: 'loading', books: [], roots: [], error: '' })
      const [query, setQuery] = React.useState('')
      const [mode, setMode] = React.useState(() => {
        const search = searchStore.getState()
        if (search.status !== 'idle' || search.query !== '') return 'online'
        try {
          return window.localStorage.getItem(LIBRARY_MODE_KEY) === 'online' ? 'online' : 'shelf'
        } catch {
          return 'shelf'
        }
      })
      const [onlineQuery, setOnlineQuery] = React.useState(() => searchStore.getState().query)
      const online = React.useSyncExternalStore(searchStore.subscribe, searchStore.getSnapshot, searchStore.getSnapshot)
      const setOnline = React.useCallback((next) => searchStore.update(next), [])
      const [sourcePrefs, setSourcePrefs] = React.useState(readSourcePrefs)
      const [sourcePickerOpen, setSourcePickerOpen] = React.useState(false)
      const [customDrafts, setCustomDrafts] = React.useState(sourcePrefs.customs)
      const [sourceError, setSourceError] = React.useState('')
      const [downloadingId, setDownloadingId] = React.useState('')
      const [importing, setImporting] = React.useState(false)
      const [importError, setImportError] = React.useState('')
      const [dragOver, setDragOver] = React.useState(false)
      const [showHidden, setShowHidden] = React.useState(false)
      const [bookMenu, setBookMenu] = React.useState(null)
      const [settingsOpen, setSettingsOpen] = React.useState(false)
      const [settings, setSettings] = React.useState({ booksDir: '', papersDir: '', dossiersDir: '' })
      const [settingsDefaults, setSettingsDefaults] = React.useState({ booksDir: '', papersDir: '', dossiersDir: '' })
      const [settingsSaving, setSettingsSaving] = React.useState(false)
      const [settingsPicking, setSettingsPicking] = React.useState('')
      const [settingsError, setSettingsError] = React.useState('')
      const fileRef = React.useRef(null)

      React.useEffect(() => {
        if (bookMenu === null) return undefined
        const close = () => setBookMenu(null)
        window.addEventListener('click', close)
        return () => window.removeEventListener('click', close)
      }, [bookMenu])

      const load = React.useCallback(async () => {
        setState((current) => ({ ...current, status: 'loading', error: '' }))
        try {
          const data = await apiGet('/books')
          setState({ status: 'ready', books: data.books ?? [], roots: data.roots ?? [], error: '' })
        } catch (error) {
          setState({ status: 'error', books: [], roots: [], error: error instanceof Error ? error.message : String(error) })
        }
      }, [])

      React.useEffect(() => { void load() }, [load])

      const hiddenCount = state.books.filter((book) => book.hidden === true).length
      const filtered = React.useMemo(() => {
        const needle = query.trim().toLowerCase()
        return state.books.filter((book) => {
          if (!showHidden && book.hidden === true) return false
          if (needle === '') return true
          return `${book.name} ${book.relativePath}`.toLowerCase().includes(needle)
        })
      }, [query, state.books, showHidden])

      async function toggleHidden(book) {
        try {
          await apiPost('/books/hide', { id: book.id, hidden: book.hidden !== true })
          await load()
        } catch (error) {
          setImportError(error instanceof Error ? error.message : String(error))
        }
      }

      async function deleteBook(book) {
        try {
          await apiPost('/books/delete', { id: book.id })
          await load()
        } catch (error) {
          setImportError(error instanceof Error ? error.message : String(error))
        }
      }
      const progressMap = React.useMemo(() => readProgressMap(), [state.books])

      async function importFiles(files) {
        const list = Array.from(files ?? []).filter((file) => file !== null && file !== undefined)
        if (list.length === 0) return
        setImporting(true)
        setImportError('')
        const failures = []
        let last = null
        try {
          for (const file of list) {
            const extension = file.name.includes('.') ? `.${file.name.split('.').pop().toLowerCase()}` : ''
            if (CONVERSION_EXTENSIONS.has(extension)) {
              failures.push(`${file.name}：${t('library.conversionRequired')}`)
              continue
            }
            if (!BOOK_EXTENSIONS.has(extension)) {
              failures.push(`${file.name}：${t('library.importFailed')}`)
              continue
            }
            try {
              const buffer = await file.arrayBuffer()
              const response = await fetch(`${API}/import`, {
                method: 'POST',
                headers: {
                  'content-type': 'application/epub+zip',
                  'x-book-name': encodeURIComponent(file.name),
                },
                body: buffer,
              })
              const data = await responseJson(response)
              if (data !== null && data.book !== undefined) {
                last = {
                  book: data.book,
                  info: {
                    copied: data.copied === true,
                    created: data.created === true,
                    copyPath: typeof data.copyPath === 'string' ? data.copyPath : '',
                  },
                }
              }
            } catch (error) {
              failures.push(`${file.name}：${error instanceof Error ? error.message : String(error)}`)
            }
          }
          if (last !== null) onLocalBook(last.book, last.info)
          if (failures.length > 0) setImportError(failures.join('\n'))
        } finally {
          setImporting(false)
          if (fileRef.current !== null) fileRef.current.value = ''
        }
      }

      async function importFile(file) {
        await importFiles([file])
      }

      async function openSettings() {
        setSettingsOpen(true)
        setSettingsError('')
        try {
          const data = await apiGet('/settings')
          setSettings({
            booksDir: data.booksDir ?? '',
            papersDir: data.papersDir ?? '',
            dossiersDir: data.dossiersDir ?? '',
          })
          setSettingsDefaults({
            booksDir: data.defaultDir ?? '',
            papersDir: data.defaultPapersDir ?? '',
            dossiersDir: data.defaultDossiersDir ?? '',
          })
        } catch (reason) {
          setSettingsError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      async function chooseSettingsPath(field) {
        setSettingsPicking(field)
        setSettingsError('')
        try {
          const data = await apiPost('/settings/pick', {})
          if (typeof data.path === 'string' && data.path !== '') {
            setSettings((current) => ({ ...current, [field]: data.path }))
          }
        } catch (reason) {
          setSettingsError(reason instanceof Error ? reason.message : String(reason))
        } finally {
          setSettingsPicking('')
        }
      }

      async function saveSettings() {
        setSettingsSaving(true)
        setSettingsError('')
        try {
          const data = await apiPost('/settings', settings)
          setSettings({
            booksDir: data.booksDir ?? '',
            papersDir: data.papersDir ?? '',
            dossiersDir: data.dossiersDir ?? '',
          })
          setSettingsOpen(false)
          await load()
        } catch (reason) {
          setSettingsError(reason instanceof Error ? reason.message : String(reason))
        } finally {
          setSettingsSaving(false)
        }
      }

      function saveSourcePrefs(next) {
        setSourcePrefs(next)
        writeSourcePrefs(next)
      }

      function makeCustomId() {
        return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
      }

      function openSourcePicker() {
        setCustomDrafts(sourcePrefs.customs)
        setSourceError('')
        setSourcePickerOpen((open) => !open)
      }

      function toggleBuiltinSource(id) {
        saveSourcePrefs({ ...sourcePrefs, [id]: !sourcePrefs[id] })
        setSourceError('')
      }

      function addCustomDraft() {
        if (customDrafts.length >= MAX_CUSTOM_SOURCES) {
          setSourceError(t('library.customLimit'))
          return
        }
        setCustomDrafts([...customDrafts, { id: makeCustomId(), enabled: true, label: '', url: '' }])
        setSourceError('')
      }

      function updateCustomDraft(id, patch) {
        setCustomDrafts(customDrafts.map((custom) => custom.id === id ? { ...custom, ...patch } : custom))
        setSourceError('')
      }

      function removeCustomDraft(id) {
        setCustomDrafts(customDrafts.filter((custom) => custom.id !== id))
        setSourceError('')
      }

      function applyCustomSources() {
        const cleaned = customDrafts
          .map((custom) => ({
            id: custom.id,
            enabled: custom.enabled === true,
            label: custom.label.trim().slice(0, 80),
            url: custom.url.trim().slice(0, 2000),
          }))
          .filter((custom) => custom.url !== '' || custom.label !== '')
        if (cleaned.length > MAX_CUSTOM_SOURCES) {
          setSourceError(t('library.customLimit'))
          return
        }
        for (const custom of cleaned) {
          if (custom.enabled && !isHttpAddress(custom.url)) {
            setSourceError(t('library.sourceInvalid'))
            return
          }
        }
        saveSourcePrefs({ ...sourcePrefs, customs: cleaned })
        setSourceError('')
        setSourcePickerOpen(false)
      }

      const activeBuiltinSources = BUILTIN_SOURCES.filter((source) => sourcePrefs[source.id])
      const activeCustomSources = sourcePrefs.customs.filter((custom) => custom.enabled && isHttpAddress(custom.url.trim()))
      const searchBusy = online.status === 'loading' || online.loadingMore === true

      function stopOnlineSearch() {
        searchStore.stop()
      }

      function handleOnlineQueryChange(event) {
        const value = event.target.value
        setOnlineQuery(value)
        if (online.status === 'loading' || online.loadingMore === true || value === '') {
          searchStore.stop(value)
        }
      }

      function switchLibraryMode(next) {
        // Keep an in-flight search alive when moving between shelf/search tabs.
        setMode(next)
        try {
          window.localStorage.setItem(LIBRARY_MODE_KEY, next)
        } catch {
          // A full storage must not block tab switching.
        }
      }

      async function searchOnline(event) {
        if (event !== undefined) event.preventDefault()
        if (online.status === 'loading' || online.loadingMore === true) {
          stopOnlineSearch()
          return
        }
        const value = onlineQuery.trim()
        if (value === '') {
          setOnline({ status: 'error', results: [], warnings: [], error: t('library.onlinePlaceholder'), query: '' })
          return
        }
        const enabledCustoms = sourcePrefs.customs.filter((custom) => custom.enabled)
        if (enabledCustoms.some((custom) => !isHttpAddress(custom.url.trim()))) {
          setOnline({ status: 'error', results: [], warnings: [], error: t('library.sourceInvalid'), query: value })
          return
        }
        if (activeBuiltinSources.length === 0 && activeCustomSources.length === 0) {
          setOnline({ status: 'error', results: [], warnings: [], error: t('library.noSource'), query: value })
          return
        }
        const params = new URLSearchParams({
          q: value,
          sources: activeBuiltinSources.map((source) => source.id).join(','),
        })
        for (const custom of activeCustomSources) {
          params.append('custom', custom.url.trim())
          params.append('customName', custom.label.trim() || t('library.customSource'))
        }
        searchStore.start(`/search/stream?${params.toString()}`, value, t)
      }

      async function downloadResult(item) {
        if (downloadingId !== '') return
        setDownloadingId(item.id)
        setOnline((current) => ({ ...current, error: '' }))
        try {
          const data = await apiPost('/download', { id: item.id })
          if (data !== null && data.book !== undefined) {
            onLocalBook(data.book, {
              copied: data.copied === true,
              created: data.created === true,
              copyPath: typeof data.copyPath === 'string' ? data.copyPath : '',
            })
          }
        } catch (error) {
          setOnline((current) => ({
            ...current,
            status: current.results.length > 0 ? 'ready' : 'error',
            error: `${t('library.downloadFailed')}：${error instanceof Error ? error.message : String(error)}`,
          }))
        } finally {
          setDownloadingId('')
        }
      }

      const activeRoot = state.roots.find((root) => root.exists && root.books > 0) ?? state.roots.find((root) => root.exists)

      return h(
        'div',
        { className: 'epub-library', onDragOver: (event) => { event.preventDefault(); setDragOver(true) }, onDragLeave: () => setDragOver(false), onDrop: (event) => { event.preventDefault(); setDragOver(false); void importFiles(event.dataTransfer.files) } },
        h(
          'div',
          { className: 'epub-library-inner' },
          h(
            'header',
            { className: 'epub-library-head' },
            h(
              'div',
              { className: 'epub-brand' },
              h('div', { className: 'epub-brand-mark' }, h(IconBookOpen, { size: 28 })),
              h(
                'div',
                null,
                h('p', { className: 'epub-eyebrow' }, t('panel.eyebrow')),
                h('h1', { className: 'epub-title' }, t('panel.title')),
                h('p', { className: 'epub-subtitle' }, t('library.subtitle')),
                h('p', { className: 'epub-formats' }, t('library.supportedFormats')),
              ),
              h('button', { type: 'button', className: 'epub-brand-settings', onClick: () => void openSettings(), title: t('settings.title'), 'aria-label': t('settings.title') }, h(IconSettings, { size: 20 })),
            ),
            h(
              'div',
              { className: 'epub-head-actions' },
              mode === 'shelf'
                ? h('label', { className: 'epub-search' },
                    h(IconSearch, { size: 14 }),
                    h('input', {
                      value: query,
                      onChange: (event) => setQuery(event.target.value),
                      placeholder: t('library.search'),
                      'aria-label': t('library.search'),
                      type: 'search',
                    }),
                  )
                : null,
              mode === 'shelf'
                ? h('button', { type: 'button', className: 'epub-icon-btn', title: t('library.refresh'), 'aria-label': t('library.refresh'), onClick: () => void load() }, h(IconRefresh, { size: 15 }))
                : null,
              mode === 'shelf' && hiddenCount > 0
                ? h('button', { type: 'button', className: cn('epub-btn', showHidden && 'epub-btn-primary'), onClick: () => setShowHidden((value) => !value) }, showHidden ? t('library.hideHidden') : t('library.showHidden'), ` ${hiddenCount}`)
                : null,
              h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => fileRef.current?.click() }, h(IconUpload, { size: 14 }), t('library.open')),
              h('input', {
                ref: fileRef,
                type: 'file',
                accept: BOOK_ACCEPT,
                multiple: true,
                style: { display: 'none' },
                onChange: (event) => { void importFiles(event.target.files); event.target.value = '' },
              }),
            ),
          ),
          h(
            'div',
            { className: 'epub-library-tabs' },
            h(
              'div',
              { className: 'epub-mode-tabs', role: 'tablist', 'aria-label': t('library.shelfTab') + ' / ' + t('library.onlineTab') },
              h('button', { type: 'button', role: 'tab', 'aria-selected': mode === 'shelf', className: cn('epub-mode-tab', mode === 'shelf' && 'is-active'), onClick: () => switchLibraryMode('shelf') }, t('library.shelfTab')),
              h('button', { type: 'button', role: 'tab', 'aria-selected': mode === 'online', className: cn('epub-mode-tab', mode === 'online' && 'is-active'), onClick: () => switchLibraryMode('online') }, t('library.onlineTab')),
            ),
            h('button', { type: 'button', className: 'epub-mode-paper', onClick: onPapers }, h(IconList, { size: 14 }), t('papers.mode')),
            h('button', { type: 'button', className: 'epub-mode-paper', onClick: onDossiers }, h(IconFolderPlus, { size: 14 }), t('dossiers.mode')),
          ),
          mode === 'online'
            ? h(
                React.Fragment,
                null,
                h(
                  'div',
                  { className: 'epub-online-hero' },
                  h(
                    'div',
                    { className: 'epub-online-head' },
                    h('div', { className: 'epub-online-icon' }, h(IconSearch, { size: 21 })),
                    h('div', null,
                      h('h2', null, t('library.onlineTitle')),
                      h('p', null, t('library.onlineBody')),
                    ),
                  ),
                  h(
                    'form',
                    { className: 'epub-online-form', onSubmit: searchOnline },
                    h('input', {
                      className: 'epub-online-input',
                      value: onlineQuery,
                      onChange: handleOnlineQueryChange,
                      placeholder: t('library.onlinePlaceholder'),
                      'aria-label': t('library.onlinePlaceholder'),
                      type: 'search',
                    }),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'epub-btn epub-btn-primary epub-online-btn',
                        onClick: searchBusy ? stopOnlineSearch : () => { void searchOnline() },
                      },
                      searchBusy ? h(IconStop, { size: 12 }) : h(IconSearch, { size: 14 }),
                      searchBusy ? t('library.stopSearch') : t('library.searchAction'),
                    ),
                  ),
                  h('div', { className: 'epub-source-reminder' },
                    h('strong', null, '提示：'),
                    h('span', null, t('library.simplifiedReminder')),
                  ),
                  h('div', { className: 'epub-source-note' }, 'Project Gutenberg · Standard Ebooks · ', t('library.searchHint')),
                  h('div', { className: 'epub-source-note' }, t('library.sourceLanguageHint')),
                  h(
                    'div',
                    { className: 'epub-source-bar' },
                    h('span', { className: 'epub-source-bar-label' }, t('library.sourceLinks') + '：'),
                    activeBuiltinSources.map((source) =>
                      h('a', {
                        key: source.id,
                        className: 'epub-source-link',
                        href: source.url,
                        target: '_blank',
                        rel: 'noreferrer',
                        title: source.url,
                      }, source.name),
                    ),
                    activeCustomSources.map((custom, index) =>
                      h('span', { key: custom.id, className: 'epub-source-link is-custom', title: custom.url }, custom.label.trim() || `${t('library.customSource')} ${index + 1}`),
                    ),
                    activeBuiltinSources.length === 0 && activeCustomSources.length === 0
                      ? h('span', { className: 'epub-source-link is-empty' }, t('library.noSource'))
                      : null,
                    h('button', { type: 'button', className: 'epub-source-picker-btn', onClick: openSourcePicker }, t('library.chooseSources')),
                  ),
                  sourcePickerOpen
                    ? h(
                        'div',
                        { className: 'epub-source-picker' },
                        h('div', { className: 'epub-source-picker-head' },
                          h('strong', null, t('library.sourcePickerTitle')),
                          h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: () => setSourcePickerOpen(false), title: t('reader.close') }, h(IconX, { size: 14 })),
                        ),
                        h('div', { className: 'epub-source-picker-section-label' }, t('library.sourceBuiltin')),
                        BUILTIN_SOURCES.map((source) =>
                          h('label', { key: source.id, className: 'epub-source-option' },
                            h('input', { type: 'checkbox', checked: sourcePrefs[source.id] === true, onChange: () => toggleBuiltinSource(source.id) }),
                            h('span', { className: 'epub-source-option-body' },
                              h('span', { className: 'epub-source-option-name' }, source.name),
                              h('a', { className: 'epub-source-option-link', href: source.url, target: '_blank', rel: 'noreferrer', onClick: (event) => event.stopPropagation() }, source.url),
                            ),
                          ),
                        ),
                        h('div', { className: 'epub-source-custom' },
                          h('div', { className: 'epub-source-custom-head' },
                            h('span', { className: 'epub-source-picker-section-label' }, t('library.sourceCustom')),
                            h('button', { type: 'button', className: 'epub-source-add', onClick: addCustomDraft, title: t('library.addCustomSource') },
                              h(IconPlus, { size: 12 }),
                              t('library.addCustomSource'),
                            ),
                          ),
                          customDrafts.length === 0
                            ? h('div', { className: 'epub-source-hint' }, t('library.noCustomSources'))
                            : null,
                          customDrafts.map((custom, index) =>
                            h('div', { key: custom.id, className: 'epub-custom-row' },
                              h('div', { className: 'epub-custom-row-head' },
                                h('label', { className: 'epub-source-option is-compact' },
                                  h('input', {
                                    type: 'checkbox',
                                    checked: custom.enabled,
                                    onChange: (event) => updateCustomDraft(custom.id, { enabled: event.target.checked }),
                                  }),
                                  h('span', { className: 'epub-source-option-name' }, `${t('library.customSource')} ${index + 1}`),
                                ),
                                h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: () => removeCustomDraft(custom.id), title: t('library.removeSource') }, h(IconX, { size: 13 })),
                              ),
                              h('input', {
                                className: 'epub-source-input',
                                value: custom.label,
                                onChange: (event) => updateCustomDraft(custom.id, { label: event.target.value }),
                                placeholder: t('library.sourceCustomName'),
                              }),
                              h('input', {
                                className: 'epub-source-input',
                                value: custom.url,
                                onChange: (event) => updateCustomDraft(custom.id, { url: event.target.value }),
                                placeholder: t('library.sourceCustomUrl'),
                              }),
                            ),
                          ),
                          h('div', { className: 'epub-source-hint' }, t('library.sourceCustomHint')),
                          h('div', { className: 'epub-source-hint' }, t('library.sourceCustomExample')),
                          sourceError !== '' ? h('div', { className: 'epub-source-error' }, sourceError) : null,
                          h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: applyCustomSources }, t('library.sourceApply')),
                        ),
                        h('div', { className: 'epub-source-picker-foot' },
                          h('button', { type: 'button', className: 'epub-btn', onClick: () => setSourcePickerOpen(false) }, t('library.sourceDone')),
                        ),
                      )
                    : null,
                ),
                online.warnings.length > 0
                  ? h('div', { className: 'epub-warning-banner' }, h('strong', null, t('library.warning') + '：'), online.warnings.join('；'))
                  : null,
                online.error !== ''
                  ? h(ErrorBanner, {
                      title: online.status === 'error' ? t('library.searchFailed') : t('library.downloadFailed'),
                      message: online.error,
                      actionLabel: online.status === 'error' ? t('library.retry') : undefined,
                      onAction: online.status === 'error' ? () => void searchOnline() : undefined,
                    })
                  : null,
                online.status === 'loading' && online.results.length === 0
                  ? h('div', { className: 'epub-search-state' }, h(Spinner, null), h('p', null, t('library.searching')))
                  : online.status === 'ready' && online.results.length === 0 && online.loadingMore !== true
                    ? h(
                        'div',
                        { className: 'epub-search-state' },
                        h('div', { className: 'epub-empty-icon' }, h(IconSearch, { size: 26 })),
                        h('h3', null, t('library.noResults')),
                        h('p', null, t('library.noResultsBody')),
                      )
                    : online.results.length > 0
                      ? h(
                          React.Fragment,
                          null,
                          h(
                            'div',
                            { className: 'epub-shelf-meta' },
                            h('span', null, format(t('library.results'), { count: online.results.length })),
                            h('span', { className: 'epub-chip-static' }, t('library.sources'), ' · 实时'),
                          ),
                          online.loadingMore === true
                            ? h('div', { className: 'epub-search-more' }, h(Spinner, null), h('span', null, t('library.searchingMore')))
                            : null,
                          h(
                            'div',
                            { className: 'epub-search-grid' },
                            online.results.map((item) =>
                              h(SearchResultCard, {
                                key: item.id,
                                item,
                                t,
                                downloading: downloadingId === item.id,
                                onDownload: (result) => void downloadResult(result),
                              }),
                            ),
                          ),
                        )
                      : null,
              )
            : h(
                React.Fragment,
                null,
                state.status === 'error'
                  ? h(ErrorBanner, { title: t('library.failed'), message: state.error, actionLabel: t('library.retry'), onAction: () => void load() })
                  : null,
                importError !== ''
                  ? h(ErrorBanner, { title: t('library.importFailed'), message: importError })
                  : null,
                h(
                  'div',
                  { className: 'epub-shelf-meta' },
                  state.status === 'ready'
                    ? h(React.Fragment, null,
                        h('span', null, format(t('library.found'), { count: state.books.length })),
                        activeRoot !== undefined
                          ? h('span', { className: 'epub-chip-static' }, t('library.source'), ' · ', activeRoot.path)
                          : h('span', { className: 'epub-chip-static' }, t('library.noRoot')),
                        state.books.length === 0 && activeRoot === undefined
                          ? h('span', null, t('library.emptyBody'))
                          : null,
                        h('span', { style: { opacity: .7 } }, t('library.dragHint')),
                      )
                    : null,
                ),
                state.status === 'loading'
                  ? h(SkeletonShelf, null)
                  : state.status !== 'error' && state.books.length === 0
                    ? h(
                        'div',
                        { className: 'epub-empty' },
                        h('div', { className: 'epub-empty-icon' }, h(IconBookOpen, { size: 30 })),
                        h('h2', null, t('library.emptyTitle')),
                        h('p', null, t('library.emptyBody')),
                        h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => fileRef.current?.click() }, h(IconUpload, { size: 14 }), t('library.openLocal')),
                        h('small', null, t('library.dragHint')),
                      )
                    : filtered.length === 0
                      ? h(
                          'div',
                          { className: 'epub-empty' },
                          h('div', { className: 'epub-empty-icon' }, h(IconSearch, { size: 27 })),
                          h('h2', null, t('library.noMatch')),
                          h('p', null, t('library.noMatchBody')),
                          h('button', { type: 'button', className: 'epub-btn', onClick: () => setQuery('') }, t('library.clearSearch')),
                        )
                      : h(
                          'div',
                          { className: 'epub-shelf-grid' },
                          filtered.map((book) => h(BookCard, {
                            key: book.id,
                            book,
                            t,
                            onOpen: onOpenBook,
                            opening: opening === book.id,
                            progress: progressMap[book.id],
                            onContextMenu: (selected, event) => {
                              event.stopPropagation()
                              setBookMenu({ x: Math.min(event.clientX, window.innerWidth - 210), y: Math.min(event.clientY, window.innerHeight - 150), book: selected, confirmDelete: false })
                            },
                          })),
                        ),
              ),
          settingsOpen
          ? h('div', { className: 'epub-dialog-backdrop', onMouseDown: (event) => { if (event.target === event.currentTarget) setSettingsOpen(false) } },
              h('section', { className: 'epub-reader-settings' },
                h('header', null,
                  h('div', null, h('p', { className: 'epub-eyebrow' }, 'STORAGE'), h('h3', null, t('settings.title'))),
                  h('button', { type: 'button', className: 'epub-icon-btn', onClick: () => setSettingsOpen(false), title: t('reader.close') }, h(IconX, { size: 16 })),
                ),
                [['booksDir', t('settings.booksDir'), settingsDefaults.booksDir], ['papersDir', t('settings.papersDir'), settingsDefaults.papersDir], ['dossiersDir', t('settings.dossiersDir'), settingsDefaults.dossiersDir]].map(([field, label, placeholder]) =>
                  h('div', { className: 'epub-reader-settings-row', key: field },
                    h('label', { className: 'epub-reader-settings-label' }, label),
                    h('div', { className: 'epub-reader-settings-path' },
                      h('input', { className: 'epub-reader-settings-input', value: settings[field], placeholder, onChange: (event) => setSettings({ ...settings, [field]: event.target.value }) }),
                      h('button', { type: 'button', className: 'epub-btn', disabled: settingsPicking !== '', onClick: () => void chooseSettingsPath(field) }, settingsPicking === field ? '…' : t('settings.choose')),
                    ),
                  ),
                ),
                h('p', { className: 'epub-reader-settings-hint' }, t('settings.hint')),
                settingsError !== '' ? h('p', { className: 'epub-reader-settings-error' }, settingsError) : null,
                h('div', { className: 'epub-dialog-actions' },
                  h('button', { type: 'button', className: 'epub-btn', onClick: () => setSettingsOpen(false) }, t('settings.cancel')),
                  h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => void saveSettings(), disabled: settingsSaving }, settingsSaving ? '…' : t('settings.save')),
                ),
              ),
            )
          : null,
        bookMenu !== null
            ? h('div', { className: 'epub-context-menu', style: { left: `${bookMenu.x}px`, top: `${bookMenu.y}px` }, onClick: (event) => event.stopPropagation() },
                h('button', { type: 'button', className: 'epub-context-item', onClick: () => { const selected = bookMenu.book; setBookMenu(null); void toggleHidden(selected) } }, bookMenu.book.hidden === true ? t('library.unhide') : t('library.hide')),
                h('button', {
                  type: 'button',
                  className: cn('epub-context-item', bookMenu.confirmDelete && 'is-danger'),
                  onClick: () => {
                    if (!bookMenu.confirmDelete) { setBookMenu({ ...bookMenu, confirmDelete: true }); return }
                    const selected = bookMenu.book
                    setBookMenu(null)
                    void deleteBook(selected)
                  },
                }, bookMenu.confirmDelete ? t('library.confirmDelete') : t('library.delete')),
              )
            : null,
          dragOver
            ? h('div', { className: 'epub-importing' }, h('div', { className: 'epub-importing-card' }, h(Spinner, null), h('div', null, h('strong', null, t('library.dragHint')), h('span', null, t('library.importingHint')))))
            : null,
          importing
            ? h('div', { className: 'epub-importing' }, h('div', { className: 'epub-importing-card' }, h(Spinner, null), h('div', null, h('strong', null, t('library.importing')), h('span', null, t('library.importingHint')))))
            : null,
        ),
      )
    }

    // Reader ----------------------------------------------------------------

    function assistantTurn(text = '', status = 'streaming', error = '') {
      return { role: 'assistant', text, status, error }
    }

    function userTurn(text) {
      return { role: 'user', text }
    }

    function updateLastAssistant(turns, update) {
      const next = turns.slice()
      for (let index = next.length - 1; index >= 0; index -= 1) {
        if (next[index].role !== 'assistant') continue
        next[index] = update(next[index])
        break
      }
      return next
    }

    function AiPanel({
      t,
      ai,
      annotations,
      annotationStatus,
      annotationError,
      onClose,
      onShowHistory,
      onShowThread,
      onSelectAnnotation,
      onStop,
      onRetry,
      onAsk,
      onCopy,
      onFollowUp,
      onDeleteAnnotation,
      onDeleteTurn,
    }) {
      const [question, setQuestion] = React.useState('')
      const [collapsedAnswers, setCollapsedAnswers] = React.useState(() => new Set())
      const [pendingDelete, setPendingDelete] = React.useState(null)

      React.useEffect(() => {
        if (pendingDelete === null) return undefined
        const timer = window.setTimeout(() => setPendingDelete(null), 3500)
        return () => window.clearTimeout(timer)
      }, [pendingDelete])
      const selection = ai.selection
      const streaming = ai.status === 'streaming'
      const historyMode = ai.view !== 'thread'
      const records = Array.isArray(annotations) ? annotations : []
      const turns = Array.isArray(ai.turns) ? ai.turns : []
      const answers = turns.filter((turn) => turn.role === 'assistant' && turn.text !== '')
      const answerIndices = turns.map((turn, index) => turn.role === 'assistant' && turn.text !== '' ? index : -1).filter((index) => index >= 0)
      const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null
      const hasAnswer = answers.length > 0
      const hasPendingQuestion = turns.length > 0 && turns[turns.length - 1].role === 'user'
      const scrollRef = React.useRef(null)

      React.useEffect(() => {
        const element = scrollRef.current
        if (element !== null) element.scrollTop = element.scrollHeight
      }, [turns, streaming, historyMode, records])

      React.useEffect(() => {
        setCollapsedAnswers(new Set())
      }, [ai.annotationId, selection?.text])

      function submit(event) {
        event.preventDefault()
        const value = question.trim()
        if (value === '' || selection === null || streaming || hasPendingQuestion) return
        setQuestion('')
        onFollowUp(value)
      }

      const historyBody = h(
        'div',
        { className: 'epub-ai-scroll' },
        h('div', { className: 'epub-ai-history-head' },
          h('span', null, format(t('reader.historyCount'), { count: records.length })),
          h('span', null, t('reader.historyHint')),
        ),
        annotationError !== ''
          ? h('div', { className: 'epub-ai-error', role: 'alert' }, h('strong', null, t('reader.historyLoadFailed')), annotationError)
          : null,
        annotationStatus === 'loading'
          ? h('div', { className: 'epub-search-state', style: { minHeight: 150 } }, h(Spinner, null), h('p', null, t('reader.historyLoading')))
          : records.length === 0
            ? h(
                'div',
                { className: 'epub-ai-empty', style: { minHeight: 220 } },
                h('div', { className: 'epub-ai-empty-inner' },
                  h('div', { className: 'epub-ai-empty-icon' }, h(IconSparkles, { size: 22 })),
                  h('h3', null, t('reader.historyEmpty')),
                  h('p', null, t('reader.historyEmptyBody')),
                ),
              )
            : records.map((record) => {
                const recordTurns = Array.isArray(record.turns) ? record.turns : []
                const followUps = recordTurns.filter((turn) => turn.role === 'user').length
                return h(
                  'div',
                  {
                    key: record.id,
                    className: 'epub-ai-history-item is-expanded',
                    title: record.selectionText,
                  },
                  h('button', {
                    type: 'button',
                    className: cn('epub-ai-history-delete', pendingDelete === `ann-${record.id}` && 'is-confirming'),
                    onClick: () => {
                      if (pendingDelete === `ann-${record.id}`) { setPendingDelete(null); onDeleteAnnotation(record) }
                      else setPendingDelete(`ann-${record.id}`)
                    },
                    title: pendingDelete === `ann-${record.id}` ? t('reader.confirmDelete') : t('reader.deleteAnnotation'),
                    'aria-label': pendingDelete === `ann-${record.id}` ? t('reader.confirmDelete') : t('reader.deleteAnnotation'),
                  }, h(IconX, { size: 15 })),
                  h('div', { className: 'epub-ai-history-quote' }, record.selectionText),
                  recordTurns.map((turn, index) => turn.role === 'user'
                    ? h('div', { key: `q-${index}`, className: 'epub-ai-history-question' }, h('span', null, t('reader.followUpLabel')), turn.text)
                    : h('div', { key: `a-${index}`, className: 'epub-ai-history-answer' }, turn.text)),
                  h('div', { className: 'epub-ai-history-meta' },
                    h('span', { className: 'epub-ai-history-chapter' }, record.chapterTitle || t('reader.unknownChapter')),
                    h('span', null, formatAnnotationTime(record.updatedAt)),
                    h('span', null, format(t('reader.followUps'), { count: followUps })),
                  ),
                  h('div', { className: 'epub-ai-history-actions' },
                    h('button', { type: 'button', className: 'epub-btn', onClick: () => onSelectAnnotation(record) }, t('reader.continueThread')),
                  ),
                )
              }),
      )

      return h(
        'aside',
        { className: 'epub-ai', 'aria-label': historyMode ? t('reader.history') : t('reader.ai') },
        h(
          'div',
          { className: 'epub-ai-head' },
          h('div', { className: 'epub-ai-head-title' },
            historyMode ? h(IconList, { size: 15 }) : h(IconSparkles, { size: 15 }),
            historyMode ? t('reader.history') : t('reader.ai'),
          ),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 2 } },
            !historyMode && hasAnswer
              ? h('button', {
                  type: 'button',
                  className: 'epub-ai-collapse-all',
                  onClick: () => setCollapsedAnswers(collapsedAnswers.size >= answerIndices.length ? new Set() : new Set(answerIndices)),
                }, collapsedAnswers.size >= answerIndices.length ? t('reader.expandAll') : t('reader.collapseAll'))
              : null,
            historyMode && selection !== null
              ? h('button', { type: 'button', className: 'epub-icon-btn is-quiet', title: t('reader.backToThread'), 'aria-label': t('reader.backToThread'), onClick: onShowThread }, h(IconSparkles, { size: 15 }))
              : null,
            !historyMode && !streaming
              ? h('button', { type: 'button', className: 'epub-icon-btn is-quiet', title: t('reader.historyBack'), 'aria-label': t('reader.historyBack'), onClick: onShowHistory }, h(IconList, { size: 15 }))
              : null,
            h('button', { type: 'button', className: 'epub-icon-btn is-quiet', title: t('reader.close'), 'aria-label': t('reader.close'), onClick: onClose }, h(IconX, { size: 15 })),
          ),
        ),
        historyMode
          ? historyBody
          : selection === null
            ? h(
                'div',
                { className: 'epub-ai-empty' },
                h('div', { className: 'epub-ai-empty-inner' },
                  h('div', { className: 'epub-ai-empty-icon' }, h(IconSparkles, { size: 22 })),
                  h('h3', null, t('reader.aiEmptyTitle')),
                  h('p', null, t('reader.aiEmptyBody')),
                ),
              )
            : h(
                'div',
                { className: 'epub-ai-scroll', ref: scrollRef },
                h(
                  'div',
                  { className: 'epub-ai-quote' },
                  h('span', { className: 'epub-ai-quote-label' }, t('reader.quote')),
                  selection.text,
                ),
                turns.map((turn, index) => {
                  if (turn.role === 'user') {
                    return h(
                      'div',
                      { key: `u-${index}`, className: 'epub-ai-question' },
                      h('div', { className: 'epub-ai-question-head' },
                        h('span', { className: 'epub-ai-question-label' }, t('reader.followUpLabel')),
                        h('button', {
                          type: 'button',
                          className: cn('epub-ai-delete-btn', pendingDelete === `turn-${index}` && 'is-confirming'),
                          onClick: () => {
                            if (pendingDelete === `turn-${index}`) { setPendingDelete(null); onDeleteTurn(index) }
                            else setPendingDelete(`turn-${index}`)
                          },
                          title: pendingDelete === `turn-${index}` ? t('reader.confirmDelete') : t('reader.deleteFollowUp'),
                        }, h(IconX, { size: 15 })),
                      ),
                      turn.text,
                    )
                  }
                  if (turn.text === '' && turn.status !== 'streaming' && turn.error === '') return null
                  const collapsed = collapsedAnswers.has(index)
                  return h(
                    'div',
                    { key: `a-${index}`, className: 'epub-ai-answer' },
                    h('div', { className: 'epub-ai-answer-label' },
                      h(IconSparkles, { size: 12 }),
                      t('reader.answerLabel'),
                      h('button', {
                        type: 'button',
                        className: 'epub-ai-collapse-btn',
                        onClick: () => setCollapsedAnswers((current) => {
                          const next = new Set(current)
                          if (next.has(index)) next.delete(index)
                          else next.add(index)
                          return next
                        }),
                      }, collapsed ? t('reader.expand') : t('reader.collapse')),
                    ),
                    turn.status === 'streaming' && turn.text === ''
                      ? h('div', { className: 'epub-ai-status' }, h(Spinner, null), t('reader.thinking'))
                      : null,
                    turn.error !== ''
                      ? h('div', { className: 'epub-ai-error', role: 'alert' },
                          h('strong', null, t('reader.error')),
                          turn.error,
                        )
                      : null,
                    turn.text !== ''
                      ? collapsed
                        ? h('div', { className: 'epub-ai-text is-collapsed' }, `${turn.text.slice(0, 120)}${turn.text.length > 120 ? '…' : ''}`)
                        : h('div', { className: 'epub-ai-text' }, turn.text, turn.status === 'streaming' ? h('span', { className: 'epub-ai-caret' }) : null)
                      : null,
                  )
                }),
                h(
                  'div',
                  { className: 'epub-ai-actions' },
                  streaming
                    ? h('button', { type: 'button', className: 'epub-btn', onClick: onStop }, h(IconStop, { size: 12 }), t('reader.stop'))
                    : ai.status === 'error' || (!hasAnswer && ai.status === 'idle') || (hasPendingQuestion && ai.status !== 'streaming')
                      ? h('button', { type: 'button', className: 'epub-btn', onClick: onRetry }, h(IconRefresh, { size: 12 }), t('reader.retryExplain'))
                      : null,
                  lastAnswer !== null
                    ? h('button', { type: 'button', className: 'epub-btn', onClick: () => onCopy(lastAnswer.text) }, h(IconCopy, { size: 12 }), t('reader.copy'))
                    : null,
                ),
                !streaming && !hasPendingQuestion && hasAnswer
                  ? h(
                      'div',
                      { className: 'epub-chips' },
                      h('button', { type: 'button', className: 'epub-chip', onClick: () => onAsk(t('reader.ask.translate')) }, t('reader.chip.translate')),
                      h('button', { type: 'button', className: 'epub-chip', onClick: () => onAsk(t('reader.ask.example')) }, t('reader.chip.example')),
                      h('button', { type: 'button', className: 'epub-chip', onClick: () => onAsk(t('reader.ask.background')) }, t('reader.chip.background')),
                      h('button', { type: 'button', className: 'epub-chip', onClick: () => onAsk(t('reader.ask.explain')) }, t('reader.chip.explain')),
                    )
                  : null,
              ),
        historyMode
          ? h('div', { className: 'epub-ai-footer' }, h('div', { className: 'epub-ai-disclaimer' }, t('reader.disclaimer')))
          : h(
              'div',
              { className: 'epub-ai-footer' },
              h(
                'form',
                { className: 'epub-followup', onSubmit: submit },
                h('input', {
                  value: question,
                  onChange: (event) => setQuestion(event.target.value),
                  placeholder: streaming || hasPendingQuestion ? t('reader.waitForAnswer') : t('reader.followUp'),
                  'aria-label': t('reader.followUp'),
                  disabled: selection === null || streaming || hasPendingQuestion,
                }),
                h('button', { type: 'submit', disabled: selection === null || streaming || hasPendingQuestion || question.trim() === '', title: t('reader.send'), 'aria-label': t('reader.send') }, h(IconSend, { size: 14 })),
              ),
              h('div', { className: 'epub-ai-disclaimer' }, t('reader.disclaimer')),
            ),
      )
    }

    function PaperLibrary({ t, onBack, onRead, onCompare }) {
      const [state, setState] = React.useState({ status: 'loading', folders: [], papers: [], error: '' })
      const [activeFolder, setActiveFolder] = React.useState('all')
      const [importing, setImporting] = React.useState(false)
      const [importError, setImportError] = React.useState('')
      const [dragOver, setDragOver] = React.useState('')
      const [dialog, setDialog] = React.useState(null)
      const [contextMenu, setContextMenu] = React.useState(null)
      const [importFolderId, setImportFolderId] = React.useState(null)
      const fileRef = React.useRef(null)

      React.useEffect(() => {
        function close() { setContextMenu(null) }
        window.addEventListener('click', close)
        return () => window.removeEventListener('click', close)
      }, [])

      const load = React.useCallback(async () => {
        setState((current) => ({ ...current, status: current.papers.length === 0 ? 'loading' : current.status, error: '' }))
        try {
          const data = await apiGet('/papers')
          setState({ status: 'ready', folders: Array.isArray(data?.folders) ? data.folders : [], papers: Array.isArray(data?.papers) ? data.papers : [], error: '' })
        } catch (error) {
          setState({ status: 'error', folders: [], papers: [], error: error instanceof Error ? error.message : String(error) })
        }
      }, [])

      React.useEffect(() => { void load() }, [load])

      function createFolder() {
        setDialog({ mode: 'folder', value: '', id: '' })
      }

      function renameFolder(folder) {
        setDialog({ mode: 'folderRename', value: folder.name, id: folder.id })
      }

      function renamePaper(paper) {
        setDialog({ mode: 'paperRename', value: paper.title, id: paper.id })
      }

      async function submitDialog() {
        if (dialog === null) return
        const value = dialog.value.trim()
        if (value === '') return
        try {
          if (dialog.mode === 'folder') await apiPost('/papers/folder', { name: value })
          else if (dialog.mode === 'folderRename') await apiPost('/papers/folder/rename', { id: dialog.id, name: value })
          else await apiPost('/papers/rename', { id: dialog.id, title: value })
          setDialog(null)
          await load()
        } catch (error) {
          setImportError(error instanceof Error ? error.message : String(error))
        }
      }

      function openContext(event, kind, data = {}) {
        event.preventDefault()
        event.stopPropagation()
        setContextMenu({ x: Math.min(event.clientX, window.innerWidth - 220), y: Math.min(event.clientY, window.innerHeight - 180), kind, confirmDelete: false, ...data })
      }

      function importToFolder(folderId) {
        setImportFolderId(folderId)
        setContextMenu(null)
        fileRef.current?.click()
      }

      async function deletePaper(paper) {
        try {
          await apiPost('/papers/delete', { id: paper.id })
          await load()
        } catch (error) {
          setImportError(error instanceof Error ? error.message : String(error))
        }
      }

      async function movePaper(id, folderId) {
        try { await apiPost('/papers/move', { id, folderId }); await load() } catch (error) { setImportError(error instanceof Error ? error.message : String(error)) }
        setDragOver('')
      }

      async function importPdf(file, openAfter = true) {
        if (file === undefined) return
        setImporting(true)
        setImportError('')
        try {
          const folderId = importFolderId !== null ? importFolderId : activeFolder === 'all' || activeFolder === 'root' ? '' : activeFolder
          const data = await apiUpload('/papers/import', file, {
            'x-paper-name': encodeURIComponent(file.name),
            'x-paper-folder': folderId,
          })
          setImportFolderId(null)
          await load()
          if (openAfter && data?.paper?.id !== undefined) onRead(data.paper.id)
        } catch (error) {
          setImportError(error instanceof Error ? error.message : String(error))
        } finally {
          setImporting(false)
          setImportFolderId(null)
        }
      }

      async function importPdfs(files) {
        const list = Array.from(files ?? []).filter((file) => file !== null && file !== undefined)
        if (list.length === 0) return
        if (list.length === 1) { await importPdf(list[0]); return }
        setImporting(true)
        setImportError('')
        const folderId = importFolderId !== null ? importFolderId : activeFolder === 'all' || activeFolder === 'root' ? '' : activeFolder
        const failures = []
        try {
          for (const file of list) {
            if (!file.name.toLowerCase().endsWith('.pdf')) { failures.push(`${file.name}：只支持 PDF`); continue }
            try {
              await apiUpload('/papers/import', file, {
                'x-paper-name': encodeURIComponent(file.name),
                'x-paper-folder': folderId,
              })
            } catch (error) {
              failures.push(`${file.name}：${error instanceof Error ? error.message : String(error)}`)
            }
          }
          await load()
        } finally {
          setImporting(false)
          setImportFolderId(null)
          if (failures.length > 0) setImportError(failures.join('\n'))
        }
      }

      const visible = state.papers.filter((paper) => {
        if (activeFolder === 'all') return true
        if (activeFolder === 'root') return (paper.folderId ?? '') === ''
        return paper.folderId === activeFolder
      })
      const folderName = activeFolder === 'all'
        ? t('papers.all')
        : activeFolder === 'root'
          ? t('papers.title')
          : state.folders.find((folder) => folder.id === activeFolder)?.name ?? t('papers.title')

      return h('div', { className: 'epub-papers' },
        h('header', { className: 'epub-papers-head' },
          h('div', { className: 'epub-papers-head-left' },
            h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: onBack, title: t('papers.back'), 'aria-label': t('papers.back') }, h(IconArrowLeft, { size: 17 })),
            h('div', null,
              h('h1', { className: 'epub-papers-title' }, t('papers.title')),
              h('p', { className: 'epub-papers-subtitle' }, t('papers.subtitle')),
              h('p', { className: 'epub-papers-storage' }, t('papers.storageHint')),
            ),
          ),
          h('div', { className: 'epub-papers-head-actions' },
            h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => { setImportFolderId(null); fileRef.current?.click() } }, h(IconUpload, { size: 14 }), t('papers.import')),
            h('input', { ref: fileRef, type: 'file', accept: '.pdf,application/pdf', multiple: true, style: { display: 'none' }, onChange: (event) => { void importPdfs(event.target.files); event.target.value = '' } }),
          ),
        ),
        importError !== '' ? h(ErrorBanner, { title: t('papers.importFailed'), message: importError, actionLabel: t('papers.retry'), onAction: () => setImportError('') }) : null,
        h('div', { className: 'epub-papers-body' },
          h('aside', { className: 'epub-paper-folders' },
            h('div', { className: 'epub-paper-folder-top' },
              h('button', { type: 'button', className: cn('epub-paper-folder', activeFolder === 'all' && 'is-active'), onClick: () => setActiveFolder('all') }, t('papers.all'), h('span', null, String(state.papers.length))),
              h('button', { type: 'button', className: 'epub-paper-folder-add', onClick: createFolder, title: t('papers.newFolder'), 'aria-label': t('papers.newFolder') }, h(IconFolderPlus, { size: 15 })),
            ),
            h('button', { type: 'button', className: cn('epub-paper-folder', activeFolder === 'root' && 'is-active'), onClick: () => setActiveFolder('root') }, t('papers.title'), h('span', null, String(state.papers.filter((paper) => (paper.folderId ?? '') === '').length))),
            state.folders.map((folder) =>
              h('div', { key: folder.id, className: cn('epub-paper-folder-wrap', activeFolder === folder.id && 'is-active', dragOver === folder.id && 'is-drop') , onContextMenu: (event) => openContext(event, 'folder', { folderId: folder.id }), onDragOver: (event) => { event.preventDefault(); setDragOver(folder.id) }, onDragLeave: () => setDragOver(''), onDrop: (event) => { event.preventDefault(); const id = event.dataTransfer.getData('text/paper-id'); if (id !== '') void movePaper(id, folder.id) } },
                h('button', { type: 'button', className: cn('epub-paper-folder', activeFolder === folder.id && 'is-active'), onClick: () => setActiveFolder(folder.id) }, folder.name, h('span', null, String(state.papers.filter((paper) => paper.folderId === folder.id).length))),
                h('button', { type: 'button', className: 'epub-paper-folder-rename', onClick: () => void renameFolder(folder), title: t('papers.renameFolder') }, '✎'),
              ),
            ),
          ),
          h('main', { className: 'epub-paper-main', onContextMenu: (event) => openContext(event, 'library') },
            h('div', { className: 'epub-paper-main-head' }, h('h2', null, folderName), h('span', null, t('papers.dropHere'))),
            state.status === 'loading'
              ? h('div', { className: 'epub-paper-empty' }, h(Spinner, null), h('p', null, t('papers.importing')))
              : state.status === 'error'
                ? h(ErrorBanner, { title: t('papers.loadFailed'), message: state.error, actionLabel: t('papers.retry'), onAction: () => void load() })
                : visible.length === 0
                  ? h('div', { className: 'epub-paper-empty' }, h('div', { className: 'epub-empty-icon' }, h(IconBookOpen, { size: 26 })), h('h3', null, t('papers.empty')), h('p', null, t('papers.emptyHint')))
                  : h('div', { className: 'epub-paper-grid' },
                      visible.map((paper) =>
                        h('article', {
                          key: paper.id,
                          className: 'epub-paper-card',
                          draggable: true,
                          onDragStart: (event) => event.dataTransfer.setData('text/paper-id', paper.id),
                          onContextMenu: (event) => openContext(event, 'paper', { paperId: paper.id }),
                        },
                          h('div', { className: 'epub-paper-card-top' },
                            h('span', { className: 'epub-source-badge' }, paper.kind === 'translation' ? '中文' : 'PDF'),
                            paper.kind === 'translation' ? h('span', { className: 'epub-paper-kind' }, t('papers.translation')) : null,
                          ),
                          h('h3', { className: 'epub-paper-card-title', title: paper.title }, paper.title),
                          h('p', { className: 'epub-paper-card-meta' }, format(t('papers.progress'), { done: paper.translatedCount, total: paper.unitCount })),
                          h('div', { className: 'epub-paper-card-actions' },
                            h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => onRead(paper.id) }, h(IconBookOpen, { size: 13 }), t('papers.read')),
                            h('button', { type: 'button', className: 'epub-btn', onClick: () => void renamePaper(paper) }, t('papers.rename')),
                          ),
                        ),
                      ),
                    ),
          ),
        ),
        contextMenu !== null
          ? h('div', {
              className: 'epub-context-menu',
              style: { left: `${contextMenu.x}px`, top: `${contextMenu.y}px` },
              onClick: (event) => event.stopPropagation(),
            },
              contextMenu.kind === 'library' || contextMenu.kind === 'folder'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); createFolder() } }, t('papers.newFolder'))
                : null,
              contextMenu.kind === 'folder'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => importToFolder(contextMenu.folderId) }, t('papers.importHere'))
                : null,
              contextMenu.kind === 'library'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => importToFolder(activeFolder === 'all' || activeFolder === 'root' ? '' : activeFolder) }, t('papers.importHere'))
                : null,
              contextMenu.kind === 'folder'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { const folder = state.folders.find((entry) => entry.id === contextMenu.folderId); setContextMenu(null); if (folder !== undefined) renameFolder(folder) } }, t('papers.renameFolder'))
                : null,
              contextMenu.kind === 'paper'
                ? (() => {
                    const paper = state.papers.find((entry) => entry.id === contextMenu.paperId)
                    return paper === undefined ? null : h(React.Fragment, null,
                      h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); onRead(paper.id) } }, t('papers.read')),
                      h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); renamePaper(paper) } }, t('papers.rename')),
                      h('button', {
                        type: 'button',
                        className: cn('epub-context-item', contextMenu.confirmDelete && 'is-danger'),
                        onClick: () => {
                          if (!contextMenu.confirmDelete) { setContextMenu({ ...contextMenu, confirmDelete: true }); return }
                          setContextMenu(null)
                          void deletePaper(paper)
                        },
                      }, contextMenu.confirmDelete ? t('papers.confirmDelete') : t('papers.delete')),
                    )
                  })()
                : null,
            )
          : null,
        dialog !== null
          ? h('div', { className: 'epub-dialog-backdrop', onMouseDown: (event) => { if (event.target === event.currentTarget) setDialog(null) } },
              h('div', { className: 'epub-dialog' },
                h('h3', null, dialog.mode === 'folder' ? t('papers.newFolder') : dialog.mode === 'folderRename' ? t('papers.renameFolder') : t('papers.renamePaper')),
                h('input', {
                  className: 'epub-dialog-input',
                  autoFocus: true,
                  value: dialog.value,
                  onChange: (event) => setDialog({ ...dialog, value: event.target.value }),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') { event.preventDefault(); void submitDialog() }
                    if (event.key === 'Escape') setDialog(null)
                  },
                  placeholder: dialog.mode === 'folder' || dialog.mode === 'folderRename' ? t('papers.folderName') : t('papers.renamePaper'),
                }),
                h('div', { className: 'epub-dialog-actions' },
                  h('button', { type: 'button', className: 'epub-btn', onClick: () => setDialog(null) }, t('papers.cancel')),
                  h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => void submitDialog() }, t('papers.confirm')),
                ),
              ),
            )
          : null,
        importing ? h('div', { className: 'epub-importing' }, h('div', { className: 'epub-importing-card' }, h(Spinner, null), h('div', null, h('strong', null, t('papers.importing')), h('span', null, t('papers.subtitle'))))) : null,
      )
    }

    function DossierLibrary({ t, onBack, onRead }) {
      const [state, setState] = React.useState({ status: 'loading', folders: [], items: [], error: '' })
      const [activeFolder, setActiveFolder] = React.useState('all')
      const [query, setQuery] = React.useState('')
      const [search, setSearch] = React.useState({ busy: false, results: [], error: '', query: '' })
      const [importing, setImporting] = React.useState(false)
      const [error, setError] = React.useState('')
      const [dialog, setDialog] = React.useState(null)
      const [contextMenu, setContextMenu] = React.useState(null)
      const [importFolderId, setImportFolderId] = React.useState(null)
      const [expandedFolders, setExpandedFolders] = React.useState(() => new Set())
      const [clearConfirm, setClearConfirm] = React.useState(null)
      const [skillEditor, setSkillEditor] = React.useState(null)
      const [summary, setSummary] = React.useState({ open: false, status: 'idle', busy: false, text: '', title: '', error: '', statusText: '', turns: [], question: '', selection: '', askStatus: 'idle' })
      const fileRef = React.useRef(null)
      const summaryAbort = React.useRef(null)
      const summaryInputRef = React.useRef(null)
      const searchAbort = React.useRef(null)

      const load = React.useCallback(async () => {
        setState((current) => ({ ...current, status: current.items.length === 0 ? 'loading' : current.status, error: '' }))
        try {
          const data = await apiGet('/dossiers')
          setState({ status: 'ready', folders: data.folders ?? [], items: data.items ?? [], error: '' })
        } catch (reason) {
          setState({ status: 'error', folders: [], items: [], error: reason instanceof Error ? reason.message : String(reason) })
        }
      }, [])

      React.useEffect(() => { void load() }, [load])

      React.useEffect(() => {
        if (contextMenu === null) return undefined
        const close = () => setContextMenu(null)
        window.addEventListener('click', close)
        return () => window.removeEventListener('click', close)
      }, [contextMenu])

      React.useEffect(() => {
        if (activeFolder === 'all' || activeFolder === '') return
        setExpandedFolders((current) => new Set(current).add(activeFolder))
      }, [activeFolder])

      React.useEffect(() => {
        searchAbort.current?.abort()
        searchAbort.current = null
      }, [activeFolder])

      React.useEffect(() => () => {
        searchAbort.current?.abort()
        summaryAbort.current?.abort()
      }, [])

      const folderId = activeFolder === 'all' || activeFolder === 'root' ? '' : activeFolder
      const folder = state.folders.find((entry) => entry.id === activeFolder)
      const folderLabel = activeFolder === 'all' ? t('dossiers.all') : activeFolder === 'root' ? t('dossiers.root') : folder?.name ?? t('dossiers.title')
      const documents = state.items.filter((item) => item.kind === 'document' && (activeFolder === 'all' || item.folderId === folderId))
      const shown = search.query !== '' ? search.results : documents
      const summaryLocked = summary.busy || summary.status === 'streaming' || summary.askStatus === 'streaming'

      function skillsFor(id) {
        return state.items.filter((item) => item.kind === 'skill' && item.folderId === id)
      }

      function toggleFolder(id) {
        setExpandedFolders((current) => {
          const next = new Set(current)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }

      function renderFolderSkills(id) {
        const list = skillsFor(id)
        return h('div', { className: 'epub-dossier-folder-skills' },
          list.length === 0
            ? h('p', { className: 'epub-dossier-skill-empty' }, t('dossiers.noSkill'))
            : list.map((item) => h('button', {
                key: item.id,
                type: 'button',
                className: cn('epub-dossier-skill', item.preview === '' && 'is-empty'),
                onClick: () => void openSkillEditor(item),
                onContextMenu: (event) => openContext(event, 'item', { itemId: item.id }),
                title: item.preview || t('dossiers.skillEmptyHint'),
              }, h(IconSparkles, { size: 12 }), item.title)),
        )
      }

      function openContext(event, kind, data = {}) {
        event.preventDefault()
        event.stopPropagation()
        setContextMenu({ x: Math.min(event.clientX, window.innerWidth - 210), y: Math.min(event.clientY, window.innerHeight - 170), kind, confirmDelete: false, ...data })
      }

      function openDialog(mode, value = '', id = '') {
        setDialog({ mode, value, id })
      }

      async function submitDialog() {
        if (dialog === null || dialog.value.trim() === '') return
        const name = dialog.value.trim()
        try {
          let createdFolderId = ''
          if (dialog.mode === 'folder') {
            const data = await apiPost('/dossiers/folder', { name })
            createdFolderId = data?.folder?.id ?? ''
          } else if (dialog.mode === 'folderRename') await apiPost('/dossiers/folder/rename', { id: dialog.id, name })
          else if (dialog.mode === 'rename') await apiPost('/dossiers/rename', { id: dialog.id, title: name })
          setDialog(null)
          await load()
          if (createdFolderId !== '') {
            setActiveFolder(createdFolderId)
            setExpandedFolders((current) => new Set(current).add(createdFolderId))
          }
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      async function importFiles(files) {
        const list = Array.from(files ?? []).filter((file) => file !== null && file !== undefined)
        if (list.length === 0) return
        setImporting(true)
        setError('')
        const failures = []
        const targetFolder = importFolderId !== null ? importFolderId : folderId
        try {
          for (const file of list) {
            try {
              const data = await apiUpload('/dossiers/import', file, {
                'x-dossier-name': encodeURIComponent(file.name),
                'x-dossier-folder': targetFolder,
              })
              if (data?.item !== undefined) {
                setState((current) => ({
                  status: 'ready',
                  error: '',
                  folders: current.folders,
                  items: [...current.items.filter((entry) => entry.id !== data.item.id), data.item],
                }))
              }
            } catch (reason) {
              failures.push(`${file.name}：${reason instanceof Error ? reason.message : String(reason)}`)
            }
          }
          await load()
        } finally {
          setImporting(false)
          setImportFolderId(null)
          if (fileRef.current !== null) fileRef.current.value = ''
          if (failures.length > 0) setError(failures.join('\n'))
        }
      }

      function stopSearch() {
        searchAbort.current?.abort()
        searchAbort.current = null
        setSearch((current) => ({ ...current, busy: false }))
      }

      async function runSearch(event) {
        if (event !== undefined) event.preventDefault()
        const value = query.trim()
        if (value === '') { stopSearch(); setSearch({ busy: false, results: [], error: '', query: '' }); return }
        searchAbort.current?.abort()
        const controller = new AbortController()
        searchAbort.current = controller
        setSearch({ busy: true, results: [], error: '', query: value })
        try {
          await apiStreamSearch(`/dossiers/search/stream?folder=${encodeURIComponent(folderId)}&q=${encodeURIComponent(value)}`, {
            signal: controller.signal,
            onEvent: (streamEvent) => {
              if (streamEvent.type === 'match' && streamEvent.match !== undefined) {
                setSearch((current) => ({ ...current, results: [...current.results, streamEvent.match] }))
              } else if (streamEvent.type === 'done') {
                setSearch((current) => ({ ...current, busy: false }))
              } else if (streamEvent.type === 'error') {
                setSearch((current) => ({ ...current, busy: false, error: String(streamEvent.error ?? '搜索失败') }))
              }
            },
          })
          setSearch((current) => ({ ...current, busy: false }))
        } catch (reason) {
          if (controller.signal.aborted) {
            setSearch((current) => ({ ...current, busy: false }))
            return
          }
          setSearch((current) => ({ ...current, busy: false, error: reason instanceof Error ? reason.message : String(reason) }))
        } finally {
          if (searchAbort.current === controller) searchAbort.current = null
        }
      }

      async function openSkillEditor(item) {
        try {
          const data = await apiGet(`/dossiers/skill?id=${encodeURIComponent(item.id)}`)
          setSkillEditor({ id: item.id, title: item.title, text: data.text ?? '' })
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      async function saveSkill() {
        if (skillEditor === null) return
        try {
          await apiPost('/dossiers/skill', { id: skillEditor.id, text: skillEditor.text })
          setSkillEditor(null)
          await load()
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      async function createSkill(target = folderId) {
        try {
          await apiPost('/dossiers/skill/create', { folderId: target })
          setExpandedFolders((current) => new Set(current).add(target))
          await load()
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      function stopSummary() {
        summaryAbort.current?.abort()
        summaryAbort.current = null
        setSummary((current) => {
          const turns = current.turns.map((turn, index) => index === current.turns.length - 1 && turn.role === 'assistant' && turn.status === 'streaming' ? { ...turn, status: 'idle' } : turn)
          return { ...current, turns, busy: false, status: current.status === 'streaming' ? 'idle' : current.status, askStatus: current.askStatus === 'streaming' ? 'idle' : current.askStatus, statusText: '' }
        })
      }

      async function startSummary(options = {}) {
        const controller = new AbortController()
        summaryAbort.current?.abort()
        summaryAbort.current = controller
        setSummary({ open: true, status: 'streaming', busy: true, text: '', title: options.title ?? t('dossiers.summaryTitle'), error: '', statusText: t('dossiers.summaryPreparing'), turns: [], question: '', selection: '', askStatus: 'idle' })
        try {
          await apiStreamJson('/dossiers/summary', {
            folderId,
            ids: Array.isArray(options.ids) ? options.ids : [],
            query: options.query ?? '',
          }, {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'status' && typeof event.text === 'string') {
                setSummary((current) => ({ ...current, statusText: event.text }))
              } else if (event.type === 'delta' && typeof event.text === 'string') {
                setSummary((current) => ({ ...current, text: current.text + event.text }))
              } else if (event.type === 'done') {
                setSummary((current) => ({ ...current, status: 'done', statusText: '', text: event.text ?? current.text }))
              } else if (event.type === 'error') {
                setSummary((current) => ({ ...current, status: 'error', statusText: '', error: String(event.error ?? 'AI 总结失败') }))
              }
            },
          })
        } catch (reason) {
          if (controller.signal.aborted) return
          setSummary((current) => ({ ...current, status: 'error', statusText: '', error: reason instanceof Error ? reason.message : String(reason) }))
        } finally {
          summaryAbort.current = null
          setSummary((current) => ({ ...current, busy: false }))
        }
      }

      function captureSummarySelection(event) {
        if (summaryLocked) return
        const selection = window.getSelection()
        const text = selection === null ? '' : selection.toString().trim()
        if (text === '') return
        const anchor = selection.anchorNode
        if (anchor !== null && anchor !== undefined && !event.currentTarget.contains(anchor)) return
        setSummary((current) => ({ ...current, selection: text }))
        window.requestAnimationFrame(() => summaryInputRef.current?.focus())
      }

      async function askSummary() {
        if (summaryLocked) return
        const question = summary.question.trim()
        const selected = summary.selection.trim()
        if (question === '' && selected === '') return
        const text = question === '' ? t('dossiers.askSelected') : question
        const history = summary.turns
          .filter((turn) => (turn.role === 'user' || turn.role === 'assistant') && turn.text.trim() !== '')
          .slice(-10)
        const controller = new AbortController()
        summaryAbort.current?.abort()
        summaryAbort.current = controller
        setSummary((current) => ({
          ...current,
          turns: [...current.turns, { role: 'user', text }, { role: 'assistant', text: '', status: 'streaming' }],
          question: '',
          selection: '',
          askStatus: 'streaming',
          statusText: t('dossiers.thinking'),
          error: '',
        }))
        try {
          await apiStreamJson('/dossiers/ask', {
            folderId,
            summary: summary.text,
            selection: selected,
            question,
            history,
          }, {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'status' && typeof event.text === 'string') {
                setSummary((current) => ({ ...current, statusText: event.text }))
              } else if (event.type === 'delta' && typeof event.text === 'string') {
                setSummary((current) => {
                  const turns = [...current.turns]
                  const last = turns[turns.length - 1]
                  if (last !== undefined && last.role === 'assistant') turns[turns.length - 1] = { ...last, text: last.text + event.text }
                  return { ...current, turns }
                })
              } else if (event.type === 'done') {
                setSummary((current) => {
                  const turns = [...current.turns]
                  const last = turns[turns.length - 1]
                  if (last !== undefined && last.role === 'assistant') turns[turns.length - 1] = { ...last, text: event.text ?? last.text, status: 'done' }
                  return { ...current, turns, askStatus: 'done', statusText: '' }
                })
              } else if (event.type === 'error') {
                setSummary((current) => {
                  const turns = current.turns.map((turn, index) => index === current.turns.length - 1 && turn.role === 'assistant' ? { ...turn, status: 'error' } : turn)
                  return { ...current, turns, askStatus: 'error', statusText: '', error: String(event.error ?? 'AI 追问失败') }
                })
              }
            },
          })
        } catch (reason) {
          if (controller.signal.aborted) return
          setSummary((current) => {
            const turns = current.turns.map((turn, index) => index === current.turns.length - 1 && turn.role === 'assistant' ? { ...turn, status: 'error' } : turn)
            return { ...current, turns, askStatus: 'error', statusText: '', error: reason instanceof Error ? reason.message : String(reason) }
          })
        }
      }

      function closeSummary() {
        summaryAbort.current?.abort()
        summaryAbort.current = null
        setSummary({ open: false, status: 'idle', busy: false, text: '', title: '', error: '', statusText: '', turns: [], question: '', selection: '', askStatus: 'idle' })
      }

      async function clearFolder() {
        if (clearConfirm === null) return
        try {
          await apiPost('/dossiers/clear', { folderId: clearConfirm.scope })
          setClearConfirm(null)
          stopSearch()
          setSearch({ busy: false, results: [], error: '', query: '' })
          setQuery('')
          await load()
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      function summaryScopeIds() {
        if (search.query !== '' && search.results.length > 0) return search.results.map((entry) => entry.id)
        return []
      }

      return h('div', { className: 'epub-panel epub-dossiers' },
        h('header', { className: 'epub-papers-head' },
          h('div', null,
            h('button', { type: 'button', className: 'epub-icon-btn', onClick: onBack, title: t('papers.back'), 'aria-label': t('papers.back') }, h(IconArrowLeft, { size: 16 })),
            h('div', { className: 'epub-papers-title-wrap' },
              h('p', { className: 'epub-eyebrow' }, 'DOSSIER MODE'),
              h('h1', { className: 'epub-papers-title' }, t('dossiers.title')),
              h('p', { className: 'epub-papers-subtitle' }, t('dossiers.subtitle')),
            ),
          ),
          h('div', { className: 'epub-papers-head-actions' },
            h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => { setImportFolderId(null); fileRef.current?.click() } }, h(IconUpload, { size: 14 }), t('dossiers.import')),
            h('input', { ref: fileRef, type: 'file', accept: BOOK_ACCEPT, multiple: true, style: { display: 'none' }, onChange: (event) => { void importFiles(event.target.files); event.target.value = '' } }),
          ),
        ),
        error !== '' ? h(ErrorBanner, { title: t('dossiers.importFailed'), message: error, actionLabel: t('papers.retry'), onAction: () => setError('') }) : null,
        h('div', { className: 'epub-papers-body' },
          h('aside', { className: 'epub-paper-folders' },
            h('div', { className: 'epub-paper-folder-top' },
              h('button', { type: 'button', className: cn('epub-paper-folder', activeFolder === 'all' && 'is-active'), onClick: () => { setActiveFolder('all'); setSearch({ busy: false, results: [], error: '', query: '' }); setQuery('') } }, t('dossiers.all'), h('span', null, String(state.items.filter((item) => item.kind === 'document').length))),
              h('button', { type: 'button', className: 'epub-paper-folder-add', onClick: () => openDialog('folder'), title: t('dossiers.newFolder'), 'aria-label': t('dossiers.newFolder') }, h(IconFolderPlus, { size: 15 })),
            ),
            h('div', { className: 'epub-dossier-folder-group', onContextMenu: (event) => openContext(event, 'root') },
              h('div', { className: cn('epub-paper-folder-wrap', activeFolder === 'root' && 'is-active') },
                h('button', { type: 'button', className: 'epub-dossier-expand', onClick: () => toggleFolder('root'), title: expandedFolders.has('root') ? t('dossiers.collapse') : t('dossiers.expand'), 'aria-label': expandedFolders.has('root') ? t('dossiers.collapse') : t('dossiers.expand') }, expandedFolders.has('root') ? '▾' : '▸'),
                h('button', { type: 'button', className: cn('epub-paper-folder', activeFolder === 'root' && 'is-active'), onClick: () => { setActiveFolder('root'); setSearch({ busy: false, results: [], error: '', query: '' }); setQuery('') } }, t('dossiers.root'), h('span', null, String(state.items.filter((item) => item.kind === 'document' && item.folderId === '').length))),
                h('button', { type: 'button', className: 'epub-paper-folder-rename', onClick: () => void createSkill(''), title: t('dossiers.createSkill') }, '+'),
              ),
              expandedFolders.has('root') ? renderFolderSkills('') : null,
            ),
            state.folders.map((entry) =>
              h('div', { key: entry.id, className: 'epub-dossier-folder-group', onContextMenu: (event) => openContext(event, 'folder', { folderId: entry.id }) },
                h('div', { className: cn('epub-paper-folder-wrap', activeFolder === entry.id && 'is-active') },
                  h('button', { type: 'button', className: 'epub-dossier-expand', onClick: () => toggleFolder(entry.id), title: expandedFolders.has(entry.id) ? t('dossiers.collapse') : t('dossiers.expand'), 'aria-label': expandedFolders.has(entry.id) ? t('dossiers.collapse') : t('dossiers.expand') }, expandedFolders.has(entry.id) ? '▾' : '▸'),
                  h('button', { type: 'button', className: cn('epub-paper-folder', activeFolder === entry.id && 'is-active'), onClick: () => { setActiveFolder(entry.id); setSearch({ busy: false, results: [], error: '', query: '' }); setQuery('') } }, entry.name, h('span', null, String(state.items.filter((item) => item.kind === 'document' && item.folderId === entry.id).length))),
                  h('button', { type: 'button', className: 'epub-paper-folder-rename', onClick: () => openDialog('folderRename', entry.name, entry.id), title: t('dossiers.renameFolder') }, '✎'),
                  h('button', { type: 'button', className: 'epub-paper-folder-rename', onClick: () => void createSkill(entry.id), title: t('dossiers.createSkill') }, '+'),
                ),
                expandedFolders.has(entry.id) ? renderFolderSkills(entry.id) : null,
              ),
            ),
          ),
          h('main', { className: 'epub-paper-main', onContextMenu: (event) => openContext(event, 'library') },
            h('div', { className: 'epub-paper-main-head' },
              h('h2', null, folderLabel),
              h('div', { className: 'epub-dossier-actions' },
                h('form', { className: 'epub-dossier-search', onSubmit: runSearch },
                  h(IconSearch, { size: 14 }),
                  h('input', { value: query, onChange: (event) => setQuery(event.target.value), placeholder: t('dossiers.searchPlaceholder'), 'aria-label': t('dossiers.searchPlaceholder'), type: 'search' }),
                ),
                search.busy
                  ? h('button', { type: 'button', className: 'epub-icon-btn epub-dossier-stop', onClick: stopSearch, title: t('dossiers.stopSearch'), 'aria-label': t('dossiers.stopSearch') }, h(IconStopCircle, { size: 16 }))
                  : search.query !== ''
                    ? h('span', { className: 'epub-dossier-search-count' }, format(t('dossiers.searchCount'), { count: search.results.length }))
                    : null,
                h('button', { type: 'button', className: 'epub-btn epub-btn-primary epub-dossier-summary-btn', onClick: () => void startSummary({ ids: summaryScopeIds(), query: search.query, title: search.query === '' ? t('dossiers.summaryTitle') : t('dossiers.summarySearchTitle') }), disabled: search.busy || (documents.length === 0 && search.results.length === 0) }, h(IconSparkles, { size: 12 }), t('dossiers.summary')),
              ),
            ),
            h('div', { className: 'epub-dossier-hint' }, t('dossiers.skillHint')),
            search.error !== '' ? h('div', { className: 'epub-dossier-empty' }, search.error) : null,
            importing
              ? h('div', { className: 'epub-dossier-importing' }, h(Spinner, null), h('span', null, t('dossiers.importing')))
              : null,
            state.status === 'loading' && state.items.length === 0
              ? h('div', { className: 'epub-paper-empty' }, h(Spinner, null), h('p', null, t('papers.importing')))
              : state.status === 'error'
                ? h(ErrorBanner, { title: t('dossiers.importFailed'), message: state.error, actionLabel: t('papers.retry'), onAction: () => void load() })
                : search.busy && shown.length === 0
                  ? h('div', { className: 'epub-paper-empty' }, h(Spinner, null))
                  : shown.length === 0 && !importing
                  ? h('div', { className: 'epub-paper-empty' }, h(IconFolderPlus, { size: 30 }), h('h3', null, search.query !== '' ? t('dossiers.searchEmpty') : t('dossiers.empty')), h('p', null, search.query !== '' ? t('dossiers.searchEmptyHint') : t('dossiers.emptyHint')))
                  : shown.length > 0
                    ? h('div', { className: 'epub-dossier-grid' },
                        shown.map((item) => h('article', {
                          key: item.id,
                          className: 'epub-dossier-card',
                          onClick: () => onRead(item.id),
                          onContextMenu: (event) => openContext(event, 'item', { itemId: item.id }),
                        },
                          h('div', { className: 'epub-dossier-type' }, (item.format || 'DOC').toUpperCase()),
                          h('h3', null, item.title),
                          h('p', null, search.query !== '' && item.snippet !== undefined ? item.snippet : (item.preview || t('dossiers.openHint'))),
                          h('div', { className: 'epub-dossier-meta' }, h('span', null, formatBytes(item.size ?? 0)), h('span', null, t('dossiers.open'))),
                        )),
                      )
                    : null,
          ),
        ),
        contextMenu !== null
          ? h('div', { className: 'epub-context-menu', style: { left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }, onClick: (event) => event.stopPropagation() },
              contextMenu.kind === 'library' || contextMenu.kind === 'folder' || contextMenu.kind === 'root'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); openDialog('folder') } }, t('dossiers.newFolder'))
                : null,
              contextMenu.kind === 'folder' || contextMenu.kind === 'root'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { const id = contextMenu.kind === 'root' ? '' : contextMenu.folderId; setContextMenu(null); setActiveFolder(id === '' ? 'root' : id); setImportFolderId(id); fileRef.current?.click() } }, t('dossiers.importHere'))
                : null,
              contextMenu.kind === 'folder'
                ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { const entry = state.folders.find((value) => value.id === contextMenu.folderId); setContextMenu(null); if (entry !== undefined) openDialog('folderRename', entry.name, entry.id) } }, t('dossiers.renameFolder'))
                : null,
              contextMenu.kind === 'folder' || contextMenu.kind === 'root'
                ? h('button', {
                    type: 'button',
                    className: 'epub-context-item is-danger',
                    onClick: () => {
                      const id = contextMenu.kind === 'root' ? '' : contextMenu.folderId
                      const entry = contextMenu.kind === 'folder' ? state.folders.find((value) => value.id === id) : undefined
                      const count = state.items.filter((item) => item.kind === 'document' && item.folderId === id).length
                      setContextMenu(null)
                      setClearConfirm({ scope: id, count, label: entry?.name ?? t('dossiers.root') })
                    },
                  }, t('dossiers.clear'))
                : null,
              contextMenu.kind === 'item'
                ? (() => {
                    const item = state.items.find((entry) => entry.id === contextMenu.itemId)
                    return item === undefined ? null : h(React.Fragment, null,
                      item.kind === 'document' ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); onRead(item.id) } }, t('dossiers.open')) : null,
                      item.kind === 'skill' ? h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); void openSkillEditor(item) } }, t('dossiers.editSkill')) : null,
                      h('button', { type: 'button', className: 'epub-context-item', onClick: () => { setContextMenu(null); openDialog('rename', item.title, item.id) } }, t('dossiers.rename')),
                      h('button', {
                        type: 'button',
                        className: cn('epub-context-item', contextMenu.confirmDelete && 'is-danger'),
                        onClick: () => {
                          if (!contextMenu.confirmDelete) { setContextMenu({ ...contextMenu, confirmDelete: true }); return }
                          const id = item.id
                          setContextMenu(null)
                          void (async () => { try { await apiPost('/dossiers/delete', { id }); await load() } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)) } })()
                        },
                      }, contextMenu.confirmDelete ? t('dossiers.confirmDelete') : t('dossiers.delete')),
                    )
                  })()
                : null,
            )
          : null,
        dialog !== null
          ? h('div', { className: 'epub-dialog-backdrop', onMouseDown: (event) => { if (event.target === event.currentTarget) setDialog(null) } },
              h('div', { className: 'epub-dialog' },
                h('h3', null, dialog.mode === 'folder' ? t('dossiers.newFolder') : dialog.mode === 'folderRename' ? t('dossiers.renameFolder') : t('dossiers.rename')),
                h('input', {
                  className: 'epub-dialog-input',
                  autoFocus: true,
                  value: dialog.value,
                  onChange: (event) => setDialog({ ...dialog, value: event.target.value }),
                  onKeyDown: (event) => { if (event.key === 'Enter') { event.preventDefault(); void submitDialog() } if (event.key === 'Escape') setDialog(null) },
                  placeholder: t('dossiers.namePlaceholder'),
                }),
                h('div', { className: 'epub-dialog-actions' },
                  h('button', { type: 'button', className: 'epub-btn', onClick: () => setDialog(null) }, t('papers.cancel')),
                  h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => void submitDialog() }, t('papers.confirm')),
                ),
              ),
            )
          : null,
        clearConfirm !== null
          ? h('div', { className: 'epub-dialog-backdrop', onMouseDown: (event) => { if (event.target === event.currentTarget) setClearConfirm(null) } },
              h('div', { className: 'epub-dialog' },
                h('h3', null, format(t('dossiers.clearTitle'), { name: clearConfirm.label })),
                h('p', { className: 'epub-dialog-message' }, format(t('dossiers.clearHint'), { count: clearConfirm.count })),
                h('div', { className: 'epub-dialog-actions' },
                  h('button', { type: 'button', className: 'epub-btn', onClick: () => setClearConfirm(null) }, t('papers.cancel')),
                  h('button', { type: 'button', className: 'epub-btn epub-btn-danger', onClick: () => void clearFolder() }, t('dossiers.clearConfirm')),
                ),
              ),
            )
          : null,
        skillEditor !== null
          ? h('div', { className: 'epub-dialog-backdrop', onMouseDown: (event) => { if (event.target === event.currentTarget) setSkillEditor(null) } },
              h('section', { className: 'epub-skill-editor' },
                h('header', null,
                  h('div', null, h('p', { className: 'epub-eyebrow' }, 'DOSSIER SKILL'), h('h3', null, t('dossiers.editSkill'))),
                  h('button', { type: 'button', className: 'epub-icon-btn', onClick: () => setSkillEditor(null), title: t('papers.close') }, h(IconX, { size: 16 })),
                ),
                h('p', { className: 'epub-skill-editor-hint' }, t('dossiers.skillEditorHint')),
                h('textarea', {
                  className: 'epub-skill-editor-text',
                  value: skillEditor.text,
                  onChange: (event) => setSkillEditor({ ...skillEditor, text: event.target.value }),
                  placeholder: t('dossiers.skillPlaceholder'),
                }),
                h('div', { className: 'epub-dialog-actions' },
                  h('button', { type: 'button', className: 'epub-btn', onClick: () => setSkillEditor(null) }, t('papers.cancel')),
                  h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => void saveSkill() }, t('dossiers.save')),
                ),
              ),
            )
          : null,
        summary.open
          ? h('div', { className: 'epub-dossier-summary-backdrop', onMouseDown: (event) => { if (event.target === event.currentTarget) closeSummary() } },
              h('section', { className: 'epub-dossier-summary' },
                h('header', null,
                  h('div', null, h('p', { className: 'epub-eyebrow' }, 'AI DOSSIER'), h('h3', null, summary.title)),
                  h('div', { className: 'epub-dossier-summary-actions' },
                    summaryLocked ? h('button', { type: 'button', className: 'epub-btn', onClick: stopSummary }, t('dossiers.stop')) : null,
                    h('button', { type: 'button', className: 'epub-icon-btn', onClick: closeSummary, title: t('papers.close') }, h(IconX, { size: 16 })),
                  ),
                ),
                summary.error !== '' ? h('p', { className: 'epub-dossier-summary-error' }, summary.error) : null,
                h('div', { className: 'epub-dossier-summary-body', onMouseUp: captureSummarySelection },
                  summary.statusText !== '' ? h('div', { className: 'epub-dossier-summary-status' }, h(Spinner, null), h('span', null, summary.statusText)) : null,
                  summary.status === 'streaming' && summary.text === '' ? null : summary.text,
                  summary.turns.map((turn, index) => h('div', { key: `turn-${index}`, className: cn('epub-dossier-turn', turn.role === 'user' ? 'is-user' : 'is-assistant') },
                    h('span', { className: 'epub-dossier-turn-label' }, turn.role === 'user' ? t('dossiers.followUpLabel') : 'AI'),
                    h('div', null, turn.text === '' && turn.status === 'streaming' ? h(Spinner, null) : turn.text),
                  )),
                ),
                summaryLocked
                  ? h('div', { className: 'epub-dossier-followup epub-dossier-followup-locked' }, h(Spinner, null), h('span', null, t('dossiers.followUpLocked')))
                  : h('div', { className: 'epub-dossier-followup' },
                  summary.selection !== ''
                    ? h('div', { className: 'epub-dossier-selection-chip' },
                        h('span', null, `${t('dossiers.selectedSummary')}：${summary.selection.slice(0, 80)}${summary.selection.length > 80 ? '…' : ''}`),
                        h('button', { type: 'button', onClick: () => setSummary((current) => ({ ...current, selection: '' })), title: t('dossiers.clearSelection') }, '×'),
                      )
                    : null,
                  h('div', { className: 'epub-dossier-followup-row' },
                    h('input', {
                      ref: summaryInputRef,
                      value: summary.question,
                      onChange: (event) => setSummary((current) => ({ ...current, question: event.target.value })),
                      onKeyDown: (event) => { if (event.key === 'Enter') { event.preventDefault(); void askSummary() } },
                      placeholder: summary.selection === '' ? t('dossiers.followUpPlaceholder') : t('dossiers.followUpSelectedPlaceholder'),
                      disabled: summaryLocked,
                    }),
                    h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => void askSummary(), disabled: summaryLocked || (summary.question.trim() === '' && summary.selection === '') }, t('dossiers.send')),
                  ),
                  h('p', { className: 'epub-dossier-followup-hint' }, t('dossiers.followUpHint')),
                ),
              ),
            )
          : null,
      )
    }

    function PaperTranslationBox({ t, paperId, unit, value, collapsed, onChange, onToggle, onExplain, onSelectText, actions }) {
      const key = `${paperId}:${unit.key}`
      const ref = React.useRef(null)
      const saved = React.useRef(readPaperUi().heights[key])
      const [height, setHeight] = React.useState(() => {
        const stored = Number(readPaperUi().heights[key])
        return Number.isFinite(stored) && stored > 0 ? stored : 0
      })

      React.useLayoutEffect(() => {
        const element = ref.current
        if (element === null || collapsed) return
        if (height > 0) {
          element.style.height = `${height}px`
          return
        }
        element.style.height = 'auto'
        element.style.height = `${Math.max(64, element.scrollHeight)}px`
      }, [value, collapsed, height])

      function beginResize(event) {
        event.preventDefault()
        const element = ref.current
        if (element === null) return
        const startY = event.clientY
        const startHeight = element.offsetHeight
        let nextHeight = startHeight
        function move(moveEvent) {
          nextHeight = Math.max(56, startHeight + moveEvent.clientY - startY)
          element.style.height = `${nextHeight}px`
        }
        function finish() {
          setHeight(nextHeight)
          const ui = readPaperUi()
          ui.heights[key] = nextHeight
          writePaperUi(ui)
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', finish)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', finish)
      }

      function selectText(event) {
        const start = event.target.selectionStart
        const end = event.target.selectionEnd
        if (typeof start === 'number' && typeof end === 'number' && end > start) {
          onSelectText(event.target.value.slice(start, end), unit, event)
        }
      }

      return h('div', { className: 'epub-paper-box' },
        collapsed
          ? h('div', { className: 'epub-paper-box-collapsed' }, value.trim() === '' ? t('papers.unitEmpty') : `${value.slice(0, 100)}${value.length > 100 ? '…' : ''}`)
          : h('textarea', {
              ref,
              className: 'epub-compare-textarea',
              value,
              onChange: (event) => onChange(event.target.value),
              onSelect: selectText,
              placeholder: t('papers.unitEmpty'),
            }),
        actions,
        h('div', { className: 'epub-paper-box-actions' },
          h('button', { type: 'button', className: 'epub-paper-box-btn', onClick: onToggle }, collapsed ? t('reader.expand') : t('reader.collapse')),
          h('button', { type: 'button', className: 'epub-paper-box-btn', onClick: () => onExplain(value, unit) }, t('papers.aiExplain')),
        ),
        collapsed ? null : h('div', { className: 'epub-paper-resizer', onPointerDown: beginResize, title: t('papers.resize') }, h('span', null, '↕')),
      )
    }

    function PaperCompare({ paperId, t, onBack, onRead, hideLabel }) {
      const [data, setData] = React.useState(null)
      const [status, setStatus] = React.useState('loading')
      const [error, setError] = React.useState('')
      const [drafts, setDrafts] = React.useState({})
      const [busy, setBusy] = React.useState('')
      const [whole, setWhole] = React.useState(false)
      const [progress, setProgress] = React.useState({ done: 0, total: 0 })
      const [notice, setNotice] = React.useState('')
      const [paperFontSize, setPaperFontSize] = React.useState(() => {
        try {
          const value = Number(window.localStorage.getItem(PAPER_FONT_KEY))
          return Number.isFinite(value) ? Math.min(24, Math.max(9, value)) : 10.5
        } catch {
          return 10.5
        }
      })
      const [collapsedUnits, setCollapsedUnits] = React.useState(() => {
        const collapsed = readPaperUi().collapsed
        return new Set(Object.keys(collapsed).filter((key) => key.startsWith(`${paperId}:`) && collapsed[key] === true).map((key) => key.slice(paperId.length + 1)))
      })
      const [ai, setAi] = React.useState({ open: true, view: 'history', status: 'idle', selection: null, turns: [], annotationId: null, error: '', lastQuestion: '' })
      const [annotations, setAnnotations] = React.useState([])
      const [annotationStatus, setAnnotationStatus] = React.useState('loading')
      const [annotationError, setAnnotationError] = React.useState('')
      const [selection, setSelection] = React.useState(null)
      const [selectionQuestion, setSelectionQuestion] = React.useState('')
      const abortRef = React.useRef(null)
      const aiAbortRef = React.useRef(null)

      React.useEffect(() => {
        function onWheel(event) {
          if (!event.ctrlKey && !event.metaKey) return
          event.preventDefault()
          setPaperFontSize((current) => {
            const next = Math.min(24, Math.max(9, current + (event.deltaY < 0 ? 0.5 : -0.5)))
            try { window.localStorage.setItem(PAPER_FONT_KEY, String(next)) } catch { /* ignore */ }
            return next
          })
        }
        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
      }, [])

      function setUnitCollapsed(unit, collapsed) {
        setCollapsedUnits((current) => {
          const next = new Set(current)
          if (collapsed) next.add(unit.key)
          else next.delete(unit.key)
          return next
        })
        const ui = readPaperUi()
        ui.collapsed[`${paperId}:${unit.key}`] = collapsed
        writePaperUi(ui)
      }

      function setAllCollapsed(collapsed) {
        const units = (data?.pages ?? []).flatMap((page) => page.units ?? [])
        setCollapsedUnits(collapsed ? new Set(units.map((unit) => unit.key)) : new Set())
        const ui = readPaperUi()
        for (const unit of units) ui.collapsed[`${paperId}:${unit.key}`] = collapsed
        writePaperUi(ui)
      }

      function annotationKey() {
        return data?.sourceBook?.annotationKey ?? data?.paper?.id ?? paperId
      }

      function capturePaperSelection(unit, event) {
        const active = window.getSelection()
        const text = active === null ? '' : active.toString().replace(/\s+/g, ' ').trim()
        if (text === '') return
        let rect
        try { rect = active.getRangeAt(0).getBoundingClientRect() } catch { return }
        const left = Math.max(120, Math.min(window.innerWidth - 120, rect.left + rect.width / 2))
        const top = rect.top > 80 ? rect.top - 50 : rect.bottom + 12
        setSelection({
          text: text.slice(0, 4000),
          before: unit?.source?.slice(0, 800) ?? '',
          after: '',
          page: unit?.page ?? 1,
          chapterTitle: format(t('papers.page'), { page: unit?.page ?? 1 }),
          left,
          top,
          arrow: rect.top > 80,
        })
        setSelectionQuestion('')
      }

      function captureTextareaSelection(text, unit, event) {
        const value = String(text ?? '').trim()
        if (value === '') return
        const rect = event.target?.getBoundingClientRect?.()
        const left = rect !== undefined ? Math.max(120, Math.min(window.innerWidth - 120, rect.left + rect.width / 2)) : window.innerWidth / 2
        const top = rect !== undefined ? Math.max(80, rect.top - 50) : 100
        setSelection({
          text: value.slice(0, 4000),
          before: '',
          after: '',
          page: unit?.page ?? 1,
          chapterTitle: format(t('papers.page'), { page: unit?.page ?? 1 }),
          left,
          top,
          arrow: true,
        })
        setSelectionQuestion('')
      }

      function historyFromTurns(turns) {
        return turns.filter((turn) => turn.role === 'user' || (turn.role === 'assistant' && turn.text !== '')).map((turn) => ({ role: turn.role, text: turn.text }))
      }

      async function persistPaperAnnotation(annotationId, selected, turns) {
        if (annotationId === null || annotationId === '') return
        const clean = turns.filter((turn) => turn.role === 'user' || (turn.role === 'assistant' && turn.text.trim() !== '')).map((turn) => ({ role: turn.role, text: turn.text }))
        if (!clean.some((turn) => turn.role === 'assistant')) return
        try {
          const value = await apiPost('/annotations', {
            id: annotationId,
            bookId: annotationKey(),
            chapterIndex: Number.isInteger(selected.page) ? selected.page : 0,
            chapterTitle: selected.chapterTitle ?? '',
            selectionText: selected.text,
            before: selected.before ?? '',
            after: selected.after ?? '',
            turns: clean,
          })
          if (value?.annotation !== undefined) {
            setAnnotations((current) => [value.annotation, ...current.filter((entry) => entry.id !== value.annotation.id)].sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0)))
            setAnnotationStatus('ready')
          }
        } catch (reason) {
          setAnnotationError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      async function runPaperTurn(selected, question, history, controller, annotationId, baseTurns) {
        let answer = ''
        try {
          await explainSelection({
            text: selected.text,
            before: selected.before,
            after: selected.after,
            question,
            history,
            bookTitle: data?.paper?.title ?? '论文',
            author: data?.sourceBook?.author ?? '',
            chapter: selected.chapterTitle ?? '',
          }, controller.signal, (delta) => {
            if (aiAbortRef.current !== controller) return
            answer += delta
            setAi((current) => current.status === 'streaming'
              ? { ...current, turns: updateLastAssistant(current.turns, (turn) => ({ ...turn, text: turn.text + delta })) }
              : current)
          })
          if (aiAbortRef.current !== controller) return
          const finalTurns = [...baseTurns, ...(question.trim() !== '' ? [userTurn(question)] : []), assistantTurn(answer, 'done')]
          setAi((current) => current.status === 'streaming' ? { ...current, status: 'done', turns: finalTurns } : current)
          if (answer.trim() !== '') void persistPaperAnnotation(annotationId, selected, finalTurns)
        } catch (reason) {
          if (aiAbortRef.current !== controller) return
          if (reason !== null && typeof reason === 'object' && reason.name === 'AbortError') {
            setAi((current) => ({ ...current, status: 'idle' }))
            return
          }
          const message = reason instanceof Error ? reason.message : String(reason)
          setAi((current) => ({ ...current, status: 'error', error: message, turns: updateLastAssistant(current.turns, (turn) => ({ ...turn, status: 'error', error: message })) }))
        } finally {
          if (aiAbortRef.current === controller) aiAbortRef.current = null
        }
      }

      async function askPaperSelection(selected, question) {
        if (selected === null || selected.text === '') return
        aiAbortRef.current?.abort()
        const controller = new AbortController()
        aiAbortRef.current = controller
        const currentQuestion = String(question ?? '').trim()
        const annotationId = makeAnnotationId()
        const turns = [...(currentQuestion !== '' ? [userTurn(currentQuestion)] : []), assistantTurn('', 'streaming')]
        setSelection(null)
        setSelectionQuestion('')
        setAi({ open: true, view: 'thread', status: 'streaming', selection: selected, turns, annotationId, error: '', lastQuestion: currentQuestion })
        await runPaperTurn(selected, currentQuestion, [], controller, annotationId, [])
      }

      async function followPaper(question) {
        if (ai.status === 'streaming' || ai.selection === null) return
        aiAbortRef.current?.abort()
        const controller = new AbortController()
        aiAbortRef.current = controller
        const cleanTurns = ai.turns.filter((turn) => !(turn.role === 'assistant' && turn.status === 'error' && turn.text === ''))
        const history = historyFromTurns(cleanTurns)
        const annotationId = ai.annotationId ?? makeAnnotationId()
        const turns = [...cleanTurns, userTurn(question), assistantTurn('', 'streaming')]
        setAi({ ...ai, status: 'streaming', turns, annotationId, lastQuestion: question })
        await runPaperTurn(ai.selection, question, history, controller, annotationId, cleanTurns)
      }

      function stopPaperAi() {
        aiAbortRef.current?.abort()
      }

      function retryPaperAi() {
        const selected = ai.selection
        if (selected === null) return
        if (ai.turns.length === 0) void askPaperSelection(selected, ai.lastQuestion ?? '')
        else void followPaper(ai.lastQuestion ?? '')
      }

      function copyPaperText(text) {
        void copyText(text).then(() => setNotice(t('reader.copied'))).catch(() => setNotice(t('reader.copied')))
      }

      function openPaperAnnotation(record) {
        const turns = Array.isArray(record.turns)
          ? record.turns.filter((turn) => turn !== null && typeof turn === 'object' && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.text === 'string').map((turn) => ({ role: turn.role, text: turn.text, status: 'done', error: '' }))
          : []
        const lastQuestion = [...turns].reverse().find((turn) => turn.role === 'user')
        setAi({
          open: true,
          view: 'thread',
          status: 'idle',
          selection: { text: record.selectionText, before: record.before ?? '', after: record.after ?? '', page: record.chapterIndex ?? 1, chapterTitle: record.chapterTitle ?? '' },
          turns,
          annotationId: record.id,
          error: '',
          lastQuestion: lastQuestion?.text ?? '',
        })
      }

      async function deletePaperAnnotation(record) {
        if (record === null || record === undefined || record.id === undefined) return
        try {
          await apiPost('/annotations/delete', { bookId: annotationKey(), id: record.id })
          setAnnotations((current) => current.filter((entry) => entry.id !== record.id))
          if (ai.annotationId === record.id) {
            aiAbortRef.current?.abort()
            setAi((current) => ({ ...current, view: 'history', status: 'idle', turns: [], annotationId: null, selection: null, error: '' }))
          }
        } catch (reason) {
          setAnnotationError(reason instanceof Error ? reason.message : String(reason))
        }
      }

      function deletePaperTurn(index) {
        const turns = Array.isArray(ai.turns) ? ai.turns : []
        if (turns[index] === undefined) return
        const remove = new Set([index])
        if (turns[index].role === 'user' && turns[index + 1]?.role === 'assistant') remove.add(index + 1)
        const next = turns.filter((_, turnIndex) => !remove.has(turnIndex))
        const hasAnswer = next.some((turn) => turn.role === 'assistant' && turn.text.trim() !== '')
        if (!hasAnswer) {
          void deletePaperAnnotation({ id: ai.annotationId })
          return
        }
        setAi((current) => ({ ...current, turns: next }))
        if (ai.annotationId !== null) void persistPaperAnnotation(ai.annotationId, ai.selection, next)
      }

      React.useEffect(() => {
        const collapsed = readPaperUi().collapsed
        setCollapsedUnits(new Set(Object.keys(collapsed).filter((key) => key.startsWith(`${paperId}:`) && collapsed[key] === true).map((key) => key.slice(paperId.length + 1))))
        setAi({ open: true, view: 'history', status: 'idle', selection: null, turns: [], annotationId: null, error: '', lastQuestion: '' })
        setSelection(null)
        setSelectionQuestion('')
      }, [paperId])

      const load = React.useCallback(async () => {
        setStatus('loading')
        setError('')
        try {
          const value = await apiGet(`/papers/compare?id=${encodeURIComponent(paperId)}`)
          setData(value)
          const next = {}
          for (const page of value?.pages ?? []) for (const unit of page.units ?? []) next[unit.key] = unit.translation ?? ''
          setDrafts(next)
          setProgress({ done: value?.translatedCount ?? 0, total: value?.unitCount ?? 0 })
          setStatus('ready')
        } catch (reason) {
          setStatus('error')
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }, [paperId])

      React.useEffect(() => { void load() }, [load])

      React.useEffect(() => {
        let cancelled = false
        const key = annotationKey()
        setAnnotationStatus('loading')
        setAnnotationError('')
        apiGet(`/annotations?book=${encodeURIComponent(key)}`)
          .then((value) => {
            if (cancelled) return
            setAnnotations(Array.isArray(value?.annotations) ? value.annotations : [])
            setAnnotationStatus('ready')
          })
          .catch((reason) => {
            if (cancelled) return
            setAnnotationError(reason instanceof Error ? reason.message : String(reason))
            setAnnotationStatus('error')
          })
        return () => { cancelled = true }
      }, [data?.sourceBook?.annotationKey, paperId])

      function replaceUnit(unit) {
        setData((current) => {
          if (current === null) return current
          return { ...current, pages: current.pages.map((page) => ({ ...page, units: page.units.map((entry) => entry.key === unit.key ? unit : entry) })) }
        })
        setDrafts((current) => ({ ...current, [unit.key]: unit.translation }))
      }

      async function translateUnit(unit, force) {
        setBusy(unit.key)
        try {
          const result = await apiPost('/papers/translate', { id: paperId, key: unit.key, force: force === true })
          replaceUnit(result.unit)
          setProgress((current) => ({ ...current, done: Math.min(current.total, current.done + (unit.translation === '' ? 1 : 0)) }))
        } catch (reason) {
          setNotice(reason instanceof Error ? reason.message : String(reason))
        } finally {
          setBusy('')
        }
      }

      async function saveUnit(unit) {
        setBusy(unit.key)
        try {
          const result = await apiPost('/papers/translation/edit', { id: paperId, key: unit.key, text: drafts[unit.key] ?? '' })
          replaceUnit(result.unit)
          setNotice(t('papers.saved'))
        } catch (reason) {
          setNotice(reason instanceof Error ? reason.message : String(reason))
        } finally {
          setBusy('')
        }
      }

      async function translateWhole() {
        if (whole) { abortRef.current?.abort(); return }
        if (data?.translatedCount > 0 && !window.confirm(t('papers.wholeConfirm'))) return
        const controller = new AbortController()
        abortRef.current = controller
        setWhole(true)
        setNotice('')
        try {
          await apiStreamJson('/papers/translate-stream', { id: paperId, force: data?.translatedCount > 0, preserveEdits: true }, {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'unit' && event.unit !== undefined) {
                replaceUnit(event.unit)
                setProgress({ done: event.done, total: event.total })
              } else if (event.type === 'done') {
                setNotice(t('papers.done'))
                setProgress({ done: event.total, total: event.total })
              } else if (event.type === 'error') {
                setNotice(event.error)
              }
            },
          })
          await load()
        } catch (reason) {
          if (!(reason !== null && typeof reason === 'object' && reason.name === 'AbortError')) setNotice(reason instanceof Error ? reason.message : String(reason))
        } finally {
          setWhole(false)
          abortRef.current = null
        }
      }

      if (status === 'loading') return h('div', { className: 'epub-paper-compare' }, h('div', { className: 'epub-reading-state' }, h(Spinner, null), h('p', null, t('papers.translating'))))
      if (status === 'error' || data === null) return h('div', { className: 'epub-paper-compare' }, h(ErrorBanner, { title: t('papers.loadFailed'), message: error, actionLabel: t('papers.retry'), onAction: () => void load() }))

      return h('div', { className: 'epub-paper-compare', style: { '--paper-font-size': `${paperFontSize}px` } },
        h('header', { className: 'epub-compare-head' },
          h('div', { className: 'epub-compare-head-left' },
            h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: onBack, title: t('papers.back'), 'aria-label': t('papers.back') }, h(IconArrowLeft, { size: 17 })),
            h('div', null, h('h1', { className: 'epub-compare-title' }, data.paper.title), h('p', { className: 'epub-compare-sub' }, format(t('papers.progress'), { done: progress.done, total: progress.total }))),
          ),
          h('div', { className: 'epub-compare-actions' },
            h('button', { type: 'button', className: 'epub-btn', onClick: onBack }, hideLabel ?? t('papers.back')),
            data.translationPaperId !== '' ? h('button', { type: 'button', className: 'epub-btn', onClick: () => onRead(data.translationPaperId) }, t('papers.openZh')) : null,
            h('button', { type: 'button', className: cn('epub-btn', ai.open && 'epub-btn-primary'), onClick: () => setAi((current) => ({ ...current, open: !current.open })) }, h(IconSparkles, { size: 13 }), t('reader.ai')),
            h('button', { type: 'button', className: 'epub-btn', onClick: () => onRead(data.source.id) }, t('papers.read')),
            (() => {
              const units = (data.pages ?? []).flatMap((page) => page.units ?? [])
              const allCollapsed = units.length > 0 && units.every((unit) => collapsedUnits.has(unit.key))
              return h('button', { type: 'button', className: 'epub-btn', onClick: () => setAllCollapsed(!allCollapsed) }, allCollapsed ? t('reader.expandAll') : t('reader.collapseAll'))
            })(),
            h('button', { type: 'button', className: cn('epub-btn', whole ? 'epub-btn-primary' : 'epub-btn-primary'), onClick: () => void translateWhole() }, whole ? t('papers.stop') : t('papers.wholeTranslate')),
          ),
        ),
        whole ? h('div', { className: 'epub-compare-progress' }, h(Spinner, null), h('span', null, format(t('papers.progress'), { done: progress.done, total: progress.total }))) : null,
        notice !== '' ? h('div', { className: 'epub-compare-notice' }, notice) : null,
        h('div', { className: cn('epub-paper-body', ai.open && 'ai-open') },
          h('div', { className: 'epub-paper-main-column' },
            h('div', { className: 'epub-compare-columns' },
              h('div', { className: 'epub-compare-col-head' }, t('papers.source')),
              h('div', { className: 'epub-compare-col-head' }, t('papers.translation')),
            ),
            h('div', { className: 'epub-compare-scroll' },
              data.pages.map((page) =>
                h('section', { key: page.page, className: 'epub-compare-page' },
                  h('h2', { className: 'epub-compare-page-title' }, format(t('papers.page'), { page: page.page })),
                  page.units.map((unit) =>
                    h('div', { key: unit.key, className: 'epub-compare-row' },
                      h('div', { className: 'epub-compare-source', onMouseUp: (event) => capturePaperSelection(unit, event) }, unit.source),
                      h('div', { className: 'epub-compare-target' },
                        h(PaperTranslationBox, {
                          t,
                          paperId,
                          unit,
                          value: drafts[unit.key] ?? '',
                          collapsed: collapsedUnits.has(unit.key),
                          onChange: (value) => setDrafts((current) => ({ ...current, [unit.key]: value })),
                          onToggle: () => setUnitCollapsed(unit, !collapsedUnits.has(unit.key)),
                          onExplain: (text, selectedUnit) => void askPaperSelection({ text, before: '', after: '', page: selectedUnit.page, chapterTitle: format(t('papers.page'), { page: selectedUnit.page }) }, ''),
                          onSelectText: (text, selectedUnit, event) => captureTextareaSelection(text, selectedUnit, event),
                          actions: h('div', { className: 'epub-compare-row-actions' },
                            h('button', { type: 'button', className: 'epub-btn', onClick: () => void translateUnit(unit, unit.translation !== ''), disabled: busy !== '' }, busy === unit.key ? t('papers.translating') : unit.translation === '' ? t('papers.translateOne') : t('papers.retranslate')),
                            h('button', { type: 'button', className: 'epub-btn', onClick: () => void saveUnit(unit), disabled: busy !== '' }, t('papers.save')),
                            unit.editedByUser ? h('span', { className: 'epub-paper-kind' }, t('papers.corrected')) : null,
                          ),
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          ai.open
            ? h(AiPanel, {
                t,
                ai,
                annotations,
                annotationStatus,
                annotationError,
                onClose: () => { aiAbortRef.current?.abort(); setAi((current) => ({ ...current, open: false })) },
                onShowHistory: () => setAi((current) => ({ ...current, view: 'history' })),
                onShowThread: () => setAi((current) => ({ ...current, view: 'thread' })),
                onSelectAnnotation: openPaperAnnotation,
                onStop: stopPaperAi,
                onRetry: retryPaperAi,
                onAsk: (question) => void followPaper(question),
                onCopy: copyPaperText,
                onFollowUp: (question) => void followPaper(question),
                onDeleteAnnotation: (record) => void deletePaperAnnotation(record),
                onDeleteTurn: deletePaperTurn,
              })
            : null,
        ),
        selection !== null
          ? h('form', {
              className: 'epub-select-popover',
              style: { left: `${selection.left}px`, top: `${selection.top}px` },
              onSubmit: (event) => { event.preventDefault(); void askPaperSelection(selection, selectionQuestion) },
            },
              h('input', { className: 'epub-select-input', value: selectionQuestion, onChange: (event) => setSelectionQuestion(event.target.value), placeholder: t('reader.askPlaceholder'), 'aria-label': t('reader.askPlaceholder'), autoFocus: true }),
              h('button', { type: 'submit', className: 'epub-explain-btn' }, h(IconSparkles, { size: 13 }), t('reader.explain')),
              h('span', { className: 'epub-pop-divider' }),
              h('button', { type: 'button', className: 'epub-copy-btn', onClick: () => copyPaperText(selection.text), title: t('reader.copy'), 'aria-label': t('reader.copy') }, h(IconCopy, { size: 13 })),
              h('div', { className: 'epub-select-quick' },
                ['translate', 'example', 'background', 'explain'].map((key) =>
                  h('button', {
                    key,
                    type: 'button',
                    className: 'epub-select-quick-btn',
                    onClick: () => void askPaperSelection(selection, t(`reader.ask.${key}`)),
                  }, t(`reader.chip.${key}`)),
                ),
              ),
            )
          : null,
      )
    }

    function PaperReaderShell({ paperId, book, t, onBack, onRead, onToast }) {
      const [compare, setCompare] = React.useState(false)
      return compare
        ? h(PaperCompare, { paperId, t, onBack: () => setCompare(false), onRead, hideLabel: t('papers.hideCompare') })
        : h(Reader, { book, t, onBack, onToast, onCompare: () => setCompare(true) })
    }

    function Reader({ book, t, onBack, onToast, onCompare }) {
      const annotationKey = book.annotationKey || book.id
      const saved = React.useMemo(() => readProgress(book.id), [book.id])
      const startIndex = saved !== undefined && Number.isFinite(saved.chapterIndex) && saved.chapterIndex >= 0 && saved.chapterIndex < book.chapters.length ? saved.chapterIndex : 0
      const [chapterIndex, setChapterIndex] = React.useState(startIndex)
      const [chapter, setChapter] = React.useState(null)
      const [status, setStatus] = React.useState('loading')
      const [error, setError] = React.useState('')
      const [tocOpen, setTocOpen] = React.useState(() => window.innerWidth >= 1180)
      const [fontSize, setFontSize] = React.useState(readFontSize)
      const [selection, setSelection] = React.useState(null)
      const [selectionQuestion, setSelectionQuestion] = React.useState('')
      const [annotations, setAnnotations] = React.useState([])
      const [annotationStatus, setAnnotationStatus] = React.useState('loading')
      const [annotationError, setAnnotationError] = React.useState('')
      const [ai, setAi] = React.useState({ open: true, view: 'history', status: 'idle', selection: null, turns: [], annotationId: null, error: '', lastQuestion: '' })
      const [findOpen, setFindOpen] = React.useState(false)
      const [findQuery, setFindQuery] = React.useState('')
      const [findStatus, setFindStatus] = React.useState('idle')
      const [findMatches, setFindMatches] = React.useState([])
      const [findTotal, setFindTotal] = React.useState(0)
      const [findTerms, setFindTerms] = React.useState([])
      const [findError, setFindError] = React.useState('')
      const [findTarget, setFindTarget] = React.useState(null)
      const scrollRef = React.useRef(null)
      const contentRef = React.useRef(null)
      const findInputRef = React.useRef(null)
      const findAbortRef = React.useRef(null)
      const tokenRef = React.useRef(0)
      const cacheRef = React.useRef(new Map())
      const pendingRestore = React.useRef(null)
      const abortRef = React.useRef(null)
      const saveTimer = React.useRef(null)
      const ratioRef = React.useRef(saved !== undefined && Number.isFinite(saved.ratio) ? saved.ratio : 0)
      const toastTimer = React.useRef(null)
      const findShortcut = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘F' : 'Ctrl+F'

      const toast = React.useCallback((message) => {
        onToast(message)
      }, [onToast])

      function openFind() {
        setFindOpen(true)
        window.requestAnimationFrame(() => {
          findInputRef.current?.focus()
          findInputRef.current?.select()
        })
      }

      function closeFind() {
        setFindOpen(false)
        setFindTarget(null)
      }

      const loadChapter = React.useCallback(async (index, options = {}) => {
        const token = tokenRef.current + 1
        tokenRef.current = token
        abortRef.current?.abort()
        abortRef.current = null
        setSelection(null)
        setChapterIndex(index)
        ratioRef.current = typeof options.ratio === 'number' ? options.ratio : 0
        setAi((current) => ({
          ...current,
          view: 'history',
          status: 'idle',
          selection: null,
          turns: [],
          annotationId: null,
          error: '',
          lastQuestion: '',
        }))
        const cached = cacheRef.current.get(index)
        if (cached !== undefined && options.force !== true) {
          setChapter(cached)
          setStatus('ready')
          setError('')
          pendingRestore.current = { ratio: options.ratio, anchor: options.anchor }
          return
        }
        setStatus('loading')
        setChapter(null)
        setError('')
        pendingRestore.current = { ratio: options.ratio, anchor: options.anchor }
        try {
          const data = await apiGet(`/chapter?book=${encodeURIComponent(book.id)}&index=${index}`)
          if (tokenRef.current !== token) return
          cacheRef.current.set(index, data)
          setChapter(data)
          setStatus('ready')
        } catch (reason) {
          if (tokenRef.current !== token) return
          setStatus('error')
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }, [book.id])

      React.useEffect(() => {
        const initialIndex = startIndex
        const initialRatio = saved !== undefined && Number.isFinite(saved.ratio) ? saved.ratio : 0
        void loadChapter(initialIndex, { ratio: initialRatio })
        return () => {
          tokenRef.current += 1
          abortRef.current?.abort()
          if (saveTimer.current !== null) window.clearTimeout(saveTimer.current)
          if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
        }
      }, [book.id, loadChapter, saved, startIndex])

      React.useEffect(() => {
        if (status !== 'ready' || chapter === null) return
        const frame = window.requestAnimationFrame(() => {
          const second = window.requestAnimationFrame(() => {
            const scroller = scrollRef.current
            if (scroller === null) return
            const restore = pendingRestore.current
            pendingRestore.current = null
            if (restore !== undefined && restore !== null && typeof restore.anchor === 'string' && restore.anchor !== '') {
              scrollToAnchor(restore.anchor)
              return
            }
            if (restore !== undefined && restore !== null && typeof restore.ratio === 'number') {
              const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
              scroller.scrollTop = max * Math.min(1, Math.max(0, restore.ratio))
              ratioRef.current = max > 0 ? scroller.scrollTop / max : 0
              return
            }
            scroller.scrollTop = 0
          })
          return () => window.cancelAnimationFrame(second)
        })
        return () => window.cancelAnimationFrame(frame)
      }, [chapter, status])

      React.useEffect(() => {
        const root = contentRef.current
        if (root === null) return
        for (const mark of root.querySelectorAll('mark.epub-find-mark')) {
          const parent = mark.parentNode
          mark.replaceWith(document.createTextNode(mark.textContent ?? ''))
          parent?.normalize()
        }
        if (!findOpen || findQuery.trim() === '' || status !== 'ready' || chapter === null) return
        const terms = (findTerms.length > 0 ? findTerms : [findQuery.trim()])
          .map((term) => term.toLocaleLowerCase())
          .filter((term) => term !== '')
        if (terms.length === 0) return
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        const textNodes = []
        for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
          if (node.parentElement === null) continue
          if (['SCRIPT', 'STYLE', 'MARK'].includes(node.parentElement.tagName)) continue
          textNodes.push(node)
        }
        let occurrence = 0
        for (const node of textNodes) {
          const text = node.nodeValue ?? ''
          const lower = text.toLocaleLowerCase()
          const hits = []
          for (const term of terms) {
            let offset = lower.indexOf(term)
            while (offset !== -1) {
              hits.push({ offset, length: term.length })
              offset = lower.indexOf(term, offset + term.length)
            }
          }
          if (hits.length === 0) continue
          hits.sort((left, right) => left.offset - right.offset)
          const fragment = document.createDocumentFragment()
          let cursor = 0
          for (const hit of hits) {
            if (hit.offset < cursor) continue
            if (hit.offset > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, hit.offset)))
            const mark = document.createElement('mark')
            mark.className = 'epub-find-mark'
            mark.textContent = text.slice(hit.offset, hit.offset + hit.length)
            fragment.appendChild(mark)
            occurrence += 1
            cursor = hit.offset + hit.length
          }
          if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)))
          node.parentNode?.replaceChild(fragment, node)
        }
        const marks = root.querySelectorAll('mark.epub-find-mark')
        if (marks.length === 0) return
        const wanted = findTarget !== null && findTarget.chapterIndex === chapterIndex ? findTarget.occurrence : 0
        const active = marks[Math.min(Math.max(0, wanted), marks.length - 1)]
        active.classList.add('is-active')
        active.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, [chapter, status, chapterIndex, findOpen, findQuery, findTerms, findTarget])

      React.useEffect(() => {
        findAbortRef.current?.abort()
        findAbortRef.current = null
        if (!findOpen) return undefined
        const query = findQuery.trim()
        if (query === '') {
          setFindStatus('idle')
          setFindMatches([])
          setFindTotal(0)
          setFindTerms([])
          setFindError('')
          return undefined
        }
        const controller = new AbortController()
        findAbortRef.current = controller
        const timer = window.setTimeout(() => {
          setFindStatus('loading')
          setFindError('')
          apiGet(`/search-text?book=${encodeURIComponent(book.id)}&q=${encodeURIComponent(query)}`, { signal: controller.signal })
            .then((data) => {
              if (findAbortRef.current !== controller) return
              setFindMatches(Array.isArray(data?.matches) ? data.matches : [])
              setFindTotal(Number.isFinite(data?.total) ? data.total : 0)
              setFindTerms(Array.isArray(data?.terms) ? data.terms : [])
              setFindStatus('ready')
            })
            .catch((reason) => {
              if (findAbortRef.current !== controller) return
              if (reason !== null && typeof reason === 'object' && reason.name === 'AbortError') return
              setFindStatus('error')
              setFindError(reason instanceof Error ? reason.message : String(reason))
            })
        }, 240)
        return () => {
          window.clearTimeout(timer)
          controller.abort()
          if (findAbortRef.current === controller) findAbortRef.current = null
        }
      }, [findOpen, findQuery, book.id])

      React.useEffect(() => {
        let cancelled = false
        setAnnotationStatus('loading')
        setAnnotationError('')
        apiGet(`/annotations?book=${encodeURIComponent(annotationKey)}`)
          .then((data) => {
            if (cancelled) return
            setAnnotations(Array.isArray(data?.annotations) ? data.annotations : [])
            setAnnotationStatus('ready')
          })
          .catch((reason) => {
            if (cancelled) return
            setAnnotationError(reason instanceof Error ? reason.message : String(reason))
            setAnnotationStatus('error')
          })
        return () => { cancelled = true }
      }, [annotationKey])

      React.useEffect(() => {
        const title = chapter !== null ? chapter.title : book.chapters[chapterIndex]?.title ?? ''
        writeProgress(book.id, {
          chapterIndex,
          chapterCount: book.chapters.length,
          chapterTitle: title,
          ratio: ratioRef.current,
          updatedAt: Date.now(),
        })
      }, [book.id, book.chapters, chapter, chapterIndex])

      function scrollToAnchor(anchor) {
        const container = contentRef.current
        if (container === null) return
        const selector = `[id="${escapeSelectorValue(anchor)}"]`
        const target = container.querySelector(selector)
        if (target !== null) {
          target.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
      }

      function onScroll(event) {
        const element = event.currentTarget
        const max = Math.max(0, element.scrollHeight - element.clientHeight)
        ratioRef.current = max > 0 ? element.scrollTop / max : 0
        if (selection !== null) {
          setSelection(null)
          setSelectionQuestion('')
        }
        if (saveTimer.current !== null) window.clearTimeout(saveTimer.current)
        saveTimer.current = window.setTimeout(() => {
          const title = chapter !== null ? chapter.title : book.chapters[chapterIndex]?.title ?? ''
          writeProgress(book.id, {
            chapterIndex,
            chapterCount: book.chapters.length,
            chapterTitle: title,
            ratio: ratioRef.current,
            updatedAt: Date.now(),
          })
        }, 250)
      }

      function selectionTextRange() {
        const container = contentRef.current
        const active = window.getSelection()
        if (container === null || active === null || active.isCollapsed || active.rangeCount === 0) return null
        if (active.anchorNode === null || !container.contains(active.anchorNode)) return null
        const text = active.toString().replace(/\s+/g, ' ').trim()
        if (text === '') return null
        let rect
        try {
          rect = active.getRangeAt(0).getBoundingClientRect()
        } catch {
          return null
        }
        if (rect.width === 0 && rect.height === 0) return null
        const fullText = (container.innerText ?? '').replace(/\s+/g, ' ')
        let index = fullText.indexOf(text)
        if (index === -1 && text.length > 80) index = fullText.indexOf(text.slice(0, 80))
        if (index === -1) index = 0
        const before = fullText.slice(Math.max(0, index - 900), index).trim()
        const after = fullText.slice(index + text.length, index + text.length + 900).trim()
        return {
          text: text.slice(0, 4000),
          before,
          after,
          rect,
          chapterIndex,
          chapterTitle: chapter !== null ? chapter.title : book.chapters[chapterIndex]?.title ?? '',
        }
      }

      function captureSelection() {
        const captured = selectionTextRange()
        if (captured === null) {
          setSelection(null)
          setSelectionQuestion('')
          return
        }
        const viewportWidth = window.innerWidth
        const center = captured.rect.left + captured.rect.width / 2
        const half = Math.min(260, Math.max(120, viewportWidth / 2 - 12))
        const left = Math.max(half, Math.min(viewportWidth - half, center))
        const above = captured.rect.top > 68
        const top = above ? captured.rect.top - 50 : captured.rect.bottom + 12
        setSelectionQuestion('')
        setSelection({
          text: captured.text,
          before: captured.before,
          after: captured.after,
          chapterIndex: captured.chapterIndex,
          chapterTitle: captured.chapterTitle,
          left,
          top,
          arrow: above,
        })
      }

      function copySelection(text) {
        void copyText(text).then(() => toast(t('reader.copied'))).catch(() => toast(t('reader.copied')))
      }

      function historyFromTurns(turns) {
        return turns
          .filter((turn) => turn.role === 'user' || (turn.role === 'assistant' && turn.text !== ''))
          .map((turn) => ({ role: turn.role, text: turn.text }))
      }

      async function persistAnnotation(annotationId, selected, turns) {
        if (annotationId === null || annotationId === '') return
        const clean = turns
          .filter((turn) => turn.role === 'user' || (turn.role === 'assistant' && turn.text.trim() !== ''))
          .map((turn) => ({ role: turn.role, text: turn.text }))
        if (!clean.some((turn) => turn.role === 'assistant')) return
        try {
          const data = await apiPost('/annotations', {
            id: annotationId,
            bookId: annotationKey,
            chapterIndex: Number.isInteger(selected.chapterIndex) ? selected.chapterIndex : chapterIndex,
            chapterTitle: selected.chapterTitle ?? (chapter !== null ? chapter.title : book.chapters[chapterIndex]?.title ?? ''),
            selectionText: selected.text,
            before: selected.before ?? '',
            after: selected.after ?? '',
            turns: clean,
          })
          if (data !== null && data.annotation !== undefined) {
            setAnnotations((current) => [data.annotation, ...current.filter((entry) => entry.id !== data.annotation.id)].sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0)))
            setAnnotationStatus('ready')
            setAnnotationError('')
          }
        } catch (reason) {
          toast(`${t('reader.saveFailed')}：${reason instanceof Error ? reason.message : String(reason)}`)
        }
      }

      async function runTurn(selected, question, history, controller, annotationId, baseTurns) {
        let answer = ''
        try {
          await explainSelection(
            {
              text: selected.text,
              before: selected.before,
              after: selected.after,
              question,
              history,
              bookTitle: book.title,
              author: book.author,
              chapter: selected.chapterTitle ?? (chapter !== null ? chapter.title : book.chapters[chapterIndex]?.title ?? ''),
            },
            controller.signal,
            (delta) => {
              if (abortRef.current !== controller) return
              answer += delta
              setAi((current) => {
                if (current.status !== 'streaming') return current
                return { ...current, turns: updateLastAssistant(current.turns, (turn) => ({ ...turn, text: turn.text + delta })) }
              })
            },
          )
          if (abortRef.current !== controller) return
          const finalTurns = [
            ...baseTurns,
            ...(question.trim() !== '' ? [userTurn(question)] : []),
            assistantTurn(answer, 'done'),
          ]
          setAi((current) => current.status === 'streaming'
            ? { ...current, status: 'done', turns: finalTurns }
            : current)
          if (answer.trim() !== '') void persistAnnotation(annotationId, selected, finalTurns)
        } catch (reason) {
          if (abortRef.current !== controller) return
          if (reason !== null && typeof reason === 'object' && reason.name === 'AbortError') {
            const stoppedTurns = [
              ...baseTurns,
              ...(question.trim() !== '' ? [userTurn(question)] : []),
              ...(answer.trim() !== '' ? [assistantTurn(answer, 'done')] : []),
            ]
            setAi((current) => {
              const last = [...current.turns].reverse().find((turn) => turn.role === 'assistant')
              if (last === undefined || last.text === '') {
                return {
                  ...current,
                  status: 'idle',
                  turns: current.turns.filter((turn) => !(turn.role === 'assistant' && turn.text === '')),
                }
              }
              return {
                ...current,
                status: 'done',
                turns: stoppedTurns,
              }
            })
            if (answer.trim() !== '') void persistAnnotation(annotationId, selected, stoppedTurns)
            return
          }
          const message = reason instanceof Error ? reason.message : String(reason)
          const friendly = reason !== null && typeof reason === 'object' && reason.code === 'NO_MODEL' ? t('reader.noModel') : message
          setAi((current) => ({
            ...current,
            status: 'error',
            error: friendly,
            turns: updateLastAssistant(current.turns, (turn) => ({ ...turn, status: 'error', error: friendly })),
          }))
        } finally {
          if (abortRef.current === controller) abortRef.current = null
        }
      }

      async function askAi(selected, question = '') {
        if (selected === null || selected.text === '') {
          toast(t('reader.noSelection'))
          return
        }
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        setSelection(null)
        setSelectionQuestion('')
        const currentQuestion = question.trim()
        const annotationId = makeAnnotationId()
        const turns = []
        if (currentQuestion !== '') turns.push(userTurn(currentQuestion))
        turns.push(assistantTurn('', 'streaming'))
        setAi({ open: true, view: 'thread', status: 'streaming', selection: selected, turns, annotationId, error: '', lastQuestion: currentQuestion })
        await runTurn(selected, currentQuestion, [], controller, annotationId, [])
      }

      async function runFollowUp(selected, question, baseTurns) {
        const currentQuestion = question.trim()
        if (selected === null || currentQuestion === '') return
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        setSelection(null)
        const cleanTurns = baseTurns.filter((turn) => !(turn.role === 'assistant' && turn.status === 'error' && turn.text === ''))
        const history = historyFromTurns(cleanTurns)
        const annotationId = ai.annotationId ?? makeAnnotationId()
        const turns = [...cleanTurns, userTurn(currentQuestion), assistantTurn('', 'streaming')]
        setAi({ open: true, view: 'thread', status: 'streaming', selection: selected, turns, annotationId, error: '', lastQuestion: currentQuestion })
        await runTurn(selected, currentQuestion, history, controller, annotationId, cleanTurns)
      }

      function stopAi() {
        abortRef.current?.abort()
        toast(t('reader.stopNotice'))
      }

      function retryAi() {
        const selected = ai.selection
        if (selected === null) return
        let turns = ai.turns.slice()
        while (turns.length > 0 && turns[turns.length - 1].role === 'assistant' && (turns[turns.length - 1].status === 'error' || turns[turns.length - 1].text === '')) {
          turns.pop()
        }
        let question = ai.lastQuestion ?? ''
        if (turns.length > 0 && turns[turns.length - 1].role === 'user') {
          question = turns[turns.length - 1].text
          turns = turns.slice(0, -1)
        }
        if (turns.length === 0) void askAi(selected, question)
        else void runFollowUp(selected, question, turns)
      }

      function followUp(question) {
        if (ai.status === 'streaming') return
        void runFollowUp(ai.selection, question, ai.turns)
      }

      async function deleteAnnotationRecord(record) {
        if (record === null || record === undefined || record.id === undefined) return
        try {
          await apiPost('/annotations/delete', { bookId: annotationKey, id: record.id })
          setAnnotations((current) => current.filter((entry) => entry.id !== record.id))
          if (ai.annotationId === record.id) {
            abortRef.current?.abort()
            setAi((current) => ({ ...current, view: 'history', status: 'idle', turns: [], annotationId: null, selection: null, error: '' }))
          }
        } catch (reason) {
          toast(reason instanceof Error ? reason.message : String(reason))
        }
      }

      function deleteTurn(index) {
        const turns = Array.isArray(ai.turns) ? ai.turns : []
        if (turns[index] === undefined) return
        const remove = new Set([index])
        if (turns[index].role === 'user' && turns[index + 1]?.role === 'assistant') remove.add(index + 1)
        const next = turns.filter((_, turnIndex) => !remove.has(turnIndex))
        const hasAnswer = next.some((turn) => turn.role === 'assistant' && turn.text.trim() !== '')
        if (!hasAnswer) {
          void deleteAnnotationRecord({ id: ai.annotationId })
          return
        }
        setAi((current) => ({ ...current, turns: next }))
        if (ai.annotationId !== null) void persistAnnotation(ai.annotationId, ai.selection, next)
      }

      function openAnnotation(record) {
        if (record === null || typeof record !== 'object') return
        const turns = Array.isArray(record.turns)
          ? record.turns
              .filter((turn) => turn !== null && typeof turn === 'object' && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.text === 'string')
              .map((turn) => ({ role: turn.role, text: turn.text, status: 'done', error: '' }))
          : []
        const lastQuestion = [...turns].reverse().find((turn) => turn.role === 'user')
        setSelection(null)
        setAi({
          open: true,
          view: 'thread',
          status: 'done',
          selection: {
            text: record.selectionText,
            before: record.before ?? '',
            after: record.after ?? '',
            chapterIndex: Number.isInteger(record.chapterIndex) ? record.chapterIndex : chapterIndex,
            chapterTitle: record.chapterTitle ?? '',
          },
          turns,
          annotationId: record.id,
          error: '',
          lastQuestion: lastQuestion?.text ?? '',
        })
      }

      function showHistory() {
        if (ai.status === 'streaming') return
        setSelection(null)
        setAi((current) => ({ ...current, view: 'history' }))
      }

      function changeChapter(nextIndex, anchor) {
        if (nextIndex < 0 || nextIndex >= book.chapters.length) return
        if (window.innerWidth < 1180) setTocOpen(false)
        void loadChapter(nextIndex, { ratio: 0, anchor })
      }

      function jumpToMatch(match) {
        setFindTarget({ chapterIndex: match.chapterIndex, occurrence: match.occurrence })
        if (chapter === null || chapterIndex !== match.chapterIndex) {
          void loadChapter(match.chapterIndex, { ratio: 0 })
        }
      }

      function onChapterClick(event) {
        const anchor = event.target instanceof Element ? event.target.closest('a[data-epub-href]') : null
        if (anchor === null) return
        event.preventDefault()
        const target = anchor.getAttribute('data-epub-href') ?? ''
        if (target === '') return
        const hashIndex = target.indexOf('#')
        const path = hashIndex === -1 ? target : target.slice(0, hashIndex)
        const fragment = hashIndex === -1 ? '' : target.slice(hashIndex + 1)
        if (path === '' || chapter === null || path === chapter.path) {
          if (fragment !== '') scrollToAnchor(fragment)
          return
        }
        const nextIndex = book.chapters.findIndex((entry) => entry.path === path)
        if (nextIndex !== -1) changeChapter(nextIndex, fragment)
      }

      React.useEffect(() => {
        if (selection === null) return
        const onDown = (event) => {
          if (event.target instanceof Element && event.target.closest('.epub-select-popover') !== null) return
          setSelection(null)
          setSelectionQuestion('')
        }
        const onScroll = () => {
          setSelection(null)
          setSelectionQuestion('')
        }
        document.addEventListener('mousedown', onDown, true)
        window.addEventListener('scroll', onScroll, true)
        return () => {
          document.removeEventListener('mousedown', onDown, true)
          window.removeEventListener('scroll', onScroll, true)
        }
      }, [selection])

      React.useEffect(() => {
        function onKeyDown(event) {
          const target = event.target
          const editing = target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
          if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'f') {
            event.preventDefault()
            openFind()
            return
          }
          if (editing) return
          if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
            event.preventDefault()
            const current = selection ?? selectionTextRange()
            if (current !== null) void askAi(current, '')
            else {
              setAi((prev) => ({ ...prev, open: true }))
              toast(t('reader.noSelection'))
            }
            return
          }
          if (event.altKey && event.key === 'ArrowLeft') {
            event.preventDefault()
            changeChapter(chapterIndex - 1)
            return
          }
          if (event.altKey && event.key === 'ArrowRight') {
            event.preventDefault()
            changeChapter(chapterIndex + 1)
            return
          }
          if (event.key === 'Escape') {
            if (findOpen) {
              closeFind()
              return
            }
            if (selection !== null) {
              setSelection(null)
              setSelectionQuestion('')
            } else setAi((current) => current.open ? { ...current, open: false } : current)
          }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [selection, chapterIndex, askAi, findOpen])

      function updateFont(delta) {
        setFontSize((current) => {
          const next = Math.min(30, Math.max(12, current + delta))
          writeFontSize(next)
          return next
        })
      }

      React.useEffect(() => {
        function onWheel(event) {
          if (!event.ctrlKey && !event.metaKey) return
          event.preventDefault()
          updateFont(event.deltaY < 0 ? 1 : -1)
        }
        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
      }, [])

      const chapterMeta = chapter !== null ? chapter : null
      const hasHeading = chapterMeta !== null && /^(?:<section\b[^>]*>\s*)?<h[1-3][\s>]/i.test(chapterMeta.html.trim())
      const progressPercent = book.chapters.length > 0 ? ((chapterIndex + 1) / book.chapters.length) * 100 : 0
      const bodyClassName = cn('epub-reader-body', tocOpen && 'toc-open', !tocOpen && 'toc-closed', ai.open && 'ai-open')

      return h(
        'div',
        { className: 'epub-reader' },
        h(
          'header',
          { className: 'epub-reader-head' },
          h(
            'div',
            { className: 'epub-reader-head-left' },
            h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: onBack, title: t('reader.back'), 'aria-label': t('reader.back') }, h(IconArrowLeft, { size: 17 })),
            h(
              'div',
              { className: 'epub-reader-book' },
              h('div', { className: 'epub-reader-book-title', title: book.title }, book.title),
              h('div', { className: 'epub-reader-book-sub' }, [book.author !== '' ? book.author : t('reader.unknownAuthor'), chapterMeta !== null ? chapterMeta.title : t('reader.loading')].join(' · ')),
            ),
          ),
          h(
            'div',
            { className: 'epub-reader-head-right' },
            onCompare !== undefined
              ? h('button', { type: 'button', className: 'epub-ghost-btn', onClick: onCompare, title: t('papers.compare'), 'aria-label': t('papers.compare') }, h(IconBookOpen, { size: 15 }), h('span', null, t('papers.compare')))
              : null,
            h('button', {
              type: 'button',
              className: cn('epub-ghost-btn', findOpen && 'is-active'),
              onClick: openFind,
              title: `${t('reader.find')} (${findShortcut})`,
              'aria-label': `${t('reader.find')} (${findShortcut})`,
            },
              h(IconSearch, { size: 15 }),
              h('span', null, t('reader.find')),
              h('kbd', { className: 'epub-kbd' }, findShortcut),
            ),
            h(
              'div',
              { className: 'epub-font-group', role: 'group', 'aria-label': t('reader.fontSmaller') + ' / ' + t('reader.fontLarger') },
              h('button', { type: 'button', onClick: () => updateFont(-1), title: t('reader.fontSmaller'), 'aria-label': t('reader.fontSmaller') }, h(IconMinus, { size: 13 })),
              h('button', { type: 'button', onClick: () => updateFont(1), title: t('reader.fontLarger'), 'aria-label': t('reader.fontLarger') }, h(IconPlus, { size: 13 })),
            ),
            h('span', { className: 'epub-zoom-hint', title: t('reader.zoomHint') }, h('kbd', { className: 'epub-kbd' }, 'Ctrl'), t('reader.zoomHintShort')),
            h('button', { type: 'button', className: cn('epub-ghost-btn', tocOpen && 'is-active'), onClick: () => setTocOpen((value) => !value), title: t('reader.toc'), 'aria-label': t('reader.toc') }, h(IconList, { size: 15 }), h('span', null, t('reader.toc'))),
            h('button', { type: 'button', className: 'epub-ai-trigger', onClick: () => setAi((current) => ({ ...current, open: !current.open })), title: t('reader.ai'), 'aria-label': t('reader.ai') }, h(IconSparkles, { size: 15 }), h('span', null, t('reader.ai'))),
          ),
        ),
        findOpen
          ? h(
              'div',
              { className: 'epub-find-panel' },
              h('div', { className: 'epub-find-head' },
                h('div', { className: 'epub-find-input-wrap' },
                  h(IconSearch, { size: 14 }),
                  h('input', {
                    ref: findInputRef,
                    className: 'epub-find-input',
                    value: findQuery,
                    onChange: (event) => {
                      setFindQuery(event.target.value)
                      setFindTarget(null)
                      setFindMatches([])
                      setFindTotal(0)
                      setFindTerms([])
                      setFindStatus('idle')
                      setFindError('')
                    },
                    placeholder: t('reader.findPlaceholder'),
                    'aria-label': t('reader.findPlaceholder'),
                  }),
                ),
                h('span', { className: 'epub-find-count' },
                  findStatus === 'loading'
                    ? t('reader.findSearching')
                    : findTotal > 0
                      ? format(t('reader.findCount'), { count: findTotal })
                      : '',
                ),
                h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: closeFind, title: t('reader.close'), 'aria-label': t('reader.close') }, h(IconX, { size: 14 })),
              ),
              h('div', { className: 'epub-find-results' },
                findStatus === 'error'
                  ? h('div', { className: 'epub-find-empty' }, findError)
                  : findStatus === 'ready' && findMatches.length === 0
                    ? h('div', { className: 'epub-find-empty' }, t('reader.findNoResults'))
                    : findMatches.map((match) =>
                        h('button', {
                          key: `${match.chapterIndex}-${match.occurrence}`,
                          type: 'button',
                          className: 'epub-find-result',
                          onClick: () => jumpToMatch(match),
                        },
                          h('span', { className: 'epub-find-result-title' },
                            h('span', null, match.chapterTitle),
                            h('span', { className: 'epub-find-result-index' }, `#${match.occurrence + 1}`),
                          ),
                          h('span', { className: 'epub-find-result-snippet' }, match.snippet),
                        ),
                      ),
              ),
            )
          : null,
        h(
          'div',
          { className: bodyClassName },
          h(
            'aside',
            { className: 'epub-toc', 'aria-label': t('reader.toc') },
            h('div', { className: 'epub-toc-head' },
              h('h2', null, t('reader.toc')),
              h('button', { type: 'button', className: 'epub-icon-btn is-quiet', onClick: () => setTocOpen(false), title: t('reader.close'), 'aria-label': t('reader.close') }, h(IconX, { size: 14 })),
            ),
            h(
              'div',
              { className: 'epub-toc-list' },
              book.chapters.length === 0
                ? h('div', { className: 'epub-ai-empty', style: { minHeight: 120 } }, h('p', null, t('reader.tocEmpty')))
                : book.chapters.map((entry, index) =>
                    h(
                      'button',
                      {
                        key: `${index}-${entry.path}`,
                        type: 'button',
                        className: cn('epub-toc-item', index === chapterIndex && 'active'),
                        onClick: () => changeChapter(index),
                        title: entry.title,
                      },
                      h('span', { className: 'epub-toc-index' }, String(index + 1)),
                      h('span', { className: 'epub-toc-title' }, entry.title),
                    ),
                  ),
            ),
          ),
          h(
            'main',
            { className: 'epub-reader-main' },
            status === 'loading'
              ? h('div', { className: 'epub-reading-state' }, h('div', { className: 'epub-reading-state-inner' }, h(Spinner, null), h('h2', null, t('reader.loading')), h('p', null, format(t('reader.chapter'), { current: chapterIndex + 1, total: book.chapters.length }))))
              : status === 'error'
                ? h('div', { className: 'epub-reading-state' }, h('div', { className: 'epub-reading-state-inner' }, h('div', { className: 'epub-empty-icon' }, h(IconBookOpen, { size: 26 })), h('h2', null, t('reader.loadFailed')), h('p', null, error), h('button', { type: 'button', className: 'epub-btn epub-btn-primary', onClick: () => void loadChapter(chapterIndex, { force: true, ratio: 0 }) }, t('reader.retry'))))
                : h(
                    'div',
                    { className: 'epub-reading-scroll', ref: scrollRef, onScroll },
                    h(
                      'div',
                      { className: 'epub-reading-inner' },
                      h('div', { className: 'epub-chapter-kicker' }, format(t('reader.chapter'), { current: chapterIndex + 1, total: book.chapters.length })),
                      hasHeading || chapterMeta === null ? null : h('h1', { className: 'epub-chapter-title' }, chapterMeta.title),
                      h('div', {
                        className: 'epub-chapter',
                        ref: contentRef,
                        style: { '--epub-font-size': `${fontSize}px` },
                        onClick: onChapterClick,
                        onMouseUp: () => window.setTimeout(captureSelection, 0),
                        onKeyUp: (event) => { if (event.shiftKey || event.key === 'Shift') window.setTimeout(captureSelection, 0) },
                        dangerouslySetInnerHTML: { __html: chapterMeta !== null ? chapterMeta.html : '' },
                      }),
                      h('div', { className: 'epub-chapter-end' }, '· · ·'),
                    ),
                  ),
            h(
              'footer',
              { className: 'epub-reader-foot' },
              h('button', { type: 'button', className: 'epub-foot-btn', onClick: () => changeChapter(chapterIndex - 1), disabled: chapterIndex <= 0 }, h(IconChevronLeft, { size: 14 }), h('span', null, t('reader.prev'))),
              h(
                'div',
                { className: 'epub-foot-progress' },
                h('div', { className: 'epub-foot-track' }, h('span', { className: 'epub-foot-fill', style: { width: `${progressPercent}%` } })),
                h('span', { className: 'epub-foot-label' }, format(t('reader.chapter'), { current: chapterIndex + 1, total: book.chapters.length })),
              ),
              h('button', { type: 'button', className: 'epub-foot-btn', onClick: () => changeChapter(chapterIndex + 1), disabled: chapterIndex >= book.chapters.length - 1 }, h('span', null, t('reader.next')), h(IconChevronRight, { size: 14 })),
            ),
          ),
          ai.open
            ? h(AiPanel, {
                t,
                ai,
                annotations,
                annotationStatus,
                annotationError,
                onClose: () => { abortRef.current?.abort(); setAi((current) => ({ ...current, open: false })) },
                onShowHistory: showHistory,
                onShowThread: () => setAi((current) => ({ ...current, view: 'thread' })),
                onSelectAnnotation: openAnnotation,
                onStop: stopAi,
                onRetry: retryAi,
                onAsk: (question) => followUp(question),
                onCopy: copySelection,
                onFollowUp: followUp,
                onDeleteAnnotation: (record) => void deleteAnnotationRecord(record),
                onDeleteTurn: deleteTurn,
              })
            : null,
        ),
        selection !== null
          ? h(
              'form',
              {
                className: 'epub-select-popover',
                style: { left: `${selection.left}px`, top: `${selection.top}px` },
                onSubmit: (event) => {
                  event.preventDefault()
                  void askAi(selection, selectionQuestion)
                },
              },
              h('input', {
                className: 'epub-select-input',
                value: selectionQuestion,
                onChange: (event) => setSelectionQuestion(event.target.value),
                placeholder: t('reader.askPlaceholder'),
                'aria-label': t('reader.askPlaceholder'),
                autoFocus: true,
              }),
              h('button', { type: 'submit', className: 'epub-explain-btn' }, h(IconSparkles, { size: 13 }), t('reader.explain')),
              h('span', { className: 'epub-pop-divider' }),
              h('button', { type: 'button', className: 'epub-copy-btn', onClick: () => copySelection(selection.text), title: t('reader.copy'), 'aria-label': t('reader.copy') }, h(IconCopy, { size: 13 })),
              h('div', { className: 'epub-select-quick' },
                ['translate', 'example', 'background', 'explain'].map((key) =>
                  h('button', {
                    key,
                    type: 'button',
                    className: 'epub-select-quick-btn',
                    onClick: () => void askAi(selection, t(`reader.ask.${key}`)),
                  }, t(`reader.chip.${key}`)),
                ),
              ),
            )
          : null,
      )
    }

    // App -------------------------------------------------------------------

    function App({ ctx, t }) {
      useLocaleTick(ctx)
      const [screen, setScreen] = React.useState('library')
      const [readerBook, setReaderBook] = React.useState(null)
      const [paperReaderId, setPaperReaderId] = React.useState('')
      const [paperCompareId, setPaperCompareId] = React.useState('')
      const [opening, setOpening] = React.useState('')
      const [openError, setOpenError] = React.useState('')
      const [toast, setToast] = React.useState('')
      const toastTimer = React.useRef(null)

      React.useEffect(() => () => { if (toastTimer.current !== null) window.clearTimeout(toastTimer.current) }, [])

      function showToast(message, duration = 2200) {
        setToast(message)
        if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
        toastTimer.current = window.setTimeout(() => setToast(''), duration)
      }

      function announceCopy(info) {
        if (info === undefined || info === null || info.copied !== true || info.copyPath === '') return
        const key = info.created === true ? 'library.copyCreated' : 'library.copyReused'
        showToast(format(t(key), { path: info.copyPath }), 4200)
      }

      async function openBook(book) {
        if (opening !== '') return
        setOpening(book.id)
        setOpenError('')
        try {
          const data = await apiPost('/open', { id: book.id })
          setReaderBook(data.book)
          setScreen('reader')
          announceCopy(data)
        } catch (error) {
          setOpenError(`${t('library.openFailed')}：${error instanceof Error ? error.message : String(error)}`)
        } finally {
          setOpening('')
        }
      }

      function openImported(book, info) {
        setOpenError('')
        setReaderBook(book)
        setScreen('reader')
        announceCopy(info)
      }

      async function openDossier(id) {
        if (opening !== '') return
        setOpening(id)
        setOpenError('')
        try {
          const data = await apiPost('/dossiers/open', { id })
          setReaderBook(data.book)
          setScreen('dossier-reader')
        } catch (error) {
          setOpenError(`${t('dossiers.openFailed')}：${error instanceof Error ? error.message : String(error)}`)
        } finally {
          setOpening('')
        }
      }

      async function openPaper(id) {
        if (opening !== '') return
        setOpening(id)
        setOpenError('')
        try {
          const data = await apiPost('/papers/open', { id })
          setPaperReaderId(id)
          setReaderBook(data.book)
          setScreen('paper-reader')
        } catch (error) {
          setOpenError(`${t('papers.loadFailed')}：${error instanceof Error ? error.message : String(error)}`)
        } finally {
          setOpening('')
        }
      }

      return h(
        'div',
        { className: 'epub-panel' },
        screen === 'reader' && readerBook !== null
          ? h(Reader, { book: readerBook, t, onBack: () => { setReaderBook(null); setScreen('library') }, onToast: showToast })
          : screen === 'dossier-reader' && readerBook !== null
            ? h(Reader, { book: readerBook, t, onBack: () => { setReaderBook(null); setScreen('dossiers') }, onToast: showToast })
            : screen === 'paper-reader' && readerBook !== null
            ? h(PaperReaderShell, {
                paperId: paperReaderId,
                book: readerBook,
                t,
                onBack: () => { setReaderBook(null); setScreen('papers') },
                onRead: (id) => void openPaper(id),
                onToast: showToast,
              })
            : screen === 'dossiers'
              ? h(DossierLibrary, { t, onBack: () => setScreen('library'), onRead: (id) => void openDossier(id) })
              : screen === 'papers'
              ? h(PaperLibrary, {
                  t,
                  onBack: () => setScreen('library'),
                  onRead: (id) => void openPaper(id),
                  onCompare: (id) => { setPaperCompareId(id); setScreen('paper-compare') },
                })
              : screen === 'paper-compare'
                ? h(PaperCompare, {
                    paperId: paperCompareId,
                    t,
                    onBack: () => setScreen('papers'),
                    onRead: (id) => void openPaper(id),
                  })
                : h(React.Fragment, null,
                    h(Library, { ctx, t, onOpenBook: openBook, opening, onLocalBook: openImported, onPapers: () => setScreen('papers'), onDossiers: () => setScreen('dossiers') }),
                    openError !== ''
                      ? h('div', { style: { position: 'absolute', left: 20, right: 20, bottom: 20, zIndex: 50 } }, h(ErrorBanner, { title: t('library.openFailed'), message: openError }))
                      : null,
                  ),
        h(Toast, { message: toast }),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const t = ctx.locale.bind('epubReader')

        ctx.effect(() => {
          const disposers = [
            ctx.locale.register('epubReader', 'zh', ZH),
            ctx.locale.register('epubReader', 'en', EN),
          ]
          return () => {
            for (const dispose of disposers) dispose()
          }
        }, 'epub-reader: locale dictionaries')

        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.plugin = '@local/dsh-epub-reader'
          tag.textContent = CSS
          document.head.append(tag)
          return () => tag.remove()
        }, 'epub-reader: styles')

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'epub-reader',
          order: 30,
          label: () => t('panel.title'),
        }, function EpubReaderPanelIcon(props) {
          return h('span', { style: { display: 'grid', placeItems: 'center', width: '100%', height: '100%' } }, h(IconPanelBook, { size: props?.size ?? 20, active: props?.active === true }))
        }))

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'epub-reader',
        }, function EpubReaderPanel() {
          return h(App, { ctx, t })
        }))
      },
    }
  },
})
