class PedidoDeVendaDt {
  transform({ data }) {

    const itens = data.valor;

   const ItensPedido = itens.map((item) => ({
      C7_PRODUTO: item.record.ProductCode__c,
      C7_QUANT: item.record.Qtd_CE_Necessidade__c,
      C7_PREÇO: item.record.Preco_Sell_Out__c,
      C7_DATPRF: item.record.Dias_para_Entrega__c,
      C7_IPI: item.record.IPI__c,
      C7_OBS: item.record.Name
    }))

    return {
      "pedcompra": {
        C7_FILORI: "Subsidiary Code",
        CCNPJ: 'teste',
        C7_COND: '999',
        C7_CONTATO: "gUilherme"
      },
      "itensPedido": ItensPedido

    }
  }
}
module.exports = new PedidoDeVendaDt();
