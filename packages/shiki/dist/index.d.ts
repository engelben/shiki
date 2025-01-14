import { IRawThemeSetting, IRawGrammar, IRawTheme } from 'vscode-textmate'

declare type Theme =
  | 'css-variables'
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'light-plus'
  | 'material-darker'
  | 'material-default'
  | 'material-lighter'
  | 'material-ocean'
  | 'material-palenight'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'poimandres'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'
declare const themes: Theme[]

declare enum FontStyle {
  NotSet = -1,
  None = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4
}

interface IThemedTokenScopeExplanation {
  scopeName: string
  themeMatches: IRawThemeSetting[]
}
interface IThemedTokenExplanation {
  content: string
  scopes: IThemedTokenScopeExplanation[]
}
/**
 * A single token with color, and optionally with explanation.
 *
 * For example:
 *
 * {
 *   "content": "shiki",
 *   "color": "#D8DEE9",
 *   "explanation": [
 *     {
 *       "content": "shiki",
 *       "scopes": [
 *         {
 *           "scopeName": "source.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.objectliteral.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.object.member.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.array.literal.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "variable.other.object.js",
 *           "themeMatches": [
 *             {
 *               "name": "Variable",
 *               "scope": "variable.other",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             },
 *             {
 *               "name": "[JavaScript] Variable Other Object",
 *               "scope": "source.js variable.other.object",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 */
interface IThemedToken {
  /**
   * The content of the token
   */
  content: string
  /**
   * 6 or 8 digit hex code representation of the token's color
   */
  color?: string
  /**
   * Font style of token. Can be None/Italic/Bold/Underline
   */
  fontStyle?: FontStyle
  /**
   * Explanation of
   *
   * - token text's matching scopes
   * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
   */
  explanation?: IThemedTokenExplanation[]
}

interface HighlighterOptions {
  /**
   * The theme to load upfront.
   */
  theme?: IThemeRegistration
  /**
   * A list of themes to load upfront.
   *
   * Default to: `['dark-plus', 'light-plus']`
   */
  themes?: IThemeRegistration[]
  /**
   * A list of languages to load upfront.
   *
   * Default to `['html', 'css', 'javascript']`
   */
  langs?: (Lang | ILanguageRegistration)[]
  /**
   * Paths for loading themes and langs. Relative to the package's root.
   */
  paths?: IHighlighterPaths
}
interface Highlighter {
  /**
   * Convert code to HTML tokens.
   * `lang` and `theme` must have been loaded.
   */
  codeToHtml(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>
  ): string
  /**
   * Convert code to themed tokens for custom processing.
   * `lang` and `theme` must have been loaded.
   * You may customize the bundled HTML / SVG renderer or write your own
   * renderer for another render target.
   */
  codeToThemedTokens(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>,
    options?: ThemedTokenizerOptions
  ): IThemedToken[][]
  /**
   * Get the loaded theme
   */
  getTheme(theme?: IThemeRegistration): IShikiTheme
  /**
   * Load a theme
   */
  loadTheme(theme: IThemeRegistration): Promise<void>
  /**
   * Load a language
   */
  loadLanguage(lang: ILanguageRegistration | Lang): Promise<void>
  /**
   * Get all loaded themes
   */
  getLoadedThemes(): Theme[]
  /**
   * Get all loaded languages
   */
  getLoadedLanguages(): Lang[]
  /**
   * Get the foreground color for theme. Can be used for CSS `color`.
   */
  getForegroundColor(theme?: StringLiteralUnion<Theme>): string
  /**
   * Get the background color for theme. Can be used for CSS `background-color`.
   */
  getBackgroundColor(theme?: StringLiteralUnion<Theme>): string
}
interface IHighlighterPaths {
  /**
   * @default 'themes/'
   */
  themes?: string
  /**
   * @default 'languages/'
   */
  languages?: string
}
declare type ILanguageRegistration = {
  id: string
  scopeName: string
  aliases?: string[]
  samplePath?: string
  /**
   * A list of languages the current language embeds.
   * If manually specifying languages to load, make sure to load the embedded
   * languages for each parent language.
   */
  embeddedLangs?: Lang[]
} & (
  | {
      path: string
      grammar?: IRawGrammar
    }
  | {
      path?: string
      grammar: IRawGrammar
    }
)
declare type IThemeRegistration = IShikiTheme | StringLiteralUnion<Theme>
interface IShikiTheme extends IRawTheme {
  /**
   * @description theme name
   */
  name: string
  /**
   * @description light/dark theme
   */
  type: 'light' | 'dark'
  /**
   * @description tokenColors of the theme file
   */
  settings: IRawThemeSetting[]
  /**
   * @description text default foreground color
   */
  fg: string
  /**
   * @description text default background color
   */
  bg: string
  /**
   * @description relative path of included theme
   */
  include?: string
  /**
   *
   * @description color map of the theme file
   */
  colors?: Record<string, string>
}
/**
 * type StringLiteralUnion<'foo'> = 'foo' | string
 * This has auto completion whereas `'foo' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
declare type StringLiteralUnion<T extends U, U = string> = T | (U & {})
interface ThemedTokenizerOptions {
  /**
   * Whether to include explanation of each token's matching scopes and
   * why it's given its color. Default to false to reduce output verbosity.
   */
  includeExplanation?: boolean
}

