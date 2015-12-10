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

var soap = Meteor.npmRequire('soap');
var startDate = '2014-01-10';
var stopDate = '2014-01-12';

var url = 'http://portalquery.just.ro/Query.asmx?wsdl';
var args = {
  institutie: 'CurteadeApelBUCURESTI',
  data_start: startDate,
  data_stop: stopDate
};

soap.createClient(url, function(err, client) {
  client.CautareDosare(args, function(err, result) {
    _.each(result.CautareDosareResult.Dosar, function(data, index) {
      console.log(data);
      Dosare.insert(data);
    });
  });
});
