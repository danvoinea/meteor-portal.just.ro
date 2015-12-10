/*

Instante = new Meteor.Collection('instante');

Meteor.startup(function() {
  if (Instante.find().count() === 0) {
    var parse = Meteor.npmRequire('csv-parse');
    var instante = Assets.getText('instante-2013.csv');

    parse(instante, Meteor.bindEnvironment(function(err, data) {
      _.each(data, function(value, index) {
        Instante.insert({
          "denumire": value[0],
          "codInformatic": value[1]
        });
      });
    }));

  }
});

*/

Dosare = new Meteor.Collection('dosare');

var url = 'http://portalquery.just.ro/Query.asmx?wsdl';

var args = {
  institutie: 'CurteadeApelBUCURESTI',
  data_start: '2014-01-10',
  data_stop: '2014-01-12'
};

var args2 = {
  institutie: 'CurteadeApelBUCURESTI',
  data_start: '2014-01-10',
  data_stop: '2014-01-12'
};

var soap = Meteor.npmRequire('soap');

var data = Async.runSync(function(done) {
  soap.createClient(url, function(err, client) {
    client.CautareDosare(args, done);
  });
});

_.each(data.result.CautareDosareResult.Dosar, function(data, index) {
  console.log(data);
  Dosare.insert(data);
});
