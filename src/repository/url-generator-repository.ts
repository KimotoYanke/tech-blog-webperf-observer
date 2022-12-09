export type TaggedUrl = {
  url: string;
  tag: string;
};

/**
 * URLを生成するインターフェース
 * @yield 生成したタグ付きURL
 */
export default interface UrlGeneratorRepository {
    [Symbol.asyncIterator](): AsyncIterator<TaggedUrl>;
}
