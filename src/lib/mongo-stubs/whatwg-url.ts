// بديل خفيف لـ whatwg-url يعتمد على URL الأصلية في بيئة التشغيل
const NativeURL = globalThis.URL;
const NativeURLSearchParams = globalThis.URLSearchParams;

export { NativeURL as URL, NativeURLSearchParams as URLSearchParams };
export default { URL: NativeURL, URLSearchParams: NativeURLSearchParams };
