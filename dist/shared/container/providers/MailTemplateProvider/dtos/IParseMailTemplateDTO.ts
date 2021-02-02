/**
 * Essa inteface (ITemplateVariables) foi criada para ser o tipo da propriedade "veriables"
 * na interface (IParseMailTemplateDTO) uma vez que a propriedade "variables" vai poder receber
 * diversos valores no objeto. Exemplo abaixo:
 * { variables: {"nome": "Fulano de tal", "idade": 35 , "data_nasc": "21/08/1995" }}
 */
interface ITemplateVariables {
  [key: string ] : string | number
}

interface IParseMailTemplateDTO {
  file: string,
  variables: ITemplateVariables
}

export default IParseMailTemplateDTO;
