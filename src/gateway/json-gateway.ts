import UrlGeneratorRepository, { TaggedUrl } from '../repository/url-generator-repository';
import urls from "../../resources/urls.json"

export default class JsonGateway implements UrlGeneratorRepository {
  [Symbol.asyncIterator] = async function* (): AsyncIterator<TaggedUrl, any, undefined> {
    for(const url of urls){
        yield url
    }
  };
}
