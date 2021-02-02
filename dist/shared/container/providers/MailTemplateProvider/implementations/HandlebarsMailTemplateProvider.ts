import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from "../models/IMailTemplateProvider";

/**
 * Estou usando a lib handlebars para fazer o parse do meu template com as variáveis
 * que passei no meu template engine "handlebars"
 */
class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ file, variables }: IParseMailTemplateDTO):Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, { encoding: 'utf-8'});
    const parseTemplate = handlebars.compile(templateFileContent); // Pega o template
    return parseTemplate(variables); // Compela as variaveis e valores passadas no template
  }
}

export default HandlebarsMailTemplateProvider;
