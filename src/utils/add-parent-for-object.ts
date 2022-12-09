/**
 * プロパティに親を追加する
 * @param parent 追加する親
 * @param children オブジェクト
 * @returns オブジェクトのプロパティに全部親をつける
 * addParentForObject("parent",{ "a": "", "b": "" }) == { "parent.a": "", "parent.b": "" }
 */
export const addParentForObject = <
  P extends string,
  K extends string,
  O extends { [key in K]: any }
>(
  parent: P,
  children: { [key in K]: O[K] }
): { [key in `${P}.${K}`]: O[K] } => {
  const r = Object.entries(children).reduce<{ [key in `${P}.${K}`]?: O[K] }>(
    (prev, [k, v]): { [key in `${P}.${K}`]?: O[K] } => {
      return {
        ...prev,
        [`${parent}.${k}` as `${P}.${K}`]: v,
      };
    },
    {}
  );

  return r as { [key in `${P}.${K}`]: O[K] };
};
