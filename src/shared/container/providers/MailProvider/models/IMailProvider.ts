export default interface ImailProvider {
  sendEmail(to: string, body:string): Promise<void>;
}
