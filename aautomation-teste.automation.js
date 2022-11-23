/* eslint-disable no-await-in-loop */
const parallelExec = require('@linkapi.solutions/nodejs-sdk/parallel');
const Logger = require('@linkapi.solutions/nodejs-sdk/logger');
const Retorno = require('../models/retorno');
const AbordarPedidoVendaService = require('../services/aborto-pedido-de-venda.service');
const SessionUtil = require('../utils/session.util');
const pedidoVendaDt = require('../data-transformations/protheus-abortar-pedido-venda.dt');
const teste = require('../mocks/testes/exemplo.json')
class AbortarPedidoDeVenda {

  initialize({ abortarPedidoVendaService }) {
    this.sessionUtil = new SessionUtil();
    this.abortarPedidoVendaService = abortarPedidoVendaService || new AbordarPedidoVendaService({ component: null });
    this.execucoesParalelasDefault = 1;
    this.intervaloDefault = 1500;
  }

  async run(ctx) {
    this.initialize({
      abortarPedidoVendaService: ctx.abortarPedidoVendaService
    });
    const retorno = new Retorno();

    try {

      const retornoSalesforce = await this.abortarPedidoVendaService.getPedidoDeVendaAbortados();
      const agoraVai = Object.entries(retornoSalesforce.dados).map((obj) => {
        return {
          chave: obj[0],
          valor: obj[1]
        }
      });

      await parallelExec(
        agoraVai,
        async (pedido, uniqueKey) => {
          try {

            // eslint-disable-next-line no-param-reassign
            uniqueKey = `PED ${pedido.chave}`;

            const pedidoParaEnviar = pedidoVendaDt.transform({
              data: pedido
            });

            console.log(pedidoParaEnviar);


          } catch (err) {
            this.sessionUtil.increaseReport({
              type: 'error',
              data: {
                name: err.message,
                uniqueKey,
              },
            });

            retorno.setRetornoComErro(err.message || err);

            return Logger.log({
              uniqueKey,
              name: 'Falha ao completar esse flow.',
              data: {
                err: err.message || err.response || err
              },
              status: 'ERROR',
              finalLog: true,
            });
          }
        },
        {
          parallelExecutions: ctx.execucoesParalelas || this.execucoesParalelasDefault,
          uniqueKeyPath: 'chave',
          filterDuplicates: true,
          interval: ctx.interval || this.intervaloDefault
        }
      );

      this.sessionUtil.finish({
        status: 'SUCCESS',
      });

      return retorno;

    } catch (err) {
      this.sessionUtil.log({
        status: 'ERROR',
        name: 'Erro inesperado',
        data: err.message || err,
      });

      this.sessionUtil.finish({
        status: 'ERROR',
        error: err.stack || err.message || err
      });

      retorno.setRetornoComErro(err.message || err);

      return { status: 'ERROR' };
    } finally {
      this.sessionUtil.consolidateReport();
    }
  }
}

module.exports = new AbortarPedidoDeVenda();
