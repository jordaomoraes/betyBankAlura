const Retorno = require('../models/retorno');
const { SUCCESS} = require('../models/status-types');
const sut = require('../automations/aautomation-teste.automation');

describe('textEmphasisStyle:  - Automation', () => {
  it('QUANDO  TESTES', async () => {
    // Arrange
    const pedidosVendaSalesforceMock = require('../mocks/testes/exemplo.json');

    const abortarPedidoVendaServiceMock = {
      getPedidoDeVendaAbortados: jest.fn(() => {
        const retorno = new Retorno();
        retorno.setRetornoComSucesso(pedidosVendaSalesforceMock);
        return retorno;
      })
    };

    const ctx = {
      abortarPedidoVendaService: abortarPedidoVendaServiceMock
    };
    // Act
    const result = await sut.run(ctx);

    // Assert
    expect(result.status).toBe(SUCCESS);
  

  });

});
