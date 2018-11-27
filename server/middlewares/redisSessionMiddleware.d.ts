import Koa from 'koa';
import KoaSession from 'koa-generic-session'

/**
 * 配置Session
 * @param app Koa
 */
export default function (app: Koa): void;
/**
 * 获取session
 * @param ctx Koa.Context
 */
export function get(ctx: Koa.Context): KoaSession.Session;
/**
 * 设置session
 * @param ctx Koa.Context
 * @param 要设置的数据 
 */
export function set(ctx: Koa.Context, data: any): void;
/**
 * 删除session
 * @param ctx Koa.Context
 */
export function remove(ctx: Koa.Context): void;
/**
 * 重新生成session并返回
 * @param ctx Koa.Context
 */
export function regenerate(ctx: Koa.Context, data: any): KoaSession.Session;
