import ImailProvider from "../models/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";

export default class FakeMailProvider implements ImailProvider {
 private messages: ISendMailDTO[] = [];
 public  async sendEmail(message: ISendMailDTO): Promise<void>{
    this.messages.push(message);
  }
}
