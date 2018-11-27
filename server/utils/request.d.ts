import Koa from 'koa';

/**
 * 参数
 */
interface Options {
  /**
   * 数据类型,默认json
   */
  dataType?: 'xml' | 'html' | 'script' | 'json' | 'jsonp' | 'text',
  /**
   * 请求地址
   */
  url: string
  /**
   * 参数
   */
  params?: BodyInit | any | null
}
/**
 * 发起一个请求
 * @param options 参数
 */
export function request(options: Options): Promise<any> | Promise<string>;

/**
 * 发起一个GET请求
 * @param url URL
 * @param options OPTIONS
 * @param ctx KoaContext
 */
export function get(url: string, options: Options, ctx: Koa.Context);
/**
 * 发起一个POST请求
 * @param url URL
 * @param options OPTIONS
 * @param ctx KoaContext
 */
export function post(url: string, options: Options, ctx: Koa.Context);