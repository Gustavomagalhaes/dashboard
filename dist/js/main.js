var app = angular.module('NTIDashboard', ['ngScrollbars']);

            app.controller('dashboardController', function($scope, $http, $timeout) {

                var hostLeadtime = "http://150.161.0.18:9200/otrs.leadtime/_search";
                var hostBoard = "http://150.161.0.18:9200/otrs.chamado/_search";

                var fila_central = "Central de atendimento";
                var fila_aten = "COP - Atendimento";
                var fila_dados = "COP - Atendimento::COP - DBA";
                var fila_manu = "COP - Atendimento::COP - Manutenção";

                var fila_manu_dev = "COP - Atendimento::COP - Manutenção::COP - Desenvolvimento";
                var fila_manu_teste = "COP - Atendimento::COP - Manutenção::COP - Testes";
                var fila_manu_config = "COP - Atendimento::COP - Manutenção::COP - Configuração";

                var triagem = "Em atendimento (triagem)";
                var atendimento = "Em atendimento";
                var pendente = "Pendente";
                var aguardando = "Aguardando resposta";

                $scope.config = {
                    autoHideScrollbar: true,
                    theme: 'minimal',
                    advanced:{
                        updateOnContentResize: true
                    },
                    setHeight: 265,
                    scrollInertia: 800
                }

                $scope.configmini = {
                    autoHideScrollbar: false,
                    theme: 'minimal',
                    advanced:{
                        updateOnContentResize: true
                    },
                    setHeight: 122,
                    scrollInertia: 800
                }

                $scope.getDashboardData = function() {

                    var currentDate = new Date();
                    var mes_fechamento = currentDate.getMonth() + 1;
                    var ano_fechamento = currentDate.getFullYear();

                    var query_atendimento_todo = {
                    "query": {
                        "filtered": {
                            "query": {
                                 "bool": {
                                     "must": [
                                        { "match": { "fila" : fila_aten } },
                                        { "match": { "estado" : triagem } }
                                     ]
                                  }
                            }
                        }
                    },
                    "size": 1000,
                    "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_atendimento_todo).then(function(response) {
                        $scope.chamados_fila_atendimento_todo = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_atendimento_todo = response.data.hits.total;
                    });

                    var query_atendimento_doing = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_aten } }
                                         ]
                                      }
                                },
                                "filter" : {
                                    "or" : [
                                        { "match": { "estado" : atendimento } },
                                        { "match": { "estado" : pendente } },
                                        { "match": { "estado" : aguardando } }
                                    ]
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_atendimento_doing).then(function(response) {
                        $scope.chamados_fila_atendimento_doing = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_atendimento_doing = response.data.hits.total;
                    });

                    var query_dados_todo = {
                        "query": {
                            "filtered": {
                                "query": {
                                    "bool": {
                                        "must": [
                                            { "match": { "fila" : fila_dados } },
                                            { "match": { "estado" : triagem } }
                                        ]
                                    }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_dados_todo).then(function(response) {
                        $scope.chamados_fila_dados_todo = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_dados_todo = response.data.hits.total;
                    });

                    var query_dados_doing = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_dados } }
                                         ]
                                      }
                                },
                                "filter" : {
                                    "or" : [
                                        { "match": { "estado" : atendimento } },
                                        { "match": { "estado" : pendente } },
                                        { "match": { "estado" : aguardando } }
                                    ]
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_dados_doing).then(function(response) {
                        $scope.chamados_fila_dados_doing = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_dados_doing = response.data.hits.total;
                    });

                    var query_manu_externos = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu } },
                                            { "match": { "origem": "externo"} }
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_manu_externos).then(function(response) {
                        $scope.chamados_fila_manu_externos = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_manu_externos = response.data.hits.total;
                    });

                    var query_manu_internos = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu } },
                                            { "match": { "origem": "interno"} }
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_manu_internos).then(function(response) {
                        $scope.chamados_fila_manu_internos = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_manu_internos = response.data.hits.total;
                    });

                    var query_dev_todo = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu_dev } },
                                            { "match": { "estado" : triagem } }
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_dev_todo).then(function(response) {
                        $scope.chamados_fila_dev_todo = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_dev_todo = response.data.hits.total;
                    });

                    var query_dev_doing = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu_dev } }
                                         ]
                                      }
                                },
                                "filter" : {
                                    "or" : [
                                        { "match": { "estado" : atendimento } },
                                        { "match": { "estado" : pendente } },
                                        { "match": { "estado" : aguardando } }
                                    ]
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_dev_doing).then(function(response) {
                        $scope.chamados_fila_dev_doing = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_dev_doing = response.data.hits.total;
                    });

                    var query_dev_done = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu_teste } },
                                            { "match": { "estado" : triagem } }
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_dev_done).then(function(response) {
                        $scope.chamados_fila_dev_done = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_dev_done = response.data.hits.total;
                    });

                    var query_teste_doing = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu_teste } }
                                         ]
                                      }
                                },
                                "filter" : {
                                    "or" : [
                                        { "match": { "estado" : atendimento } },
                                        { "match": { "estado" : pendente } },
                                        { "match": { "estado" : aguardando } }
                                    ]
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_teste_doing).then(function(response) {
                        $scope.chamados_fila_teste_doing = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_teste_doing = response.data.hits.total;
                    });

                    var query_teste_done = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu_config } },
                                            { "match": { "estado" : triagem } }
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_teste_done).then(function(response) {
                        $scope.chamados_fila_teste_done = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_teste_done = response.data.hits.total;
                    });

                    var query_config_doing = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "fila" : fila_manu_config } },
                                            { "match": { "estado" : atendimento } }
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000,
                        "sort": { "prioridade" : { "order" : "cres"}}
                    };
                    $http.post(hostBoard, query_config_doing).then(function(response) {
                        $scope.chamados_fila_config_doing = getFila(response.data.hits.hits);
                        $scope.quantidade_chamados_config_doing = response.data.hits.total;
                    });

                    var leadtime_query = {
                        "query": {
                            "filtered": {
                                "query": {
                                     "bool": {
                                         "must": [
                                            { "match": { "mes_fechamento" : mes_fechamento }},
                                            { "match": { "ano_fechamento" : ano_fechamento }}
                                         ]
                                      }
                                }
                            }
                        },
                        "size": 1000
                    }
                    $http.post(hostLeadtime, leadtime_query).then(function(response) {
                        var myLeadtimeData = response.data;
                        var leadtime_data = myLeadtimeData.hits.hits;
                        var leadtime_len = myLeadtimeData.hits.hits.length;

                        var lista_chamados_atendimento = [];
                        var lista_chamados_dados = [];
                        var lista_chamados_manutencao = [];
                        var lista_teste = [];

                        var contador_geral = 0;
                        var ativo_geral = [];
                        var ocioso_geral = [];

                        var contador_aten = 0;
                        var ativo_aten = [];
                        var ocioso_aten = [];

                        var contador_dados = 0;
                        var ativo_dados = [];
                        var ocioso_dados = [];

                        var contador_manu = 0;
                        var ativo_manu = [];
                        var ocioso_manu = [];

                        for (var i = 0; i < leadtime_len; ++i) {

                            var filas = leadtime_data[i]._source;
                            var fila_len = filas.fila.length;
                            var contador_manu_temp = 0;
                            var contador_geral_temp = 0;

                            for (var j = 0; j < fila_len; ++j) {

                                var ociosoData = getTime(filas.fila[j].ocioso);
                                var ativoData = getTime(filas.fila[j].ativo);

                                if (filas.fila[j].fila.includes(fila_manu)) {
                                    contador_manu_temp++;
                                    contador_geral_temp++;

                                    ativo_manu.push(commit(ativoData));
                                    ocioso_manu.push(commit(ociosoData));

                                    ativo_geral.push(commit(ativoData));
                                    ocioso_geral.push(commit(ociosoData));

                                    if (lista_chamados_manutencao.indexOf(filas.id) === -1) {
                                        var chamado = { "match": {"_id": filas.id} };
                                        lista_chamados_manutencao.push(chamado);
                                    }

                                } else if (filas.fila[j].fila.includes(fila_dados)) {
                                    contador_dados++;
                                    contador_geral_temp++;

                                    ativo_dados.push(commit(ativoData));
                                    ocioso_dados.push(commit(ociosoData));

                                    ativo_geral.push(commit(ativoData));
                                    ocioso_geral.push(commit(ociosoData));

                                    if (lista_chamados_dados.indexOf(filas.id) === -1) {
                                        var chamado = { "match": {"_id": filas.id} };
                                        lista_chamados_dados.push(chamado);

                                    }

                                } else if (filas.fila[j].fila == fila_aten) {
                                    contador_aten++;
                                    contador_geral_temp++;

                                    ativo_aten.push(commit(ativoData));
                                    ocioso_aten.push(commit(ociosoData));

                                    ativo_geral.push(commit(ativoData));
                                    ocioso_geral.push(commit(ociosoData));

                                    if (lista_chamados_atendimento.indexOf(filas.id) === -1) {
                                        var chamado = { "match": {"_id": filas.id} };
                                        lista_chamados_atendimento.push(chamado);

                                    }
                                }
                            }

                            if (contador_manu_temp > 0) {
                                contador_manu++;
                            }

                            if (contador_geral_temp > 0) {
                                contador_geral++;
                            }
                        }


                        $scope.leadtime = packData(contador_geral, ocioso_geral, ativo_geral);
                        $scope.aten = packData(contador_aten, ocioso_aten, ativo_aten);
                        $scope.dados = packData(contador_dados, ocioso_dados, ativo_dados);
                        $scope.manu = packData(contador_manu, ocioso_manu, ativo_manu);

                        var leadtime_atendimento_query = {
                            "query": {
                                "bool": {
                                    "should": lista_chamados_atendimento
                                }
                            },
                            "size": lista_chamados_atendimento.length,
                            "sort": { "prioridade" : { "order" : "cres"}}
                        }
                        $http.post(hostBoard, leadtime_atendimento_query).then(function(response) {
                            var data = response.data.hits.hits;
                            $scope.lista_chamados_leadtime_atendimento = getFila(data);
                        });

                        var leadtime_dados_query = {
                            "query": {
                                "bool": {
                                    "should": lista_chamados_dados
                                }
                            },
                            "size": lista_chamados_dados.length,
                            "sort": { "prioridade" : { "order" : "cres"}}
                        }
                        $http.post(hostBoard, leadtime_dados_query).then(function(response) {
                            var data = response.data.hits.hits;
                            $scope.lista_chamados_leadtime_dados = getFila(data);
                        });

                        var leadtime_manutencao_query = {
                            "query": {
                                "bool": {
                                    "should": lista_chamados_manutencao
                                }
                            },
                            "size": lista_chamados_manutencao.length,
                            "sort": { "prioridade" : { "order" : "cres"}}
                        }
                        $http.post(hostBoard, leadtime_manutencao_query).then(function(response) {
                            var data = response.data.hits.hits;
                            $scope.lista_chamados_leadtime_manutencao = getFila(data);
                        });

                    });

                };

                $scope.intervalFunction = function(){
                    $timeout(function() {
                        console.clear();
                        $scope.getDashboardData();
                        $scope.intervalFunction();
                    }, 1000)
                };
                $scope.getDashboardData();
                $scope.intervalFunction();

            });

            function commit(data) {
                return {dias: data[0],horas: data[1],minutos: data[2],segundos: data[3]};
            }

            function packData(contador, ocioso_temp, ativo_temp) {

                var ativo = getMedian(totalTime(ativo_temp), contador);
                var ocioso = getMedian(totalTime(ocioso_temp), contador);
                var total = totalTime([ativo,ocioso]);

                var result = {
                    total: contador,
                    geral: {
                        dias: total.dias,
                        horas: total.horas,
                        minutos: total.minutos,
                        segundos: total.segundos,
                    },
                    ocioso: {
                        dias: ocioso.dias,
                        horas: ocioso.horas,
                        minutos: ocioso.minutos,
                        segundos: ocioso.segundos,
                        porcentagem: porcentagem(total,ocioso)
                    },
                    ativo: {
                        dias: ativo.dias,
                        horas: ativo.horas,
                        minutos: ativo.minutos,
                        segundos: ativo.segundos,
                        porcentagem: porcentagem(total,ativo)
                    }
                };
                return result;
            }

            function getTime(data) {
                var result = fixData(data);
                return result;
            }

            function fixData(data) {
                var arg0, arg1, result;

                if (data.includes("days")) {
                    arg0 = data.split(" ");
                    arg1 = arg0[2].split(":");
                    result = [parseInt(arg0[0]), parseInt(arg1[0]), parseInt(arg1[1]), parseInt(arg1[2])];
                } else {
                    arg1 = data.split(":");
                    result = [0, parseInt(arg1[0]), parseInt(arg1[1]), parseInt(arg1[2])];
                }
                return result;
            };

            function totalTime(list) {
                var result = [];
                var dias = 0, horas = 0, minutos = 0, segundos = 0;

                for (var i = 0; i < list.length; ++i) {
                    dias += list[i].dias;
                    horas += list[i].horas;
                    minutos += list[i].minutos;
                    segundos += list[i].segundos;
                }

                while (segundos > 59) {
                    segundos-=60;
                    minutos++;
                }

                while (minutos > 59) {
                    minutos-=60;
                    horas++;
                }

                while (horas > 23) {
                    horas-=24;
                    dias++;
                }

                result = {
                    dias: dias,
                    horas: horas,
                    minutos: minutos,
                    segundos: segundos
                };
                return result;
            }

            function getMedian(list, len) {
                var result = [];
                var dias = 0, horas = 0, minutos = 0, segundos = 0;

                var seconds = Math.trunc(getSeconds(list)/len);

                var dias = Math.trunc(seconds/86400);
                seconds-=(86400*dias);

                var horas = Math.trunc(seconds/3600);
                seconds-=(3600*horas);

                var minutos = Math.trunc(seconds/60);
                seconds-=(60*minutos);

                var segundos = Math.trunc(seconds);

                result = {
                    dias: dias,
                    horas: horas,
                    minutos: minutos,
                    segundos: segundos
                };
                return result;
            }

            function getNumero(numero) { return numero.slice(-5); }

            function getPrioridade(prioridade) { return prioridade.split(" ").pop(); }

            function getFila(response) {
                var result = [];

                for (var i = 0; i < response.length; ++i){
                    var chamado = {
                        numero: getNumero(response[i]._source.numero),
                        prioridade: getPrioridade(response[i]._source.prioridade),
                        titulo: response[i]._source.titulo,
                        url: "http://otrs.ufpe.br/otrs/index.pl?Action=AgentTicketZoom;TicketID=" + response[i]._source.ticketid,
                        dono: response[i]._source.nome_proprietario,
                        estado: response[i]._source.estado
                    }
                    result.push(chamado);
                };

                return result;
            }

            function porcentagem(listTotal, list) {
                var result = (100*getSeconds(list))/getSeconds(listTotal);
                result = Math.round(result);
                return result;
            }

            function getSeconds(list) {
                var dias = list.dias*86400,
                    horas = list.horas*3600,
                    minutos = list.minutos*60,
                    segundos = list.segundos;

                var result = dias+horas+minutos+segundos;

                return result;
            }