declare type Lang =
  | 'abap'
  | 'actionscript-3'
  | 'ada'
  | 'apache'
  | 'apex'
  | 'apl'
  | 'applescript'
  | 'asm'
  | 'astro'
  | 'awk'
  | 'ballerina'
  | 'bat'
  | 'batch'
  | 'c'
  | 'clojure'
  | 'clj'
  | 'cobol'
  | 'coffee'
  | 'cpp'
  | 'crystal'
  | 'csharp'
  | 'c#'
  | 'css'
  | 'd'
  | 'dart'
  | 'diff'
  | 'docker'
  | 'dream-maker'
  | 'elixir'
  | 'elm'
  | 'erb'
  | 'erlang'
  | 'fish'
  | 'fsharp'
  | 'f#'
  | 'gherkin'
  | 'git-commit'
  | 'git-rebase'
  | 'gnuplot'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'hack'
  | 'haml'
  | 'handlebars'
  | 'hbs'
  | 'haskell'
  | 'hcl'
  | 'hlsl'
  | 'html'
  | 'ini'
  | 'java'
  | 'javascript'
  | 'js'
  | 'jinja-html'
  | 'json'
  | 'jsonc'
  | 'jsonnet'
  | 'jssm'
  | 'fsl'
  | 'jsx'
  | 'julia'
  | 'jupyter'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'lisp'
  | 'logo'
  | 'lua'
  | 'make'
  | 'makefile'
  | 'markdown'
  | 'md'
  | 'matlab'
  | 'mdx'
  | 'nginx'
  | 'nim'
  | 'nix'
  | 'objective-c'
  | 'objc'
  | 'objective-cpp'
  | 'ocaml'
  | 'openscenario-2'
  | 'pascal'
  | 'perl'
  | 'php'
  | 'plsql'
  | 'postcss'
  | 'powershell'
  | 'ps'
  | 'ps1'
  | 'prisma'
  | 'prolog'
  | 'pug'
  | 'jade'
  | 'puppet'
  | 'purescript'
  | 'python'
  | 'py'
  | 'r'
  | 'raku'
  | 'perl6'
  | 'razor'
  | 'riscv'
  | 'ruby'
  | 'rb'
  | 'rust'
  | 'sas'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shaderlab'
  | 'shader'
  | 'shellscript'
  | 'shell'
  | 'bash'
  | 'sh'
  | 'zsh'
  | 'smalltalk'
  | 'solidity'
  | 'sparql'
  | 'sql'
  | 'ssh-config'
  | 'stylus'
  | 'styl'
  | 'svelte'
  | 'swift'
  | 'system-verilog'
  | 'tasl'
  | 'tcl'
  | 'tex'
  | 'toml'
  | 'tsx'
  | 'turtle'
  | 'twig'
  | 'typescript'
  | 'ts'
  | 'vb'
  | 'cmd'
  | 'verilog'
  | 'vhdl'
  | 'viml'
  | 'vue-html'
  | 'vue'
  | 'wasm'
  | 'wenyan'
  | '文言'
  | 'xml'
  | 'xsl'
  | 'yaml'
declare const languages: ILanguageRegistration[]

declare function getHighlighter(options: HighlighterOptions): Promise<Highlighter>

interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
}
declare function renderToHtml(lines: IThemedToken[][], options?: HtmlRendererOptions): string

/**
 * Set the route for loading the assets
 * URL should end with `/`
 *
 * For example:
 * ```ts
 * setCDN('https://unpkg.com/shiki/') // use unpkg
 * setCDN('/assets/shiki/') // serve by yourself
 * ```
 */
declare function setCDN(root: string): void
/**
 * Explicitly set the source for loading the OnigasmWASM
 *
 * Accepts Url or ArrayBuffer
 */
declare function setOnigasmWASM(path: string | ArrayBuffer): void
/**
 * @param themePath related path to theme.json
 */
declare function fetchTheme(themePath: string): Promise<IShikiTheme>

export {
  languages as BUNDLED_LANGUAGES,
  themes as BUNDLED_THEMES,
  FontStyle,
  Highlighter,
  HighlighterOptions,
  HtmlRendererOptions,
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
  IThemedToken,
  Lang,
  Theme,
  getHighlighter,
  fetchTheme as loadTheme,
  renderToHtml,
  setCDN,
  setOnigasmWASM
}
